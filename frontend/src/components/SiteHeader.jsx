import {Link,NavLink,useNavigate} from "react-router-dom";
import {Heart,User,PlusCircle,Menu,X} from "lucide-react";
import {useState} from "react";
export default function SiteHeader(){
 const [open,setOpen]=useState(false),nav=useNavigate();
 return <header className="site-header"><div className="site-header-inner">
 <Link to="/" className="site-logo"><span className="logo-mark">PP</span><span><strong>PuneProperty</strong><small>Find your place in Pune</small></span></Link>
 <button className="mobile-nav-toggle" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
 <nav className={open?"site-nav open":"site-nav"}>
 <NavLink to="/buy">Buy</NavLink><NavLink to="/rent">Rent</NavLink><NavLink to="/projects">Projects</NavLink><NavLink to="/localities">Localities</NavLink><NavLink to="/articles">Advice</NavLink>
 <button className="header-post" onClick={()=>nav("/post-property")}><PlusCircle size={17}/> Post Property</button><Link className="header-icon" to="/saved"><Heart size={18}/></Link><Link className="header-login" to="/login"><User size={17}/> Login</Link>
 </nav></div></header>
}