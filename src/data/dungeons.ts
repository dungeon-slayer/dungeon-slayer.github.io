export interface DungeonItem {
  key: string
  name: string
  flavor: string
  levelRequired: number
  mobKeys: string[]
  mobBaseLevel: number
}

export const dungeons: DungeonItem[] = [
  {
    key: 'abbotsford-cave',
    name: 'Abbotsford Cave',
    flavor: 'Used to be occupied by regional smugglers, but now abandoned and left as home for small critters.',
    levelRequired: 1,
    mobKeys: ['slime', 'rat'],
    mobBaseLevel: 1,
  },
  {
    key: 'collada-cavern',
    name: 'Collada Cavern',
    flavor: 'A below water level cave system contains covered with various types of minerals.',
    levelRequired: 3,
    mobKeys: ['slime', 'rat', 'combat-caterpillar'],
    mobBaseLevel: 4,
  },
  {
    key: 'dorters-mine',
    name: `Dorter's Mine`,
    flavor: 'As regional economy decayed, there has not been many visit this area.',
    levelRequired: 9,
    mobKeys: ['ferret', 'rat', 'combat-caterpillar'],
    mobBaseLevel: 12,
  },
]
