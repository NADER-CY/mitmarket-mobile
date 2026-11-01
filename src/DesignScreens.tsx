import {Link,useNavigate,useParams} from 'react-router-dom';
import {screenCatalog} from './screenCatalog';

/** Stitch's delivered HTML is preserved as the visual reference per screen.
 * Functional React pages remain separately reachable under /screen/:slug.
 * The design-frame itself does not execute authenticated MITMARKET actions. */
export function DesignScreen(){
  const {slug=''}=useParams();const navigate=useNavigate();
  const index=screenCatalog.findIndex(x=>x[0]===slug);
  if(index<0)return <main className="page"><h1>Design not found</h1><Link to="/screens">Back to all screens</Link></main>;
  const item=screenCatalog[index];
  const isImage=item[2]==='reference'&&!['mitmarket_error_loading_empty_states','mitmarket_design_system_component_library','mitmarket_mobile_navigation_user_flows'].includes(slug);
  const go=(delta:number)=>navigate(`/design/${screenCatalog[(index+delta+screenCatalog.length)%screenCatalog.length][0]}`);
  return <main className="design-view"><div className="design-toolbar"><Link to="/screens" aria-label="All screens"><span className="material-symbols-outlined">grid_view</span></Link><div className="design-toolbar-title"><strong>{item[1]}</strong><small>{index+1} / {screenCatalog.length} · Stitch design · Sample data</small></div><button aria-label="Previous screen" onClick={()=>go(-1)}><span className="material-symbols-outlined">chevron_left</span></button><button aria-label="Next screen" onClick={()=>go(1)}><span className="material-symbols-outlined">chevron_right</span></button><Link to={`/screen/${slug}`} aria-label="React implementation"><span className="material-symbols-outlined">code</span></Link></div>
    <div className="design-stage" key={slug}>{isImage?<img src={`/design/${slug}.png`} alt={`${item[1]} design reference`}/>:<iframe title={`${item[1]} Google Stitch design`} src={`/design/${slug}.html`} sandbox="allow-scripts" referrerPolicy="no-referrer"/>}</div>
  </main>;
}
