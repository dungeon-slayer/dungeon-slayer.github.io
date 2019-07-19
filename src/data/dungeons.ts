export interface DungeonItem {
  key: string
  name: string
  levelRequired: number
  mobKeys: string[]
  mobBaseLevel: number
}

export const dungeons: DungeonItem[] = [
  {
    key: 'mandalia-cave',
    name: 'Mangalia Cave',
    levelRequired: 1,
    mobKeys: ['slime', 'rat'],
    mobBaseLevel: 1,
  },
  {
    key: 'zeklaus-cavern',
    name: "Zeklau's Cavern",
    levelRequired: 3,
    mobKeys: ['slime', 'rat', 'combat-caterpillar'],
    mobBaseLevel: 4,
  },
  {
    key: 'lenalian-mine',
    name: 'Lenalian Mine',
    levelRequired: 9,
    mobKeys: ['ferret', 'rat', 'combat-caterpillar'],
    mobBaseLevel: 12,
  },
]

/**
 * Suffix ideas:
 * - Sewage
 * - Waterway
 * - Wasteway
 * - Canyon
 */
