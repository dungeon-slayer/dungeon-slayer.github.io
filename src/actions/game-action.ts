import { Dispatch } from 'redux'
import { filter, find, cloneDeep } from 'lodash'
// import * as Bows from 'bows'
import { gameConstants } from './constants/game'
import { StoreAction, StoreState } from 'src/store/interface'
import { GameState } from 'src/reducers'
import { MobHelper, PlayerHelper, LocationHelper, BattleHelper, PriceMultiplierHelper, GameHelper } from 'src/helpers'
import { CharacterItem, QuestItem, PossessionItem } from 'src/common/interfaces'
import { LocationItem } from 'src/data'
import { TraceAction } from './trace-action'
import { EnvironmentDelegate } from 'src/delegates'
import { playerConstants } from './constants'

// const log = Bows('GameAction')

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

  static appendSummonMob(possession: PossessionItem): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // // State properties
      const state: StoreState = getState()

      let mob: CharacterItem

      if (possession.key === 'horn-kolift') {
        const mobTemplate = MobHelper.getMobTemplateByKey('kolift')!
        mob = MobHelper.createMob(mobTemplate, state.player.character!.currentLevel)
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

      if (!PlayerHelper.hasPossessionItems(state.player, location.consumeRequired)) {
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

  static sellPossession(possession: PossessionItem, quantity: number): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // log('sellDropItem triggered.')

      // State properties
      const state: StoreState = getState()

      if (!PlayerHelper.hasEnoughPossessions(state.player, possession.key, quantity)) {
        // throw new Error('Cannot sell drop item that you do not have.')
        await dispatch(TraceAction.addShoplLog(`You do not have enough <strong>${possession.name}</strong> for sell.`))
        return
      }

      const availablePossessionItem = find(state.player.availablePossessions!, (ad) => ad.key === possession.key)!
      const currentLocation = LocationHelper.getItemByKey(state.game.currentLocation)!
      const priceMultiplierValue = PriceMultiplierHelper.getPriceMultiplierValue(currentLocation.alchemist!, possession)
      if (priceMultiplierValue === 0) {
        throw new Error('Alchemist here does not buy this drop item.')
      }

      const totalSellPrice = PriceMultiplierHelper.calculatePrice(possession.basePrice, priceMultiplierValue, quantity)

      const playerPayload = cloneDeep(state.player)
      playerPayload.gold! += totalSellPrice
      if (availablePossessionItem.quantity === quantity) {
        playerPayload.availablePossessions = filter(playerPayload.availablePossessions!, (ad) => ad.key !== availablePossessionItem.key)
      } else {
        const targetAvailablePossession = find(playerPayload.availablePossessions!, (ad) => ad.key === availablePossessionItem.key)!
        targetAvailablePossession.quantity -= quantity
      }

      await dispatch({ type: playerConstants.UPDATE, payload: playerPayload })
      await dispatch(TraceAction.addShoplLog(`You sold <strong>${possession.name}</strong> ×${quantity} for <strong>${totalSellPrice.toLocaleString()}</strong> gold.`))
    }
  }

  static buyPossessionItem(possession: PossessionItem, quantity: number): any {
    return async (dispatch: Dispatch<StoreAction>, getState: any): Promise<void> => {
      // State properties
      const state: StoreState = getState()

      // Verify if there is a merchant selling this item
      if (!LocationHelper.hasMerchantByKey(state.game.currentLocation)) {
        throw new Error('There is no merchants in your current location.')
      }
      const currentLocation = LocationHelper.getItemByKey(state.game.currentLocation)!
      const priceMultiplierItem = find(currentLocation.merchant!, (pmi) => pmi.key === possession.key)
      if (!priceMultiplierItem) {
        throw new Error('Merchant here does not sell this item.')
      }

      const totalSellPrice = PriceMultiplierHelper.calculatePrice(possession.basePrice, priceMultiplierItem.multiplier, quantity)

      // Check if has enough gold
      if (state.player.gold! < totalSellPrice) {
        await dispatch(TraceAction.addShoplLog(`You do not have enough gold to buy <strong>${possession.name}</strong>.`))
        return
      }

      const playerPayload = cloneDeep(state.player)
      const availablePossession = find(playerPayload.availablePossessions!, (con) => con.key === possession.key)!
      playerPayload.gold! -= totalSellPrice

      if (availablePossession) {
        availablePossession.quantity += quantity
      } else {
        playerPayload.availablePossessions!.push({ key: possession.key, quantity })
      }

      await dispatch({ type: playerConstants.UPDATE, payload: playerPayload })
      await dispatch(TraceAction.addShoplLog(`You bought <strong>${possession.name}</strong> ×${quantity} with <strong>${totalSellPrice.toLocaleString()}</strong> gold.`))
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
        const targetPossession = find(playerPayload.availablePossessions!, (ad) => ad.key === requestItem.key)!
        targetPossession.quantity -= requestItem.quantity
      }
      // Add reward items
      for (const rewardItems of quest.rewardItems) {
        const targetPossession = find(playerPayload.availablePossessions!, (ac) => ac.key === rewardItems.key)
        if (targetPossession) {
          targetPossession.quantity += rewardItems.quantity
        } else {
          playerPayload.availablePossessions!.push({ key: rewardItems.key, quantity: rewardItems.quantity })
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
