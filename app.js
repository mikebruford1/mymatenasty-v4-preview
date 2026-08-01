(() => {
  "use strict";

  const app = document.getElementById("app");
  const overlayRoot = document.getElementById("overlay-root");
  const toastNode = document.getElementById("toast");
  const cfg = window.MMN_CONFIG || {};
  const configured = Boolean(
    cfg.supabaseUrl &&
    cfg.supabasePublishableKey &&
    !String(cfg.supabaseUrl).includes("YOUR_") &&
    !String(cfg.supabasePublishableKey).includes("YOUR_")
  );

  const icons = {
    home: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></svg>`,
    search: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
    plus: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>`,
    heart: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`,
    comment: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/></svg>`,
    bell: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>`,
    user: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
    settings: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14v-4a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3h4a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1v4a1.7 1.7 0 0 0-1.6 1Z"/></svg>`,
    bookmark: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>`,
    more: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>`,
    close: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 5 14 14M19 5 5 19"/></svg>`,
    upload: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V4m0 0L7 9m5-5 5 5M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg>`,
    pin: `<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
    mail: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
    share: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>`,
    edit: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>`,
    trash: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></svg>`,
    flag: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 21V4M5 4h11l-1 4 1 4H5"/></svg>`,
    logout: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 17l5-5-5-5M15 12H3M21 3v18h-7"/></svg>`,
    shield: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`,
    arrowLeft: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m15 18-6-6 6-6"/></svg>`,
    arrowRight: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 18 6-6-6-6"/></svg>`
  };

  const state = {
    client: null,
    session: null,
    user: null,
    profile: null,
    route: "landing",
    routeParts: [],
    feed: [],
    feedMap: new Map(),
    newPeople: [],
    carousel: new Map(),
    signedCache: new Map(),
    pendingFiles: [],
    pendingAvatar: null,
    activePost: null,
    searchQuery: "",
    searchResults: [],
    notifications: [],
    settingsTab: "appearance",
    theme: localStorage.getItem("mmn-theme") || "ink",
    busy: false
  };

  document.documentElement.dataset.theme = state.theme;

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
  }

  function formatTime(iso) {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (diff < 60_000) return "Just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  function formatJoined(iso) {
    return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  function initials(name = "MM") {
    return name.split(/\s+/).slice(0, 2).map(x => x[0] || "").join("").toUpperCase();
  }

  function brand(compact = false) {
    return `<span class="brand ${compact ? "compact" : ""}"><span class="brand-mark" aria-label="MMN"><i>M</i><i>M</i><i>N</i></span><span class="brand-name"><strong>My Mate Nasty</strong><span>Social photos, not for social media.</span></span></span>`;
  }

  function avatar(url, name, className = "avatar") {
    return url
      ? `<img class="${className}" src="${escapeHTML(url)}" alt="${escapeHTML(name)}">`
      : `<span class="${className} avatar-fallback">${escapeHTML(initials(name))}</span>`;
  }

  function showToast(message, type = "info") {
    toastNode.textContent = message;
    toastNode.dataset.type = type;
    toastNode.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toastNode.classList.remove("show"), 3600);
  }

  function setButtonBusy(button, busy, text = "Working…") {
    if (!button) return;
    if (busy) {
      button.dataset.original = button.textContent;
      button.disabled = true;
      button.textContent = text;
    } else {
      button.disabled = false;
      button.textContent = button.dataset.original || button.textContent;
    }
  }

  function openOverlay(html, kind = "modal") {
    document.body.classList.add("no-scroll");
    if (kind === "drawer") {
      overlayRoot.innerHTML = `<div class="drawer-overlay" data-action="close-overlay"><aside class="drawer" data-stop>${html}</aside></div>`;
    } else {
      overlayRoot.innerHTML = `<div class="overlay" data-action="close-overlay"><section class="modal" data-stop>${html}</section></div>`;
    }
  }

  function closeOverlay() {
    overlayRoot.innerHTML = "";
    document.body.classList.remove("no-scroll");
  }

  function navigate(route) {
    const value = String(route || "landing").replace(/^#\/?/, "");
    if (location.hash === `#${value}`) renderRoute();
    else location.hash = value;
  }

  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, "") || "landing";
    const [name, ...parts] = raw.split("/");
    return { name, parts: parts.map(decodeURIComponent) };
  }

  function isProtected(name) {
    return ["feed", "search", "notifications", "profile", "settings", "admin"].includes(name);
  }

  function currentOrigin() {
    return location.origin;
  }

  async function init() {
    window.addEventListener("hashchange", renderRoute);
    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("change", handleChange);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeOverlay(); });

    if (!configured || !window.supabase?.createClient) {
      renderConfigurationNeeded();
      return;
    }

    state.client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    const { data, error } = await state.client.auth.getSession();
    if (error) showToast(error.message, "error");
    state.session = data?.session || null;
    state.user = state.session?.user || null;
    if (state.user) await loadCurrentProfile();

    state.client.auth.onAuthStateChange((event, session) => {
      setTimeout(async () => {
        state.session = session;
        state.user = session?.user || null;
        if (event === "PASSWORD_RECOVERY") {
          openResetPassword();
          return;
        }
        if (state.user) await loadCurrentProfile();
        else state.profile = null;
        if (event === "SIGNED_IN") navigate("feed");
        else if (event === "SIGNED_OUT") navigate("landing");
        else renderRoute();
      }, 0);
    });

    renderRoute();
  }

  function renderConfigurationNeeded() {
    app.innerHTML = `<main class="auth-page"><aside class="auth-aside">${brand()}<div><h1>One final<br><em>connection.</em></h1><p>The design is ready. Add your Supabase Project URL and publishable key to <strong>config.js</strong> to activate accounts, uploads, likes and comments.</p></div><div class="auth-art"><div class="auth-quote">“Never add a secret key to the website.”</div></div></aside><section class="auth-main"><div class="auth-card"><span class="eyebrow">Setup required</span><h2>Connect Supabase</h2><p>Open <strong>config.js</strong>, replace the two placeholder values, save and commit the file.</p><div class="settings-panel"><code style="white-space:pre-wrap;color:var(--text-soft);font-size:11px">supabaseUrl: "https://…supabase.co"\nsupabasePublishableKey: "sb_publishable_…"</code></div></div></section></main>`;
  }

  async function loadCurrentProfile() {
    if (!state.user) return;
    const { data, error } = await state.client
      .from("profiles")
      .select("id,username,display_name,avatar_url,bio,role,approved,created_at,updated_at,referred_by")
      .eq("id", state.user.id)
      .single();
    if (error) throw error;
    if (!data.approved) { await state.client.auth.signOut(); throw new Error("This account has been paused by the administrator."); }
    state.profile = data;
    state.profile.avatar_signed = data.avatar_url ? await signedUrl("avatars", data.avatar_url) : "";
  }

  function publicNav() {
    return `<nav class="public-nav container">${brand()}<div class="public-nav-links"><a href="#features">Features</a><a href="#how">How it works</a><button class="btn btn-subtle btn-sm" data-route="login">Sign in</button><button class="btn btn-primary btn-sm" data-route="signup">Create account</button></div></nav>`;
  }

  function renderLanding() {
    document.title = "My Mate Nasty — Social photos, not for social media.";
    return `<div class="page-shell">${publicNav()}<main>
      <section class="hero container"><div class="hero-copy"><span class="eyebrow">A more private kind of social</span><h1>The moments<br>that matter,<em>without the performance.</em></h1><p>My Mate Nasty is a refined social photo platform for the photographs that belong between real people — one shared feed, genuine reactions and none of the follower-count theatre.</p><div class="hero-actions"><button class="btn btn-primary btn-lg" data-route="signup">Join My Mate Nasty</button><button class="btn btn-subtle btn-lg" data-route="login">Member login</button></div><div class="hero-notes"><span>Verified accounts</span><span>Members-only feed</span><span>18+ launch</span></div></div>
      <div class="editorial-preview"><div class="preview-frame"><div class="preview-top">${brand(true)}<div class="search-pill">Search people</div><button class="btn btn-primary btn-sm">Post</button></div><div class="preview-layout"><aside class="preview-sidebar"><div class="mini-brand">${brand(true)} MMN</div><div class="preview-nav-item active">${icons.home} Feed</div><div class="preview-nav-item">${icons.search} Search</div><div class="preview-nav-item">${icons.bell} Activity</div><div class="preview-nav-item">${icons.user} Profile</div></aside><div class="preview-feed"><div class="preview-feed-title"><div><span class="eyebrow">Shared feed</span><h3>Latest photos</h3></div><span>Newest first</span></div><article class="demo-post"><div class="demo-post-head"><img src="assets/avatar-4.svg" alt=""><div><strong>Jess Smith</strong><small>Brighton · 18m</small></div><b>•••</b></div><img src="assets/demo-rooftop.svg" alt="Platform preview"><div class="demo-post-actions"><span>♡ 48</span><span>◯ 12</span><span>□</span></div><div class="demo-post-caption">One of those evenings that became a core memory.</div></article><div class="preview-grid"><div class="preview-tile"><img src="assets/demo-roadtrip.svg" alt=""><strong>No plan needed.</strong><span>31 likes</span></div><div class="preview-tile"><img src="assets/demo-surf.svg" alt=""><strong>Late surf.</strong><span>22 likes</span></div></div></div><aside class="preview-rail"><div class="mini-panel"><label>New people</label><div class="mini-avatars"><img src="assets/avatar-2.svg" alt=""><img src="assets/avatar-3.svg" alt=""><img src="assets/avatar-4.svg" alt=""></div></div><div class="mini-panel mini-invite"><strong>Send it to a mate.</strong><p>Share one link. They create an account and join the feed.</p><button>Copy invite link</button></div></aside></div></div><div class="phone-preview"><div class="phone-status"><span>9:41</span><span>•••</span></div><div class="phone-brand">${brand(true)} My Mate Nasty</div><div class="story-row"><div class="story-item"><img src="assets/avatar-2.svg"><span>Maya</span></div><div class="story-item"><img src="assets/avatar-3.svg"><span>Liam</span></div><div class="story-item"><img src="assets/avatar-4.svg"><span>Jess</span></div><div class="story-item"><img src="assets/avatar-1.svg"><span>You</span></div></div><div class="phone-post"><div class="demo-post-head"><img src="assets/avatar-2.svg"><div><strong>Maya Lee</strong><small>Newquay · 1d</small></div></div><img src="assets/demo-surf.svg" alt=""></div><div class="phone-bottom"><span>⌂</span><span>⌕</span><span class="plus">+</span><span>♡</span><span>◎</span></div></div></div></section>
      <section id="features" class="public-section container"><div class="section-header"><div><span class="eyebrow">Designed to feel effortless</span><h2>Social media, with an <em>editorial edge.</em></h2></div><p>A calm, image-led interface that makes the photography the main event. No follower chasing, no complicated groups and no unnecessary clutter.</p></div><div class="feature-grid"><article class="feature-card"><span class="feature-index">01</span><h3>One shared feed</h3><p>Every member posts into the same chronological feed, making the platform immediate and easy to understand.</p></article><article class="feature-card"><span class="feature-index">02</span><h3>Up to ten photos</h3><p>Tell the whole story in a single post with automatic image resizing and stripped location metadata.</p></article><article class="feature-card"><span class="feature-index">03</span><h3>Likes and comments</h3><p>A simple heart and clean comment experience. Nothing designed to distract from the photos.</p></article><article class="feature-card"><span class="feature-index">04</span><h3>Profiles, not popularity</h3><p>Profile photo, name, username, short bio and a grid of uploads — without follower counts.</p></article></div></section>
      <section id="how" class="container public-cta"><h2>Upload it.<br><em>Let your mates explain.</em></h2><button class="btn btn-lg" data-route="signup">Create an account</button></section>
      </main><footer class="public-footer container">${brand()}<span><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a> · <a href="community.html">Community rules</a></span></footer></div>`;
  }

  function renderAuth(mode) {
    const signup = mode === "signup";
    document.title = `${signup ? "Create account" : "Sign in"} — My Mate Nasty`;
    return `<main class="auth-page"><aside class="auth-aside">${brand()}<div><h1>${signup ? "Join the feed." : "Back to the"}<br><em>${signup ? "Bring the photos." : "good stuff."}</em></h1><p>${signup ? "Create a profile, verify your email and join one shared community feed." : "Sign in to view the latest uploads, comments and photos from the community."}</p></div><div class="auth-art"><div class="auth-quote">“A good photo deserves a questionable comment section.”</div></div></aside><section class="auth-main"><div class="auth-card"><button class="btn btn-subtle btn-sm" data-route="landing" style="margin-bottom:28px">← Back</button><h2>${signup ? "Create account" : "Welcome back"}</h2><p>${signup ? "Anyone aged 18 or over can join. Your email stays private." : "Enter your details to open the shared feed."}</p><form id="auth-form" class="form-grid" data-form="${signup ? "signup" : "login"}">${signup ? `<div class="form-row"><div class="field"><label>Display name</label><input class="input" name="display_name" required minlength="2" maxlength="50" placeholder="Michael Bruford"></div><div class="field"><label>Username</label><input class="input" name="username" required minlength="3" maxlength="24" pattern="[a-z0-9_]+" placeholder="michaelb"></div></div>` : ""}<div class="field"><label>Email address</label><input class="input" type="email" name="email" required autocomplete="email" placeholder="you@example.com"></div><div class="field"><label>Password</label><input class="input" type="password" name="password" required minlength="8" autocomplete="${signup ? "new-password" : "current-password"}" placeholder="At least 8 characters"></div>${signup ? `<div class="field"><label>About you <span style="color:var(--muted);font-weight:400">(optional)</span></label><textarea class="textarea" name="bio" maxlength="280" placeholder="One or two sentences about you."></textarea></div><label class="comments-toggle"><div><strong>I confirm I am 18 or over</strong><span>My Mate Nasty is launching as an adults-only platform.</span></div><input type="checkbox" name="is_adult" required></label>` : `<button type="button" class="btn btn-subtle btn-sm" data-action="forgot-password">Forgot password?</button>`}<button class="btn btn-primary btn-lg" type="submit">${signup ? "Create account" : "Sign in"}</button></form><div class="auth-switch">${signup ? "Already have an account?" : "New here?"} <button data-route="${signup ? "login" : "signup"}">${signup ? "Sign in" : "Create account"}</button></div>${signup ? `<p class="terms-note">By creating an account, you agree to the <a href="terms.html">terms</a> and confirm you have permission to share anything you upload.</p>` : ""}</div></section></main>`;
  }

  function sidebar(active) {
    const nav = [["feed", icons.home, "Feed"], ["search", icons.search, "Search"], ["notifications", icons.bell, "Activity"], [`profile/${state.profile?.username || ""}`, icons.user, "Profile"], ["settings", icons.settings, "Settings"]];
    if (state.profile?.role === "admin") nav.push(["admin", icons.shield, "Admin"]);
    return `<aside class="app-sidebar">${brand()}<nav class="app-nav">${nav.map(([route, icon, label]) => `<button class="nav-link ${active === route.split("/")[0] ? "active" : ""}" data-route="${route}">${icon}<span>${label}</span>${route === "notifications" && unreadCount() ? `<b class="nav-count">${unreadCount()}</b>` : ""}</button>`).join("")}</nav><button class="btn btn-primary sidebar-create" data-action="open-create">${icons.plus}<span>Create post</span></button><div class="sidebar-user">${avatar(state.profile?.avatar_signed, state.profile?.display_name || "Member")}<div><strong>${escapeHTML(state.profile?.display_name || "Member")}</strong><span>@${escapeHTML(state.profile?.username || "member")}</span></div><button class="btn btn-icon btn-sm" data-action="logout" aria-label="Sign out">${icons.logout}</button></div></aside>`;
  }

  function appHeader(title, subtitle = "") {
    return `<header class="app-header"><div class="app-header-title"><strong>${escapeHTML(title)}</strong><span>${escapeHTML(subtitle)}</span></div><form class="search-box" data-form="header-search">${icons.search}<input name="q" placeholder="Search people" aria-label="Search people"></form><div class="header-actions"><button class="btn btn-icon" data-action="open-invite" aria-label="Invite a mate">${icons.share}</button><button class="btn btn-icon" data-route="notifications" aria-label="Notifications">${icons.bell}</button><button class="btn btn-accent btn-sm" data-action="open-create">${icons.plus} Post</button></div></header>`;
  }

  function mobileTabs() {
    const tabs = [["feed", icons.home], ["search", icons.search], ["create", icons.plus], ["notifications", icons.bell], [`profile/${state.profile?.username || ""}`, icons.user]];
    return `<nav class="mobile-tabbar">${tabs.map(([route, icon]) => `<button class="mobile-tab ${route === "create" ? "create" : ""} ${state.route === route.split("/")[0] ? "active" : ""}" ${route === "create" ? `data-action="open-create"` : `data-route="${route}"`}>${icon}</button>`).join("")}</nav>`;
  }

  function appShell(page, active = state.route) {
    return `<div class="app-shell">${sidebar(active)}<main class="app-main">${page}${mobileTabs()}</main></div>`;
  }

  function unreadCount() {
    return state.notifications.filter(n => !n.read_at).length;
  }

  async function renderRoute() {
    const { name, parts } = parseRoute();
    state.route = name;
    state.routeParts = parts;

    if (isProtected(name) && !state.session) {
      navigate("login");
      return;
    }

    try {
      if (name === "landing") app.innerHTML = renderLanding();
      else if (name === "login" || name === "signup") app.innerHTML = renderAuth(name);
      else if (name === "feed") await renderFeed();
      else if (name === "search") await renderSearch();
      else if (name === "notifications") await renderNotifications();
      else if (name === "profile") await renderProfile(parts[0] || state.profile?.username);
      else if (name === "settings") renderSettings();
      else if (name === "admin") await renderAdmin();
      else navigate(state.session ? "feed" : "landing");
    } catch (error) {
      console.error(error);
      app.innerHTML = `<main class="auth-page"><section class="auth-main"><div class="auth-card"><span class="eyebrow">Something went wrong</span><h2>The page could not load.</h2><p>${escapeHTML(error.message || "Please try again.")}</p><button class="btn btn-primary" data-route="${state.session ? "feed" : "landing"}">Try again</button></div></section></main>`;
    }
  }

  async function loadFeed() {
    const { data, error } = await state.client.rpc("get_feed", { limit_count: 30, offset_count: 0 });
    if (error) throw error;
    state.feed = await hydratePosts(data || []);
    state.feedMap = new Map(state.feed.map(p => [String(p.id), p]));
  }

  async function hydratePosts(posts) {
    const mediaPaths = [...new Set(posts.flatMap(p => p.media_paths || []).filter(Boolean))];
    const avatarPaths = [...new Set(posts.map(p => p.author_avatar).filter(Boolean))];
    const [mediaMap, avatarMap] = await Promise.all([signedUrls("post-media", mediaPaths), signedUrls("avatars", avatarPaths)]);
    return posts.map(post => ({
      ...post,
      media_urls: (post.media_paths || []).map(path => mediaMap.get(path) || ""),
      author_avatar_signed: avatarMap.get(post.author_avatar) || ""
    }));
  }

  async function loadNewPeople() {
    const { data, error } = await state.client
      .from("profiles")
      .select("id,username,display_name,avatar_url,bio,created_at")
      .eq("approved", true)
      .neq("id", state.user.id)
      .order("created_at", { ascending: false })
      .limit(4);
    if (error) return [];
    const avatarMap = await signedUrls("avatars", (data || []).map(x => x.avatar_url).filter(Boolean));
    return (data || []).map(x => ({ ...x, avatar_signed: avatarMap.get(x.avatar_url) || "" }));
  }

  async function renderFeed() {
    app.innerHTML = appShell(`${appHeader("Shared feed", "Newest photos from everyone")}<div class="app-content"><div class="empty-state"><h3>Loading the feed…</h3><p>Preparing the latest photographs.</p></div></div>`, "feed");
    await Promise.all([loadFeed(), loadNotificationsQuietly()]);
    state.newPeople = await loadNewPeople();
    const posts = state.feed.length ? state.feed.map(postCard).join("") : `<div class="empty-state"><h3>The feed is ready.</h3><p>Be the first person to upload something worth commenting on.</p><button class="btn btn-primary" data-action="open-create">Create the first post</button></div>`;
    const railPeople = state.newPeople.length ? state.newPeople.map(p => `<div class="person-row">${avatar(p.avatar_signed, p.display_name)}<div><strong>${escapeHTML(p.display_name)}</strong><span>@${escapeHTML(p.username)}</span></div><button class="btn btn-sm" data-route="profile/${encodeURIComponent(p.username)}">View</button></div>`).join("") : `<p>No other members yet.</p>`;
    const page = `${appHeader("Shared feed", "Newest photos from everyone")}<div class="app-content"><div class="feed-layout"><section class="feed-column"><div class="feed-intro"><div><h1>Latest</h1><p>One feed. No followers. Newest first.</p></div><button class="feed-filter">Newest first</button></div>${posts}</section><aside class="feed-rail"><div class="rail-card"><h3>New people</h3><div class="people-list">${railPeople}</div></div><div class="rail-card invite-rail"><h3>Got a mate missing from the comments?</h3><p>Share your personal link. They can create an account in under a minute.</p><button class="btn btn-sm" data-action="open-invite">Invite a mate</button></div></aside></div></div>`;
    app.innerHTML = appShell(page, "feed");
  }

  function postCard(post) {
    const index = state.carousel.get(String(post.id)) || 0;
    const images = post.media_urls || [];
    const current = images[index] || "assets/demo-rooftop.svg";
    const hasMultiple = images.length > 1;
    const dots = hasMultiple ? `<span class="media-count">${index + 1} / ${images.length}</span><div class="media-dots">${images.map((_, i) => `<i class="${i === index ? "active" : ""}"></i>`).join("")}</div><button class="carousel-control prev" data-action="carousel-prev" data-id="${post.id}" aria-label="Previous photo">${icons.arrowLeft}</button><button class="carousel-control next" data-action="carousel-next" data-id="${post.id}" aria-label="Next photo">${icons.arrowRight}</button>` : "";
    return `<article class="post-card" data-post-id="${post.id}"><div class="post-header">${avatar(post.author_avatar_signed, post.author_name)}<button class="post-author text-link" data-route="profile/${encodeURIComponent(post.author_username)}"><strong>${escapeHTML(post.author_name)}</strong><span>@${escapeHTML(post.author_username)} · ${formatTime(post.created_at)}</span></button><button class="btn btn-icon btn-sm post-menu" data-action="post-menu" data-id="${post.id}" aria-label="Post options">${icons.more}</button></div>${post.caption ? `<div class="post-caption">${escapeHTML(post.caption)}${post.location ? `<span class="post-location">${icons.pin}${escapeHTML(post.location)}</span>` : ""}</div>` : post.location ? `<div class="post-caption"><span class="post-location">${icons.pin}${escapeHTML(post.location)}</span></div>` : ""}<div class="post-media" data-carousel="${post.id}"><img src="${escapeHTML(current)}" alt="Photo posted by ${escapeHTML(post.author_name)}">${dots}</div><div class="post-toolbar"><button class="action-btn ${post.liked_by_me ? "liked" : ""}" data-action="like" data-id="${post.id}">${icons.heart}<span data-like-count>${Number(post.like_count || 0)}</span></button>${post.comments_enabled ? `<button class="action-btn" data-action="comments" data-id="${post.id}">${icons.comment}<span data-comment-count>${Number(post.comment_count || 0)}</span></button>` : ""}<button class="action-btn save" aria-label="Save for later">${icons.bookmark}</button></div><div class="post-summary"><strong>${Number(post.like_count || 0)} ${Number(post.like_count || 0) === 1 ? "like" : "likes"}</strong>${post.comments_enabled ? `<button data-action="comments" data-id="${post.id}">${post.comment_count ? `View ${post.comment_count} ${Number(post.comment_count) === 1 ? "comment" : "comments"}` : "Be the first to comment"}</button>` : `<p>Comments are switched off for this post.</p>`}</div></article>`;
  }

  async function renderProfile(username) {
    const target = String(username || "").toLowerCase();
    app.innerHTML = appShell(`${appHeader("Profile", "Member profile and uploaded photos")}<div class="app-content"><div class="empty-state"><h3>Loading profile…</h3></div></div>`, "profile");
    const { data: profileRows, error: profileError } = await state.client.rpc("get_profile_summary", { target_username: target });
    if (profileError) throw profileError;
    const profile = profileRows?.[0];
    if (!profile) {
      app.innerHTML = appShell(`${appHeader("Profile")}<div class="app-content"><div class="empty-state"><h3>Profile not found.</h3><p>This member may no longer be available.</p></div></div>`, "profile");
      return;
    }
    const { data: posts, error: postsError } = await state.client.rpc("get_profile_posts", { target_username: target, limit_count: 60, offset_count: 0 });
    if (postsError) throw postsError;
    const hydrated = await hydratePosts(posts || []);
    hydrated.forEach(p => state.feedMap.set(String(p.id), p));
    const avatarUrl = profile.avatar_url ? await signedUrl("avatars", profile.avatar_url) : "";
    const own = profile.id === state.user.id;
    const photos = hydrated.map(p => ({ post: p, url: p.media_urls?.[0] })).filter(x => x.url);
    const grid = photos.length ? photos.map(({ post, url }) => `<button class="grid-tile" data-action="photo-detail" data-id="${post.id}"><img src="${escapeHTML(url)}" alt="${escapeHTML(post.caption || "Uploaded photo")}"><span class="grid-overlay">♥ ${Number(post.like_count || 0)} &nbsp; ◯ ${Number(post.comment_count || 0)}</span></button>`).join("") : `<div class="empty-state" style="grid-column:1/-1"><h3>No uploads yet.</h3><p>${own ? "Create your first post to begin your profile grid." : "This member has not posted yet."}</p></div>`;
    const page = `${appHeader("Profile", `@${profile.username}`)}<div class="profile-hero"><div class="app-content" style="padding-top:0;padding-bottom:0"><div class="profile-head">${avatar(avatarUrl, profile.display_name, "profile-avatar")}<div class="profile-copy"><h1>${escapeHTML(profile.display_name)}</h1><div class="username">@${escapeHTML(profile.username)}</div><p class="bio">${escapeHTML(profile.bio || "No bio yet.")}</p><div class="profile-stats"><div><strong>${hydrated.length}</strong><span>Posts</span></div><div><strong>${formatJoined(profile.created_at)}</strong><span>Joined</span></div></div></div><div class="profile-actions">${own ? `<button class="btn btn-subtle" data-action="edit-profile">${icons.edit} Edit profile</button>` : ""}<button class="btn btn-icon" data-action="share-profile" data-username="${escapeHTML(profile.username)}">${icons.share}</button></div></div></div></div><div class="app-content" style="padding-top:0"><div class="profile-grid-title"><h2>Uploaded photos</h2><span style="color:var(--muted);font-size:9px">Newest first</span></div><div class="photo-grid">${grid}</div></div>`;
    app.innerHTML = appShell(page, "profile");
  }

  async function renderSearch() {
    const query = state.searchQuery;
    let resultsHTML = `<div class="empty-state"><h3>Search for people.</h3><p>Find a member by display name or username.</p></div>`;
    if (query) {
      const { data, error } = await state.client.rpc("search_profiles", { search_term: query });
      if (error) throw error;
      const avatarMap = await signedUrls("avatars", (data || []).map(x => x.avatar_url).filter(Boolean));
      state.searchResults = (data || []).map(x => ({ ...x, avatar_signed: avatarMap.get(x.avatar_url) || "" }));
      resultsHTML = state.searchResults.length ? `<div class="notification-list">${state.searchResults.map(p => `<button class="notification result-button" data-route="profile/${encodeURIComponent(p.username)}">${avatar(p.avatar_signed, p.display_name)}<div class="notification-copy"><strong>${escapeHTML(p.display_name)}</strong><span>@${escapeHTML(p.username)}${p.bio ? ` · ${escapeHTML(p.bio)}` : ""}</span></div></button>`).join("")}</div>` : `<div class="empty-state"><h3>No results.</h3><p>Try another name or username.</p></div>`;
    }
    const page = `${appHeader("Search", "Find people by name or username")}<div class="app-content simple-page"><div class="simple-heading"><div><h1>Search</h1><p>Profiles are visible only to signed-in members.</p></div></div><form class="search-page-form" data-form="search"><div class="search-box" style="display:flex;width:100%;max-width:none"><span>${icons.search}</span><input name="q" value="${escapeHTML(query)}" placeholder="Search people" autofocus><button class="btn btn-primary btn-sm">Search</button></div></form><div style="margin-top:22px">${resultsHTML}</div></div>`;
    app.innerHTML = appShell(page, "search");
  }

  async function loadNotificationsQuietly() {
    if (!state.client || !state.user) return;
    const { data, error } = await state.client.rpc("get_notifications", { limit_count: 50 });
    if (error) return;
    const avatarMap = await signedUrls("avatars", (data || []).map(x => x.actor_avatar).filter(Boolean));
    state.notifications = (data || []).map(x => ({ ...x, actor_avatar_signed: avatarMap.get(x.actor_avatar) || "" }));
  }

  async function renderNotifications() {
    await loadNotificationsQuietly();
    const items = state.notifications.length ? state.notifications.map(n => {
      const verb = n.kind === "like" ? "liked your post" : n.kind === "comment" ? "commented on your post" : "sent an update";
      return `<button class="notification ${n.read_at ? "" : "unread"}" data-action="notification-open" data-id="${n.post_id || ""}">${avatar(n.actor_avatar_signed, n.actor_name || "Member")}<div class="notification-copy"><strong>${escapeHTML(n.actor_name || "My Mate Nasty")}</strong> <span>${verb}</span></div><span class="notification-time">${formatTime(n.created_at)}</span></button>`;
    }).join("") : `<div class="empty-state"><h3>All quiet.</h3><p>Likes and comments on your posts will appear here.</p></div>`;
    const page = `${appHeader("Activity", "Likes, comments and account updates")}<div class="app-content simple-page"><div class="simple-heading"><div><h1>Activity</h1><p>What has happened since your last visit.</p></div>${state.notifications.length ? `<button class="btn btn-sm" data-action="mark-read">Mark all read</button>` : ""}</div>${state.notifications.length ? `<div class="notification-list">${items}</div>` : items}</div>`;
    app.innerHTML = appShell(page, "notifications");
  }

  function renderSettings() {
    const tabs = [["appearance", "Appearance"], ["profile", "Profile"], ["privacy", "Privacy"], ["account", "Account"]];
    const page = `${appHeader("Settings", "Profile, appearance and account security")}<div class="app-content simple-page" style="max-width:900px"><div class="simple-heading"><div><h1>Settings</h1><p>Make the platform feel like yours.</p></div></div><div class="settings-layout"><nav class="settings-menu">${tabs.map(([id, label]) => `<button class="settings-tab ${state.settingsTab === id ? "active" : ""}" data-settings-tab="${id}">${label}</button>`).join("")}</nav><section class="settings-panel">${settingsPanel()}</section></div></div>`;
    app.innerHTML = appShell(page, "settings");
  }

  function settingsPanel() {
    if (state.settingsTab === "appearance") return `<h2>Appearance</h2><p>Choose the dark editorial palette you prefer. This is stored on your device.</p><div class="theme-grid">${[["ink", "Ink", "Neutral and editorial"], ["slate", "Slate", "Cool and refined"], ["warm", "Warm", "Soft and cinematic"]].map(([id, title, desc]) => `<button class="theme-card ${state.theme === id ? "active" : ""}" data-theme-choice="${id}"><span class="theme-swatch ${id}"></span><strong>${title}</strong><span>${desc}</span></button>`).join("")}</div>`;
    if (state.settingsTab === "profile") return `<h2>Profile</h2><p>Update the information shown alongside your posts.</p><form class="form-grid" data-form="profile"><div class="profile-edit-avatar">${avatar(state.profile.avatar_signed, state.profile.display_name, "profile-avatar")}<label class="btn btn-sm">Choose photo<input class="sr-only" name="avatar" type="file" accept="image/jpeg,image/png,image/webp"></label></div><div class="form-row"><div class="field"><label>Display name</label><input class="input" name="display_name" minlength="2" maxlength="50" required value="${escapeHTML(state.profile.display_name)}"></div><div class="field"><label>Username</label><input class="input" name="username" minlength="3" maxlength="24" pattern="[a-z0-9_]+" required value="${escapeHTML(state.profile.username)}"></div></div><div class="field"><label>About you</label><textarea class="textarea" name="bio" maxlength="280">${escapeHTML(state.profile.bio || "")}</textarea></div><div><button class="btn btn-primary">Save profile</button></div></form>`;
    if (state.settingsTab === "privacy") return `<h2>Privacy</h2><p>Your email address is private. Your profile and uploads are visible only to signed-in, approved members.</p><div class="toggle-row"><div><strong>Image metadata</strong><span>Uploads are resized and re-encoded in your browser, removing ordinary EXIF location and device metadata.</span></div><button class="switch on" disabled><i></i></button></div><div class="toggle-row"><div><strong>Private storage</strong><span>Photographs are kept in private Supabase buckets and displayed using expiring signed links.</span></div><button class="switch on" disabled><i></i></button></div>`;
    return `<h2>Account</h2><p>Manage authentication and access.</p><div class="toggle-row"><div><strong>Email address</strong><span>${escapeHTML(state.user?.email || "")}</span></div></div><div class="toggle-row"><div><strong>Password</strong><span>Send a secure reset email or update it while signed in.</span></div><button class="btn btn-sm" data-action="change-password">Change</button></div><div class="toggle-row"><div><strong>Sign out</strong><span>End this session on this device.</span></div><button class="btn btn-sm" data-action="logout">Sign out</button></div>`;
  }

  async function renderAdmin() {
    if (state.profile?.role !== "admin") {
      navigate("feed");
      return;
    }
    const [{ data: members, error: membersError }, { data: reports, error: reportsError }] = await Promise.all([
      state.client.rpc("admin_get_members"),
      state.client.rpc("admin_get_reports")
    ]);
    if (membersError) throw membersError;
    if (reportsError) throw reportsError;
    const reportRows = reports?.length ? reports.map(r => `<div class="notification"><div class="notification-copy"><strong>@${escapeHTML(r.reporter_username)}</strong><span>${escapeHTML(r.reason)}</span><small>${formatTime(r.created_at)} · ${escapeHTML(r.status)}</small></div>${r.status !== "resolved" ? `<button class="btn btn-sm" data-action="resolve-report" data-id="${r.id}">Resolve</button>` : ""}</div>`).join("") : `<div class="empty-state"><h3>No reports.</h3></div>`;
    const memberRows = members?.length ? members.map(m => `<div class="notification"><span class="avatar avatar-fallback">${escapeHTML(initials(m.display_name))}</span><div class="notification-copy"><strong>${escapeHTML(m.display_name)}</strong><span>@${escapeHTML(m.username)} · ${escapeHTML(m.role)}</span></div><button class="btn btn-sm ${m.approved ? "btn-danger" : ""}" data-action="member-status" data-id="${m.id}" data-approved="${m.approved}">${m.approved ? "Pause" : "Restore"}</button></div>`).join("") : "";
    const page = `${appHeader("Admin", "Reports and member access")}<div class="app-content simple-page" style="max-width:940px"><div class="simple-heading"><div><h1>Admin</h1><p>Moderation tools for the platform owner.</p></div></div><div class="settings-panel"><h2>Open reports</h2><div class="notification-list">${reportRows}</div></div><div class="settings-panel" style="margin-top:20px"><h2>Members</h2><div class="notification-list">${memberRows}</div></div></div>`;
    app.innerHTML = appShell(page, "admin");
  }

  function openCreate() {
    state.pendingFiles.forEach(x => URL.revokeObjectURL(x.preview));
    state.pendingFiles = [];
    openOverlay(`<header class="modal-header"><h2>Create a post</h2><button class="btn btn-icon btn-sm" data-action="close-overlay">${icons.close}</button></header><form class="modal-body" data-form="create-post"><div class="upload-drop" id="upload-drop"><div><div class="upload-icon">${icons.upload}</div><h3>Add up to 10 photos</h3><p>JPEG, PNG and WebP. Photos are resized and metadata is removed before upload.</p><label class="btn btn-primary">Choose photos<input id="post-files" class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple></label></div></div><div id="upload-previews" class="upload-previews"></div><div class="create-fields"><div class="field"><label>Caption</label><textarea class="textarea" name="caption" maxlength="1200" placeholder="What happened?"></textarea></div><div class="field"><label>Location <span style="color:var(--muted);font-weight:400">(optional)</span></label><input class="input" name="location" maxlength="100" placeholder="Add a location"></div><div class="comments-toggle"><div><strong>Allow comments</strong><span>You can turn comments off for this post.</span></div><button class="switch on" type="button" data-action="toggle-comments"><i></i></button><input type="hidden" name="comments_enabled" value="true"></div></div><div class="progress-bar" id="upload-progress" hidden><span></span></div><div class="modal-footer"><button class="btn" type="button" data-action="close-overlay">Cancel</button><button class="btn btn-primary" type="submit">Publish post</button></div></form>`);
    const drop = document.getElementById("upload-drop");
    ["dragenter", "dragover"].forEach(name => drop.addEventListener(name, e => { e.preventDefault(); drop.classList.add("dragover"); }));
    ["dragleave", "drop"].forEach(name => drop.addEventListener(name, e => { e.preventDefault(); drop.classList.remove("dragover"); }));
    drop.addEventListener("drop", e => addFiles([...e.dataTransfer.files]));
  }

  function addFiles(files) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    for (const file of files) {
      if (state.pendingFiles.length >= 10) break;
      if (!allowed.includes(file.type)) { showToast(`${file.name} is not supported.`, "error"); continue; }
      if (file.size > 25 * 1024 * 1024) { showToast(`${file.name} is larger than 25 MB.`, "error"); continue; }
      state.pendingFiles.push({ file, preview: URL.createObjectURL(file) });
    }
    renderFilePreviews();
  }

  function renderFilePreviews() {
    const node = document.getElementById("upload-previews");
    if (!node) return;
    node.innerHTML = state.pendingFiles.map((x, i) => `<div class="upload-preview"><img src="${x.preview}" alt="Selected photo ${i + 1}"><button type="button" data-action="remove-file" data-index="${i}">×</button></div>`).join("");
  }

  function openComments(postId) {
    state.activePost = state.feedMap.get(String(postId));
    openOverlay(`<header class="drawer-header"><h2>Comments</h2><button class="btn btn-icon btn-sm" data-action="close-overlay">${icons.close}</button></header><div id="comments-container" class="comments-list"><div class="empty-state"><h3>Loading comments…</h3></div></div>`, "drawer");
    loadComments(postId);
  }

  async function loadComments(postId) {
    const node = document.getElementById("comments-container");
    if (!node) return;
    const { data, error } = await state.client.rpc("get_post_comments", { target_post_id: postId });
    if (error) { node.innerHTML = `<div class="empty-state"><h3>Comments unavailable.</h3><p>${escapeHTML(error.message)}</p></div>`; return; }
    const avatarMap = await signedUrls("avatars", (data || []).map(x => x.author_avatar).filter(Boolean));
    const rows = (data || []).map(x => ({ ...x, avatar_signed: avatarMap.get(x.author_avatar) || "" }));
    const canComment = state.activePost?.comments_enabled !== false;
    node.innerHTML = `${rows.length ? rows.map(c => `<div class="comment">${avatar(c.avatar_signed, c.author_name)}<div><div class="comment-body"><strong>${escapeHTML(c.author_name)}</strong> ${escapeHTML(c.body)}</div><div class="comment-meta"><span>${formatTime(c.created_at)}</span>${c.author_id === state.user.id || state.profile.role === "admin" ? `<button class="text-link" data-action="delete-comment" data-id="${c.id}" data-post="${postId}">Delete</button>` : ""}</div></div></div>`).join("") : `<div class="empty-state"><h3>No comments yet.</h3><p>${canComment ? "Be the first to say something." : "Comments are switched off."}</p></div>`}${canComment ? `<form class="comment-compose" data-form="comment"><input type="hidden" name="post_id" value="${postId}"><input class="input" name="body" maxlength="600" required placeholder="Add a comment…"><button class="btn btn-primary btn-sm">Post</button></form>` : ""}`;
  }

  function openInvite() {
    const link = `${currentOrigin()}/?ref=${encodeURIComponent(state.profile.username)}#signup`;
    openOverlay(`<header class="modal-header"><h2>Invite a mate</h2><button class="btn btn-icon btn-sm" data-action="close-overlay">${icons.close}</button></header><div class="modal-body"><span class="eyebrow">Open registration</span><h2 style="font-size:34px;letter-spacing:-.05em;margin:17px 0 10px">Send the link.<br>Let them explain themselves.</h2><p style="color:var(--muted);font-size:11px;line-height:1.65">Anyone aged 18 or over can create an account. Your link records who referred them.</p><div class="invite-link"><code>${escapeHTML(link)}</code><button class="btn btn-sm" data-action="copy-invite" data-link="${escapeHTML(link)}">Copy</button></div><div class="invite-options"><button class="invite-option" data-action="copy-invite" data-link="${escapeHTML(link)}">${icons.share}<strong>Copy link</strong><span>Paste it anywhere.</span></button><button class="invite-option" data-action="native-share" data-link="${escapeHTML(link)}">${icons.mail}<strong>Share</strong><span>Use your device share menu.</span></button></div></div>`);
  }

  function openPostMenu(postId) {
    const post = state.feedMap.get(String(postId));
    const own = post?.author_id === state.user.id;
    const admin = state.profile?.role === "admin";
    openOverlay(`<header class="modal-header"><h2>Post options</h2><button class="btn btn-icon btn-sm" data-action="close-overlay">${icons.close}</button></header><div class="modal-body form-grid"><button class="btn" data-action="copy-post" data-id="${postId}">${icons.share} Copy link</button>${own || admin ? `<button class="btn btn-danger" data-action="delete-post" data-id="${postId}">${icons.trash} Delete post</button>` : `<button class="btn btn-danger" data-action="report-post" data-id="${postId}">${icons.flag} Report post</button>`}</div>`);
  }

  function openReport(postId) {
    openOverlay(`<header class="modal-header"><h2>Report post</h2><button class="btn btn-icon btn-sm" data-action="close-overlay">${icons.close}</button></header><form class="modal-body form-grid" data-form="report"><input type="hidden" name="post_id" value="${postId}"><div class="field"><label>What is wrong with this post?</label><textarea class="textarea" name="reason" minlength="3" maxlength="500" required placeholder="Give enough detail for the administrator to review it."></textarea></div><div class="modal-footer"><button class="btn" type="button" data-action="close-overlay">Cancel</button><button class="btn btn-danger">Send report</button></div></form>`);
  }

  function openPhotoDetail(postId) {
    const post = state.feedMap.get(String(postId));
    if (!post) return;
    const images = post.media_urls || [];
    openOverlay(`<header class="modal-header"><h2>${escapeHTML(post.author_name)}</h2><button class="btn btn-icon btn-sm" data-action="close-overlay">${icons.close}</button></header><div class="modal-body"><div class="detail-media">${images.map(url => `<img src="${escapeHTML(url)}" alt="Uploaded photo">`).join("")}</div>${post.caption ? `<p style="line-height:1.7;color:var(--text-soft)">${escapeHTML(post.caption)}</p>` : ""}<div class="modal-footer"><button class="btn" data-action="comments" data-id="${post.id}">${icons.comment} Comments</button></div></div>`);
  }

  function openForgotPassword() {
    openOverlay(`<header class="modal-header"><h2>Reset password</h2><button class="btn btn-icon btn-sm" data-action="close-overlay">${icons.close}</button></header><form class="modal-body form-grid" data-form="forgot"><div class="field"><label>Email address</label><input class="input" type="email" name="email" required autocomplete="email"></div><div class="modal-footer"><button class="btn" type="button" data-action="close-overlay">Cancel</button><button class="btn btn-primary">Send reset email</button></div></form>`);
  }

  function openResetPassword() {
    openOverlay(`<header class="modal-header"><h2>Choose a new password</h2></header><form class="modal-body form-grid" data-form="reset-password"><div class="field"><label>New password</label><input class="input" type="password" name="password" minlength="8" required autocomplete="new-password"></div><div class="modal-footer"><button class="btn btn-primary">Update password</button></div></form>`);
  }

  async function handleSubmit(event) {
    const form = event.target.closest("[data-form]");
    if (!form) return;
    event.preventDefault();
    const type = form.dataset.form;
    const button = form.querySelector('button[type="submit"],button:not([type])');
    try {
      if (type === "login") await submitLogin(form, button);
      else if (type === "signup") await submitSignup(form, button);
      else if (type === "forgot") await submitForgot(form, button);
      else if (type === "reset-password") await submitResetPassword(form, button);
      else if (type === "create-post") await submitCreatePost(form, button);
      else if (type === "comment") await submitComment(form, button);
      else if (type === "search" || type === "header-search") await submitSearch(form);
      else if (type === "profile") await submitProfile(form, button);
      else if (type === "report") await submitReport(form, button);
    } catch (error) {
      console.error(error);
      showToast(cleanError(error), "error");
      setButtonBusy(button, false);
    }
  }

  async function submitLogin(form, button) {
    const data = Object.fromEntries(new FormData(form));
    setButtonBusy(button, true, "Signing in…");
    const { error } = await state.client.auth.signInWithPassword({ email: data.email, password: data.password });
    if (error) throw error;
    setButtonBusy(button, false);
  }

  async function submitSignup(form, button) {
    const data = Object.fromEntries(new FormData(form));
    const username = String(data.username || "").toLowerCase().trim();
    if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Use 3–24 lowercase letters, numbers or underscores for your username.");
    if (!data.is_adult) throw new Error("You must confirm that you are aged 18 or over.");
    setButtonBusy(button, true, "Checking username…");
    const { data: available, error: availabilityError } = await state.client.rpc("username_available", { candidate: username });
    if (availabilityError) throw availabilityError;
    if (!available) throw new Error("That username is already in use.");
    const referrer = new URLSearchParams(location.search).get("ref");
    setButtonBusy(button, true, "Creating account…");
    const { data: result, error } = await state.client.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${currentOrigin()}/#feed`,
        data: {
          username,
          display_name: String(data.display_name || "").trim(),
          bio: String(data.bio || "").trim(),
          is_adult: true,
          referrer_username: referrer || null
        }
      }
    });
    if (error) throw error;
    setButtonBusy(button, false);
    if (!result.session) {
      openOverlay(`<div class="modal-body"><span class="eyebrow">Email verification</span><h2 style="font-size:34px;letter-spacing:-.05em">Check your inbox.</h2><p style="color:var(--muted);line-height:1.7">We sent a verification link to <strong>${escapeHTML(data.email)}</strong>. Open it to activate your account, then return to the feed.</p><button class="btn btn-primary" style="width:100%" data-action="close-overlay">Done</button></div>`);
    }
  }

  async function submitForgot(form, button) {
    const email = new FormData(form).get("email");
    setButtonBusy(button, true, "Sending…");
    const { error } = await state.client.auth.resetPasswordForEmail(email, { redirectTo: `${currentOrigin()}/#reset-password` });
    if (error) throw error;
    closeOverlay();
    showToast("Password reset email sent.", "success");
  }

  async function submitResetPassword(form, button) {
    const password = new FormData(form).get("password");
    setButtonBusy(button, true, "Updating…");
    const { error } = await state.client.auth.updateUser({ password });
    if (error) throw error;
    closeOverlay();
    showToast("Password updated.", "success");
    navigate("settings");
  }

  async function submitCreatePost(form, button) {
    if (!state.pendingFiles.length) throw new Error("Choose at least one photo.");
    const data = new FormData(form);
    const caption = String(data.get("caption") || "").trim();
    const locationValue = String(data.get("location") || "").trim();
    const commentsEnabled = data.get("comments_enabled") === "true";
    setButtonBusy(button, true, "Creating post…");
    const progress = document.getElementById("upload-progress");
    if (progress) progress.hidden = false;

    const { data: post, error: postError } = await state.client
      .from("posts")
      .insert({ author_id: state.user.id, caption, location: locationValue || null, comments_enabled: commentsEnabled })
      .select("id")
      .single();
    if (postError) throw postError;

    const uploaded = [];
    try {
      for (let i = 0; i < state.pendingFiles.length; i += 1) {
        setButtonBusy(button, true, `Processing ${i + 1} of ${state.pendingFiles.length}…`);
        const processed = await compressImage(state.pendingFiles[i].file, 2400, 0.86);
        const path = `${state.user.id}/${post.id}/${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await state.client.storage.from("post-media").upload(path, processed.blob, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false });
        if (uploadError) throw uploadError;
        uploaded.push(path);
        const { error: mediaError } = await state.client.from("post_media").insert({ post_id: post.id, storage_path: path, sort_order: i, width: processed.width, height: processed.height });
        if (mediaError) throw mediaError;
        if (progress) progress.querySelector("span").style.width = `${Math.round(((i + 1) / state.pendingFiles.length) * 100)}%`;
      }
    } catch (error) {
      if (uploaded.length) await state.client.storage.from("post-media").remove(uploaded);
      await state.client.from("posts").delete().eq("id", post.id);
      throw error;
    }

    state.pendingFiles.forEach(x => URL.revokeObjectURL(x.preview));
    state.pendingFiles = [];
    closeOverlay();
    showToast("Your photos are live.", "success");
    await renderFeed();
  }

  async function submitComment(form, button) {
    const data = Object.fromEntries(new FormData(form));
    const body = String(data.body || "").trim();
    if (!body) return;
    setButtonBusy(button, true, "Posting…");
    const { error } = await state.client.from("comments").insert({ post_id: data.post_id, author_id: state.user.id, body });
    if (error) throw error;
    const post = state.feedMap.get(String(data.post_id));
    if (post) post.comment_count = Number(post.comment_count || 0) + 1;
    await loadComments(data.post_id);
  }

  async function submitSearch(form) {
    const query = String(new FormData(form).get("q") || "").trim();
    if (!query) return;
    state.searchQuery = query;
    navigate("search");
  }

  async function submitProfile(form, button) {
    const data = Object.fromEntries(new FormData(form));
    const username = String(data.username || "").toLowerCase().trim();
    if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Use 3–24 lowercase letters, numbers or underscores.");
    setButtonBusy(button, true, "Saving…");
    if (username !== state.profile.username) {
      const { data: available, error } = await state.client.rpc("username_available", { candidate: username });
      if (error) throw error;
      if (!available) throw new Error("That username is already in use.");
    }
    let avatarPath = state.profile.avatar_url || null;
    if (state.pendingAvatar) {
      const processed = await compressImage(state.pendingAvatar, 720, 0.88);
      avatarPath = `${state.user.id}/avatar.jpg`;
      const { error: uploadError } = await state.client.storage.from("avatars").upload(avatarPath, processed.blob, { contentType: "image/jpeg", cacheControl: "3600", upsert: true });
      if (uploadError) throw uploadError;
      state.signedCache.delete(`avatars:${avatarPath}`);
    }
    const { error } = await state.client.from("profiles").update({
      display_name: String(data.display_name || "").trim(),
      username,
      bio: String(data.bio || "").trim(),
      avatar_url: avatarPath,
      updated_at: new Date().toISOString()
    }).eq("id", state.user.id);
    if (error) throw error;
    state.pendingAvatar = null;
    await loadCurrentProfile();
    showToast("Profile updated.", "success");
    state.settingsTab = "profile";
    renderSettings();
  }

  async function submitReport(form, button) {
    const data = Object.fromEntries(new FormData(form));
    setButtonBusy(button, true, "Sending…");
    const { error } = await state.client.from("reports").insert({ reporter_id: state.user.id, post_id: data.post_id, reason: String(data.reason || "").trim() });
    if (error) throw error;
    closeOverlay();
    showToast("Report sent to the administrator.", "success");
  }

  async function handleClick(event) {
    const routeEl = event.target.closest("[data-route]");
    if (routeEl) {
      event.preventDefault();
      navigate(routeEl.dataset.route);
      return;
    }

    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === "close-overlay") {
      if (actionEl.classList.contains("overlay") || actionEl.classList.contains("drawer-overlay")) {
        if (event.target !== actionEl) return;
      }
      closeOverlay();
      return;
    }
    if (action === "forgot-password") { openForgotPassword(); return; }
    if (action === "open-create") { openCreate(); return; }
    if (action === "open-invite") { openInvite(); return; }
    if (action === "logout") {
      await state.client.auth.signOut();
      return;
    }
    if (action === "remove-file") {
      const index = Number(actionEl.dataset.index);
      const [removed] = state.pendingFiles.splice(index, 1);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      renderFilePreviews();
      return;
    }
    if (action === "toggle-comments") {
      actionEl.classList.toggle("on");
      const hidden = actionEl.parentElement.querySelector('input[name="comments_enabled"]');
      hidden.value = actionEl.classList.contains("on") ? "true" : "false";
      return;
    }
    if (action === "like") { await toggleLike(actionEl.dataset.id, actionEl); return; }
    if (action === "comments") { closeOverlay(); openComments(actionEl.dataset.id); return; }
    if (action === "post-menu") { openPostMenu(actionEl.dataset.id); return; }
    if (action === "report-post") { openReport(actionEl.dataset.id); return; }
    if (action === "delete-post") { await deletePost(actionEl.dataset.id); return; }
    if (action === "delete-comment") { await deleteComment(actionEl.dataset.id, actionEl.dataset.post); return; }
    if (action === "carousel-prev") { changeCarousel(actionEl.dataset.id, -1); return; }
    if (action === "carousel-next") { changeCarousel(actionEl.dataset.id, 1); return; }
    if (action === "copy-invite") { await copyText(actionEl.dataset.link, "Invite link copied."); return; }
    if (action === "native-share") {
      const link = actionEl.dataset.link;
      if (navigator.share) await navigator.share({ title: "Join My Mate Nasty", text: "Social photos, not for social media.", url: link });
      else await copyText(link, "Invite link copied.");
      return;
    }
    if (action === "copy-post") { await copyText(`${currentOrigin()}/#feed`, "Feed link copied."); closeOverlay(); return; }
    if (action === "share-profile") { await copyText(`${currentOrigin()}/#profile/${encodeURIComponent(actionEl.dataset.username)}`, "Profile link copied."); return; }
    if (action === "photo-detail") { openPhotoDetail(actionEl.dataset.id); return; }
    if (action === "notification-open") {
      const id = actionEl.dataset.id;
      if (id && state.feedMap.has(String(id))) openPhotoDetail(id);
      else navigate("feed");
      return;
    }
    if (action === "mark-read") {
      const ids = state.notifications.filter(n => !n.read_at).map(n => n.id);
      if (ids.length) {
        const { error } = await state.client.from("notifications").update({ read_at: new Date().toISOString() }).in("id", ids);
        if (error) showToast(error.message, "error");
        else { showToast("All activity marked as read.", "success"); await renderNotifications(); }
      }
      return;
    }
    if (action === "change-password") { openResetPassword(); return; }
    if (action === "resolve-report") {
      const { error } = await state.client.rpc("admin_resolve_report", { target_report_id: actionEl.dataset.id, new_status: "resolved" });
      if (error) showToast(error.message, "error"); else { showToast("Report resolved.", "success"); await renderAdmin(); }
      return;
    }
    if (action === "member-status") {
      const approved = actionEl.dataset.approved === "true";
      if (!confirm(`${approved ? "Pause" : "Restore"} this member's access?`)) return;
      const { error } = await state.client.rpc("admin_set_member_status", { target_user_id: actionEl.dataset.id, new_approved: !approved });
      if (error) showToast(error.message, "error"); else { showToast("Member status updated.", "success"); await renderAdmin(); }
      return;
    }
  }

  function handleChange(event) {
    if (event.target.id === "post-files") addFiles([...event.target.files]);
    if (event.target.name === "avatar" && event.target.files?.[0]) {
      state.pendingAvatar = event.target.files[0];
      const img = event.target.closest("form")?.querySelector(".profile-avatar");
      if (img?.tagName === "IMG") img.src = URL.createObjectURL(state.pendingAvatar);
    }
  }

  document.addEventListener("click", event => {
    const settingsTab = event.target.closest("[data-settings-tab]");
    if (settingsTab) {
      state.settingsTab = settingsTab.dataset.settingsTab;
      renderSettings();
      return;
    }
    const theme = event.target.closest("[data-theme-choice]");
    if (theme) {
      state.theme = theme.dataset.themeChoice;
      localStorage.setItem("mmn-theme", state.theme);
      document.documentElement.dataset.theme = state.theme;
      renderSettings();
      showToast(`${theme.querySelector("strong").textContent} theme selected.`, "success");
    }
  });

  async function toggleLike(postId, button) {
    const post = state.feedMap.get(String(postId));
    if (!post) return;
    button.disabled = true;
    const previous = Boolean(post.liked_by_me);
    try {
      post.liked_by_me = !previous;
      post.like_count = Math.max(0, Number(post.like_count || 0) + (post.liked_by_me ? 1 : -1));
      button.classList.toggle("liked", post.liked_by_me);
      button.querySelector("[data-like-count]").textContent = post.like_count;
      const card = button.closest(".post-card");
      const summary = card?.querySelector(".post-summary > strong");
      if (summary) summary.textContent = `${post.like_count} ${post.like_count === 1 ? "like" : "likes"}`;
      const { data, error } = await state.client.rpc("toggle_like", { target_post_id: postId });
      if (error) throw error;
      post.liked_by_me = Boolean(data);
    } catch (error) {
      post.liked_by_me = previous;
      post.like_count = Math.max(0, Number(post.like_count || 0) + (previous ? 1 : -1));
      button.classList.toggle("liked", previous);
      button.querySelector("[data-like-count]").textContent = post.like_count;
      showToast(error.message, "error");
    } finally {
      button.disabled = false;
    }
  }

  function changeCarousel(postId, direction) {
    const post = state.feedMap.get(String(postId));
    if (!post?.media_urls?.length) return;
    const current = state.carousel.get(String(postId)) || 0;
    const next = (current + direction + post.media_urls.length) % post.media_urls.length;
    state.carousel.set(String(postId), next);
    const frame = document.querySelector(`[data-carousel="${CSS.escape(String(postId))}"]`);
    if (!frame) return;
    frame.querySelector("img").src = post.media_urls[next];
    const count = frame.querySelector(".media-count");
    if (count) count.textContent = `${next + 1} / ${post.media_urls.length}`;
    frame.querySelectorAll(".media-dots i").forEach((dot, index) => dot.classList.toggle("active", index === next));
  }

  async function deleteComment(commentId, postId) {
    if (!confirm("Delete this comment?")) return;
    const { error } = await state.client.from("comments").delete().eq("id", commentId);
    if (error) { showToast(error.message, "error"); return; }
    const post = state.feedMap.get(String(postId));
    if (post) post.comment_count = Math.max(0, Number(post.comment_count || 0) - 1);
    await loadComments(postId);
  }

  async function deletePost(postId) {
    if (!confirm("Delete this post and all of its photos? This cannot be undone.")) return;
    const { data: media, error: mediaError } = await state.client.from("post_media").select("storage_path").eq("post_id", postId);
    if (mediaError) { showToast(mediaError.message, "error"); return; }
    const paths = (media || []).map(x => x.storage_path);
    if (paths.length) await state.client.storage.from("post-media").remove(paths);
    const { error } = await state.client.from("posts").delete().eq("id", postId);
    if (error) { showToast(error.message, "error"); return; }
    closeOverlay();
    showToast("Post deleted.", "success");
    await renderFeed();
  }

  async function signedUrls(bucket, paths) {
    const unique = [...new Set(paths.filter(Boolean))];
    const result = new Map();
    const missing = [];
    for (const path of unique) {
      if (/^(https?:|data:|blob:|assets\/)/.test(path)) { result.set(path, path); continue; }
      const cached = state.signedCache.get(`${bucket}:${path}`);
      if (cached && cached.expires > Date.now()) result.set(path, cached.url);
      else missing.push(path);
    }
    if (missing.length) {
      const { data, error } = await state.client.storage.from(bucket).createSignedUrls(missing, 3600);
      if (!error) {
        (data || []).forEach((item, index) => {
          const path = item.path || missing[index];
          if (item.signedUrl) {
            result.set(path, item.signedUrl);
            state.signedCache.set(`${bucket}:${path}`, { url: item.signedUrl, expires: Date.now() + 50 * 60 * 1000 });
          }
        });
      }
    }
    return result;
  }

  async function signedUrl(bucket, path) {
    if (!path) return "";
    const map = await signedUrls(bucket, [path]);
    return map.get(path) || "";
  }

  async function compressImage(file, maxDimension, quality) {
    let source;
    let objectUrl;
    try {
      source = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      objectUrl = URL.createObjectURL(file);
      source = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = objectUrl;
      });
    }
    const scale = Math.min(1, maxDimension / Math.max(source.width, source.height));
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(source, 0, 0, width, height);
    if (source.close) source.close();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) throw new Error("This image could not be processed.");
    return { blob, width, height };
  }

  async function copyText(text, message) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(message, "success");
    } catch {
      prompt("Copy this link:", text);
    }
  }

  function cleanError(error) {
    const message = String(error?.message || "Something went wrong.");
    if (message.includes("Invalid login credentials")) return "The email address or password is incorrect.";
    if (message.includes("Email not confirmed")) return "Please verify your email address before signing in.";
    if (message.includes("username_already_exists")) return "That username is already in use.";
    if (message.includes("adult_confirmation_required")) return "You must confirm that you are aged 18 or over.";
    return message;
  }

  init().catch(error => {
    console.error(error);
    app.innerHTML = `<main class="auth-page"><section class="auth-main"><div class="auth-card"><span class="eyebrow">Application error</span><h2>My Mate Nasty could not start.</h2><p>${escapeHTML(cleanError(error))}</p><button class="btn btn-primary" onclick="location.reload()">Refresh</button></div></section></main>`;
  });
})();
