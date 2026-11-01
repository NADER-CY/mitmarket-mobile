import {Link} from 'react-router-dom';
import {categories,homeLimits} from './categories';
import type {Market} from './marketData';
import {MiniHistory} from './HeroSlider';

const patterns:Record<string,RegExp>={
  politics:/politic|congress|senate|presiden|trump|republican|democrat|government|parliament|legislation|election/i,
  sports:/sports|football|soccer|nba|nfl|nhl|mlb|tennis|basketball|champion|premier league|fifa|uefa|cricket|ufc/i,
  crypto:/crypto|bitcoin|btc|ethereum|eth|solana|sol|xrp|token|doge|defi|blockchain|tether/i,
  esports:/esports|dota|counter.strike|cs2|league of legends|valorant|gaming|team spirit/i,
  iran:/iran|tehran|iranian|persia/i,
  finance:/finance|stock|nasdaq|s&p|equities|apple stock|earnings|bank|fed|interest rate|market cap/i,
  geopolitics:/geopolitic|war|ukraine|russia|china|taiwan|israel|gaza|nato|ceasefire|diploma|conflict/i,
  tech:/technology|tech|ai |artificial intelligence|openai|google|meta|microsoft|nvidia|tesla|spacex/i,
  elections:/election|vote|ballot|governor|president|senate|mayor|polling/i,
  culture:/culture|film|movie|music|award|oscar|grammy|celebrity|entertainment/i,
  economy:/econom|inflation|gdp|recession|unemployment|cpi|jobs report|tariff/i,
  weather:/weather|hurricane|temperature|storm|rain|climate|snow|earthquake/i,
  mentions:/mention|said|tweet|speech|word|podcast|interview/i,
  art:/\bart\b|artist|auction|painting|museum|gallery|design|artwork/i,
};
const blurbs:Record<string,[string,string,string]>={
  crypto:['THE DIGITAL FRONTIER','Crypto never sleeps. Neither does the market.','currency_bitcoin'],
  sports:['EVERY GAME HAS A STORY','From the opening whistle to the final score.','sports_soccer'],
  politics:['THE WORLD IS WATCHING','Follow the questions shaping the next headlines.','account_balance'],
  elections:['THE ROAD TO THE BALLOT','Track what the market thinks, one race at a time.','how_to_vote'],
  finance:['THE BIG MONEY MOVES','Earnings, rates and the next market catalyst.','monitoring'],
  economy:['READ BETWEEN THE NUMBERS','Growth, inflation and the global outlook.','query_stats'],
  geopolitics:['BEYOND THE HEADLINES','See how global events reshape expectations.','public'],
  tech:['TOMORROW, PRICED TODAY','AI, innovation and the race for what comes next.','memory'],
  culture:['THE CULTURE PULSE','The stories, stars and moments everyone follows.','theater_comedy'],
  weather:['WHEN THE FORECAST MATTERS','Watch the probabilities around major weather events.','partly_cloudy_day'],
  esports:['THE NEXT LEVEL','Champions are made one match at a time.','sports_esports'],
  iran:['IRAN IN FOCUS','The key questions and changing expectations.','flag'],
  mentions:['WORDS THAT MOVE MARKETS','What gets said next can change everything.','alternate_email'],
  art:['CREATIVITY IN THE SPOTLIGHT','Explore the markets around art and culture.','palette'],
};
const layoutKinds=['hero-split','micro-grid','stacked','wide-row','mosaic-mini','spotlight'] as const;

export function matchingMarkets(markets:Market[],id:string){const matcher=patterns[id];if(!matcher)return [];
  return markets.filter(m=>matcher.test(`${m.category} ${m.title}`));
}
function Thumb({market}:{market:Market}){return market.image?<img src={market.image} alt="" loading="lazy"/>:<span className="material-symbols-outlined">trending_up</span>}
function Card({market,variant='compact',chart=false}:{market:Market;variant?:string;chart?:boolean}){return <Link to={`/market/${encodeURIComponent(market.id)}`} className={`showcase-card ${variant}`}><div className="showcase-top"><Thumb market={market}/><span>{market.category}</span>{variant==='lead'&&<div className="showcase-donut" style={{background:`conic-gradient(#0bba74 0 ${market.yes}%,#ff4761 ${market.yes}% 100%)`}}><span>{market.yes}%</span></div>}</div><h3>{market.title}</h3>{chart&&<MiniHistory token={market.token}/>}<div className="showcase-market"><div className="showcase-numbers"><span>YES <b>{market.yes}%</b></span><span>NO <b>{market.no}%</b></span></div><div className="showcase-meter"><i style={{width:`${market.yes}%`}}/></div><div className="showcase-prices"><span>Volume ${market.volume>=1e6?(market.volume/1e6).toFixed(1)+'M':(market.volume/1e3).toFixed(1)+'K'}</span><div><b>YES {market.yes}¢</b><b>NO {market.no}¢</b></div></div></div></Link>}

export function FeatureBanner({variant=0}:{variant?:number}){
  const banners=[
    {eyebrow:'MITMARKET INSIGHT',title:'Every opinion is a question. Every market tells a story.',desc:'Explore real-time probabilities across the events that matter.',icon:'query_stats',link:'/explore',cta:'Explore Markets'},
    {eyebrow:'FOLLOW THE SIGNAL',title:'Big events. Small shifts. A whole new perspective.',desc:'Stay close to the movements that shape the headlines.',icon:'travel_explore',link:'/category/trending',cta:'See What’s Trending'},
    {eyebrow:'MAKE IT YOURS',title:'Build your own market watchlist.',desc:'Keep the events you follow in one place.',icon:'bookmark_added',link:'/screen/mitmarket_watchlist',cta:'My Watchlist'},
  ];const b=banners[variant%banners.length];return <aside className={`feature-banner feature-${variant%3}`}><div className="banner-orbit orbit-one"/><div className="banner-orbit orbit-two"/><div className="feature-banner-content"><div className="feature-eyebrow"><span className="material-symbols-outlined">{b.icon}</span>{b.eyebrow}</div><h2>{b.title}</h2><p>{b.desc}</p><Link to={b.link}>{b.cta} <span className="material-symbols-outlined">arrow_forward</span></Link></div><span className="feature-watermark material-symbols-outlined">{b.icon}</span></aside>
}

export function CategoryShowcases({markets}:{markets:Market[]}){
  const sections=categories.filter(c=>Object.prototype.hasOwnProperty.call(homeLimits,c.id));
  return <div className="showcase-sections">{sections.map((c,index)=>{
    const matches=matchingMarkets(markets,c.id).slice(0,Math.min(homeLimits[c.id],5));
    const kind=layoutKinds[index%layoutKinds.length];const [headline,tagline,icon]=blurbs[c.id]||[c.name,'Explore the latest market probabilities.','explore'];
    const hasBanner=false;
    return <div key={c.id}>
      {index===7&&<FeatureBanner variant={1}/>}
      <section className={`showcase-section showcase-${kind}`} aria-label={`${c.name} markets`}>
        {hasBanner&&<Link to={`/category/${c.id}`} className={`category-feature category-feature-${index%4}`}><span className="category-feature-icon material-symbols-outlined">{icon}</span><span className="category-feature-copy"><small>DISCOVER / {c.name.toUpperCase()}</small><strong>{headline}</strong><em>{tagline}</em></span><span className="material-symbols-outlined category-feature-arrow">north_east</span></Link>}
        <header className="showcase-heading"><h2><span className="material-symbols-outlined">{c.icon}</span>{c.name}</h2><Link to={`/category/${c.id}`}>View All <span className="material-symbols-outlined">arrow_forward</span></Link></header>
        {matches.length?<div className={`showcase-layout layout-${kind} ${matches.length%2===1?'has-odd':''} ${matches.length===1?'single-market':''}`}>{matches.map((m,i)=><Card key={m.id} market={m} variant={(i===0&&['hero-split','spotlight','wide-row'].includes(kind))||matches.length===1?'lead':'compact'} chart={i===0&&[1,4,7,10].includes(index)}/>)}</div>:<Link className="showcase-empty" to={`/category/${c.id}`}><span className="material-symbols-outlined">explore</span><span>No live {c.name} markets in this feed</span><span className="material-symbols-outlined">arrow_forward</span></Link>}
      </section>
    </div>;
  })}<div className="end-cap"><span className="material-symbols-outlined">public</span><p>THE WORLD NEVER STOPS MOVING</p><h2>Stay curious.<br/>Stay ahead.</h2><span>New markets, new questions, every day.</span><Link to="/explore">Discover More <span className="material-symbols-outlined">arrow_forward</span></Link><div className="end-cap-footer"><b>MITMARKET</b><span>Explore · Learn · Follow</span></div></div></div>;
}
