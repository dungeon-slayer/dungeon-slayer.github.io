import { random, padStart } from 'lodash'

export class RandomHelper {
  static generateId(prefix = ''): string {
    const id = prefix + padStart(random(999999).toString(), 6, '0')
    return id
  }

  static generateLevel(baseLevel: number): number {
    const rand = Math.random()
    let modifier: number

    if (rand < 0.1) {
      modifier = -2
    } else if (rand < 0.3) {
      modifier = -1
    } else if (rand < 0.7) {
      modifier = 0
    } else if (rand < 0.9) {
      modifier = 1
    } else {
      modifier = 2
    }

    const lvl = baseLevel + modifier
    return lvl < 1 ? 1 : lvl
  }
}
