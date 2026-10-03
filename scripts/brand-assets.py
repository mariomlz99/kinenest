"""Reproduce supplied logo derivatives. Requires Pillow; original is read-only."""
from pathlib import Path
from collections import deque
import argparse, hashlib, json, re
from PIL import Image, ImageDraw, ImageFont
parser=argparse.ArgumentParser()
parser.add_argument('source',type=Path)
args=parser.parse_args()
out=Path(__file__).resolve().parents[1]/'public/assets/brand'
out.mkdir(parents=True,exist_ok=True)
original=Image.open(args.source).convert('RGB')
if original.size != (1254,1254):
    raise SystemExit('Expected the supplied 1254 × 1254 artwork; review crop for a different source.')
# Preserve the robot and supplied wordmark, remove the old baked-in tagline.
# Matte only exterior near-white pixels; protect the white robot chassis.
art=original.crop((0,0,1254,995)).convert('RGBA')
protected_full=Image.new('L',art.size)
ImageDraw.Draw(protected_full).polygon([(554,377),(702,377),(761,408),(785,465),(785,615),(754,679),(686,712),(590,712),(518,676),(473,617),(477,469),(497,415)],fill=255)
pixels=art.load();inside=protected_full.load()
for y in range(art.height):
    for x in range(art.width):
        r,g,b,a=pixels[x,y]
        if inside[x,y]:continue
        lo,hi=min(r,g,b),max(r,g,b)
        if lo>=252:
            pixels[x,y]=(0,0,0,0)
        else:
            # Unmatte anti-aliased edges and translucent sensor shading from white.
            alpha=(255-lo)/255
            pixels[x,y]=tuple(max(0,min(255,round((c-255*(1-alpha))/alpha))) for c in (r,g,b))+(round(alpha*255),)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',42)
product=(out.parents[2]/'src/ui/product.js').read_text()
tagline=re.search(r"tagline: '([^']+)'",product).group(1)
lines=['A safe place to learn robotics','by making things move.']
if ' '.join(lines)!=tagline:raise SystemExit('Review tagline line wrapping after changing PRODUCT.tagline')
logos={}
for theme,ink in [('light',(8,73,87)),('dark',(231,244,247))]:
    themed=art.copy()
    if theme=='dark':
        p=themed.load()
        # Recolour only the Kine wordmark; keep Nest and all robot/axis pixels.
        for y in range(770,995):
            for x in range(0,635):
                r,g,b,a=p[x,y]
                if a:p[x,y]=ink+(a,)
    full=Image.new('RGBA',(1254,1160));full.alpha_composite(themed)
    draw=ImageDraw.Draw(full)
    for i,line in enumerate(lines):draw.text((627,1025+i*57),line,font=font,fill=ink+(255,),anchor='mm')
    full.thumbnail((960,960),Image.Resampling.LANCZOS)
    full.save(out/('kinenest-logo-'+theme+'.png'),optimize=True)
    logos[theme]=full
logos['light'].save(out/'kinenest-logo.png',optimize=True)
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
card=Image.new('RGB',(1200,630),'#f5faf9');logo=logos['light'].copy();logo.thumbnail((660,600),Image.Resampling.LANCZOS)
card.paste(logo,((1200-logo.width)//2,(630-logo.height)//2),logo);card.save(out/'social-preview.png',optimize=True)
(out/'source.json').write_text(json.dumps({'source':'Maintainer-supplied logo.png','sha256':hashlib.sha256(args.source.read_bytes()).hexdigest(),'originalSize':[1254,1254],'iconCrop':[375,125,880,755],'pipeline':'scripts/brand-assets.py','tagline':tagline,'themes':['light','dark'],'logoSize':list(logos['light'].size),'taglineFont':'DejaVu Sans, 42 px before resizing'},indent=2)+'\n')
print('Generated logo, transparent icon, favicon, touch icon and social card.')
