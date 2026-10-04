let products=[
{id:1,name:"Nike Tech Tracksuit — Black",cat:"Tracksuits",size:"L",price:119.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",cls:"p1",new:true,status:"available"},
{id:2,name:"Nike Tech Tracksuit — Grey",cat:"Tracksuits",size:"M",price:119.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",cls:"p2",new:true,status:"available"},
{id:3,name:"Nike Tech Tracksuit — Navy",cat:"Tracksuits",size:"L",price:119.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",cls:"p3",new:true,status:"available"},
{id:4,name:"Ralph Lauren Pullover — Navy",cat:"Sweater",size:"M",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",cls:"p4",new:true,status:"available"},
{id:5,name:"Ralph Lauren Pullover — Beige",cat:"Sweater",size:"L",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",cls:"p5",new:true,status:"available"},
{id:6,name:"Ralph Lauren Pullover — Grey",cat:"Sweater",size:"L",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",cls:"p6",new:true,status:"available"},
{id:7,name:"Ralph Lauren Pullover — Black",cat:"Sweater",size:"M",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",cls:"p7",new:true,status:"available"},
{id:8,name:"Nike Tech Hoodie — Black",cat:"Hoodies",size:"L",price:69.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",cls:"p8",new:true,status:"available"},
{id:9,name:"Nike Tech Hoodie — Grey",cat:"Hoodies",size:"M",price:69.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",cls:"p9",new:true,status:"available"},
{id:10,name:"Nike Tech Pants — Black",cat:"Trackpants",size:"M",price:59.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",cls:"p10",new:true,status:"available"}];
let cart=JSON.parse(localStorage.getItem("nd-vintage-cart")||"[]");
let activeFilter="Alle";
let discountCode=localStorage.getItem("nd-vintage-discount")||"";
let favorites=(()=>{try{const v=JSON.parse(localStorage.getItem("nd-vintage-favorites-v2")||"[]");return Array.isArray(v)?[...new Set(v.map(Number).filter(Number.isFinite))]:[]}catch{return []}})();

const imageMap={
1:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_599,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/22860c98-b8c4-4779-99f0-893399c1dc00/M+NK+TCH+FLC+FZ+WR+HOODIE.png",
2:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/cc350337-a9f2-453d-af2d-e007a3d8bc28/M+NK+TCH+FLC+ERGO+FZ.png",
3:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/77f11517-6f39-4664-bbfe-12eb84126955/M+NK+TCH+FLC+FZ+WR+HOODIE.png",
4:"https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&fm=jpg&q=88&w=1000",
5:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&fm=jpg&q=88&w=1000",
6:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&fm=jpg&q=88&w=1000",
7:"https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&fm=jpg&q=88&w=1000",
8:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/22860c98-b8c4-4779-99f0-893399c1dc00/M+NK+TCH+FLC+FZ+WR+HOODIE.png",
9:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/cc350337-a9f2-453d-af2d-e007a3d8bc28/M+NK+TCH+FLC+ERGO+FZ.png",
10:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9b3adca5-2ea6-42f1-9eea-87da2804e175/M+NK+TCH+FLC+ERGO+FZ.png"
};
const imgFor=p=>p.image||imageMap[p.id]||"";
const isFreshDrop=p=>{const t=new Date(p.publishAt||p.createdAt||0).getTime();return Number.isFinite(t)&&t>0&&Date.now()>=t&&Date.now()-t<=24*60*60*1000};
const badgeFor=p=>p.status==="sold"?"SOLD":(isFreshDrop(p)?"NEW DROP":(p.new?"NEW":p.tag));
const imagesFor=p=>{const xs=Array.isArray(p.images)?p.images:(typeof p.images==="string"?p.images.split(/\n|,/):[]);return [...new Set([imgFor(p),...xs].map(x=>String(x||"").trim()).filter(Boolean))]};


const euro=n=>n.toLocaleString("de-DE",{style:"currency",currency:"EUR"});
const save=()=>localStorage.setItem("nd-vintage-cart",JSON.stringify(cart));

function renderProducts(){
 let list=products.filter(p=>!p.hidden&&(activeFilter==="Alle"||p.cat===activeFilter));
 const brand=document.getElementById("brandFilter")?.value||"",size=document.getElementById("sizeFilter")?.value||"",color=document.getElementById("colorFilter")?.value||"",price=document.getElementById("priceFilter")?.value||"",availability=document.getElementById("availabilityFilter")?.value||"";
 if(brand)list=list.filter(p=>(p.tag||p.code||"").toLowerCase().includes(brand.toLowerCase())||(p.name||"").toLowerCase().includes(brand.toLowerCase()));
 if(size)list=list.filter(p=>String(p.size||"").toLowerCase()===size.toLowerCase());
 if(color)list=list.filter(p=>productColor(p)===color);
 if(price){const [min,max]=price.split("-").map(Number);list=list.filter(p=>Number(p.price)>=min&&Number(p.price)<=max)}
 if(availability)list=list.filter(p=>availability==="sold"?p.status==="sold":p.status!=="sold");
 const sort=document.getElementById("sort").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price);
 if(sort==="high")list.sort((a,b)=>b.price-a.price);
 if(sort==="new")list.sort((a,b)=>Number(b.new)-Number(a.new));
 if(!availability)list.sort((a,b)=>(a.status==="sold")-(b.status==="sold"));
 const q=(document.getElementById("searchInput").value||"").toLowerCase().trim();
 if(q){const aliases={rot:"red",blau:"blue navy",navy:"navy blau",grau:"grey gray",grey:"grey grau",schwarz:"black",black:"black schwarz",beige:"beige",weiß:"white",weiss:"white",grün:"green",gruen:"green",gelb:"yellow"};const terms=q.split(/\s+/).filter(Boolean);list=list.filter(p=>{const raw=[p.name,p.cat,p.code,p.tag,p.size,p.condition,p.color,p.colour,p.description].filter(Boolean).join(" ").toLowerCase();const hay=raw+" "+Object.entries(aliases).filter(([de,en])=>raw.includes(de)||en.split(" ").some(x=>raw.includes(x))).flat().join(" ");return terms.every(t=>hay.includes(t)||(aliases[t]||"").split(" ").some(x=>x&&hay.includes(x)))})}
 document.getElementById("productTotal").textContent=list.length+" Pieces";
 document.getElementById("products").innerHTML=list.map(p=>{
  const id=Number(p.id),fav=favorites.includes(id);
  const imgs=imagesFor(p),second=imgs[1]||"";
  return '<article class="product" data-id="'+id+'" style="position:relative"><button type="button" class="fav" data-fav-id="'+id+'" aria-label="Favorit" aria-pressed="'+fav+'">'+(fav?'♥':'♡')+'</button><div class="product-image '+(p.cls||'p1')+' '+(p.status==="sold"?'sold':'')+'">'+(imgs[0]?'<img class="product-primary" loading="lazy" src="'+imgs[0]+'" alt="">'+(second?'<img class="product-secondary" loading="lazy" src="'+second+'" alt="">':''):'<div class="fake-photo">'+p.code+'</div>')+'<span class="badge">'+badgeFor(p)+'</span>'+(p.status!=="sold"?'<button type="button" class="quick-add" data-quick-id="'+id+'">+ QUICK ADD</button>':'')+'</div><div class="product-info"><div class="product-name-row"><h3>'+p.name+'</h3><b>'+euro(p.price)+'</b></div><p>SIZE '+p.size+' · '+p.condition+'</p>'+(p.status!=="sold"&&Number(p.stock??1)===1?'<small class="one-left">ONLY 1 AVAILABLE</small>':'')+'</div></article>';
 }).join("")||'<div class="empty">Keine passenden Pieces gefunden.</div>';
}

function updateFavUI(){
 const n=document.getElementById("favCount");if(n)n.textContent=favorites.length;
 const hn=document.getElementById("headerFavCount");if(hn){hn.textContent=favorites.length;hn.style.display=favorites.length?"grid":"none";}
 const box=document.getElementById("favoriteProducts");if(!box)return;
 const list=products.filter(p=>favorites.includes(Number(p.id)));
 box.innerHTML=list.length?list.map(p=>'<article class="product" data-id="'+Number(p.id)+'"><div class="product-image '+(p.cls||'p1')+'">'+(imgFor(p)?'<img loading="lazy" src="'+imgFor(p)+'" alt="">':'')+'<span class="badge">'+(p.status==="sold"?'SOLD':(p.new?'NEW':p.tag))+'</span></div><div class="product-info"><h3>'+p.name+'</h3><p>'+p.cat+' · '+p.size+' · '+p.condition+'</p><p class="price">'+euro(p.price)+'</p></div></article>').join(""):'<div class="empty">Du hast noch keine Favoriten gespeichert.</div>';
 box.querySelectorAll(".product").forEach(card=>card.addEventListener("click",()=>openProduct(Number(card.dataset.id))));
}
function toggleFav(id){
 id=Number(id);if(!Number.isFinite(id))return;
 favorites=favorites.map(Number).filter(Number.isFinite);
 const adding=!favorites.includes(id);favorites=adding?favorites.concat(id):favorites.filter(x=>x!==id);if(adding)fetch("/api/analytics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({productId:id,type:"favorite"})}).catch(()=>{});
 favorites=[...new Set(favorites)];
 localStorage.setItem("nd-vintage-favorites-v2",JSON.stringify(favorites));
 renderProducts();updateFavUI();
}
window.toggleFav=toggleFav;
function updateCart(){
 cart=cart.filter(i=>products.some(p=>Number(p.id)===Number(i.id)&&p.status!=="sold"));save();
 const count=cart.reduce((s,i)=>s+i.qty,0);
 document.getElementById("cartCount").textContent=count;
 const el=document.getElementById("cartItems");
 const valid=cart.map(i=>({i,p:products.find(x=>Number(x.id)===Number(i.id))})).filter(x=>x.p);
 const total=valid.reduce((s,x)=>s+Number(x.p.price)*x.i.qty,0),goal=100,remaining=Math.max(0,goal-total),pct=Math.min(100,total/goal*100);
 const progressText=document.getElementById("shippingProgressText"),progressBar=document.getElementById("shippingProgressBar");
 if(progressText)progressText.textContent=remaining>0?"Noch "+euro(remaining)+" bis kostenloser Versand":"✓ Kostenloser Versand erreicht";
 if(progressBar)progressBar.style.width=pct+"%";
 const shipNote=document.getElementById("cartShippingNote");if(shipNote)shipNote.textContent=remaining<=0?"Kostenloser Versand für diesen Warenkorb.":"Kostenloser Versand ab 100 €.";
 if(!cart.length){el.innerHTML='<div class="empty"><b>Dein Warenkorb ist leer.</b><br><span>Entdecke deine nächsten Vintage Pieces.</span></div>';document.getElementById("subtotal").textContent=euro(0);return;}
 el.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-item"><div class="cart-thumb ${p.cls}">${imgFor(p)?`<img loading="lazy" src="${imgFor(p)}" alt="">`:`${p.code}`}</div><div><h4>${p.name}</h4><p>${p.size} · ${euro(p.price)}</p><div class="qty"><button onclick="changeQty(${p.id},-1)" aria-label="Menge verringern">−</button><span>${i.qty}</span><button onclick="changeQty(${p.id},1)" aria-label="Menge erhöhen">+</button></div><button class="cart-remove" onclick="removeItem(${p.id})">Artikel entfernen</button></div><b>${euro(p.price*i.qty)}</b></div>`}).join("");
 document.getElementById("subtotal").textContent=euro(total);
}
window.changeQty=(id,d)=>{const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);save();updateCart();renderCheckout();};
window.removeItem=id=>{cart=cart.filter(x=>x.id!==id);save();updateCart();renderCheckout();};
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("open")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
function openProduct(id){
 id=Number(id);const p=products.find(x=>Number(x.id)===id);if(!p)return;
 try{const seen=JSON.parse(localStorage.getItem("nd-vintage-recent")||"[]").map(Number).filter(x=>x!==id);localStorage.setItem("nd-vintage-recent",JSON.stringify([id,...seen].slice(0,6)))}catch{}
 location.href="/produkt.html?id="+encodeURIComponent(id);
 return;
 const seen=JSON.parse(localStorage.getItem("nd-vintage-recent")||"[]").filter(x=>x!==id);localStorage.setItem("nd-vintage-recent",JSON.stringify([id,...seen].slice(0,6)));
 document.getElementById("modalContent").innerHTML=`<div class="product-detail"><div class="detail-photo ${p.cls||"p1"}">${imgFor(p)?`<img src="${imgFor(p)}" alt="${p.name}">`:p.code}</div><div class="detail-copy"><p class="eyebrow">${p.cat} · ${p.tag}</p><h2>${p.name}</h2><div class="detail-price">${euro(p.price)}</div><p>Vintage Einzelstück in ${p.condition.toLowerCase()}em Zustand. Bitte beachte die Produktfotos und Maße vor dem Kauf.</p><div class="size-note"><b>SIZE:</b> ${p.size}<br><br><b>ZUSTAND:</b> ${p.condition}<br><br><b>Artikel:</b> Einzelstück</div>${p.status==="sold"?'<button class="btn btn-light" disabled>AUSVERKAUFT</button>':'<button class="btn btn-dark" onclick="addToCart('+p.id+');closeProduct();openCart()">IN DEN WARENKORB</button>'}</div></div>`;
 document.getElementById("productModal").classList.add("open");
}
function closeProduct(){document.getElementById("productModal").classList.remove("open")}
window.addToCart=id=>{const p=products.find(x=>x.id===id);if(!p||p.status==="sold"){alert("Dieses Piece ist ausverkauft.");return}const i=cart.find(x=>x.id===id);if(i)i.qty++;else cart.push({id,qty:1});save();updateCart()};
function renderCheckout(){
 const items=document.getElementById("checkoutItems");
 cart=cart.filter(i=>products.some(p=>Number(p.id)===Number(i.id)&&p.status!=="sold"));save();
 if(!cart.length){items.innerHTML='<p class="payment-note">Keine Artikel.</p>';document.getElementById("checkoutTotal").textContent=euro(0);return}
 items.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="summary-line"><span>${i.qty}× ${p.name}</span><b>${euro(p.price*i.qty)}</b></div>`}).join("");
 document.getElementById("checkoutTotal").textContent=euro(cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0));
}
function openCheckout(){if(!cart.length){alert("Dein Warenkorb ist leer.");return}renderCheckout();document.getElementById("checkoutModal").classList.add("open");closeCart()}
document.getElementById("products").addEventListener("click",e=>{
 const fav=e.target.closest("[data-fav-id]");
 if(fav){e.preventDefault();e.stopPropagation();toggleFav(Number(fav.dataset.favId));return;}
 const quick=e.target.closest("[data-quick-id]");if(quick){e.preventDefault();e.stopPropagation();addToCart(Number(quick.dataset.quickId));openCart();return;}
 const card=e.target.closest(".product[data-id]");
 if(card)openProduct(Number(card.dataset.id));
});
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderProducts()});
document.getElementById("sort").onchange=renderProducts;
const filterToggle=document.getElementById("filterToggle"),filterPanel=document.getElementById("filterPanel");
if(filterToggle&&filterPanel)filterToggle.onclick=()=>{const open=filterPanel.classList.toggle("open");const span=filterToggle.querySelector("span");if(span)span.textContent=open?"−":"+"};
document.getElementById("searchInput").oninput=()=>{};
const favoritesBtn=document.getElementById("favoritesBtn");
if(favoritesBtn)favoritesBtn.onclick=()=>{updateFavUI();const s=document.getElementById("favoritesSection");if(s){s.style.display="block";s.scrollIntoView({behavior:"smooth"})}};
const closeFavorites=document.getElementById("closeFavorites");
if(closeFavorites)closeFavorites.onclick=()=>{const s=document.getElementById("favoritesSection");if(s)s.style.display="none"};
document.getElementById("statusForm").onsubmit=async e=>{e.preventDefault();const out=document.getElementById("statusResult");out.textContent="Wird geprüft…";try{const r=await fetch("/api/order-status",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:document.getElementById("statusOrder").value,email:document.getElementById("statusEmail").value})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Fehler");out.innerHTML="<b>"+d.id+"</b> · "+d.status+(d.tracking?" · "+(d.carrier||"Tracking")+": "+d.tracking:"")+"<br>"+d.items.map(x=>x.qty+"× "+x.name+" ("+(x.size||"—")+")").join(", ")+(d.trackingUrl?'<br><a href="'+d.trackingUrl+'" target="_blank" rel="noopener" style="display:inline-block;margin-top:10px;font-weight:900;color:#111">SENDUNG VERFOLGEN →</a>':"")}catch(err){out.textContent=err.message}};
document.getElementById("searchBtn").onclick=()=>{const bar=document.getElementById("searchbar");bar.classList.toggle("open");if(bar.classList.contains("open"))setTimeout(()=>document.getElementById("searchInput").focus(),0)};
document.getElementById("closeSearch").onclick=()=>{document.getElementById("searchbar").classList.remove("open");document.getElementById("searchInput").value="";activeFilter="Alle";document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter==="Alle"));renderProducts()};
document.getElementById("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();const q=e.currentTarget.value.trim();if(q)location.href="/suche.html?q="+encodeURIComponent(q)}});

document.getElementById("cartBtn").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.getElementById("closeModal").onclick=closeProduct;document.getElementById("closeCheckout").onclick=()=>document.getElementById("checkoutModal").classList.remove("open");
document.getElementById("checkoutBtn").onclick=openCheckout;
const discountInput=document.getElementById("discountCode"),discountMsg=document.getElementById("discountMsg");if(discountInput)discountInput.value=discountCode;document.getElementById("applyDiscount")?.addEventListener("click",()=>{discountCode=(discountInput?.value||"").trim().toUpperCase();if(!discountCode){localStorage.removeItem("nd-vintage-discount");if(discountMsg)discountMsg.textContent="Bitte einen Rabattcode eingeben.";return}localStorage.setItem("nd-vintage-discount",discountCode);if(discountMsg)discountMsg.textContent="Code übernommen – der Rabatt wird beim Checkout geprüft ✓";});
document.querySelectorAll("[data-cat]").forEach(a=>a.onclick=()=>{activeFilter=a.dataset.cat;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));renderProducts()});
document.getElementById("earlyForm").onsubmit=async e=>{e.preventDefault();const out=document.getElementById("earlyMsg"),email=document.getElementById("email").value.trim();out.textContent="Wird eingetragen…";try{const r=await fetch("/api/drop-alert",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Fehler");out.textContent="✓ Du bist beim Drop-Alert dabei.";e.target.reset()}catch(err){out.textContent=err.message}};
document.getElementById("checkoutForm").onsubmit=async e=>{
 e.preventDefault();
 const btn=e.target.querySelector("button"); btn.disabled=true; btn.textContent="CHECKOUT WIRD GELADEN…";
 try{
  const r=await fetch("/api/create-checkout-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart,customerEmail:e.target.querySelector("input[type=email]").value.trim(),discountCode,shippingCountry:document.getElementById("shippingCountry")?.value||"DE"})});
  const data=await r.json();
  if(!r.ok) throw new Error(data.error||"Checkout-Fehler");
  if(data.url){location.href=data.url;return;}
  throw new Error("Keine Checkout-URL erhalten.");
 }catch(err){
  alert(err.message+"\n\nFür die lokale Demo kannst du die Stripe-Konfiguration aus .env.example einrichten.");
 }finally{btn.disabled=false;btn.textContent="BESTELLUNG PRÜFEN";}
};
/* Hamburger menu is handled by the dedicated mobile dropdown in index.html. */

/* Drop countdown is loaded from /api/public-settings in index.html. */
function smallProductCard(p){return '<article class="product" data-rec-id="'+Number(p.id)+'"><div class="product-image '+(p.cls||'p1')+' '+(p.status==="sold"?'sold':'')+'">'+(imgFor(p)?'<img loading="lazy" src="'+imgFor(p)+'" alt="">':'<div class="fake-photo">'+(p.code||"NV")+'</div>')+'<span class="badge">'+badgeFor(p)+'</span></div><div class="product-info"><h3>'+p.name+'</h3><p>'+p.cat+' · '+p.size+' · '+p.condition+'</p><p class="price">'+euro(p.price)+'</p></div></article>'}
function renderRecommendations(){const newest=[...products].sort((a,b)=>Number(b.id)-Number(a.id)).slice(0,4),newBox=document.getElementById("newProducts");if(newBox)newBox.innerHTML=newest.map(smallProductCard).join("");let recent=[];try{recent=JSON.parse(localStorage.getItem("nd-vintage-recent")||"[]").map(Number)}catch{}const seen=recent.map(id=>products.find(p=>Number(p.id)===id)).filter(Boolean).slice(0,4),section=document.getElementById("recentSection"),box=document.getElementById("recentProducts");if(section&&box){section.style.display=seen.length?"block":"none";box.innerHTML=seen.map(smallProductCard).join("")}document.querySelectorAll("[data-rec-id]").forEach(x=>x.onclick=()=>openProduct(Number(x.dataset.recId)))}
function productColor(p){const s=[p.color,p.colour,p.name].filter(Boolean).join(" ").toLowerCase();for(const [needle,label] of [["black","Schwarz"],["schwarz","Schwarz"],["grey","Grau"],["gray","Grau"],["grau","Grau"],["navy","Blau"],["blue","Blau"],["blau","Blau"],["beige","Beige"],["red","Rot"],["rot","Rot"],["white","Weiß"],["weiß","Weiß"],["green","Grün"],["grün","Grün"]])if(s.includes(needle))return label;return ""}
function fillAdvancedFilters(){const brand=document.getElementById("brandFilter"),size=document.getElementById("sizeFilter"),color=document.getElementById("colorFilter");if(!brand)return;const brands=[...new Set(products.map(p=>p.tag||p.code).filter(Boolean))].sort(),sizes=[...new Set(products.map(p=>p.size).filter(Boolean))].sort(),colors=[...new Set(products.map(productColor).filter(Boolean))].sort();brand.innerHTML='<option value="">Alle Marken</option>'+brands.map(x=>'<option>'+x+'</option>').join("");size.innerHTML='<option value="">Alle Größen</option>'+sizes.map(x=>'<option>'+x+'</option>').join("");color.innerHTML='<option value="">Alle Farben</option>'+colors.map(x=>'<option>'+x+'</option>').join("");}
["brandFilter","sizeFilter","colorFilter","priceFilter","availabilityFilter"].forEach(id=>document.getElementById(id)?.addEventListener("change",renderProducts));
document.getElementById("resetFilters")?.addEventListener("click",()=>{["brandFilter","sizeFilter","colorFilter","priceFilter","availabilityFilter"].forEach(id=>document.getElementById(id).value="");activeFilter="Alle";document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter==="Alle"));renderProducts()});
fillAdvancedFilters();renderProducts();renderRecommendations();updateCart();updateFavUI();
(async()=>{try{const r=await fetch("/api/products");if(r.ok){products=await r.json();fillAdvancedFilters();renderProducts();renderRecommendations();updateCart();updateFavUI();}}catch(e){console.error(e)}})();
