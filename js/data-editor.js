function renderEditor(S){const e=$('#editor');
let h=`<table><thead><tr><th><input data-h="cat" value="${esc(S.cat)}" title="Rename column"></th>`;
S.series.forEach((s,k)=>h+=`<th><input data-h="s${k}" value="${esc(s.name)}" title="Rename series">${S.series.length>1?`<button class="x" data-ds="${k}" title="Delete series">×</button>`:''}</th>`);
h+='<th></th></tr></thead><tbody>';
S.labels.forEach((l,i)=>{h+=`<tr><td><input data-l="${i}" value="${esc(l)}"></td>`;
S.series.forEach((s,k)=>{const v=s.values[i]??'',bad=v!==''&&Calc.num(v)==null;h+=`<td><input data-v="${k},${i}" class="${bad?'bad':''}" title="${bad?'Not a valid number - ignored':''}" value="${esc(v)}" inputmode="decimal"></td>`});
h+=`<td><button class="x" data-dr="${i}" title="Delete row">×</button></td></tr>`});
e.innerHTML=h+'</tbody></table>'+(S.labels.length?'':'<p class="empty">No data yet. Add a row or import a CSV.</p>')}
