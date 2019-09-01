import { find, isUndefined } from 'lodash'
import { AbilityItem, abilities } from 'src/data'
import { PlayerState } from 'src/reducers'
import { CastHelper } from './cast-helper'

export class AbilityHelper {
  static getItemByKey(key: string | undefined): AbilityItem | undefined {
    if (!key) {
      return undefined
    }

    const matchedItem = find(abilities, (item) => item.key === key)
    return matchedItem
  }

  static isActivated(player: PlayerState, abilityKey: string): boolean {
    if (!player.character!.activeAbilities) {
      return false
    }

    const targetAbilityKey = find(player.character!.activeAbilities, (item) => item.key === abilityKey)
    return !!targetAbilityKey
  }

  static getApCost(ability: AbilityItem, level: number): number {
    return ability.apCost + (level - 1) * 5
  }

  static getFullName(ability: AbilityItem, level: number): string {
    if (level <= 1) {
      return ability.name
    }

    return ability.name + ' ' + level
  }

  static getFlavorText(ability: AbilityItem, level: number): string {
    if (ability.flavor.indexOf('[%]') === -1) {
      return ability.flavor
    }

    // Special case
    if (ability.key === 'auto-potion') {
      const percentageValue = CastHelper.toPercentageLabel(AbilityHelper.getAutoPotionChance(level))
      return ability.flavor.replace('[%]', percentageValue)
    }

    if (!isUndefined(ability.effect.attackBaseMultiplier) && !isUndefined(ability.effect.attackLevelMultiplier)) {
      const multiplier = ability.effect.attackBaseMultiplier + ability.effect.attackLevelMultiplier * level
      return ability.flavor.replace('[%]', CastHelper.toPercentageLabel(multiplier))
    }

    if (!isUndefined(ability.effect.defenseBaseMultiplier) && !isUndefined(ability.effect.defenseLevelMultiplier)) {
      const multiplier = ability.effect.defenseBaseMultiplier + ability.effect.defenseLevelMultiplier * level
      return ability.flavor.replace('[%]', CastHelper.toPercentageLabel(multiplier))
    }

    if (!isUndefined(ability.effect.evasionBaseMultiplier) && !isUndefined(ability.effect.evasionLevelMultiplier)) {
      const multiplier = ability.effect.evasionBaseMultiplier + ability.effect.evasionLevelMultiplier * level
      return ability.flavor.replace('[%]', CastHelper.toPercentageLabel(multiplier))
    }

    if (!isUndefined(ability.effect.chargeTimeBaseMultiplier) && !isUndefined(ability.effect.chargeTimeLevelMultiplier)) {
      const multiplier = ability.effect.chargeTimeBaseMultiplier + ability.effect.chargeTimeLevelMultiplier * level
      return ability.flavor.replace('[%]', CastHelper.toPercentageLabel(multiplier))
    }

    if (!isUndefined(ability.effect.experienceBaseMultiplier) && !isUndefined(ability.effect.experienceLevelMultiplier)) {
      const multiplier = ability.effect.experienceBaseMultiplier + ability.effect.experienceLevelMultiplier * level
      return ability.flavor.replace('[%]', CastHelper.toPercentageLabel(multiplier))
    }

    if (!isUndefined(ability.effect.criticalChanceBaseMultiplier) && !isUndefined(ability.effect.criticalChanceLevelMultiplier)) {
      const multiplier = ability.effect.criticalChanceBaseMultiplier + ability.effect.criticalChanceLevelMultiplier * level
      return ability.flavor.replace('[%]', CastHelper.toPercentageLabel(multiplier))
    }

    if (!isUndefined(ability.effect.criticalBonusBaseMultiplier) && !isUndefined(ability.effect.criticalBonusLevelMultiplier)) {
      const multiplier = ability.effect.criticalBonusBaseMultiplier + ability.effect.criticalBonusLevelMultiplier * level
      return ability.flavor.replace('[%]', CastHelper.toPercentageLabel(multiplier))
    }

    return ability.flavor
  }

  static getAutoPotionChance(level: number): number {
    if (level === 0) {
      return 0
    }

    const baseMultiplier = 0.42
    const levelMultiplier = 0.08
    return baseMultiplier + levelMultiplier * level
  }
}
