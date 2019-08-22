import { ConsumableEffectItem } from 'src/common/interfaces'

export interface ConsumableItem {
  key: string
  name: string
  flavor: string
  basePrice: number
  effect: ConsumableEffectItem
}

export const consumables: ConsumableItem[] = [
  {
    key: 'potion',
    name: 'Potion',
    flavor: 'Medicine that restores 60 HP.',
    basePrice: 50,
    effect: {
      hpModifier: 60,
    },
  },
  {
    key: 'hi-potion',
    name: 'Hi-Potion',
    flavor: 'Medicine that restores 200 HP.',
    basePrice: 200,
    effect: {
      hpModifier: 200,
    },
  },
  {
    key: 'relic-inner-strength',
    name: 'Relic of Inner Strength',
    flavor: `Magic stone holds the power of 'Inner Strength' ability.`,
    basePrice: 0,
    effect: {
      gainAbilities: ['inner-strength'],
    },
  },
  {
    key: 'relic-focus-strike',
    name: 'Relic of Focus Strike',
    flavor: `Magic stone holds the power of 'Focus Strike' ability.`,
    basePrice: 0,
    effect: {
      gainAbilities: ['focus-strike'],
    },
  },
  {
    key: 'relic-focus-strength',
    name: 'Relic of Focus Strength',
    flavor: `Magic stone holds the power of 'Focus Strength' ability.`,
    basePrice: 0,
    effect: {
      gainAbilities: ['focus-strength'],
    },
  },
  {
    key: 'relic-evasion',
    name: 'Relic of Evasion',
    flavor: `Magic stone holds the power of 'Evasion' ability.`,
    basePrice: 0,
    effect: {
      gainAbilities: ['evasion'],
    },
  },
  {
    key: 'relic-quicken',
    name: 'Relic of Quicken',
    flavor: `Magic stone holds the power of 'Quicken' ability.`,
    basePrice: 0,
    effect: {
      gainAbilities: ['quicken'],
    },
  },
  {
    key: 'relic-devotion',
    name: 'Relic of Devotion',
    flavor: `Magic stone holds the power of 'Devotion' ability.`,
    basePrice: 0,
    effect: {
      gainAbilities: ['devotion'],
    },
  },
  {
    key: 'relic-enlightenment',
    name: 'Relic of Enlightenment',
    flavor: `Magic stone holds the power of 'Enlightenment' ability.`,
    basePrice: 0,
    effect: {
      gainAbilities: ['enlightenment'],
    },
  },
  {
    key: 'horn-kolift',
    name: 'Horn of Kolift',
    flavor: 'A blow horn used to summon Kolift from his residency.',
    basePrice: 0,
    effect: {},
  },
  {
    key: 'map-earley',
    name: 'Map of Earley',
    flavor: '',
    basePrice: 0,
    effect: {},
  },

  // God tier items
  {
    key: 'relic-divine-strength',
    name: '',
    flavor: '',
    basePrice: 0,
    effect: {
      gainAbilities: ['divine-strength'],
    },
  },
  {
    key: 'relic-divine-speed',
    name: '',
    flavor: '',
    basePrice: 0,
    effect: {
      gainAbilities: ['divine-speed'],
    },
  },
]
