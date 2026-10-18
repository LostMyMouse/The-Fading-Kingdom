"""Read-only alpha-component measurements; never modifies image pixels."""
import json
import sys
from collections import deque
from PIL import Image

source, output, columns = sys.argv[1], sys.argv[2], int(sys.argv[3])
image = Image.open(source).convert('RGBA')
width, height = image.size
mask = bytearray(1 if p > 80 else 0 for p in image.getchannel('A').getdata())
boxes = []
for start in range(len(mask)):
    if not mask[start]:
        continue
    pending = deque([start]); mask[start] = 0
    left = right = start % width; top = bottom = start // width; count = 0
    while pending:
        index = pending.popleft(); x, y = index % width, index // width; count += 1
        left, right = min(left, x), max(right, x)
        top, bottom = min(top, y), max(bottom, y)
        for nxt in (index - 1 if x else -1, index + 1 if x + 1 < width else -1,
                    index - width, index + width):
            if 0 <= nxt < len(mask) and mask[nxt]:
                mask[nxt] = 0; pending.append(nxt)
    if count > 2000:
        boxes.append([left, top, right-left+1, bottom-top+1])
boxes.sort(key=lambda b: b[1])
ordered = []
for offset in range(0, len(boxes), columns):
    ordered.extend(sorted(boxes[offset:offset+columns], key=lambda b: b[0]))
with open(output, 'w') as file:
    json.dump(ordered, file)
print(source, image.size, ordered)
