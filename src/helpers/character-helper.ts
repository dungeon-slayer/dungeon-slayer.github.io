import { find, cloneDeep, floor } from 'lodash'
import { CharacterItem, CharacterEffectItem } from 'src/common/interfaces'
import { mobTemplates } from 'src/data'
import { AbilityHelper } from './ability-helper'
import { GameState } from 'src/reducers'

export class CharacterHelper {
  static isCharacterTurn(character: CharacterItem): boolean {
    return !character.nextTurnTs || character.nextTurnTs < Date.now()
  }

  static updateHpValue(currentHp: number, damageValue: number): number {
    const val = currentHp - damageValue
    return val < 0 ? 0 : val
  }

  static updateConsumableEffect(character: CharacterItem, effect: CharacterEffectItem): CharacterItem {
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
    return !!find(character.activeAbilities, (aa) => aa === abilityKey)
  }

  static getAttackMultiplier(character: CharacterItem): number {
    let multiplier = 1

    if (!character.activeAbilities) {
      return multiplier
    }

    for (const activeAbilityKey of character.activeAbilities) {
      const targetAbility = AbilityHelper.getItemByKey(activeAbilityKey)
      if (!!targetAbility && targetAbility.effect.attackMultiplier) {
        multiplier += targetAbility.effect.attackMultiplier - 1
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

    for (const activeAbilityKey of character.activeAbilities) {
      const targetAbility = AbilityHelper.getItemByKey(activeAbilityKey)
      if (!!targetAbility && targetAbility.effect.chargeTimeMultiplier) {
        multiplier += targetAbility.effect.chargeTimeMultiplier - 1
      }
    }

    return multiplier
  }
}
