const Calc={
num(v){if(v===''||v==null)return null;const n=Number(String(v).replace(/[,\s$€£%]/g,''));return Number.isFinite(n)?n:null},
total:a=>a.reduce((s,v)=>s+(v==null?0:v),0),
percentages(vals){const ok=vals.every(v=>v==null||v>=0);const t=Calc.total(vals);if(!ok||t<=0)return vals.map(()=>null);return vals.map(v=>v==null?null:v/t*100)},
change(a,b){if(a==null||b==null)return{abs:null,pct:null};return{abs:b-a,pct:a===0?null:(b-a)/Math.abs(a)*100}},
describe(labels,vals){const p=vals.map((v,i)=>({l:labels[i]||'#'+(i+1),v,i})).filter(x=>x.v!=null);
if(!p.length)return null;const t=Calc.total(p.map(x=>x.v));const s=[...p].sort((a,b)=>b.v-a.v);
const steps=[];for(let i=1;i<p.length;i++)steps.push({from:p[i-1].l,to:p[i].l,...Calc.change(p[i-1].v,p[i].v)});
const o=Calc.change(p[0].v,p[p.length-1].v);
return{count:p.length,total:t,avg:t/p.length,max:s[0],min:s[s.length-1],rank:s,steps,overall:o,trend:o.abs>0?'upward':o.abs<0?'downward':'flat'}}};
if(typeof module!=='undefined')module.exports=Calc;
