import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import multer from "multer";
import { fileURLToPath } from "url";

const app=express();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const dataDir=path.join(__dirname,"data");
const uploadDir=path.join(__dirname,"uploads");
fs.mkdirSync(dataDir,{recursive:true}); fs.mkdirSync(uploadDir,{recursive:true});
const dbFile=path.join(dataDir,"products.json");
const settingsFile=path.join(dataDir,"settings.json");
const returnsFile=path.join(dataDir,"returns.json");
const ordersFile=path.join(dataDir,"orders.json");
const subscribersFile=path.join(dataDir,"subscribers.json");
const analyticsFile=path.join(dataDir,"analytics.json");
if(!fs.existsSync(returnsFile)) fs.writeFileSync(returnsFile,"[]");
if(!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile,"[]");
if(!fs.existsSync(subscribersFile)) fs.writeFileSync(subscribersFile,"[]");
if(!fs.existsSync(analyticsFile)) fs.writeFileSync(analyticsFile,"{}");

if(!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify([
{id:1,name:"Nike Trackjacket 90s",cat:"Jacken",size:"L",price:89.99,condition:"Sehr gut",tag:"RARE",code:"NIKE",image:"",stock:1,new:true},
{id:2,name:"Adidas Trackpants Classic",cat:"Trackpants",size:"M",price:69.99,condition:"Sehr gut",tag:"ONE OF ONE",code:"ADIDAS",image:"",stock:1,new:true}
],null,2));

const productDefaults={
1:{name:"Nike Tech Fleece Tracksuit — Black",cat:"Tracksuits",size:"L",price:119.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"/black-1[1].jpg",images:["/black-1[1].jpg","/black-2[1].jpg","/black-3[1].jpg","/black-4[1].jpg"],new:true},
2:{name:"Nike Tech Fleece Tracksuit — Grey",cat:"Tracksuits",size:"M",price:119.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"/grey-1[1].jpg",images:["/grey-1[1].jpg","/grey-2[1].jpg","/grey-3[1].jpg","/grey-4[1].jpg"],new:true},
3:{name:"Nike Tech Fleece Tracksuit — Navy",cat:"Tracksuits",size:"L",price:119.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"/navy-1[1].jpg",images:["/navy-1[1].jpg","/navy-2[1].jpg","/navy-3[1].jpg","/navy-4[1].jpg"],new:true},
4:{name:"Ralph Lauren Crewneck — Navy",cat:"Sweater",size:"M",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",image:"https://cdn.sarenza.cloud/_img/productsv4/0000256753/0000256753_470560_09.jpg",new:true},
5:{name:"Ralph Lauren Crewneck — Beige",cat:"Sweater",size:"L",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",image:"https://d13qso5xfejx18.cloudfront.net/product-media/95UR/580/580/0G0A5597.jpg",new:true},
6:{name:"Ralph Lauren Crewneck — Grey",cat:"Sweater",size:"L",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",image:"https://cdn-images.farfetch-contents.com/20/54/14/32/20541432_51601566_600.jpg",new:true},
7:{name:"Ralph Lauren Crewneck — Black",cat:"Sweater",size:"M",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",image:"https://cdn.media.amplience.net/i/frasersdev/33284540_o.jpg?v=20260519133125",new:true},
8:{name:"Nike Tech Fleece Hoodie — Black",cat:"Hoodies",size:"L",price:69.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/22860c98-b8c4-4779-99f0-893399c1dc00/M+NK+TCH+FLC+FZ+WR+HOODIE.png",new:true},
9:{name:"Nike Tech Fleece Hoodie — Grey",cat:"Hoodies",size:"M",price:69.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/cc350337-a9f2-453d-af2d-e007a3d8bc28/M+NK+TCH+FLC+ERGO+FZ.png",new:true},
10:{name:"Nike Tech Fleece Jogger — Black",cat:"Trackpants",size:"M",price:59.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9b3adca5-2ea6-42f1-9eea-87da2804e175/M+NK+TCH+FLC+ERGO+FZ.png",new:true}
};
const readProducts=()=>{const saved=JSON.parse(fs.readFileSync(dbFile,"utf8"));const base=Object.entries(productDefaults).map(([id,def])=>{const p=saved.find(x=>Number(x.id)===Number(id))||{};return {id:Number(id),...def,...p,images:(Array.isArray(p.images)&&p.images.length?p.images:def.images)||[],stock:p.stock??def.stock??1,status:p.status||def.status||"available"};});const ids=new Set(base.map(p=>Number(p.id)));const extra=saved.filter(p=>!ids.has(Number(p.id))).map(p=>({...p,id:Number(p.id),images:Array.isArray(p.images)?p.images:[],stock:p.stock??1,status:p.status||"available"}));return [...base,...extra];};
const hash=txt=>crypto.createHash("sha256").update(String(txt)).digest("hex");
if(!fs.existsSync(settingsFile)) fs.writeFileSync(settingsFile,JSON.stringify({
  siteOpen:false,
  earlyPasswordHash:hash("N&D VINTAGE2026!")
},null,2));
let runtimeSettings=null;
const readSettings=()=>{
 if(runtimeSettings)return runtimeSettings;
 const base=JSON.parse(fs.readFileSync(settingsFile,"utf8"));
 runtimeSettings={
  ...base,
  siteOpen:process.env.SITE_OPEN==="true"?true:process.env.SITE_OPEN==="false"?false:base.siteOpen,
  earlyPasswordHash:process.env.EARLY_ACCESS_PASSWORD?hash(process.env.EARLY_ACCESS_PASSWORD):base.earlyPasswordHash
 };
 return runtimeSettings;
};
const writeSettings=s=>{ runtimeSettings={...s}; try{fs.writeFileSync(settingsFile,JSON.stringify(runtimeSettings,null,2))}catch(e){console.error("Settings speichern:",e.message)} };
const writeProducts=p=>fs.writeFileSync(dbFile,JSON.stringify(p,null,2));
const readReturns=()=>{try{return JSON.parse(fs.readFileSync(returnsFile,"utf8"))}catch{return []}};
const writeReturns=x=>fs.writeFileSync(returnsFile,JSON.stringify(x,null,2));
const readOrders=()=>{try{return JSON.parse(fs.readFileSync(ordersFile,"utf8"))}catch{return []}};
const writeOrders=x=>fs.writeFileSync(ordersFile,JSON.stringify(x,null,2));
const readSubscribers=()=>{try{return JSON.parse(fs.readFileSync(subscribersFile,"utf8"))}catch{return []}};
const writeSubscribers=x=>fs.writeFileSync(subscribersFile,JSON.stringify(x,null,2));
const readAnalytics=()=>{try{return JSON.parse(fs.readFileSync(analyticsFile,"utf8"))}catch{return {}}};
const writeAnalytics=x=>fs.writeFileSync(analyticsFile,JSON.stringify(x,null,2));
const adminPasswordHash=process.env.ADMIN_PASSWORD_HASH||null;
const adminPassword=process.env.ADMIN_PASSWORD||"N&D VINTAGE2026!";
const sessions=new Map();
const earlyTokens=new Map();
const stripe=process.env.STRIPE_SECRET_KEY?new Stripe(process.env.STRIPE_SECRET_KEY):null;
const stripeWebhookSecret=process.env.STRIPE_WEBHOOK_SECRET||"";
const publicBaseUrl=process.env.PUBLIC_BASE_URL||process.env.RENDER_EXTERNAL_URL||"http://localhost:4242";

app.use(cors({origin:false}));
app.post("/api/stripe-webhook",express.raw({type:"application/json"}),async(req,res)=>{
 try{
  if(!stripe||!stripeWebhookSecret)return res.status(503).end();
  const event=stripe.webhooks.constructEvent(req.body,req.headers["stripe-signature"],stripeWebhookSecret);
  if(event.type==="checkout.session.completed"){
   const s=event.data.object, id=String(s.id);
   const orders=readOrders();
   if(!orders.some(o=>o.stripeSessionId===id)){
    const parsed=String(s.metadata?.items||"").split(",").filter(Boolean).map(v=>{const [pid,qty]=v.split("x").map(Number);return {id:pid,qty}});
    const db=readProducts(), orderItems=parsed.map(x=>{const p=db.find(y=>Number(y.id)===x.id);return p?{id:p.id,name:p.name,size:p.size,price:p.price,purchasePrice:Number(p.purchasePrice||0),qty:x.qty}:null}).filter(Boolean);
    for(const x of parsed){const p=db.find(y=>Number(y.id)===x.id);if(p){p.stock=Math.max(0,(p.stock??1)-x.qty);if(p.stock===0)p.status="sold"}}
    writeProducts(db);
    orders.unshift({id:"ND-"+Date.now().toString(36).toUpperCase(),stripeSessionId:id,email:s.customer_details?.email||s.customer_email||"",items:orderItems,total:Number(s.amount_total||0)/100,status:"Bezahlt",tracking:"",carrier:"",test:s.livemode===false,createdAt:new Date().toISOString()});
    writeOrders(orders);
   }
  }
  res.json({received:true});
 }catch(e){console.error("Webhook:",e.message);res.status(400).send("Webhook error")}
});
app.use(express.json({limit:"2mb"})); app.use(cookieParser());
app.use((req,res,next)=>{
 const protectedPage=req.path==="/" || req.path==="/index.html";
 if(!protectedPage || readSettings().siteOpen) return next();
 const token=String(req.query.access||"");
 const valid=token && earlyTokens.has(token) && earlyTokens.get(token)>Date.now();
 if(valid){ earlyTokens.delete(token); return next(); }
 res.status(200).send(`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>N&D VINTAGE — Early Access</title><meta property="og:title" content="N&D VINTAGE — Vintage Streetwear"><meta property="og:description" content="Kuratierte Vintage Streetwear, Einzelstücke und neue Drops."><meta property="og:type" content="website"><meta property="og:url" content="https://nickvintage.onrender.com/"><meta property="og:image" content="https://nickvintage.onrender.com/nd-vintage-social-share.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="N&D VINTAGE — kuratierte Vintage Streetwear"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="N&D VINTAGE — Vintage Streetwear"><meta name="twitter:description" content="Kuratierte Vintage Streetwear, Einzelstücke und neue Drops."><meta name="twitter:image" content="https://nickvintage.onrender.com/nd-vintage-social-share.jpg"><style>*{box-sizing:border-box}body{margin:0;background:#111;color:#fff;font-family:Inter,Arial,sans-serif;min-height:100vh;display:grid;place-items:center;padding:24px}.box{width:min(460px,100%);border:1px solid #333;padding:42px;background:#171717}.ey{font-size:10px;letter-spacing:.2em;font-weight:800;color:#aaa}.logo{font-size:28px;font-weight:900;letter-spacing:-.06em;margin:12px 0 35px}.logo span{font-weight:400}.box h1{font-size:48px;line-height:.9;letter-spacing:-.07em;margin:0 0 14px}.box p{color:#999;font-size:13px;line-height:1.6}.box form{display:flex;gap:8px;margin-top:25px}.box input{flex:1;background:#222;color:#fff;border:1px solid #444;padding:15px;outline:0}.box button{background:#fff;color:#111;border:0;padding:0 18px;font-weight:900;cursor:pointer}.err{color:#ff8d8d!important;font-size:11px!important;margin-top:12px}</style></head><body><div class="box"><div class="ey">N&D VINTAGE · EARLY ACCESS</div><div class="logo">N&amp;D <span>VINTAGE</span></div><h1>EARLY<br>ACCESS.</h1><p>Der Shop ist noch nicht öffentlich geöffnet. Wenn du einen Early-Access-Code hast, kannst du jetzt eintreten.</p><form method="POST" action="/api/early-access"><input name="password" type="password" placeholder="Early-Access-Passwort" required autofocus><button>ÖFFNEN</button></form>\${req.query.error?'<p class="err">Falsches Passwort.</p>':''}</div></body></html>`);
});
app.use("/uploads",express.static(uploadDir));
app.get("/produkt.html",(req,res,next)=>{
 const id=Number(req.query.id);
 if(!Number.isFinite(id))return next();
 const p=readProducts().find(x=>Number(x.id)===id);
 if(!p||p.hidden)return next();
 try{
  const file=fs.readFileSync(path.join(__dirname,"produkt.html"),"utf8");
  const escMeta=v=>String(v??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const base=(process.env.PUBLIC_URL||"https://nickvintage.onrender.com").replace(/\/$/,"");
  const pageUrl=base+"/produkt.html?id="+encodeURIComponent(id);
  const rawImage=String(p.image||((Array.isArray(p.images)&&p.images[0])||"")).trim();
  const image=rawImage?(rawImage.startsWith("http")?rawImage:base+(rawImage.startsWith("/")?"":"/")+rawImage):base+"/nd-vintage-social-share.jpg";
  const title=String(p.name||"Vintage Piece")+" — N&D VINTAGE";
  const desc=Number(p.price||0).toLocaleString("de-DE",{style:"currency",currency:"EUR"})+" · Größe "+String(p.size||"—")+" · "+String(p.condition||"Vintage Piece");
  const meta='<meta property="og:title" content="'+escMeta(title)+'"><meta property="og:description" content="'+escMeta(desc)+'"><meta property="og:type" content="product"><meta property="og:url" content="'+escMeta(pageUrl)+'"><meta property="og:image" content="'+escMeta(image)+'"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+escMeta(title)+'"><meta name="twitter:description" content="'+escMeta(desc)+'"><meta name="twitter:image" content="'+escMeta(image)+'">';
  res.type("html").send(file.replace("</head>",meta+"</head>"));
 }catch(e){next(e)}
});
app.use(express.static(__dirname,{index:false}));
app.post("/api/early-access",express.urlencoded({extended:false}),async(req,res)=>{
 const ok=hash(req.body?.password||"")===readSettings().earlyPasswordHash;
 if(!ok)return res.redirect("/?error=1");
 const token=crypto.randomBytes(24).toString("hex");
 earlyTokens.set(token,Date.now()+30*1000);
 res.redirect("/?access="+encodeURIComponent(token));
});
function auth(req,res,next){
 const token=req.cookies?.nv_admin;
 const expires=token?sessions.get(token):0;
 if(!token||!expires||expires<=Date.now()){
  if(token)sessions.delete(token);
  return res.status(401).json({error:"Nicht autorisiert"});
 }
 next();
}
app.get("/api/public-settings",(_req,res)=>{const x=readSettings();res.json({dropName:x.dropName||"DROP 01",dropDate:x.dropDate||"",shipping:x.shipping||{DE:4.99,AT:8.99,CH:12.99,freeFrom:100}})});
app.get("/api/site-settings",auth,(req,res)=>{const x=readSettings();res.json({siteOpen:!!x.siteOpen,dropName:x.dropName||"DROP 01",dropDate:x.dropDate||"",shipping:x.shipping||{DE:4.99,AT:8.99,CH:12.99,freeFrom:100},discount:x.discount||{code:"",percent:0,active:false}})});
app.put("/api/site-settings",auth,(req,res)=>{
 const cur={...readSettings()}, body=req.body||{};
 if(typeof body.siteOpen==="boolean")cur.siteOpen=body.siteOpen;
 if(typeof body.dropName==="string")cur.dropName=body.dropName.trim().slice(0,60);
 if(typeof body.dropDate==="string")cur.dropDate=body.dropDate.trim().slice(0,40);if(body.shipping&&typeof body.shipping==="object")cur.shipping={DE:Math.max(0,Number(body.shipping.DE)||0),AT:Math.max(0,Number(body.shipping.AT)||0),CH:Math.max(0,Number(body.shipping.CH)||0),freeFrom:Math.max(0,Number(body.shipping.freeFrom)||0)};if(body.discount&&typeof body.discount==="object")cur.discount={code:String(body.discount.code||"").trim().toUpperCase().slice(0,30),percent:Math.max(0,Math.min(100,Number(body.discount.percent)||0)),active:!!body.discount.active};
 if(typeof body.earlyPassword==="string" && body.earlyPassword.trim()){
  if(process.env.EARLY_ACCESS_PASSWORD){
   return res.status(409).json({error:"Das Early-Access-Passwort wird dauerhaft über Render (EARLY_ACCESS_PASSWORD) verwaltet."});
  }
  cur.earlyPasswordHash=hash(body.earlyPassword.trim());
 }
 writeSettings(cur); res.json({siteOpen:cur.siteOpen,dropName:cur.dropName||"DROP 01",dropDate:cur.dropDate||"",shipping:cur.shipping,discount:cur.discount});
});

app.post("/api/drop-alert",(req,res)=>{const email=String(req.body?.email||"").trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:"Bitte eine gültige E-Mail eingeben."});const list=readSubscribers();if(!list.some(x=>x.email===email)){list.unshift({email,createdAt:new Date().toISOString()});writeSubscribers(list)}res.status(201).json({ok:true,message:"Du bist beim Drop-Alert dabei."})});
app.get("/api/admin/drop-alerts",auth,(_req,res)=>res.json(readSubscribers()));

app.post("/api/returns",(req,res)=>{
 const body=req.body||{};
 const order=String(body.order||"").trim(), email=String(body.email||"").trim();
 if(!order||!email)return res.status(400).json({error:"Bestellnummer und E-Mail sind erforderlich."});
 const list=readReturns();
 const matchingOrder=readOrders().find(x=>String(x.id).toLowerCase()===order.toLowerCase()&&String(x.email).toLowerCase()===email.toLowerCase());
 if(!matchingOrder)return res.status(404).json({error:"Bestellnummer und E-Mail passen zu keiner Bestellung."});
 const item={id:"RET-"+Date.now().toString(36).toUpperCase(),order:matchingOrder.id,email:matchingOrder.email,reason:String(body.reason||"Nicht angegeben"),details:String(body.details||"").trim(),status:"Neu",createdAt:new Date().toISOString()};
 list.unshift(item);writeReturns(list);res.status(201).json({ok:true,id:item.id});
});
app.post("/api/order-status",(req,res)=>{
 const order=String(req.body?.order||"").trim().toLowerCase(),email=String(req.body?.email||"").trim().toLowerCase();
 if(!order||!email)return res.status(400).json({error:"Bestellnummer und E-Mail eingeben."});
 const found=readOrders().find(x=>String(x.id).toLowerCase()===order&&String(x.email).toLowerCase()===email);
 if(!found)return res.status(404).json({error:"Keine passende Bestellung gefunden."});
 const carrier=found.carrier||"",tracking=found.tracking||"";
 const trackingUrls={DHL:"https://www.dhl.de/de/privatkunden/dhl-sendungsverfolgung.html?piececode=",Hermes:"https://www.myhermes.de/empfangen/sendungsverfolgung/sendungsinformation/#",DPD:"https://tracking.dpd.de/status/de_DE/parcel/",UPS:"https://www.ups.com/track?loc=de_DE&tracknum="};
 const trackingUrl=tracking&&trackingUrls[carrier]?trackingUrls[carrier]+encodeURIComponent(tracking):"";
 res.json({id:found.id,status:found.status,tracking,carrier,trackingUrl,createdAt:found.createdAt,items:(found.items||[]).map(x=>({name:x.name,size:x.size,qty:x.qty}))});
});
app.get("/api/admin/orders",auth,(_req,res)=>res.json(readOrders()));
app.delete("/api/admin/test-orders",auth,(_req,res)=>{const list=readOrders(),tests=list.filter(o=>o.test===true),keep=list.filter(o=>o.test!==true);writeOrders(keep);res.json({ok:true,deleted:tests.length})});
app.get("/api/admin/stats",auth,(_req,res)=>{
 const orders=readOrders().filter(x=>x.status!=="Storniert"&&x.test!==true),products=readProducts(),revenue=orders.reduce((n,x)=>n+Number(x.total||0),0);
 let cost=0;for(const o of orders)for(const item of (o.items||[])){const p=products.find(x=>Number(x.id)===Number(item.id));cost+=Number(item.purchasePrice??p?.purchasePrice??0)*Number(item.qty||1)}
 const now=new Date(),days=[];for(let n=13;n>=0;n--){const d=new Date(now);d.setHours(0,0,0,0);d.setDate(d.getDate()-n);const next=new Date(d);next.setDate(next.getDate()+1);const value=orders.filter(o=>{const t=new Date(o.createdAt);return t>=d&&t<next}).reduce((sum,o)=>sum+Number(o.total||0),0);days.push({date:d.toISOString().slice(0,10),revenue:value})}
 res.json({revenue,orders:orders.length,average:orders.length?revenue/orders.length:0,estimatedProfit:revenue-cost,cost,margin:revenue?((revenue-cost)/revenue)*100:0,daily:days})
});
app.get("/api/admin/drop-stats",auth,(_req,res)=>{const ps=readProducts(),os=readOrders().filter(o=>o.status!=="Storniert"),map={};for(const p of ps){const d=String(p.drop||"OHNE DROP");if(!map[d])map[d]={drop:d,pieces:0,available:0,sold:0,revenue:0,cost:0};map[d].pieces++;if(p.status==="sold")map[d].sold++;else if(!p.hidden)map[d].available++}for(const o of os)for(const i of (o.items||[])){const p=ps.find(x=>Number(x.id)===Number(i.id));const d=String(p?.drop||"OHNE DROP");if(!map[d])map[d]={drop:d,pieces:0,available:0,sold:0,revenue:0,cost:0};map[d].revenue+=Number(i.price||0)*Number(i.qty||1);map[d].cost+=Number(i.purchasePrice??p?.purchasePrice??0)*Number(i.qty||1)}res.json(Object.values(map).map(x=>({...x,profit:x.revenue-x.cost,sellThrough:x.pieces?Math.round(x.sold/x.pieces*100):0}))) });
app.put("/api/admin/orders/:id",auth,(req,res)=>{
 const list=readOrders(),i=list.findIndex(x=>x.id===req.params.id);
 if(i<0)return res.status(404).json({error:"Bestellung nicht gefunden"});
 const allowed=["Bezahlt","Wird verpackt","Versendet","Erledigt","Storniert"];
 if(allowed.includes(req.body?.status))list[i].status=req.body.status;
 if(typeof req.body?.tracking==="string")list[i].tracking=req.body.tracking.trim();
 if(typeof req.body?.carrier==="string")list[i].carrier=req.body.carrier.trim().slice(0,30);
 writeOrders(list);res.json(list[i]);
});
app.get("/api/admin/returns",auth,(_req,res)=>res.json(readReturns()));
app.put("/api/admin/returns/:id",auth,(req,res)=>{
 const list=readReturns(), i=list.findIndex(x=>x.id===req.params.id);
 if(i<0)return res.status(404).json({error:"Retoure nicht gefunden"});
 const allowed=["Neu","In Prüfung","Genehmigt","Erledigt"];
 if(allowed.includes(req.body?.status))list[i].status=req.body.status;
 writeReturns(list);res.json(list[i]);
});

const upload=multer({storage:multer.diskStorage({
 destination:uploadDir,
 filename:(_req,file,cb)=>cb(null,Date.now()+"-"+crypto.randomBytes(5).toString("hex")+path.extname(file.originalname).toLowerCase())
}),limits:{fileSize:8*1024*1024},fileFilter:(_r,f,cb)=>cb(null,/^image\/(jpeg|png|webp|gif)$/.test(f.mimetype))});


app.post("/api/analytics",(req,res)=>{const id=Number(req.body?.productId),type=String(req.body?.type||"");if(!Number.isFinite(id)||!["view","favorite"].includes(type))return res.status(400).json({error:"Ungültige Analytics-Daten"});const a=readAnalytics(),k=String(id);a[k]=a[k]||{views:0,favorites:0,events:[]};a[k][type==="view"?"views":"favorites"]++;a[k].events=Array.isArray(a[k].events)?a[k].events:[];a[k].events.push({type,at:new Date().toISOString()});if(a[k].events.length>1000)a[k].events=a[k].events.slice(-1000);writeAnalytics(a);res.json({ok:true})});
app.get("/api/admin/analytics",auth,(_req,res)=>{const a=readAnalytics(),now=Date.now(),periods={day:86400000,week:7*86400000,month:30*86400000};const summary={};for(const [name,ms] of Object.entries(periods)){let views=0,favorites=0;for(const x of Object.values(a))for(const e of (Array.isArray(x.events)?x.events:[])){if(now-new Date(e.at).getTime()<=ms){if(e.type==="view")views++;if(e.type==="favorite")favorites++}}summary[name]={views,favorites}}res.json({...a,_summary:summary})});
app.get("/api/trending",(_req,res)=>{const a=readAnalytics(),ps=readProducts().filter(p=>!p.hidden&&p.status!=="sold"&&(!p.publishAt||new Date(p.publishAt).getTime()<=Date.now()));res.json(ps.map(p=>({id:p.id,views:Number(a[p.id]?.views||0),favorites:Number(a[p.id]?.favorites||0),score:Number(a[p.id]?.views||0)+Number(a[p.id]?.favorites||0)*2})).sort((x,y)=>y.score-x.score).slice(0,6))});
app.get("/api/products",(_req,res)=>{const now=Date.now();res.json(readProducts().filter(p=>!p.hidden&&(!p.publishAt||new Date(p.publishAt).getTime()<=now)))});
app.get("/api/admin/products",auth,(_req,res)=>res.json(readProducts()));
app.post("/api/admin/login",async(req,res)=>{
 try{
  const password=String(req.body?.password||"");
  const ok=adminPasswordHash ? await bcrypt.compare(password,adminPasswordHash) : password===adminPassword;
  if(!ok)return res.status(401).json({ok:false,error:"Falsches Admin-Passwort"});
  const token=crypto.randomBytes(32).toString("hex");
  sessions.set(token,Date.now()+12*60*60*1000);
  res.cookie("nv_admin",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",maxAge:12*60*60*1000,path:"/"});
  res.json({ok:true});
 }catch(e){res.status(500).json({error:"Login-Fehler"})}
});
app.post("/api/admin/logout",(req,res)=>{
 const token=req.cookies?.nv_admin;
 if(token)sessions.delete(token);
 res.clearCookie("nv_admin",{path:"/"});
 res.json({ok:true});
});
app.post("/api/admin/products",auth,(req,res)=>{
 const p=readProducts();
 const body=req.body||{};
 const id=p.length?Math.max(...p.map(x=>Number(x.id)||0))+1:1;
 const image=String(body.image||"");const images=Array.isArray(body.images)?body.images.map(String).filter(Boolean):[];
 const item={id,name:String(body.name||"Neues Produkt"),price:Number(body.price)||0,oldPrice:Math.max(0,Number(body.oldPrice)||0),createdAt:new Date().toISOString(),cat:String(body.cat||"Sonstiges"),size:String(body.size||""),condition:String(body.condition||"Sehr gut"),tag:String(body.tag||"VINTAGE"),code:String(body.code||"NV"),color:String(body.color||""),material:String(body.material||""),description:String(body.description||""),drop:String(body.drop||"").trim().slice(0,60),purchasePrice:Math.max(0,Number(body.purchasePrice)||0),publishAt:String(body.publishAt||""),chest:Number(body.chest)||null,length:Number(body.length)||null,waist:Number(body.waist)||null,inseam:Number(body.inseam)||null,legOpening:Number(body.legOpening)||null,stock:Math.max(0,Number(body.stock)||0),image,images:images.length?images:(image?[image]:[]),new:!!body.new,status:(Math.max(0,Number(body.stock)||0)>0?"available":"sold")};
 p.push(item);writeProducts(p);res.status(201).json(item);
});
app.put("/api/admin/products/:id",auth,(req,res)=>{
 const p=readProducts();const id=Number(req.params.id);const i=p.findIndex(x=>x.id===id);
 if(i<0)return res.status(404).json({error:"Produkt nicht gefunden"});
 p[i]={...p[i],...req.body,id};p[i].stock=Math.max(0,Number(p[i].stock)||0);p[i].status=p[i].stock>0?(p[i].status==="sold"?"available":(p[i].status||"available")):"sold";if(Array.isArray(p[i].images))p[i].images=p[i].images.map(String).filter(Boolean);writeProducts(p);res.json(p[i]);
});
app.post("/api/admin/products/:id/duplicate",auth,(req,res)=>{const p=readProducts(),src=p.find(x=>Number(x.id)===Number(req.params.id));if(!src)return res.status(404).json({error:"Produkt nicht gefunden"});const id=p.length?Math.max(...p.map(x=>Number(x.id)||0))+1:1;const copy={...src,id,name:src.name+" – Kopie",hidden:true,status:(Number(src.stock||0)>0?"available":"sold")};p.push(copy);writeProducts(p);res.status(201).json(copy)});
app.delete("/api/admin/products/:id",auth,(req,res)=>{
 const p=readProducts();const id=Number(req.params.id);const item=p.find(x=>x.id===id);
 writeProducts(p.filter(x=>x.id!==id));
 if(item?.image?.startsWith("/uploads/")){const f=path.join(__dirname,item.image);if(fs.existsSync(f))fs.unlinkSync(f)}
 res.json({ok:true});
});
app.post("/api/admin/upload",auth,upload.single("image"),(req,res)=>{
 if(!req.file)return res.status(400).json({error:"Bild fehlt oder Format nicht erlaubt"});
 res.json({url:"/uploads/"+req.file.filename});
});

app.post("/api/create-checkout-session",async(req,res)=>{
 try{
  if(!stripe)return res.status(503).json({error:"Stripe ist noch nicht konfiguriert."});
  const db=readProducts(), items=Array.isArray(req.body.items)?req.body.items:[];
  const line_items=[];let subtotal=0;
  for(const x of items){
   const p=db.find(y=>y.id===Number(x.id));const qty=Math.max(1,Math.min(10,Number(x.qty)||1));
   if(!p||p.hidden||(p.publishAt&&new Date(p.publishAt).getTime()>Date.now()))return res.status(400).json({error:"Produkt ist nicht verfügbar"});
   if(p.stock<qty)return res.status(400).json({error:`${p.name} ist nicht mehr in ausreichender Menge verfügbar.`});
   const checkoutImage=p.image?(p.image.startsWith("http://")||p.image.startsWith("https://")?p.image:publicBaseUrl+p.image):"";
   line_items.push({price_data:{currency:"eur",product_data:{name:p.name,images:checkoutImage?[checkoutImage]:[]},unit_amount:Math.round(p.price*100)},quantity:qty});subtotal+=Number(p.price)*qty;
  }
  const cfg=readSettings(),discount=cfg.discount||{},code=String(req.body.discountCode||"").trim().toUpperCase();if(code&&discount.active&&code===discount.code&&discount.percent>0){const factor=Math.max(0,1-Number(discount.percent)/100);for(const li of line_items)li.price_data.unit_amount=Math.max(1,Math.round(li.price_data.unit_amount*factor))}const country=["DE","AT","CH"].includes(String(req.body.shippingCountry||"").toUpperCase())?String(req.body.shippingCountry).toUpperCase():"DE";const customerEmail=typeof req.body.customerEmail==="string" ? req.body.customerEmail.trim() : "";
  const itemMeta=items.map(x=>`${Number(x.id)}x${Math.max(1,Math.min(10,Number(x.qty)||1))}`).join(",");
  const session=await stripe.checkout.sessions.create({
   mode:"payment",
   line_items,
   shipping_address_collection:{allowed_countries:[country]},shipping_options:[{shipping_rate_data:{type:"fixed_amount",fixed_amount:{amount:subtotal>=Number(cfg.shipping?.freeFrom||100)?0:Math.round(Number(cfg.shipping?.[country]??cfg.shipping?.DE??4.99)*100),currency:"eur"},display_name:subtotal>=Number(cfg.shipping?.freeFrom||100)?"Kostenloser Versand":"Standardversand "+country}}],
   customer_email:customerEmail||undefined,
   metadata:{items:itemMeta},
   success_url:publicBaseUrl+"/bestellung-erfolgreich.html?session_id={CHECKOUT_SESSION_ID}",
   cancel_url:publicBaseUrl+"/?checkout=cancelled"
  });
  res.json({url:session.url});
 }catch(e){console.error(e);res.status(500).json({error:"Checkout konnte nicht erstellt werden."})}
});
app.get("*",(req,res)=>{if(req.path.startsWith("/api/"))return res.status(404).end();res.sendFile(path.join(__dirname,"index.html"))});
app.listen(process.env.PORT||4242,()=>console.log("N&D VINTAGE läuft auf http://localhost:"+(process.env.PORT||4242)));
