const mk=(type,title,cat,labels,series)=>({type,title,sub:'',cat,labels,series:series.map(([name,values])=>({name,values:values.map(String)})),
palette:'Ocean',theme:'light',legend:'bottom',grid:true,dlabels:true,dec:1,fmt:'number',anim:true,font:'Inter, Arial, sans-serif',size:13,ratio:1.8,hole:60,border:2,point:3,curve:true,xt:'',yt:'',colors:{}});
const SAMPLES={
expenses:()=>mk('pie','Monthly Expenses','Category',['Food','Transport','Education','Entertainment'],[['Amount',[500,200,300,150]]]),
sales:()=>mk('line','Monthly Sales','Month',['Jan','Feb','Mar','Apr','May','Jun'],[['Sales',[1200,1500,1100,1800,2100,1950]]]),
scores:()=>mk('bar','Student Scores','Student',['Ana','Ben','Chen','Dara','Eli'],[['Score',[88,72,95,64,81]]]),
population:()=>mk('doughnut','Population by Category','Group',['Children','Adults','Seniors'],[['People',[2400,6100,1500]]]),
traffic:()=>mk('area','Website Traffic','Date',['2026-10-01','2026-10-02','2026-10-03','2026-10-04','2026-10-05'],[['Visits',[320,410,380,520,610]]]),
revenue:()=>mk('bar','Revenue and Profit','Quarter',['Q1','Q2','Q3','Q4'],[['Revenue',[120,150,170,210]],['Profit',[30,38,41,60]]]),
products:()=>mk('stacked','Product Sales Comparison','Region',['North','South','East','West'],[['Product A',[40,30,50,20]],['Product B',[25,35,15,45]],['Product C',[10,20,30,25]]])};
let P,S,hist=[],fut=[],last='';
const uid=()=>'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
function newProject(s,name){P={id:uid(),name:name||s.title||'Untitled',data:s};S=P.data;hist=[];fut=[];last=JSON.stringify(S);renderAll();save()}
function save(){P.data=S;P.updated=Date.now();Store.put(P);Store.setCur(P.id);renderProjects()}
function commit(light){const j=JSON.stringify(S);if(j!==last){hist.push(last);if(hist.length>100)hist.shift();fut=[];last=j}refresh(light);save()}
function undo(){if(!hist.length)return;fut.push(JSON.stringify(S));S=JSON.parse(hist.pop());last=JSON.stringify(S);renderAll();save()}
function redo(){if(!fut.length)return;hist.push(JSON.stringify(S));S=JSON.parse(fut.pop());last=JSON.stringify(S);renderAll();save()}
function refresh(light){drawChart(S);$('#stats').innerHTML=statLines(S).map(l=>`<li>${esc(l)}</li>`).join('');
$('#dtable').innerHTML=$('#showtable').checked?'<table class="dt">'+[[S.cat,...S.series.map(s=>s.name)],...tableRows(S)].map((r,i)=>'<tr>'+r.map(c=>`<${i?'td':'th'}>${esc(c)}</${i?'td':'th'}>`).join('')+'</tr>').join('')+'</table>':'';
if(!light)renderEditor(S);$('#pname').value=P.name;$('#undo').disabled=!hist.length;$('#redo').disabled=!fut.length}
function renderAll(){const g=(i,v)=>$('#'+i)&&($('#'+i).type==='checkbox'?$('#'+i).checked=v:$('#'+i).value=v);
['type','palette','theme','legend','dec','fmt','font','size','ratio','hole','border','point','xt','yt','title','sub'].forEach(k=>g('c_'+k,S[k]));
g('c_grid',S.grid);g('c_dlabels',S.dlabels);g('c_anim',S.anim);g('c_curve',S.curve);renderColors();refresh()}
function renderColors(){const pie=S.type==='pie'||S.type==='doughnut',n=pie?S.labels.length:S.series.length,pal=PALETTES[S.palette];
$('#colors').innerHTML=Array.from({length:n},(_,i)=>{const k=(pie?'p':'s')+i,nm=pie?S.labels[i]||'#'+(i+1):S.series[i].name;
return`<label class="cl"><input type="color" data-ck="${k}" value="${(S.colors[k]||pal[i%pal.length])}"> ${esc(nm)}</label>`}).join('')}
function renderProjects(){const a=Object.values(Store.all()).sort((x,y)=>y.updated-x.updated);
$('#plist').innerHTML=a.length?a.map(p=>`<li class="${p.id===P.id?'cur':''}"><button data-open="${p.id}">${esc(p.name)}</button><button class="x" data-dup="${p.id}" title="Duplicate">⧉</button><button class="x" data-pdel="${p.id}" title="Delete">×</button></li>`).join(''):'<li class="empty">No saved projects.</li>'}
function applyTable(text){const rows=parseTable(text);if(!rows.length)return toast('Nothing to import');const w=Math.max(...rows.map(r=>r.length));
if(w<2)return toast('Need at least two columns (label + values)');
const hdr=rows[0].slice(1).some(c=>c.trim()!==''&&Calc.num(c)==null),body=hdr?rows.slice(1):rows;
S.cat=hdr?rows[0][0]||'Category':S.cat;S.labels=body.map(r=>r[0]||'');
S.series=Array.from({length:w-1},(_,k)=>({name:hdr?rows[0][k+1]||'Series '+(k+1):'Series '+(k+1),values:body.map(r=>(r[k+1]||'').trim())}));
S.colors={};renderColors();commit();toast(`Imported ${body.length} rows, ${w-1} series`)}
function csvOut(){const q=v=>/[",\n]/.test(v)?`"${String(v).replace(/"/g,'""')}"`:v;return[[S.cat,...S.series.map(s=>s.name)],...S.labels.map((l,i)=>[l,...S.series.map(s=>s.values[i]??'')])].map(r=>r.map(q).join(',')).join('\n')}
const fname=()=>(S.title||'chart').replace(/[^\w-]+/g,'_');
function ask(msg){return confirm(msg)}
function init(){
$('#c_type').innerHTML=Object.entries(TYPES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
$('#c_palette').innerHTML=Object.keys(PALETTES).map(k=>`<option>${k}</option>`).join('');
$('#samples').innerHTML='<option value="">Load sample…</option>'+Object.keys(SAMPLES).map(k=>`<option>${k}</option>`).join('');
const cur=Store.all()[Store.cur()];if(cur){P=cur;S=P.data;last=JSON.stringify(S);renderAll();renderProjects()}else newProject(SAMPLES.expenses(),'Sample: Monthly Expenses');
$('#samples').onchange=e=>{if(e.target.value){newProject(SAMPLES[e.target.value]());e.target.value=''}};
const ed=$('#editor');
ed.addEventListener('input',e=>{const t=e.target.dataset;if(t.h){t.h==='cat'?S.cat=e.target.value:S.series[+t.h.slice(1)].name=e.target.value}
else if(t.l!==undefined)S.labels[+t.l]=e.target.value;else if(t.v){const[k,i]=t.v.split(',');S.series[+k].values[+i]=e.target.value;e.target.classList.toggle('bad',e.target.value!==''&&Calc.num(e.target.value)==null)}commit(true)});
ed.addEventListener('click',e=>{const t=e.target.dataset;if(t.dr!==undefined){S.labels.splice(+t.dr,1);S.series.forEach(s=>s.values.splice(+t.dr,1))}
else if(t.ds!==undefined)S.series.splice(+t.ds,1);else return;S.colors={};renderColors();commit()});
$('#addrow').onclick=()=>{S.labels.push('');S.series.forEach(s=>s.values.push(''));commit()};
$('#addser').onclick=()=>{S.series.push({name:'Series '+(S.series.length+1),values:S.labels.map(()=>'')});renderColors();commit()};
$('#clear').onclick=()=>{if(ask('Clear all data?')){S.labels=[''];S.series=S.series.map(s=>({...s,values:['']}));commit()}};
$('#undo').onclick=undo;$('#redo').onclick=redo;
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.target.matches('textarea')&&e.key==='z'&&!e.target.matches('input[type=text],input:not([type])')){e.preventDefault();e.shiftKey?redo():undo()}});
$('#paste').onclick=()=>{applyTable($('#pastebox').value);$('#pastebox').value=''};
$('#csvfile').onchange=async e=>{const f=e.target.files[0];if(f){applyTable(await f.text());e.target.value=''}};
document.querySelectorAll('[id^=c_]').forEach(el=>{const k=el.id.slice(2);const h=()=>{const v=el.type==='checkbox'?el.checked:el.type==='number'||el.type==='range'?+el.value:el.value;S[k]=v;if(k==='type'||k==='palette'){if(k==='palette')S.colors={};renderColors()}commit(true)};el.addEventListener('input',h)});
$('#colors').addEventListener('input',e=>{S.colors[e.target.dataset.ck]=e.target.value;commit(true)});
$('#showtable').onchange=()=>refresh(true);
$('#pname').onchange=e=>{P.name=e.target.value||'Untitled';save()};
$('#new').onclick=()=>newProject(mk('bar','New Chart','Category',['A','B','C'],[['Value',['10','20','30']]]),'Untitled project');
$('#save').onclick=()=>{save();toast('Saved in this browser')};
$('#plist').onclick=e=>{const t=e.target.dataset;if(t.open){P=Store.all()[t.open];S=P.data;hist=[];fut=[];last=JSON.stringify(S);Store.setCur(P.id);renderAll();renderProjects()}
else if(t.dup){const o=Store.all()[t.dup];const c=JSON.parse(JSON.stringify(o));c.id=uid();c.name+=' (copy)';Store.put(c);renderProjects();toast('Duplicated')}
else if(t.pdel&&ask('Delete this project permanently?')){Store.del(t.pdel);if(t.pdel===P.id)newProject(SAMPLES.expenses());else renderProjects()}};
$('#openbtn').onclick=()=>$('#sidebar').classList.toggle('show-proj');
$('#expproj').onclick=()=>download(fname()+'.chartcraft.json',JSON.stringify(P,null,1),'application/json');
$('#impproj').onchange=async e=>{try{const p=JSON.parse(await e.target.files[0].text());if(!p.data||!p.data.series)throw 0;p.id=uid();P=p;S=P.data;hist=[];fut=[];last=JSON.stringify(S);renderAll();save()}catch{toast('Invalid project file')}e.target.value=''};
$('#xcsv').onclick=()=>download(fname()+'.csv',csvOut(),'text/csv');
$('#xjson').onclick=()=>download(fname()+'.config.json',JSON.stringify(S,null,1),'application/json');
$('#print').onclick=()=>window.print();
$('#copyimg').onclick=async()=>{try{const b=await new Promise(r=>$('#chart').toBlob(r));await navigator.clipboard.write([new ClipboardItem({'image/png':b})]);toast('Copied')}catch{toast('Clipboard not available in this browser/context')}};
const dlg=$('#dlg'),prev=()=>{try{updatePreview(S)}catch(e){toast('Preview failed: '+e.message)}};
$('#exportbtn').onclick=()=>{dlg.showModal();prev()};$('#xclose').onclick=()=>dlg.close();
dlg.querySelectorAll('input,select').forEach(el=>el.addEventListener('change',()=>{$('#xcustom').hidden=$('#xpaper').value!=='Custom';$('#xqrow').hidden=$('#xfmt').value!=='jpg';prev()}));
$('#xgo').onclick=()=>{try{doExport(S)}catch(e){toast('Export failed: '+e.message)}};
$('#xadd').onclick=()=>{try{queue.push(entry(S,exportOpts()));toast('Added to report ('+queue.length+'). Choose PDF to export all.');prev()}catch(e){toast(e.message)}};
$('#xqclear').onclick=()=>{queue.length=0;prev()};
}
window.addEventListener('DOMContentLoaded',init);
