import { PriceMultiplierItem, QuestItem, DungeonTemplateItem } from 'src/common/interfaces'

export interface LocationItem {
  key: string
  name: string
  flavor: string
  levelRequired: number
  consumeRequired: string[]
  dungeon?: DungeonTemplateItem
  alchemist?: PriceMultiplierItem[]
  merchant?: PriceMultiplierItem[]
  questGiver?: QuestItem[]
}

export const locations: LocationItem[] = [
  {
    key: 'abbotsford-cave',
    name: 'Abbotsford Cave',
    // flavor: 'Used to be occupied by regional smugglers, but now abandoned and left as home for small critters.',
    flavor: 'Basic dungeon with mostly harmless creatures.',
    levelRequired: 1,
    consumeRequired: [],
    dungeon: {
      // prettier-ignore
      mobAppearances: [
        { key: 'slime', appearanceRate: 0.6 },
        { key: 'rat', appearanceRate: 0.6 },
        { key: 'ferret', appearanceRate: 1 },
      ],
      mobLevelBase: 1,
      mobLevelHalfRange: 1,
      mobLevelSkew: 1,
    },
  },
  {
    key: 'balias-village',
    name: 'Balias Village',
    // flavor: 'Locates on the southern edge of the Abbotsford domain, known for its agriculture and gateway between the capital and numbers of exploration opportunities.',
    flavor: '',
    levelRequired: 2,
    consumeRequired: [],
    alchemist: [
      // { key: 'slimeball', multiplier: 2 },
      // { key: 'medicinal-herb', multiplier: 0 },
    ],
    merchant: [{ key: 'potion', multiplier: 1 }],
    questGiver: [
      {
        key: 'proof-of-courage',
        name: 'Proof of Courage',
        conversation: '',
        // conversation: 'We welcome adventurers here in Balias Village. If you can bring me some proof of mob kills, I will provide you a very essential ability to progress your journey.',
        requestItems: [{ key: 'small-critter-paw', quantity: 3 }],
        rewardItems: [{ key: 'relic-inner-strength', quantity: 1 }],
        prerequisiteQuests: [],
      },
      {
        key: 'slime-collection',
        name: 'Slime Collection',
        conversation: '',
        // conversation: 'At remote location like here, slime is essential ingredient for everyday medicine, however we been short of slime for sometime and would be great if you can help us gathering some.',
        requestItems: [{ key: 'slimeball', quantity: 5 }],
        rewardItems: [{ key: 'potion', quantity: 10 }],
        prerequisiteQuests: [],
      },
      {
        key: 'slime-collection-2',
        name: 'Slime Collection 2',
        conversation: '',
        // conversation: 'You did an excellent job, now if you can find us more slime...',
        requestItems: [{ key: 'slimeball', quantity: 10 }],
        rewardItems: [{ key: 'hi-potion', quantity: 5 }],
        prerequisiteQuests: ['slime-collection'],
      },
      {
        key: 'slime-collection-3',
        name: 'Slime Collection 3',
        conversation: '',
        // conversation: 'Now if you can just gather all the stock we need for the season, I can reward you with something quite rare.',
        requestItems: [{ key: 'slimeball', quantity: 15 }],
        rewardItems: [{ key: 'hi-potion', quantity: 10 }],
        prerequisiteQuests: ['slime-collection-2'],
      },
      {
        key: 'rat-problem',
        name: 'Rat Problem',
        conversation: '',
        // conversation: 'There has been bit of plague scare, we will reward you if for exterminate some for us.',
        requestItems: [{ key: 'small-critter-tail', quantity: 10 }],
        rewardItems: [{ key: 'hi-potion', quantity: 2 }],
        prerequisiteQuests: ['proof-of-courage'],
      },
      {
        key: 'alchemist-study',
        name: `Alchemist's Study`,
        conversation: '',
        // conversation: 'Gather some ingredient for the alchemist research...',
        requestItems: [{ key: 'slimeball', quantity: 10 }, { key: 'ethereal-pebble', quantity: 10 }],
        rewardItems: [{ key: 'relic-focus-strike', quantity: 1 }],
        prerequisiteQuests: ['rat-problem'],
      },
      {
        key: 'stock-up',
        name: 'Stock Up',
        conversation: '',
        // conversation: 'Help merchant gather some materials before he is ready for his trip.',
        requestItems: [{ key: 'slimeball', quantity: 10 }, { key: 'medicinal-herb', quantity: 10 }],
        rewardItems: [{ key: 'relic-focus-strength', quantity: 1 }],
        prerequisiteQuests: ['rat-problem'],
      },
      {
        key: 'proof-of-dedication',
        name: 'Proof of Dedication',
        conversation: '',
        // conversation: 'Many wishes to have encounter the regional mystical creature, and I may just have the right item for you.',
        requestItems: [{ key: 'slimeball', quantity: 20 }, { key: 'catnip', quantity: 15 }, { key: 'glass-nugget', quantity: 15 }],
        rewardItems: [{ key: 'horn-kolift', quantity: 1 }],
        prerequisiteQuests: ['proof-of-courage'],
      },
      {
        key: 'depiction-of-dedication',
        name: 'Depiction of Dedication',
        conversation: '',
        requestItems: [{ key: 'kolifts-scale', quantity: 1 }],
        rewardItems: [{ key: 'map-earley', quantity: 1 }],
        prerequisiteQuests: ['proof-of-dedication'],
      },
      {
        key: 'dodge-question',
        name: 'Dodge the Question',
        conversation: '',
        // conversation: 'Lorem ipsum dolor sit.',
        requestItems: [{ key: 'slimeball', quantity: 10 }, { key: 'medicinal-herb', quantity: 10 }],
        rewardItems: [{ key: 'relic-evasion', quantity: 1 }],
        prerequisiteQuests: ['rat-problem'],
      },
      {
        key: 'quick-getaway',
        name: 'Quick Getaway',
        conversation: '',
        // conversation: 'Lorem ipsum dolor sit.',
        requestItems: [{ key: 'small-critter-tail', quantity: 10 }, { key: 'catnip', quantity: 5 }],
        rewardItems: [{ key: 'relic-quicken', quantity: 1 }],
        prerequisiteQuests: ['rat-problem'],
      },
      {
        key: 'measure-endurance',
        name: 'Measure of Endurance',
        conversation: '',
        // conversation: 'Lorem ipsum dolor sit.',
        requestItems: [{ key: 'glass-nugget', quantity: 15 }],
        rewardItems: [{ key: 'relic-devotion', quantity: 1 }],
        prerequisiteQuests: ['rat-problem'],
      },
      {
        key: 'trust-faith',
        name: 'Trust & Faith',
        conversation: '',
        // conversation: 'Lorem ipsum dolor sit.',
        requestItems: [{ key: 'ethereal-pebble', quantity: 20 }, { key: 'catnip', quantity: 15 }, { key: 'glass-nugget', quantity: 15 }],
        rewardItems: [{ key: 'relic-enlightenment', quantity: 1 }],
        prerequisiteQuests: ['measure-endurance'],
      },
    ],
  },
  {
    key: 'collada-cavern',
    name: 'Collada Cavern',
    // flavor: 'A below water level cave system contains covered with various types of minerals.',
    flavor: 'Dungeon with some defense oriented mobs.',
    levelRequired: 3,
    consumeRequired: [],
    dungeon: {
      // prettier-ignore
      mobAppearances: [
        { key: 'slime', appearanceRate: 1 },
        { key: 'rat', appearanceRate: 1 },
        { key: 'fat-rat', appearanceRate: 1 },
        { key: 'cursed-rock', appearanceRate: 1 },
        { key: 'combat-caterpillar', appearanceRate: 1 },
      ],
      mobLevelBase: 6,
      mobLevelHalfRange: 2,
      mobLevelSkew: 1,
    },
  },
  {
    key: 'dorters-mine',
    name: `Dorter's Mine`,
    // flavor: 'As regional economy decayed, there has not been many visit this area. Something else have taken residency in here instead.',
    flavor: 'Dungeon with mobs specialized in critical hits, also residency of Kolift.',
    levelRequired: 7,
    consumeRequired: [],
    dungeon: {
      // prettier-ignore
      mobAppearances: [
        { key: 'slime', appearanceRate: 1 },
        { key: 'ferret', appearanceRate: 1 },
        { key: 'hare', appearanceRate: 1 },
        { key: 'feral-cat', appearanceRate: 1 },
        { key: 'dash-ferret', appearanceRate: 1 },
      ],
      mobLevelBase: 11,
      mobLevelHalfRange: 2,
      mobLevelSkew: 1,
    },
  },
  {
    key: 'earley-village',
    name: 'Earley Village',
    flavor: '',
    levelRequired: 12,
    consumeRequired: ['map-earley'],
    alchemist: [],
    merchant: [{ key: 'potion', multiplier: 1 }, { key: 'hi-potion', multiplier: 1 }],
    questGiver: [
      {
        key: 'quick-fix',
        name: 'Quick Fix',
        conversation: '',
        requestItems: [{ key: 'slimeball', quantity: 20 }],
        rewardItems: [{ key: 'hi-potion', quantity: 10 }],
        prerequisiteQuests: [],
      },
      {
        key: 'toughen-up',
        name: 'Toughen Up',
        conversation: '',
        requestItems: [{ key: 'small-critter-paw', quantity: 20 }],
        rewardItems: [{ key: 'relic-inner-strength', quantity: 1 }],
        prerequisiteQuests: [],
      },
      {
        key: 'alchemist-bargain',
        name: 'Alchemist Bargain',
        conversation: '',
        requestItems: [{ key: 'medicinal-herb', quantity: 20 }],
        rewardItems: [{ key: 'relic-auto-potion', quantity: 1 }],
        prerequisiteQuests: [],
      },
    ],
  },
  {
    key: 'fennath-cave',
    name: `Fennath Cave`,
    // flavor: 'TBA',
    flavor: 'Dungeon with generic mobs.',
    levelRequired: 12,
    consumeRequired: ['map-earley'],
    dungeon: {
      // prettier-ignore
      mobAppearances: [
        { key: 'slime', appearanceRate: 1 },
        { key: 'bubbly-slime', appearanceRate: 0.6 },
        { key: 'fat-rat', appearanceRate: 1 },
        { key: 'dash-ferret', appearanceRate: 1 },
      ],
      mobLevelBase: 16,
      mobLevelHalfRange: 2,
      mobLevelSkew: 1,
    },
  },
  {
    key: 'gaddha-lagoon',
    name: `Gaddha Lagoon`,
    flavor: 'TBA',
    levelRequired: 18,
    consumeRequired: ['map-earley'],
    dungeon: {
      // prettier-ignore
      mobAppearances: [
        { key: 'slime', appearanceRate: 1 },
      ],
      mobLevelBase: 25,
      mobLevelHalfRange: 2,
      mobLevelSkew: 1,
    },
  },
]
