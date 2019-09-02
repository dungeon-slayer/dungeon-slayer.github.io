import { find, filter, head, difference, isArray } from 'lodash'
import { locations, LocationItem } from 'src/data'
import { PlayerState } from 'src/reducers'
import { PlayerHelper } from './player-helper'
import { MobHelper } from './mob-helper'
import { PossessionHelper } from './possession-helper'

export class LocationHelper {
  static getItemByKey(key: string | undefined): LocationItem | undefined {
    if (!key) {
      return undefined
    }

    const matchedItem = find(locations, (item) => item.key === key)
    return matchedItem
  }

  static getAvailableItems(player: PlayerState): LocationItem[] {
    const targetLocations = filter(locations, (location) => {
      return player.character!.currentLevel >= location.levelRequired && PlayerHelper.hasPossessionItems(player, location.consumeRequired)
    })
    return targetLocations
  }

  static getUnavailableItems(player: PlayerState): LocationItem[] {
    const availableItems = LocationHelper.getAvailableItems(player)
    return difference(locations, availableItems)
  }

  static getNextUnavailableItem(player: PlayerState): LocationItem | undefined {
    const unavailableItems = LocationHelper.getUnavailableItems(player)
    return head(unavailableItems)
  }

  static hasDungeonByKey(key: string | undefined): boolean {
    const locationItem = LocationHelper.getItemByKey(key)
    if (!locationItem) {
      return false
    }
    return !!locationItem.dungeon
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

  static getRequirementLabel(location: LocationItem): string {
    const requirements: string[] = []
    requirements.push(`Player level ${location.levelRequired}`)
    for (const possessionKey of location.consumeRequired) {
      const possessionName = PossessionHelper.getNameByKey(possessionKey, possessionKey)
      requirements.push(possessionName)
    }
    return `(Requirement: ${requirements.join(', ')})`
  }

  static getMobListLabel(location: LocationItem): string {
    const parts: string[] = []

    if (!location.dungeon || location.dungeon.mobAppearances.length === 0) {
      parts.push('N/A')
    } else {
      for (const maItem of location.dungeon.mobAppearances) {
        const mobName = MobHelper.getMobNameByKey(maItem.key)
        parts.push(mobName)
      }
    }

    return `Mobs: ${parts.join(', ')}`
  }
}
