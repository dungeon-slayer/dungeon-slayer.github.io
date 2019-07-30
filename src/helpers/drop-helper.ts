import { find } from 'lodash'
import { DropItem, drops } from 'src/data'

export class DropHelper {
  static getItemByKey(key: string | undefined): DropItem | undefined {
    if (!key) {
      return undefined
    }

    const matchedItem = find(drops, (item) => item.key === key)
    return matchedItem
  }

  static getNameByKey(key: string | undefined, defaultLabel = 'Unknown'): string {
    const item = DropHelper.getItemByKey(key)
    if (!item) {
      return defaultLabel
    }
    return item.name
  }
}
