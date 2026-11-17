export interface Friend {
  id: string;
  name: string;
  artwork: string | null;
  placeholder: 'tomi' | 'monkey' | 'fish' | 'neutral';
  scale: number;
  offsetX: number;
  offsetY: number;
}

const drawings = {
  tomi: new URL('../assets/family/Tomi.png', import.meta.url).href,
  bongo: new URL('../assets/family/Bongo.png', import.meta.url).href,
  fredrick: new URL('../assets/family/Fredrick.png', import.meta.url).href,
  nibbles: new URL('../assets/family/Nibbles.png', import.meta.url).href,
  timber: new URL('../assets/family/Timber.png', import.meta.url).href,
  spotty: new URL('../assets/family/Spotty.png', import.meta.url).href,
  twiggy: new URL('../assets/family/Twiggy.png', import.meta.url).href,
  stripes: new URL('../assets/family/Stripes.png', import.meta.url).href,
  noodles: new URL('../assets/family/Noodles.png', import.meta.url).href,
  billy: new URL('../assets/family/Billy.png', import.meta.url).href,
  fipo: new URL('../assets/family/Fipo.png', import.meta.url).href,
  gooby: new URL('../assets/family/Gooby.png', import.meta.url).href,
  waddles: new URL('../assets/family/Waddles.png', import.meta.url).href,
  sammy: new URL('../assets/family/Sammy.png', import.meta.url).href,
  wally: new URL('../assets/family/Wally.png', import.meta.url).href,
  'mr-clod': new URL('../assets/family/Mr Clod.png', import.meta.url).href,
  pooper: new URL('../assets/family/Pooper.png', import.meta.url).href,
  bloop: new URL('../assets/family/Bloop.png', import.meta.url).href,
  steepy: new URL('../assets/family/Steepy.png', import.meta.url).href,
};

const imageAdjustments: Partial<Record<keyof typeof drawings, { scale: number; offsetX: number; offsetY: number }>> = {
  tomi: { scale: 1.03, offsetX: -2.9, offsetY: 0.2 },
  bongo: { scale: 1.2, offsetX: 0.6, offsetY: 7.1 },
  fredrick: { scale: 1.7, offsetX: 0.5, offsetY: 10.1 },
  nibbles: { scale: 1.1, offsetX: 8.6, offsetY: 17.7 },
  timber: { scale: 1, offsetX: -0.6, offsetY: 1.6 },
  spotty: { scale: 1, offsetX: 2.7, offsetY: 1.7 },
  twiggy: { scale: 1, offsetX: 3.5, offsetY: -0.6 },
  stripes: { scale: 1.15, offsetX: 10.6, offsetY: 6.3 },
  noodles: { scale: 1, offsetX: 2.9, offsetY: 0.2 },
  billy: { scale: 1.2, offsetX: 1.4, offsetY: -1.1 },
  fipo: { scale: 1, offsetX: 2.4, offsetY: -14.1 },
  gooby: { scale: 1, offsetX: -1.7, offsetY: -0.8 },
  waddles: { scale: 1.1, offsetX: 1.9, offsetY: 6.3 },
  sammy: { scale: 1, offsetX: 4.4, offsetY: 0.3 },
  wally: { scale: 1, offsetX: 4.7, offsetY: 2.2 },
  'mr-clod': { scale: 1, offsetX: 3.2, offsetY: 2.1 },
  pooper: { scale: 1, offsetX: 2.4, offsetY: -4.1 },
  bloop: { scale: 1.35, offsetX: 2.9, offsetY: 2.1 },
  steepy: { scale: 1.35, offsetX: 8.7, offsetY: -3.6 },
};

const friend = (id: keyof typeof drawings, name: string, placeholder: Friend['placeholder'] = 'neutral'): Friend => {
  const adjustment = imageAdjustments[id] ?? { scale: 1, offsetX: 0, offsetY: 0 };
  return { id, name, artwork: drawings[id], placeholder, ...adjustment };
};

export const family: Friend[] = [
  friend('tomi', 'Tomi', 'tomi'),
  friend('bongo', 'Bongo', 'monkey'),
  friend('fredrick', 'Fredrick', 'fish'),
  friend('nibbles', 'Nibbles'),
  friend('timber', 'Timber'),
  friend('spotty', 'Spotty'),
  friend('twiggy', 'Twiggy'),
  friend('stripes', 'Stripes'),
  friend('noodles', 'Noodles'),
  friend('billy', 'Billy'),
  friend('fipo', 'Fipo'),
  friend('gooby', 'Gooby'),
  friend('waddles', 'Waddles'),
  friend('sammy', 'Sammy'),
  friend('wally', 'Wally'),
  friend('mr-clod', 'Mr Clod'),
  friend('pooper', 'Pooper'),
  friend('bloop', 'Bloop'),
  friend('steepy', 'Steepy'),
];

// Composition is independent of artwork; the full family fits across three rows.
export const portraitRows = [
  ['nibbles', 'timber', 'spotty', 'twiggy', 'stripes', 'noodles'],
  ['billy', 'fipo', 'gooby', 'waddles', 'sammy', 'wally'],
  ['bongo', 'fredrick', 'tomi', 'mr-clod', 'pooper', 'bloop', 'steepy'],
];
