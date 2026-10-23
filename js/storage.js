const Store={
all(){try{return JSON.parse(localStorage.getItem('cc.projects')||'{}')}catch{return{}}},
put(p){const a=Store.all();a[p.id]=p;localStorage.setItem('cc.projects',JSON.stringify(a))},
del(id){const a=Store.all();delete a[id];localStorage.setItem('cc.projects',JSON.stringify(a))},
cur(){return localStorage.getItem('cc.cur')},setCur(id){localStorage.setItem('cc.cur',id)}};
