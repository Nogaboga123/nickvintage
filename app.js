let products=JSON.parse(localStorage.getItem("nickvintage-products")||"null")||[
{id:1,name:"Nike Trackjacket 90s",cat:"Jacken",size:"L",price:89.99,condition:"Sehr gut",tag:"RARE",code:"NIKE",cls:"p1",new:true,status:"available",description:"Vintage Einzelstück."},
{id:2,name:"Adidas Trackpants Classic",cat:"Trackpants",size:"M",price:69.99,condition:"Sehr gut",tag:"ONE OF ONE",code:"ADIDAS",cls:"p2",new:true,status:"available",description:"Vintage Einzelstück."},
{id:3,name:"Lacoste Vintage Sweater",cat:"Sweater",size:"L",price:79.99,condition:"Gut",tag:"VINTAGE",code:"LACOSTE",cls:"p3",new:true,status:"available"},
{id:4,name:"Nike Tracksuit 2000s",cat:"Tracksuits",size:"M",price:149.99,condition:"Sehr gut",tag:"RARE",code:"NIKE",cls:"p4",new:true,status:"available"},
{id:5,name:"Ralph Lauren Denim Jacket",cat:"Jacken",size:"L",price:94.99,condition:"Sehr gut",tag:"CURATED",code:"RL",cls:"p5",new:false,status:"available"},
{id:6,name:"Adidas Zip Hoodie",cat:"Hoodies",size:"XL",price:74.99,condition:"Gut",tag:"VINTAGE",code:"ADIDAS",cls:"p6",new:false,status:"available"},
{id:7,name:"Levi's 501 Faded Denim",cat:"Jeans",size:"W32/L32",price:84.99,condition:"Sehr gut",tag:"90s",code:"501",cls:"p7",new:false,status:"available"},
{id:8,name:"Nike Spellout Longsleeve",cat:"Shirts",size:"M",price:59.99,condition:"Sehr gut",tag:"RARE",code:"NIKE",cls:"p8",new:false,status:"available"}];
let cart=JSON.parse(localStorage.getItem("nickvintage-cart")||"[]");
let activeFilter="Alle";

const euro=n=>n.toLocaleString("de-DE",{style:"currency",currency:"EUR"});
const save=()=>localStorage.setItem("nickvintage-cart",JSON.stringify(cart));

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
 <article class="product" data-id="${p.id}">
  <div class="product-image ${p.cls||"p1"} ${p.status==="sold"?"sold":""}">${p.image?`<img src="${p.image}" style="width:100%;height:100%;object-fit:cover">`:`<div class="fake-photo">${p.image?`<img src="${p.image}" style="width:100%;height:100%;object-fit:cover">`:p.code}</div>`}<span class="badge">${p.status==="sold"?"SOLD":(p.new?"NEW":p.tag)}</span></div>
  <div class="product-info"><h3>${p.name}</h3><p>${p.cat} · ${p.size} · ${p.condition}</p><p class="price">${euro(p.price)}</p></div>
 </article>`).join("")||'<div class="empty">Keine passenden Pieces gefunden.</div>';
 document.querySelectorAll(".product").forEach(x=>x.onclick=()=>openProduct(+x.dataset.id));
}
function updateCart(){
 const count=cart.reduce((s,i)=>s+i.qty,0);
 document.getElementById("cartCount").textContent=count;
 const el=document.getElementById("cartItems");
 if(!cart.length){el.innerHTML='<div class="empty">Dein Warenkorb ist leer.</div>';document.getElementById("subtotal").textContent=euro(0);return;}
 el.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-item"><div class="cart-thumb ${p.cls}">${p.code}</div><div><h4>${p.name}</h4><p>${p.size} · ${euro(p.price)}</p><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${p.id},1)">+</button><button class="remove" onclick="removeItem(${p.id})">Entfernen</button></div></div><b>${euro(p.price*i.qty)}</b></div>`}).join("");
 const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
 document.getElementById("subtotal").textContent=euro(total);
}
window.changeQty=(id,d)=>{const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);save();updateCart();renderCheckout();};
window.removeItem=id=>{cart=cart.filter(x=>x.id!==id);save();updateCart();renderCheckout();};
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("open")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
function openProduct(id){
 const p=products.find(x=>x.id===id);
 document.getElementById("modalContent").innerHTML=`<div class="product-detail"><div class="detail-photo ${p.cls||"p1"}">${p.image?`<img src="${p.image}" style="width:100%;height:100%;object-fit:cover">`:p.code}</div><div class="detail-copy"><p class="eyebrow">${p.cat} · ${p.tag}</p><h2>${p.name}</h2><div class="detail-price">${euro(p.price)}</div><p>Vintage Einzelstück in ${p.condition.toLowerCase()}em Zustand. Bitte beachte die Produktfotos und Maße vor dem Kauf.</p><div class="size-note"><b>SIZE:</b> ${p.size}<br><br><b>ZUSTAND:</b> ${p.condition}<br><br><b>Artikel:</b> Einzelstück</div>${p.status==="sold"?'<button class="btn btn-light" disabled>AUSVERKAUFT</button>':'<button class="btn btn-dark" onclick="addToCart('+p.id+');closeProduct();openCart()">IN DEN WARENKORB</button>'}</div></div>`;
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
