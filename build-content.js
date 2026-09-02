const fs=require('fs');const path=require('path');
const src=path.join(__dirname,'content','informativos');const outDir=path.join(__dirname,'data');fs.mkdirSync(outDir,{recursive:true});
let posts=[];
if(fs.existsSync(src)) for(const file of fs.readdirSync(src).filter(f=>f.endsWith('.json'))){try{const p=JSON.parse(fs.readFileSync(path.join(src,file),'utf8'));if(p.published===false)continue;p.slug=file.replace(/\.json$/,'');posts.push(p)}catch(e){console.warn('Ignorando',file,e.message)}}
posts.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));fs.writeFileSync(path.join(outDir,'informativos.json'),JSON.stringify(posts,null,2));console.log(`Informativos: ${posts.length} publicação(ões).`);
