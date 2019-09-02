import { find } from 'lodash'
import { possessions } from 'src/data'
import { PossessionItem } from 'src/common/interfaces'

export class PossessionHelper {
  static getItemByKey(key: string | undefined): PossessionItem | undefined {
    if (!key) {
      return undefined
    }

    const matchedItem = find(possessions, (item) => item.key === key)
    return matchedItem
  }

  static getNameByKey(key: string | undefined, defaultLabel = 'Unknown'): string {
    const item = PossessionHelper.getItemByKey(key)
    if (!item) {
      return defaultLabel
    }
    return item.name
  }

  static canConsume(item: PossessionItem, location: string) {
    if (item.key === 'horn-kolift') {
      return location === 'dorters-mine'
    }
    return true
  }
}
