"""Extract original PPT artwork and PDF crops; no synthesized imagery."""
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as E
import shutil,subprocess,json,hashlib
base=Path(__file__).resolve().parent
assets=base.parents[1]/'assets/cover-bio-r27'
assets.mkdir(parents=True,exist_ok=True)
ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','p':'http://schemas.openxmlformats.org/presentationml/2006/main'}
with ZipFile(base/'封面生成专用.pptx') as z:
 for old,new in [('ppt/media/image1.png','cover-gate.png'),('ppt/media/image2.png','sjtu-white.png')]:
  (assets/new).write_bytes(z.read(old))
 tree=E.fromstring(z.read('ppt/slides/slide1.xml'))
 group=tree.find('.//p:grpSp',ns)
 def transform(x):
  o=x.find('a:off',ns);e=x.find('a:ext',ns)
  return float(o.get('x')),float(o.get('y')),float(e.get('cx')),float(e.get('cy'))
 x,y,w,h=transform(group.find('p:grpSpPr/a:xfrm',ns))
 ch=group.find('p:grpSpPr/a:xfrm/a:chOff',ns);ce=group.find('p:grpSpPr/a:xfrm/a:chExt',ns)
 out=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 116" width="1600" height="116">', '<path d="M0 88.3 H1260" fill="none" stroke="#004098" stroke-width="3.33"/>',f'<g transform="translate({x/7620} {y/7620}) scale({w/float(ce.get("cx"))/7620} {h/float(ce.get("cy"))/7620}) translate({-float(ch.get("x"))} {-float(ch.get("y"))})" fill="#004098">']
 for sp in group.findall('p:sp',ns):
  prop=sp.find('p:spPr',ns);sx,sy,sw,sh=transform(prop.find('a:xfrm',ns))
  for gp in prop.findall('a:custGeom/a:pathLst/a:path',ns):
   cmds=[]
   for cmd in gp:
    tag=cmd.tag.split('}')[-1];pts=cmd.findall('a:pt',ns)
    if tag=='close':cmds.append('Z');continue
    op={'moveTo':'M','lnTo':'L','cubicBezTo':'C','quadBezTo':'Q'}.get(tag)
    if op:cmds.append(op+' '.join(f'{p.get("x")} {p.get("y")}' for p in pts))
   out.append(f'<path transform="translate({sx} {sy}) scale({sw/float(gp.get("w"))} {sh/float(gp.get("h"))})" d="{" ".join(cmds)}" stroke="#004098" stroke-width="1.25" vector-effect="non-scaling-stroke"/>')
 out.append('</g></svg>');(assets/'cover-header.svg').write_text('\n'.join(out))
subprocess.run(['pdfimages','-all',str(base/'讲者介绍原件.pdf'),str(base/'pdf-image')],check=True)
shutil.copy2(base/'pdf-image-004.jpg',assets/'portrait.jpg')
for name,x,y,w,h in [('profile-logos',2380,65,780,130),('profile-footer',0,1680,3200,121)]:
 subprocess.run(['pdftoppm','-scale-to','3200','-f','1','-singlefile','-x',str(x),'-y',str(y),'-W',str(w),'-H',str(h),'-png',str(base/'讲者介绍原件.pdf'),str(assets/name)],check=True)
manifest={'cover_source':'封面生成专用.pptx, slide 1','speaker_source':'讲者介绍原件.pdf, page 1','cover_reference_dimensions_emu':[12192000,6858000],'output_canvas':[1600,900],'artwork':'PPT media extracted verbatim; header paths transcribed from original OOXML group; PDF logos/footer are direct rendered crops; portrait is the original embedded JPEG.','cover_text_change':'课程标题改为零基础入门大模型智能体（文科版），讲者信息采用所提供PDF。','profile_text':'Complete supplied speaker page text, set as selectable HTML.','assets':[{'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(assets.iterdir()) if p.is_file()]}
(base/'source-map.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Extracted',len(manifest['assets']),'original assets')
