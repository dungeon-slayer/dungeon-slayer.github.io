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
    hpBase: 65,
    hpLevelModifier: 15,
    attackBase: 7,
    attackLevelModifier: 1.6,
    defenseBase: 5,
    defenseLevelModifier: 1.3,
    chargeTimeTs: 1500,
    awardExpModifier: 1,
  },
  {
    key: 'rat',
    name: 'Rat',
    hpBase: 45,
    hpLevelModifier: 15,
    attackBase: 9,
    attackLevelModifier: 1.5,
    defenseBase: 3,
    defenseLevelModifier: 1.3,
    chargeTimeTs: 1500,
    awardExpModifier: 1,
  },
  {
    key: 'combat-caterpillar',
    name: 'Combat Caterpillar',
    hpBase: 40,
    hpLevelModifier: 15,
    attackBase: 6,
    attackLevelModifier: 1.5,
    defenseBase: 4,
    defenseLevelModifier: 1.3,
    chargeTimeTs: 1500,
    awardExpModifier: 1,
  },
  {
    key: 'ferret',
    name: 'Ferret',
    hpBase: 85,
    hpLevelModifier: 15,
    attackBase: 7,
    attackLevelModifier: 1.8,
    defenseBase: 4,
    defenseLevelModifier: 1.1,
    chargeTimeTs: 1500,
    awardExpModifier: 1,
  },
]
