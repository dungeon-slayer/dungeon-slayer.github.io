export interface ConsumableItem {
  key: string
  name: string
  flavor: string
}

export const consumables: ConsumableItem[] = [
  {
    key: 'potion',
    name: 'Potion',
    flavor: 'Medicine that restores HP.',
  },
  {
    key: 'hi-potion',
    name: 'Hi-Potion',
    flavor: 'Medicine that restores HP. More effective than a standard Potion',
  },
]
