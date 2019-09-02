import { PossessionItem } from 'src/common/interfaces'
import { tonics } from './possession-tonic'
import { drops } from './possession-drops'

// prettier-ignore
export const possessions: PossessionItem[] = [
  ...tonics,
  ...drops,
]
