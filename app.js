(() => {
  "use strict";

  const app = document.getElementById("app");
  const overlay = document.getElementById("overlay-root");
  const toast = document.getElementById("toast");
  const cfg = window.MMN_CONFIG || {};

  const state = {
    client:null, session:null, user:null, profile:null,
    posts:[], map:new Map(), signed:new Map(),
    pending:[], viewerPost:null, viewerIndex:0
  };

  const esc = (v="") => String(v).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const brand = () => `<span class="brand"><span class="brand-mark">MMN</span><span class="brand-name"><strong>My Mate Nasty</strong><span>A shared photo dump for mates.</span></span></span>`;
  const configured = () => cfg.supabaseUrl && cfg.supabasePublishableKey && !String(cfg.supabaseUrl).includes("YOUR_");
  const showToast = (msg,type="info") => { toast.textContent=msg; toast.dataset.type=type; toast.classList.add("show"); clearTimeout(showToast.t); showToast.t=setTimeout(()=>toast.classList.remove("show"),3200); };
  const fmt = iso => new Date(iso).toLocaleDateString("en-GB",{day:"numeric",month:"short"});
  const origin = () => location.origin;

  async function init(){
    document.addEventListener("click", click);
    document.addEventListener("submit", submit);
    document.addEventListener("change", change);
    window.addEventListener("hashchange", route);

    if(!configured() || !window.supabase?.createClient){
      app.innerHTML=`<div class="boot">Supabase connection missing. Keep your existing <strong>config.js</strong> in the repository.</div>`;
      return;
    }

    state.client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
    });

    const {data}=await state.client.auth.getSession();
    state.session=data.session;
    state.user=data.session?.user||null;
    if(state.user) await loadProfile();

    state.client.auth.onAuthStateChange((event,session)=>{
      setTimeout(async()=>{
        state.session=session; state.user=session?.user||null;
        if(event==="PASSWORD_RECOVERY"){ openReset(); return; }
        if(state.user) await loadProfile(); else state.profile=null;
        if(event==="SIGNED_IN") location.hash="gallery";
        else if(event==="SIGNED_OUT") location.hash="home";
        else route();
      },0);
    });

    route();
  }

  async function loadProfile(){
    const {data,error}=await state.client.from("profiles")
      .select("id,username,display_name,role,approved")
      .eq("id",state.user.id).single();
    if(error) throw error;
    if(data.approved===false){ await state.client.auth.signOut(); throw new Error("This account is paused."); }
    state.profile=data;
  }

  function route(){
    const r=(location.hash||"#home").replace("#","");
    if(r==="gallery" && !state.session){ location.hash="login"; return; }
    if(r==="home") renderHome();
    else if(r==="login" || r==="signup") renderAuth(r);
    else if(r==="gallery") renderGallery();
    else renderHome();
  }

  function renderHome(){
    document.title="My Mate Nasty";
    app.innerHTML=`<div>
      <header class="topbar"><div class="shell topbar-inner">${brand()}<div class="actions">
        <button class="btn" data-route="login">Log in</button>
        <button class="btn btn-primary" data-route="signup">Create account</button>
      </div></div></header>
      <main class="shell hero">
        <div>
          <span class="kicker">The internet probably didn't need this</span>
          <h1>Photos of mates.<br><em>Kept together.</em></h1>
          <p>A simple shared photo dump. Make an account, upload something funny, and browse whatever everyone else has added.</p>
          <div class="hero-buttons">
            <button class="btn btn-primary" data-route="signup">Create a quick account</button>
            <button class="btn" data-route="login">I'm already in</button>
          </div>
        </div>
        <div class="hero-card"><div class="hero-card-copy"><span>My Mate Nasty</span><strong>Questionable photos. Excellent archive.</strong></div></div>
      </main>
      <footer class="shell public-footer"><span>© My Mate Nasty</span><span>Upload only photos you have permission to share.</span></footer>
    </div>`;
  }

  function renderAuth(mode){
    const signup=mode==="signup";
    app.innerHTML=`<main class="auth-wrap">
      <section class="auth-side">${brand()}<div><h1>${signup?"Get in.":"Welcome"}<br><em>${signup?"Upload stuff.":"back."}</em></h1><p>${signup?"A quick account is all you need. Verify your email and you're in.":"Log in to browse the gallery and upload photos."}</p></div><span class="kicker">mymatenasty.com</span></section>
      <section class="auth-main"><div class="auth-card">
        <button class="btn" data-route="home" style="margin-bottom:24px">← Back</button>
        <h2>${signup?"Create account":"Log in"}</h2>
        <p>${signup?"Keep it simple. You can change nothing later because there is barely anything to change.":"Enter your email and password."}</p>
        <form class="form" data-form="${mode}">
          ${signup?`<div class="form-row"><div class="field"><label>Name</label><input class="input" name="display_name" required minlength="2" maxlength="50" placeholder="Mike"></div><div class="field"><label>Username</label><input class="input" name="username" required pattern="[a-z0-9_]{3,24}" placeholder="mike"></div></div>`:""}
          <div class="field"><label>Email</label><input class="input" type="email" name="email" required autocomplete="email"></div>
          <div class="field"><label>Password</label><input class="input" type="password" name="password" required minlength="8" autocomplete="${signup?"new-password":"current-password"}"></div>
          ${signup?`<label class="check"><input type="checkbox" name="is_adult" required><span>I confirm I am 18 or over and I will only upload photos I have permission to share.</span></label>`:`<button type="button" class="btn" data-action="forgot">Forgot password?</button>`}
          <button class="btn btn-primary" type="submit">${signup?"Create account":"Log in"}</button>
        </form>
        <div class="auth-switch">${signup?"Already have an account?":"Need an account?"} <button data-route="${signup?"login":"signup"}">${signup?"Log in":"Create one"}</button></div>
      </div></section>
    </main>`;
  }

  async function loadGallery(){
    const {data,error}=await state.client.rpc("get_feed",{limit_count:100,offset_count:0});
    if(error) throw error;
    const paths=[...new Set((data||[]).flatMap(p=>p.media_paths||[]).filter(Boolean))];
    const signed=await signedUrls("post-media",paths);
    state.posts=(data||[]).map(p=>({...p,media_urls:(p.media_paths||[]).map(x=>signed.get(x)||"")}));
    state.map=new Map(state.posts.map(p=>[String(p.id),p]));
  }

  async function renderGallery(){
    app.innerHTML=`${galleryHeader()}<main class="shell"><div class="gallery-head"><div><span class="kicker">Shared gallery</span><h1>Latest uploads</h1><p>Newest first. Nothing clever.</p></div><button class="btn btn-primary" data-action="upload">+ Upload photos</button></div><div class="empty">Loading photos…</div></main>`;
    try{
      await loadGallery();
      const content=state.posts.length?state.posts.map(tile).join(""):`<div class="empty"><h2>Nothing here yet.</h2><p>Someone has to upload the first questionable photo.</p><br><button class="btn btn-primary" data-action="upload">Upload one</button></div>`;
      app.innerHTML=`${galleryHeader()}<main class="shell"><div class="gallery-head"><div><span class="kicker">Shared gallery</span><h1>Latest uploads</h1><p>Newest first. Nothing clever.</p></div><button class="btn btn-primary" data-action="upload">+ Upload photos</button></div><section class="${state.posts.length?"gallery":""}">${content}</section></main>`;
    }catch(e){ showToast(e.message,"error"); }
  }

  function galleryHeader(){
    return `<header class="topbar"><div class="shell topbar-inner">${brand()}<div class="actions"><button class="btn" data-action="upload">Upload</button><button class="btn" data-action="logout">Log out</button></div></div></header>`;
  }

  function tile(post){
    const url=post.media_urls?.[0]||"";
    const canDelete=post.author_id===state.user.id || state.profile?.role==="admin";
    return `<article class="tile">
      <button class="photo-button" data-action="view" data-id="${post.id}"><img src="${esc(url)}" alt="${esc(post.caption||"Uploaded photo")}" loading="lazy"></button>
      <div class="tile-meta"><div class="tile-copy"><strong>${esc(post.author_name||"Member")}</strong><span>${post.caption?esc(post.caption)+" · ":""}${fmt(post.created_at)}</span></div>${canDelete?`<div class="tile-actions"><button data-action="delete" data-id="${post.id}">Delete</button></div>`:""}</div>
    </article>`;
  }

  function openUpload(){
    state.pending=[];
    overlay.innerHTML=`<div class="overlay" data-action="close-bg"><section class="modal">
      <div class="modal-head"><h2>Upload photos</h2><button class="btn btn-icon" data-action="close">×</button></div>
      <form class="modal-body form" data-form="upload">
        <div class="upload-zone"><input id="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple><label for="photos"><strong>Choose photos</strong>JPEG, PNG or WebP. Up to 10 at once.</label></div>
        <div id="previews" class="previews"></div>
        <div class="field"><label>Caption <span style="color:var(--muted)">(optional)</span></label><textarea class="textarea" name="caption" maxlength="500" placeholder="What are we looking at?"></textarea></div>
        <div id="progress" class="upload-progress hidden"><span></span></div>
        <div class="modal-actions"><button class="btn" type="button" data-action="close">Cancel</button><button class="btn btn-blue" type="submit">Upload</button></div>
      </form>
    </section></div>`;
  }

  function addFiles(files){
    const allowed=["image/jpeg","image/png","image/webp"];
    for(const f of files){
      if(state.pending.length>=10) break;
      if(!allowed.includes(f.type)){showToast(`${f.name} isn't supported.`,"error");continue}
      if(f.size>25*1024*1024){showToast(`${f.name} is too large.`,"error");continue}
      state.pending.push({file:f,preview:URL.createObjectURL(f)});
    }
    renderPreviews();
  }

  function renderPreviews(){
    const p=document.getElementById("previews"); if(!p)return;
    p.innerHTML=state.pending.map((x,i)=>`<div class="preview"><img src="${x.preview}"><button type="button" data-action="remove" data-index="${i}">×</button></div>`).join("");
  }

  async function upload(form,button){
    if(!state.pending.length) throw new Error("Choose at least one photo.");
    button.disabled=true; button.textContent="Starting…";
    const caption=String(new FormData(form).get("caption")||"").trim();
    const {data:post,error}=await state.client.from("posts")
      .insert({author_id:state.user.id,caption,location:null,comments_enabled:false})
      .select("id").single();
    if(error) throw error;

    const uploaded=[];
    try{
      const prog=document.getElementById("progress"); prog?.classList.remove("hidden");
      for(let i=0;i<state.pending.length;i++){
        button.textContent=`Uploading ${i+1} of ${state.pending.length}…`;
        const processed=await compressImage(state.pending[i].file,2200,.86);
        const path=`${state.user.id}/${post.id}/${crypto.randomUUID()}.jpg`;
        const {error:u}=await state.client.storage.from("post-media").upload(path,processed.blob,{contentType:"image/jpeg",cacheControl:"31536000"});
        if(u) throw u;
        uploaded.push(path);
        const {error:m}=await state.client.from("post_media").insert({post_id:post.id,storage_path:path,sort_order:i,width:processed.width,height:processed.height});
        if(m) throw m;
        if(prog) prog.querySelector("span").style.width=`${Math.round((i+1)/state.pending.length*100)}%`;
      }
    }catch(e){
      if(uploaded.length) await state.client.storage.from("post-media").remove(uploaded);
      await state.client.from("posts").delete().eq("id",post.id);
      throw e;
    }
    state.pending.forEach(x=>URL.revokeObjectURL(x.preview));
    state.pending=[]; closeOverlay(); showToast("Uploaded."); await renderGallery();
  }

  function view(postId){
    const p=state.map.get(String(postId)); if(!p)return;
    state.viewerPost=p; state.viewerIndex=0; renderViewer();
  }
  function renderViewer(){
    const p=state.viewerPost, urls=p.media_urls||[]; if(!p||!urls.length)return;
    const i=state.viewerIndex;
    overlay.innerHTML=`<div class="viewer">
      <div class="viewer-top"><div><strong>${esc(p.author_name||"Member")}</strong><span class="viewer-count"> · ${i+1}/${urls.length}</span></div><button class="btn btn-icon" data-action="close">×</button></div>
      <div class="viewer-main"><img src="${esc(urls[i])}" alt=""></div>
      <div class="viewer-bottom"><span class="viewer-caption">${esc(p.caption||"")}</span><div class="viewer-nav">${urls.length>1?`<button class="btn" data-action="prev">←</button><button class="btn" data-action="next">→</button>`:""}</div></div>
    </div>`;
  }

  async function deletePost(id){
    if(!confirm("Delete this upload?"))return;
    const {data:media,error:me}=await state.client.from("post_media").select("storage_path").eq("post_id",id);
    if(me){showToast(me.message,"error");return}
    const paths=(media||[]).map(x=>x.storage_path);
    if(paths.length) await state.client.storage.from("post-media").remove(paths);
    const {error}=await state.client.from("posts").delete().eq("id",id);
    if(error){showToast(error.message,"error");return}
    showToast("Deleted."); await renderGallery();
  }

  async function signedUrls(bucket,paths){
    const result=new Map(),missing=[];
    for(const path of [...new Set(paths.filter(Boolean))]){
      const cached=state.signed.get(`${bucket}:${path}`);
      if(cached && cached.exp>Date.now()) result.set(path,cached.url); else missing.push(path);
    }
    if(missing.length){
      const {data,error}=await state.client.storage.from(bucket).createSignedUrls(missing,3600);
      if(error) throw error;
      (data||[]).forEach((x,n)=>{const path=x.path||missing[n];if(x.signedUrl){result.set(path,x.signedUrl);state.signed.set(`${bucket}:${path}`,{url:x.signedUrl,exp:Date.now()+50*60*1000})}});
    }
    return result;
  }

  async function signup(form,button){
    const d=Object.fromEntries(new FormData(form));
    const username=String(d.username||"").toLowerCase().trim();
    if(!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Username must be 3–24 lowercase letters, numbers or underscores.");
    button.disabled=true;button.textContent="Creating…";
    const {data:available,error:a}=await state.client.rpc("username_available",{candidate:username});
    if(a) throw a; if(!available) throw new Error("That username is already taken.");
    const {data,error}=await state.client.auth.signUp({
      email:d.email,password:d.password,
      options:{emailRedirectTo:`${origin()}/#gallery`,data:{username,display_name:String(d.display_name||"").trim(),bio:"",is_adult:true,referrer_username:null}}
    });
    if(error) throw error;
    button.disabled=false;button.textContent="Create account";
    if(!data.session){
      overlay.innerHTML=`<div class="overlay"><section class="modal"><div class="modal-body"><h2 style="font-family:'Playfair Display',serif;font-size:36px">Check your email.</h2><p style="color:var(--muted);line-height:1.7">Click the verification link we sent to <strong>${esc(d.email)}</strong>, then come back and log in.</p><div class="modal-actions"><button class="btn btn-primary" data-action="close">Done</button></div></div></section></div>`;
    }
  }

  async function login(form,button){
    const d=Object.fromEntries(new FormData(form));
    button.disabled=true;button.textContent="Logging in…";
    const {error}=await state.client.auth.signInWithPassword({email:d.email,password:d.password});
    if(error) throw error;
  }

  function forgot(){
    overlay.innerHTML=`<div class="overlay"><section class="modal"><div class="modal-head"><h2>Reset password</h2><button class="btn btn-icon" data-action="close">×</button></div><form class="modal-body form" data-form="forgot"><div class="field"><label>Email</label><input class="input" type="email" name="email" required></div><div class="modal-actions"><button class="btn btn-primary">Send reset email</button></div></form></section></div>`;
  }

  function openReset(){
    overlay.innerHTML=`<div class="overlay"><section class="modal"><div class="modal-head"><h2>New password</h2></div><form class="modal-body form" data-form="reset"><div class="field"><label>New password</label><input class="input" type="password" name="password" minlength="8" required></div><div class="modal-actions"><button class="btn btn-primary">Update password</button></div></form></section></div>`;
  }

  async function compressImage(file,max,quality){
    let src,url;
    try{src=await createImageBitmap(file,{imageOrientation:"from-image"})}
    catch{
      url=URL.createObjectURL(file);
      src=await new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=url});
    }
    const scale=Math.min(1,max/Math.max(src.width,src.height));
    const width=Math.max(1,Math.round(src.width*scale)),height=Math.max(1,Math.round(src.height*scale));
    const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
    canvas.getContext("2d",{alpha:false}).drawImage(src,0,0,width,height);
    const blob=await new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error("Could not process image.")),"image/jpeg",quality));
    if(src.close) src.close(); if(url) URL.revokeObjectURL(url);
    return {blob,width,height};
  }

  function closeOverlay(){overlay.innerHTML=""}

  async function click(e){
    const r=e.target.closest("[data-route]");
    if(r){location.hash=r.dataset.route;return}
    const a=e.target.closest("[data-action]"); if(!a)return;
    const act=a.dataset.action;
    if(act==="upload") openUpload();
    else if(act==="close") closeOverlay();
    else if(act==="close-bg" && e.target===a) closeOverlay();
    else if(act==="logout") await state.client.auth.signOut();
    else if(act==="remove"){const i=Number(a.dataset.index);const [x]=state.pending.splice(i,1);if(x)URL.revokeObjectURL(x.preview);renderPreviews()}
    else if(act==="view") view(a.dataset.id);
    else if(act==="prev"){state.viewerIndex=(state.viewerIndex-1+(state.viewerPost.media_urls||[]).length)%(state.viewerPost.media_urls||[]).length;renderViewer()}
    else if(act==="next"){state.viewerIndex=(state.viewerIndex+1)%(state.viewerPost.media_urls||[]).length;renderViewer()}
    else if(act==="delete") await deletePost(a.dataset.id);
    else if(act==="forgot") forgot();
  }

  function change(e){
    if(e.target.id==="photos") addFiles([...e.target.files]);
  }

  async function submit(e){
    const form=e.target.closest("[data-form]"); if(!form)return;
    e.preventDefault();
    const button=form.querySelector('button[type="submit"],button:not([type])');
    try{
      if(form.dataset.form==="signup") await signup(form,button);
      else if(form.dataset.form==="login") await login(form,button);
      else if(form.dataset.form==="upload") await upload(form,button);
      else if(form.dataset.form==="forgot"){
        const email=new FormData(form).get("email");
        const {error}=await state.client.auth.resetPasswordForEmail(email,{redirectTo:`${origin()}/#gallery`});
        if(error) throw error; closeOverlay(); showToast("Reset email sent.");
      } else if(form.dataset.form==="reset"){
        const password=new FormData(form).get("password");
        const {error}=await state.client.auth.updateUser({password});
        if(error) throw error; closeOverlay(); showToast("Password updated."); location.hash="gallery";
      }
    }catch(err){
      console.error(err);showToast(err.message||"Something went wrong.","error");
      if(button){button.disabled=false}
    }
  }

  init().catch(err=>{console.error(err);app.innerHTML=`<div class="boot">${esc(err.message)}</div>`});
})();