import { find, filter, sortBy, head, isArray } from 'lodash'
import { locations, LocationItem } from 'src/data'

export class LocationHelper {
  static getItemByKey(key: string | undefined): LocationItem | undefined {
    if (!key) {
      return undefined
    }

    const matchedItem = find(locations, (item) => item.key === key)
    return matchedItem
  }

  static getAvailableItems(playerLevel: number): LocationItem[] {
    return filter(locations, (item) => item.levelRequired <= playerLevel)
  }

  static getNextUnavailableItem(playerLevel: number): LocationItem | undefined {
    const unavailableLocations = filter(locations, (item) => item.levelRequired > playerLevel)
    const sortedUnavailableLocations = sortBy(unavailableLocations, (item) => item.levelRequired)
    return head(sortedUnavailableLocations)
  }

  static hasDungeonByKey(key: string | undefined): boolean {
    const locationItem = LocationHelper.getItemByKey(key)
    if (!locationItem) {
      return false
    }
    if (!locationItem.dungeon || !locationItem.dungeon.mobKeys) {
      return false
    }
    return locationItem.dungeon.mobKeys.length > 0
  }

  static hasAlchemistByKey(key: string | undefined): boolean {
    const location = LocationHelper.getItemByKey(key)
    if (!location) {
      return false
    }
    return isArray(location.alchemist)
  }

  static hasMerchantByKey(key: string | undefined): boolean {
    const location = LocationHelper.getItemByKey(key)
    if (!location) {
      return false
    }
    return isArray(location.merchant)
  }

  static hasQuestGiverByKey(key: string | undefined): boolean {
    const location = LocationHelper.getItemByKey(key)
    if (!location) {
      return false
    }
    return isArray(location.questGiver)
  }
}
