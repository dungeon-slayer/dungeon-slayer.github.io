import { Dispatch } from 'redux'
import { filter, find, cloneDeep, concat } from 'lodash'
import * as Bows from 'bows'
import { AbilityItem, LoreItem } from 'src/data'
import { StoreAction, StoreState } from 'src/store/interface'
import { AbilityHelper, BattleHelper, PlayerHelper, CharacterHelper, LoreHelper, PossessionHelper } from 'src/helpers'
import { TraceAction } from './trace-action'
import { PlayerState } from 'src/reducers'
import { playerConstants } from './constants'
import { CharacterItem, ActiveAbilityItem, PossessionItem } from 'src/common/interfaces'
import { GameAction } from './game-action'

const log = Bows('PlayerAction')

export class PlayerAction {
  static trackAWin(mob: CharacterItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      const payload: PlayerState = {
        mobKillStats: state.player.mobKillStats || [],
      }

      const targetMobKillItem = find(payload.mobKillStats!, (mk) => mk.key === mob.key)
      if (targetMobKillItem) {
        targetMobKillItem.quantity += 1
      } else {
        payload.mobKillStats!.push({ key: mob.key, quantity: 1 })
      }

      dispatch({ type: playerConstants.UPDATE, payload })
    }
  }

  static trackConsumption(possession: PossessionItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      const payload: PlayerState = {
        itemUsedStats: state.player.itemUsedStats || [],
      }

      const targetUsedItem = find(payload.itemUsedStats!, (iu) => iu.key === possession.key)
      if (targetUsedItem) {
        targetUsedItem.quantity += 1
      } else {
        payload.itemUsedStats!.push({ key: possession.key, quantity: 1 })
      }

      dispatch({ type: playerConstants.UPDATE, payload })
    }
  }

  static toggleAutoBattle(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      const currentAutoBattleEnabled = state.player.autoBattleEnabled!
      const newAutoBattleEnabled = !currentAutoBattleEnabled

      const payload: PlayerState = {
        autoBattleEnabled: newAutoBattleEnabled,
      }
      dispatch({ type: playerConstants.UPDATE, payload })
    }
  }

  static setAutoBattle(isActive: boolean): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      if (state.player.autoBattleEnabled === isActive) {
        return
      }

      const payload: PlayerState = {
        autoBattleEnabled: isActive,
      }
      dispatch({ type: playerConstants.UPDATE, payload })
    }
  }

  static toggleAbility(ability: AbilityItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      log('toggleAbility triggered.')

      // State properties
      const state: StoreState = getState()

      let modifiedActiveAbilities: ActiveAbilityItem[] = state.player.character!.activeAbilities || []

      const aaItem = PlayerHelper.getAvailableAbilityItemByAbilityKey(state.player, ability.key)!
      const abilityName = AbilityHelper.getFullName(ability, aaItem.level)

      if (AbilityHelper.isActivated(state.player, ability.key)) {
        modifiedActiveAbilities = filter(modifiedActiveAbilities, (item) => item.key !== ability.key)
        await dispatch(TraceAction.addLog(`Disabled <strong>${abilityName}</strong> ability.`))
      } else {
        // Check if there's enough AP points
        const availableAP = PlayerHelper.getAvailableAbilityPoint(state.player)
        const requiredApCost = AbilityHelper.getApCost(ability, aaItem.level)
        if (availableAP < requiredApCost) {
          await dispatch(TraceAction.addLog(`You don't have enough AP to activate this ability.`))
          return
        }

        modifiedActiveAbilities.push({ key: ability.key, level: aaItem.level })
        await dispatch(TraceAction.addLog(`Enabled <strong>${abilityName}</strong> ability.`))
      }

      const payload: PlayerState = {
        character: {
          ...state.player.character!,
          activeAbilities: modifiedActiveAbilities,
        },
      }
      dispatch({ type: playerConstants.UPDATE, payload })
    }
  }

  static usePossession(possession: PossessionItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      const availablePossession = PlayerHelper.getAvailableItemByKey(state.player.availablePossessions!, possession.key)
      if (!availablePossession) {
        // Don't have such item in inventory
        return
      }

      if (BattleHelper.isEngaging(state.battle)) {
        await dispatch(TraceAction.addConsumelLog(`Cannot use <strong>${possession.name}</strong> during a battle.`))
        return
      }

      // Check if can use in this location
      if (!PossessionHelper.canConsume(possession, state.game.currentLocation!)) {
        await dispatch(TraceAction.addConsumelLog(`You may not use <strong>${possession.name}</strong> at current location.`))
        return
      }

      // Act
      const payload: PlayerState = {}
      payload.character = CharacterHelper.updateEffect(state.player.character!, possession.effect)

      payload.availablePossessions = PlayerHelper.reducerAvailableItem(state.player.availablePossessions!, possession.key)
      await dispatch(TraceAction.addConsumelLog(`You used <strong>${possession.name}</strong>.`))
      await PlayerAction.dispatchSpecialLog(dispatch, state, possession)
      await PlayerAction.dispatchUseConsumable(dispatch, state, possession)

      // In case of special actions
      await dispatch(GameAction.appendSummonMob(possession))
    }
  }

  static async dispatchUseConsumable(dispatch: Dispatch<StoreAction>, state: StoreState, possession: PossessionItem): Promise<void> {
    const payload: PlayerState = {}
    payload.character = CharacterHelper.updateEffect(state.player.character!, possession.effect)
    payload.availablePossessions = PlayerHelper.reducerAvailableItem(state.player.availablePossessions!, possession.key)
    await dispatch(PlayerAction.trackConsumption(possession))
    await dispatch({ type: playerConstants.UPDATE, payload })
  }

  static obtainPossessions(possessions: PossessionItem[]): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('obtainDrop triggered.')

      // Business logic validation
      if (possessions.length <= 0) {
        return
      }

      // State properties
      const state: StoreState = getState()

      const payload: PlayerState = {
        availablePossessions: cloneDeep(state.player.availablePossessions),
      }

      let targetLores: LoreItem[] = []

      for (const drop of possessions) {
        // Update inventory
        const matchedAvailablePossession = find(payload.availablePossessions!, (item) => item.key === drop.key)
        if (matchedAvailablePossession) {
          matchedAvailablePossession.quantity += 1
        } else {
          payload.availablePossessions!.push({ key: drop.key, quantity: 1 })
        }

        // Check for available drop lores
        if (!PlayerHelper.hasPossessionItem(state.player, drop.key)) {
          targetLores = concat(targetLores, LoreHelper.getDropLoresByKey(drop.key))
        }
      }

      // Dispatches
      await dispatch(TraceAction.addObtainDropsLog(possessions))
      await dispatch({ type: playerConstants.UPDATE, payload })
      for (const targetLore of targetLores) {
        await dispatch(TraceAction.addLoreLog(targetLore.message))
      }
    }
  }

  // static disableAllAbilities(): any {
  //   return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
  //     // State properties
  //     const state: StoreState = getState()

  //     const payload: PlayerState = {
  //       character: {
  //         ...state.player.character!,
  //         activeAbilities: [],
  //       },
  //     }
  //     dispatch({ type: playerConstants.UPDATE, payload })
  //   }
  // }

  private static async dispatchSpecialLog(dispatch: Dispatch<StoreAction>, state: StoreState, possession: PossessionItem): Promise<void> {
    if (possession.key === 'horn-kolift') {
      await dispatch(TraceAction.addLoreLog(LoreHelper.getCustomLoreMessageByKey('CALL_KOLIFT')))
    }
  }
}
