import { CharacterEffectItem } from 'src/common/interfaces'

export interface AbilityItem {
  key: string
  name: string
  flavor: string
  apCost: number
  effect: CharacterEffectItem
}

export const abilities: AbilityItem[] = [
  {
    key: 'auto-battle',
    name: 'Auto Battle',
    flavor: 'Pick a battle automatically when idle.',
    apCost: 20,
    effect: {},
  },
  {
    key: 'inner-strength',
    name: 'Inner Strength',
    flavor: 'Increase base attack power by 10%.',
    apCost: 20,
    effect: {
      attackMultiplier: 1.1,
    },
  },
  {
    key: 'focus-strike',
    name: 'Focus Strike',
    flavor: 'Increase chance of critical hit to 20%.',
    apCost: 20,
    effect: {},
  },
  {
    key: 'focus-strength',
    name: 'Focus Strength',
    flavor: 'Increase critical hit bonus to 40%.',
    apCost: 20,
    effect: {},
  },
  {
    key: 'evasion',
    name: 'Evasion',
    flavor: '15% chance to dodge an attack.',
    apCost: 20,
    effect: {
      evasionMultiplier: 0.15,
    },
  },
  {
    key: 'quicken',
    name: 'Quicken',
    flavor: 'Reduce required turn charge time by 5%.',
    apCost: 40,
    effect: {
      chargeTimeMultiplier: 0.95,
    },
  },
  {
    key: 'enlightenment',
    name: 'Enlightenment',
    flavor: '5% bonus experience point.',
    apCost: 60,
    effect: {
      experienceMultiplier: 1.05,
    },
  },
  {
    key: 'devotion',
    name: 'Devotion',
    flavor: 'Increase base defense power by 10%.',
    apCost: 20,
    effect: {
      defenseMultiplier: 1.1,
    },
  },
  // {
  //   key: 'auto-potion',
  //   name: 'Auto Potion',
  //   flavor: '30% chance of use a recovery item when hit.',
  //   apCost: 40,
  //   effect: {},
  // },

  // God tier abilities
  {
    key: 'divine-strength',
    name: 'Divine Strength',
    flavor: 'Increase base attack power by 1000 times.',
    apCost: 20,
    effect: {
      attackMultiplier: 1000,
    },
  },
  {
    key: 'divine-speed',
    name: 'Divine Speed',
    flavor: 'Increase attack frequency by 4 times.',
    apCost: 20,
    effect: {
      chargeTimeMultiplier: 0.25,
    },
  },
]
