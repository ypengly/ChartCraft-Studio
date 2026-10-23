const assert=require('node:assert/strict');const Calc=require('../js/calculations.js');const{parseTable}=require('../js/utils.js');
const t=(n,f)=>{f();console.log('ok -',n)};
t('pie percentages sum to 100',()=>{const p=Calc.percentages([500,200,300,150]);assert.ok(Math.abs(p.reduce((a,b)=>a+b)-100)<1e-9);assert.ok(Math.abs(p[0]-500/1150*100)<1e-9)});
t('percentages unavailable for zero total / negatives',()=>{assert.deepEqual(Calc.percentages([0,0]),[null,null]);assert.deepEqual(Calc.percentages([5,-1]),[null,null])});
t('num parsing',()=>{assert.equal(Calc.num('1,200'),1200);assert.equal(Calc.num('$5.5'),5.5);assert.equal(Calc.num(''),null);assert.equal(Calc.num('abc'),null);assert.equal(Calc.num('Infinity'),null)});
t('change handles zero base',()=>{assert.deepEqual(Calc.change(0,5),{abs:5,pct:null});assert.equal(Calc.change(100,150).pct,50);assert.equal(Calc.change(-100,-50).pct,50);assert.equal(Calc.change(null,5).abs,null)});
t('describe',()=>{const d=Calc.describe(['a','b','c','d'],[10,null,30,20]);assert.equal(d.total,60);assert.equal(d.avg,20);assert.equal(d.max.l,'c');assert.equal(d.min.l,'a');assert.equal(d.steps.length,2);assert.equal(d.overall.abs,10);assert.equal(d.trend,'upward');assert.equal(Calc.describe(['a'],[null]),null)});
t('csv quoted fields and headers',()=>{const r=parseTable('Category,Amount\n"Rent, utilities",800\n"He said ""hi""",5\n');assert.deepEqual(r,[['Category','Amount'],['Rent, utilities','800'],['He said "hi"','5']])});
t('tab-separated paste',()=>assert.deepEqual(parseTable('A\t1\nB\t2'),[['A','1'],['B','2']]));
