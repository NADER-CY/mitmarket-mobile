import fs from 'node:fs';
import vm from 'node:vm';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
const files=fs.readdirSync('public/design').filter(x=>x.endsWith('.html'));
const configs=[];
for(const name of files){const raw=fs.readFileSync(`public/design/${name}`,'utf8');const code=raw.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/)?.[1];if(code){const context={tailwind:{}};vm.runInNewContext(code,context);configs.push(context.tailwind.config);}}
// All reference screens share tokens; retain the union of extensions.
const extend={};for(const c of configs)for(const [k,v] of Object.entries(c.theme.extend))extend[k]={...extend[k],...v};
for(const [name,families] of Object.entries(extend.fontFamily||{}))extend.fontFamily[name]=[...families,families.includes('JetBrains Mono')?'monospace':'sans-serif'];
const result=await postcss([tailwind({darkMode:'class',content:files.map(f=>`public/design/${f}`),theme:{extend}})]).process('@tailwind base;\n@tailwind components;\n@tailwind utilities;',{from:undefined});
fs.writeFileSync('src/reference-utilities.css',result.css);
console.log(`Compiled design styles for ${files.length} reference pages (${result.css.length} bytes).`);
