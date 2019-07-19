import { find, filter, sortBy, head } from 'lodash'
import { dungeons, DungeonItem } from 'src/data'

export class DungeonHelper {
  static getItemByKey(key: string | undefined): DungeonItem | undefined {
    if (!key) {
      return undefined
    }

    const matchedItem = find(dungeons, (item) => item.key === key)
    return matchedItem
  }

  static getAvailableItems(playerLevel: number): DungeonItem[] {
    return filter(dungeons, (item) => item.levelRequired <= playerLevel)
  }

  static getNextUnavailableItem(playerLevel: number): DungeonItem | undefined {
    const unavailableDungeons = filter(dungeons, (item) => item.levelRequired > playerLevel)
    const sortedUnavailableDungeons = sortBy(unavailableDungeons, (item) => item.levelRequired)
    return head(sortedUnavailableDungeons)
  }
}
