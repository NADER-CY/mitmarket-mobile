import {useRef,useState,useEffect} from 'react';
import {Link,NavLink,Navigate,Route,Routes,useLocation,useNavigate,useParams} from 'react-router-dom';
import {categories} from './categories';
import {useMarkets,useMarket,type Market} from './marketData';
import {ScreenIndex} from './Screens';
import {CategoryShowcases} from './HomeSections';
import {HeroSlider} from './HeroSlider';
import {DesignScreen} from './DesignScreens';
import {ReferencePage} from './ReferencePage';
import {DesignMarketSlider} from './DesignMarketSlider';
import {useLiveMarkets} from './liveMarkets';

function Icon({name}: {name:string}) {return <span className="material-symbols-outlined" aria-hidden="true">{name}</span>}

function Header(){const navigate=useNavigate();return <header className="topbar"><button aria-label="Go back" onClick={()=>{if((window.history.state?.idx||0)>0)navigate(-1);else navigate('/');}} style={{background:'none',border:0,color:'inherit',padding:0,cursor:'pointer'}}><Icon name="arrow_back"/></button><Link className="wordmark" to="/"><span className="logo-dot"/>MITMARKET</Link><div className="header-actions"><Link to="/screens" aria-label="All 56 screens"><Icon name="apps"/></Link><Link to="/search" aria-label="Search"><Icon name="search"/></Link><Link to="/notifications" aria-label="Notifications"><Icon name="notifications"/></Link><Link to="/wallet" aria-label="Wallet"><Icon name="account_balance_wallet"/></Link><Link className="avatar" to="/profile" aria-label="Profile"><Icon name="person"/></Link></div></header>}

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

function Home(){const {markets,status}=useMarkets();return <><CategoryStrip/><main className="page"><div className="eyebrow"><span className="live-dot"/> SPOTLIGHT MARKETS · 8 LIVE SLIDES</div>{markets.length?<HeroSlider markets={markets}/>:<div className="state-card">{status==='loading'?'Loading market data…':'Markets currently unavailable'}{status==='error'&&<p>Check your connection and try again.</p>}</div>}
    <div className="section-title"><h2><Icon name="dashboard"/> Market Intelligence Mosaic</h2><Link to="/markets">View All</Link></div><div className="mosaic">{markets.slice(1,7).map((m,i)=><div key={m.id} className={i===0||i===3?'span-2':''}><MarketCard market={m} visual={i===0||i===3||i===5}/></div>)}</div>
    <div className="section-title"><h2><Icon name="local_fire_department"/> Top Ranked Markets</h2><Link to="/category/trending">View All</Link></div><div className="ranked-list">{markets.slice(7,12).map((m,i)=><Link to={`/market/${m.id}`} key={m.id}><b>#{i+1}</b><span>{m.title}</span><strong>{m.yes}% YES</strong></Link>)}</div>
    <CategoryShowcases markets={markets}/>
  </main></>}

function Explore(){const {markets,status}=useMarkets('explore');return <main className="page"><h1>Explore Markets</h1><CategoryStrip/><div className="mosaic">{markets.map(m=><MarketCard key={m.id} market={m}/>)}</div>{status==='error'&&<p>Unable to load markets.</p>}</main>}
function MarketDetail(){const {id=''}=useParams();const {market,status}=useMarket(id);return market?<ReferencePage page="mitmarket_market_detail_trading" market={market}/>:<main className="page"><Link to="/">← Back to markets</Link><div className="state-card">{status==='error'?'Unable to load this market. Try again.':'Loading live market…'}</div></main>}
function CategoryPage(){const {category='trending'}=useParams();const {markets,status,retry}=useMarkets(category);const [query,setQuery]=useState('');const [sort,setSort]=useState('volume');const [limit,setLimit]=useState(24);
useEffect(()=>{setQuery('');setLimit(24);window.scrollTo(0,0);},[category]);
const liveRows=useLiveMarkets(markets.slice(0,limit));const quoteMap=new Map(liveRows.markets.map(m=>[m.id,m]));const filtered=markets.map(m=>quoteMap.get(m.id)||m).filter(m=>m.title.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='probability'?b.yes-a.yes:b.volume-a.volume);
const screens:Record<string,string>={trending:'mitmarket_trending',breaking:'mitmarket_breaking',combos:'mitmarket_combos',perps:'mitmarket_perps',crypto:'mitmarket_crypto_markets',sports:'mitmarket_sportsbook',activity:'mitmarket_activity_feed',leaderboard:'mitmarket_leaderboard',dashboard:'mitmarket_user_dashboard',rewards:'mitmarket_rewards'};
if(screens[category])return <ScreenViewRedirect slug={screens[category]}/>;
return <><CategoryStrip/><main className="page"><Link to="/">← Home</Link><h1>{categories.find(c=>c.id===category)?.name||'Markets'}</h1><DesignMarketSlider category={category} count={category==='iran'?3:5}/><div className="category-controls"><input aria-label="Search category" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search this category…"/><select aria-label="Sort markets" value={sort} onChange={e=>setSort(e.target.value)}><option value="volume">Highest volume</option><option value="probability">Highest probability</option></select><button onClick={retry}>Refresh</button></div><p className="hint">{filtered.length} markets · Read-only live probabilities</p>{filtered.length?<><div className="mosaic">{filtered.slice(0,limit).map((m,i)=><div key={m.id} className={i%7===0?'span-2':''}><MarketCard market={m} visual={i%7===0}/></div>)}</div>{filtered.length>limit&&<button className="screen-action primary" onClick={()=>setLimit(x=>x+24)}>Load more markets</button>}</>:<div className="category-discovery"><Icon name={categories.find(c=>c.id===category)?.icon||'explore'}/><h2>{status==='loading'?'Loading category markets…':query?'No search results':status==='error'?'Unable to reach this category’s live feed':'No active markets in this category'}</h2><p>{status==='error'?'Retry the feed or browse another category.':'Browse related markets while new events are published.'}</p><button onClick={retry}>Try again</button><Link to="/explore">Explore all markets →</Link></div>}</main></>}
function PendingPage(){return <main className="page"><h1>Coming next</h1><div className="state-card">This screen is being converted from the approved Google Stitch design. No simulated account balances or trades are shown.</div></main>}
export function App(){const location=useLocation();const reference=location.pathname==='/'||location.pathname.startsWith('/screen/')||location.pathname.startsWith('/market/')||['/explore','/markets'].includes(location.pathname);const design=location.pathname.startsWith('/design/')||reference;return <div className={`mobile-app ${reference?'reference-app':design?'design-app':''}`}>{!design&&<Header/>}<Routes><Route path="/" element={<ReferencePage page="mitmarket_premium_mobile_homepage"/>}/><Route path="/live" element={<Home/>}/><Route path="/explore" element={<ReferencePage page="mitmarket_explore"/>}/><Route path="/markets" element={<Explore/>}/><Route path="/market/:id" element={<MarketDetail/>}/><Route path="/category/:category" element={<CategoryPage/>}/><Route path="/screens" element={<ScreenIndex/>}/><Route path="/screen/:slug" element={<ReferencePage key={location.pathname}/>}/><Route path="/design/:slug" element={<DesignScreen/>}/><Route path="/wallet" element={<ScreenViewRedirect slug="mitmarket_wallet_overview"/>}/><Route path="/portfolio" element={<ScreenViewRedirect slug="mitmarket_portfolio"/>}/><Route path="/profile" element={<ScreenViewRedirect slug="mitmarket_user_profile"/>}/><Route path="/notifications" element={<ScreenViewRedirect slug="mitmarket_notifications_alerts"/>}/><Route path="/search" element={<ScreenViewRedirect slug="mitmarket_global_search"/>}/><Route path="*" element={<PendingPage/>}/></Routes>{!design&&<BottomNav/>}</div>}
function ScreenViewRedirect({slug}:{slug:string}){return <Navigate to={`/screen/${slug}`} replace/>}
