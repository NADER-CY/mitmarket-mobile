import {useRef} from 'react';
import {Link,NavLink,Navigate,Route,Routes,useParams} from 'react-router-dom';
import {categories,homeLimits} from './categories';
import {useMarkets,type Market} from './marketData';
import {ScreenIndex,ScreenView} from './Screens';

function Icon({name}: {name:string}) {return <span className="material-symbols-outlined" aria-hidden="true">{name}</span>}

function Header(){return <header className="topbar"><Link className="wordmark" to="/"><span className="logo-dot"/>MITMARKET</Link><div className="header-actions"><Link to="/screens" aria-label="All 56 screens"><Icon name="apps"/></Link><Link to="/search" aria-label="Search"><Icon name="search"/></Link><Link to="/notifications" aria-label="Notifications"><Icon name="notifications"/></Link><Link to="/wallet" aria-label="Wallet"><Icon name="account_balance_wallet"/></Link><Link className="avatar" to="/profile" aria-label="Profile"><Icon name="person"/></Link></div></header>}

function BottomNav(){const links=[['/','Home','home'],['/explore','Explore','explore'],['/markets','Markets','candlestick_chart'],['/portfolio','Portfolio','donut_large'],['/profile','Profile','account_circle']];return <nav className="bottom-nav" aria-label="Primary">{links.map(([to,label,icon])=><NavLink end={to==='/'} key={to} to={to} className={({isActive})=>isActive?'active':''}><Icon name={icon}/><span>{label}</span></NavLink>)}</nav>}

function CategoryStrip(){
  const start=useRef<{x:number;scroll:number;dragged:boolean}|null>(null);
  const blockedClick=useRef(false);
  return <nav className="category-strip" aria-label="Market categories"
    onWheel={e=>{if(e.deltaY!==0&&e.currentTarget.scrollWidth>e.currentTarget.clientWidth){e.currentTarget.scrollLeft+=e.deltaY;}}}
    onPointerDown={e=>{if(e.pointerType==='mouse'){start.current={x:e.clientX,scroll:e.currentTarget.scrollLeft,dragged:false};}}}
    onPointerMove={e=>{const s=start.current;if(!s)return;const diff=e.clientX-s.x;if(Math.abs(diff)>5){s.dragged=true;e.currentTarget.classList.add('dragging');e.currentTarget.scrollLeft=s.scroll-diff;}}}
    onPointerUp={e=>{blockedClick.current=!!start.current?.dragged;start.current=null;e.currentTarget.classList.remove('dragging');}}
    onPointerLeave={e=>{start.current=null;e.currentTarget.classList.remove('dragging');}}
    onClickCapture={e=>{if(blockedClick.current){e.preventDefault();e.stopPropagation();blockedClick.current=false;}}}
  >{categories.map(c=><NavLink key={c.id} to={`/category/${c.id}`} className={({isActive})=>isActive?'category-pill '+(isActive?'active':''):'category-pill'}><Icon name={c.icon}/>{c.name}</NavLink>)}</nav>
}

function Money({value}:{value:number}){return <>{value>=1_000_000?`$${(value/1_000_000).toFixed(1)}M`:value>=1_000?`$${(value/1000).toFixed(1)}K`:`$${Math.round(value)}`}</>}

function ProbabilityDonut({yes,size=48}:{yes:number;size?:number}){return <div className="prob-donut" style={{width:size,height:size,background:`conic-gradient(#0bba74 0 ${yes}%,#ff4761 ${yes}% 100%)`}} aria-label={`YES ${yes} percent, NO ${100-yes} percent`}><span>{yes}%</span></div>}

function MarketCard({market,large=false,visual=false}:{market:Market;large?:boolean;visual?:boolean}){return <Link className={'market-card '+(large?'featured':'')+(visual?' with-chart':'')} to={`/market/${encodeURIComponent(market.id)}`}><div className="market-card-top">{market.image?<img src={market.image} alt="" loading="lazy"/>:<span className="market-placeholder"><Icon name="query_stats"/></span>}<span className="category-label">{market.category}</span>{visual&&<ProbabilityDonut yes={market.yes}/>}</div><h3>{market.title}</h3><div className="probability"><span>YES <b>{market.yes}%</b></span><span>NO <b>{market.no}%</b></span></div><div className="prob-bar"><span style={{width:`${market.yes}%`}}/></div><div className="market-card-footer"><span><Money value={market.volume}/> Vol.</span><div><span className="yes-button">YES {market.yes}¢</span><span className="no-button">NO {market.no}¢</span></div></div></Link>}

function Home(){const {markets,status}=useMarkets();const hero=markets[0];return <><CategoryStrip/><main className="page"><div className="eyebrow"><span className="live-dot"/> SPOTLIGHT MARKET</div>{hero?<div className="hero"><div className="hero-image" style={hero.image?{backgroundImage:`linear-gradient(180deg,rgba(16,18,22,.2),#101216),url(${hero.image})`}:undefined}/><span className="featured-badge">FEATURED</span><h1>{hero.title}</h1><div className="hero-probs"><strong>YES {hero.yes}%</strong><strong>NO {hero.no}%</strong></div><div className="prob-bar"><span style={{width:`${hero.yes}%`}}/></div><div className="hero-actions"><Link to={`/market/${hero.id}`} className="yes-button">Buy YES</Link><Link to={`/market/${hero.id}`} className="no-button">Buy NO</Link></div><small><Money value={hero.volume}/> Volume</small></div>:<div className="state-card">{status==='loading'?'Loading market data…':'Markets currently unavailable'}{status==='error'&&<p>Check your connection and try again.</p>}</div>}
    <div className="section-title"><h2><Icon name="dashboard"/> Market Intelligence Mosaic</h2><Link to="/markets">View All</Link></div><div className="mosaic">{markets.slice(1,7).map((m,i)=><div key={m.id} className={i===0||i===3?'span-2':''}><MarketCard market={m} visual={i===0||i===3||i===5}/></div>)}</div>
    <div className="section-title"><h2><Icon name="local_fire_department"/> Top Ranked Markets</h2><Link to="/category/trending">View All</Link></div><div className="ranked-list">{markets.slice(7,12).map((m,i)=><Link to={`/market/${m.id}`} key={m.id}><b>#{i+1}</b><span>{m.title}</span><strong>{m.yes}% YES</strong></Link>)}</div>
    {categories.filter(c=>homeLimits[c.id]).map(c=><section key={c.id}><div className="section-title"><h2><Icon name={c.icon}/> {c.name}</h2><Link to={`/category/${c.id}`}>View All</Link></div><div className="horizontal-cards">{markets.slice(0,homeLimits[c.id]).map(m=><MarketCard key={`${c.id}-${m.id}`} market={m}/>)}</div></section>)}
  </main></>}

function Explore(){const {markets,status}=useMarkets('explore');return <main className="page"><h1>Explore Markets</h1><CategoryStrip/><div className="mosaic">{markets.map(m=><MarketCard key={m.id} market={m}/>)}</div>{status==='error'&&<p>Unable to load markets.</p>}</main>}
function MarketDetail(){const {id}=useParams();const {markets}=useMarkets('detail');const market=markets.find(m=>m.id===id);return <main className="page"><Link to="/">← Back</Link>{market?<><h1>{market.title}</h1><MarketCard market={market} large/><div className="state-card">Live order entry is not enabled in this phase. No real orders can be placed.</div></>:<div className="state-card">Loading market details…</div>}</main>}
function CategoryPage(){const {category}=useParams();const {markets}=useMarkets(category);return <main className="page"><h1>{categories.find(c=>c.id===category)?.name||'Markets'}</h1><p className="hint">Category-specific desktop filters will be wired in the next integration phase.</p><div className="mosaic">{markets.map(m=><MarketCard market={m} key={m.id}/>)}</div></main>}
function PendingPage(){return <main className="page"><h1>Coming next</h1><div className="state-card">This screen is being converted from the approved Google Stitch design. No simulated account balances or trades are shown.</div></main>}
export function App(){return <div className="mobile-app"><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/explore" element={<Explore/>}/><Route path="/markets" element={<Explore/>}/><Route path="/market/:id" element={<MarketDetail/>}/><Route path="/category/:category" element={<CategoryPage/>}/><Route path="/screens" element={<ScreenIndex/>}/><Route path="/screen/:slug" element={<ScreenView/>}/><Route path="/wallet" element={<ScreenViewRedirect slug="mitmarket_wallet_overview"/>}/><Route path="/portfolio" element={<ScreenViewRedirect slug="mitmarket_portfolio"/>}/><Route path="/profile" element={<ScreenViewRedirect slug="mitmarket_user_profile"/>}/><Route path="/notifications" element={<ScreenViewRedirect slug="mitmarket_notifications_alerts"/>}/><Route path="/search" element={<ScreenViewRedirect slug="mitmarket_global_search"/>}/><Route path="*" element={<PendingPage/>}/></Routes><BottomNav/></div>}
function ScreenViewRedirect({slug}:{slug:string}){return <Navigate to={`/screen/${slug}`} replace/>}
