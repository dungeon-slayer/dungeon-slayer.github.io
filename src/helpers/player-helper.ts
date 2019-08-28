import { floor, find, filter } from 'lodash'
import { playerTemplate, LocationItem, DropItem, drops, ConsumableItem, consumables } from 'src/data'
import { AvailableItem, QuestItem, ActiveAbilityItem } from 'src/common/interfaces'
import { PlayerState, BattleState } from 'src/reducers'
import { ConsumableHelper } from './consumable-helper'
import { AbilityHelper } from './ability-helper'
import { BattleHelper } from './battle-helper'
import { PriceMultiplierHelper } from './price-multiplier-helper'
import { LocationHelper } from './location-helper'

export class PlayerHelper {
  static getHp(level: number): number {
    return floor(playerTemplate.hpBase + playerTemplate.hpLevelMultiplier * level)
  }

  static getAttack(level: number): number {
    return floor(playerTemplate.attackBase + playerTemplate.attackLevelMultiplier * level)
  }

  static getDefense(level: number): number {
    return floor(playerTemplate.defenseBase + playerTemplate.defenseLevelMultiplier * level)
  }

  static getChargeTimeMs(): number {
    return playerTemplate.chargeTimeMs
  }

  static getMobQueueSize(level: number): number {
    return floor(5 + Math.log(level))
  }

  static getExpRequiredToLevelUp(level: number): number {
    return floor((10 + level / 2) * Math.pow(1.2, level))
  }

  static getAvailableItemByKey(availableItems: AvailableItem[], key: string): AvailableItem | undefined {
    return find(availableItems, (item) => item.key === key)
  }

  static reducerAvailableItem(availableItems: AvailableItem[], consumableKey: string): AvailableItem[] {
    const targetItem = PlayerHelper.getAvailableItemByKey(availableItems, consumableKey)
    if (!targetItem) {
      return availableItems
    }

    if (targetItem.quantity > 1) {
      targetItem.quantity -= 1
      return availableItems
    }

    // If only 1 quantity left, then remove entry from list
    const modifiedAvailableItems = filter(availableItems, (item) => item.key !== consumableKey)
    return modifiedAvailableItems
  }

  static countAvailableConsumableByKey(player: PlayerState, consumableKey: string): number {
    if (!player.availableConsumables) {
      return 0
    }

    const targetAvailableItem = find(player.availableConsumables, (ac) => ac.key === consumableKey)
    if (!targetAvailableItem) {
      return 0
    }

    return targetAvailableItem.quantity
  }

  static getTotalAbilityPoint(level: number): number {
    return floor(100 - 61 + 2 * level + 20 * Math.log(level * 20))
  }

  static getUsedAbilityPoint(player: PlayerState): number {
    if (!player.character || !player.character.activeAbilities) {
      return 0
    }

    let usedAP = 0
    for (const activeAbilityItem of player.character.activeAbilities) {
      const ability = AbilityHelper.getItemByKey(activeAbilityItem.key)
      if (ability) {
        usedAP += AbilityHelper.getApCost(ability, activeAbilityItem.level)
      }
    }
    return usedAP
  }

  static getAvailableAbilityPoint(player: PlayerState): number {
    const totalAP = PlayerHelper.getTotalAbilityPoint(player.character!.currentLevel)
    const usedAP = PlayerHelper.getUsedAbilityPoint(player)
    return totalAP - usedAP
  }

  static hasCompleteQuest(player: PlayerState, quest: QuestItem): boolean {
    const targetQuestKey = find(player.questDeliveredStats!, (qd) => qd === quest.key)
    return !!targetQuestKey
  }

  static isQuestUnlocked(player: PlayerState, quest: QuestItem): boolean {
    if (!player.questDeliveredStats) {
      return quest.prerequisiteQuests.length === 0
    }

    for (const prerequisiteQuestKey of quest.prerequisiteQuests) {
      const matchedKey = find(player.questDeliveredStats, (key) => key === prerequisiteQuestKey)
      if (!matchedKey) {
        return false
      }
    }

    return true
  }

  static hasFulfillQuestRequirement(player: PlayerState, quest: QuestItem): boolean {
    for (const requestItem of quest.requestItems) {
      const targetDrop = find(player.availableDrops!, (ad) => ad.key === requestItem.key)
      if (!targetDrop || targetDrop.quantity < requestItem.quantity) {
        return false
      }
    }
    return true
  }

  static getAvailableDrops(player: PlayerState): DropItem[] {
    if (!player.availableDrops) {
      return []
    }

    const availableDrops: DropItem[] = []
    for (const availableItem of player.availableDrops) {
      if (availableItem.quantity > 0) {
        const targetDrop = find(drops, (drop) => drop.key === availableItem.key)
        if (targetDrop) {
          availableDrops.push(targetDrop)
        }
      }
    }
    return availableDrops
  }

  static getAvailableConsumables(player: PlayerState): ConsumableItem[] {
    if (!player.availableConsumables) {
      return []
    }

    const availableConsumables: ConsumableItem[] = []
    for (const availableItem of player.availableConsumables) {
      if (availableItem.quantity > 0) {
        const targetConsumable = find(consumables, (consumable) => consumable.key === availableItem.key)
        if (targetConsumable) {
          availableConsumables.push(targetConsumable)
        }
      }
    }
    return availableConsumables
  }

  static getAvailableQuests(player: PlayerState, location: LocationItem): QuestItem[] {
    const outputQuests: QuestItem[] = []

    if (!location.questGiver) {
      return []
    }

    for (const quest of location.questGiver) {
      if (!PlayerHelper.hasCompleteQuest(player, quest) && PlayerHelper.isQuestUnlocked(player, quest)) {
        outputQuests.push(quest)
      }
    }

    return outputQuests
  }

  static getLockedQuests(player: PlayerState, location: LocationItem): QuestItem[] {
    const outputQuests: QuestItem[] = []

    if (!location.questGiver) {
      return []
    }

    for (const quest of location.questGiver) {
      if (!PlayerHelper.hasCompleteQuest(player, quest) && !PlayerHelper.isQuestUnlocked(player, quest)) {
        outputQuests.push(quest)
      }
    }

    return outputQuests
  }

  static hasConsumedItem(player: PlayerState, itemKey: string, qualifiedQuantity = 1): boolean {
    if (!player.itemUsedStats) {
      return false
    }

    const targetAvailableItem = find(player.itemUsedStats, (item) => item.key === itemKey)
    if (!targetAvailableItem) {
      return false
    }

    return targetAvailableItem.quantity >= qualifiedQuantity
  }

  static hasConsumedItems(player: PlayerState, itemKeys: string[], qualifiedQuantity = 1): boolean {
    for (const itemKey of itemKeys) {
      if (!PlayerHelper.hasConsumedItem(player, itemKey, qualifiedQuantity)) {
        return false
      }
    }
    return true
  }

  static hasConsumable(player: PlayerState, itemKey: string, qualifiedQuantity = 1): boolean {
    if (!player.availableDrops) {
      return false
    }

    const targetAvailableItem = find(player.availableConsumables, (item) => item.key === itemKey)
    if (!targetAvailableItem) {
      return false
    }

    return targetAvailableItem.quantity >= qualifiedQuantity
  }

  static hasDropItem(player: PlayerState, itemKey: string, qualifiedQuantity = 1): boolean {
    if (!player.availableDrops) {
      return false
    }

    const targetAvailableItem = find(player.availableDrops, (item) => item.key === itemKey)
    if (!targetAvailableItem) {
      return false
    }

    return targetAvailableItem.quantity >= qualifiedQuantity
  }

  static getAvailableAbilityItems(player: PlayerState): ActiveAbilityItem[] {
    const outputAbilityKeys: ActiveAbilityItem[] = []

    if (!player.itemUsedStats) {
      return outputAbilityKeys
    }

    for (const usedItem of player.itemUsedStats) {
      if (usedItem.quantity > 0) {
        const targetConsumable = ConsumableHelper.getItemByKey(usedItem.key)
        if (targetConsumable && targetConsumable.effect.gainAbilities) {
          for (const abilityKey of targetConsumable.effect.gainAbilities) {
            const aaItem: ActiveAbilityItem = { key: abilityKey, level: usedItem.quantity }
            outputAbilityKeys.push(aaItem)
          }
        }
      }
    }

    return outputAbilityKeys
  }

  // TODO: this is inefficient, more thought required to make this step less cumbersome
  static getAvailableAbilityItemByAbilityKey(player: PlayerState, abilityKey: string): ActiveAbilityItem | undefined {
    if (!player.itemUsedStats) {
      return undefined
    }

    for (const usedItem of player.itemUsedStats) {
      if (usedItem.quantity > 0) {
        const targetConsumable = ConsumableHelper.getItemByKey(usedItem.key)
        if (targetConsumable && targetConsumable.effect.gainAbilities) {
          if (targetConsumable.effect.gainAbilities.indexOf(abilityKey) > -1) {
            // NOTE: This is assume that you cannot stake ability levels from different consumables
            const aaItem: ActiveAbilityItem = { key: abilityKey, level: usedItem.quantity }
            return aaItem
          }
        }
      }
    }

    return undefined
  }

  static isInFightingMode(player: PlayerState, battle: BattleState): boolean {
    if (player.autoBattleEnabled) {
      return true
    }

    if (BattleHelper.isEngaging(battle)) {
      return true
    }

    return false
  }

  static hasEnoughDrops(player: PlayerState, dropKey: string, quantity: number): boolean {
    const availableDropItem = find(player.availableDrops!, (ad) => ad.key === dropKey)
    return !!availableDropItem && availableDropItem.quantity >= quantity
  }

  static hasEnoughGold(player: PlayerState, locationKey: string, consumable: ConsumableItem, quantity: number): boolean {
    const currentLocation = LocationHelper.getItemByKey(locationKey)!
    const priceMultiplierItem = find(currentLocation.merchant!, (pmi) => pmi.key === consumable.key)
    if (!priceMultiplierItem) {
      return true
    }
    const totalSellPrice = PriceMultiplierHelper.calculatePrice(consumable.basePrice, priceMultiplierItem.multiplier, quantity)

    return player.gold! >= totalSellPrice
  }
}
