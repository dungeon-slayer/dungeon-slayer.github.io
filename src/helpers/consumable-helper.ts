import { find } from 'lodash'
import { ConsumableItem, consumables } from 'src/data'

export class ConsumableHelper {
  static getItemByKey(key: string | undefined): ConsumableItem | undefined {
    if (!key) {
      return undefined
    }

    const matchedItem = find(consumables, (item) => item.key === key)
    return matchedItem
  }

  static getNameByKey(key: string | undefined, defaultLabel = 'Unknown'): string {
    const item = ConsumableHelper.getItemByKey(key)
    if (!item) {
      return defaultLabel
    }
    return item.name
  }

  static canConsume(consumable: ConsumableItem, location: string) {
    if (consumable.key === 'horn-kolift') {
      return location === 'dorters-mine'
    }
    return true
  }
}
