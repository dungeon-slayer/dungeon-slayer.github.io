import { toNumber, isNaN } from 'lodash'

export class CastHelper {
  static toString(val: string | undefined, defaultValue = ''): string {
    return val || defaultValue
  }

  static toNumber(val: string | undefined, defaultValue = 0): number {
    const num = toNumber(val)
    if (isNaN(num)) {
      return defaultValue
    }
    return num
  }

  static toBoolean(val: string | undefined, defaultValue = false): boolean {
    if (val === 'true') {
      return true
    } else if (val === 'false') {
      return false
    } else {
      return defaultValue
    }
  }
}
