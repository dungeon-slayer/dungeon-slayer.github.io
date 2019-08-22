import { Dispatch } from 'redux'
import { filter, find, cloneDeep, concat } from 'lodash'
import * as Bows from 'bows'
import { AbilityItem, ConsumableItem, DropItem, LoreItem } from 'src/data'
import { StoreAction, StoreState } from 'src/store/interface'
import { AbilityHelper, BattleHelper, PlayerHelper, CharacterHelper, ConsumableHelper, LoreHelper } from 'src/helpers'
import { TraceAction } from './trace-action'
import { PlayerState } from 'src/reducers'
import { playerConstants } from './constants'
import { CharacterItem, ActiveAbilityItem } from 'src/common/interfaces'
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

  static trackConsumption(consumable: ConsumableItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      const payload: PlayerState = {
        itemUsedStats: state.player.itemUsedStats || [],
      }

      const targetUsedItem = find(payload.itemUsedStats!, (iu) => iu.key === consumable.key)
      if (targetUsedItem) {
        targetUsedItem.quantity += 1
      } else {
        payload.itemUsedStats!.push({ key: consumable.key, quantity: 1 })
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

  static useConsumable(consumable: ConsumableItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('useConsumable triggered.')

      // State properties
      const state: StoreState = getState()

      const availableConsumable = PlayerHelper.getAvailableItemByKey(state.player.availableConsumables!, consumable.key)
      if (!availableConsumable) {
        // Don't have such item in inventory
        return
      }

      if (BattleHelper.isEngaging(state.battle)) {
        await dispatch(TraceAction.addConsumelLog(`Cannot use <strong>${consumable.name}</strong> during a battle.`))
        return
      }

      // Check if can use in this location
      if (!ConsumableHelper.canConsume(consumable, state.game.currentLocation!)) {
        await dispatch(TraceAction.addConsumelLog(`You may not use <strong>${consumable.name}</strong> at current location.`))
        return
      }

      // Act
      const payload: PlayerState = {}
      payload.character = CharacterHelper.updateConsumableEffect(state.player.character!, consumable.effect)

      payload.availableConsumables = PlayerHelper.reducerAvailableItem(state.player.availableConsumables!, consumable.key)
      await dispatch(TraceAction.addConsumelLog(`You used <strong>${consumable.name}</strong>.`))
      await PlayerAction.dispatchSpecialLog(dispatch, state, consumable)
      await dispatch(PlayerAction.trackConsumption(consumable))
      await dispatch({ type: playerConstants.UPDATE, payload })

      // In case of special actions
      await dispatch(GameAction.appendSummonMob(consumable))
    }
  }

  static obtainDrop(drops: DropItem[]): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('obtainDrop triggered.')

      // Business logic validation
      if (drops.length <= 0) {
        return
      }

      // State properties
      const state: StoreState = getState()

      const payload: PlayerState = {
        availableDrops: cloneDeep(state.player.availableDrops),
      }

      let targetLores: LoreItem[] = []

      for (const drop of drops) {
        // Update inventory
        const matchedAvailableDrop = find(payload.availableDrops!, (item) => item.key === drop.key)
        if (matchedAvailableDrop) {
          matchedAvailableDrop.quantity += 1
        } else {
          payload.availableDrops!.push({ key: drop.key, quantity: 1 })
        }

        // Check for available drop lores
        if (!PlayerHelper.hasDropItem(state.player, drop.key)) {
          targetLores = concat(targetLores, LoreHelper.getDropLoresByKey(drop.key))
        }
      }

      // Dispatches
      await dispatch(TraceAction.addObtainDropsLog(drops))
      await dispatch({ type: playerConstants.UPDATE, payload })
      for (const targetLore of targetLores) {
        await dispatch(TraceAction.addLoreLog(targetLore.message))
      }
    }
  }

  static disableAllAbilities(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      const payload: PlayerState = {
        character: {
          ...state.player.character!,
          activeAbilities: [],
        },
      }
      dispatch({ type: playerConstants.UPDATE, payload })
    }
  }

  private static async dispatchSpecialLog(dispatch: Dispatch<StoreAction>, state: StoreState, consumable: ConsumableItem): Promise<void> {
    if (consumable.key === 'horn-kolift') {
      await dispatch(TraceAction.addLoreLog(LoreHelper.getCustomLoreMessageByKey('CALL_KOLIFT')))
    }
  }
}
