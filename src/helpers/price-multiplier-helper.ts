import { find, floor } from 'lodash'
// import * as Bows from 'bows'
import { PriceMultiplierItem } from 'src/common/interfaces'
import { DropItem } from 'src/data'

// const log = Bows('PriceMultiplierHelper')

export class PriceMultiplierHelper {
  static getPriceMultiplierValue(priceMultiplierItems: PriceMultiplierItem[], drop: DropItem): number {
    const priceMultiplierItem = find(priceMultiplierItems, (pm) => pm.key === drop.key)
    if (!priceMultiplierItem) {
      return 1
    }
    if (priceMultiplierItem.multiplier <= 0) {
      return 0
    }
    return priceMultiplierItem.multiplier
  }

  static calculatePrice(basePrice: number, multiplier: number): number {
    return floor(basePrice * multiplier)
  }
}
