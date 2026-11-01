import {useEffect,useState} from 'react';

export type Market = {id:string;title:string;category:string;image:string;yes:number;no:number;volume:number;endDate:string;slug:string;token:string};
type RawMarket = {id?:string;question?:string;outcomePrices?:string|string[];clobTokenIds?:string|string[];volumeNum?:number;volume?:number|string;endDate?:string;slug?:string;active?:boolean;closed?:boolean};
type RawEvent = {id?:string;title?:string;slug?:string;image?:string;icon?:string;volume?:number;volume24hr?:number;markets?:RawMarket[];tags?:{label?:string;slug?:string}[]};

function parsePrices(prices:RawMarket['outcomePrices']):number[]{
  try {const v=typeof prices==='string'?JSON.parse(prices):prices;return Array.isArray(v)?v.map(Number):[];}catch{return [];}
}
function normalize(event:RawEvent):Market|null {
  const m=event.markets?.find(x=>x.active!==false&&x.closed!==true)||event.markets?.[0];
  if(!m)return null;
  const prices=parsePrices(m.outcomePrices);if(prices.length<2||!prices.every(Number.isFinite))return null;
  const title=m.question||event.title||'';if(!title)return null;
  const rawTokens=m.clobTokenIds;let tokens:string[]=[];try{const parsed=typeof rawTokens==='string'?JSON.parse(rawTokens):rawTokens;tokens=Array.isArray(parsed)?parsed.map(String):[];}catch{/* no valid CLOB token */}
  return {id:String(m.id||event.id||title),title,category:event.tags?.[0]?.label||'Markets',image:event.image||event.icon||'',yes:Math.round(prices[0]*100),no:Math.round(prices[1]*100),volume:Number(m.volumeNum||m.volume||event.volume||0),endDate:m.endDate||'',slug:event.slug||m.slug||'',token:tokens[0]||''};
}
const BASE='https://gamma-api.polymarket.com';
const memory=new Map<string,{at:number;markets:Market[]}>();

// Read-only catalog. Phase 2 will reuse the desktop category selectors and quote store.
export function useMarkets(section='trending') {
  const [markets,setMarkets]=useState<Market[]>(()=>memory.get(section)?.markets||[]);
  const [status,setStatus]=useState<'loading'|'ready'|'error'>(markets.length?'ready':'loading');
  useEffect(()=>{
    const cached=memory.get(section);if(cached&&Date.now()-cached.at<300_000){setMarkets(cached.markets);setStatus('ready');return;}
    const controller=new AbortController();setStatus(cached?'ready':'loading');
    const url=new URL('/events',BASE);url.searchParams.set('active','true');url.searchParams.set('closed','false');url.searchParams.set('limit','100');url.searchParams.set('order','volume24hr');url.searchParams.set('ascending','false');
    fetch(url,{signal:controller.signal}).then(async r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json() as Promise<RawEvent[]>;}).then(events=>{
      const rows=events.map(normalize).filter((m):m is Market=>m!==null);
      memory.set(section,{at:Date.now(),markets:rows});setMarkets(rows);setStatus('ready');
    }).catch(()=>{if(!controller.signal.aborted)setStatus('error');});
    return()=>controller.abort();
  },[section]);
  return {markets,status};
}
