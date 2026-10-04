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

function refineMobileNavigation(){
 const icons={
 shop:'<path d="M3 10h18l-2-6H5l-2 6Z"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 favorites:'<path d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z"/>',
 cart:'<path d="M3 3h2l3 13h11l2-9H6"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/>',
 profile:'<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2"/>'
 };
 let bottom=document.querySelector(".mobile-bottom");
 if(!bottom){bottom=document.createElement("nav");bottom.className="mobile-bottom with-profile";bottom.innerHTML='<a href="/#shop">Shop</a><a href="/suche.html">Suche</a><a href="/favoriten.html">Favoriten</a><a href="/#cart">Warenkorb</a><a href="/profil.html">Profil</a>';document.body.appendChild(bottom)}
 bottom.setAttribute("aria-label","Mobile Hauptnavigation");
 bottom.classList.add("nd-mobile-nav");
 const names=["Shop","Suche","Favoriten","Warenkorb","Profil"],keys=["shop","search","favorites","cart","profile"];
 bottom.querySelectorAll("a,button").forEach((item,i)=>{if(!keys[i])return;item.setAttribute("aria-label",names[i]);item.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[keys[i]]+'</svg><span>'+names[i]+'</span>'});
 document.querySelector(".profile-mobile-link")?.remove();
 document.body.classList.add("has-mobile-navigation");
 markCurrentNavigation();
}
function refineFooter(){
 const main=document.querySelector(".footer-main");if(!main)return;
 const small=matchMedia("(max-width:680px)");
 main.querySelectorAll(":scope > div").forEach(group=>{const title=group.querySelector("h4");if(!title)return;const details=document.createElement("details");details.className="footer-group";const summary=document.createElement("summary");summary.textContent=title.textContent;details.appendChild(summary);title.remove();while(group.firstChild)details.appendChild(group.firstChild);group.replaceWith(details)});
 const sync=()=>main.querySelectorAll(".footer-group").forEach(d=>{d.open=!small.matches});sync();small.addEventListener("change",sync);
}
refineMobileNavigation();refineFooter();

function updateNavigationCounts(){
 const read=key=>{try{const value=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(value)?value:[]}catch{return []}};
 const favorites=new Set(read("nd-vintage-favorites-v2").map(Number).filter(Number.isFinite)).size;
 const cart=read("nd-vintage-cart").reduce((sum,item)=>sum+Math.max(0,Math.floor(Number(item.qty)||0)),0);
 const controls=document.querySelectorAll(".nd-mobile-nav a,.nd-mobile-nav button");
 [["Favoriten",favorites,controls[2]],["Warenkorb",cart,controls[3]]].forEach(([label,count,control])=>{
 if(!control)return;
 let badge=control.querySelector(".nd-nav-count");if(!badge){badge=document.createElement("b");badge.className="nd-nav-count";badge.setAttribute("aria-hidden","true");control.appendChild(badge)}
 badge.textContent=count;badge.hidden=count===0;control.setAttribute("aria-label",label+(count?" ("+count+")":""));
 });
}
updateNavigationCounts();
addEventListener("nd-counts-change",updateNavigationCounts);
addEventListener("storage",updateNavigationCounts);
addEventListener("pageshow",updateNavigationCounts);
document.addEventListener("click",()=>setTimeout(updateNavigationCounts,0));

const ndPopularBrands=["Ralph Lauren","Nike","Adidas","Carhartt","The North Face","Tommy Hilfiger","Lacoste","Levi's"];
const ndOtherBrands=["Armani","Asics","Barbour","Bershka","Burberry","Calvin Klein","Champion","Columbia","Converse","Dickies","Diesel","Ellesse","Fila","Fred Perry","Gant","Guess","H&M","Helly Hansen","Hugo Boss","Jordan","Kappa","Lee","Lonsdale","New Balance","Patagonia","Puma","Reebok","Russell Athletic","Stüssy","Supreme","Timberland","Umbro","Under Armour","Uniqlo","Vans","Wrangler","Zara"];
const ndSizes=["XXS","XS","S","M","L","XL","XXL","XXXL","4XL","5XL","6XL","One Size",...Array.from({length:33},(_,i)=>String(32+i)),...Array.from({length:23},(_,i)=>"W"+(24+i))];
function enhanceBrandFilter(select){
 const wrapper=document.createElement("div");wrapper.className="brand-picker";
 const toggle=document.createElement("button");toggle.type="button";toggle.className="brand-picker-toggle";toggle.setAttribute("aria-label","Marke auswählen");toggle.setAttribute("aria-expanded","false");toggle.textContent="Alle Marken";
 const panel=document.createElement("div");panel.className="brand-picker-panel";panel.hidden=true;
 const search=document.createElement("input");search.type="search";search.placeholder="Marke suchen …";search.setAttribute("aria-label","Marken durchsuchen");search.autocomplete="off";
 const list=document.createElement("div");list.className="brand-picker-list";panel.append(search,list);wrapper.append(toggle,panel);select.after(wrapper);select.hidden=true;
 let internal=false;
 const populate=()=>{
  if(internal)return;internal=true;
  const selected=select.value,existing=[...select.options].filter(o=>o.value).map(o=>({value:o.value,label:o.textContent}));
  const values=new Map(existing.map(o=>[o.label.toLocaleLowerCase("de"),o]));
  [...ndPopularBrands,...ndOtherBrands].forEach(label=>{const key=label.toLocaleLowerCase("de");if(!values.has(key))values.set(key,{value:label,label})});
  const all=[...values.values()];const options=[{value:"",label:"Alle Marken"},...all.sort((a,b)=>a.label.localeCompare(b.label,"de"))];
  const signature=options.map(o=>o.value+"|"+o.label).join(";");
  if([...select.options].map(o=>o.value+"|"+o.textContent).join(";")!==signature){select.replaceChildren(...options.map(o=>new Option(o.label,o.value)));select.value=selected;select.dataset.ndOptions=signature}
  internal=false;render();
 };
 const choose=value=>{select.value=value;select.dispatchEvent(new Event("change",{bubbles:true}));panel.hidden=true;toggle.setAttribute("aria-expanded","false");render();toggle.focus()};
 const render=()=>{
  toggle.textContent=select.selectedOptions[0]?.textContent||"Alle Marken";list.replaceChildren();
  const q=search.value.trim().toLocaleLowerCase("de"),options=[...select.options];
  const add=option=>{const b=document.createElement("button");b.type="button";b.textContent=option.textContent;b.className="brand-choice";b.setAttribute("aria-pressed",String(select.value===option.value));b.onclick=()=>choose(option.value);list.appendChild(b)};
  const visible=options.filter(o=>!q||o.textContent.toLocaleLowerCase("de").includes(q));
  if(!q){add(options[0]);const heading=document.createElement("p");heading.className="brand-group-title";heading.textContent="Beliebte Marken";list.appendChild(heading);ndPopularBrands.forEach(name=>{const option=options.find(o=>o.textContent.toLocaleLowerCase("de")===name.toLocaleLowerCase("de"));if(option)add(option)});const other=document.createElement("p");other.className="brand-group-title";other.textContent="Weitere Marken";list.appendChild(other);visible.filter(o=>o.value&&!ndPopularBrands.some(n=>n.toLocaleLowerCase("de")===o.textContent.toLocaleLowerCase("de"))).forEach(add)}
  else{visible.forEach(add);if(!visible.length){const text=document.createElement("p");text.textContent="Keine Marke gefunden.";list.appendChild(text)}}
 };
 toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute("aria-expanded",String(!panel.hidden));if(!panel.hidden){search.value="";render();search.focus()}};
 search.addEventListener("input",render);
 wrapper.addEventListener("keydown",e=>{if(e.key==="Escape"){panel.hidden=true;toggle.setAttribute("aria-expanded","false");toggle.focus()}});
 document.addEventListener("click",e=>{if(!wrapper.contains(e.target)){panel.hidden=true;toggle.setAttribute("aria-expanded","false")}});
 select.addEventListener("change",render);
 new MutationObserver(()=>populate()).observe(select,{childList:true});
 document.addEventListener("click",()=>setTimeout(render,0));
 populate();
}
document.querySelectorAll("#categoryBrand,#brandFilter").forEach(enhanceBrandFilter);
document.querySelectorAll("#categorySize,#sizeFilter").forEach(select=>{
 const populate=()=>{const selected=select.value;const existing=[...select.options].filter(o=>o.value).map(o=>o.value);const values=[...new Set([...ndSizes,...existing])];const signature=values.join(";");if([...select.options].filter(o=>o.value).map(o=>o.value).join(";")===signature)return;select.dataset.ndSizes=signature;select.replaceChildren(new Option("Alle Größen",""),...values.map(x=>new Option(x,x)));select.value=selected};
 new MutationObserver(populate).observe(select,{childList:true});populate();
});
