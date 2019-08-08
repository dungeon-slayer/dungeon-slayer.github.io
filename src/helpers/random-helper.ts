import { random, padStart, sum, round } from 'lodash'

export class RandomHelper {
  static generateId(prefix = ''): string {
    const id = prefix + padStart(random(999999).toString(), 6, '0')
    return id
  }

  /**
   * 30% chance of uniform distribution, rest been box-muller.
   */
  static getRandomLevel(baseLevel: number, halfRange: number, skew: number): number {
    let outputLevel: number
    const minLevel = baseLevel - halfRange
    const maxLevel = baseLevel + halfRange

    if (RandomHelper.takeChance(0.3)) {
      outputLevel = random(minLevel, maxLevel)
    } else {
      outputLevel = round(RandomHelper.randomBoxMuller(minLevel, maxLevel, skew))
    }

    if (outputLevel < 1) {
      outputLevel = 1
    }

    return outputLevel
  }

  /**
   * A random true/false output base on success rate.
   * @param successRate between 0 and 1
   */
  static takeChance(successRate: number): boolean {
    if (successRate <= 0) {
      return false
    }
    if (successRate >= 1) {
      return true
    }
    return Math.random() < successRate
  }

  /**
   * @returns {number} float value
   */
  static randomBoxMuller(min: number, max: number, skew = 1): number {
    let u = 0
    let v = 0
    while (u === 0) {
      u = Math.random()
    }
    while (v === 0) {
      v = Math.random()
    }
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) {
      // re-sample to ensure the value is between 0 and 1
      num = RandomHelper.randomBoxMuller(min, max, skew)
    }

    num = Math.pow(num, skew)
    num *= max - min
    num += min
    return num
  }

  static weightedRandomIndex(weightArr: number[]): number {
    if (weightArr.length < 2) {
      throw new Error('Invalid weightArr length.')
    }

    const weightSum = sum(weightArr)
    const rand = random(0, weightSum, true)

    let accumulateWeight = 0
    for (let i = 0; i < weightArr.length; i++) {
      accumulateWeight += weightArr[i]
      if (rand < accumulateWeight) {
        return i
      }
    }

    throw new Error('Failed to correctly generate weighted random index.')
  }
}
