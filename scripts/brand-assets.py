"""Reproduce supplied logo derivatives. Requires Pillow; original is read-only."""
from pathlib import Path
from collections import deque
import argparse, hashlib, json
from PIL import Image, ImageDraw
parser=argparse.ArgumentParser()
parser.add_argument('source',type=Path)
args=parser.parse_args()
out=Path(__file__).resolve().parents[1]/'public/assets/brand'
out.mkdir(parents=True,exist_ok=True)
original=Image.open(args.source).convert('RGB')
if original.size != (1254,1254):
    raise SystemExit('Expected the supplied 1254 × 1254 artwork; review crop for a different source.')
full=original.copy();full.thumbnail((960,960),Image.Resampling.LANCZOS)
full.save(out/'kinenest-logo.png',optimize=True)
# Crop the robot, beams and axes. Preserve white pixels inside the outlined body.
icon=original.crop((375,125,880,755)).convert('RGBA')
w,h=icon.size;p=icon.load();seen=set();q=deque()
protected=Image.new('L',(w,h));draw=ImageDraw.Draw(protected)
# A protected interior prevents the white chassis from joining the white backdrop.
draw.polygon([(x-375,y-125) for x,y in [(554,377),(702,377),(761,408),(785,465),(785,615),(754,679),(686,712),(590,712),(518,676),(473,617),(477,469),(497,415)]],fill=255)
mask=protected.load()
for x in range(w):q.extend([(x,0),(x,h-1)])
for y in range(h):q.extend([(0,y),(w-1,y)])
while q:
    x,y=q.popleft()
    if (x,y) in seen or not(0<=x<w and 0<=y<h):continue
    seen.add((x,y));r,g,b,a=p[x,y]
    if mask[x,y] or min(r,g,b)<241:continue
    p[x,y]=(r,g,b,0)
    q.extend([(x-1,y),(x+1,y),(x,y-1),(x,y+1)])
# Feather only the exterior white fringe, never the interior white chassis.
for x,y in seen:
    r,g,b,a=p[x,y]
    if a and not mask[x,y] and min(r,g,b)>=225:
        alpha=min(255,max(0,round((241-min(r,g,b))*255/16)))
        p[x,y]=(r,g,b,alpha)
icon.thumbnail((256,256),Image.Resampling.LANCZOS)
square=Image.new('RGBA',(256,256));square.alpha_composite(icon,((256-icon.width)//2,(256-icon.height)//2))
square.save(out/'kinenest-icon.png',optimize=True)
square.resize((32,32),Image.Resampling.LANCZOS).save(out/'favicon-32.png',optimize=True)
square.resize((180,180),Image.Resampling.LANCZOS).save(out/'apple-touch-icon.png',optimize=True)
# One uncluttered social card; supplied art is not redrawn.
card=Image.new('RGB',(1200,630),'#f5faf9');logo=original.copy();logo.thumbnail((620,620),Image.Resampling.LANCZOS)
card.paste(logo,((1200-logo.width)//2,(630-logo.height)//2));card.save(out/'social-preview.png',optimize=True)
(out/'source.json').write_text(json.dumps({'source':'Maintainer-supplied logo.png','sha256':hashlib.sha256(args.source.read_bytes()).hexdigest(),'originalSize':[1254,1254],'iconCrop':[375,125,880,755],'pipeline':'scripts/brand-assets.py'},indent=2)+'\n')
print('Generated logo, transparent icon, favicon, touch icon and social card.')
