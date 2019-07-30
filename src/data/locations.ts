import { PriceMultiplierItem, QuestItem, DungeonTemplateItem } from 'src/common/interfaces'

export interface LocationItem {
  key: string
  name: string
  flavor: string
  levelRequired: number
  dungeon?: DungeonTemplateItem
  alchemist?: PriceMultiplierItem[]
  merchant?: PriceMultiplierItem[]
  questGiver?: QuestItem[]
}

export const locations: LocationItem[] = [
  {
    key: 'abbotsford-cave',
    name: 'Abbotsford Cave',
    flavor: 'Used to be occupied by regional smugglers, but now abandoned and left as home for small critters.',
    levelRequired: 1,
    dungeon: {
      mobKeys: ['slime', 'rat', 'ferret'],
      mobLevelBase: 1,
      mobLevelHalfRange: 2,
      mobLevelSkew: 1,
    },
  },
  {
    key: 'balias-village',
    name: 'Balias Village',
    flavor: 'Locates right on the southern edge the Abbotsford domain, known for its agriculture and gateway between the capital and numbers of exploration opportunities.',
    levelRequired: 2,
    alchemist: [
      // { key: 'slimeball', priceMultiplier: 2 },
      // { key: 'medicinal-herb', priceMultiplier: 0 },
    ],
    merchant: [{ key: 'potion', multiplier: 1 }],
    questGiver: [
      {
        key: 'proof-of-courage',
        name: 'Proof of Courage',
        conversation: 'We welcome adventurers here in Balias Village. If you can bring me some proof of mob kills, I will provide you a very essential ability to progress your journey.',
        requestItems: [{ key: 'small-critter-paw', quantity: 3 }],
        rewardItems: [{ key: 'relic-auto-battle', quantity: 1 }],
        prerequisiteQuests: [],
      },
      {
        key: 'slime-collection',
        name: 'Slime Collection',
        conversation: 'At remote location like here, slime is essential ingredient for everyday medicine, however we been short of slime for sometime and would be great if you can help us gathering some.',
        requestItems: [{ key: 'slimeball', quantity: 5 }],
        rewardItems: [{ key: 'potion', quantity: 10 }],
        prerequisiteQuests: [],
      },
      {
        key: 'slime-collection-2',
        name: 'Slime Collection 2',
        conversation: 'You did an excellent job, now if you can find us more slime...',
        requestItems: [{ key: 'slimeball', quantity: 10 }],
        rewardItems: [{ key: 'hi-potion', quantity: 5 }],
        prerequisiteQuests: ['slime-collection'],
      },
      {
        key: 'slime-collection-3',
        name: 'Slime Collection 3',
        conversation: 'Now if you can just gather all the stock we need for the season, I can reward you with something quite rare.',
        requestItems: [{ key: 'slimeball', quantity: 15 }],
        rewardItems: [{ key: 'relic-inner-strength', quantity: 1 }],
        prerequisiteQuests: ['slime-collection-2'],
      },
    ],
  },
  {
    key: 'collada-cavern',
    name: 'Collada Cavern',
    flavor: 'A below water level cave system contains covered with various types of minerals.',
    levelRequired: 4,
    dungeon: {
      mobKeys: ['slime', 'rat', 'fat-rat', 'cursed-rock', 'combat-caterpillar'],
      mobLevelBase: 6,
      mobLevelHalfRange: 2,
      mobLevelSkew: 1,
    },
  },
  // {
  //   key: 'dorters-mine',
  //   name: `Dorter's Mine`,
  //   flavor: 'As regional economy decayed, there has not been many visit this area.',
  //   levelRequired: 7,
  //   mobKeys: ['ferret', 'rat', 'combat-caterpillar'],
  //   mobBaseLevel: 10,
  // },
]
