import { floor, find, filter } from 'lodash'
import { playerTemplate } from 'src/data'
import { InventoryItem } from 'src/common/interfaces'

export class PlayerHelper {
  static getHp(level: number): number {
    return floor(playerTemplate.hpBase + playerTemplate.hpLevelModifier * level)
  }

  static getAttack(level: number): number {
    return floor(playerTemplate.attackBase + playerTemplate.attackLevelModifier * level)
  }

  static getDefense(level: number): number {
    return floor(playerTemplate.defenseBase + playerTemplate.defenseLevelModifier * level)
  }

  static getChargeTimeMs(): number {
    return playerTemplate.chargeTimeMs
  }

  static getMobQueueSize(level: number): number {
    return floor(5 + Math.log(level))
  }

  static getExpRequiredToLevelUp(level: number): number {
    return floor((20 + level / 2) * Math.pow(1.4, level))
  }

  static getInventoryItem(inventoryItems: InventoryItem[], consumableKey: string): InventoryItem | undefined {
    return find(inventoryItems, (item) => item.consumableKey === consumableKey)
  }

  static consumeItem(inventoryItems: InventoryItem[], consumableKey: string): InventoryItem[] {
    const targetItem = PlayerHelper.getInventoryItem(inventoryItems, consumableKey)
    if (!targetItem) {
      return inventoryItems
    }

    if (targetItem.quantity > 1) {
      targetItem.quantity -= 1
      return inventoryItems
    }

    // If only 1 quantity left, then remove entry from list
    const modifiedInventoryItems = filter(inventoryItems, (item) => item.consumableKey !== consumableKey)
    return modifiedInventoryItems
  }
}
