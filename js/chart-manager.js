const PALETTES={Ocean:['#4f46e5','#0d9488','#7c3aed','#0ea5e9','#f59e0b','#ec4899','#64748b','#22c55e'],
Pastel:['#a5b4fc','#99f6e4','#c4b5fd','#bae6fd','#fde68a','#fbcfe8','#cbd5e1','#bbf7d0'],
Mono:['#1e293b','#475569','#64748b','#94a3b8','#cbd5e1','#334155','#0f172a','#e2e8f0'],
Vivid:['#ef4444','#3b82f6','#10b981','#f59e0b','#8b5cf6','#ec4899','#14b8a6','#f97316']};
const TYPES={pie:'Pie',doughnut:'Doughnut',line:'Line',bar:'Bar',hbar:'Horizontal bar',area:'Area',stacked:'Stacked bar',radar:'Radar',scatter:'Scatter'};
function fmtVal(v,S){if(v==null)return'–';const d=S.dec;if(S.fmt==='currency')return v.toLocaleString(undefined,{style:'currency',currency:'USD',minimumFractionDigits:d,maximumFractionDigits:d});
const n=v.toLocaleString(undefined,{minimumFractionDigits:d,maximumFractionDigits:d});return S.fmt==='percent'?n+'%':n}
function buildConfig(S,o={}){const pal=PALETTES[S.palette]||PALETTES.Ocean,dark=S.theme==='dark',txt=dark?'#e5e7eb':'#1f2937',grid=dark?'#374151':'#e5e7eb';
const bg=o.bg!==undefined?o.bg:(dark?'#111827':'#ffffff'),t=S.type,pie=t==='pie'||t==='doughnut';
const col=S.colors||{};const color=(k,i)=>col[k]||pal[i%pal.length];
const vals=S.series.map(s=>S.labels.map((_,i)=>Calc.num(s.values[i])));
let datasets,labels=S.labels.map((l,i)=>l||'#'+(i+1)),type=({hbar:'bar',stacked:'bar',area:'line'})[t]||t;
if(pie){const pc=Calc.percentages(vals[0]);labels=labels.map((l,i)=>pc[i]==null?l:`${l} (${pc[i].toFixed(S.dec)}%)`);
datasets=[{label:S.series[0].name,data:vals[0].map(v=>v==null?0:v),backgroundColor:S.labels.map((_,i)=>color('p'+i,i)),borderColor:bg||'#fff',borderWidth:S.border}]}
else if(t==='scatter')datasets=[{label:S.series[0].name,data:vals[0].map((v,i)=>({x:Calc.num(S.labels[i])??i,y:v})).filter(p=>p.y!=null),backgroundColor:color('s0',0),pointRadius:S.point+2}];
else datasets=S.series.map((s,i)=>{const c=color('s'+i,i);return{label:s.name,data:vals[i],backgroundColor:t==='area'||t==='radar'?c+'55':c,borderColor:c,borderWidth:S.border,fill:t==='area'||t==='radar',tension:S.curve?.4:0,pointRadius:S.point}});
const sc=pie||t==='radar'?{}:{x:{stacked:t==='stacked',title:{display:!!S.xt,text:S.xt,color:txt},grid:{display:S.grid,color:grid},ticks:{color:txt}},
y:{stacked:t==='stacked',beginAtZero:t!=='scatter',title:{display:!!S.yt,text:S.yt,color:txt},grid:{display:S.grid,color:grid},ticks:{color:txt}}};
if(t==='radar')sc.r={grid:{color:grid},angleLines:{color:grid},pointLabels:{color:txt},ticks:{color:txt,backdropColor:'transparent'}};
const dl={id:'dl',afterDatasetsDraw(ch){if(!S.dlabels)return;const c=ch.ctx;c.save();c.font=`600 ${Math.max(10,S.size-2)}px ${S.font}`;c.fillStyle=pie?'#fff':txt;c.textAlign='center';c.textBaseline='middle';
ch.data.datasets.forEach((d,di)=>ch.getDatasetMeta(di).data.forEach((e,i)=>{let v=d.data[i];if(v&&typeof v==='object')v=v.y;if(v==null)return;const p=e.tooltipPosition();
let s=fmtVal(v,S);if(pie){const pc=Calc.percentages(d.data)[i];if(pc!=null)s=pc.toFixed(S.dec)+'%'}
c.fillText(s,p.x,pie||t==='stacked'?p.y:p.y-10)}));c.restore()}};
const bgp={id:'bg',beforeDraw(ch){if(!bg)return;const c=ch.ctx;c.save();c.globalCompositeOperation='destination-over';c.fillStyle=bg;c.fillRect(0,0,ch.width,ch.height);c.restore()}};
return{type,data:{labels:t==='scatter'?undefined:labels,datasets},plugins:[dl,bgp],options:{responsive:true,maintainAspectRatio:true,aspectRatio:S.ratio,animation:o.anim===false?false:(S.anim?{duration:600}:false),devicePixelRatio:o.scale,
indexAxis:t==='hbar'?'y':'x',cutout:t==='doughnut'?S.hole+'%':0,scales:sc,
font:{family:S.font,size:S.size},color:txt,layout:{padding:12},
plugins:{legend:{display:S.legend!=='none',position:S.legend==='none'?'top':S.legend,labels:{color:txt}},
title:{display:!!S.title,text:S.title,color:txt,font:{size:S.size+6,weight:'700'}},subtitle:{display:!!S.sub,text:S.sub,color:txt},
tooltip:{callbacks:{label:c=>{let v=c.parsed;if(typeof v==='object')v=v.y??v.r;return `${c.dataset.label||''}: ${fmtVal(v,S)}`}}}}}}}
let chart;
function drawChart(S){if(chart)chart.destroy();chart=new Chart($('#chart'),buildConfig(S))}
function statLines(S){const out=[],f=v=>fmtVal(v,S),pie=S.type==='pie'||S.type==='doughnut';
S.series.forEach((s,k)=>{if(pie&&k)return;const vals=S.labels.map((_,i)=>Calc.num(s.values[i]));const d=Calc.describe(S.labels,vals);
if(!d){out.push(`${s.name}: no valid data`);return}
out.push(`${s.name}: total ${f(d.total)}, average ${f(d.avg)}, highest ${d.max.l} (${f(d.max.v)}), lowest ${d.min.l} (${f(d.min.v)})`);
if(pie){const pc=Calc.percentages(vals);if(pc.every(x=>x==null))out.push('Percentages unavailable (negative values or zero total).');
else out.push('Ranking: '+d.rank.map((r,n)=>`${n+1}. ${r.l} ${f(r.v)} (${pc[r.i].toFixed(S.dec)}%)`).join('; '))}
else if(S.type==='line'||S.type==='area'){const fp=x=>x.pct==null?'n/a':(x.pct>=0?'+':'')+x.pct.toFixed(S.dec)+'%';
out.push(`Trend: ${d.trend}; overall change ${d.overall.abs>=0?'+':''}${f(d.overall.abs)} (${fp(d.overall)})`);
if(d.steps.length)out.push('Changes: '+d.steps.map(x=>`${x.from} to ${x.to} ${x.abs>=0?'+':''}${f(x.abs)} (${fp(x)})`).join('; '))}
else{out.push('Ranking: '+d.rank.map((r,n)=>`${n+1}. ${r.l} ${f(r.v)}`).join('; '));out.push(`Gap highest-lowest: ${f(d.max.v-d.min.v)}`)}});return out}
