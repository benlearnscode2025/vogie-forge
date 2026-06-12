import React, { useState, useEffect } from 'react';
import './App.css';
import scabbard2 from './assets/scabbard_2.jpg';
import scabbard3 from './assets/scabbard_3.jpg';
import scabbard4 from './assets/scabbard_4.jpg';
import scabbard6 from './assets/scabbard_6.jpg';
import scabbard12 from './assets/scabbard_12.jpg';


// ---------------------------------------------------------
// DATA MODELS & INTERFACES
// ---------------------------------------------------------
interface Product {
  slug: string;
  name: string;
  tier: string;
  price: number;
  edition: number;
  steel: string;
  hrc: string;
  blade: string;
  overall: string;
  grind: string;
  handle: string;
  sheath: string;
  inBox: string;
  photoLabel: string;
  image?: string;
  desc: string;
  priceLabel?: string;
  editionLabel?: string;
  href?: string;
  live?: boolean;
  sold?: boolean;
}

interface ArchiveProduct {
  name: string;
  tier: string;
  note: string;
  photoLabel?: string;
  image?: string;
  sold?: boolean;
  live?: boolean;
}

interface CollectionProduct {
  name: string;
  tier: string;
  slug?: string;
  price?: number;
  edition?: number;
  steel?: string;
  hrc?: string;
  blade?: string;
  overall?: string;
  grind?: string;
  handle?: string;
  sheath?: string;
  inBox?: string;
  photoLabel?: string;
  image?: string;
  desc?: string;
  priceLabel?: string;
  editionLabel?: string;
  href?: string;
  live?: boolean;
  sold?: boolean;
  note?: string;
}

// ---------------------------------------------------------
// CONFIGURATION (Adjust placeholders below as needed)
// ---------------------------------------------------------
const CONFIG = {
  NEXT_DROP_DATE: "2026-07-15T18:00:00Z", // Set to "TBA" to test TBA state
  CHECKOUT_URL: "https://checkout.shopify.com/placeholder-vogie-forge", // Shopify checkout link or Buy Button target
  LIST_PROVIDER: "Klaviyo", // Klaviyo, Postscript, Attentive, etc.
  KLAVIYO_COMPANY_ID: "PLACEHOLDER_COMPANY_ID",
  KLAVIYO_LIST_ID: "PLACEHOLDER_LIST_ID",
  MAKER_NAME: "Dane Vogelpohl",
  FORGE_LOCATION: "Ohio, USA"
};

const IN_BOX_DEFAULT = "Numbered and signed certificate, care card with a code that opens the care guide, blade shipped oiled and sharpened.";

const BATCH_PRODUCTS: Product[] = [
  { slug: "bog-oak-sgian-dubh", name: "Bog oak sgian dubh", tier: "Vanguard", price: 385, edition: 6,
    steel: "80CrV2 high-carbon", hrc: "59-60 HRC", blade: "3 1/2 in", overall: "7 1/2 in", grind: "Flat, hand-finished",
    handle: "5,000-year bog oak, brass", sheath: "Wet-formed leather", inBox: IN_BOX_DEFAULT,
    photoLabel: "Photo slot · bog oak sgian dubh, raking light on slate",
    image: "https://static.wixstatic.com/media/cd5cc7_cd11fc4d7bc64048afa7010bd81a2bef~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg",
    desc: "The working sgian dubh. Forged from 80CrV2, quenched in oil and tempered twice. Bog oak pulled from Scottish peat, fitted with brass." },
  { slug: "antler-sgian-dubh", name: "Antler sgian dubh, pattern welded", tier: "Vanguard", price: 450, edition: 4,
    steel: "Pattern-welded 1084 and 15N20", hrc: "58-59 HRC", blade: "3 5/8 in", overall: "7 3/4 in", grind: "Flat",
    handle: "Red deer antler, brass", sheath: "Wet-formed leather", inBox: IN_BOX_DEFAULT,
    photoLabel: "Photo slot · antler sgian dubh, pattern visible",
    image: "https://static.wixstatic.com/media/cd5cc7_2fb62267a3b74570bb7c67d1eb216e62~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg",
    desc: "Layered 1084 and 15N20, etched to show the pattern. Red deer antler crown, each one different." },
  { slug: "highland-chef-knife", name: "Highland chef knife", tier: "Culinary", price: 640, edition: 3,
    steel: "1095 high-carbon", hrc: "61-62 HRC", blade: "8 in", overall: "13 in", grind: "Full flat, thin behind the edge",
    handle: "Bog oak, brass pins", sheath: "None. Ships with a fitted blade guard.", inBox: IN_BOX_DEFAULT,
    photoLabel: "Photo slot · chef knife on parchment, edge down",
    image: "https://static.wixstatic.com/media/cd5cc7_dbc27d8854bc43d09a959cc0519f4703~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg",
    desc: "An 8 inch chef knife in 1095, taken to 61-62 HRC for edge retention. It will patina with use. That is the point." },
  { slug: "highland-dirk", name: "Highland dirk", tier: "Elite", price: 780, edition: 2,
    steel: "5160 high-carbon", hrc: "57-58 HRC", blade: "12 in", overall: "17 1/2 in", grind: "Flat with hand-cut fuller",
    handle: "Hand-carved blackwood, studded", sheath: "Wood-cored leather scabbard", inBox: IN_BOX_DEFAULT,
    photoLabel: "Photo slot · dirk full length, dark ground",
    image: "https://static.wixstatic.com/media/cd5cc7_0141010818d14e8e881f908b3d3c3a34~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg",
    desc: "The working Highland pattern, carved knotwork grip and a hand-cut fuller. Two will be made for this batch." }
];

const ARCHIVE_PRODUCTS: ArchiveProduct[] = [
  { name: "Kingsway Claymore", tier: "Halo", note: "Two-handed claymore, hand-carved scabbard.", photoLabel: "Photo slot · Kingsway Claymore", image: "https://static.wixstatic.com/media/cd5cc7_608d3041215b438d84866f1eb6f050fc~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg" },
  { name: "Pattern welded basket hilt broadsword", tier: "Halo", note: "Layered steel, hand-forged basket.", photoLabel: "Photo slot · basket hilt broadsword", image: "https://static.wixstatic.com/media/cd5cc7_3d4be62be7b64efaa085ec4e9b0f0477~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg" },
  { name: "William Wallace Claymore", tier: "Halo", note: "Great sword of the Wallace pattern.", photoLabel: "Photo slot · William Wallace Claymore", image: "https://static.wixstatic.com/media/cd5cc7_5480718775ed4f19a0d4026f304d129c~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg" },
  { name: "The Fishmonger, a Highland dirk", tier: "Elite", note: "Working dirk, antler and brass." },
  { name: "Ebony sgian dubh, pattern welded", tier: "Vanguard", note: "Layered blade, ebony grip." },
  { name: "Chef knife, single commission", tier: "Culinary", note: "High-carbon kitchen blade in hardwood." }
];

const money = (n: number) => "$" + n.toLocaleString("en-US");

const DECORATED_BATCH: Product[] = BATCH_PRODUCTS.map((p) => ({
  ...p,
  priceLabel: money(p.price),
  editionLabel: "Edition of " + p.edition,
  href: "#/product/" + p.slug,
  live: true,
  sold: false
}));

const DECORATED_ARCHIVE: CollectionProduct[] = ARCHIVE_PRODUCTS.map((a) => ({
  ...a,
  sold: true,
  live: false
}));

// ---------------------------------------------------------
// REUSABLE COMPONENTS
// ---------------------------------------------------------

function VipInput({ label, type, placeholder, value, onChange, helper }: { label: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, helper?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label style={{ font: '500 12px/1 var(--font-mono)', letterSpacing: '0.08em', color: 'var(--ink-2)', textTransform: 'uppercase' }}>{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        style={{ 
          background: 'rgba(27,25,22,0.04)', 
          border: '1px solid rgba(27,25,22,0.16)', 
          borderRadius: '8px', 
          padding: '12px 16px', 
          font: '400 14px/1.5 var(--font-sans)', 
          color: 'var(--ink-1)',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#c98b46';
          e.target.style.boxShadow = '0 0 0 2px rgba(201,139,70,0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(27,25,22,0.16)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {helper && <span style={{ font: '400 12px/1.4 var(--font-sans)', color: 'var(--ink-3)' }}>{helper}</span>}
    </div>
  );
}

function VipButton({ onClick, children }: { onClick: () => void, children: React.ReactNode }) {
  return (
    <button 
      type="button"
      onClick={onClick} 
      className="btn-gold"
      style={{ 
        font: '500 13px/1 var(--font-sans)', 
        color: '#1b1916', 
        background: '#c98b46', 
        border: 'none',
        padding: '12px 24px', 
        borderRadius: '999px', 
        cursor: 'pointer',
        fontWeight: 'bold',
        outline: 'none'
      }}
    >
      {children}
    </button>
  );
}

function VipCapture({ headline }: { headline: string }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    const ok = /.+@.+\..+/.test(email.trim());
    if (!ok) {
      setError("Enter a valid email");
      return;
    }

    const companyId = CONFIG.KLAVIYO_COMPANY_ID;
    const listId = CONFIG.KLAVIYO_LIST_ID;

    if (companyId && companyId !== "PLACEHOLDER_COMPANY_ID" && listId && listId !== "PLACEHOLDER_LIST_ID") {
      try {
        setError("");
        const formData = new URLSearchParams();
        formData.append("g", listId);
        formData.append("email", email.trim());
        if (phone.trim()) {
          formData.append("phone_number", phone.trim());
          formData.append("$consent", "email,sms");
        } else {
          formData.append("$consent", "email");
        }

        const response = await fetch(`https://manage.kmail-lists.com/ajax/subscriptions/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData.toString()
        });

        if (!response.ok) {
          throw new Error("Subscription failed");
        }
      } catch (err) {
        console.error("Klaviyo subscription error:", err);
      }
    }

    setSent(true);
    setError("");
  };

  return (
    <div style={{ 
      background: 'var(--surface-card)', 
      border: '1px solid rgba(27,25,22,0.14)', 
      borderRadius: '16px', 
      padding: '28px', 
      boxShadow: '0 2px 16px rgba(27,25,22,0.1), inset 0 1px 0 rgba(255,255,255,0.7)', 
      color: 'var(--ink-1)', 
      font: '400 16px/1.6 var(--font-sans)',
      textAlign: 'left'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
        <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#a06a2c', textTransform: 'uppercase' }}>The list</span>
        <span style={{ font: '400 24px/1.2 "Libre Caslon Text", Georgia, serif', color: 'var(--ink-1)', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>{headline}</span>
      </div>
      <p style={{ margin: '0 0 20px', font: '400 14px/1.55 var(--font-sans)', color: 'var(--ink-2)', maxWidth: '48ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>
        Drops are announced to the list 48 hours before anyone else. Batches run 15 to 40 blades. They do not restock.
      </p>
      {!sent ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <VipInput 
            label="Email" 
            type="email" 
            placeholder="you@example.com" 
            value={email} 
            onChange={(e) => { setEmail(e.target.value); setError(""); }} 
          />
          <VipInput 
            label="Mobile, optional" 
            type="tel" 
            placeholder="+44" 
            helper="SMS only on drop day. Nothing else." 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px', flexWrap: 'wrap' }}>
            <VipButton onClick={submit}>Join the list</VipButton>
            {error && <span style={{ font: '500 12px/1.4 var(--font-mono)', color: '#b00020' }}>{error}</span>}
          </div>
        </div>
      ) : (
        <div style={{ borderTop: '1px solid rgba(27,25,22,0.12)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ font: '400 18px/1.3 "Libre Caslon Text", Georgia, serif', fontStyle: 'italic', color: 'var(--ink-1)' }}>You are on the list.</span>
          <span style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--ink-2)' }}>Batch details reach you 48 hours before public release.</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// MAIN APPLICATION
// ---------------------------------------------------------
function App() {
  const parsePath = () => {
    const hash = (window.location.hash || "").replace(/^#\//, "");
    if (hash) {
      const [page, slug] = hash.split("/");
      const valid = ["home","drops","collection","culinary","forge","care","faq","vip","custom","product","scripture","the-scabbard"];
      if (valid.includes(page)) return { page, slug: slug || null };
    }
    const path = window.location.pathname.replace(/^\//, "");
    const [page, slug] = path.split("/");
    const valid = ["home","drops","collection","culinary","forge","care","faq","vip","custom","product","scripture","the-scabbard"];
    if (valid.includes(page)) return { page, slug: slug || null };
    return { page: "home", slug: null };
  };

  const [route, setRoute] = useState(() => parsePath());
  const [filter, setFilter] = useState("all");
  const [now, setNow] = useState(() => Date.now());

  const navigate = (page: string, slug: string | null = null) => {
    const hashPath = `#/${page}` + (slug ? `/${slug}` : "");
    window.history.pushState(null, '', hashPath);
    setRoute({ page, slug });
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Initial Path redirects (backward compatibility)
    const path = window.location.pathname;
    if (path === '/customizer' || path === '/contact') {
      setTimeout(() => navigate('custom'), 0);
    } else if (path === '/wip') {
      setTimeout(() => navigate('forge'), 0);
    } else if (path === '/qa') {
      setTimeout(() => navigate('faq'), 0);
    } else if (path === '/godsword') {
      setTimeout(() => navigate('scripture'), 0);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // SEO & Lexicon Metadata Sync
  useEffect(() => {
    let title = "Vogie Forge — Hand-Forged Highland Blades, Released in Numbered Batches";
    let description = "Scottish roots, now forged in America. Sgian dubhs, dirks, claymores and culinary blades hand-forged from high-carbon steel. Small numbered editions. Join the list for first access.";

    const page = route.page;
    if (page === 'drops') {
      title = "Vogie Forge — Numbered Batch Releases";
    } else if (page === 'the-scabbard') {
      title = "The King's Scabbard — Vogie Forge";
      description = "The story of the scabbard presented to King Charles III in 2023, crafted by Vogie Forge.";
    } else if (page === 'collection') {
      title = "Vogie Forge — The Heirloom Collection";
    } else if (page === 'product' && route.slug) {
      const prod = DECORATED_BATCH.find(p => p.slug === route.slug);
      if (prod) {
        title = `${prod.name} | Batch 001 | Vogie Forge`;
        description = `${prod.name} — Edition of ${prod.edition}. Forged in Ohio, USA from ${prod.steel}.`;
      }
    } else if (page === 'culinary') {
      title = "Vogie Forge — Culinary & Kitchen Line";
    } else if (page === 'forge') {
      title = "Vogie Forge — Story & Hand-Forging Process";
    } else if (page === 'care') {
      title = "High-Carbon Steel Care Guide — Vogie Forge";
    } else if (page === 'faq') {
      title = "Frequently Asked Questions — Vogie Forge";
    } else if (page === 'vip') {
      title = "VIP First Access List — Vogie Forge";
    } else if (page === 'custom') {
      title = "Custom Work Books Closed — Vogie Forge";
    } else if (page === 'scripture') {
      title = "The Scripture Oath — Vogie Forge";
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [route]);

  // Drop countdown calculations
  const dropTime = () => {
    const raw = (CONFIG.NEXT_DROP_DATE ?? "TBA").trim();
    const t = Date.parse(raw);
    return isNaN(t) || t <= Date.now() ? null : t;
  };

  useEffect(() => {
    const tVal = dropTime();
    if (!tVal) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const tVal = dropTime();
  let countdownParts: { unit: string; value: string }[] = [];
  let dropDateLabel = "";
  if (tVal) {
    const ms = Math.max(0, tVal - now);
    const d = Math.floor(ms / 86400000);
    const h = Math.floor(ms / 3600000) % 24;
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    countdownParts = [
      { unit: "days", value: pad(d) },
      { unit: "hrs", value: pad(h) },
      { unit: "min", value: pad(m) },
      { unit: "sec", value: pad(s) }
    ];
    dropDateLabel = "Releases " + new Intl.DateTimeFormat(undefined, {
      weekday: "long", day: "numeric", month: "long",
      hour: "numeric", minute: "2-digit", timeZoneName: "short"
    }).format(new Date(tVal)) + ", your local time.";
  }

  const allCollection = [...DECORATED_BATCH, ...DECORATED_ARCHIVE];
  const filtered = filter === "all" ? allCollection : allCollection.filter((p: CollectionProduct) => p.tier.toLowerCase() === filter.toLowerCase());

  const filterPills = ["all", "vanguard", "elite", "halo", "culinary"].map((f) => ({
    id: f, 
    label: f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1),
    set: () => setFilter(f),
    bg: filter === f ? "#ece7db" : "transparent",
    color: filter === f ? "#1b1916" : "#a8a294",
    border: filter === f ? "transparent" : "rgba(236,231,219,0.2)"
  }));

  const product = DECORATED_BATCH.find((p) => p.slug === route.slug) || DECORATED_BATCH[0];
  const chef = DECORATED_BATCH.find((p) => p.slug === "highland-chef-knife") || DECORATED_BATCH[2];
  
  const specRows = [
    ["Steel", product.steel], 
    ["Hardness", product.hrc], 
    ["Blade length", product.blade],
    ["Overall length", product.overall], 
    ["Grind", product.grind], 
    ["Handle", product.handle],
    ["Sheath", product.sheath], 
    ["Batch", "001"], 
    ["Edition", "No. ____ of " + product.edition]
  ].map(([label, value]) => ({ label, value }));

  const checkoutUrl = (CONFIG.CHECKOUT_URL ?? "").trim();
  const buyLive = !!checkoutUrl && !tVal;
  const dropStatusLine = tVal ? dropDateLabel : "Date announced to the list first.";

  const faqs = [
    { q: "Where are these blades made?", a: "All Vogie Forge blades are hand-forged in Ohio, USA. While our heritage, training, and pattern language (sgian dubh, dirk, claymore) are rooted in the Scottish Highlands, present-tense manufacturing takes place in our American workshop." },
    { q: "Who can buy, and where do you ship?", a: "Buyers must be 18 or over. Deliveries require an adult signature with age verification at the door. Some countries and regions restrict the import or carriage of blades; check your local rules before ordering. Placeholder: the owner must confirm this copy against current UK export rules and destination-country law before launch." },
    { q: "Will a sold-out edition return?", a: "No. Editions are final. When the last number in a batch sells, that pattern in that configuration is finished. The next batch is a different set of blades." },
    { q: "How long until my blade ships?", a: "Batch blades are finished before a drop opens. Allow up to two weeks for packing and dispatch. Placeholder: owner to confirm dispatch window." },
    { q: "What is the return policy on numbered pieces?", a: "14-day cancellation on non-personalised pieces, and 14 days to return from the day your blade arrives, at the buyer's expense. Personalised or engraved pieces are final sale." },
    { q: "Do you offer sharpening?", a: "A return-to-forge sharpening service is planned. Terms will be published before Batch 001 opens." },
    { q: "Do you take custom commissions?", a: "The custom books are closed. All blades now release in numbered batches, announced to the list first." }
  ];

  const links = [
    { id: "drops", label: "Drops" },
    { id: "collection", label: "Collection" },
    { id: "culinary", label: "Culinary" },
    { id: "forge", label: "The forge" },
    { id: "care", label: "Care" },
    { id: "faq", label: "FAQ" }
  ];

  const navItems = links.map(({ id, label }) => ({
    id, label, href: "#/" + id,
    color: route.page === id ? "#ece7db" : "#a8a294"
  }));

  const isHome = route.page === "home";
  const isDrops = route.page === "drops";
  const isCollection = route.page === "collection";
  const isCulinary = route.page === "culinary";
  const isForge = route.page === "forge";
  const isCare = route.page === "care";
  const isFaq = route.page === "faq";
  const isVip = route.page === "vip";
  const isCustom = route.page === "custom";
  const isProduct = route.page === "product";
  const isScripture = route.page === "scripture";
  const isScabbard = route.page === "the-scabbard";

  return (
    <div style={{ minHeight: '100dvh', background: '#131110', color: '#ece7db', fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: '1.6' }}>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(19,17,16,0.82)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(236,231,219,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)', display: 'flex', alignItems: 'center', gap: '20px', height: '64px' }}>
          <a href="#/home" onClick={(e) => { e.preventDefault(); navigate("home"); }} style={{ display: 'flex', flexDirection: 'column', gap: '1px', textDecoration: 'none', flexShrink: 0 }}>
            <span style={{ font: "700 17px/1 'Libre Caslon Text', Georgia, serif", color: '#ece7db', letterSpacing: '0.02em' }}>Vogie Forge</span>
            <span style={{ font: '500 9px/1 var(--font-mono)', letterSpacing: '0.22em', color: '#a8a294', textTransform: 'uppercase' }}>Ohio · USA</span>
          </a>
          <nav aria-label="Main" className="nav-container">
            {navItems.map((nv) => (
              <a 
                key={nv.id} 
                href={nv.href} 
                onClick={(e) => { e.preventDefault(); navigate(nv.id); }} 
                className="nav-link-item"
                style={{ 
                  font: '500 13px/1 var(--font-sans)', 
                  color: nv.color, 
                  textDecoration: 'none', 
                  padding: '10px 12px', 
                  borderRadius: '999px', 
                  whiteSpace: 'nowrap'
                }}
              >
                {nv.label}
              </a>
            ))}
          </nav>
          <a href="#/vip" onClick={(e) => { e.preventDefault(); navigate("vip"); }} className="btn-gold" style={{ flexShrink: 0, font: '500 13px/1 var(--font-sans)', color: '#1b1916', background: '#c98b46', textDecoration: 'none', padding: '11px 18px', borderRadius: '999px', transition: 'background 150ms cubic-bezier(0.16,1,0.3,1)', fontWeight: 'bold' }}>Join the list</a>
        </div>
      </header>

      {/* HOME */}
      {isHome && (
        <main data-screen-label="Home">
          {/* Hero */}
          <section style={{ position: 'relative', minHeight: '82dvh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
            <img src="https://static.wixstatic.com/media/cd5cc7_89e156a4623340d59bd3b7263dcb518c~mv2.jpg" alt="Dane Vogelpohl drawing a glowing high-carbon blade from the forge in Crieff" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(19,17,16,0.94) 8%, rgba(19,17,16,0.45) 45%, rgba(19,17,16,0.25) 100%)' }}></div>
            <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', width: '100%', padding: 'clamp(80px, 14vh, 160px) clamp(16px, 4vw, 40px) clamp(48px, 8vh, 88px)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h1 style={{ margin: 0, font: "400 clamp(38px, 6.5vw, 72px)/1.08 'Libre Caslon Text', Georgia, serif", color: '#f6f2ea', maxWidth: '20ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>Scottish roots, now forged in America.</h1>
              <p style={{ margin: 0, font: '400 17px/1.6 var(--font-sans)', color: '#a8a294', maxWidth: '52ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>Sgian dubhs, dirks and claymores hand-forged in Ohio, USA by Dane Vogelpohl in the Highland tradition. Each batch runs 15 to 40 blades. Editions are final.</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="#/vip" onClick={(e) => { e.preventDefault(); navigate("vip"); }} style={{ font: '500 15px/1 var(--font-sans)', color: '#1b1916', background: '#c98b46', textDecoration: 'none', padding: '15px 26px', borderRadius: '999px', transition: 'background 150ms cubic-bezier(0.16,1,0.3,1)', fontWeight: 'bold' }} className="btn-gold">Join the list</a>
                <a href="#/drops" onClick={(e) => { e.preventDefault(); navigate("drops"); }} style={{ font: '500 15px/1 var(--font-sans)', color: '#ece7db', background: 'transparent', border: '1px solid rgba(236,231,219,0.3)', textDecoration: 'none', padding: '14px 26px', borderRadius: '999px', transition: 'border-color 150ms' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236,231,219,0.6)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236,231,219,0.3)'}>See Batch 001</a>
              </div>
            </div>
          </section>

          {/* Drop status band */}
          <section style={{ borderTop: '1px solid rgba(201,139,70,0.45)', borderBottom: '1px solid rgba(236,231,219,0.1)', background: '#1b1916', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-1px', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #c98b46 30%, #e8b06a 50%, #c98b46 70%, transparent)', animation: 'quenchGlow 4s ease-in-out infinite' }}></div>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#c98b46', textTransform: 'uppercase' }}>Batch 001 · 15 blades</span>
                {tVal ? (
                  <>
                    <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 28px)', alignItems: 'baseline' }}>
                      {countdownParts.map((cp) => (
                        <div key={cp.unit} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ font: '400 clamp(36px, 5vw, 56px)/1 var(--font-mono)', color: '#ece7db', fontVariantNumeric: 'tabular-nums' }}>{cp.value}</span>
                          <span style={{ font: '500 10px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#a8a294', textTransform: 'uppercase' }}>{cp.unit}</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ margin: 0, font: '400 15px/1.5 var(--font-sans)', color: '#a8a294' }}>{dropDateLabel}</p>
                  </>
                ) : (
                  <p style={{ margin: 0, font: "400 clamp(24px, 3vw, 32px)/1.25 'Libre Caslon Text', Georgia, serif", color: '#ece7db', maxWidth: '22ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>Batch 001. The date is announced to the list first.</p>
                )}
                <p style={{ margin: 0, font: '400 14px/1.55 var(--font-sans)', color: '#a8a294', maxWidth: '44ch' }}>Four patterns. Sgian dubhs, a field knife in antler, a chef knife in bog oak, and a Highland dirk. Numbered, signed, and never restocked.</p>
              </div>
              <VipCapture headline="Batch 001 goes to the list first." />
            </div>
          </section>

          {/* Scabbard Proof Section */}
          <section style={{ borderTop: '1px solid rgba(236,231,219,0.1)', background: '#1b1916' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', aspectRatio: '16/9', width: '100%' }}>
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#25211c', border: '1px solid rgba(236,231,219,0.08)' }}>
                  <img src={scabbard4} alt="The ceremonial scabbard for the Sword of State" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#25211c', border: '1px solid rgba(236,231,219,0.08)' }}>
                  <img src={scabbard3} alt="Gold-leaf lettering details on the sword blade" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#c98b46', textTransform: 'uppercase' }}>Provenance & Craft</span>
                <h2 style={{ margin: 0, font: "400 clamp(24px, 3vw, 32px)/1.25 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>
                  Vogie Forge made the scabbard presented to King Charles III.
                </h2>
                <p style={{ margin: 0, font: '400 15px/1.6 var(--font-sans)', color: '#a8a294', maxWidth: '44ch' }}>
                  The forge trusted with the scabbard for the Elizabeth Sword of State in 2023. Read the story of the commission and see the details of the royal presentation piece.
                </p>
                <a href="#/the-scabbard" onClick={(e) => { e.preventDefault(); navigate("the-scabbard"); }} style={{ font: '500 14px/1 var(--font-sans)', color: '#c98b46', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                  Read the scabbard story →
                </a>
              </div>
            </div>
          </section>

          {/* Tier showcase */}
          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(64px, 10vw, 120px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <h2 style={{ margin: 0, font: "400 clamp(28px, 4vw, 40px)/1.15 'Libre Caslon Text', Georgia, serif", color: '#ece7db', maxWidth: '24ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>Three tiers. One forge.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px', alignItems: 'stretch' }}>
              
              {/* Vanguard Tier */}
              <a 
                href="#/product/bog-oak-sgian-dubh" 
                onClick={(e) => { e.preventDefault(); navigate("product", "bog-oak-sgian-dubh"); }} 
                className="tier-card-redesign"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#1b1916', border: '1px solid rgba(236,231,219,0.1)', borderRadius: '16px', overflow: 'hidden' }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', background: '#25211c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(236,231,219,0.08)', overflow: 'hidden' }}>
                  <span style={{ font: '500 11px/1.5 var(--font-mono)', color: '#6f695e', letterSpacing: '0.08em', textAlign: 'center', padding: '0 24px' }}>Photo slot · sgian dubh trio, raking light</span>
                  <img src="https://static.wixstatic.com/media/cd5cc7_cd11fc4d7bc64048afa7010bd81a2bef~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg" alt="Vanguard Sgian Dubh" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#a8a294', textTransform: 'uppercase' }}>The Vanguard · $350 to $450</span>
                  <span style={{ font: "400 24px/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Everyday carry, heirloom grade</span>
                  <p style={{ margin: 0, font: '400 14px/1.55 var(--font-sans)', color: '#a8a294' }}>Sgian dubhs and Highland field knives. The bulk of every batch, forged to be carried and used.</p>
                </div>
              </a>

              {/* Elite Tier */}
              <a 
                href="#/product/highland-dirk" 
                onClick={(e) => { e.preventDefault(); navigate("product", "highland-dirk"); }} 
                className="tier-card-redesign"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#1b1916', border: '1px solid rgba(236,231,219,0.1)', borderRadius: '16px', overflow: 'hidden' }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', background: '#25211c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(236,231,219,0.08)', overflow: 'hidden' }}>
                  <span style={{ font: '500 11px/1.5 var(--font-mono)', color: '#6f695e', letterSpacing: '0.08em', textAlign: 'center', padding: '0 24px' }}>Photo slot · dirk with bog oak grip</span>
                  <img src="https://static.wixstatic.com/media/cd5cc7_0141010818d14e8e881f908b3d3c3a34~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg" alt="Highland Dirk" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#a8a294', textTransform: 'uppercase' }}>The Elite · $600 to $800</span>
                  <span style={{ font: "400 24px/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Exotic materials, small editions</span>
                  <p style={{ margin: 0, font: '400 14px/1.55 var(--font-sans)', color: '#a8a294' }}>Dirks, camp choppers and chef knives in bog oak, stag and burl. Editions of two to four.</p>
                </div>
              </a>

              {/* Halo Tier */}
              <a 
                href="#/collection" 
                onClick={(e) => { e.preventDefault(); setFilter("halo"); navigate("collection"); }} 
                className="halo-card-redesign"
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'var(--paper-0)', border: '1px solid rgba(27,25,22,0.15)', borderRadius: '16px', overflow: 'hidden' }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--paper-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(27,25,22,0.1)', overflow: 'hidden' }}>
                  <span style={{ font: '500 11px/1.5 var(--font-mono)', color: '#8b8478', letterSpacing: '0.08em', textAlign: 'center', padding: '0 24px' }}>Photo slot · claymore, full length on parchment</span>
                  <img src="https://static.wixstatic.com/media/cd5cc7_608d3041215b438d84866f1eb6f050fc~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg" alt="Halo Claymore" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                </div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#a06a2c', textTransform: 'uppercase' }}>The Halo · from $2,500</span>
                  <span style={{ font: "400 24px/1.2 'Libre Caslon Text', Georgia, serif", color: '#1b1916' }}>Heritage functional art</span>
                  <p style={{ margin: 0, font: '400 14px/1.55 var(--font-sans)', color: '#56524a' }}>Claymores and basket hilt broadswords to historical patterns. Fully hand-forged. Two to four leave the forge each year.</p>
                </div>
              </a>

            </div>
          </section>

          {/* Story teaser */}
          <section style={{ borderTop: '1px solid rgba(236,231,219,0.1)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(56px, 8vw, 96px) clamp(16px, 4vw, 40px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center' }}>
              <div style={{ aspectRatio: '4/3', borderRadius: '16px', overflow: 'hidden', background: '#25211c', position: 'relative' }}>
                <img src="https://static.wixstatic.com/media/cd5cc7_67c1cf771af24387bc58606f37af38c6~mv2.jpg" alt="Hand-forged Highland blades laid out in the Vogie Forge workshop" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ margin: 0, font: "400 clamp(22px, 2.6vw, 28px)/1.4 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>Dane Vogelpohl trained in the Highland tradition in Crieff, Scotland, and now forges high-carbon steel in Ohio, USA. Drawing from the lineage of crafting the scabbard for the Elizabeth Sword of State presented to King Charles III in 2023, he brings the ancient craft to America.</p>
                <a href="#/forge" onClick={(e) => { e.preventDefault(); navigate("forge"); }} style={{ font: '500 14px/1 var(--font-sans)', color: '#c98b46', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 150ms' }} onMouseEnter={(e) => e.currentTarget.style.color = '#d89c57'} onMouseLeave={(e) => e.currentTarget.style.color = '#c98b46'}>Read about the forge →</a>
              </div>
            </div>
          </section>

          {/* Culinary feature */}
          <section style={{ borderTop: '1px solid rgba(236,231,219,0.1)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(56px, 8vw, 96px) clamp(16px, 4vw, 40px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#a8a294', textTransform: 'uppercase' }}>The culinary line</span>
                <h2 style={{ margin: 0, font: "400 clamp(26px, 3.4vw, 36px)/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>{chef.name}</h2>
                <p style={{ margin: 0, font: '400 15px/1.6 var(--font-sans)', color: '#a8a294', maxWidth: '48ch' }}>{chef.desc}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                  <span style={{ font: '400 18px/1 var(--font-mono)', color: '#ece7db' }}>{chef.priceLabel}</span>
                  <span style={{ font: "400 15px/1 'Libre Caslon Text', Georgia, serif", fontStyle: 'italic', color: '#c98b46' }}>{chef.editionLabel}</span>
                </div>
                <a href="#/culinary" onClick={(e) => { e.preventDefault(); navigate("culinary"); }} style={{ font: '500 14px/1 var(--font-sans)', color: '#c98b46', textDecoration: 'none', transition: 'color 150ms' }} onMouseEnter={(e) => e.currentTarget.style.color = '#d89c57'} onMouseLeave={(e) => e.currentTarget.style.color = '#c98b46'}>See the kitchen line →</a>
              </div>
              <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '16px', background: '#25211c', border: '1px solid rgba(236,231,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <span style={{ font: '500 11px/1.5 var(--font-mono)', color: '#6f695e', letterSpacing: '0.08em', textAlign: 'center', padding: '0 24px' }}>{chef.photoLabel}</span>
                <img src={chef.image} alt={chef.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
            </div>
          </section>

          {/* Scripture Oath Teaser Banner (PORTED FROM OLD APP) */}
          <section style={{ borderTop: '1px solid rgba(236,231,219,0.1)', background: '#1b1916' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(56px, 8vw, 96px) clamp(16px, 4vw, 40px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#a8a294', textTransform: 'uppercase' }}>Sword of the Spirit</span>
                <h2 style={{ margin: 0, font: "400 clamp(26px, 3.4vw, 36px)/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>The Scripture Oath</h2>
                <p style={{ margin: 0, font: '400 15px/1.6 var(--font-sans)', color: '#a8a294', maxWidth: '48ch' }}>At Vogie Forge, our blades are forged in honesty and steel. We believe the written Word of God is the true 'Sword of the Spirit'. In support of this belief, we offer free copies of the King James Bible to anyone upon request.</p>
                <a href="#/scripture" onClick={(e) => { e.preventDefault(); navigate("scripture"); }} style={{ font: '500 15px/1 var(--font-sans)', color: '#1b1916', background: '#c98b46', textDecoration: 'none', padding: '14px 26px', borderRadius: '999px', alignSelf: 'flex-start', textAlign: 'center', transition: 'background 150ms cubic-bezier(0.16,1,0.3,1)', fontWeight: 'bold' }} className="btn-gold">Read Scripture Oath</a>
              </div>
              <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '16px', background: '#25211c', border: '1px solid rgba(236,231,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <span style={{ font: '500 11px/1.5 var(--font-mono)', color: '#6f695e', letterSpacing: '0.08em', textAlign: 'center', padding: '0 24px' }}>Bible layout · gold leaf pages, dark ground</span>
                <img src="https://static.wixstatic.com/media/cd5cc7_cd11fc4d7bc64048afa7010bd81a2bef~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg" alt="King James Bible on parchment" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.2) contrast(1.1) brightness(0.9)' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
            </div>
          </section>

          {/* Final capture */}
          <section style={{ borderTop: '1px solid rgba(236,231,219,0.1)', background: '#1b1916' }}>
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: 'clamp(56px, 8vw, 96px) clamp(16px, 4vw, 40px)' }}>
              <VipCapture headline="Fifteen to forty blades. Then gone." />
            </div>
          </section>
        </main>
      )}

      {/* DROPS */}
      {isDrops && (
        <main data-screen-label="Drops" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: 'clamp(48px, 7vw, 80px)' }}>
          <header style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid rgba(236,231,219,0.1)', paddingBottom: '32px' }}>
            <h1 style={{ margin: 0, font: "400 clamp(34px, 5vw, 52px)/1.1 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Drops</h1>
            <p style={{ margin: 0, font: '400 16px/1.6 var(--font-sans)', color: '#a8a294', maxWidth: '56ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>Every blade leaves this forge as part of a numbered batch. When a batch sells through, it is finished. Nothing is restocked.</p>
          </header>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#c98b46', textTransform: 'uppercase' }}>Batch 001 · 15 blades · upcoming</span>
              <span style={{ font: '400 14px/1.4 var(--font-sans)', color: '#a8a294' }}>{dropStatusLine}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))', gap: '20px' }}>
              {DECORATED_BATCH.map((p) => (
                <a 
                  key={p.slug}
                  href={p.href} 
                  onClick={(e) => { e.preventDefault(); navigate("product", p.slug); }} 
                  className="drops-card-redesign"
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#1b1916', border: '1px solid rgba(236,231,219,0.1)', borderRadius: '16px', overflow: 'hidden' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4/3', background: '#25211c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(236,231,219,0.08)', overflow: 'hidden' }}>
                    <span style={{ font: '500 10px/1.5 var(--font-mono)', color: '#6f695e', letterSpacing: '0.08em', textAlign: 'center', padding: '0 20px' }}>{p.photoLabel}</span>
                    <img src={p.image} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ font: "400 19px/1.25 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>{p.name}</span>
                      <span style={{ font: '500 10px/1.4 var(--font-mono)', letterSpacing: '0.1em', color: '#6f695e', textTransform: 'uppercase' }}>{p.steel} · {p.hrc}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: 'auto' }}>
                      <span style={{ font: '400 16px/1 var(--font-mono)', color: '#ece7db' }}>{p.priceLabel}</span>
                      <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', background: 'var(--paper-0)', border: '1px solid rgba(27,25,22,0.25)', borderRadius: '3px', padding: '5px 9px', transform: 'rotate(-1.4deg)' }}>
                        <span style={{ font: '500 8px/1 var(--font-mono)', letterSpacing: '0.16em', color: '#8b8478', textTransform: 'uppercase' }}>Batch 001</span>
                        <span style={{ font: "400 13px/1 'Libre Caslon Text', Georgia, serif", fontStyle: 'italic', color: '#1b1916' }}>{p.editionLabel}</span>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderTop: '1px solid rgba(236,231,219,0.1)', paddingTop: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h2 style={{ margin: 0, font: "400 clamp(24px, 3vw, 32px)/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>The record</h2>
              <p style={{ margin: 0, font: '400 16px/1.6 var(--font-sans)', color: '#a8a294', maxWidth: '60ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>Before the batch era, blades left this forge as single commissions. Every sold piece stays on record. Batch sell-through records will appear here from Batch 001 onward.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
              {DECORATED_ARCHIVE.map((a, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', background: '#1b1916', border: '1px solid rgba(236,231,219,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', aspectRatio: '4/3', background: '#25211c', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <span style={{ font: '500 10px/1.5 var(--font-mono)', color: '#6f695e', letterSpacing: '0.08em', textAlign: 'center', padding: '0 20px' }}>{a.photoLabel}</span>
                    {a.image && <img src={a.image} alt={a.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />}
                  </div>
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ font: "400 17px/1.3 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>{a.name}</span>
                      <span style={{ font: '400 13px/1.5 var(--font-sans)', color: '#a8a294' }}>{a.note}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <span style={{ font: '500 10px/1 var(--font-mono)', letterSpacing: '0.14em', color: '#6f695e', textTransform: 'uppercase' }}>{a.tier}</span>
                      <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', background: 'var(--paper-0)', border: '1px solid rgba(27,25,22,0.25)', borderRadius: '3px', padding: '5px 9px', transform: 'rotate(1.2deg)' }}>
                        <span style={{ font: '500 8px/1 var(--font-mono)', letterSpacing: '0.16em', color: '#8b8478', textTransform: 'uppercase' }}>Forge record</span>
                        <span style={{ font: "400 13px/1 'Libre Caslon Text', Georgia, serif", fontStyle: 'italic', color: '#1b1916' }}>Sold</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* COLLECTION */}
      {isCollection && (
        <main data-screen-label="Collection" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <header style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h1 style={{ margin: 0, font: "400 clamp(34px, 5vw, 52px)/1.1 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Collection</h1>
            <p style={{ margin: 0, font: '400 15px/1.6 var(--font-sans)', color: '#a8a294', maxWidth: '56ch' }}>Every blade, current and sold. Filter by tier.</p>
          </header>
          <div role="group" aria-label="Filter by tier" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid rgba(236,231,219,0.1)', paddingBottom: '24px' }}>
            {filterPills.map((f) => (
              <button 
                key={f.id}
                onClick={f.set} 
                style={{ 
                  font: '500 13px/1 var(--font-sans)', 
                  color: f.color, 
                  background: f.bg, 
                  border: '1px solid ' + f.border, 
                  padding: '10px 18px', 
                  borderRadius: '999px', 
                  cursor: 'pointer', 
                  transition: 'all 150ms cubic-bezier(0.16,1,0.3,1)',
                  outline: 'none'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))', gap: '20px' }}>
            {filtered.map((p: CollectionProduct, idx: number) => {
              if (p.sold) {
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', background: '#1b1916', border: '1px solid rgba(236,231,219,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', aspectRatio: '4/3', background: '#25211c', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <span style={{ font: '500 10px/1.5 var(--font-mono)', color: '#6f695e', letterSpacing: '0.08em', textAlign: 'center', padding: '0 20px' }}>{p.photoLabel}</span>
                      {p.image && <img src={p.image} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />}
                    </div>
                    <div style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ font: "400 17px/1.3 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>{p.name}</span>
                        <span style={{ font: '500 10px/1 var(--font-mono)', letterSpacing: '0.14em', color: '#6f695e', textTransform: 'uppercase' }}>{p.tier}</span>
                      </div>
                      <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', background: 'var(--paper-0)', border: '1px solid rgba(27,25,22,0.25)', borderRadius: '3px', padding: '5px 9px', transform: 'rotate(1.2deg)', flexShrink: 0 }}>
                        <span style={{ font: '500 8px/1 var(--font-mono)', letterSpacing: '0.16em', color: '#8b8478', textTransform: 'uppercase' }}>Forge record</span>
                        <span style={{ font: "400 13px/1 'Libre Caslon Text', Georgia, serif", fontStyle: 'italic', color: '#1b1916' }}>Sold</span>
                      </span>
                    </div>
                  </div>
                );
              }
              return (
                <a 
                  key={idx}
                  href={p.href} 
                  onClick={(e) => { e.preventDefault(); navigate("product", p.slug); }} 
                  className="drops-card-redesign"
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#1b1916', border: '1px solid rgba(236,231,219,0.1)', borderRadius: '16px', overflow: 'hidden' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4/3', background: '#25211c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(236,231,219,0.08)', overflow: 'hidden' }}>
                    <span style={{ font: '500 10px/1.5 var(--font-mono)', color: '#6f695e', letterSpacing: '0.08em', textAlign: 'center', padding: '0 20px' }}>{p.photoLabel}</span>
                    <img src={p.image} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                  </div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ font: "400 19px/1.25 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>{p.name}</span>
                      <span style={{ font: '500 10px/1.4 var(--font-mono)', letterSpacing: '0.1em', color: '#6f695e', textTransform: 'uppercase' }}>{p.steel} · {p.hrc}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: 'auto' }}>
                      <span style={{ font: '400 16px/1 var(--font-mono)', color: '#ece7db' }}>{p.priceLabel}</span>
                      <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', background: 'var(--paper-0)', border: '1px solid rgba(27,25,22,0.25)', borderRadius: '3px', padding: '5px 9px', transform: 'rotate(-1.4deg)' }}>
                        <span style={{ font: '500 8px/1 var(--font-mono)', letterSpacing: '0.16em', color: '#8b8478', textTransform: 'uppercase' }}>Batch 001</span>
                        <span style={{ font: "400 13px/1 'Libre Caslon Text', Georgia, serif", fontStyle: 'italic', color: '#1b1916' }}>{p.editionLabel}</span>
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </main>
      )}

      {/* PRODUCT */}
      {isProduct && (
        <main data-screen-label="Product" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(32px, 5vw, 64px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a href="#/drops" onClick={(e) => { e.preventDefault(); navigate("drops"); }} style={{ font: '500 12px/1 var(--font-mono)', color: '#a8a294', textDecoration: 'none', transition: 'color 150ms' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ece7db'} onMouseLeave={(e) => e.currentTarget.style.color = '#a8a294'}>Drops</a>
            <span style={{ font: '500 12px/1 var(--font-mono)', color: '#6f695e' }}>/</span>
            <span style={{ font: '500 12px/1 var(--font-mono)', color: '#ece7db' }}>Batch 001</span>
          </nav>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: '16px', background: '#25211c', border: '1px solid rgba(236,231,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <span style={{ font: '500 11px/1.6 var(--font-mono)', color: '#6f695e', letterSpacing: '0.08em', textAlign: 'center', padding: '0 28px', maxWidth: '30ch' }}>{product.photoLabel}</span>
                <img src={product.image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <span style={{ font: '400 12px/1.5 var(--font-sans)', color: '#6f695e' }}>Photography note: dark ground, raking light, blade angled away from the camera.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#c98b46', textTransform: 'uppercase' }}>{product.tier} · Batch 001</span>
                <h1 style={{ margin: 0, font: "400 clamp(30px, 4vw, 44px)/1.12 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>{product.name}</h1>
                <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#a8a294', maxWidth: '52ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>{product.desc}</p>
                {product.tier.toLowerCase() === 'halo' && (
                  <p style={{ margin: '8px 0 0', font: '500 13px/1 var(--font-sans)', color: '#c98b46', fontStyle: 'italic' }}>
                    From the forge that made the King's scabbard.
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                  <span style={{ font: '400 24px/1 var(--font-mono)', color: '#ece7db' }}>{product.priceLabel}</span>
                  <span style={{ font: "400 16px/1 'Libre Caslon Text', Georgia, serif", fontStyle: 'italic', color: '#c98b46' }}>{product.editionLabel}</span>
                </div>
              </div>

              {!buyLive ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid rgba(236,231,219,0.12)', borderRadius: '16px', padding: '18px 20px', background: '#1b1916' }}>
                  <span style={{ font: '500 12px/1 var(--font-mono)', letterSpacing: '0.14em', color: '#a8a294', textTransform: 'uppercase' }}>Locked until release</span>
                  <span style={{ font: '400 14px/1.55 var(--font-sans)', color: '#a8a294' }}>{dropStatusLine} The list buys first.</span>
                </div>
              ) : (
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" style={{ alignSelf: 'flex-start', font: '500 15px/1 var(--font-sans)', color: '#1b1916', background: '#c98b46', textDecoration: 'none', padding: '15px 28px', borderRadius: '999px', fontWeight: 'bold' }} className="btn-gold">Claim this edition</a>
              )}

              {/* Certificate spec block */}
              <div style={{ background: 'var(--paper-0)', border: '1px solid rgba(27,25,22,0.35)', borderRadius: '6px', padding: '7px', boxShadow: '0 6px 28px rgba(0,0,0,0.45)' }}>
                <div style={{ border: '1px solid rgba(27,25,22,0.18)', borderRadius: '3px', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ font: "400 19px/1.2 'Libre Caslon Text', Georgia, serif", color: '#1b1916' }}>Certificate of authenticity</span>
                      <span style={{ font: '500 9px/1 var(--font-mono)', letterSpacing: '0.2em', color: '#8b8478', textTransform: 'uppercase' }}>Vogie Forge · Ohio, USA</span>
                    </div>
                    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', alignItems: 'center', transform: 'rotate(2deg)', border: '1px solid rgba(160,106,44,0.5)', borderRadius: '3px', padding: '6px 10px' }}>
                      <span style={{ font: '500 8px/1 var(--font-mono)', letterSpacing: '0.16em', color: '#a06a2c', textTransform: 'uppercase' }}>Batch 001</span>
                      <span style={{ font: "400 17px/1 'Libre Caslon Text', Georgia, serif", fontStyle: 'italic', color: '#1b1916', whiteSpace: 'nowrap' }}>No. __ of {product.edition}</span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {specRows.map((row, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '12px', padding: '8px 0', borderTop: '1px solid rgba(27,25,22,0.1)' }}>
                        <span style={{ font: '500 10px/1.6 var(--font-mono)', letterSpacing: '0.12em', color: '#8b8478', textTransform: 'uppercase' }}>{row.label}</span>
                        <span style={{ font: '400 14px/1.5 var(--font-sans)', color: '#1b1916' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <span style={{ font: "400 12px/1.5 'Libre Caslon Text', Georgia, serif", fontStyle: 'italic', color: '#56524a' }}>Numbered and signed by hand at release.</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#a8a294', textTransform: 'uppercase' }}>In the box</span>
                <span style={{ font: '400 14px/1.6 var(--font-sans)', color: '#a8a294', maxWidth: '52ch' }}>{product.inBox}</span>
              </div>

              <VipCapture headline="The list hears about every batch first." />
            </div>
          </div>
        </main>
      )}

      {/* CULINARY */}
      {isCulinary && (
        <main data-screen-label="Culinary" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          <header style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '70ch' }}>
            <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#c98b46', textTransform: 'uppercase' }}>The culinary line</span>
            <h1 style={{ margin: 0, font: "400 clamp(34px, 5vw, 52px)/1.1 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>High-carbon steel belongs in a kitchen.</h1>
            <p style={{ margin: 0, font: '400 16px/1.65 var(--font-sans)', color: '#a8a294', maxWidth: '58ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>The same steel, the same quench, the same bog oak as the Highland patterns. Hardened past 61 HRC, ground thin behind the edge, and left to earn a patina. Every batch carries at least one kitchen blade.</p>
          </header>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center' }}>
            <a 
              href={chef.href} 
              onClick={(e) => { e.preventDefault(); navigate("product", chef.slug); }} 
              className="drops-card-redesign"
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#1b1916', border: '1px solid rgba(236,231,219,0.1)', borderRadius: '16px', overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', aspectRatio: '4/3', background: '#25211c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(236,231,219,0.08)', overflow: 'hidden' }}>
                <span style={{ font: '500 10px/1.5 var(--font-mono)', color: '#6f695e', letterSpacing: '0.08em', textAlign: 'center', padding: '0 20px' }}>{chef.photoLabel}</span>
                <img src={chef.image} alt={chef.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ font: "400 20px/1.25 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>{chef.name}</span>
                  <span style={{ font: '400 16px/1 var(--font-mono)', color: '#ece7db' }}>{chef.priceLabel}</span>
                </div>
                <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px', background: 'var(--paper-0)', border: '1px solid rgba(27,25,22,0.25)', borderRadius: '3px', padding: '5px 9px', transform: 'rotate(-1.4deg)' }}>
                  <span style={{ font: '500 8px/1 var(--font-mono)', letterSpacing: '0.16em', color: '#8b8478', textTransform: 'uppercase' }}>Batch 001</span>
                  <span style={{ font: "400 13px/1 'Libre Caslon Text', Georgia, serif", fontStyle: 'italic', color: '#1b1916' }}>{chef.editionLabel}</span>
                </span>
              </div>
            </a>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, font: "400 clamp(20px, 2.2vw, 24px)/1.45 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>A carbon-steel kitchen knife asks one thing of you: dry it after use. In return it takes an edge stainless cannot hold.</p>
              <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#a8a294', maxWidth: '52ch' }}>The grey-blue patina that forms over months of cutting is not damage. It is the record of your kitchen, and it protects the steel. The care guide covers the rest.</p>
              <a href="#/care" onClick={(e) => { e.preventDefault(); navigate("care"); }} style={{ font: '500 14px/1 var(--font-sans)', color: '#c98b46', textDecoration: 'none', transition: 'color 150ms' }} onMouseEnter={(e) => e.currentTarget.style.color = '#d89c57'} onMouseLeave={(e) => e.currentTarget.style.color = '#c98b46'}>Read the care guide →</a>
            </div>
          </div>
        </main>
      )}

      {/* THE FORGE */}
      {isForge && (
        <main data-screen-label="The forge" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: 'clamp(48px, 7vw, 80px)' }}>
          <header style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#c98b46', textTransform: 'uppercase' }}>Our Story</span>
              <h1 style={{ margin: 0, font: "400 clamp(34px, 5vw, 52px)/1.1 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>Highland lineage, forged in America</h1>
              <p style={{ margin: 0, font: '400 16px/1.65 var(--font-sans)', color: '#a8a294', maxWidth: '56ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>
                Dane Vogelpohl came to bladesmithing through the trades—a machinist's certificate, years at a machine shop, woodcarving, woodturning, and bagpipe-making in Scotland. In the Perthshire town of Crieff, he trained in the Highland tradition, drawing out high-carbon steel under the forge hammer and crafting working patterns like the sgian dubh, dirk, and claymore.
              </p>
              <p style={{ margin: 0, font: '400 16px/1.65 var(--font-sans)', color: '#a8a294', maxWidth: '56ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>
                The culmination of this Scottish chapter came in 2023, when Vogie Forge was commissioned to craft the oak scabbard presented to King Charles III for the Elizabeth Sword of State. This commission tested the bounds of historical craft and earned the forge a place in modern Scottish heritage.
              </p>
              <p style={{ margin: 0, font: '400 16px/1.65 var(--font-sans)', color: '#a8a294', maxWidth: '56ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>
                Today, Vogie Forge has relocated to Ohio, USA. The move brings the Highland lineage to American soil. Every blade in Batch 001 and forward is hand-forged in the USA, carrying the same training, materials, and rigor that built the King's scabbard.
              </p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
                <a href="#/the-scabbard" onClick={(e) => { e.preventDefault(); navigate("the-scabbard"); }} style={{ font: '500 14px/1 var(--font-sans)', color: '#c98b46', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>Read the Scabbard Story →</a>
              </div>
            </div>
            <div style={{ aspectRatio: '4/3', borderRadius: '16px', overflow: 'hidden', background: '#25211c', position: 'relative' }}>
              <img src="https://static.wixstatic.com/media/cd5cc7_89e156a4623340d59bd3b7263dcb518c-mv2.jpg" alt="The forge fire at Vogie Forge" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = "https://static.wixstatic.com/media/cd5cc7_89e156a4623340d59bd3b7263dcb518c~mv2.jpg"; }} />
            </div>
          </header>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <h2 style={{ margin: 0, font: "400 clamp(24px, 3vw, 32px)/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Five steps, all in-house</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ aspectRatio: '1', borderRadius: '12px', background: '#25211c', border: '1px solid rgba(236,231,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ font: '500 10px/1.5 var(--font-mono)', color: '#6f695e', textAlign: 'center', padding: '0 16px' }}>Photo slot · forging</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><span style={{ font: "400 18px/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Forge</span><span style={{ font: '400 13px/1.55 var(--font-sans)', color: '#a8a294' }}>Drawn out from thick high-carbon stock, not cut from flat bar. The taper is made with the hammer.</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ aspectRatio: '1', borderRadius: '12px', background: '#25211c', border: '1px solid rgba(236,231,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ font: '500 10px/1.5 var(--font-mono)', color: '#6f695e', textAlign: 'center', padding: '0 16px' }}>Photo slot · grinding</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><span style={{ font: "400 18px/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Grind</span><span style={{ font: '400 13px/1.55 var(--font-sans)', color: '#a8a294' }}>Bevels set by eye and hand. Fullers cut, surfaces refined through the grits.</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ aspectRatio: '1', borderRadius: '12px', background: '#25211c', border: '1px solid rgba(236,231,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ font: '500 10px/1.5 var(--font-mono)', color: '#6f695e', textAlign: 'center', padding: '0 16px' }}>Photo slot · the quench</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><span style={{ font: "400 18px/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Quench</span><span style={{ font: '400 13px/1.55 var(--font-sans)', color: '#a8a294' }}>Heated to critical, quenched in oil, then tempered for toughness. Hardness is verified, not assumed.</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ aspectRatio: '1', borderRadius: '12px', background: '#25211c', border: '1px solid rgba(236,231,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ font: '500 10px/1.5 var(--font-mono)', color: '#6f695e', textAlign: 'center', padding: '0 16px' }}>Photo slot · fitting</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><span style={{ font: "400 18px/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Fit</span><span style={{ font: '400 13px/1.55 var(--font-sans)', color: '#a8a294' }}>Bog oak, antler and brass fitted tight by hand. Scabbards carved from wood, stitched in leather.</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ aspectRatio: '1', borderRadius: '12px', background: '#25211c', border: '1px solid rgba(236,231,219,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ font: '500 10px/1.5 var(--font-mono)', color: '#6f695e', textAlign: 'center', padding: '0 16px' }}>Photo slot · sharpening</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><span style={{ font: "400 18px/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Sharpen</span><span style={{ font: '400 13px/1.55 var(--font-sans)', color: '#a8a294' }}>Every blade ships oiled and sharpened, signed and numbered by hand.</span></div>
              </div>
            </div>
            <p style={{ margin: 0, font: '400 14px/1.6 var(--font-sans)', color: '#6f695e', maxWidth: '64ch', borderTop: '1px solid rgba(236,231,219,0.1)', paddingTop: '20px' }}>Honest provenance: forging, grinding, heat treatment, handle work, carving and sheath work happen in this workshop. Steel stock, leather and raw antler are bought in. Nothing is outsourced to a factory.</p>
          </section>
        </main>
      )}

      {/* CARE */}
      {isCare && (
        <main data-screen-label="Care" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          <header style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '720px', width: '100%' }}>
            <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#c98b46', textTransform: 'uppercase' }}>From the care card in your box</span>
            <h1 style={{ margin: 0, font: "400 clamp(34px, 5vw, 48px)/1.1 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Caring for high-carbon steel</h1>
            <p style={{ margin: 0, font: '400 15px/1.6 var(--font-sans)', color: '#a8a294', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>High-carbon steel holds a finer edge than stainless. The trade is five minutes of care a month. This is everything your blade needs.</p>
          </header>
          <div style={{ maxWidth: '720px', width: '100%', background: 'var(--paper-0)', border: '1px solid rgba(27,25,22,0.35)', borderRadius: '6px', padding: '7px', boxShadow: '0 8px 32px rgba(0,0,0,0.45)' }}>
            <div style={{ border: '1px solid rgba(27,25,22,0.18)', borderRadius: '3px', padding: 'clamp(24px, 5vw, 40px)', display: 'flex', flexDirection: 'column', gap: '24px', color: '#1b1916' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h2 style={{ margin: 0, font: "400 22px/1.2 'Libre Caslon Text', Georgia, serif", color: '#1b1916' }}>Dry it. Every time.</h2>
                <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#56524a' }}>Water is the only real enemy. Wipe the blade dry after use, especially after cutting anything acidic. Never leave a carbon blade wet in a sink or a sheath.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h2 style={{ margin: 0, font: "400 22px/1.2 'Libre Caslon Text', Georgia, serif", color: '#1b1916' }}>Oil it monthly.</h2>
                <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#56524a' }}>A thin film of oil keeps rust off in storage. Camellia or mineral oil for kitchen blades, any light machine oil for the rest. A drop on a cloth covers the whole blade.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h2 style={{ margin: 0, font: "400 22px/1.2 'Libre Caslon Text', Georgia, serif", color: '#1b1916' }}>Store it out of the sheath.</h2>
                <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#56524a' }}>Leather holds moisture and the tannins in it can mark steel. For long storage, keep the blade oiled, out of its sheath, somewhere dry.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h2 style={{ margin: 0, font: "400 22px/1.2 'Libre Caslon Text', Georgia, serif", color: '#1b1916' }}>Strop before you sharpen.</h2>
                <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#56524a' }}>A dozen passes on a leather strop brings the edge back for months before a stone is needed. When you do sharpen, a fine waterstone and the existing bevel angle are all it takes.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(27,25,22,0.12)', paddingTop: '20px' }}>
                <h2 style={{ margin: 0, font: "400 22px/1.2 'Libre Caslon Text', Georgia, serif", color: '#1b1916' }}>Patina is not rust.</h2>
                <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#56524a' }}>Grey and blue tones that develop with use are a stable oxide layer that protects the steel underneath. Leave it. Orange or pitted spots are rust: rub them out early with fine oiled steel wool and re-oil.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* FAQ */}
      {isFaq && (
        <main data-screen-label="FAQ" style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <h1 style={{ margin: 0, font: "400 clamp(34px, 5vw, 48px)/1.1 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Common questions</h1>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((f, idx) => (
              <div key={idx} style={{ borderTop: '1px solid rgba(236,231,219,0.1)', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h2 style={{ margin: 0, font: "400 20px/1.3 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>{f.q}</h2>
                <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#a8a294', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>{f.a}</p>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* VIP */}
      {isVip && (
        <main data-screen-label="VIP" style={{ maxWidth: '560px', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h1 style={{ margin: 0, font: "400 clamp(32px, 5vw, 44px)/1.12 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>The list is the front of the queue.</h1>
            <p style={{ margin: 0, font: '400 15px/1.6 var(--font-sans)', color: '#a8a294', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>Batch dates, edition counts and first access, 48 hours before public release. One or two emails per batch. Nothing else.</p>
          </div>
          <VipCapture headline="Batch 001 is announced here first." />
        </main>
      )}

      {/* CUSTOM */}
      {isCustom && (
        <main data-screen-label="Custom" style={{ maxWidth: '560px', margin: '0 auto', padding: 'clamp(48px, 8vw, 96px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#a8a294', textTransform: 'uppercase' }}>Commissions</span>
            <h1 style={{ margin: 0, font: "400 clamp(32px, 5vw, 44px)/1.12 'Libre Caslon Text', Georgia, serif", color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>The custom books are closed.</h1>
            <p style={{ margin: 0, font: '400 15px/1.6 var(--font-sans)', color: '#a8a294', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>All blades now release in numbered batches of 15 to 40, announced to the list first. The patterns you would have commissioned, sgian dubhs, dirks, claymores, now arrive as editions.</p>
          </div>
          <VipCapture headline="Want a blade? Join the list." />
        </main>
      )}

      {/* SCRIPTURE OATH DETAIL PAGE (PORTED FROM OLD APP) */}
      {isScripture && (
        <main data-screen-label="Scripture" style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <header style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
            <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#c98b46', textTransform: 'uppercase' }}>Scripture Reflection</span>
            <h1 style={{ margin: 0, font: "400 clamp(34px, 5vw, 48px)/1.1 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>The Sword of the Spirit</h1>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', border: '1px solid rgba(201,139,70,0.3)', borderRadius: '16px', padding: '24px', background: 'rgba(201,139,70,0.05)' }}>
            <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.12em', color: '#c98b46', textTransform: 'uppercase' }}>Ephesians 6 v17</span>
            <p style={{ margin: 0, font: "400 clamp(18px, 2.5vw, 22px)/1.5 'Libre Caslon Text', Georgia, serif", fontStyle: 'italic', color: '#ece7db', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>
              "And take the helmet of salvation, and the sword of the Spirit, which is the word of God:"
            </p>
          </div>

          <div style={{ background: 'var(--paper-0)', border: '1px solid rgba(27,25,22,0.35)', borderRadius: '6px', padding: '7px', boxShadow: '0 8px 32px rgba(0,0,0,0.45)' }}>
            <div style={{ border: '1px solid rgba(27,25,22,0.18)', borderRadius: '3px', padding: 'clamp(24px, 5vw, 40px)', display: 'flex', flexDirection: 'column', gap: '20px', color: '#1b1916' }}>
              <h2 style={{ margin: 0, font: "400 22px/1.2 'Libre Caslon Text', Georgia, serif", color: '#1b1916', textAlign: 'center', borderBottom: '1px solid rgba(27,25,22,0.12)', paddingBottom: '12px' }}>Concerning the Possession of God's Word</h2>
              
              <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#56524a', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>
                An interest in the sword will eventually lead one to recognise that history's best seller, the King James Bible, refers to itself as the 'sword of the Spirit'. Every sword is historically known for utility, a symbol of power as well as heritage.
              </p>

              <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#56524a', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>
                According to Hebrews chapter 4 v12, 'the word of God is quick, and powerful, and sharper than any two edged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and morrow, and is a discerner of the thoughts and intents of the heart.' 1 Peter 1 v23 says one is 'born again, not of corruptible seed, but of incorruptible, by the word of God, which liveth and abideth for ever.'
              </p>

              <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#56524a', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>
                In John 12 v48, Jesus says, 'He that rejecteth me, and receiveth not my words, hath one that judgeth him: the word that I have spoken, the same shall judge him in the last day.' It is interesting to see from scripture that God's word, or sword, is intended to be man's greatest friend, or greatest foe; the hope of our eternal salvation, or the instrument of our eternal destruction.
              </p>

              <p style={{ margin: 0, font: '400 15px/1.65 var(--font-sans)', color: '#56524a', textWrap: 'pretty' as React.CSSProperties['textWrap'], borderTop: '1px solid rgba(27,25,22,0.1)', paddingTop: '16px' }}>
                Considering all this, what sword could be of greater importance, or worth possessing? For this reason, Vogie Forge offers free King James Bibles upon request, while supplies last. If you would like to request one, please email us directly.
              </p>
              
              <div style={{ alignSelf: 'center', marginTop: '16px' }}>
                <a href="mailto:vogieforge@gmail.com?subject=Free Bible Request" style={{ font: '500 15px/1 var(--font-sans)', color: '#ece7db', background: '#1b1916', textDecoration: 'none', padding: '14px 24px', borderRadius: '999px', display: 'inline-block', transition: 'background 150ms cubic-bezier(0.16,1,0.3,1)', fontWeight: 'bold' }} className="btn-dark-hover">Request a Free Bible via Email</a>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* THE SCABBARD */}
      {isScabbard && (
        <main data-screen-label="The Scabbard" style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) clamp(16px, 4vw, 40px)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <header style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderBottom: '1px solid rgba(236,231,219,0.1)', paddingBottom: '24px' }}>
            <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.18em', color: '#c98b46', textTransform: 'uppercase' }}>Provenance</span>
            <h1 style={{ margin: 0, font: "400 clamp(34px, 5vw, 52px)/1.1 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>The King's Scabbard</h1>
            <p style={{ margin: 0, font: '400 16px/1.6 var(--font-sans)', color: '#a8a294', maxWidth: '64ch' }}>
              The story of the commission for the Elizabeth Sword of State, presented to King Charles III in 2023.
            </p>
          </header>

          <article style={{ display: 'flex', flexDirection: 'column', gap: '24px', font: '400 16px/1.65 var(--font-sans)', color: '#a8a294' }}>
            <p>
              In 2023, Scotland commissioned a new Sword of State to replace the historical Honours of Scotland, which could no longer be used due to their fragility. The new sword was named the Elizabeth Sword.
            </p>
            <p>
              Vogie Forge was trusted with crafting the wooden scabbard for this ceremonial sword. Blacksmith and woodworker Dane Vogelpohl crafted the scabbard from local Perthshire oak, sourcing, fitting, and carving the wood by hand. He also executed the detailed gold-leaf inscriptions and finishing work on the blade itself.
            </p>
            <p>
              The completed sword was presented to King Charles III during a National Service of Thanksgiving at St Giles' Cathedral in Edinburgh on 5 July 2023. It now resides with the Honours of Scotland in Edinburgh Castle.
            </p>
            <p>
              This work stands as the forge's single most important proof of craft. The same techniques, precision, and dedication to historical tradition used for the royal presentation sword are applied to every numbered batch piece we forge today.
            </p>
          </article>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
            <h2 style={{ margin: 0, font: "400 24px/1.2 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Gallery</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(236,231,219,0.1)', background: '#1b1916', aspectRatio: '4/3' }}>
                <img src={scabbard2} alt="Intricate gilding and etching details on the Elizabeth Sword" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(236,231,219,0.1)', background: '#1b1916', aspectRatio: '4/3' }}>
                <img src={scabbard3} alt="Gold-leaf lettering details on the sword blade" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(236,231,219,0.1)', background: '#1b1916', aspectRatio: '4/3' }}>
                <img src={scabbard4} alt="The final scabbard for the Sword of State" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(236,231,219,0.1)', background: '#1b1916', aspectRatio: '4/3' }}>
                <img src={scabbard6} alt="Hilt of the sword with the gold guard and purple grip" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(236,231,219,0.1)', background: '#1b1916', aspectRatio: '4/3' }}>
                <img src={scabbard12} alt="Sourcing, fitting and carving the scabbard wood" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>
          </section>

          <footer style={{ marginTop: '32px', borderTop: '1px solid rgba(236,231,219,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => navigate("drops")} style={{ font: '500 15px/1 var(--font-sans)', color: '#1b1916', background: '#c98b46', border: 'none', padding: '14px 28px', borderRadius: '999px', fontWeight: 'bold', cursor: 'pointer' }} className="btn-gold">View the current drop</button>
          </footer>
        </main>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(236,231,219,0.1)', background: '#0f0d0c', marginTop: 'clamp(48px, 8vw, 96px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) clamp(16px, 4vw, 40px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(32px, 6vw, 80px)', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ font: "700 20px/1 'Libre Caslon Text', Georgia, serif", color: '#ece7db' }}>Vogie Forge</span>
              <span style={{ font: '500 9px/1.6 var(--font-mono)', letterSpacing: '0.22em', color: '#a8a294', textTransform: 'uppercase' }}>Ohio · USA (Scottish Roots)</span>
            </div>
            <nav aria-label="Footer" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px 24px', maxWidth: '320px' }}>
              <a href="#/drops" onClick={(e) => { e.preventDefault(); navigate("drops"); }} className="footer-link-item">Drops</a>
              <a href="#/collection" onClick={(e) => { e.preventDefault(); navigate("collection"); }} className="footer-link-item">Collection</a>
              <a href="#/culinary" onClick={(e) => { e.preventDefault(); navigate("culinary"); }} className="footer-link-item">Culinary</a>
              <a href="#/forge" onClick={(e) => { e.preventDefault(); navigate("forge"); }} className="footer-link-item">The forge</a>
              <a href="#/the-scabbard" onClick={(e) => { e.preventDefault(); navigate("the-scabbard"); }} className="footer-link-item">The Scabbard</a>
              <a href="#/care" onClick={(e) => { e.preventDefault(); navigate("care"); }} className="footer-link-item">Care guide</a>
              <a href="#/faq" onClick={(e) => { e.preventDefault(); navigate("faq"); }} className="footer-link-item">FAQ</a>
              <a href="#/custom" onClick={(e) => { e.preventDefault(); navigate("custom"); }} className="footer-link-item">Commissions</a>
              <a href="#/vip" onClick={(e) => { e.preventDefault(); navigate("vip"); }} className="footer-link-item">The list</a>
              <a href="#/scripture" onClick={(e) => { e.preventDefault(); navigate("scripture"); }} className="footer-link-item">Scripture Oath</a>
            </nav>
            <p style={{ margin: 0, font: '400 12px/1.7 var(--font-sans)', color: '#6f695e', maxWidth: '44ch', textWrap: 'pretty' as React.CSSProperties['textWrap'] }}>Blades are sold to buyers aged 18 and over. Adult signature with age verification is required on delivery. Shipment of blades is restricted in some regions; confirm your local rules before ordering.</p>
            <span style={{ font: '500 11px/1 var(--font-mono)', color: '#6f695e' }}>© 2026 Vogie Forge · Forged in Ohio, USA</span>
          </div>
          <VipCapture headline="The next batch is announced here first." />
        </div>
      </footer>
    </div>
  );
}

export default App;
