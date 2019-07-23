export interface AbilityItem {
  key: string
  name: string
  flavor: string
}

export const abilities: AbilityItem[] = [
  {
    key: 'auto-battle',
    name: 'Auto Battle',
    flavor: 'Pick a battle automatically when idle.',
  },
]
