function markCurrentNavigation(){
 const path=location.pathname,hash=location.hash||"#shop";
 document.querySelectorAll('.site-header .nav a,.mobile-menu a,.mobile-bottom a').forEach(a=>{
 const u=new URL(a.href,location.origin);
 const current=path==="/kategorie.html"?u.pathname==="/"&&u.hash==="#categories":path==="/"||path==="/index.html"?u.pathname==="/"&&u.hash===hash:u.pathname===path;
 a.classList.toggle("nav-current",current);if(current)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
 });
}
function addProfileNavigation(){
 const add=(container,text,className="")=>{if(!container||container.querySelector('a[href="/profil.html"]'))return;const a=document.createElement("a");a.href="/profil.html";a.textContent=text;a.className=className;container.appendChild(a)};
 const actions=document.querySelector(".site-header .header-actions");
 if(actions&&!actions.querySelector('a[href="/profil.html"]')){const a=document.createElement("a");a.href="/profil.html";a.className="icon-btn profile-icon";a.setAttribute("aria-label","Mein Profil");a.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2"/></svg>';actions.prepend(a)}
 else if(!actions)add(document.querySelector(".site-header .nav"),"Mein Profil");
 add(document.querySelector(".mobile-menu"),"Mein Profil");
 const bottom=document.querySelector(".mobile-bottom");add(bottom,"PROFIL");if(bottom)bottom.classList.add("with-profile");
 if(!bottom){const link=document.createElement("a");link.href="/profil.html";link.className="profile-mobile-link";link.textContent="Mein Profil";document.querySelector(".site-header")?.appendChild(link)}
}addProfileNavigation();markCurrentNavigation();addEventListener("hashchange",markCurrentNavigation);
// Keep category choices inside the mobile filter drawer.
const sourceFilters=document.getElementById("filters"),drawer=document.getElementById("filterPanel");
if(sourceFilters&&drawer){const mobile=document.createElement("div");mobile.className="mobile-filter-categories";mobile.setAttribute("aria-label","Kategorien filtern");sourceFilters.querySelectorAll("button").forEach(button=>{const copy=button.cloneNode(true);copy.addEventListener("click",()=>{button.click();mobile.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.filter===button.dataset.filter))});mobile.appendChild(copy)});drawer.prepend(mobile);document.getElementById("resetFilters")?.addEventListener("click",()=>mobile.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.filter==="Alle")))}
