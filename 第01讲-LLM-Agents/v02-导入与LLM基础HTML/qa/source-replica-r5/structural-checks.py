from pathlib import Path
import json, re, hashlib
r=Path('第01讲-LLM-Agents/v02-导入与LLM基础HTML');s=json.loads((r/'slides.json').read_text());m=json.loads((r/'version_manifest.json').read_text());old=json.loads((r/'qa/source-replica-r5/previous/slides.json').read_text());old_by_n={p['page']:p for p in old};checks=[]
checks.append({'name':'active_pages_and_states','pass':len(s)==147 and sum(p['steps'] for p in m['page_records'])==161,'pages':len(s),'states':sum(p['steps'] for p in m['page_records'])})
checks.append({'name':'break_slide_removed','pass':not any(p['title']=='课间休息' or p.get('authoring_page')==73 for p in s)})
checks.append({'name':'duration','pass':sum(p['seconds'] for p in s)==10200 and m['break_seconds']==600 and m['duration_seconds']==10800})
checks.append({'name':'replicas_full_display','pass':all(p['source_replica'] and p['playback']['mode']=='full' for p in s[56:61])})
checks.append({'name':'unchanged_first_50_pages','pass':old[:50]==s[:50]})
for path in (r/'qa/source-replica-r5/previous/sources/official-readers').glob('*.html'):
 current=r/'sources/official-readers'/path.name
 oldnums=list(map(int,re.findall(r'#p=(\d+)',path.read_text())));newnums=list(map(int,re.findall(r'#p=(\d+)',current.read_text())))
 checks.append({'name':str(current.relative_to(r)),'pass':len(oldnums)==len(newnums) and all(old_by_n[a]['authoring_page']==s[b-1]['authoring_page'] for a,b in zip(oldnums,newnums))})
source=json.loads((r/'sources/source-replica-r5/source-map.json').read_text())
checks.append({'name':'read_only_source_unchanged','pass':hashlib.sha256(Path(source['source']).read_bytes()).hexdigest()==source['source_sha256']})
checks.append({'name':'replica_assets_local','pass':all(not re.search(r'(?:href|src)=[\"\x27]https?://',p.read_text()) for p in (r/'assets/source-replica-r5').glob('*.svg'))})
assert all(c['pass'] for c in checks),checks
(r/'qa/source-replica-r5/structural-checks.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(checks,ensure_ascii=False))
