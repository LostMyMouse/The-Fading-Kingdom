import {HAIRS, SKINS} from '../model.js';
import {materialRamp} from '../player-layered.js';

// Eyelids and iris bounds measured from the four original hair styles.
const eyeRows = {
  0: [[.315,.415,.27,.48,.62,.79], [.307,.418,.22,.40], [.307,.418,.59,.77]],
  1: [[.315,.415,.27,.48,.63,.80], [.301,.414,.22,.39], [.301,.414,.59,.78]],
  3: [[.292,.396,.27,.49,.59,.77], [.283,.394,.20,.38], [.283,.394,.61,.81]],
  4: [[.335,.432,.24,.47,.56,.75], [.326,.432,.19,.37], [.326,.432,.63,.82]]
};

export function isSkin(red, green, blue) {
  return red >= 145 && green >= 70 && blue >= 33 &&
    green >= red * .40 && green <= red * .76 &&
    blue >= green * .36 && blue <= green * .76;
}

export function isHair(red, green, blue) {
  return red >= 38 && red < 145 && red > green * 1.18 &&
    green >= blue * 1.01 && green < blue * 2.05;
}

export function headMaterial(red, green, blue, x, y, style, view) {
  const eyes = eyeRows[style]?.[view];
  if (eyes) {
    const [top, bottom, left, right, secondLeft, secondRight] = eyes;
    if (y >= top && y <= bottom &&
      ((x >= left && x <= right) || (x >= secondLeft && x <= secondRight))) {
      // Skin can border the eye. The darker iris and the light eye white retain their colours.
      return isSkin(red, green, blue) ? 'skin' : null;
    }
  }
  if (isSkin(red, green, blue)) return 'skin';
  if (isHair(red, green, blue)) return 'hair';
  return null;
}

function makePainter(hex, stops) {
  if (!hex) return null;
  const ramp = materialRamp(hex);
  return (pixels, offset) => {
    const light = .299 * pixels[offset] + .587 * pixels[offset + 1] + .114 * pixels[offset + 2];
    let step = 0;
    while (step < 3 && light > stops[step + 1]) step++;
    const t = Math.max(0, Math.min(1, (light - stops[step]) / (stops[step + 1] - stops[step])));
    for (let channel = 0; channel < 3; channel++) {
      pixels[offset + channel] = Math.round(ramp[step][channel] * (1 - t) + ramp[step + 1][channel] * t);
    }
  };
}

const skinPainter = palette => makePainter(SKINS[palette], [75, 112, 149, 183, 222]);

export function colourHead(pixels, width, height, style, view, skin, hair) {
  const paint = {
    skin: skinPainter(skin),
    hair: makePainter(HAIRS[hair], [28, 44, 61, 82, 112])
  };
  for (let y = 0; y < height * .53; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (pixels[i + 3] < 100) continue;
      const material = headMaterial(pixels[i], pixels[i + 1], pixels[i + 2], x / width, y / height, style, view);
      paint[material]?.(pixels, i);
    }
  }
}

export function colourTail(pixels, hair) {
  const paint = makePainter(HAIRS[hair], [28, 44, 61, 82, 112]);
  if (!paint) return;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] >= 100 && isHair(pixels[i], pixels[i + 1], pixels[i + 2])) paint(pixels, i);
  }
}

export function colourBodySkin(pixels, width, geometry, regions, palette) {
  const paint = skinPainter(palette);
  if (!paint) return;
  for (const [frame, boxes] of regions.entries()) {
    const [cx, cy, cw, ch] = geometry.rects[frame];
    for (const [left, top, right, bottom] of boxes) {
      for (let y = Math.max(0, top); y <= Math.min(ch - 1, bottom); y++) {
        for (let x = Math.max(0, left); x <= Math.min(cw - 1, right); x++) {
          const i = ((cy + y) * width + cx + x) * 4;
          if (pixels[i + 3] >= 100 && isSkin(pixels[i], pixels[i + 1], pixels[i + 2])) paint(pixels, i);
        }
      }
    }
  }
}
