export interface LoreItem {
  category: 'level' | 'quest' | 'drop' | 'custom'
  key: string
  message: string
}

export const lores: LoreItem[] = [
  // System Lores
  {
    category: 'custom',
    key: 'NEW_GAME',
    // message: "Many adventurers journey deep into the demon's realm to fight aginst the demon king. You consider yourself ready and ventures on to the starting point of the adventure.",
    message: `A new game has started.`,
  },
  {
    category: 'custom',
    key: 'CONTINUE_GAME',
    // message: `With some rest, you felt you are ready to onward journey.`,
    message: `Continuing the game from previous save.`,
  },
  {
    category: 'custom',
    key: 'SAVE_UPGRADE',
    // message: 'You sense a disturbance in the air tho the tumbling has already stopped. You decided to not pay attention to it.',
    message: `New release detected. (no action required)`,
  },
  {
    category: 'custom',
    key: 'GAME_RESET',
    // message: 'The turbulence of space-time continuum causing all living being to blackout. When you wake up, it was as everything you been through so far was all a dream...',
    message: `New release detected. Your old save is out-of-date and need to start the game fresh.`,
  },

  // Boss Lores
  {
    category: 'custom',
    key: 'CALL_KOLIFT',
    // message: `With deep sound of the horn, ancient creature <strong>Kolift</strong> has awoken to your call.`,
    message: `You have summoned <strong>Kolift</strong> (boss). It now appears in the dungeon.`,
  },

  // Progression Lores
  {
    category: 'level',
    key: '2',
    // message: 'After few mob kills, you reassured your capability. It is time to head to Balias Village seek out for quests.',
    message: `Your first village <strong>Balias Village</strong> is now on the map. You can buy, sell and do quests over there.`,
  },
  {
    category: 'quest',
    key: 'proof-of-courage',
    // message: `Holding on to the relic won't give you much use, you consider to release its power and claim it as your own as soon as possible.`,
    message: `You have obtained a <strong>relic</strong>. You can 'use' the item to obtain its contained ability.`,
  },
  // {
  //   category: 'quest',
  //   key: 'slime-collection-3',
  //   // message: `Another powerful relic obtained. You begin to understand the importance of pressing through various of quests as there's no telling what kind of rewards awaits you.`,
  //   message: `You have obtained another <strong>relic</strong> through completion of a series of quest.`,
  // },
  {
    category: 'level',
    key: '3',
    // message: 'You acquired knowledge to get to Collada Cavern, you will be able to acquire more resources to further your adventure.',
    message: `<strong>Collada Cavern</strong> is now on your map. It contains mobs with strong defense.`,
  },
  {
    category: 'level',
    key: '7',
    message: `<strong>Dorter's Mine</strong> is now on your map. It contains mobs with fast attack and critical hit ability.`,
  },
  {
    category: 'drop',
    key: 'kolifts-scale',
    // message: `After defeated Kolift, you obtained a whole piece of its scale. Certain this may helps out on quest, or perhaps you can save it for later on.`,
    message: `You have obtained <strong>Kolift's Scale</strong>. You can exchange this for a map.`,
  },
  {
    category: 'quest',
    key: 'depiction-of-dedication',
    message: `You have obtained <strong>Map of Earley</strong>. By using the item, you will have the knowledge on its location.`,
  },
]
