import {useMemo} from 'react';
import {Link} from 'react-router-dom';
import {categories} from './categories';
import {selectHomeMarkets} from './homeSelection';
import {useLiveMarkets} from './liveMarkets';
import {useMarkets,type Market} from './marketData';

// Extend the approved homepage using its existing tokens and card patterns.
const added=['politics','crypto','esports','iran','finance','tech','elections','culture','economy','mentions','art'];
function MarketTile({market,wide,index}:{market:Market;wide:boolean;index:number}){
 const volume=market.volume>=1e6?`$${(market.volume/1e6).toFixed(1)}M`:`$${(market.volume/1e3).toFixed(1)}K`;
 return <Link onClick={e=>e.stopPropagation()} to={`/market/${encodeURIComponent(market.id)}`} className="rounded-xl bg-surface-container p-3 flex flex-col justify-between shadow-md" style={{gridColumn:wide?'1 / -1':undefined,minWidth:0}}>
  <div className="flex items-center justify-between mb-1.5"><span className="font-label-badge text-label-badge text-on-surface-variant uppercase">{market.category}</span>{market.image&&<img src={market.image} alt="" loading="lazy" className="w-9 h-9 rounded-lg" style={{objectFit:'cover'}}/>}</div>
  <h4 className={wide?'font-headline-sm text-headline-sm text-on-surface font-semibold leading-snug mb-2':'font-headline-sm text-body-md text-on-surface font-semibold leading-tight mb-2'}>{market.title}</h4>
  <div className="flex items-center justify-between pt-2 mb-2"><span className="font-label-meta text-body-sm text-on-surface-variant">Vol {volume}</span>{index%3===0?<span style={{width:44,height:44,borderRadius:'50%',background:`conic-gradient(#0bba74 ${market.yes}%,#ff4761 0)`,display:'grid',placeItems:'center'}}><span className="bg-surface-container font-mono-price-md text-label-badge" style={{width:34,height:34,borderRadius:'50%',display:'grid',placeItems:'center'}}>{market.yes}%</span></span>:<span className="font-mono-price-md text-body-md text-secondary font-bold">{market.yes}% YES</span>}</div>
  <div className="w-full h-1.5 rounded-full flex overflow-hidden mb-2" style={{background:'#ff4761'}}><span style={{width:`${market.yes}%`,background:'#0bba74'}}/></div>
  <div className="grid grid-cols-2 gap-1.5"><span className="py-1 rounded bg-secondary/15 text-secondary text-center font-mono-price-md text-label-badge font-bold">YES {market.yes}¢</span><span className="py-1 rounded bg-tertiary/15 text-tertiary text-center font-mono-price-md text-label-badge font-bold">NO {market.no}¢</span></div>
 </Link>;
}
export function CategorySection({id,index=0,count=12,embedded=false}:{id:string;index?:number;count?:number;embedded?:boolean}){
 const c=categories.find(c=>c.id===id)!;const {markets,status,retry}=useMarkets(id);const limit=count;const chosen=useMemo(()=>selectHomeMarkets(markets,id,limit),[markets,id,limit]);const live=useLiveMarkets(chosen);const selected=live.markets;
 return <section className={embedded?'flex flex-col gap-space-sm':'w-full px-margin pt-space-xl flex flex-col gap-space-sm'} aria-label={`${c.name} markets`} data-home-category={id} data-ws-status={live.connection} data-ws-messages={live.messages}>
  {!embedded&&<div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="material-symbols-outlined text-[18px] text-primary">{c.icon}</span><h3 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">{c.name}</h3></div><Link onClick={e=>e.stopPropagation()} to={`/category/${id}`} className="font-headline-sm text-body-sm text-primary flex items-center">View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span></Link></div>}
  {selected.length?<div className="grid grid-cols-2 gap-space-sm">{selected.map((m,i)=><MarketTile key={m.id} market={m} index={i} wide={limit===5?i===(index%2===0?0:2):index%2===0?i===0||i===3:i===2||i===5}/>)}</div>:<div className="rounded-xl bg-surface-container p-3"><p className="font-body-sm text-body-sm text-on-surface-variant">{status==='loading'?`Loading ${c.name} markets…`:status==='error'?'Unable to load this feed.':'No active markets are currently available.'}</p>{status!=='loading'&&<button onClick={e=>{e.stopPropagation();retry();}} className="text-primary font-body-sm text-body-sm">Refresh markets</button>}</div>}
 </section>;
}
export function HomeCategories(){return <>{added.map((id,i)=><CategorySection key={id} id={id} index={i}/>)}</>;}
