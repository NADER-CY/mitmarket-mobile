// Category names and limits mirror the desktop's current category configuration.
// The eventual 16-category selection remains controlled by the shared configuration.
export const categories = [
  {id:'trending',name:'Trending',icon:'local_fire_department'},
  {id:'combos',name:'Combos',icon:'join_inner'},
  {id:'perps',name:'Perps',icon:'candlestick_chart'},
  {id:'breaking',name:'Breaking',icon:'bolt'},
  {id:'new',name:'New',icon:'auto_awesome'},
  {id:'politics',name:'Politics',icon:'how_to_vote'},
  {id:'sports',name:'Sports',icon:'sports_soccer'},
  {id:'crypto',name:'Crypto',icon:'currency_bitcoin'},
  {id:'esports',name:'Esports',icon:'sports_esports'},
  {id:'iran',name:'Iran',icon:'public'},
  {id:'finance',name:'Finance',icon:'account_balance'},
  {id:'geopolitics',name:'Geopolitics',icon:'flag'},
  {id:'tech',name:'Tech',icon:'memory'},
  {id:'elections',name:'Elections',icon:'ballot'},
  {id:'culture',name:'Culture',icon:'theater_comedy'},
  {id:'economy',name:'Economy',icon:'monitoring'},
  {id:'weather',name:'Weather',icon:'cloud'},
  {id:'mentions',name:'Mentions',icon:'alternate_email'},
  {id:'art',name:'Art',icon:'palette'},
  {id:'activity',name:'Activity',icon:'dynamic_feed'},
  {id:'leaderboard',name:'Leaderboard',icon:'emoji_events'},
  {id:'dashboard',name:'Dashboard',icon:'space_dashboard'},
  {id:'rewards',name:'Rewards',icon:'redeem'}
] as const;
export const homeLimits:Record<string,number>={crypto:6,sports:7,politics:8,elections:4,finance:5,economy:4,geopolitics:6,tech:5,culture:4,weather:4,esports:6,iran:6,mentions:6,art:6};
