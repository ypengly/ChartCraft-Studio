const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2500)}
function download(name,data,type){const b=data instanceof Blob?data:new Blob([data],{type});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function parseTable(text){const d=text.includes('\t')?'\t':',';const rows=[];let r=[],c='',q=false;
for(let i=0;i<text.length;i++){const ch=text[i];
if(q){if(ch==='"'){if(text[i+1]==='"'){c+='"';i++}else q=false}else c+=ch}
else if(ch==='"'&&c==='')q=true;else if(ch===d){r.push(c);c=''}
else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&text[i+1]==='\n')i++;r.push(c);rows.push(r);r=[];c=''}else c+=ch}
if(c!==''||r.length){r.push(c);rows.push(r)}
return rows.filter(x=>x.some(v=>v.trim()!==''))}
if(typeof module!=='undefined')module.exports={parseTable};
