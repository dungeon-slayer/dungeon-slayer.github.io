import { CharacterEffectItem } from 'src/common/interfaces'

export interface ConsumableItem {
  key: string
  name: string
  flavor: string
  basePrice: number
  effect: CharacterEffectItem
}

export const consumables: ConsumableItem[] = [
  {
    key: 'potion',
    name: 'Potion',
    flavor: 'Medicine that restores HP.',
    basePrice: 50,
    effect: {
      hpModifier: 60,
    },
  },
  {
    key: 'hi-potion',
    name: 'Hi-Potion',
    flavor: 'Medicine that restores HP. More effective than a standard Potion',
    basePrice: 200,
    effect: {
      hpModifier: 200,
    },
  },
  {
    key: 'relic-auto-battle',
    name: 'Relic of Auto Battle',
    flavor: `Magic stone holds the power of 'Auto Battle' ability.`,
    basePrice: 0,
    effect: {
      gainAbilities: ['auto-battle'],
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
