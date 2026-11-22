// Picks up every PNG in src/assets/cars/ automatically.
// Add a new car: drop the PNG in that folder, then add its id and filename below.
const files = import.meta.glob('../assets/cars/*.png', { eager: true, import: 'default' })

const NAMES = {
  1: 'ford-gt40',
  2: 'porsche-917k',
  3: 'porsche-956',
  4: 'jaguar-xjr9',
  5: 'sauber-c9',
  6: 'mazda-787b',
  7: 'mclaren-f1-gtr',
  8: 'bmw-v12-lmr',
  9: 'audi-r18',
  10: 'porsche-919',
  11: '1957-lotus-eleven',
  12: '1987-spice-se86c',
  13: '2014-jota-zytek-z11sn',
  14: '2016-ford-gt-68',
  15: '2020-aston-martin-vantage-amr-90',
  16: '1983-mazda-717c',
  17: '2012-deltawing',
  18: '2015-nissan-gt-r-lm-nismo',
  19: '1999-mercedes-clr',
  20: '1971-porsche-917-20-pink-pig',
}

export const carImages = Object.fromEntries(
  Object.entries(NAMES)
    .map(([id, name]) => [Number(id), files[`../assets/cars/${name}.png`]])
    .filter(([, src]) => Boolean(src))
)