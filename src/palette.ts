// MITMARKET colors only. This transform never touches layout or typography.
const colors:Record<string,string>={
 '#071420':'#101216','#030f1b':'#0c0e12','#101d29':'#15191f','#14212d':'#15191f','#1f2b38':'#1c2028','#293643':'#252b34','#2e3a48':'#303744',
 '#d7e4f5':'#f4f6fa','#c3c5d8':'#929aaa','#8d90a2':'#929aaa','#424656':'#303744',
 '#b4c5ff':'#1463ff','#dbe1ff':'#1463ff','#0052dd':'#1463ff','#003daa':'#1463ff','#002979':'#f4f6fa','#00174c':'#f4f6fa','#f5f5ff':'#f4f6fa',
 '#4cdf95':'#0bba74','#6dfdaf':'#0bba74','#00b872':'#0bba74','#005230':'#0bba74','#004025':'#0bba74','#003920':'#071c14','#002110':'#071c14',
 '#d72747':'#ff4761','#ffb3b5':'#ff4761','#ffdada':'#ff4761','#920027':'#ff4761','#680019':'#2c1019','#40000c':'#2c1019','#fff3f3':'#f4f6fa',
};
const rgb=new Map(Object.entries(colors).map(([from,to])=>[hexRGB(from).join(','),hexRGB(to)]));
function hexRGB(hex:string){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
export function applyPalette(css:string){
 return css.replace(/#[\da-f]{6}\b/gi,value=>colors[value.toLowerCase()]||value).replace(/\b(rgb|rgba)\(\s*(\d+)([ ,]+)(\d+)([ ,]+)(\d+)/gi,(value,fn:string,r:string,sep:string,g:string,sep2:string,b:string)=>{const replacement=rgb.get(`${r},${g},${b}`);return replacement?`${fn}(${replacement[0]}${sep}${replacement[1]}${sep2}${replacement[2]}`:value;});
}
