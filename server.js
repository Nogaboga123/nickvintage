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
if(!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify([
{id:1,name:"Nike Trackjacket 90s",cat:"Jacken",size:"L",price:89.99,condition:"Sehr gut",tag:"RARE",code:"NIKE",image:"",stock:1,new:true},
{id:2,name:"Adidas Trackpants Classic",cat:"Trackpants",size:"M",price:69.99,condition:"Sehr gut",tag:"ONE OF ONE",code:"ADIDAS",image:"",stock:1,new:true}
],null,2));

const readProducts=()=>JSON.parse(fs.readFileSync(dbFile,"utf8"));
const writeProducts=p=>fs.writeFileSync(dbFile,JSON.stringify(p,null,2));
const adminPasswordHash=process.env.ADMIN_PASSWORD_HASH||'$2b$12$3j8kVYwP9f8f5G0mG7dR6u5XQ6w4b8gF2dQ3Y7vYVQvM4w2u1a0mK';
const sessions=new Map();
const stripe=process.env.STRIPE_SECRET_KEY?new Stripe(process.env.STRIPE_SECRET_KEY):null;

app.use(cors({origin:false})); app.use(express.json({limit:"2mb"})); app.use(cookieParser()); app.use(express.static(__dirname));
app.use("/uploads",express.static(uploadDir));

const upload=multer({storage:multer.diskStorage({
 destination:uploadDir,
 filename:(_req,file,cb)=>cb(null,Date.now()+"-"+crypto.randomBytes(5).toString("hex")+path.extname(file.originalname).toLowerCase())
}),limits:{fileSize:8*1024*1024},fileFilter:(_r,f,cb)=>cb(null,/^image\/(jpeg|png|webp|gif)$/.test(f.mimetype))});

function auth(req,res,next){
 const token=req.cookies?.nv_admin;
 if(!token || !sessions.has(token)) return res.status(401).json({error:"Nicht autorisiert"});
 next();
}
app.get("/api/products",(_req,res)=>res.json(readProducts()));
app.post("/api/admin/login",async(req,res)=>{
 try{
  const password=String(req.body?.password||"");
  const ok=await bcrypt.compare(password,adminPasswordHash);
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
   line_items.push({price_data:{currency:"eur",product_data:{name:p.name,images:p.image?[`${process.env.PUBLIC_BASE_URL||"http://localhost:4242"}${p.image}`]:[]},unit_amount:Math.round(p.price*100)},quantity:qty});
  }
  const s=await stripe.checkout.sessions.create({mode:"payment",line_items,shipping_address_collection:{allowed_countries:["DE","AT","CH"]},success_url:`${process.env.PUBLIC_BASE_URL||"http://localhost:4242"}/?checkout=success`,cancel_url:`${process.env.PUBLIC_BASE_URL||"http://localhost:4242"}/?checkout=cancelled`,metadata:{shop:"NickVintage"}});
  res.json({url:s.url});
 }catch(e){console.error(e);res.status(500).json({error:"Checkout konnte nicht erstellt werden."})}
});
app.get("*",(req,res)=>{if(req.path.startsWith("/api/"))return res.status(404).end();res.sendFile(path.join(__dirname,"index.html"))});
app.listen(process.env.PORT||4242,()=>console.log("NickVintage läuft auf http://localhost:"+(process.env.PORT||4242)));
