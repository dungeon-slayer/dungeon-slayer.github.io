import { Dispatch } from 'redux'
import { filter, find, cloneDeep } from 'lodash'
import * as Bows from 'bows'
import { gameConstants } from './constants/game'
import { StoreAction, StoreState } from 'src/store/interface'
import { GameState } from 'src/reducers'
import { MobHelper, PlayerHelper, LocationHelper, BattleHelper, PriceMultiplierHelper, GameHelper } from 'src/helpers'
import { CharacterItem, QuestItem } from 'src/common/interfaces'
import { LocationItem, DropItem, ConsumableItem } from 'src/data'
import { TraceAction } from './trace-action'
import { EnvironmentDelegate } from 'src/delegates'
import { playerConstants } from './constants'

const log = Bows('GameAction')

export class GameAction {
  static appendRandomMob(): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      if (!state.game.isGameRunning) {
        // log('Game is currently paused. Postpone.')
        return
      }

      if (state.game.mobs!.length >= PlayerHelper.getMobQueueSize(state.player.character!.currentLevel)) {
        // log('Mob queue size limit reached. Postpone.')
        return
      }

      if (state.game.nextMobGenerateTs && state.game.nextMobGenerateTs > Date.now()) {
        // Not ready to generate yet
        return
      }

      if (!LocationHelper.hasDungeonByKey(state.game.currentLocation)) {
        // Not in a dungeon
        return
      }

      const location = LocationHelper.getItemByKey(state.game.currentLocation)!

      dispatch({
        type: gameConstants.APPEND_MOB,
        payload: {
          mob: MobHelper.getRandomMob(location),
          nextMobGenerateTs: GameHelper.getNextMobGenerateTimestamp(state.game, EnvironmentDelegate.MobGenerateIntervalMs),
        },
      })
    }
  }

  static appendSummonMob(consumable: ConsumableItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('appendSummonMob triggered. consumable:', consumable)

      // // State properties
      const state: StoreState = getState()

      let mob: CharacterItem

      if (consumable.key === 'horn-kolift') {
        const mobTemplate = MobHelper.getMobTemplateByKey('kolift')!
        mob = MobHelper.createMob(mobTemplate, state.player.character!.currentLevel)
        log('mob:', mob)
      } else {
        // No action required
        return
      }

      dispatch({
        type: gameConstants.APPEND_MOB,
        payload: { mob },
      })
    }
  }

  static removeMob(mobId: string): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()
      const existingMobs = state.game.mobs

      let newMobs: CharacterItem[] = []
      if (existingMobs) {
        newMobs = filter(existingMobs, (mob) => mob.id !== mobId)
      }

      const payload: GameState = {
        mobs: newMobs,
      }

      dispatch({
        type: gameConstants.UPDATE,
        payload,
      })
    }
  }

  static travelTo(location: LocationItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('travelTo triggered.')

      // State properties
      const state: StoreState = getState()

      if (state.game.currentLocation === location.key) {
        // log('Already at this location.')
        return
      }

      if (state.player.character!.currentLevel < location.levelRequired) {
        // log('Has not met level requirement.')
        return
      }

      if (!PlayerHelper.hasConsumedItems(state.player, location.consumeRequired)) {
        // log('Has not met consumed items requirement.')
        return
      }

      if (BattleHelper.isEngaging(state.battle)) {
        await dispatch(TraceAction.addTravelLog(`You cannot travel during a battle.`))
        return
      }

      await dispatch(TraceAction.addTravelLog(`You are now at <strong>${location.name}</strong>.`))

      const payload: GameState = {
        currentLocation: location.key,
        mobs: [],
        nextMobGenerateTs: Date.now(),
      }
      dispatch({
        type: gameConstants.UPDATE,
        payload,
      })
    }
  }

  static sellDropItem(drop: DropItem, quantity: number): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('sellDropItem triggered.')

      // State properties
      const state: StoreState = getState()

      if (!PlayerHelper.hasEnoughDrops(state.player, drop.key, quantity)) {
        // throw new Error('Cannot sell drop item that you do not have.')
        await dispatch(TraceAction.addShoplLog(`You do not have enough <strong>${drop.name}</strong> for sell.`))
        return
      }

      const availableDropItem = find(state.player.availableDrops!, (ad) => ad.key === drop.key)!
      const currentLocation = LocationHelper.getItemByKey(state.game.currentLocation)!
      const priceMultiplierValue = PriceMultiplierHelper.getPriceMultiplierValue(currentLocation.alchemist!, drop)
      if (priceMultiplierValue === 0) {
        throw new Error('Alchemist here does not buy this drop item.')
      }

      const totalSellPrice = PriceMultiplierHelper.calculatePrice(drop.basePrice, priceMultiplierValue, quantity)

      const playerPayload = cloneDeep(state.player)
      playerPayload.gold! += totalSellPrice
      if (availableDropItem.quantity === quantity) {
        playerPayload.availableDrops = filter(playerPayload.availableDrops!, (ad) => ad.key !== availableDropItem.key)
      } else {
        const targetAvailableDrop = find(playerPayload.availableDrops!, (ad) => ad.key === availableDropItem.key)!
        targetAvailableDrop.quantity -= quantity
      }

      await dispatch({ type: playerConstants.UPDATE, payload: playerPayload })
      await dispatch(TraceAction.addShoplLog(`You sold <strong>${drop.name}</strong> ×${quantity} for <strong>${totalSellPrice.toLocaleString()}</strong> gold.`))
    }
  }

  static buyConsumableItem(consumable: ConsumableItem, quantity: number): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('buyConsumableItem triggered.')

      // State properties
      const state: StoreState = getState()

      // Verify if there is a merchant selling this item
      if (!LocationHelper.hasMerchantByKey(state.game.currentLocation)) {
        throw new Error('There is no merchants in your current location.')
      }
      const currentLocation = LocationHelper.getItemByKey(state.game.currentLocation)!
      const priceMultiplierItem = find(currentLocation.merchant!, (pmi) => pmi.key === consumable.key)
      if (!priceMultiplierItem) {
        throw new Error('Merchant here does not sell this consumable item.')
      }

      const totalSellPrice = PriceMultiplierHelper.calculatePrice(consumable.basePrice, priceMultiplierItem.multiplier, quantity)

      // Check if has enough gold
      if (state.player.gold! < totalSellPrice) {
        await dispatch(TraceAction.addShoplLog(`You do not have enough gold to buy <strong>${consumable.name}</strong>.`))
        return
      }

      const playerPayload = cloneDeep(state.player)
      const availableConsumable = find(playerPayload.availableConsumables!, (con) => con.key === consumable.key)!
      playerPayload.gold! -= totalSellPrice

      if (availableConsumable) {
        availableConsumable.quantity += quantity
      } else {
        playerPayload.availableConsumables!.push({ key: consumable.key, quantity })
      }

      await dispatch({ type: playerConstants.UPDATE, payload: playerPayload })
      await dispatch(TraceAction.addShoplLog(`You bought <strong>${consumable.name}</strong> ×${quantity} with <strong>${totalSellPrice.toLocaleString()}</strong> gold.`))
    }
  }

  static deliverQuestItem(quest: QuestItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('deliverQuestItem triggered.')

      // State properties
      const state: StoreState = getState()

      // Verify if the quest is still available
      if (PlayerHelper.hasCompleteQuest(state.player, quest)) {
        throw new Error('Player has already completed this quest.')
      }

      // Verify if player has fulfilled the quest
      if (!PlayerHelper.hasFulfillQuestRequirement(state.player, quest)) {
        await dispatch(TraceAction.addLog(`You have not met the requirement to complete quest <strong>${quest.name}</strong>.`))
        return
      }

      const playerPayload = cloneDeep(state.player)
      // Deduct requested items
      for (const requestItem of quest.requestItems) {
        const targetDrop = find(playerPayload.availableDrops!, (ad) => ad.key === requestItem.key)!
        targetDrop.quantity -= requestItem.quantity
      }
      // Add reward items
      for (const rewardItems of quest.rewardItems) {
        const targetConsumable = find(playerPayload.availableConsumables!, (ac) => ac.key === rewardItems.key)
        if (targetConsumable) {
          targetConsumable.quantity += rewardItems.quantity
        } else {
          playerPayload.availableConsumables!.push({ key: rewardItems.key, quantity: rewardItems.quantity })
        }
      }
      // Append completed quest
      playerPayload.questDeliveredStats!.push(quest.key)

      await dispatch({ type: playerConstants.UPDATE, payload: playerPayload })
      await dispatch(TraceAction.addLog(`You completed and rewarded for the quest <strong>${quest.name}</strong>.`))
      await dispatch(TraceAction.loreByQuestCompletion(quest.key))
    }
  }
}
