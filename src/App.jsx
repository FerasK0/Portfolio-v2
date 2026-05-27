import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

/* ══════════════════════════════════════════════════════════════
   استيراد المحتوى من ملفات JSON (يُدار من لوحة التحكم)
══════════════════════════════════════════════════════════════ */
const projectFiles = import.meta.glob('./content/projects/*.json', { eager: true });
const postFiles    = import.meta.glob('./content/posts/*.json',    { eager: true });

const ALL_PROJECTS = Object.values(projectFiles)
  .map(m => m.default ?? m)
  .filter(p => p.published !== false)
  .sort((a, b) => Number(b.year) - Number(a.year));

const ALL_POSTS = Object.values(postFiles)
  .map(m => m.default ?? m)
  .filter(p => p.published !== false)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

/* ══════════════════════════════════════════════════════════════
   DATA الثابتة — عدّل هنا فقط
══════════════════════════════════════════════════════════════ */
const ME = {
  roles: ["إحصائي", "مونتير", "مطوّر"],
  bio: "أشتغل في المكان اللي تلتقي فيه البيانات مع الإبداع. أحلل الأرقام، وأحكي القصص، وأبني الأدوات.",
  email: "Feras.almalki00@gmail.com",
  socials: [
    { id: "li", label: "LinkedIn",  url: "https://www.linkedin.com/in/feras-al-malki-756360197" },
    { id: "gh", label: "GitHub",    url: "https://www.github.com/FerasK0" },
    { id: "tw", label: "Twitter",   url: "https://www.Twitter.com/dcwlx" },
    { id: "ig", label: "Instagram", url: "https://www.instagram.com/dcwlx" },
    { id: "tg", label: "Telegram",  url: "https://t.me/Fras1z" },
  ],
};

const FIELD_META = [
  { id: "academic", ar: "أكاديمي", en: "Academic & Research", tagline: "إحصاء وبيانات وأبحاث" },
  { id: "tech",     ar: "تقني",    en: "Technology",          tagline: "برمجة وأدوات وتطوير" },
  {
    id: "creative", ar: "إبداعي",  en: "Creative",            tagline: "مونتاج وحركة وإنتاج",
    clients: [
      { name: "مدفوع",               img: "https://ferask0.github.io/Portfolio/images/madfu.png" },
      { name: "هيئة الأمن السيبراني", img: "https://ferask0.github.io/Portfolio/images/NationalCybersecurityAuthority.png" },
      { name: "مثيلة",               img: "https://ferask0.github.io/Portfolio/images/Mothhelah.png" },
      { name: "Circlys",             img: "https://ferask0.github.io/Portfolio/images/Circlys.png" },
      { name: "RPT",                 img: "https://ferask0.github.io/Portfolio/images/RPT1.png" },
      { name: "SASO",                img: "https://ferask0.github.io/Portfolio/images/SaudiStandards.png" },
      { name: "Oil Sustainability",  img: "https://ferask0.github.io/Portfolio/images/OilSustainabilityProgram.png" },
      { name: "ولاء",                img: "https://ferask0.github.io/Portfolio/images/Walaa.png" },
      { name: "أليين",               img: "https://ferask0.github.io/Portfolio/images/aleen-logo-white.png" },
    ],
  },
];

/* دمج الميتا مع المشاريع من الملفات */
function buildFields() {
  return FIELD_META.map(meta => ({
    ...meta,
    projects: ALL_PROJECTS.filter(p => p.field === meta.id),
  }));
}

/* ══════════════════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#111010;--ink2:#3a3836;--ink3:#7a7774;
  --paper:#f5f2ed;--paper2:#edeae4;--paper3:#e2ddd6;
  --rule:rgba(0,0,0,0.1);--accent:#c8441a;
  --ff:'IBM Plex Sans Arabic',sans-serif;--fm:'IBM Plex Mono',monospace;
  --t:all 0.22s ease;
}
html{scroll-behavior:smooth}
body{font-family:var(--ff);background:var(--paper);color:var(--ink);direction:rtl;line-height:1.65;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:var(--ink3)}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:var(--paper);border-bottom:1px solid var(--rule)}
.nav-logo{font-family:var(--fm);font-size:1rem;font-weight:500;letter-spacing:-0.5px;color:var(--ink);cursor:pointer;text-decoration:none}
.nav-logo span{color:var(--accent)}
.nav-right{display:flex;align-items:center}
.nav-link{padding:8px 14px;font-size:0.82rem;color:var(--ink3);background:none;border:none;cursor:pointer;font-family:var(--ff);transition:color 0.18s;white-space:nowrap}
.nav-link:hover{color:var(--ink)}
.nav-divider{width:1px;height:18px;background:var(--rule)}
.hamburger{display:none;flex-direction:column;gap:4px;background:none;border:none;cursor:pointer;padding:6px}
.hamburger span{display:block;width:20px;height:1.5px;background:var(--ink)}
.mob-menu{display:none;position:fixed;top:56px;left:0;right:0;background:var(--paper);border-bottom:1px solid var(--rule);padding:0.5rem 0;z-index:199;flex-direction:column}
.mob-menu.open{display:flex}
.mob-link{padding:12px 2rem;font-size:0.9rem;color:var(--ink2);background:none;border:none;cursor:pointer;text-align:right;font-family:var(--ff);transition:color 0.18s}
.mob-link:hover{color:var(--ink)}

/* HERO */
.hero{padding:120px 2rem 80px;max-width:880px;margin:0 auto}
.hero-name{font-size:clamp(3.2rem,9vw,7rem);font-weight:600;line-height:1;letter-spacing:-2px;color:var(--ink);margin-bottom:1.5rem}
.hero-name em{font-style:normal;color:var(--accent)}
.hero-roles{display:flex;flex-wrap:wrap;border-top:1px solid var(--rule);padding-top:1.25rem;margin-bottom:2.5rem}
.hero-role{font-size:0.82rem;color:var(--ink3);padding:0 1.25rem;border-right:1px solid var(--rule)}
.hero-role:last-child{border-left:1px solid var(--rule)}
.hero-bio{font-size:clamp(1rem,2.5vw,1.2rem);color:var(--ink2);max-width:520px;line-height:1.75;margin-bottom:3rem;font-weight:300}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap}

/* BUTTONS */
.btn-ink{padding:10px 22px;background:var(--ink);color:var(--paper);border:1px solid var(--ink);border-radius:3px;font-size:0.85rem;font-family:var(--ff);cursor:pointer;transition:var(--t)}
.btn-ink:hover{background:var(--ink2)}
.btn-ghost{padding:10px 22px;background:transparent;color:var(--ink);border:1px solid var(--rule);border-radius:3px;font-size:0.85rem;font-family:var(--ff);cursor:pointer;transition:var(--t)}
.btn-ghost:hover{border-color:var(--ink3)}

/* SECTION */
.section{padding:6rem 2rem;max-width:880px;margin:0 auto}
.section-rule{border:none;border-top:1px solid var(--rule);margin-bottom:3rem}
.section-num{font-family:var(--fm);font-size:0.72rem;color:var(--ink3);letter-spacing:1px;margin-bottom:0.5rem}
.section-title{font-size:clamp(1.6rem,4vw,2.2rem);font-weight:600;letter-spacing:-0.5px;color:var(--ink)}

/* FEATURED STRIP */
.featured-strip{background:var(--paper2);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);width:100%}
.featured-inner{max-width:880px;margin:0 auto;padding:3rem 2rem;display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center}
.feat-label{font-family:var(--fm);font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:1rem}
.feat-eyebrow{font-family:var(--fm);font-size:0.7rem;color:var(--ink3);margin-bottom:0.4rem}
.feat-title{font-size:clamp(1.3rem,3.5vw,1.9rem);font-weight:600;letter-spacing:-0.5px;margin-bottom:0.75rem;color:var(--ink)}
.feat-desc{font-size:0.9rem;color:var(--ink2);line-height:1.7;margin-bottom:1.5rem;font-weight:300}
.feat-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1.5rem}
.tag{font-family:var(--fm);font-size:0.7rem;padding:3px 9px;background:var(--paper3);border-radius:2px;color:var(--ink3)}
.feat-video{width:100%;aspect-ratio:16/9;background:var(--ink);border-radius:4px;overflow:hidden;position:relative}
.feat-video iframe{width:100%;height:100%;border:none}
.feat-play-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.35);cursor:pointer;transition:background 0.2s}
.feat-play-overlay:hover{background:rgba(0,0,0,0.2)}
.feat-play-btn{width:50px;height:50px;border-radius:50%;background:rgba(245,242,237,0.92);display:flex;align-items:center;justify-content:center}
.feat-placeholder{width:100%;aspect-ratio:16/9;background:var(--paper3);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;opacity:0.3}

/* FIELDS LIST */
.fields-list{display:flex;flex-direction:column}
.field-row{display:grid;grid-template-columns:1fr 2fr auto;align-items:center;gap:2rem;padding:2rem 0;border-top:1px solid var(--rule);cursor:pointer;transition:var(--t)}
.field-row:last-child{border-bottom:1px solid var(--rule)}
.field-row:hover .field-row-title{color:var(--accent)}
.field-row:hover .field-row-arrow{transform:translateX(-6px)}
.field-row-num{font-family:var(--fm);font-size:0.7rem;color:var(--ink3)}
.field-row-title{font-size:clamp(1.3rem,4vw,1.8rem);font-weight:600;letter-spacing:-0.5px;transition:color 0.18s}
.field-row-sub{font-size:0.82rem;color:var(--ink3);margin-top:4px}
.field-row-desc{font-size:0.88rem;color:var(--ink2);line-height:1.6}
.field-row-arrow{font-size:1.2rem;color:var(--ink3);transition:transform 0.22s}

/* FIELD PAGE */
.fp-hero{padding:100px 2rem 3rem;max-width:880px;margin:0 auto}
.fp-back{font-family:var(--fm);font-size:0.78rem;color:var(--ink3);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:6px;padding:0;margin-bottom:2.5rem;transition:color 0.18s}
.fp-back:hover{color:var(--ink)}
.fp-eyebrow{font-family:var(--fm);font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:0.75rem}
.fp-title{font-size:clamp(2.5rem,7vw,5rem);font-weight:600;letter-spacing:-1.5px;color:var(--ink);margin-bottom:0.5rem}
.fp-tagline{font-size:1rem;color:var(--ink3)}
.fp-featured{background:var(--paper2);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);width:100%}
.fp-feat-inner{max-width:880px;margin:0 auto;padding:3rem 2rem;display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start}

/* PROJECTS LIST */
.fp-all{max-width:880px;margin:0 auto;padding:3rem 2rem 6rem}
.fp-all-label{font-family:var(--fm);font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);margin-bottom:2rem}
.projects-list{display:flex;flex-direction:column}
.proj-row{display:grid;grid-template-columns:60px 1fr auto;gap:2rem;align-items:start;padding:1.75rem 0;border-top:1px solid var(--rule);cursor:pointer;transition:var(--t)}
.proj-row:last-child{border-bottom:1px solid var(--rule)}
.proj-row:hover .proj-title{color:var(--accent)}
.proj-year{font-family:var(--fm);font-size:0.72rem;color:var(--ink3);padding-top:3px}
.proj-title{font-size:0.95rem;font-weight:500;color:var(--ink);margin-bottom:0.35rem;transition:color 0.18s}
.proj-desc{font-size:0.85rem;color:var(--ink3);line-height:1.6}
.proj-tags{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end;padding-top:3px}
.proj-arrow{font-size:0.9rem;color:var(--ink3);padding-top:3px}

/* CLIENTS */
.clients-bg{background:var(--paper2);border-top:1px solid var(--rule);overflow:hidden;padding:3rem 0;width:100%}
.clients-label{font-family:var(--fm);font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);text-align:center;margin-bottom:2rem}
.clients-scroll{overflow:hidden;position:relative}
.clients-scroll::before,.clients-scroll::after{content:'';position:absolute;top:0;bottom:0;width:100px;z-index:2}
.clients-scroll::before{right:0;background:linear-gradient(to left,var(--paper2),transparent)}
.clients-scroll::after{left:0;background:linear-gradient(to right,var(--paper2),transparent)}
.clients-track{display:flex;gap:3rem;align-items:center;width:max-content;animation:marquee 28s linear infinite}
.clients-track:hover{animation-play-state:paused}
.client-img{height:32px;opacity:0.3;filter:grayscale(1);transition:var(--t);flex-shrink:0}
.client-img:hover{opacity:0.7}

/* PROJECT PAGE */
.pp-wrap{max-width:680px;margin:0 auto;padding:100px 2rem 6rem}
.pp-back{font-family:var(--fm);font-size:0.78rem;color:var(--ink3);background:none;border:none;cursor:pointer;padding:0;margin-bottom:2.5rem;transition:color 0.18s;display:block}
.pp-back:hover{color:var(--ink)}
.pp-field{font-family:var(--fm);font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:0.75rem}
.pp-title{font-size:clamp(1.8rem,5vw,3rem);font-weight:600;letter-spacing:-1px;color:var(--ink);margin-bottom:0.5rem;line-height:1.1}
.pp-meta{display:flex;gap:1.5rem;align-items:center;padding:1.25rem 0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);margin:1.5rem 0}
.pp-year{font-family:var(--fm);font-size:0.72rem;color:var(--ink3)}
.pp-tags-row{display:flex;gap:6px;flex-wrap:wrap}
.pp-media{width:100%;aspect-ratio:16/9;background:var(--ink);border-radius:4px;overflow:hidden;position:relative;margin-bottom:2.5rem}
.pp-media iframe{width:100%;height:100%;border:none}
.pp-section-label{font-family:var(--fm);font-size:0.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);margin-bottom:0.75rem;margin-top:2.5rem}
.pp-text{font-size:1rem;color:var(--ink2);line-height:1.8;font-weight:300}
.pp-empty{font-size:0.85rem;color:var(--ink3);font-style:italic}
.pp-links{display:flex;flex-direction:column;gap:8px;margin-top:0.75rem}
.pp-link{font-family:var(--fm);font-size:0.82rem;color:var(--accent);text-decoration:none;transition:opacity 0.18s}
.pp-link:hover{opacity:0.7;text-decoration:underline}
.pp-placeholder{background:var(--paper2);border:1px dashed var(--paper3);border-radius:4px;padding:3rem 2rem;text-align:center;margin-bottom:2.5rem}
.pp-placeholder p{font-size:0.85rem;color:var(--ink3)}

.pp-cover{width:100%;max-height:420px;object-fit:cover;border-radius:4px;margin-bottom:2.5rem;display:block}
.md-body{font-size:1rem;color:var(--ink2);line-height:1.8;font-weight:300}
.md-body p{margin-bottom:1rem}
.md-body h1,.md-body h2,.md-body h3{font-weight:600;color:var(--ink);margin:2rem 0 0.75rem;letter-spacing:-0.3px}
.md-body h1{font-size:1.4rem}.md-body h2{font-size:1.2rem}.md-body h3{font-size:1rem}
.md-body ul,.md-body ol{padding-right:1.5rem;margin-bottom:1rem}
.md-body li{margin-bottom:0.4rem}
.md-body img{max-width:100%;border-radius:4px;margin:1.5rem 0;display:block}
.md-body a{color:var(--accent);text-decoration:underline}
.md-body strong{font-weight:600;color:var(--ink)}
.md-body em{font-style:italic}
.md-body blockquote{border-right:3px solid var(--accent);padding-right:1rem;margin:1.5rem 0;color:var(--ink3)}
.md-body code{font-family:var(--fm);font-size:0.85em;background:var(--paper3);padding:2px 6px;border-radius:2px}
.md-body pre{background:var(--paper3);padding:1rem;border-radius:4px;overflow-x:auto;margin-bottom:1rem}
.md-body pre code{background:none;padding:0}
.md-body hr{border:none;border-top:1px solid var(--rule);margin:2rem 0}

/* BLOG */
.blog-wrap{max-width:880px;margin:0 auto;padding:100px 2rem 6rem}
.blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-top:2rem}
.post-card{border:1px solid var(--rule);border-radius:4px;padding:1.5rem;cursor:pointer;transition:var(--t);background:var(--paper)}
.post-card:hover{background:var(--paper2);border-color:var(--ink3)}
.post-date{font-family:var(--fm);font-size:0.7rem;color:var(--ink3);margin-bottom:0.75rem}
.post-title{font-size:1rem;font-weight:600;color:var(--ink);margin-bottom:0.5rem;letter-spacing:-0.3px}
.post-excerpt{font-size:0.85rem;color:var(--ink3);line-height:1.6}
.post-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:1rem}

/* POST PAGE */
.post-wrap{max-width:640px;margin:0 auto;padding:100px 2rem 6rem}

/* EMPTY STATE */
.empty-state{text-align:center;padding:4rem 2rem;color:var(--ink3);font-size:0.9rem}

/* CONTACT */
.contact-wrap{max-width:880px;margin:0 auto;padding:0 2rem 8rem}
.contact-big{font-size:clamp(1.4rem,4vw,3.5rem);font-weight:600;letter-spacing:-1px;line-height:1.15;color:var(--ink);margin-bottom:2.5rem;word-break:break-word}
.contact-big a{color:var(--accent);text-decoration:none;transition:opacity 0.18s;font-size:clamp(0.95rem,2.5vw,2rem)}
.contact-big a:hover{opacity:0.75}
.contact-socials{display:flex;flex-wrap:wrap;border-top:1px solid var(--rule);padding-top:1.5rem;align-items:center}
.csoc{font-family:var(--fm);font-size:0.78rem;color:var(--ink3);text-decoration:none;transition:color 0.18s;padding:0 1.25rem;border-right:1px solid var(--rule)}
.csoc:first-child{padding-right:0}
.csoc:last-child{border-right:none}
.csoc:hover{color:var(--ink);text-decoration:underline}

/* MODAL */
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:500;display:flex;align-items:center;justify-content:center;padding:2rem}
.modal-inner{width:100%;max-width:820px}
.modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}
.modal-title{font-size:0.9rem;color:rgba(245,242,237,0.7);font-family:var(--fm)}
.modal-close{background:none;border:none;color:rgba(245,242,237,0.6);font-size:1.5rem;cursor:pointer;line-height:1}
.modal-close:hover{color:white}
.modal-video{width:100%;aspect-ratio:16/9}
.modal-video iframe{width:100%;height:100%;border:none}

/* FOOTER */
footer{border-top:1px solid var(--rule);padding:1.5rem 2rem;display:flex;justify-content:space-between;align-items:center;max-width:880px;margin:0 auto}
footer p{font-family:var(--fm);font-size:0.72rem;color:var(--ink3)}
footer span{color:var(--ink)}

@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp 0.4s ease both}

@media(max-width:700px){
  .nav-right{display:none}
  .hamburger{display:flex}
  .field-row{grid-template-columns:1fr auto}
  .field-row-desc{display:none}
  .featured-inner,.fp-feat-inner{grid-template-columns:1fr}
  .feat-video,.feat-placeholder{order:-1}
  .proj-row{grid-template-columns:1fr;gap:0.75rem}
  .proj-year{order:-1}
  .proj-tags{justify-content:flex-start}
  .proj-arrow{display:none}
  footer{flex-direction:column;gap:0.5rem;text-align:center}
  .csoc{padding:0 0.75rem}
  .blog-grid{grid-template-columns:1fr}
}
`;

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
function fieldIcon(id) {
  return id === "academic" ? "📊" : id === "tech" ? "⚡" : "🎬";
}

function VimeoEmbed({ id, playing, onPlay }) {
  return (
    <div className="feat-video">
      {playing ? (
        <iframe src={`https://player.vimeo.com/video/${id}?autoplay=1`} allow="autoplay; fullscreen" title="video" />
      ) : (
        <div className="feat-play-overlay" onClick={onPlay}>
          <div className="feat-play-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#111010"><polygon points="6,4 20,12 6,20"/></svg>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════════════════ */
function HomePage({ nav, scrollToContact }) {
  const FIELDS = buildFields();
  const creativeField = FIELDS.find(f => f.id === "creative");
  const latestCreative = creativeField?.projects[0];
  const [playing, setPlaying] = useState(false);

  return (
    <>
      <section className="hero">
        <h1 className="hero-name"><em>فراس</em><br/>المالكي</h1>
        <div className="hero-roles">
          {ME.roles.map(r => <span key={r} className="hero-role">{r}</span>)}
        </div>
        <p className="hero-bio">{ME.bio}</p>
        <div className="hero-actions">
          <button className="btn-ink" onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}>استعرض الأعمال</button>
          <button className="btn-ghost" onClick={scrollToContact}>تواصل معي</button>
        </div>
      </section>

      {latestCreative && (
        <div className="featured-strip">
          <div className="featured-inner">
            <div>
              <p className="feat-label">أحدث الأعمال</p>
              <p className="feat-eyebrow">{creativeField.ar} · {latestCreative.year}</p>
              <h2 className="feat-title">{latestCreative.title}</h2>
              <p className="feat-desc">{latestCreative.desc}</p>
              <div className="feat-tags">{(latestCreative.tags || []).map(t => <span key={t} className="tag">{t}</span>)}</div>
              <button className="btn-ghost" onClick={() => nav("field", "creative")}>استعرض المجال الإبداعي ←</button>
            </div>
            {latestCreative.vimeo ? (
              <VimeoEmbed id={latestCreative.vimeo} playing={playing} onPlay={() => setPlaying(true)} />
            ) : (
              <div className="feat-placeholder">{fieldIcon("creative")}</div>
            )}
          </div>
        </div>
      )}

      <section className="section" id="work">
        <hr className="section-rule" />
        <p className="section-num">01 — المجالات</p>
        <h2 className="section-title" style={{ marginBottom: "2.5rem" }}>ماذا أعمل</h2>
        <div className="fields-list">
          {FIELDS.map((f, i) => (
            <div key={f.id} className="field-row" onClick={() => nav("field", f.id)} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && nav("field", f.id)}>
              <div>
                <p className="field-row-num">0{i + 1}</p>
                <h3 className="field-row-title">{f.ar}</h3>
                <p className="field-row-sub">{f.en}</p>
              </div>
              <p className="field-row-desc">{f.projects[0]?.desc || f.tagline}</p>
              <span className="field-row-arrow">←</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="contact">
        <hr className="section-rule" />
        <p className="section-num">02 — تواصل</p>
        <h2 className="section-title" style={{ marginBottom: "2.5rem" }}>لنتحدث</h2>
        <div className="contact-wrap" style={{ padding: 0 }}>
          <p className="contact-big">
            تواصل معي على<br />
            <a href={`mailto:${ME.email}`}>{ME.email}</a>
          </p>
          <div className="contact-socials">
            {ME.socials.map(s => <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="csoc">{s.label}</a>)}
          </div>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   FIELD PAGE
══════════════════════════════════════════════════════════════ */
function FieldPage({ fieldId, nav }) {
  const FIELDS = buildFields();
  const field = FIELDS.find(f => f.id === fieldId);
  const [featPlaying, setFeatPlaying] = useState(false);
  if (!field) return null;

  const latest = field.projects[0];

  return (
    <div className="fade-up">
      <div className="fp-hero">
        <button className="fp-back" onClick={() => nav("home")}>← الرجوع</button>
        <p className="fp-eyebrow">{field.en}</p>
        <h1 className="fp-title">{field.ar}</h1>
        <p className="fp-tagline">{field.tagline}</p>
      </div>

      {latest ? (
        <div className="fp-featured">
          <div className="fp-feat-inner">
            <div>
              <p className="feat-label">أحدث مشروع</p>
              <p className="feat-eyebrow">{latest.year}</p>
              <h2 className="feat-title">{latest.title}</h2>
              <p className="feat-desc">{latest.summary || latest.desc}</p>
              <div className="feat-tags">{(latest.tags || []).map(t => <span key={t} className="tag">{t}</span>)}</div>
              <button className="btn-ghost" onClick={() => nav("project", fieldId, latest.slug)}>تفاصيل المشروع ←</button>
            </div>
            {latest.vimeo ? (
              <VimeoEmbed id={latest.vimeo} playing={featPlaying} onPlay={() => setFeatPlaying(true)} />
            ) : (
              <div className="feat-placeholder">{fieldIcon(fieldId)}</div>
            )}
          </div>
        </div>
      ) : null}

      <div className="fp-all">
        {field.projects.length > 0 ? (
          <>
            <p className="fp-all-label">جميع المشاريع — {field.projects.length}</p>
            <div className="projects-list">
              {field.projects.map(p => (
                <div key={p.slug} className="proj-row" onClick={() => nav("project", fieldId, p.slug)} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && nav("project", fieldId, p.slug)}>
                  <span className="proj-year">{p.year}</span>
                  <div>
                    <p className="proj-title">{p.title}</p>
                    <p className="proj-desc">{p.desc}</p>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"8px" }}>
                    <div className="proj-tags">{(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}</div>
                    <span className="proj-arrow">←</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="empty-state">لا توجد مشاريع منشورة في هذا المجال بعد.</p>
        )}
      </div>

      {field.id === "creative" && field.clients && (
        <div className="clients-bg">
          <p className="clients-label">عملت مع</p>
          <div className="clients-scroll">
            <div className="clients-track">
              {[...field.clients, ...field.clients].map((c, i) => (
                <img key={i} src={c.img} alt={c.name} className="client-img" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROJECT PAGE
══════════════════════════════════════════════════════════════ */
function ProjectPage({ fieldId, slug, nav }) {
  const fieldMeta = FIELD_META.find(f => f.id === fieldId);
  const project = ALL_PROJECTS.find(p => p.slug === slug);
  const [playing, setPlaying] = useState(false);
  if (!project) return null;

  return (
    <div className="fade-up">
      <div className="pp-wrap">
        <button className="pp-back" onClick={() => nav("field", fieldId)}>← {fieldMeta?.ar}</button>
        <p className="pp-field">{fieldMeta?.en}</p>
        <h1 className="pp-title">{project.title}</h1>
        <div className="pp-meta">
          <span className="pp-year">{project.year}</span>
          <div className="pp-tags-row">{(project.tags || []).map(t => <span key={t} className="tag">{t}</span>)}</div>
        </div>

        {project.vimeo ? (
          <div className="pp-media">
            {playing ? (
              <iframe src={`https://player.vimeo.com/video/${project.vimeo}?autoplay=1`} allow="autoplay; fullscreen" title={project.title} />
            ) : (
              <div className="feat-play-overlay" onClick={() => setPlaying(true)}>
                <div className="feat-play-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#111010"><polygon points="6,4 20,12 6,20"/></svg>
                </div>
              </div>
            )}
          </div>
        ) : project.cover ? (
          <img src={project.cover} alt={project.title} className="pp-cover" />
        ) : (
          <div className="pp-placeholder" style={{ marginBottom: "2.5rem" }}>
            <p>لم تُضَف ميديا لهذا المشروع بعد</p>
          </div>
        )}

        {project.summary && (
          <>
            <p className="pp-section-label" style={{ marginTop: 0 }}>ملخص</p>
            <p className="pp-text">{project.summary}</p>
          </>
        )}

        <p className="pp-section-label">المشكلة</p>
        {project.problem ? <div className="md-body"><ReactMarkdown>{project.problem}</ReactMarkdown></div> : <p className="pp-empty">لم يُضَف بعد</p>}

        <p className="pp-section-label">الحل</p>
        {project.solution ? <div className="md-body"><ReactMarkdown>{project.solution}</ReactMarkdown></div> : <p className="pp-empty">لم يُضَف بعد</p>}

        <p className="pp-section-label">النتيجة</p>
        {project.outcome ? <div className="md-body"><ReactMarkdown>{project.outcome}</ReactMarkdown></div> : <p className="pp-empty">لم يُضَف بعد</p>}

        {project.links?.length > 0 && (
          <>
            <p className="pp-section-label">روابط</p>
            <div className="pp-links">
              {project.links.map((l, i) => <a key={i} href={l.url} target="_blank" rel="noreferrer" className="pp-link">↗ {l.label}</a>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   BLOG
══════════════════════════════════════════════════════════════ */
function BlogList({ nav }) {
  return (
    <div className="fade-up blog-wrap">
      <p style={{ fontFamily:"var(--fm)", fontSize:"0.7rem", letterSpacing:"2px", textTransform:"uppercase", color:"var(--ink3)", marginBottom:"0.75rem" }}>Personal</p>
      <h1 style={{ fontSize:"clamp(2rem,6vw,3.5rem)", fontWeight:600, letterSpacing:"-1px", marginBottom:"0.5rem" }}>مدوّنة</h1>
      <p style={{ color:"var(--ink3)", marginBottom:"3rem" }}>أفكار، ملاحظات، وتجارب شخصية.</p>
      {ALL_POSTS.length > 0 ? (
        <div className="blog-grid">
          {ALL_POSTS.map(p => (
            <div key={p.slug} className="post-card" onClick={() => nav("post", p.slug)} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && nav("post", p.slug)}>
              <p className="post-date">{p.date?.slice(0, 10)}</p>
              <h2 className="post-title">{p.title}</h2>
              <p className="post-excerpt">{p.excerpt}</p>
              <div className="post-tags">{(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state">لا توجد مقالات منشورة بعد.</p>
      )}
    </div>
  );
}

function PostPage({ slug, nav }) {
  const post = ALL_POSTS.find(p => p.slug === slug);
  if (!post) return null;
  return (
    <div className="fade-up post-wrap">
      <button className="fp-back" onClick={() => nav("blog")}>← المدوّنة</button>
      <p style={{ fontFamily:"var(--fm)", fontSize:"0.72rem", color:"var(--ink3)", marginBottom:"0.75rem" }}>{post.date?.slice(0,10)}</p>
      <h1 style={{ fontSize:"clamp(1.8rem,5vw,2.8rem)", fontWeight:600, letterSpacing:"-0.8px", marginBottom:"0.75rem" }}>{post.title}</h1>
      <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", paddingBottom:"2rem", borderBottom:"1px solid var(--rule)", marginBottom:"2rem" }}>
        {(post.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      {post.cover && <img src={post.cover} alt={post.title} className="pp-cover" />}
      <div className="md-body">
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [route, setRoute] = useState({ page: "home" });
  const [mobOpen, setMobOpen] = useState(false);

  const nav = (page, fieldId = null, slug = null) => {
    setRoute({ page, fieldId, slug });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobOpen(false);
  };

  const scrollToContact = () => {
    if (route.page !== "home") { nav("home"); setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" }), 80); }
    else document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" });
    setMobOpen(false);
  };

  const navItems = [
    { label: "الأعمال", action: () => { nav("home"); setTimeout(() => document.getElementById("work")?.scrollIntoView({ behavior:"smooth" }), 80); } },
    { label: "مدوّنة",  action: () => nav("blog") },
    { label: "تواصل",   action: scrollToContact },
  ];

  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <a className="nav-logo" onClick={() => nav("home")} href="#" style={{ textDecoration:"none" }}>Feras<span>.</span></a>
        <div className="nav-right">
          {navItems.map((n, i) => (
            <span key={n.label} style={{ display:"contents" }}>
              {i > 0 && <div className="nav-divider" />}
              <button className="nav-link" onClick={n.action}>{n.label}</button>
            </span>
          ))}
        </div>
        <button className="hamburger" onClick={() => setMobOpen(o => !o)} aria-label="قائمة">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mob-menu ${mobOpen ? "open" : ""}`}>
        {navItems.map(n => <button key={n.label} className="mob-link" onClick={n.action}>{n.label}</button>)}
      </div>

      {route.page === "home"    && <HomePage    nav={nav} scrollToContact={scrollToContact} />}
      {route.page === "field"   && <FieldPage   fieldId={route.fieldId} nav={nav} />}
      {route.page === "project" && <ProjectPage fieldId={route.fieldId} slug={route.slug} nav={nav} />}
      {route.page === "blog"    && <BlogList    nav={nav} />}
      {route.page === "post"    && <PostPage    slug={route.slug} nav={nav} />}

      <footer>
        <p><span>Feras Almalki</span> © 2025</p>
        <p style={{ fontFamily:"var(--fm)" }}>feras00.netlify.app</p>
      </footer>
    </>
  );
}