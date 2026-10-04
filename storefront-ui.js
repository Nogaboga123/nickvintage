function markCurrentNavigation(){
 const path=location.pathname,hash=location.hash||"#shop";
 document.querySelectorAll('.site-header .nav a,.mobile-menu a,.mobile-bottom a').forEach(a=>{
 const u=new URL(a.href,location.origin);
 const current=path==="/kategorie.html"?u.pathname==="/"&&u.hash==="#categories":path==="/"||path==="/index.html"?u.pathname==="/"&&u.hash===hash:u.pathname===path;
 a.classList.toggle("nav-current",current);if(current)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
 });
}markCurrentNavigation();addEventListener("hashchange",markCurrentNavigation);