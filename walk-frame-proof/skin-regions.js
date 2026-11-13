// Local row ranges measured around the hands and knees in each source cell.
// The colour predicate separates exposed skin from fabric within those rows.
const rows = {
  'left': [[396,461,497,530],[375,456,493,528],[363,425,469,498],[339,416,463,496]],
  'vest-left': [[393,461,495,530],[375,455,492,528],[365,426,468,498],[338,417,464,497]],
  'down': [[391,453,0,0],[368,445,478,510],[362,424,0,0],[346,416,446,482]],
  'vest-down': [[385,454,0,0],[368,446,477,512],[357,426,0,0],[344,418,447,484]],
  'up': [[433,489,550,556],[419,492,543,559],[369,426,486,491],[356,430,475,496]],
  'vest-up': [[427,488,544,556],[416,492,539,558],[363,426,480,491],[355,430,473,496]],
  'left-linen': [[373,459,490,527],[314,447,490,525],[327,420,454,498],[323,419,462,496]],
  'left-vest': [[372,458,488,527],[308,457,486,526],[329,429,458,501],[336,431,464,501]],
  'down-linen': [[319,406,448,471],[267,403,447,470],[298,396,433,460],[301,390,436,460]],
  'down-vest': [[326,419,453,481],[263,419,449,481],[306,401,431,464],[314,402,438,464]],
  'up-linen': [[348,419,469,481],[276,418,467,481],[324,391,440,459],[289,395,442,458]],
  'up-vest': [[315,398,441,465],[250,389,441,465],[300,373,416,442],[276,372,416,439]],
};

export function skinRegions(key, geometry) {
  return rows[key].map(([handsTop, handsBottom, kneesTop, kneesBottom], frame) => {
    const width = geometry.rects[frame][2];
    const boxes = [[0, handsTop-2, width-1, handsBottom+2]];
    if (kneesBottom > kneesTop) boxes.push([0, kneesTop-1, width-1, kneesBottom+1]);
    return boxes;
  });
}

