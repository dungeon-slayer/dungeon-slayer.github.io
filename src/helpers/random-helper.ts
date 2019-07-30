import { random, padStart } from 'lodash'

export class RandomHelper {
  static generateId(prefix = ''): string {
    const id = prefix + padStart(random(999999).toString(), 6, '0')
    return id
  }

  // static generateLevel(baseLevel: number): number {
  //   const rand = Math.random()
  //   let modifier: number

  //   if (rand < 0.1) {
  //     modifier = -2
  //   } else if (rand < 0.3) {
  //     modifier = -1
  //   } else if (rand < 0.7) {
  //     modifier = 0
  //   } else if (rand < 0.9) {
  //     modifier = 1
  //   } else {
  //     modifier = 2
  //   }

  //   const lvl = baseLevel + modifier
  //   return lvl < 1 ? 1 : lvl
  // }

  static rollDice(successRate: number): boolean {
    return Math.random() < successRate
  }

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
}
