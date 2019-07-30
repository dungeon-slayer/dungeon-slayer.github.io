import { Dispatch } from 'redux'
import { cloneDeep, sortBy } from 'lodash'
import * as Bows from 'bows'
import { StoreAction, StoreState } from 'src/store/interface'
import { CharacterItem } from 'src/common/interfaces'
import { battleConstants, playerConstants } from './constants'
import { BattleState, PlayerState } from 'src/reducers'
import { BattleHelper, PlayerHelper, AbilityHelper, CharacterHelper, RandomHelper, DropHelper } from 'src/helpers'
import { TraceAction } from './trace-action'
import { GameAction } from './game-action'
import { PlayerAction } from './player-action'
import { MobHelper } from '../helpers/mob-helper'

const log = Bows('BattleAction')

export class BattleAction {
  static engageBattle(mob: CharacterItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      log('engageBattle triggered.')
      const targetMob = cloneDeep(mob)

      // State properties
      const state: StoreState = getState()

      if (BattleHelper.isEngaging(state.battle)) {
        await dispatch(TraceAction.appendBattleLog(`You are already in the middle of a battle.`))
        return
      }

      if (state.player.character!.currentHp <= 0) {
        await dispatch(TraceAction.appendBattleLog(`You do not have enough HP to start a battle.`))
        return
      }

      // -- Battle State
      targetMob.nextTurnTs = CharacterHelper.getNextTurnTimestamp(targetMob, state.game)
      const payload: BattleState = {
        targetMob,
        startAt: Date.now(),
      }
      await dispatch({
        type: battleConstants.UPDATE,
        payload,
      })

      // -- Player State
      const mutatedPlayerCharacter = cloneDeep(state.player.character)!
      mutatedPlayerCharacter.nextTurnTs = undefined // Hard reset next turn info from previous battle
      mutatedPlayerCharacter.nextTurnTs = CharacterHelper.getNextTurnTimestamp(mutatedPlayerCharacter, state.game)
      const playerPayload: PlayerState = {
        character: mutatedPlayerCharacter,
      }
      await dispatch({
        type: playerConstants.UPDATE,
        payload: playerPayload,
      })

      await dispatch(TraceAction.appendBattleLog(`You now engaging in a battle with <strong>${MobHelper.getMobNameByKey(mob.key)}</strong> (Lvl ${mob.currentLevel}).`))
    }
  }

  static performAutoBattle(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      if (!AbilityHelper.isActivated(state.player, 'auto-battle')) {
        // log('Auto battle is not enabled.')
        return
      }

      if (BattleHelper.isEngaging(state.battle)) {
        // log('Already engaged in a battle currently. Postpone.')
        return
      }

      if (!state.game.mobs || state.game.mobs.length === 0) {
        // log('No mobs available. Postpone.')
        return
      }

      if (state.player.character!.currentHp <= 0) {
        // log('Player does not have enough HP to engage in battle. Postpone.')
        return
      }

      // Pick a mob
      const mob = state.game.mobs[0]
      await dispatch(BattleAction.engageBattle(mob))
    }
  }

  static performBattle(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      if (!state.game.isGameRunning) {
        // log('Game is currently paused. Postpone.')
        return
      }

      if (!BattleHelper.isEngaging(state.battle)) {
        // log('Not in a battle currently. Postpone.')
        return
      }

      const charactersToAct: CharacterItem[] = BattleAction.getCharactersToAct(state)
      for (const actionCharacter of charactersToAct) {
        // Ensure that the character is still alive
        if (actionCharacter.currentHp > 0) {
          await BattleAction.dispatchCharacterAction(dispatch, state, actionCharacter)
        }
      }
    }
  }

  private static getCharactersToAct(state: StoreState): CharacterItem[] {
    const charactersToAct: CharacterItem[] = []
    if (CharacterHelper.isCharacterTurn(state.player.character!)) {
      charactersToAct.push(state.player.character!)
    }
    if (CharacterHelper.isCharacterTurn(state.battle.targetMob!)) {
      charactersToAct.push(state.battle.targetMob!)
    }

    // Sort
    const sortedCharactersToAct = sortBy(charactersToAct, (char) => char.nextTurnTs)

    return sortedCharactersToAct
  }

  private static getDefendCharacter(state: StoreState, attackCharacter: CharacterItem): CharacterItem {
    if (attackCharacter.key === 'player') {
      return state.battle.targetMob!
    } else {
      return state.player.character!
    }
  }

  private static async dispatchCharacterAction(dispatch: Dispatch<StoreAction>, state: StoreState, attacker: CharacterItem): Promise<void> {
    const defender = BattleAction.getDefendCharacter(state, attacker)
    const damageDealt = BattleHelper.getDamageValue(attacker, defender)
    defender.currentHp = CharacterHelper.updateHpValue(defender.currentHp, damageDealt)
    attacker.nextTurnTs = CharacterHelper.getNextTurnTimestamp(attacker, state.game)

    await BattleAction.dispatchAppendAttackLog(dispatch, attacker, defender, damageDealt)
    await BattleAction.dispatchUpdateCharacter(dispatch, defender)
    await BattleAction.dispatchUpdateCharacter(dispatch, attacker)

    // Check if defender is defeated
    if (defender.currentHp <= 0) {
      await BattleAction.dispatchDefeatCharacter(dispatch, attacker, defender)
    }
  }

  private static async dispatchAppendAttackLog(dispatch: Dispatch<StoreAction>, attacker: CharacterItem, defender: CharacterItem, damageDealt: number): Promise<void> {
    if (attacker.key === 'player') {
      await dispatch(TraceAction.appendBattleLog(`You dealt <strong>${damageDealt.toLocaleString()}</strong> damage to <strong>${MobHelper.getMobNameByKey(defender.key)}</strong>.`))
    } else {
      await dispatch(TraceAction.appendBattleLog(`<strong>${MobHelper.getMobNameByKey(attacker.key)}</strong> dealt <strong>${damageDealt.toLocaleString()}</strong> damage to you.`))
    }
  }

  private static async dispatchUpdateCharacter(dispatch: Dispatch<StoreAction>, character: CharacterItem): Promise<void> {
    if (character.key === 'player') {
      const playerPayload: PlayerState = { character }
      await dispatch({ type: playerConstants.UPDATE, payload: playerPayload })
    } else {
      const battlePayload: BattleState = { targetMob: character }
      await dispatch({ type: battleConstants.UPDATE, payload: battlePayload })
    }
  }

  private static async dispatchDefeatCharacter(dispatch: Dispatch<StoreAction>, attacker: CharacterItem, defender: CharacterItem): Promise<void> {
    if (defender.key === 'player') {
      await dispatch(TraceAction.appendBattleLog(`You have been defeated. All your abilities have now deactivated.`))
      // TODO: log loss
      await dispatch(PlayerAction.disableAllAbilities())
      await dispatch({ type: battleConstants.CLOSURE })
    } else {
      // Gain experience
      attacker.currentExp += defender.rewardExp
      await dispatch(TraceAction.appendBattleLog(`You won the battle against <strong>${MobHelper.getMobNameByKey(defender.key)}</strong>, gained <strong>${defender.rewardExp.toLocaleString()}</strong> experience.`))
      await dispatch(PlayerAction.trackAWin(defender))
      await BattleAction.dispatchUpdateCharacter(dispatch, attacker)

      // Item drops
      await BattleAction.dispatchMobDrops(dispatch, defender)

      // Level up
      if (attacker.currentExp >= PlayerHelper.getExpRequiredToLevelUp(attacker.currentLevel)) {
        const newLevel = attacker.currentLevel + 1
        await dispatch(TraceAction.appendLog(`You have now reached level <strong>${newLevel}</strong>.`))
        await dispatch(TraceAction.loreByLevelUp(newLevel))
        await dispatch({ type: playerConstants.LEVEL_UP })
      }

      await dispatch({ type: battleConstants.CLOSURE })
      await dispatch(GameAction.removeMob(defender.id))
    }
  }

  private static async dispatchMobDrops(dispatch: Dispatch<StoreAction>, mob: CharacterItem): Promise<void> {
    const mobTemplate = MobHelper.getMobTemplateByKey(mob.key)
    if (!mobTemplate) {
      return
    }

    for (const dropRate of mobTemplate.dropRates) {
      if (RandomHelper.rollDice(dropRate.dropRate)) {
        const dropItem = DropHelper.getItemByKey(dropRate.dropKey)!
        await dispatch(PlayerAction.obtainDrop(dropItem))
      }
    }
  }
}
