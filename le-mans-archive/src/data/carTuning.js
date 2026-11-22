/*
  Per-car tuning (measured on the auto-trimmed image, so tyres touch the bottom edge).
    facing : which way the car's NOSE points in your photo ('left' or 'right')
             -> right-facing cars drive in from the LEFT, left-facing from the RIGHT
    wheels : [leftWheelX, rightWheelX] as % of car width
    wheelY : wheel centre as % of car height (0 = top, 100 = bottom)
    scale  : 1 = default size
    sink   : px to push the car down (+) or up (-)
    flip   : true mirrors the photo (logos read backwards, so avoid)
*/
const defaults = { facing: 'right', wheels: [20, 80], wheelY: 68, scale: 1, sink: 0, flip: false }

const tuning = {
  1:  { facing: 'right', wheels: [18, 77], wheelY: 70 },
  2:  { facing: 'left',  wheels: [23, 79], wheelY: 69 },
  3:  { facing: 'right', wheels: [26, 83], wheelY: 68 },
  4:  { facing: 'left',  wheels: [20, 78], wheelY: 68 },
  5:  { facing: 'left',  wheels: [21, 78], wheelY: 70 },
  6:  { facing: 'right', wheels: [24, 80], wheelY: 65 },
  7:  { facing: 'left',  wheels: [19, 87], wheelY: 68 },
  8:  { facing: 'right', wheels: [21, 83], wheelY: 67 },
  9:  { facing: 'right', wheels: [16, 79], wheelY: 68 },
  10: { facing: 'right', wheels: [17, 80], wheelY: 74 },
}

export const getTune = (id) => ({ ...defaults, ...(tuning[id] || {}) })