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
if(!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify([
{id:1,name:"Nike Trackjacket 90s",cat:"Jacken",size:"L",price:89.99,condition:"Sehr gut",tag:"RARE",code:"NIKE",image:"",stock:1,new:true},
{id:2,name:"Adidas Trackpants Classic",cat:"Trackpants",size:"M",price:69.99,condition:"Sehr gut",tag:"ONE OF ONE",code:"ADIDAS",image:"",stock:1,new:true}
],null,2));

const productDefaults={
1:{name:"Nike Tech Fleece Tracksuit — Black",cat:"Tracksuits",size:"L",price:119.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_599,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/22860c98-b8c4-4779-99f0-893399c1dc00/M+NK+TCH+FLC+FZ+WR+HOODIE.png",new:true},
2:{name:"Nike Tech Fleece Tracksuit — Grey",cat:"Tracksuits",size:"M",price:119.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/cc350337-a9f2-453d-af2d-e007a3d8bc28/M+NK+TCH+FLC+ERGO+FZ.png",new:true},
3:{name:"Nike Tech Fleece Tracksuit — Navy",cat:"Tracksuits",size:"L",price:119.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/77f11517-6f39-4664-bbfe-12eb84126955/M+NK+TCH+FLC+FZ+WR+HOODIE.png",new:true},
4:{name:"Ralph Lauren Crewneck — Navy",cat:"Sweater",size:"M",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",image:"https://cdn.sarenza.cloud/_img/productsv4/0000256753/0000256753_470560_09.jpg",new:true},
5:{name:"Ralph Lauren Crewneck — Beige",cat:"Sweater",size:"L",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",image:"https://d13qso5xfejx18.cloudfront.net/product-media/95UR/580/580/0G0A5597.jpg",new:true},
6:{name:"Ralph Lauren Crewneck — Grey",cat:"Sweater",size:"L",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",image:"https://cdn-images.farfetch-contents.com/20/54/14/32/20541432_51601566_600.jpg",new:true},
7:{name:"Ralph Lauren Crewneck — Black",cat:"Sweater",size:"M",price:89.99,condition:"Sehr gut",tag:"RALPH LAUREN",code:"RL",image:"https://cdn.media.amplience.net/i/frasersdev/33284540_o.jpg?v=20260519133125",new:true},
8:{name:"Nike Tech Fleece Hoodie — Black",cat:"Hoodies",size:"L",price:69.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/22860c98-b8c4-4779-99f0-893399c1dc00/M+NK+TCH+FLC+FZ+WR+HOODIE.png",new:true},
9:{name:"Nike Tech Fleece Hoodie — Grey",cat:"Hoodies",size:"M",price:69.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/cc350337-a9f2-453d-af2d-e007a3d8bc28/M+NK+TCH+FLC+ERGO+FZ.png",new:true},
10:{name:"Nike Tech Fleece Jogger — Black",cat:"Trackpants",size:"M",price:59.99,condition:"Sehr gut",tag:"NIKE TECH",code:"NIKE",image:"https://static.nike.com/a/images/q_auto:eco/t_product_v1/f_auto/dpr_1.0/h_386,c_limit/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9b3adca5-2ea6-42f1-9eea-87da2804e175/M+NK+TCH+FLC+ERGO+FZ.png",new:true}
};
const readProducts=()=>{const saved=JSON.parse(fs.readFileSync(dbFile,"utf8"));return Object.entries(productDefaults).map(([id,def])=>{const p=saved.find(x=>Number(x.id)===Number(id))||{};return {...def,stock:p.stock??def.stock??1,status:p.status||def.status||"available"};});};
const hash=txt=>crypto.createHash("sha256").update(String(txt)).digest("hex");
if(!fs.existsSync(settingsFile)) fs.writeFileSync(settingsFile,JSON.stringify({
  siteOpen:false,
  earlyPasswordHash:hash("N&D VINTAGE2026!")
},null,2));
const readSettings=()=>JSON.parse(fs.readFileSync(settingsFile,"utf8"));
const writeSettings=s=>fs.writeFileSync(settingsFile,JSON.stringify(s,null,2));
const writeProducts=p=>fs.writeFileSync(dbFile,JSON.stringify(p,null,2));
const adminPasswordHash=process.env.ADMIN_PASSWORD_HASH||null;
const adminPassword=process.env.ADMIN_PASSWORD||"N&D VINTAGE2026!";
const sessions=new Map();
const earlyTokens=new Map();
const stripe=process.env.STRIPE_SECRET_KEY?new Stripe(process.env.STRIPE_SECRET_KEY):null;
const publicBaseUrl=process.env.PUBLIC_BASE_URL||process.env.RENDER_EXTERNAL_URL||"http://localhost:4242";

app.use(cors({origin:false})); app.use(express.json({limit:"2mb"})); app.use(cookieParser());
app.use((req,res,next)=>{
 const protectedPage=req.path==="/" || req.path==="/index.html";
 if(!protectedPage || readSettings().siteOpen) return next();
 const token=String(req.query.access||"");
 const valid=token && earlyTokens.has(token) && earlyTokens.get(token)>Date.now();
 if(valid){ earlyTokens.delete(token); return next(); }
 res.status(200).send(`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>N&D VINTAGE — Early Access</title><style>*{box-sizing:border-box}body{margin:0;background:#111;color:#fff;font-family:Inter,Arial,sans-serif;min-height:100vh;display:grid;place-items:center;padding:24px}.box{width:min(460px,100%);border:1px solid #333;padding:42px;background:#171717}.ey{font-size:10px;letter-spacing:.2em;font-weight:800;color:#aaa}.logo{font-size:28px;font-weight:900;letter-spacing:-.06em;margin:12px 0 35px}.logo span{font-weight:400}.box h1{font-size:48px;line-height:.9;letter-spacing:-.07em;margin:0 0 14px}.box p{color:#999;font-size:13px;line-height:1.6}.box form{display:flex;gap:8px;margin-top:25px}.box input{flex:1;background:#222;color:#fff;border:1px solid #444;padding:15px;outline:0}.box button{background:#fff;color:#111;border:0;padding:0 18px;font-weight:900;cursor:pointer}.err{color:#ff8d8d!important;font-size:11px!important;margin-top:12px}</style></head><body><div class="box"><div class="ey">N&D VINTAGE · EARLY ACCESS</div><div class="logo">N&amp;D <span>VINTAGE</span></div><h1>EARLY<br>ACCESS.</h1><p>Der Shop ist noch nicht öffentlich geöffnet. Wenn du einen Early-Access-Code hast, kannst du jetzt eintreten.</p><form method="POST" action="/api/early-access"><input name="password" type="password" placeholder="Early-Access-Passwort" required autofocus><button>ÖFFNEN</button></form>\${req.query.error?'<p class="err">Falsches Passwort.</p>':''}</div></body></html>`);
});
app.use("/uploads",express.static(uploadDir));
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
 if(!token || !sessions.has(token)) return res.status(401).json({error:"Nicht autorisiert"});
 next();
}
app.get("/api/site-settings",auth,(req,res)=>res.json(readSettings()));
app.put("/api/site-settings",auth,(req,res)=>{
 const cur=readSettings(), body=req.body||{};
 if(typeof body.siteOpen==="boolean")cur.siteOpen=body.siteOpen;
 if(typeof body.earlyPassword==="string" && body.earlyPassword.trim())cur.earlyPasswordHash=hash(body.earlyPassword.trim());
 writeSettings(cur); res.json({siteOpen:cur.siteOpen});
});

const upload=multer({storage:multer.diskStorage({
 destination:uploadDir,
 filename:(_req,file,cb)=>cb(null,Date.now()+"-"+crypto.randomBytes(5).toString("hex")+path.extname(file.originalname).toLowerCase())
}),limits:{fileSize:8*1024*1024},fileFilter:(_r,f,cb)=>cb(null,/^image\/(jpeg|png|webp|gif)$/.test(f.mimetype))});


app.get("/api/products",(_req,res)=>res.json(readProducts()));
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
 const item={id,name:String(body.name||"Neues Produkt"),price:Number(body.price)||0,cat:String(body.cat||"Sonstiges"),size:String(body.size||""),condition:String(body.condition||"Sehr gut"),tag:String(body.tag||"VINTAGE"),code:String(body.code||"NV"),stock:Math.max(0,Number(body.stock)||0),image:String(body.image||""),new:!!body.new};
 p.push(item);writeProducts(p);res.status(201).json(item);
});
app.put("/api/admin/products/:id",auth,(req,res)=>{
 const p=readProducts();const id=Number(req.params.id);const i=p.findIndex(x=>x.id===id);
 if(i<0)return res.status(404).json({error:"Produkt nicht gefunden"});
 p[i]={...p[i],...req.body,id};writeProducts(p);res.json(p[i]);
});
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
  const line_items=[];
  for(const x of items){
   const p=db.find(y=>y.id===Number(x.id));const qty=Math.max(1,Math.min(10,Number(x.qty)||1));
   if(!p)return res.status(400).json({error:"Unbekanntes Produkt"});
   if(p.stock<qty)return res.status(400).json({error:`${p.name} ist nicht mehr in ausreichender Menge verfügbar.`});
   line_items.push({price_data:{currency:"eur",product_data:{name:p.name,images:p.image?[`${publicBaseUrl}${p.image}`]:[]},unit_amount:Math.round(p.price*100)},quantity:qty});
  }
  const customerEmail=typeof req.body.customerEmail==="string" ? req.body.customerEmail.trim() : "";
  const itemMeta=items.map(x=>`${Number(x.id)}x${Math.max(1,Math.min(10,Number(x.qty)||1))}`).join(",");
  const session=await stripe.checkout.sessions.create({
   mode:"payment",
   line_items,
   shipping_address_collection:{allowed_countries:["DE","AT","CH"]},
   customer_email:customerEmail||undefined,
   metadata:{items:itemMeta},
   success_url:publicBaseUrl+"/?checkout=success",
   cancel_url:publicBaseUrl+"/?checkout=cancelled"
  });
  res.json({url:session.url});
 }catch(e){console.error(e);res.status(500).json({error:"Checkout konnte nicht erstellt werden."})}
});
app.get("*",(req,res)=>{if(req.path.startsWith("/api/"))return res.status(404).end();res.sendFile(path.join(__dirname,"index.html"))});
app.listen(process.env.PORT||4242,()=>console.log("N&D VINTAGE läuft auf http://localhost:"+(process.env.PORT||4242)));
