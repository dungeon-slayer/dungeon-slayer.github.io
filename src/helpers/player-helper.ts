import { floor, find, filter } from 'lodash'
import { playerTemplate, LocationItem, DropItem, drops, ConsumableItem, consumables } from 'src/data'
import { AvailableItem, QuestItem } from 'src/common/interfaces'
import { PlayerState } from 'src/reducers'
import { ConsumableHelper } from './consumable-helper'

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
    return floor((10 + level / 2) * Math.pow(1.4, level))
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

  static getAvailableAbilityKeys(player: PlayerState): string[] {
    const outputAbilityKeys: string[] = []

    if (!player.itemUsedStats) {
      return outputAbilityKeys
    }

    for (const availableItem of player.itemUsedStats) {
      if (availableItem.quantity > 0) {
        const targetConsumable = ConsumableHelper.getItemByKey(availableItem.key)
        if (!!targetConsumable && targetConsumable.effect.gainAbilities) {
          for (const abilityKey of targetConsumable.effect.gainAbilities) {
            outputAbilityKeys.push(abilityKey)
          }
        }
      }
    }

    return outputAbilityKeys
  }
}
