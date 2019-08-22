import { AbilityEffectItem } from 'src/common/interfaces'

export interface AbilityItem {
  key: string
  name: string
  flavor: string
  apCost: number
  effect: AbilityEffectItem
}

export const abilities: AbilityItem[] = [
  {
    key: 'inner-strength',
    name: 'Inner Strength',
    flavor: 'Increase base attack power by [%].',
    apCost: 20,
    effect: {
      attackBaseMultiplier: 0,
      attackLevelMultiplier: 0.1,
    },
  },
  {
    key: 'focus-strike',
    name: 'Focus Strike',
    flavor: 'Increase critical hit chance to [%].',
    apCost: 20,
    effect: {
      criticalChanceBaseMultiplier: 0.08,
      criticalChanceLevelMultiplier: 0.07,
    },
  },
  {
    key: 'focus-strength',
    name: 'Focus Strength',
    flavor: 'Increase critical hit bonus to [%].',
    apCost: 20,
    effect: {
      criticalBonusBaseMultiplier: 0.16,
      criticalBonusLevelMultiplier: 0.12,
    },
  },
  {
    key: 'evasion',
    name: 'Evasion',
    flavor: 'Increase evasion chance to [%].',
    apCost: 20,
    effect: {
      evasionBaseMultiplier: 0.11,
      evasionLevelMultiplier: 0.04,
    },
  },
  {
    key: 'quicken',
    name: 'Quicken',
    flavor: 'Reduce required turn charge time by [%].',
    apCost: 40,
    effect: {
      chargeTimeBaseMultiplier: 0,
      chargeTimeLevelMultiplier: -0.05,
    },
  },
  {
    key: 'enlightenment',
    name: 'Enlightenment',
    flavor: 'Increase experience point by [%].',
    apCost: 40,
    effect: {
      experienceBaseMultiplier: 0.02,
      experienceLevelMultiplier: 0.08,
    },
  },
  {
    key: 'devotion',
    name: 'Devotion',
    flavor: 'Increase base defense power by [%].',
    apCost: 20,
    effect: {
      defenseBaseMultiplier: 0.06,
      defenseLevelMultiplier: 0.04,
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
      attackBaseMultiplier: 1000,
      attackLevelMultiplier: 0,
    },
  },
  {
    key: 'divine-speed',
    name: 'Divine Speed',
    flavor: 'Increase attack frequency by 4 times.',
    apCost: 20,
    effect: {
      chargeTimeBaseMultiplier: -0.75,
      chargeTimeLevelMultiplier: 0,
    },
  },
]
