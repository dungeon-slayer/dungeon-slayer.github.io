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
}
