import { find } from 'lodash'
import { CharacterItem } from 'src/common/interfaces'
import { mobTemplates } from 'src/data'

export class CharacterHelper {
  static isCharacterTurn(character: CharacterItem): boolean {
    return !character.nextTurnTs || character.nextTurnTs < Date.now()
  }

  static updateHpValue(currentHp: number, damageValue: number): number {
    const val = currentHp - damageValue
    return val < 0 ? 0 : val
  }

  static applyHeal(character: CharacterItem, healValue: number): CharacterItem {
    let modifiedHp = character.currentHp + healValue
    if (modifiedHp > character.maxHp) {
      modifiedHp = character.maxHp
    }
    character.currentHp = modifiedHp
    return character
  }

  static getName(character: CharacterItem, defaultLabel = 'Unknown'): string {
    if (character.key === 'player') {
      return 'Player'
    }

    const matchedMobTemplate = find(mobTemplates, (mob) => mob.key === character.key)
    if (!matchedMobTemplate) {
      return defaultLabel
    }

    return matchedMobTemplate.name
  }
}
