import {useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import type {Market} from './marketData';

type Point={t:number;p:number};
const historyCache=new Map<string,Point[]>();
function useHistory(token:string){
  const [points,setPoints]=useState<Point[]>(()=>historyCache.get(token)||[]);
  const [status,setStatus]=useState('loading');
  useEffect(()=>{
    setPoints(historyCache.get(token)||[]);
    if(!token){setStatus('unavailable');return;}
    const cache=historyCache.get(token);if(cache){setStatus('ready');return;}
    const ctrl=new AbortController();setStatus('loading');
    const url=new URL('https://clob.polymarket.com/prices-history');
    url.searchParams.set('market',token);url.searchParams.set('interval','1d');url.searchParams.set('fidelity','30');
    fetch(url,{signal:ctrl.signal}).then(r=>{if(!r.ok)throw Error('History unavailable');return r.json() as Promise<{history?:Point[]}>;}).then(body=>{
      const next=(body.history||[]).filter(p=>Number.isFinite(p.t)&&Number.isFinite(p.p)&&p.p>=0&&p.p<=1).sort((a,b)=>a.t-b.t);
      if(!ctrl.signal.aborted){setPoints(next);setStatus(next.length>=2?'ready':'unavailable');if(next.length>=2)historyCache.set(token,next);}
    }).catch(()=>{if(!ctrl.signal.aborted)setStatus('unavailable');});
    return()=>ctrl.abort();
  },[token]);return {points,status};
}
function HistoryChart({token}:{token:string}){
  const {points,status}=useHistory(token);
  const paths=useMemo(()=>{
    if(points.length<2)return null;
    const sampled=points.filter((_,i)=>i%Math.max(1,Math.floor(points.length/70))===0).slice(-90);
    const minT=sampled[0].t,maxT=sampled[sampled.length-1].t;
    const build=(invert=false)=>sampled.map(p=>`${((p.t-minT)/Math.max(1,maxT-minT)*300).toFixed(1)},${((invert?p.p:1-p.p)*130+6).toFixed(1)}`).join(' ');
    return {yes:build(),no:build(true)};
  },[points]);
  return <div className="slider-chart"><div className="slider-chart-header"><span>HISTORICAL ODDS</span><span className="slider-live"><i/> LIVE PRICE</span></div>{paths?<svg viewBox="0 0 325 155" preserveAspectRatio="none" role="img" aria-label="Historical yes and no price chart from Polymarket"><g stroke="#70829a" opacity=".23" strokeDasharray="3 6"><line x1="0" y1="8" x2="300" y2="8"/><line x1="0" y1="40" x2="300" y2="40"/><line x1="0" y1="73" x2="300" y2="73"/><line x1="0" y1="105" x2="300" y2="105"/><line x1="0" y1="138" x2="300" y2="138"/></g><polyline points={paths.yes} stroke="#247bff" fill="none" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/><polyline points={paths.no} stroke="#ff4761" fill="none" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/><g fill="#a9b7c9" fontSize="10" textAnchor="end"><text x="324" y="12">100%</text><text x="324" y="45">75%</text><text x="324" y="77">50%</text><text x="324" y="110">25%</text><text x="324" y="141">0%</text></g></svg>:<div className="slider-chart-pending"><span className="material-symbols-outlined">show_chart</span><p>{status==='loading'?'Loading real price history…':'Historical chart is not available for this market.'}</p></div>}<div className="slider-chart-key"><span><i/> YES</span><span><i/> NO</span></div></div>;
}
export function MiniHistory({token}:{token:string}){
  const {points,status}=useHistory(token);
  if(points.length<2)return <div className="mini-history pending"><span className="material-symbols-outlined">show_chart</span>{status==='loading'?'Loading history…':'Historical data unavailable'}</div>;
  const sample=points.filter((_,i)=>i%Math.max(1,Math.floor(points.length/42))===0).slice(-48);
  const first=sample[0].t,last=sample[sample.length-1].t;
  const coords=sample.map(p=>`${((p.t-first)/Math.max(1,last-first)*300).toFixed(1)},${((1-p.p)*65+5).toFixed(1)}`).join(' ');
  return <div className="mini-history"><span>24H PRICE HISTORY</span><svg viewBox="0 0 300 75" preserveAspectRatio="none" role="img" aria-label="Real 24-hour YES market price trend"><line x1="0" y1="37" x2="300" y2="37" stroke="#607083" strokeOpacity=".27" strokeDasharray="4 6"/><polyline points={coords} fill="none" stroke="#247bff" strokeWidth="2.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
}
export function HeroSlider({markets}:{markets:Market[]}){
  const slides=markets.slice(0,8);const [index,setIndex]=useState(0);
  useEffect(()=>{if(slides.length<2)return;const id=window.setInterval(()=>setIndex(i=>(i+1)%slides.length),9500);return()=>window.clearInterval(id);},[slides.length]);
  if(!slides.length)return <div className="state-card">Loading featured markets…</div>;
  const market=slides[index%slides.length];const prev=()=>setIndex(i=>(i-1+slides.length)%slides.length);const next=()=>setIndex(i=>(i+1)%slides.length);
  return <section className="slider-wrap" aria-label="Featured live market carousel"><div className="slider-nav"><span className="slider-eyebrow"><span className="material-symbols-outlined">auto_awesome</span> FEATURED LIVE MARKETS</span><div><button onClick={prev} aria-label="Previous featured market"><span className="material-symbols-outlined">chevron_left</span></button><b>{index+1} / {slides.length}</b><button onClick={next} aria-label="Next featured market"><span className="material-symbols-outlined">chevron_right</span></button></div></div><div className="slider-content"><div className="slider-headline"><div className="slider-market-top">{market.image?<img src={market.image} alt=""/>:<span className="material-symbols-outlined">public</span>}<span>{market.category} · FEATURED MARKET</span></div><Link to={`/market/${market.id}`} className="slider-title">{market.title}</Link><div className="slider-stats"><strong>{market.yes}%</strong><span>YES</span><span className="slider-dot-live">● LIVE</span><div className="slider-donut" style={{background:`conic-gradient(#0bba74 0 ${market.yes}%,#ff4761 ${market.yes}% 100%)`}}><b>{market.yes}%</b></div></div><div className="slider-trade"><Link to={`/market/${market.id}`}>YES <strong>{market.yes}¢</strong></Link><Link to={`/market/${market.id}`}>NO <strong>{market.no}¢</strong></Link></div><div className="slider-meta"><span>${(market.volume/1000).toFixed(1)}K VOL.</span><span>{market.endDate?`ENDS ${market.endDate.slice(0,10)}`:'LIVE MARKET'}</span></div></div><HistoryChart token={market.token}/></div><div className="slider-dots" aria-label="Select slide">{slides.map((m,i)=><button type="button" key={m.id} onClick={()=>setIndex(i)} className={index===i?'selected':''} aria-label={`Go to slide ${i+1}`} aria-current={index===i?'true':undefined}/>)}</div></section>;
}
