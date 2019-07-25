import { find, sample, floor } from 'lodash'
// import * as Bows from 'bows'
import { CharacterItem } from 'src/common/interfaces'
import { mobTemplates, MobTemplate, DungeonItem } from 'src/data'
import { RandomHelper } from './random-helper'

// const log = Bows('MobHelper')

export class MobHelper {
  static getRandomMob(dungeonItem: DungeonItem): CharacterItem {
    // log('getRandomMob triggered.')

    const mobKey = sample(dungeonItem.mobKeys)
    if (!mobKey) {
      throw new Error('Unable to find a valid mob key.')
    }

    const mobTemplate = find(mobTemplates, (mt) => mt.key === mobKey)
    if (!mobTemplate) {
      throw new Error('Unable to find a valid mob template.')
    }

    const level = RandomHelper.generateLevel(dungeonItem.mobBaseLevel)

    return MobHelper.createMob(mobTemplate, level)
  }

  static createMob(mobTemplate: MobTemplate, level: number): CharacterItem {
    // log('createMob triggered.')

    const hp = floor(mobTemplate.hpBase + mobTemplate.hpLevelModifier * level)
    const rewardExp = MobHelper.getRewardExpValue(level, mobTemplate.awardExpModifier)

    const char: CharacterItem = {
      key: mobTemplate.key,
      id: RandomHelper.generateId('m'),
      createdAt: Date.now(),
      currentLevel: level,
      maxHp: hp,
      currentHp: hp,
      attack: floor(mobTemplate.attackBase + mobTemplate.attackLevelModifier * level),
      defense: floor(mobTemplate.defenseBase + mobTemplate.defenseLevelModifier * level),
      chargeTimeMs: mobTemplate.chargeTimeTs,
      nextTurnTs: undefined,
      currentExp: 0,
      rewardExp,
    }

    return char
  }

  static getRewardExpValue(level: number, modifier: number): number {
    const rewardExp = 2 + level + Math.pow(1.39, level)
    return floor(rewardExp * modifier)
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
