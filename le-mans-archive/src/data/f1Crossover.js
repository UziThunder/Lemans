// F1 crossover: confirmed drivers and manufacturers only.
// Portraits: public/assets/drivers/<slug>.jpg   Logos: public/assets/manufacturers/<slug>.svg

export const f1Drivers = [
  {
    id: 'graham-hill',
    name: 'Graham Hill',
    f1: 'Two-time World Champion (1962, 1968)',
    lemans: 'Winner 1972 (Matra MS670, with Henri Pescarolo)',
    note: 'Completed the Triple Crown: Monaco GP, Indianapolis 500 (1966) and Le Mans.',
    portrait: '/assets/drivers/graham-hill.jpg',
    portraitAlt: 'Portrait of Graham Hill',
  },
  {
    id: 'phil-hill',
    name: 'Phil Hill',
    f1: 'World Champion (1961)',
    lemans: 'Winner 1958, 1961 and 1962 (Ferrari)',
    note: 'The first American to win the F1 World Championship.',
    portrait: '/assets/drivers/phil-hill.jpg',
    portraitAlt: 'Portrait of Phil Hill',
  },
  {
    id: 'bruce-mclaren',
    name: 'Bruce McLaren',
    f1: 'Grand Prix winner; founded McLaren',
    lemans: 'Winner 1966 (Ford Mk II, with Chris Amon)',
    note: 'The team he founded later won Le Mans with the F1 GTR in 1995.',
    portrait: '/assets/drivers/bruce-mclaren.jpg',
    portraitAlt: 'Portrait of Bruce McLaren',
  },
  {
    id: 'dan-gurney',
    name: 'Dan Gurney',
    f1: 'Grand Prix winner',
    lemans: 'Winner 1967 (Ford Mk IV, with A.J. Foyt)',
    note: 'The 1967 win was the only Le Mans victory for the Mk IV.',
    portrait: '/assets/drivers/dan-gurney.jpg',
    portraitAlt: 'Portrait of Dan Gurney',
  },
  {
    id: 'mario-andretti',
    name: 'Mario Andretti',
    f1: 'World Champion (1978)',
    lemans: 'Winner 1995 (McLaren F1 GTR #59, with Jan Lammers and Justin Wallace)',
    note: 'Won Le Mans in the same car that appears in this archive.',
    portrait: '/assets/drivers/mario-andretti.jpg',
    portraitAlt: 'Portrait of Mario Andretti',
  },
]

export const f1Manufacturers = [
  { id: 'ferrari', name: 'Ferrari', f1: 'Multiple World Constructors\u2019 titles', lemans: 'Many overall wins, including 1958-1962', logo: '/assets/manufacturers/ferrari.svg', logoAlt: 'Ferrari logo' },
  { id: 'ford', name: 'Ford', f1: 'Cosworth DFV and DFV-derived engines', lemans: 'GT40 and Mk IV wins, 1966-1969 (GT40 #1 and #6 in this archive)', logo: '/assets/manufacturers/ford.svg', logoAlt: 'Ford logo' },
  { id: 'porsche', name: 'Porsche', f1: 'TAG turbo engine for McLaren, 1983-1987', lemans: 'Record overall wins (19), including 1970 917K and 2016 919 Hybrid', logo: '/assets/manufacturers/porsche.svg', logoAlt: 'Porsche logo' },
  { id: 'matra', name: 'Matra', f1: 'Grand Prix win and constructors\u2019 title with Tyrrell, 1969', lemans: 'Overall wins 1972-1974', logo: '/assets/manufacturers/matra.svg', logoAlt: 'Matra logo' },
  { id: 'renault-alpine', name: 'Renault / Alpine', f1: 'Works F1 titles (2005, 2006 with Alonso)', lemans: 'Alpine A442 winner, 1978', logo: '/assets/manufacturers/renault-alpine.svg', logoAlt: 'Renault and Alpine logos' },
  { id: 'jaguar', name: 'Jaguar', f1: 'Jaguar Racing F1 team, 2000-2004', lemans: 'XJR-9 win 1988, plus earlier wins 1951-1957', logo: '/assets/manufacturers/jaguar.svg', logoAlt: 'Jaguar logo' },
  { id: 'mercedes', name: 'Mercedes-Benz', f1: 'Works F1 team, now the modern Mercedes-AMG Petronas team', lemans: 'Wins 1952, 1955 (race involving Levegh), and the 1989 Sauber-Mercedes C9', logo: '/assets/manufacturers/mercedes.svg', logoAlt: 'Mercedes-Benz logo' },
  { id: 'bmw', name: 'BMW', f1: 'BMW Sauber F1 team, 2006-2009', lemans: 'V12 LMR win 1999', logo: '/assets/manufacturers/bmw.svg', logoAlt: 'BMW logo' },
]

// Cars with a confirmed F1 link, keyed by car id (see leMansCars.js).
// Only links to the confirmed list above are counted.
export const f1CarTags = {
  1: true,  // Ford GT40 1969: Ford
  2: true,  // Porsche 917K 1970: Porsche
  3: true,  // Porsche 956 1982: Porsche
  4: true,  // Jaguar XJR-9 1988: Jaguar
  5: true,  // Sauber-Mercedes C9 1989: Mercedes
  6: false, // Mazda 787B 1991: Herbert and Gachot were removed from the confirmed list, so no link
  7: true,  // McLaren F1 GTR 1995: Andretti
  8: true,  // BMW V12 LMR 1999: BMW
  9: false, // Audi R18 2011: no confirmed F1 link
  10: true, // Porsche 919 2016: Porsche
  11: false, // Lotus Eleven 1957: Lotus not in the confirmed list
  12: false,
  13: false,
  14: true, // Ford GT 2016: Ford
  15: false,
  16: false,
  17: false,
  18: false, // Nissan GT-R LM: Max Chilton was removed from the confirmed list
  19: true, // Mercedes CLR 1999: Mercedes
  20: true, // Porsche 917/20 1971: Porsche
}