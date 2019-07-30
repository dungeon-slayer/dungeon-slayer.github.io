export interface DropRateItem {
  dropKey: string
  dropRate: number
}

export interface MobTemplate {
  key: string
  name: string
  flavor: string
  hpBase: number
  hpLevelMultiplier: number
  attackBase: number
  attackLevelMultiplier: number
  defenseBase: number
  defenseLevelMultiplier: number
  chargeTimeTs: number
  awardExpMultiplier: number
  dropRates: DropRateItem[]
}

export const mobTemplates: MobTemplate[] = [
  {
    key: 'slime',
    name: 'Slime',
    flavor: 'Common creature seen all over the world, no one knows its origin.',
    hpBase: 50,
    hpLevelMultiplier: 15,
    attackBase: 5,
    attackLevelMultiplier: 1.6,
    defenseBase: 5,
    defenseLevelMultiplier: 1.3,
    chargeTimeTs: 1500,
    awardExpMultiplier: 1,
    dropRates: [{ dropKey: 'slimeball', dropRate: 0.7 }],
  },
  {
    key: 'rat',
    name: 'Rat',
    flavor: 'Small common living creature that scavenges on almost anything.',
    hpBase: 45,
    hpLevelMultiplier: 15,
    attackBase: 5.5,
    attackLevelMultiplier: 1.5,
    defenseBase: 3,
    defenseLevelMultiplier: 1.3,
    chargeTimeTs: 1500,
    awardExpMultiplier: 1,
    dropRates: [{ dropKey: 'small-critter-tail', dropRate: 0.7 }],
  },
  {
    key: 'combat-caterpillar',
    name: 'Combat Caterpillar',
    flavor: 'Rather ambitious bug for its size.',
    hpBase: 30,
    hpLevelMultiplier: 15,
    attackBase: 4.5,
    attackLevelMultiplier: 1.1,
    defenseBase: 14,
    defenseLevelMultiplier: 2.4,
    chargeTimeTs: 1500,
    awardExpMultiplier: 1,
    dropRates: [{ dropKey: 'medicinal-herb', dropRate: 0.7 }],
  },
  {
    key: 'ferret',
    name: 'Ferret',
    flavor: 'Usually passive, unless it encounter threats in its territory.',
    hpBase: 75,
    hpLevelMultiplier: 18,
    attackBase: 5,
    attackLevelMultiplier: 1.8,
    defenseBase: 3,
    defenseLevelMultiplier: 1.1,
    chargeTimeTs: 1500,
    awardExpMultiplier: 1,
    dropRates: [{ dropKey: 'small-critter-paw', dropRate: 0.7 }],
  },
  {
    key: 'fat-rat',
    name: 'Fat Rat',
    flavor: 'Well feasted common rat.',
    hpBase: 90,
    hpLevelMultiplier: 18,
    attackBase: 5,
    attackLevelMultiplier: 1.4,
    defenseBase: 3,
    defenseLevelMultiplier: 1.3,
    chargeTimeTs: 1800,
    awardExpMultiplier: 1,
    dropRates: [{ dropKey: 'small-critter-tail', dropRate: 0.8 }],
  },
  {
    key: 'cursed-rock',
    name: 'Cursed Rock',
    flavor: 'Moved by ill will, attacks any living being close to it.',
    hpBase: 75,
    hpLevelMultiplier: 18,
    attackBase: 5,
    attackLevelMultiplier: 1.8,
    defenseBase: 6.5,
    defenseLevelMultiplier: 2,
    chargeTimeTs: 2500,
    awardExpMultiplier: 1,
    dropRates: [{ dropKey: 'ethereal-pebble', dropRate: 0.7 }],
  },
]
