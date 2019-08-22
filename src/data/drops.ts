export interface DropItem {
  key: string
  name: string
  flavor: string
  basePrice: number
}

export const drops: DropItem[] = [
  {
    key: 'slimeball',
    name: 'Slimeball',
    flavor: '',
    // flavor: 'Pure, concentrated slime.',
    basePrice: 12,
  },
  {
    key: 'small-critter-tail',
    name: 'Small Critter Tail',
    flavor: '',
    // flavor: 'Tail of common small creature.',
    basePrice: 12,
  },
  {
    key: 'small-critter-paw',
    name: 'Small Critter Paw',
    flavor: '',
    // flavor: 'Undamaged paw of common small creature.',
    basePrice: 12,
  },
  {
    key: 'medicinal-herb',
    name: 'Medicinal Herb',
    flavor: '',
    // flavor: `Smells minty, doesn't hurt if you want to snack on it.`,
    basePrice: 22,
  },
  {
    key: 'ethereal-pebble',
    name: 'Ethereal Pebble',
    flavor: '',
    // flavor: 'Small shinny stone that contains very low spiritual energy.',
    basePrice: 22,
  },
  {
    key: 'catnip',
    name: 'Catnip',
    flavor: '',
    // flavor: 'Love of any felid creature.',
    basePrice: 36,
  },
  {
    key: 'glass-nugget',
    name: 'Glass Nugget',
    flavor: '',
    // flavor: 'Semi-transparent river stone, shines in water under sunlight.',
    basePrice: 36,
  },
  {
    key: 'kolifts-scale',
    name: `Kolift's Scale`,
    flavor: '',
    // flavor: `A while piece of scale from Kolift's body.`,
    basePrice: 0,
  },
  {
    key: 'gummy-slime',
    name: 'Gummy Slime',
    flavor: '',
    basePrice: 48,
  },
]
