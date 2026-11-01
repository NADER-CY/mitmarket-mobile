import {useEffect,useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import type {Market} from './marketData';
import {useHistory} from './HeroSlider';
import cryptoHtml from './approvedCryptoSlide.html?raw';
import sportsHtml from './approvedSportsSlide.html?raw';
export function ApprovedCryptoSlide({market,variant="crypto"}:{market?:Market;variant?:"crypto"|"sports"}){
 const host=useRef<HTMLDivElement>(null);const navigate=useNavigate();const {points,status}=useHistory(market?.token||'');
 useEffect(()=>{if(!host.current)return;const root=host.current.shadowRoot||host.current.attachShadow({mode:'open'});root.innerHTML=variant==="sports"?sportsHtml:cryptoHtml;},[variant]);
 useEffect(()=>{const root=host.current?.shadowRoot;if(!root)return;const field=(name:string)=>root.querySelector<HTMLElement>(`[data-field="${name}"]`);const set=(name:string,value:string)=>{const el=field(name);if(el)el.textContent=value;};const money=(n?:number)=>n===undefined?'—':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:2}).format(n);
 set('title',market?.title||`Loading live ${variant} market…`);set('volume',money(market?.volume));set('yes',market?`${market.yes}%`:'—');set('no',market?`${market.no}%`:'—');set('yes-price',market?`${market.yes}¢`:'—');set('no-price',market?`${market.no}¢`:'—');set('liquidity',money(market?.liquidity));set('end',market?.endDate?new Date(market.endDate).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'UTC'})+' UTC':'—');
 const delta=market&&points.length>1?market.yes-points[0].p*100:null;set('yes-change',delta===null?'—':`${delta>=0?'▲':'▼'} ${Math.abs(delta).toFixed(1)}%`);set('no-change',delta===null?'—':`${delta>=0?'▼':'▲'} ${Math.abs(delta).toFixed(1)}%`);
 for(const side of ['yes','no'] as const){const bar=field(side+'-bar');if(bar)bar.style.width=`${market?.[side]||0}%`;}
 const svg=root.querySelector('svg[viewBox="0 0 80 16"]');const line=field('chart-line'),area=field('chart-area'),dot=field('chart-dot');set('history-label',points.length>1?'24H PROBABILITY':status==='loading'?'LOADING HISTORY':'HISTORY UNAVAILABLE');
 if(svg&&line&&area&&dot){const sample=points.slice(-48);const coords=sample.map((p,i)=>[i/Math.max(1,sample.length-1)*80,14-p.p*12]);const path=coords.length>1?'M '+coords.map(p=>p.join(' ')).join(' L '):'';line.setAttribute('d',path);area.setAttribute('d',path?path+' L 80 16 L 0 16 Z':'');dot.style.display=path?'':'none';if(coords.length){dot.setAttribute('cx',String(coords.at(-1)![0]));dot.setAttribute('cy',String(coords.at(-1)![1]));}}
 root.querySelectorAll('button').forEach((button,i)=>{button.disabled=!market;button.onclick=()=>{if(market)navigate(`/market/${market.id}?side=${i===0?'yes':'no'}`);};});
 },[market,points,status,navigate,variant]);
 return <div ref={host} style={{width:'100%'}}/>;
}
