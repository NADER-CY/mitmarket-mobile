import {ApprovedCryptoSlide} from './ApprovedCryptoSlide';
import {useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {useMarkets} from './marketData';
import {selectHomeMarkets} from './homeSelection';
import {MiniHistory} from './HeroSlider';
import {useLiveMarkets} from './liveMarkets';
export function DesignMarketSlider({category='trending',count=5,home=false}:{category?:string;count?:number;home?:boolean}){
 const feed=useMarkets(category);const crypto=useMarkets(home?'crypto':category);const sports=useMarkets(home?'sports':category);const finance=useMarkets(home?'finance':category);
 const selected=useMemo(()=>{const pools=home?[feed,crypto,sports,finance].map((f,i)=>selectHomeMarkets(f.markets,['trending','crypto','sports','finance'][i],3)):[];return home?[0,1,2].flatMap(i=>pools.flatMap(pool=>pool[i]?[pool[i]]:[])).filter((m,i,all)=>all.findIndex(x=>x.id===m.id)===i).slice(0,count):selectHomeMarkets(feed.markets,category,count);},[feed.markets,crypto.markets,sports.markets,finance.markets,home,category,count]);
 const live=useLiveMarkets(selected);const slides=live.markets;const approvedMarket=useLiveMarkets(crypto.markets.slice(0,1)).markets[0];
 const [index,setIndex]=useState(0);const [paused,setPaused]=useState(false);const [start,setStart]=useState<number|null>(null);
 useEffect(()=>{if(paused||slides.length<2)return;const timer=window.setInterval(()=>setIndex(i=>(i+1)%slides.length),8000);return()=>window.clearInterval(timer);},[paused,slides.length]);
 const move=(delta:number)=>setIndex(i=>(i+delta+slides.length)%slides.length);const m=slides[index%Math.max(slides.length,1)];
 return <section data-ws-status={live.connection} data-ws-messages={live.messages} className="reference-carousel" style={home?{height:414,padding:0,background:"transparent",boxShadow:"none"}:undefined} aria-label={home?'Homepage featured markets':`${category} featured markets`} onClick={e=>e.stopPropagation()} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocus={()=>setPaused(true)} onBlur={()=>setPaused(false)} onTouchStart={e=>setStart(e.touches[0].clientX)} onTouchEnd={e=>{if(start!==null&&Math.abs(e.changedTouches[0].clientX-start)>40)move(e.changedTouches[0].clientX<start?1:-1);setStart(null);}}>
 <div className="reference-carousel-top"><span>SPOTLIGHT MARKETS</span><div><button aria-label="Previous spotlight slide" onClick={()=>move(-1)} disabled={!slides.length}>‹</button><span aria-live="polite">{slides.length?index%slides.length+1:0} / {slides.length||count}</span><button aria-label="Next spotlight slide" onClick={()=>move(1)} disabled={!slides.length}>›</button></div></div>
 {home&&index%Math.max(slides.length,1)===0?<ApprovedCryptoSlide market={approvedMarket}/>:m?<><div className="reference-carousel-title"><span>{m.category}</span><Link to={`/market/${m.id}`}>{m.title}</Link></div><div className="reference-carousel-odds"><b>{m.yes}% YES</b><b>{m.no}% NO</b></div><div className="reference-carousel-meter"><i style={{width:`${m.yes}%`}}/></div><div className="reference-carousel-actions"><Link to={`/market/${m.id}`}>YES <b>{m.yes}¢</b></Link><Link to={`/market/${m.id}`}>NO <b>{m.no}¢</b></Link></div><MiniHistory key={m.token} token={m.token}/></>:<div className="reference-carousel-loading">{feed.status==='error'?'Market feed unavailable.':'Loading featured markets…'}</div>}
 <div className="reference-carousel-dots">{slides.map((m,i)=><button key={m.id} aria-label={`Spotlight slide ${i+1}`} aria-current={index%slides.length===i?'true':undefined} onClick={()=>setIndex(i)}/>)}</div>
 </section>;
}
