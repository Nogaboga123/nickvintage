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
 add(document.querySelector(".site-header .nav"),"Mein Profil");
 add(document.querySelector(".mobile-menu"),"Mein Profil");
 const bottom=document.querySelector(".mobile-bottom");add(bottom,"PROFIL");if(bottom)bottom.classList.add("with-profile");
 if(!bottom){const link=document.createElement("a");link.href="/profil.html";link.className="profile-mobile-link";link.textContent="Mein Profil";document.querySelector(".site-header")?.appendChild(link)}
}addProfileNavigation();markCurrentNavigation();addEventListener("hashchange",markCurrentNavigation);