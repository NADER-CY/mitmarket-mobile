import fs from 'node:fs';
const templates={};
for(const file of fs.readdirSync('public/design').filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(`public/design/${file}`,'utf8');
 const styles=[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>`<style>${m[1]}</style>`).join('');
 const body=html.match(/<body\b[^>]*>[\s\S]*?<\/body>/i)?.[0];if(!body)throw Error(`Missing body: ${file}`);
 templates[file.slice(0,-5)]=`<!doctype html><html><head>${styles}</head>${body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<!--[\s\S]*?-->/g,'').replace(/>\s+</g,'><')}</html>`;
}
fs.writeFileSync('src/designTemplates.json',JSON.stringify(templates));
console.log(`Bundled ${Object.keys(templates).length} page templates; navigation needs no HTML fetch.`);
