(()=>{
 const key="nd-vintage-profile-v1",form=document.getElementById("profileForm"),message=document.getElementById("profileMessage");
 const fields=["firstName","lastName","email","street","addressExtra","postalCode","city","country"];
 const defaults=()=>{form.reset();message.textContent=""};
 try{const data=JSON.parse(localStorage.getItem(key)||"null");if(data&&typeof data==="object"&&!Array.isArray(data))for(const name of fields){if(typeof data[name]==="string")form.elements.namedItem(name).value=data[name].slice(0,254)}}catch{message.textContent="Gespeicherte Daten konnten nicht geladen werden. Du kannst sie hier neu eingeben."}
 form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;const data={};for(const name of fields)data[name]=form.elements.namedItem(name).value.trim();try{localStorage.setItem(key,JSON.stringify(data));message.textContent="✓ Dein Profil ist in diesem Browser gespeichert."}catch{message.textContent="Speichern ist in diesem Browser nicht möglich. Bitte prüfe deine Browser-Einstellungen."}});
 document.getElementById("clearProfile").addEventListener("click",()=>{try{localStorage.removeItem(key);defaults();message.textContent="Deine gespeicherten Profildaten wurden gelöscht."}catch{message.textContent="Die Daten konnten nicht gelöscht werden. Bitte prüfe deine Browser-Einstellungen."}});
})();