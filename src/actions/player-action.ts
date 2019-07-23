import { Dispatch } from 'redux'
import { filter } from 'lodash'
import * as Bows from 'bows'
import { AbilityItem, ConsumableItem } from 'src/data'
import { StoreAction, StoreState } from 'src/store/interface'
import { AbilityHelper, BattleHelper, PlayerHelper, CharacterHelper } from 'src/helpers'
import { TraceAction } from './trace-action'
import { PlayerState } from 'src/reducers'
import { playerConstants } from './constants'

const log = Bows('PlayerAction')

export class PlayerAction {
  static toggleAbility(ability: AbilityItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      log('toggleAbility triggered.')

      // State properties
      const state: StoreState = getState()

      let modifiedActiveAbilities: string[] = state.player.activeAbilities || []
      if (AbilityHelper.isActivated(state.player, ability.key)) {
        modifiedActiveAbilities = filter(modifiedActiveAbilities, (key) => key !== ability.key)
        await dispatch(TraceAction.appendLog(`Disabled <strong>${ability.name}</strong> ability.`))
      } else {
        modifiedActiveAbilities.push(ability.key)
        await dispatch(TraceAction.appendLog(`Enabled <strong>${ability.name}</strong> ability.`))
      }

      const payload: PlayerState = { activeAbilities: modifiedActiveAbilities }
      dispatch({ type: playerConstants.UPDATE, payload })
    }
  }

  static useConsumable(consumable: ConsumableItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      log('toggleAbility triggered.')

      // State properties
      const state: StoreState = getState()

      const inventoryItem = PlayerHelper.getInventoryItem(state.player.inventoryItems!, consumable.key)
      if (!inventoryItem) {
        // Don't have such item in inventory
        return
      }

      if (BattleHelper.isEngaging(state.battle)) {
        await dispatch(TraceAction.appendLog(`Cannot use <strong>${consumable.name}</strong> during a battle.`))
        return
      }

      // Act
      const payload: PlayerState = {}
      if (consumable.key === 'potion') {
        const HEAL_VALUE = 30
        payload.character = CharacterHelper.applyHeal(state.player.character!, HEAL_VALUE)
        payload.inventoryItems = PlayerHelper.consumeItem(state.player.inventoryItems!, consumable.key)
      }

      await dispatch(TraceAction.appendLog(`You used <strong>${consumable.name}</strong>.`))
      await dispatch({ type: playerConstants.UPDATE, payload })
    }
  }

  static disableAllAbilities(): StoreAction {
    const payload: PlayerState = { activeAbilities: [] }
    return { type: playerConstants.UPDATE, payload }
  }
}
