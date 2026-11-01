import type {Market} from './marketData';

function topic(m:Market,category:string):string|null{
 const title=`${m.eventTitle||''} ${m.title}`.toLowerCase();
 if(category==='crypto'){
  const assets:[string,RegExp][]=[['bitcoin',/\bbitcoin\b|\bbtc\b|satoshi/],['ethereum',/\bethereum\b|\beth\b/],['solana',/\bsolana\b|\bsol\b/],['xrp',/\bxrp\b|ripple/],['dogecoin',/dogecoin|\bdoge\b/],['sui',/\bsui\b/],['bnb',/\bbnb\b|binance/],['cardano',/cardano|\bada\b/],['avalanche',/avalanche|\bavax\b/],['chainlink',/chainlink|\blink\b/],['ton',/toncoin|\bton\b/]];
  for(const [name,pattern] of assets)if(pattern.test(title))return `asset:${name}`;
  if(/token|fdv|airdrop/.test(title))return 'token-launches';
  if(/clarity|crypto|blockchain|defi|stablecoin/.test(title))return 'regulation-and-ecosystem';
  return null;
 }
 if(category==='tech'){
  for(const [name,pattern] of [['ipos',/\bipo\b/],['ai-models',/ai model|benchmark|agi|frontier model/],['chips',/nvidia|tsmc|chip|semiconductor/],['space',/spacex|starship|space|nasa/],['robotics',/robot|humanoid/],['security',/spy|hack|cyber|breach/],['platforms',/apple|google|meta|microsoft|software|app/],['corporate',/acquire|bankrupt|valuation/]] as const)if(pattern.test(title))return name;
 }
 if(category==='finance'||category==='economy'){
  for(const [name,pattern] of [['ipos',/\bipo\b/],['rates',/\bfed\b|interest rate|rate cut|bank.*decision/],['oil',/crude|\bwti\b|\boil\b/],['gold',/\bgold\b|xauusd/],['bonds',/treasury|bond|yield/],['equities',/largest company|stock|s&p|nasdaq/],['inflation',/inflation|\bcpi\b/],['growth',/recession|\bgdp\b|unemployment/],['corporate',/acquire|bankrupt|valuation|earnings/]] as const)if(pattern.test(title))return name;
 }
 if(category==='mentions'||category==='culture'){
  for(const [name,pattern] of [['trump',/trump/],['musk',/elon|\bmusk\b/],['rogan',/rogan/],['mrbeast',/mrbeast/],['burnham',/burnham/],['sports',/announcer|cowboys|packers|seahawks|broncos/],['podcasts',/podcast|lemonade/],['film',/movie|film|oscar/],['music',/music|grammy|album|song/]] as const)if(pattern.test(title))return name;
 }
 if(category==='elections'||category==='politics'){
  for(const [name,pattern] of [['france',/french|france/],['israel',/israel|netanyahu/],['iran',/iran|hormuz/],['bulgaria',/bulgaria/],['taiwan',/taipei|taiwan/],['us-primary',/nominee|nomination/],['us-presidency',/presidential election|president/],['us-senate',/senate/],['us-house',/house|balance of power|midterms/],['us-governors',/governor/],['musk',/elon|musk/],['economy',/fed|inflation|tariff/]] as const)if(pattern.test(title))return name;
 }
 return (m.eventTitle||m.slug||m.title).toLowerCase().replace(/\d+/g,'').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
}

/** One outcome per event, then balance subjects instead of slicing a flattened feed. */
export function selectHomeMarkets(markets:Market[],category:string,limit:number):Market[]{
 const groups=new Map<string,Market[]>();
 for(const m of markets){if(topic(m,category)===null)continue;const key=m.eventId||m.slug||m.id;const group=groups.get(key)||[];group.push(m);groups.set(key,group);}
 const now=Date.now();
 const freshness=(m:Market)=>{const end=Date.parse(m.endDate);return Number.isFinite(end)&&end<now?-1000:0;};
 const quality=(m:Market)=>freshness(m)+(m.yes>0&&m.yes<100?100:0)-Math.abs(m.yes-50);
 const candidates=[...groups.values()].map((rows,rank)=>({market:rows.reduce((best,m)=>quality(m)>quality(best)?m:best),rank}));
 const selected:Market[]=[];const counts=new Map<string,number>();
 while(candidates.length&&selected.length<limit){
  let best=0;let bestScore=-Infinity;
  for(let i=0;i<candidates.length;i++){const {market,rank}=candidates[i];const key=topic(market,category)!;const score=-(counts.get(key)||0)*10000+(category==='crypto'&&key.startsWith('asset:')?200:0)+freshness(market)-rank;if(score>bestScore){bestScore=score;best=i;}}
  const [{market}]=candidates.splice(best,1);selected.push(market);const key=topic(market,category)!;counts.set(key,(counts.get(key)||0)+1);
 }
 return selected;
}
