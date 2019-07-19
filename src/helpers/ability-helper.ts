import { find } from 'lodash'
import { AbilityItem, abilities } from 'src/data'
import { PlayerState } from 'src/reducers'

export class AbilityHelper {
  static getItemByKey(key: string | undefined): AbilityItem | undefined {
    if (!key) {
      return undefined
    }

    const matchedItem = find(abilities, (item) => item.key === key)
    return matchedItem
  }

  static isActivated(player: PlayerState, abilityKey: string): boolean {
    if (!player.activeAbilities) {
      return false
    }

    const targetAbilityKey = find(player.activeAbilities, (key) => key === abilityKey)
    return !!targetAbilityKey
  }
}
