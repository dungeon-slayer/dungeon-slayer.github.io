import { find, floor } from 'lodash'
// import * as Bows from 'bows'
import { PriceMultiplierItem, PossessionItem } from 'src/common/interfaces'

// const log = Bows('PriceMultiplierHelper')

export class PriceMultiplierHelper {
  static getPriceMultiplierValue(priceMultiplierItems: PriceMultiplierItem[], possession: PossessionItem): number {
    const priceMultiplierItem = find(priceMultiplierItems, (pm) => pm.key === possession.key)
    if (!priceMultiplierItem) {
      return 1
    }
    if (priceMultiplierItem.multiplier <= 0) {
      return 0
    }
    return priceMultiplierItem.multiplier
  }

  static calculatePrice(basePrice: number, multiplier: number, quantity = 1): number {
    return floor(basePrice * multiplier * quantity)
  }
}
