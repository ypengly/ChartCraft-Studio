const PAPER={A4:[210,297],A3:[297,420],Letter:[215.9,279.4]};
const queue=[];
function renderExport(S,o){const c=document.createElement('canvas');c.width=o.w;c.height=o.h;c.style.width=o.w+'px';c.style.height=o.h+'px';
const cfg=buildConfig(S,{anim:false,scale:o.scale,bg:o.bg});cfg.options.responsive=false;cfg.options.maintainAspectRatio=false;
const ch=new Chart(c,cfg);const url=c.toDataURL(o.mime,o.q);ch.destroy();return url}
function exportOpts(){const g=id=>$('#'+id).value,fmt=g('xfmt');let bg={theme:undefined,white:'#ffffff',transparent:null}[g('xbg')];
if(fmt!=='png'&&bg===null)bg='#ffffff';
return{w:+g('xw')||1200,h:+g('xh')||700,scale:+g('xscale'),bg,mime:fmt==='jpg'?'image/jpeg':'image/png',q:(+g('xq')||92)/100,fmt}}
function tableRows(S){return S.labels.map((l,i)=>[l,...S.series.map(s=>{const v=Calc.num(s.values[i]);return v==null?'':fmtVal(v,S)})])}
function entry(S,o){return{img:renderExport(S,{...o,mime:'image/png',bg:o.bg===null?'#ffffff':o.bg}),title:S.title,sub:S.sub,w:o.w,h:o.h,lines:$('#xstats').checked?statLines(S):[],table:$('#xtable').checked?[[S.cat,...S.series.map(s=>s.name)],...tableRows(S)]:null}}
function makePDF(S,o){const{jsPDF}=window.jspdf;let pw,ph,fm=$('#xpaper').value;
if(fm==='Custom'){pw=+$('#xpw').value||210;ph=+$('#xph').value||297}else[pw,ph]=PAPER[fm];
const ori=$('#xori').value;if(ori==='landscape'&&pw<ph)[pw,ph]=[ph,pw];if(ori==='portrait'&&pw>ph)[pw,ph]=[ph,pw];
const doc=new jsPDF({orientation:pw>ph?'l':'p',unit:'mm',format:[pw,ph]});const m=12,items=[...queue,entry(S,o)];
items.forEach((it,n)=>{if(n)doc.addPage([pw,ph]);let y=m+4;doc.setFont('helvetica','bold');doc.setFontSize(16);
if($('#xhead').checked){if(it.title){doc.text(doc.splitTextToSize(it.title,pw-2*m),m,y);y+=8}
doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(110);if(it.sub){doc.text(it.sub,m,y);y+=5}doc.text(new Date().toLocaleDateString(),m,y);y+=5;doc.setTextColor(0)}
const maxW=pw-2*m,maxH=(ph-y-m)*(it.lines.length||it.table?0.62:1),r=Math.min(maxW/it.w,maxH/it.h),iw=it.w*r,ih=it.h*r;
doc.addImage(it.img,'PNG',m+(maxW-iw)/2,y,iw,ih);y+=ih+6;doc.setFontSize(9);doc.setFont('helvetica','normal');
it.lines.forEach(l=>{const t=doc.splitTextToSize('- '+l,maxW);if(y+t.length*4>ph-m){doc.addPage([pw,ph]);y=m+4}doc.text(t,m,y);y+=t.length*4+1});
if(it.table){y+=3;it.table.forEach((row,ri)=>{if(y>ph-m){doc.addPage([pw,ph]);y=m+4}const cw=maxW/row.length;doc.setFont('helvetica',ri?'normal':'bold');row.forEach((c,ci)=>doc.text(String(c).slice(0,28),m+ci*cw,y));y+=5})}});
return doc}
function doExport(S){const o=exportOpts(),name=(S.title||'chart').replace(/[^\w-]+/g,'_');
if(o.fmt==='pdf')return makePDF(S,o).save(name+'.pdf');
const [h,b64]=renderExport(S,o).split(',');const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);download(`${name}.${o.fmt}`,new Blob([u],{type:o.mime}))}
function updatePreview(S){const o=exportOpts(),p=$('#xprev');
p.innerHTML=`<img alt="Export preview" src="${renderExport(S,{...o,scale:1,bg:o.bg===null&&o.fmt==='pdf'?'#fff':o.bg})}">`+(o.fmt==='pdf'?`<p class="hint">PDF: ${$('#xpaper').value} ${$('#xori').value}, ${queue.length+1} chart(s). Statistics and table follow the chart.</p>`:'')}
