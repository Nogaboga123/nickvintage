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
let favorites=JSON.parse(localStorage.getItem("nd-vintage-favorites")||"[]");

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


const euro=n=>n.toLocaleString("de-DE",{style:"currency",currency:"EUR"});
const save=()=>localStorage.setItem("nd-vintage-cart",JSON.stringify(cart));

function renderProducts(){
 let list=products.filter(p=>activeFilter==="Alle"||p.cat===activeFilter);
 const sort=document.getElementById("sort").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price);
 if(sort==="high")list.sort((a,b)=>b.price-a.price);
 if(sort==="new")list.sort((a,b)=>Number(b.new)-Number(a.new));
 const q=(document.getElementById("searchInput").value||"").toLowerCase().trim();
 if(q)list=list.filter(p=>(p.name+" "+p.cat+" "+p.code+" "+p.size).toLowerCase().includes(q));
 document.getElementById("productTotal").textContent=list.length+" Pieces";
 document.getElementById("products").innerHTML=list.map(p=>`
 <article class="product" data-id="${p.id}" style="position:relative"><button class="fav" onclick="event.stopPropagation();toggleFav(${p.id})" aria-label="Favorit" style="position:absolute;right:12px;top:12px;z-index:3;border:0;background:white;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:18px">${favorites.includes(p.id)?"♥":"♡"}</button>
  <div class="product-image ${p.cls||"p1"} ${p.status==="sold"?"sold":""}">${imgFor(p)?`<img loading="lazy" src="${imgFor(p)}" alt="${p.name}">`:`<div class="fake-photo">${p.code}</div>`}<span class="badge">${p.status==="sold"?"SOLD":(p.new?"NEW":p.tag)}</span></div>
  <div class="product-info"><h3>${p.name}</h3><p>${p.cat} · ${p.size} · ${p.condition}</p><p class="price">${euro(p.price)}</p></div>
 </article>`).join("")||'<div class="empty">Keine passenden Pieces gefunden.</div>';
 document.querySelectorAll(".product").forEach(x=>x.onclick=e=>{if(e.target.closest(".fav"))return;openProduct(+x.dataset.id)});
}
window.toggleFav=id=>{id=Number(id);favorites=favorites.map(Number);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];localStorage.setItem("nd-vintage-favorites",JSON.stringify(favorites));renderProducts();};
function updateCart(){
 const count=cart.reduce((s,i)=>s+i.qty,0);
 document.getElementById("cartCount").textContent=count;
 const el=document.getElementById("cartItems");
 if(!cart.length){el.innerHTML='<div class="empty">Dein Warenkorb ist leer.</div>';document.getElementById("subtotal").textContent=euro(0);return;}
 el.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-item"><div class="cart-thumb ${p.cls}">${imgFor(p)?`<img loading="lazy" src="${imgFor(p)}" alt="">`:`${p.code}`}</div><div><h4>${p.name}</h4><p>${p.size} · ${euro(p.price)}</p><div class="qty"><button onclick="changeQty(${p.id},-1)" aria-label="Menge verringern">−</button><span>${i.qty}</span><button onclick="changeQty(${p.id},1)" aria-label="Menge erhöhen">+</button></div><button class="cart-remove" onclick="removeItem(${p.id})">Artikel entfernen</button></div><b>${euro(p.price*i.qty)}</b></div>`}).join("");
 const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
 document.getElementById("subtotal").textContent=euro(total);
}
window.changeQty=(id,d)=>{const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);save();updateCart();renderCheckout();};
window.removeItem=id=>{cart=cart.filter(x=>x.id!==id);save();updateCart();renderCheckout();};
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("open")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
function openProduct(id){
 const p=products.find(x=>x.id===id);
 document.getElementById("modalContent").innerHTML=`<div class="product-detail"><div class="detail-photo ${p.cls||"p1"}">${imgFor(p)?`<img src="${imgFor(p)}" alt="${p.name}">`:p.code}</div><div class="detail-copy"><p class="eyebrow">${p.cat} · ${p.tag}</p><h2>${p.name}</h2><div class="detail-price">${euro(p.price)}</div><p>Vintage Einzelstück in ${p.condition.toLowerCase()}em Zustand. Bitte beachte die Produktfotos und Maße vor dem Kauf.</p><div class="size-note"><b>SIZE:</b> ${p.size}<br><br><b>ZUSTAND:</b> ${p.condition}<br><br><b>Artikel:</b> Einzelstück</div>${p.status==="sold"?'<button class="btn btn-light" disabled>AUSVERKAUFT</button>':'<button class="btn btn-dark" onclick="addToCart('+p.id+');closeProduct();openCart()">IN DEN WARENKORB</button>'}</div></div>`;
 document.getElementById("productModal").classList.add("open");
}
function closeProduct(){document.getElementById("productModal").classList.remove("open")}
window.addToCart=id=>{const p=products.find(x=>x.id===id);if(!p||p.status==="sold"){alert("Dieses Piece ist ausverkauft.");return}const i=cart.find(x=>x.id===id);if(i)i.qty++;else cart.push({id,qty:1});save();updateCart()};
function renderCheckout(){
 const items=document.getElementById("checkoutItems");
 if(!cart.length){items.innerHTML='<p class="payment-note">Keine Artikel.</p>';document.getElementById("checkoutTotal").textContent=euro(0);return}
 items.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="summary-line"><span>${i.qty}× ${p.name}</span><b>${euro(p.price*i.qty)}</b></div>`}).join("");
 document.getElementById("checkoutTotal").textContent=euro(cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0));
}
function openCheckout(){if(!cart.length){alert("Dein Warenkorb ist leer.");return}renderCheckout();document.getElementById("checkoutModal").classList.add("open");closeCart()}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderProducts()});
document.getElementById("sort").onchange=renderProducts;
document.getElementById("searchInput").oninput=renderProducts;
document.getElementById("searchBtn").onclick=()=>document.getElementById("searchbar").classList.add("open");
document.getElementById("closeSearch").onclick=()=>document.getElementById("searchbar").classList.remove("open");
document.getElementById("cartBtn").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.getElementById("closeModal").onclick=closeProduct;document.getElementById("closeCheckout").onclick=()=>document.getElementById("checkoutModal").classList.remove("open");
document.getElementById("checkoutBtn").onclick=openCheckout;
document.querySelectorAll(".category-grid a").forEach(a=>a.onclick=()=>{activeFilter=a.dataset.cat;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter))});
document.getElementById("earlyForm").onsubmit=e=>{e.preventDefault();document.getElementById("earlyMsg").textContent="Danke — deine E-Mail wurde für den Demo-Early-Access vorgemerkt.";e.target.reset()};
document.getElementById("checkoutForm").onsubmit=async e=>{
 e.preventDefault();
 const btn=e.target.querySelector("button"); btn.disabled=true; btn.textContent="CHECKOUT WIRD GELADEN…";
 try{
  const r=await fetch("/api/create-checkout-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart,customerEmail:e.target.querySelector("input[type=email]").value.trim()})});
  const data=await r.json();
  if(!r.ok) throw new Error(data.error||"Checkout-Fehler");
  if(data.url){location.href=data.url;return;}
  throw new Error("Keine Checkout-URL erhalten.");
 }catch(err){
  alert(err.message+"\n\nFür die lokale Demo kannst du die Stripe-Konfiguration aus .env.example einrichten.");
 }finally{btn.disabled=false;btn.textContent="BESTELLUNG PRÜFEN";}
};
document.getElementById("menuBtn").onclick=()=>document.querySelector(".nav").classList.toggle("mobile-open");

let end=Date.now()+1000*60*60*48+1000*60*17;
function tick(){let d=Math.max(0,end-Date.now()),h=Math.floor(d/36e5),m=Math.floor(d%36e5/6e4),s=Math.floor(d%6e4/1e3);const t=`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;document.getElementById("countdown").textContent=t;document.getElementById("topCountdown").textContent=t}setInterval(tick,1000);tick();
(async()=>{try{const r=await fetch("/api/products");if(r.ok){products=await r.json();renderProducts();updateCart();}}catch(e){console.error(e)}})();
