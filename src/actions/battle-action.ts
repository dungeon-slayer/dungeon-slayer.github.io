import { Dispatch } from 'redux'
import { cloneDeep, sortBy } from 'lodash'
import * as Bows from 'bows'
import { StoreAction, StoreState } from 'src/store/interface'
import { CharacterItem } from 'src/common/interfaces'
import { battleConstants, playerConstants } from './constants'
import { BattleState, PlayerState } from 'src/reducers'
import { BattleHelper, PlayerHelper, AbilityHelper, CharacterHelper } from 'src/helpers'
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
        await dispatch(TraceAction.appendLog(`You are already in the middle of a battle.`))
        return
      }

      if (state.player.character!.currentHp <= 0) {
        await dispatch(TraceAction.appendLog(`You do not have enough HP to start a battle.`))
        return
      }

      // -- Battle State
      targetMob.nextTurnTs = BattleHelper.getNextTurnTimestamp(targetMob, state.game)
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
      mutatedPlayerCharacter.nextTurnTs = BattleHelper.getNextTurnTimestamp(mutatedPlayerCharacter, state.game)
      const playerPayload: PlayerState = {
        character: mutatedPlayerCharacter,
      }
      await dispatch({
        type: playerConstants.UPDATE,
        payload: playerPayload,
      })

      await dispatch(TraceAction.appendLog(`You now engaging in a battle with <strong>${MobHelper.getMobNameByKey(mob.key)}</strong> (Lvl ${mob.currentLevel}).`))
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

  private static async dispatchCharacterAction(dispatch: Dispatch<StoreAction>, state: StoreState, attackCharacter: CharacterItem): Promise<void> {
    const defendCharacter = BattleAction.getDefendCharacter(state, attackCharacter)
    const damageDealt = BattleHelper.getDamageValue(attackCharacter, defendCharacter)
    defendCharacter.currentHp = CharacterHelper.updateHpValue(defendCharacter.currentHp, damageDealt)
    attackCharacter.nextTurnTs = BattleHelper.getNextTurnTimestamp(attackCharacter, state.game)

    await BattleAction.dispatchAppendAttackLog(dispatch, attackCharacter, defendCharacter, damageDealt)
    await BattleAction.dispatchUpdateCharacter(dispatch, defendCharacter)
    await BattleAction.dispatchUpdateCharacter(dispatch, attackCharacter)

    // Check if defender is defeated
    if (defendCharacter.currentHp <= 0) {
      await BattleAction.dispatchDefeatCharacter(dispatch, defendCharacter)

      // Experience and level up mechanic
      if (attackCharacter.key === 'player') {
        attackCharacter.currentExp += defendCharacter.rewardExp
        await dispatch(TraceAction.appendLog(`You won the battle against <strong>${MobHelper.getMobNameByKey(defendCharacter.key)}</strong>, gained <strong>${defendCharacter.rewardExp}</strong> experience.`))
        await BattleAction.dispatchUpdateCharacter(dispatch, attackCharacter)

        if (attackCharacter.currentExp >= PlayerHelper.getExpRequiredToLevelUp(attackCharacter.currentLevel)) {
          await dispatch(TraceAction.appendLog(`You have now reached level ${attackCharacter.currentLevel + 1}.`))
          await dispatch({ type: playerConstants.LEVEL_UP })
        }
      }
    }
  }

  private static async dispatchAppendAttackLog(dispatch: Dispatch<StoreAction>, attacker: CharacterItem, defender: CharacterItem, damageDealt: number): Promise<void> {
    if (attacker.key === 'player') {
      await dispatch(TraceAction.appendLog(`You dealt <strong>${damageDealt.toLocaleString()}</strong> damage to <strong>${MobHelper.getMobNameByKey(defender.key)}</strong>.`))
    } else {
      await dispatch(TraceAction.appendLog(`<strong>${MobHelper.getMobNameByKey(attacker.key)}</strong> dealt <strong>${damageDealt.toLocaleString()}</strong> damage to you.`))
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

  private static async dispatchDefeatCharacter(dispatch: Dispatch<StoreAction>, character: CharacterItem): Promise<void> {
    if (character.key === 'player') {
      await dispatch({ type: battleConstants.CLOSURE })
      await dispatch(PlayerAction.disableAllAbilities())
      await dispatch(TraceAction.appendLog(`You have been defeated.`))
    } else {
      await dispatch({ type: battleConstants.CLOSURE })
      await dispatch(GameAction.removeMob(character.id))
    }
  }
}
