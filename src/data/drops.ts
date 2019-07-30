export interface DropItem {
  key: string
  name: string
  flavor: string
  basePrice: number
}

export const drops: DropItem[] = [
  {
    key: 'small-critter-tail',
    name: 'Small Critter Tail',
    flavor: 'Tail of common small creature.',
    basePrice: 8,
  },
  {
    key: 'medicinal-herb',
    name: 'Medicinal Herb',
    flavor: `Smells minty, doesn't hurt if you want to snack on it.`,
    basePrice: 8,
  },
  {
    key: 'slimeball',
    name: 'Slimeball',
    flavor: 'Pure, concentrated slime.',
    basePrice: 8,
  },
  {
    key: 'small-critter-paw',
    name: 'Small Critter Paw',
    flavor: 'Undamaged paw of common small creature.',
    basePrice: 11,
  },
  {
    key: 'ethereal-pebble',
    name: 'Ethereal Pebble',
    flavor: 'Small shinny stone that contains very low spiritual energy.',
    basePrice: 20,
  },
]
