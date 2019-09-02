import { PossessionItem } from 'src/common/interfaces'

export const tonics: PossessionItem[] = [
  {
    key: 'potion',
    name: 'Potion',
    type: 'tonic',
    flavor: 'Medicine that restores 60 HP.',
    basePrice: 50,
    effect: {
      hpModifier: 60,
    },
  },
  {
    key: 'hi-potion',
    name: 'Hi-Potion',
    type: 'tonic',
    flavor: 'Medicine that restores 200 HP.',
    basePrice: 200,
    effect: {
      hpModifier: 200,
    },
  },
]
