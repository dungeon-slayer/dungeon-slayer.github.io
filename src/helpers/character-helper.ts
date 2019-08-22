import { find, cloneDeep, floor } from 'lodash'
import { CharacterItem, ConsumableEffectItem } from 'src/common/interfaces'
import { mobTemplates } from 'src/data'
import { AbilityHelper } from './ability-helper'
import { GameState } from 'src/reducers'

export class CharacterHelper {
  static isCharacterTurn(character: CharacterItem): boolean {
    return !character.nextTurnTs || character.nextTurnTs < Date.now()
  }

  static isAbleToFight(character: CharacterItem): boolean {
    return character.currentHp > 0
  }

  static updateHpValue(currentHp: number, damageValue: number): number {
    const val = currentHp - damageValue
    return val < 0 ? 0 : val
  }

  static updateConsumableEffect(character: CharacterItem, effect: ConsumableEffectItem): CharacterItem {
    const characterCopy = cloneDeep(character)

    if (effect.hpModifier) {
      characterCopy.currentHp += effect.hpModifier
    }

    // Normalize
    if (characterCopy.currentHp > characterCopy.maxHp) {
      characterCopy.currentHp = characterCopy.maxHp
    }
    if (characterCopy.currentHp < 0) {
      characterCopy.currentHp = 0
    }

    return characterCopy
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

  static hasActiveAbility(character: CharacterItem, abilityKey: string): boolean {
    return !!find(character.activeAbilities, (item) => item.key === abilityKey)
  }

  static getAttackMultiplier(character: CharacterItem): number {
    let multiplier = 1

    if (!character.activeAbilities) {
      return multiplier
    }

    for (const activeAbilityItem of character.activeAbilities) {
      const targetAbility = AbilityHelper.getItemByKey(activeAbilityItem.key)
      if (targetAbility) {
        if (targetAbility.effect.attackBaseMultiplier && targetAbility.effect.attackLevelMultiplier) {
          multiplier += targetAbility.effect.attackBaseMultiplier + targetAbility.effect.attackLevelMultiplier * activeAbilityItem.level
        }
      }
    }

    return multiplier
  }

  static getDefenseMultiplier(character: CharacterItem): number {
    let multiplier = 1

    if (!character.activeAbilities) {
      return multiplier
    }

    for (const activeAbilityItem of character.activeAbilities) {
      const targetAbility = AbilityHelper.getItemByKey(activeAbilityItem.key)
      if (targetAbility) {
        if (targetAbility.effect.defenseBaseMultiplier && targetAbility.effect.defenseLevelMultiplier) {
          multiplier += targetAbility.effect.defenseBaseMultiplier + targetAbility.effect.defenseLevelMultiplier * activeAbilityItem.level
        }
      }
    }

    return multiplier
  }

  static getNextTurnTimestamp(character: CharacterItem, game: GameState): number {
    const baseTs = character.nextTurnTs ? character.nextTurnTs : Date.now()
    const baseMultiplier = game.clockSpeedMultiplier ? game.clockSpeedMultiplier : 1
    const chargeTime = CharacterHelper.getCharacterChargeTime(character)
    const incrementMs = floor(chargeTime / baseMultiplier)
    return baseTs + incrementMs
  }

  static getCharacterChargeTime(character: CharacterItem): number {
    const multiplier = CharacterHelper.getChargeTimeMultiplier(character)
    return character.chargeTimeMs * multiplier
  }

  static getChargeTimeMultiplier(character: CharacterItem): number {
    let multiplier = 1

    if (!character.activeAbilities) {
      return multiplier
    }

    for (const activeAbilityItem of character.activeAbilities) {
      const targetAbility = AbilityHelper.getItemByKey(activeAbilityItem.key)
      if (targetAbility) {
        if (targetAbility.effect.chargeTimeBaseMultiplier && targetAbility.effect.chargeTimeLevelMultiplier) {
          multiplier += targetAbility.effect.chargeTimeBaseMultiplier + targetAbility.effect.chargeTimeLevelMultiplier * activeAbilityItem.level
        }
      }
    }

    return multiplier
  }

  static getExperienceMultiplier(character: CharacterItem): number {
    let multiplier = 1

    if (!character.activeAbilities) {
      return multiplier
    }

    for (const activeAbilityItem of character.activeAbilities) {
      const targetAbility = AbilityHelper.getItemByKey(activeAbilityItem.key)
      if (targetAbility) {
        if (targetAbility.effect.experienceBaseMultiplier && targetAbility.effect.experienceLevelMultiplier) {
          multiplier += targetAbility.effect.experienceBaseMultiplier + targetAbility.effect.experienceLevelMultiplier * activeAbilityItem.level
        }
      }
    }

    return multiplier
  }

  static getEvasionChance(character: CharacterItem): number {
    let multiplier = 0

    if (!character.activeAbilities) {
      return multiplier
    }

    for (const activeAbilityItem of character.activeAbilities) {
      const targetAbility = AbilityHelper.getItemByKey(activeAbilityItem.key)
      if (targetAbility) {
        if (targetAbility.effect.evasionBaseMultiplier && targetAbility.effect.evasionLevelMultiplier) {
          multiplier += targetAbility.effect.evasionBaseMultiplier + targetAbility.effect.evasionLevelMultiplier * activeAbilityItem.level
        }
      }
    }

    return multiplier
  }

  static getCriticalChance(character: CharacterItem): number {
    let multiplier = 0

    if (!character.activeAbilities) {
      return multiplier
    }

    for (const activeAbilityItem of character.activeAbilities) {
      const targetAbility = AbilityHelper.getItemByKey(activeAbilityItem.key)
      if (targetAbility) {
        if (targetAbility.effect.criticalChanceBaseMultiplier && targetAbility.effect.criticalChanceLevelMultiplier) {
          multiplier += targetAbility.effect.criticalChanceBaseMultiplier + targetAbility.effect.criticalChanceLevelMultiplier * activeAbilityItem.level
        }
      }
    }

    return multiplier
  }

  static getCriticalBonusMultiplier(character: CharacterItem): number {
    let multiplier = 1.2

    if (!character.activeAbilities) {
      return multiplier
    }

    for (const activeAbilityItem of character.activeAbilities) {
      const targetAbility = AbilityHelper.getItemByKey(activeAbilityItem.key)
      if (targetAbility) {
        if (targetAbility.effect.criticalBonusBaseMultiplier && targetAbility.effect.criticalBonusLevelMultiplier) {
          multiplier += targetAbility.effect.criticalBonusBaseMultiplier + targetAbility.effect.criticalBonusLevelMultiplier * activeAbilityItem.level
        }
      }
    }

    return multiplier
  }
}
