export interface MobTemplate {
  key: string
  name: string
  hpBase: number
  hpLevelModifier: number
  attackBase: number
  attackLevelModifier: number
  defenseBase: number
  defenseLevelModifier: number
  chargeTimeTs: number
  awardExpModifier: number
}

export const mobTemplates: MobTemplate[] = [
  {
    key: 'slime',
    name: 'Slime',
    hpBase: 40,
    hpLevelModifier: 15,
    attackBase: 3,
    attackLevelModifier: 1.6,
    defenseBase: 5,
    defenseLevelModifier: 1.3,
    chargeTimeTs: 2000,
    awardExpModifier: 1,
  },
  {
    key: 'rat',
    name: 'Rat',
    hpBase: 40,
    hpLevelModifier: 15,
    attackBase: 6,
    attackLevelModifier: 1.7,
    defenseBase: 5,
    defenseLevelModifier: 1.3,
    chargeTimeTs: 2000,
    awardExpModifier: 1,
  },
  {
    key: 'combat-caterpillar',
    name: 'Combat Caterpillar',
    hpBase: 40,
    hpLevelModifier: 15,
    attackBase: 6,
    attackLevelModifier: 1.7,
    defenseBase: 5,
    defenseLevelModifier: 1.3,
    chargeTimeTs: 2000,
    awardExpModifier: 1,
  },
  {
    key: 'ferret',
    name: 'Ferret',
    hpBase: 40,
    hpLevelModifier: 15,
    attackBase: 6,
    attackLevelModifier: 1.7,
    defenseBase: 5,
    defenseLevelModifier: 1.3,
    chargeTimeTs: 2000,
    awardExpModifier: 1,
  },
]
