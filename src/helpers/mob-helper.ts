import { find, sample, floor, round } from 'lodash'
// import * as Bows from 'bows'
import { CharacterItem } from 'src/common/interfaces'
import { mobTemplates, MobTemplate, LocationItem } from 'src/data'
import { RandomHelper } from './random-helper'

// const log = Bows('MobHelper')

export class MobHelper {
  static getRandomMob(location: LocationItem): CharacterItem {
    // log('getRandomMob triggered.')

    if (!location.dungeon) {
      throw new Error('dungeon is undefined.')
    }

    const mobKey = sample(location.dungeon.mobKeys)
    if (!mobKey) {
      throw new Error('Unable to find a valid mob key.')
    }

    const mobTemplate = find(mobTemplates, (mt) => mt.key === mobKey)
    if (!mobTemplate) {
      throw new Error('Unable to find a valid mob template.')
    }

    const minLevel = location.dungeon.mobLevelBase - location.dungeon.mobLevelHalfRange
    const maxLevel = location.dungeon.mobLevelBase + location.dungeon.mobLevelHalfRange
    let level = RandomHelper.randomBoxMuller(minLevel, maxLevel, location.dungeon.mobLevelSkew)

    if (level < 1) {
      level = 1
    }
    level = round(level)

    return MobHelper.createMob(mobTemplate, level)
  }

  static createMob(mobTemplate: MobTemplate, level: number): CharacterItem {
    // log('createMob triggered.')

    const hp = floor(mobTemplate.hpBase + mobTemplate.hpLevelMultiplier * level)
    const rewardExp = MobHelper.getRewardExpValue(level, mobTemplate.awardExpMultiplier)

    const char: CharacterItem = {
      key: mobTemplate.key,
      id: RandomHelper.generateId('m'),
      createdAt: Date.now(),
      currentLevel: level,
      maxHp: hp,
      currentHp: hp,
      attack: floor(mobTemplate.attackBase + mobTemplate.attackLevelMultiplier * level),
      defense: floor(mobTemplate.defenseBase + mobTemplate.defenseLevelMultiplier * level),
      chargeTimeMs: mobTemplate.chargeTimeTs,
      nextTurnTs: undefined,
      currentExp: 0,
      rewardExp,
      activeAbilities: [],
    }

    return char
  }

  static getRewardExpValue(level: number, multiplier: number): number {
    const rewardExp = 2 + level + Math.pow(1.39, level)
    return floor(rewardExp * multiplier)
  }

  static getMobNameByKey(key: string, defaultLabel = 'Unknown'): string {
    const mobTemplate = MobHelper.getMobTemplateByKey(key)
    if (!mobTemplate) {
      return defaultLabel
    }
    return mobTemplate.name
  }

  static getMobTemplateByKey(key: string): MobTemplate | undefined {
    // log('getMobTemplateByKey triggered. key:', key)
    return find(mobTemplates, (mob) => mob.key === key)
  }
}
