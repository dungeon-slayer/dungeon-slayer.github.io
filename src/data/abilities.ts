import { CharacterEffectItem } from 'src/common/interfaces'

export interface AbilityItem {
  key: string
  name: string
  flavor: string
  effect: CharacterEffectItem
}

export const abilities: AbilityItem[] = [
  {
    key: 'auto-battle',
    name: 'Auto Battle',
    flavor: 'Pick a battle automatically when idle.',
    effect: {},
  },
  {
    key: 'inner-strength',
    name: 'Inner Strength',
    flavor: 'Increase base attack power by 10%.',
    effect: {
      attackMultiplier: 1.1,
    },
  },

  // God tier abilities
  {
    key: 'divine-strength',
    name: 'Divine Strength',
    flavor: 'Increase base attack power by 1000 times.',
    effect: {
      attackMultiplier: 1000,
    },
  },
  {
    key: 'divine-speed',
    name: 'Divine Speed',
    flavor: 'Increase attack frequency by 4 times.',
    effect: {
      chargeTimeMultiplier: 0.25,
    },
  },
]
