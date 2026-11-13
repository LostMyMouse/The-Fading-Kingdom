import {CHARACTER_HEIGHT} from '../character-rig.js';
import {drawToolSprite} from '../gathering-art.js';

export const ACTION_POSES = ['Ready', 'Windup', 'Strike', 'Recover'];
const durations = [190, 210, 115, 185];
export const SWING_DURATION = durations.reduce((total, duration) => total + duration, 0);

// Each sheet records dimensions, figure height, foot baselines, fist centres
// and a small upper-arm window where the windup rises above the neck seam.
const measurements = {
  'left-linen': [[1254,1254],534,[[340,598],[310,598],[338,570],[316,569]],[[367,435],[200,335],[189,389],[235,348]],[[0,0,0,0],[164,305,229,352],[0,0,0,0],[0,0,0,0]]],
  'left-vest': [[1254,1254],540,[[340,603],[313,603],[340,577],[319,578]],[[255,429],[171,331],[181,392],[223,358]],[[0,0,0,0],[136,297,205,351],[0,0,0,0],[0,0,0,0]]],
  'down-linen': [[1303,1207],521,[[365,540],[257,540],[365,532],[257,531]],[[284,376],[137,287],[234,374],[201,341]],[[0,0,0,0],[107,254,171,306],[0,0,0,0],[0,0,0,0]]],
  'down-vest': [[1312,1199],529,[[391,557],[262,557],[398,543],[261,541]],[[319,380],[121,283],[261,376],[226,340]],[[0,0,0,0],[87,251,154,314],[0,0,0,0],[0,0,0,0]]],
  'up-linen': [[1312,1199],485,[[378,541],[273,541],[393,518],[274,517]],[[453,392],[388,293],[532,371],[371,303]],[[0,0,0,0],[362,265,423,316],[0,0,0,0],[0,0,0,0]]],
  'up-vest': [[1312,1199],494,[[382,535],[247,535],[384,510],[248,510]],[[466,365],[378,270],[539,353],[359,295]],[[0,0,0,0],[345,238,408,307],[0,0,0,0],[0,0,0,0]]],
};

export const ACTION_DATA = Object.fromEntries(Object.entries(measurements).map(([key, data]) => {
  const [[width,height], figureHeight, anchors, hands, raised] = data;
  const halfWidth = Math.floor(width / 2);
  const halfHeight = Math.floor(height / 2);
  return [key, {
    file: key + '-swing-v1.png',
    height: figureHeight, anchors, hands, raised,
    rects: [
      [0, 0, halfWidth, halfHeight], [halfWidth, 0, width-halfWidth, halfHeight],
      [0, halfHeight, halfWidth, height-halfHeight], [halfWidth, halfHeight, width-halfWidth, height-halfHeight]
    ]
  }];
}));

export function swingFrame(elapsed, reduced = false) {
  if (reduced) return 2;
  let remaining = Math.max(0, elapsed) % SWING_DURATION;
  for (let i = 0; i < durations.length; i++) {
    if (remaining < durations[i]) return i;
    remaining -= durations[i];
  }
  return 3;
}

// Angles are measured from a downward-pointing tool shaft. Mirroring the
// whole sprite reverses the blade and preserves the fist's attachment point.
const angles = {
  left: [.46, 2.78, .93, 1.96],
  down: [-.18, 2.83, .43, 2.06],
  up: [-.38, -2.68, -2.34, -2.94]
};

export function actionFrame(direction, outfit, frame) {
  const mirror = direction === 'right';
  const base = mirror ? 'left' : direction;
  const key = base + (outfit === 1 ? '-vest' : '-linen');
  const geometry = ACTION_DATA[key];
  const [x,y] = geometry.anchors[frame];
  const [hx,hy] = geometry.hands[frame];
  const scale = CHARACTER_HEIGHT / geometry.height;
  return {
    key, geometry, rect: geometry.rects[frame], raised: geometry.raised[frame], x, y, scale,
    gripX: (hx-x)*scale, gripY: (hy-y)*scale, mirror,
    angle: angles[base][frame], behind: direction === 'up'
  };
}

function drawCell(context, image, pose) {
  const {rect, x, y, scale} = pose;
  context.drawImage(image, ...rect, -x*scale, -y*scale, rect[2]*scale, rect[3]*scale);
}

function drawBody(context, image, pose) {
  const {raised, x, y, scale} = pose;
  context.save();
  context.beginPath();
  context.rect(-42, -CHARACTER_HEIGHT*.47, 84, CHARACTER_HEIGHT*2);
  const [left,top,right,bottom] = raised;
  if (right > left) context.rect((left-x)*scale, (top-y)*scale, (right-left)*scale, (bottom-top)*scale);
  context.clip();
  drawCell(context,image,pose);
  context.restore();
}

export function drawSwing(context, image, pose, x, y, tool, drawHead) {
  context.save();
  context.translate(x,y);
  context.scale(pose.mirror ? -1 : 1, 1);
  if (pose.behind) drawToolSprite(context,pose.gripX,pose.gripY,pose.angle,tool);
  drawBody(context,image,pose);
  context.restore();

  drawHead();

  if (!pose.behind) {
    context.save();
    context.translate(x,y);
    context.scale(pose.mirror ? -1 : 1, 1);
    drawToolSprite(context,pose.gripX,pose.gripY,pose.angle,tool);
    context.beginPath();
    context.ellipse(pose.gripX,pose.gripY,1.05,1.22,0,0,Math.PI*2);
    context.clip();
    drawCell(context,image,pose);
    context.restore();
  }
}

