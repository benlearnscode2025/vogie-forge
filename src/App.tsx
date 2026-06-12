import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Check, 
  ChevronDown, 
  ChevronRight,
  Menu,
  X,
  Lock,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import './App.css';

// ---------------------------------------------------------
// CONFIGURATION (Adjust placeholders below as needed)
// ---------------------------------------------------------
const CONFIG = {
  NEXT_DROP_DATE: "2026-07-15T18:00:00Z", // Set to "TBA" to test TBA state
  CHECKOUT_URL: "https://checkout.shopify.com/placeholder-vogie-forge", // Shopify checkout link or Buy Button target
  LIST_PROVIDER: "Klaviyo", // Klaviyo, Postscript, Attentive, etc.
  MAKER_NAME: "Dane Vogie",
  FORGE_LOCATION: "The Highlands, Scotland"
};

// ---------------------------------------------------------
// DATA MODELS & INTERFACES
// ---------------------------------------------------------
export interface Product {
  slug: string;
  name: string;
  tier: 'vanguard' | 'elite' | 'halo';
  category: 'sgian-dubh' | 'bushcraft' | 'dirk' | 'culinary' | 'claymore' | 'broadsword';
  price: number; 
  steel: string;
  hrc: number;
  bladeLength: string;
  overallLength: string;
  grind: string;
  handleMaterial: string;
  sheath: string;
  batch: string; // e.g. "Batch 001" or "Batch 000"
  editionSize: number; 
  editionNumber: string; // e.g. "04"
  status: 'upcoming' | 'live' | 'sold';
  sellOutTime?: string; // only for past drop items
  image: string;
  desc: string;
}

// ---------------------------------------------------------
// MOCK DATA CATALOG (Rebuilt around batch-drop model tiers)
// ---------------------------------------------------------
const PRODUCTS: Product[] = [
  // active Drop (Batch 001)
  {
    slug: 'cairngorm-sgian-dubh',
    name: 'Cairngorm Sgian Dubh',
    tier: 'vanguard',
    category: 'sgian-dubh',
    price: 390,
    steel: '1095 High Carbon Steel',
    hrc: 59,
    bladeLength: '3.5 in (8.9 cm)',
    overallLength: '7.5 in (19.0 cm)',
    grind: 'Flat grind',
    handleMaterial: 'Scottish bog oak with solid brass pins',
    sheath: 'Hand-stitched pocket leather sheath',
    batch: 'Batch 001',
    editionSize: 20,
    editionNumber: '04',
    status: 'upcoming', 
    image: 'https://static.wixstatic.com/media/cd5cc7_cd11fc4d7bc64048afa7010bd81a2bef~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg',
    desc: 'An heirloom-grade Highland stocking knife. The bog oak handle is reclaimed from peat bogs and carved with a traditional grip profile. Compact, historic, and balanced.'
  },
  {
    slug: 'glenfinnan-bushcraft',
    name: 'Glenfinnan Bushcraft',
    tier: 'vanguard',
    category: 'bushcraft',
    price: 420,
    steel: '80CrV2 High Carbon Steel',
    hrc: 60,
    bladeLength: '4.2 in (10.7 cm)',
    overallLength: '8.8 in (22.4 cm)',
    grind: 'Saber grind',
    handleMaterial: 'Stabilized Scottish burl elm with brass liners',
    sheath: 'Vegetable-tanned leather belt sheath',
    batch: 'Batch 001',
    editionSize: 15,
    editionNumber: '11',
    status: 'upcoming',
    image: 'https://static.wixstatic.com/media/cd5cc7_2fb62267a3b74570bb7c67d1eb216e62~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg',
    desc: 'Engineered for the Highland forests. The heavy-duty 80CrV2 steel blade is heat treated for extreme lateral strength and edge retention, suited for wilderness tasks.'
  },
  {
    slug: 'culloden-dirk',
    name: 'Culloden Dirk',
    tier: 'elite',
    category: 'dirk',
    price: 750,
    steel: '1095 & 15N20 Damascus (320 layers)',
    hrc: 59,
    bladeLength: '11.5 in (29.2 cm)',
    overallLength: '16.5 in (41.9 cm)',
    grind: 'Flat grind with swedge',
    handleMaterial: 'Hand-carved stag antler, brass collar and guard',
    sheath: 'Carved walnut wood wrapped in black calfskin leather',
    batch: 'Batch 001',
    editionSize: 10,
    editionNumber: '02',
    status: 'upcoming',
    image: 'https://static.wixstatic.com/media/cd5cc7_0141010818d14e8e881f908b3d3c3a34~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg',
    desc: 'A striking rendition of the Highland dirk. The hand-twisted pattern-welded steel core provides a dark texture, paired with a hand-fitted guard.'
  },
  {
    slug: 'hebridean-chef-blade',
    name: 'Hebridean Chef Blade',
    tier: 'elite',
    category: 'culinary',
    price: 680,
    steel: '1095 Carbon Steel core',
    hrc: 61,
    bladeLength: '8.5 in (21.6 cm)',
    overallLength: '13.5 in (34.3 cm)',
    grind: 'Full flat grind',
    handleMaterial: '5,000-year-old peat-preserved bog oak with copper pins',
    sheath: 'Heavy wool felt protective sleeve',
    batch: 'Batch 001',
    editionSize: 12,
    editionNumber: '05',
    status: 'upcoming',
    image: 'https://static.wixstatic.com/media/cd5cc7_dbc27d8854bc43d09a959cc0519f4703~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg',
    desc: 'An exceptional kitchen blade designed for professional culinary tasks. The peat-preserved bog oak handles are sourced from deep peat bogs in the Hebrides.'
  },
  {
    slug: 'highland-claymore',
    name: 'Highland Claymore',
    tier: 'halo',
    category: 'claymore',
    price: 3400,
    steel: '1095 Mono High Carbon Steel',
    hrc: 58,
    bladeLength: '38.0 in (96.5 cm)',
    overallLength: '50.0 in (127.0 cm)',
    grind: 'Diamond cross-section with distal taper',
    handleMaterial: 'Select Scottish Walnut wrapped in black cord',
    sheath: 'Carved oak wood scabbard with hand-carved fittings',
    batch: 'Batch 001',
    editionSize: 3,
    editionNumber: '1',
    status: 'upcoming',
    image: 'https://static.wixstatic.com/media/cd5cc7_608d3041215b438d84866f1eb6f050fc~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg',
    desc: 'A full two-handed Highland claymore, forged as a heritage functional art piece. Faithfully replicates the guard design and balance of historical museum relics.'
  },

  // Past Drop (Batch 000 - Sold Out)
  {
    slug: 'bannockburn-dirk',
    name: 'Bannockburn Dirk',
    tier: 'elite',
    category: 'dirk',
    price: 700,
    steel: '1095 High Carbon Steel',
    hrc: 59,
    bladeLength: '11.0 in (27.9 cm)',
    overallLength: '16.0 in (40.6 cm)',
    grind: 'Flat grind',
    handleMaterial: 'Peat-preserved bog oak with hand-filed steel fittings',
    sheath: 'Leather wrapped wood scabbard',
    batch: 'Batch 000',
    editionSize: 8,
    editionNumber: '03',
    status: 'sold',
    sellOutTime: '14 minutes',
    image: 'https://static.wixstatic.com/media/cd5cc7_a06d45bbf61f40f3a2ba49000ab99674~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg',
    desc: 'A compact and classic Highland dirk, forged and finished in our Scottish workshop. Sold out during Batch 000 release.'
  },
  {
    slug: 'highland-hunter',
    name: 'Highland Hunter',
    tier: 'vanguard',
    category: 'bushcraft',
    price: 380,
    steel: '80CrV2 Steel',
    hrc: 60,
    bladeLength: '4.0 in (10.2 cm)',
    overallLength: '8.5 in (21.6 cm)',
    grind: 'Saber grind',
    handleMaterial: 'Scottish Elm with mosaic brass pins',
    sheath: 'Leather belt sheath',
    batch: 'Batch 000',
    editionSize: 15,
    editionNumber: '07',
    status: 'sold',
    sellOutTime: '8 minutes',
    image: 'https://static.wixstatic.com/media/cd5cc7_3d4be62be7b64efaa085ec4e9b0f0477~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg',
    desc: 'An everyday carry field blade for heavy bushcraft use. Highly durable and balanced.'
  },
  {
    slug: 'orkney-sgian-dubh',
    name: 'Orkney Sgian Dubh',
    tier: 'vanguard',
    category: 'sgian-dubh',
    price: 350,
    steel: '1095 Carbon Steel',
    hrc: 59,
    bladeLength: '3.3 in (8.4 cm)',
    overallLength: '7.2 in (18.3 cm)',
    grind: 'Flat grind',
    handleMaterial: 'Peat-preserved bog oak',
    sheath: 'Leather pocket sheath',
    batch: 'Batch 000',
    editionSize: 20,
    editionNumber: '12',
    status: 'sold',
    sellOutTime: '22 minutes',
    image: 'https://static.wixstatic.com/media/cd5cc7_f1d89a542e2c4c6e8aa16d4d55029b13~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg',
    desc: 'Traditional sgian dubh stocking blade with classic celtic interlacing. Hand-crafted in Scotland.'
  },
  {
    slug: 'skye-bread-knife',
    name: 'Skye Bread Knife',
    tier: 'elite',
    category: 'culinary',
    price: 450,
    steel: '1095 Carbon Steel core',
    hrc: 61,
    bladeLength: '9.0 in (22.9 cm)',
    overallLength: '14.0 in (35.6 cm)',
    grind: 'Full flat with serration',
    handleMaterial: 'Scottish Walnut',
    sheath: 'Wood blade guard',
    batch: 'Batch 000',
    editionSize: 10,
    editionNumber: '02',
    status: 'sold',
    sellOutTime: '19 minutes',
    image: 'https://static.wixstatic.com/media/cd5cc7_dbc27d8854bc43d09a959cc0519f4703~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg',
    desc: 'An elegant long bread slicer from our kitchen line. Slices effortlessly and stays sharp.'
  },
  {
    slug: 'wallace-claymore',
    name: 'Wallace Claymore',
    tier: 'halo',
    category: 'claymore',
    price: 3100,
    steel: '1095 High Carbon Steel',
    hrc: 58,
    bladeLength: '37.5 in (95.3 cm)',
    overallLength: '49.0 in (124.5 cm)',
    grind: 'Diamond cross-section',
    handleMaterial: 'Scottish Oak wrapped in black leather',
    sheath: 'Oak scabbard',
    batch: 'Batch 000',
    editionSize: 3,
    editionNumber: '3',
    status: 'sold',
    sellOutTime: '5 minutes',
    image: 'https://static.wixstatic.com/media/cd5cc7_5480718775ed4f19a0d4026f304d129c~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg',
    desc: 'A massive claymore, forged in the traditional style. Made for collectors of heritage functional art.'
  }
];

// ---------------------------------------------------------
// FAQS (With updated restrictions and lexicon)
// ---------------------------------------------------------
const FAQS = [
  {
    question: 'How are your blades made? Is it stock removal?',
    answer: 'Absolutely not. All Vogie Forge blades are honestly hand-forged in Scotland. We draw them out from thick high carbon steel bar stock using hand hammers and an anvil. This process compacts the steel fibers along the edges, yielding structural properties, weight distribution, and edge-holding strength that flat bar-stock grinding cannot replicate.'
  },
  {
    question: 'Why do your blades taper towards the tip?',
    answer: 'Historical accuracy. Authentic blades kept in museums are thick near the guard (1/4" to 1/2") to provide rigidity and support, and taper to a thin tip (1/16") to ensure speed and maneuverability. We replicate this distal taper faithfully. Factory-made replicas are typically a uniform 3/16" thick, which makes them feel heavy and sluggish.'
  },
  {
    question: 'What is your batch release policy?',
    answer: 'We release our hand-forged work in small numbered batches of 15–40 pieces. We no longer accept custom orders or commissions. Once a batch sells out, it will not be restocked. VIP list members receive drop notifications 48 hours before the public.'
  },
  {
    question: 'Do you ship internationally? What are the age restrictions?',
    answer: 'Yes, we ship to most countries worldwide via secure, tracked courier services. All shipments require 18+ age verification upon delivery. Please ensure you comply with your regional legislation regarding the import and possession of hand-forged cutlery and collector items.'
  },
  {
    question: 'Do you offer sharpening services?',
    answer: 'We provide free lifetime sharpening and edge tuning for all Vogie Forge blades. The owner pays for shipping to our forge, and we will clean, oil, strop, and sharpen the piece before returning it.'
  }
];

const TESTIMONIALS = [
  {
    quote: "When I received my Claymore, I was speechless at the beauty of the blade and the amazing details that Dane had carved into the scabbard, really capturing the story of my ancestors; it was more than I could have imagined or asked for.",
    author: "Donna, U.S.A."
  },
  {
    quote: "Hey! The Bannockburn was delivered today, & I must say, It is astonishing! The first thing you notice when you pick this blade up, is how easy it is to handle. This is not a small blade, but it is very lively in the hands! Thank you!",
    author: "M.F. USA"
  },
  {
    quote: "A true Craftsman creating works of Art... Your Claymore will be a guaranteed hit at the Games... the new Claymore is over the top.",
    author: "President of Clan McDuffee, Indiana, USA"
  }
];

// ---------------------------------------------------------
// REUSABLE COMPONENTS
// ---------------------------------------------------------
function CelticDivider() {
  return (
    <div className="divider-ornamental">
      <svg width="240" height="24" viewBox="0 0 240 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M120 12c-15-10-30-10-45 0s-30 10-45 0S0 12 0 12s15-10 30 0 30 10 45 0 30-10 45 0" />
        <path d="M120 12c15-10 30-10 45 0s30 10 45 0S240 12 240 12s-15-10-30 0-30 10-45 0-30-10-45 0" />
        <circle cx="120" cy="12" r="3" fill="currentColor" />
        <circle cx="60" cy="12" r="1.5" fill="currentColor" />
        <circle cx="180" cy="12" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

function VipCapture() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect list provider embed
    // Embed target: {LIST_PROVIDER}
    setSuccess(true);
  };

  return (
    <div className="vip-capture-container iron-panel">
      {success ? (
        <div className="vip-success">
          <Check size={28} className="vip-success-icon" />
          <span className="success-tag">Joined the Vanguard</span>
          <p>Your details are recorded. You will receive drop notifications 48 hours before public release.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="vip-form">
          <div className="vip-header">
            <h3>Join the VIP List</h3>
            <p className="vip-promise">
              Drops are announced to the list 48 hours before anyone else. Batches run 15–40 blades. They do not restock.
            </p>
          </div>
          <div className="vip-fields">
            <input 
              type="email" 
              placeholder="Email address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="vip-input"
              aria-label="Email address"
            />
            <input 
              type="tel" 
              placeholder="Phone number (SMS optional)" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="vip-input"
              aria-label="Phone number"
            />
            <button type="submit" className="vip-submit-btn">
              Access the Next Drop
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// MAIN APPLICATION
// ---------------------------------------------------------
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Filters for collections page
  const [selectedTier, setSelectedTier] = useState<'all' | 'vanguard' | 'elite' | 'halo'>('all');

  // Navigation function declared before useEffects to avoid hoisting issues
  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to derive initial timer state
  const getInitialTimerState = () => {
    if (CONFIG.NEXT_DROP_DATE === "TBA") {
      return { timeLeft: null, isDropLive: false };
    }
    const targetDate = new Date(CONFIG.NEXT_DROP_DATE).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;
    if (difference <= 0) {
      return { timeLeft: null, isDropLive: true };
    } else {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      return { timeLeft: { days, hours, minutes, seconds }, isDropLive: false };
    }
  };

  const initialTimer = getInitialTimerState();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(initialTimer.timeLeft);
  const [isDropLive, setIsDropLive] = useState(initialTimer.isDropLive);

  // Client-side router logic
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    // Initial Path redirects (backward compatibility)
    const path = window.location.pathname;
    if (path === '/customizer' || path === '/contact') {
      setTimeout(() => navigate('/custom'), 0);
    } else if (path === '/wip') {
      setTimeout(() => navigate('/the-forge'), 0);
    } else if (path === '/qa') {
      setTimeout(() => navigate('/faq'), 0);
    } else if (path === '/godsword') {
      setTimeout(() => navigate('/scripture'), 0);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // SEO & Lexicon Metadata Sync
  useEffect(() => {
    let title = "Vogie Forge — Hand-Forged Highland Blades, Released in Numbered Batches";
    let description = "Sgian dubhs, dirks, claymores and culinary blades hand-forged in Scotland from high-carbon steel. Small numbered editions. Join the list for first access.";

    if (currentPath === '/drops') {
      title = "Vogie Forge — Numbered Batch Releases";
    } else if (currentPath === '/collection') {
      title = "Vogie Forge — The Heirloom Collection";
    } else if (currentPath.startsWith('/product/')) {
      const slug = currentPath.substring(9);
      const prod = PRODUCTS.find(p => p.slug === slug);
      if (prod) {
        title = `${prod.name} | Batch ${prod.batch} | Vogie Forge`;
        description = `${prod.name} — Edition of ${prod.editionSize}, No. ${prod.editionNumber}. Hand-forged in Scotland from ${prod.steel}.`;
      }
    } else if (currentPath === '/culinary') {
      title = "Vogie Forge — Culinary & Kitchen Line";
    } else if (currentPath === '/the-forge') {
      title = "Vogie Forge — Story & Hand-Forging Process";
    } else if (currentPath === '/care') {
      title = "High-Carbon Steel Care Guide — Vogie Forge";
    } else if (currentPath === '/faq') {
      title = "Frequently Asked Questions — Vogie Forge";
    } else if (currentPath === '/vip') {
      title = "VIP First Access List — Vogie Forge";
    } else if (currentPath === '/custom') {
      title = "Custom Work Books Closed — Vogie Forge";
    } else if (currentPath === '/scripture') {
      title = "The Scripture Oath — Vogie Forge";
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [currentPath]);

  // Drop countdown calculations
  useEffect(() => {
    if (CONFIG.NEXT_DROP_DATE === "TBA") return;

    const targetDate = new Date(CONFIG.NEXT_DROP_DATE).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsDropLive(true);
        setTimeLeft(null);
      } else {
        setIsDropLive(false);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Update dynamic products status based on drop timer
  const getUpdatedProducts = (): Product[] => {
    return PRODUCTS.map(p => {
      if (p.batch === 'Batch 001') {
        return {
          ...p,
          status: isDropLive ? 'live' : 'upcoming'
        };
      }
      return p;
    });
  };

  const currentProducts = getUpdatedProducts();

  // Helper to intercept default clicks for SPA router
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className="vogie-app">
      {/* Navigation bar */}
      <header className="navbar">
        <a href="/" className="nav-brand" onClick={(e) => handleLinkClick(e, '/')}>
          <div className="brand-emblem">VF</div>
          <span className="brand-text">VOGIE FORGE</span>
        </a>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-nav-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="/" className={`nav-link ${currentPath === '/' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, '/')}>Home</a>
          <a href="/drops" className={`nav-link ${currentPath === '/drops' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, '/drops')}>Drops</a>
          <a href="/collection" className={`nav-link ${currentPath === '/collection' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, '/collection')}>Collection</a>
          <a href="/culinary" className={`nav-link ${currentPath === '/culinary' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, '/culinary')}>Culinary</a>
          <a href="/the-forge" className={`nav-link ${currentPath === '/the-forge' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, '/the-forge')}>The Forge</a>
          <a href="/care" className={`nav-link ${currentPath === '/care' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, '/care')}>Care</a>
          <a href="/custom" className={`nav-link ${currentPath === '/custom' ? 'active' : ''}`} onClick={(e) => handleLinkClick(e, '/custom')}>Custom</a>
          <a href="/vip" className="vip-nav-btn" onClick={(e) => handleLinkClick(e, '/vip')}>VIP List</a>
        </nav>
      </header>

      {/* Main View Area */}
      <main className="view-container">
        
        {/* Route: HOME */}
        {currentPath === '/' && (
          <div className="home-layout-container">
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-bg" style={{ backgroundImage: `url(/hero-forge.png)` }}></div>
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <span className="hero-tagline">Scotland's Hand-Forged Provenance</span>
                <h1 className="hero-title">Hand-forged in Scotland. Released in numbered batches.</h1>
                <p className="hero-desc">
                  Working Highland patterns forged from high-carbon steel in the shadow of the Cairngorms. Fifteen to forty blades at a time. Announced to the list first.
                </p>
                <div className="hero-actions">
                  <button className="custom-button" onClick={() => navigate('/vip')}>
                    Join the VIP List
                  </button>
                  <button className="custom-button-secondary" onClick={() => navigate('/drops')}>
                    View Batches <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* Drop Status Band */}
            <div className="drop-status-band-wrap">
              <div className="drop-status-band iron-panel">
                <div className="drop-info-col">
                  <span className="drop-status-badge-inline">
                    {CONFIG.NEXT_DROP_DATE === "TBA" || !timeLeft ? 'NEXT DROP' : 'COUNTDOWN'}
                  </span>
                  {CONFIG.NEXT_DROP_DATE === "TBA" ? (
                    <h2 className="drop-status-heading">Batch 001 — date announced to the list first.</h2>
                  ) : (
                    <h2 className="drop-status-heading">Batch 001 · 15 blades · {new Date(CONFIG.NEXT_DROP_DATE).toLocaleDateString(undefined, { dateStyle: 'long' })}</h2>
                  )}
                </div>
                
                {CONFIG.NEXT_DROP_DATE !== "TBA" && timeLeft && (
                  <div className="countdown-display">
                    <div className="countdown-time-unit">
                      <span className="countdown-digit">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="countdown-label">Days</span>
                    </div>
                    <span className="countdown-colon">:</span>
                    <div className="countdown-time-unit">
                      <span className="countdown-digit">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="countdown-label">Hours</span>
                    </div>
                    <span className="countdown-colon">:</span>
                    <div className="countdown-time-unit">
                      <span className="countdown-digit">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="countdown-label">Mins</span>
                    </div>
                    <span className="countdown-colon">:</span>
                    <div className="countdown-time-unit">
                      <span className="countdown-digit">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="countdown-label">Secs</span>
                    </div>
                  </div>
                )}
                
                <div className="drop-cta-col">
                  <button className="custom-button" onClick={() => navigate('/vip')}>
                    Get First Access
                  </button>
                </div>
              </div>
            </div>

            {/* Tier Showcase */}
            <div className="homepage-section">
              <div className="section-title-group">
                <span className="section-tag">Catalog Architecture</span>
                <h2 className="section-title">THE THREE TIERS</h2>
                <div className="section-divider"></div>
              </div>
              
              <div className="tier-showcase-grid">
                {/* Vanguard Card */}
                <div className="tier-card iron-panel-interactive" onClick={() => { setSelectedTier('vanguard'); navigate('/collection'); }}>
                  <div className="tier-card-image" style={{ backgroundImage: `url(/category-sgian-dubh.png)` }}></div>
                  <div className="tier-card-overlay"></div>
                  <div className="tier-card-content">
                    <span className="tier-tagline">The Vanguard</span>
                    <h3 className="tier-title">Everyday Carry & Heirloom Blades</h3>
                    <p className="tier-desc">Sgian dubhs, Highland field & bushcraft knives. Built for utility, tempered for generations.</p>
                    <div className="tier-meta-row">
                      <span>Price Band</span>
                      <span className="tier-price">$350 – $450</span>
                    </div>
                    <span className="tier-cta">Explore Vanguard Blades <ArrowRight size={14} /></span>
                  </div>
                </div>

                {/* Elite Card */}
                <div className="tier-card iron-panel-interactive" onClick={() => { setSelectedTier('elite'); navigate('/collection'); }}>
                  <div className="tier-card-image" style={{ backgroundImage: `url(/category-dirk.png)` }}></div>
                  <div className="tier-card-overlay"></div>
                  <div className="tier-card-content">
                    <span className="tier-tagline">The Elite</span>
                    <h3 className="tier-title">Exotic Materials & Small Editions</h3>
                    <p className="tier-desc">Dirks, camp choppers, and culinary knives with ancient bog oak, stag, or stabilized wood handles.</p>
                    <div className="tier-meta-row">
                      <span>Price Band</span>
                      <span className="tier-price">$600 – $800</span>
                    </div>
                    <span className="tier-cta">Explore Elite Blades <ArrowRight size={14} /></span>
                  </div>
                </div>

                {/* Halo Card */}
                <div className="tier-card iron-panel-interactive" onClick={() => { setSelectedTier('halo'); navigate('/collection'); }}>
                  <div className="tier-card-image" style={{ backgroundImage: `url(/category-broadsword.png)` }}></div>
                  <div className="tier-card-overlay"></div>
                  <div className="tier-card-content">
                    <span className="tier-tagline">The Halo</span>
                    <h3 className="tier-title">Heritage Functional Art</h3>
                    <p className="tier-desc">Claymores and basket-hilt broadswords. 100% hand-forged, historical Highland patterns.</p>
                    <div className="tier-meta-row">
                      <span>Price Band</span>
                      <span className="tier-price">$2,500+</span>
                    </div>
                    <span className="tier-cta">Explore Halo Pieces <ArrowRight size={14} /></span>
                  </div>
                </div>
              </div>
            </div>

            <CelticDivider />

            {/* Story Teaser */}
            <div className="story-teaser-banner iron-panel">
              <div className="teaser-content">
                <span className="teaser-tag">Provenance</span>
                <h3 className="teaser-title">HAND-FORGED IN THE HIGHLANDS</h3>
                <p className="teaser-desc">
                  Every blade bearing the Vogie Forge mark is shaped at the anvil from high-carbon steel and heat-treated in-house. We do not use industrial templates or machine-cut blanks.
                </p>
                <button className="custom-button-secondary" onClick={() => navigate('/the-forge')}>
                  Our Forging Process <ChevronRight size={14} />
                </button>
              </div>
              <div className="teaser-visual">
                <div className="blueprint-box">
                  <div className="blueprint-grid-lines"></div>
                  <svg width="100%" height="220" viewBox="0 0 100 200" className="blueprint-svg">
                    <path d="M50,160 L45,20 L50,10 L55,20 L50,160 Z" fill="none" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M15,160 L85,160 L80,165 L20,165 Z" fill="none" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="1.5" />
                    <rect x="44" y="165" width="12" height="28" rx="1" fill="none" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="1.5" />
                    <circle cx="50" cy="196" r="6" fill="none" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="1.5" />
                  </svg>
                  <span className="blueprint-overlay">VF-SCHEMATIC // BATCH 001</span>
                </div>
              </div>
            </div>

            <CelticDivider />

            {/* Culinary Feature */}
            <div className="homepage-section">
              <div className="section-title-group">
                <span className="section-tag">Kitchen Line</span>
                <h2 className="section-title">THE CULINARY FOCUS</h2>
                <div className="section-divider"></div>
              </div>
              
              <div className="culinary-feature-banner iron-panel">
                <div className="culinary-feat-image-wrap">
                  <img src="https://static.wixstatic.com/media/cd5cc7_dbc27d8854bc43d09a959cc0519f4703~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg" alt="Hebridean Chef Knife" />
                </div>
                <div className="culinary-feat-content">
                  <span className="culinary-feat-tier">ELITE SERIES</span>
                  <h3 className="culinary-feat-title">Hebridean Chef Blade</h3>
                  <p className="culinary-feat-desc">
                    Forged with a 1095 carbon steel core and tempered to 61 HRC for professional performance. Fitted with peat-preserved bog oak sourced from deep Hebridean moss bogs.
                  </p>
                  <div className="culinary-feat-specs">
                    <span>Steel: 1095 Carbon Steel Core</span>
                    <span>Hardness: 61 HRC</span>
                    <span>Blade Length: 8.5 in</span>
                  </div>
                  <button className="custom-button" onClick={() => navigate('/culinary')}>
                    View Kitchen Blades
                  </button>
                </div>
              </div>
            </div>

            <CelticDivider />

            {/* Testimonials Scroll */}
            <div className="testimonials-section parchment-scroll">
              <div className="testimonial-container">
                <span className="section-tag" style={{ color: 'var(--ink-red)' }}>Recorded Chronicles</span>
                <p className="testimonial-quote drop-cap-parchment">
                  "{TESTIMONIALS[testimonialIndex].quote}"
                </p>
                <span className="testimonial-author">
                  — {TESTIMONIALS[testimonialIndex].author}
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '24px' }}>
                  {TESTIMONIALS.map((_, idx) => (
                    <button 
                      key={idx} 
                      aria-label={`Go to testimonial ${idx + 1}`}
                      style={{ 
                        width: '10px', 
                        height: '10px', 
                        border: '1px solid var(--ink-dark)',
                        background: idx === testimonialIndex ? 'var(--ink-red)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease',
                        padding: 0
                      }}
                      onClick={() => setTestimonialIndex(idx)}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            <CelticDivider />

            {/* Scripture Offer (Free Bibles) */}
            <div className="bible-oath-banner iron-panel">
              <div className="bible-oath-text">
                <h3 className="bible-oath-title">THE SWORD OF THE SPIRIT OATH</h3>
                <p className="bible-oath-desc">
                  At Vogie Forge, our blades are forged in honesty and steel. We believe the written Word of God is the true 'Sword of the Spirit'. In support of this belief, we offer free copies of the King James Bible to anyone upon request.
                </p>
              </div>
              <div className="bible-oath-actions">
                <button className="custom-button" onClick={() => navigate('/scripture')}>
                  Read Scripture Oath
                </button>
              </div>
            </div>

            {/* Final capture banner */}
            <div className="final-capture-section">
              <VipCapture />
            </div>
          </div>
        )}

        {/* Route: DROPS */}
        {currentPath === '/drops' && (
          <div className="drops-page-container">
            <div className="section-title-group">
              <span className="section-tag">Batch Releases</span>
              <h1 className="section-title">THE LEDGER OF DROP BATCHES</h1>
              <div className="section-divider"></div>
            </div>

            {/* Active Drop Header */}
            <div className="active-drop-header iron-panel">
              <div>
                <span className="active-drop-tag">CURRENT RELEASE</span>
                <h2 className="active-drop-title">Batch 001</h2>
                <p className="active-drop-desc">
                  A small series of fifteen hand-forged blades, featuring working Highland patterns and high-carbon metallurgy. 
                </p>
              </div>
              <div className="active-drop-countdown-wrap">
                {CONFIG.NEXT_DROP_DATE === "TBA" ? (
                  <span className="active-drop-tba">TBA — Announced to VIP List First</span>
                ) : !isDropLive && timeLeft ? (
                  <div className="active-drop-countdown">
                    <span>LAUNCHES IN:</span>
                    <div className="timer-numbers">
                      {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
                    </div>
                  </div>
                ) : (
                  <span className="active-drop-live-badge"><Sparkles size={16} /> BATCH IS LIVE</span>
                )}
              </div>
            </div>

            {/* Active Drop Items */}
            <div className="drops-section">
              <h3 className="drops-section-title">Batch 001 Catalog</h3>
              <div className="catalog-grid">
                {currentProducts.filter(p => p.batch === 'Batch 001').map((prod) => (
                  <div key={prod.slug} className="iron-panel-interactive sword-card">
                    <div className="card-image-wrap" onClick={() => navigate(`/product/${prod.slug}`)}>
                      <img src={prod.image} alt={prod.name} className="sword-card-img" />
                      {!isDropLive && (
                        <div className="locked-overlay">
                          <Lock size={20} className="locked-icon" />
                          <span>LOCKED UNTIL DROP</span>
                        </div>
                      )}
                    </div>
                    <div className="card-content">
                      <div className="card-edition-badge">
                        {prod.batch} · No. {prod.editionNumber} of {prod.editionSize}
                      </div>
                      <span className="sword-name" onClick={() => navigate(`/product/${prod.slug}`)} style={{ cursor: 'pointer' }}>{prod.name}</span>
                      
                      <div className="sword-spec-row" style={{ marginTop: '12px' }}>
                        <span>Steel</span>
                        <span>{prod.steel}</span>
                      </div>
                      <div className="sword-spec-row">
                        <span>Hardness</span>
                        <span>{prod.hrc} HRC</span>
                      </div>
                      
                      <div className="sword-price-box">
                        <span className="card-price">${prod.price}</span>
                        {isDropLive ? (
                          <button className="custom-button" onClick={() => window.open(CONFIG.CHECKOUT_URL, '_blank')}>
                            Purchase Blade
                          </button>
                        ) : (
                          <button className="custom-button-secondary" onClick={() => navigate('/vip')}>
                            Get Notified
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Drops Archive */}
            <div className="drops-section" style={{ marginTop: '80px' }}>
              <div className="section-title-group">
                <span className="section-tag">The Vault</span>
                <h3 className="drops-section-title">Past Batch Archive</h3>
                <p style={{ color: 'var(--text-ash)', marginTop: '8px' }}>Sold-out editions are kept here as permanent records of demand and craftsmanship.</p>
              </div>

              <div className="catalog-grid">
                {currentProducts.filter(p => p.status === 'sold').map((prod) => (
                  <div key={prod.slug} className="iron-panel-interactive sword-card sold-card">
                    <div className="card-image-wrap" onClick={() => navigate(`/product/${prod.slug}`)}>
                      <img src={prod.image} alt={prod.name} className="sword-card-img" />
                      <span className="sold-badge">SOLD OUT</span>
                    </div>
                    <div className="card-content">
                      <div className="card-edition-badge">
                        {prod.batch} · No. {prod.editionNumber} of {prod.editionSize}
                      </div>
                      <span className="sword-name" onClick={() => navigate(`/product/${prod.slug}`)} style={{ cursor: 'pointer' }}>{prod.name}</span>
                      
                      <div className="sword-spec-row" style={{ marginTop: '12px' }}>
                        <span>Steel</span>
                        <span>{prod.steel}</span>
                      </div>
                      <div className="sword-spec-row">
                        <span>Hardness</span>
                        <span>{prod.hrc} HRC</span>
                      </div>
                      {prod.sellOutTime && (
                        <div className="sword-spec-row sellout-row">
                          <span style={{ color: 'var(--gold-solid)' }}><Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Velocity</span>
                          <span style={{ color: 'var(--gold-glow)' }}>Sold out in {prod.sellOutTime}</span>
                        </div>
                      )}

                      <div className="sword-price-box">
                        <span className="card-price">${prod.price}</span>
                        <button className="custom-button-secondary" style={{ width: '100%' }} onClick={() => navigate(`/product/${prod.slug}`)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Route: COLLECTION */}
        {currentPath === '/collection' && (
          <div className="collection-page-container">
            <div className="section-title-group">
              <span className="section-tag">All Work</span>
              <h1 className="section-title">THE HEIRLOOM COLLECTION</h1>
              <div className="section-divider"></div>
            </div>

            {/* Collection Filters */}
            <div className="collection-filters iron-panel">
              <span className="filter-label">Filter Tiers:</span>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${selectedTier === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedTier('all')}
                >
                  All Blades
                </button>
                <button 
                  className={`filter-btn ${selectedTier === 'vanguard' ? 'active' : ''}`}
                  onClick={() => setSelectedTier('vanguard')}
                >
                  The Vanguard ($350 - $450)
                </button>
                <button 
                  className={`filter-btn ${selectedTier === 'elite' ? 'active' : ''}`}
                  onClick={() => setSelectedTier('elite')}
                >
                  The Elite ($600 - $800)
                </button>
                <button 
                  className={`filter-btn ${selectedTier === 'halo' ? 'active' : ''}`}
                  onClick={() => setSelectedTier('halo')}
                >
                  The Halo ($2,500+)
                </button>
              </div>
            </div>

            {/* Collection Grid */}
            <div className="catalog-grid">
              {currentProducts
                .filter(p => selectedTier === 'all' || p.tier === selectedTier)
                .map((prod) => (
                  <div key={prod.slug} className={`iron-panel-interactive sword-card ${prod.status === 'sold' ? 'sold-card' : ''}`}>
                    <div className="card-image-wrap" onClick={() => navigate(`/product/${prod.slug}`)}>
                      <img src={prod.image} alt={prod.name} className="sword-card-img" />
                      {prod.status === 'sold' ? (
                        <span className="sold-badge">SOLD OUT</span>
                      ) : prod.status === 'upcoming' ? (
                        <div className="locked-overlay">
                          <Lock size={18} className="locked-icon" />
                          <span>BATCH {prod.batch}</span>
                        </div>
                      ) : (
                        <span className="live-badge">ACTIVE DROP</span>
                      )}
                    </div>
                    <div className="card-content">
                      <div className="card-edition-badge">
                        {prod.batch} · No. {prod.editionNumber} of {prod.editionSize}
                      </div>
                      <span className="sword-name" onClick={() => navigate(`/product/${prod.slug}`)} style={{ cursor: 'pointer' }}>{prod.name}</span>
                      <p className="card-desc-short">{prod.desc}</p>
                      
                      <div className="sword-spec-row">
                        <span>Steel</span>
                        <span>{prod.steel}</span>
                      </div>
                      <div className="sword-spec-row">
                        <span>Hardness</span>
                        <span>{prod.hrc} HRC</span>
                      </div>

                      <div className="sword-price-box">
                        <span className="card-price">${prod.price}</span>
                        <button className="custom-button" onClick={() => navigate(`/product/${prod.slug}`)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Route: CULINARY */}
        {currentPath === '/culinary' && (
          <div className="culinary-page-container">
            <div className="section-title-group">
              <span className="section-tag">Kitchen Line</span>
              <h1 className="section-title">THE CULINARY BLADES</h1>
              <div className="section-divider"></div>
              <p style={{ color: 'var(--text-ash)', maxWidth: '650px', margin: '0 auto' }}>
                Tempered carbon steel designed for precise food preparation. We preserve edge life and structural integrity by heat treating every piece to 61 HRC.
              </p>
            </div>

            <div className="catalog-grid">
              {currentProducts.filter(p => p.category === 'culinary').map((prod) => (
                <div key={prod.slug} className={`iron-panel-interactive sword-card ${prod.status === 'sold' ? 'sold-card' : ''}`}>
                  <div className="card-image-wrap" onClick={() => navigate(`/product/${prod.slug}`)}>
                    <img src={prod.image} alt={prod.name} className="sword-card-img" />
                    {prod.status === 'sold' ? (
                      <span className="sold-badge">SOLD OUT</span>
                    ) : prod.status === 'upcoming' ? (
                      <div className="locked-overlay">
                        <Lock size={18} className="locked-icon" />
                        <span>BATCH {prod.batch}</span>
                      </div>
                    ) : (
                      <span className="live-badge">ACTIVE DROP</span>
                    )}
                  </div>
                  <div className="card-content">
                    <div className="card-edition-badge">
                      {prod.batch} · No. {prod.editionNumber} of {prod.editionSize}
                    </div>
                    <span className="sword-name" onClick={() => navigate(`/product/${prod.slug}`)} style={{ cursor: 'pointer' }}>{prod.name}</span>
                    <p className="card-desc-short">{prod.desc}</p>
                    
                    <div className="sword-spec-row">
                      <span>Steel</span>
                      <span>{prod.steel}</span>
                    </div>
                    <div className="sword-spec-row">
                      <span>Hardness</span>
                      <span>{prod.hrc} HRC</span>
                    </div>

                    <div className="sword-price-box">
                      <span className="card-price">${prod.price}</span>
                      <button className="custom-button" onClick={() => navigate(`/product/${prod.slug}`)}>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Route: PRODUCT DETAIL */}
        {currentPath.startsWith('/product/') && (() => {
          const slug = currentPath.substring(9);
          const prod = currentProducts.find(p => p.slug === slug);
          
          if (!prod) {
            return (
              <div className="not-found-container text-center">
                <h2>Blade not found in active records</h2>
                <button className="custom-button" style={{ marginTop: '24px' }} onClick={() => navigate('/collection')}>
                  Return to Collection
                </button>
              </div>
            );
          }

          return (
            <div className="product-detail-container">
              <div className="product-detail-layout">
                {/* Left Column: Image Gallery (dark, raking light; blade never pointed at camera) */}
                <div className="product-image-gallery iron-panel">
                  <div className="main-image-slot">
                    <img src={prod.image} alt={`${prod.name} layout view`} />
                    {prod.status === 'sold' && <span className="sold-badge-large">SOLD OUT</span>}
                    {prod.status === 'upcoming' && <span className="upcoming-badge-large">UPCOMING BATCH</span>}
                  </div>
                  <div className="gallery-notes font-serif">
                    <span>Photography captured under natural Highland raking light.</span>
                  </div>
                </div>

                {/* Right Column: Spec block styled like a certificate of authenticity card */}
                <div className="product-specs-column">
                  <div className="coa-panel">
                    <div className="coa-header">
                      <div className="coa-seal">VF</div>
                      <div className="coa-header-text">
                        <span className="coa-subtitle">Certificate of Authenticity</span>
                        <h2 className="coa-title">{prod.name}</h2>
                      </div>
                    </div>
                    
                    <div className="coa-edition-row">
                      <span className="coa-edition-label">Edition Numerals</span>
                      <span className="coa-edition-value font-mono">No. {prod.editionNumber} / {prod.editionSize}</span>
                    </div>

                    <div className="coa-spec-grid">
                      <div className="coa-spec-item">
                        <span className="coa-spec-label">Steel Composition</span>
                        <span className="coa-spec-value">{prod.steel}</span>
                      </div>
                      <div className="coa-spec-item">
                        <span className="coa-spec-label">Hardness (Quenched)</span>
                        <span className="coa-spec-value">{prod.hrc} HRC</span>
                      </div>
                      <div className="coa-spec-item">
                        <span className="coa-spec-label">Blade Length</span>
                        <span className="coa-spec-value">{prod.bladeLength}</span>
                      </div>
                      <div className="coa-spec-item">
                        <span className="coa-spec-label">Overall Length</span>
                        <span className="coa-spec-value">{prod.overallLength}</span>
                      </div>
                      <div className="coa-spec-item">
                        <span className="coa-spec-label">Grind Profile</span>
                        <span className="coa-spec-value">{prod.grind}</span>
                      </div>
                      <div className="coa-spec-item">
                        <span className="coa-spec-label">Handle Material</span>
                        <span className="coa-spec-value">{prod.handleMaterial}</span>
                      </div>
                      <div className="coa-spec-item">
                        <span className="coa-spec-label">Sheath work</span>
                        <span className="coa-spec-value">{prod.sheath}</span>
                      </div>
                      <div className="coa-spec-item">
                        <span className="coa-spec-label">Batch Group</span>
                        <span className="coa-spec-value">{prod.batch}</span>
                      </div>
                    </div>

                    <div className="coa-signature-row">
                      <div className="coa-signature-item">
                        <span className="coa-signature-label">Blacksmith Signature</span>
                        <span className="coa-signature-value font-serif">{CONFIG.MAKER_NAME}</span>
                      </div>
                      <div className="coa-signature-item">
                        <span className="coa-signature-label">Forge Origin</span>
                        <span className="coa-signature-value">{CONFIG.FORGE_LOCATION}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipped Inclusions Info */}
                  <div className="inclusions-panel iron-panel">
                    <h4>In The Box:</h4>
                    <ul>
                      <li>Numbered & signed Certificate of Authenticity card.</li>
                      <li>High-carbon steel care card with QR access to care manual.</li>
                      <li>Blade shipped oiled and sharpened.</li>
                    </ul>
                  </div>

                  {/* Purchase CTA */}
                  <div className="purchase-action-panel">
                    {prod.status === 'live' ? (
                      <div>
                        <div className="price-tag-row">
                          <span>Purchase Price:</span>
                          <span className="detail-price">${prod.price}</span>
                        </div>
                        <button className="custom-button purchase-btn" onClick={() => window.open(CONFIG.CHECKOUT_URL, '_blank')}>
                          Claim This Blade
                        </button>
                      </div>
                    ) : prod.status === 'upcoming' ? (
                      <div>
                        <div className="price-tag-row">
                          <span>Estimated Price:</span>
                          <span className="detail-price">${prod.price}</span>
                        </div>
                        <div className="upcoming-lock-message">
                          <Lock size={16} />
                          <span>This blade is locked until Batch 001 drops. Join the VIP list for first access.</span>
                        </div>
                        <VipCapture />
                      </div>
                    ) : (
                      <div>
                        <div className="price-tag-row">
                          <span>Final Sale Price:</span>
                          <span className="detail-price sold-price">${prod.price}</span>
                        </div>
                        <div className="sold-out-capture-wrapper">
                          <p className="sold-out-prompt">This edition is sold out. Join the first-access list to hear about the next batch.</p>
                          <VipCapture />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Route: THE FORGE */}
        {currentPath === '/the-forge' && (
          <div className="the-forge-container">
            <div className="section-title-group">
              <span className="section-tag">Provenance</span>
              <h1 className="section-title">THE MAKER & METHOD</h1>
              <div className="section-divider"></div>
            </div>

            <div className="forge-intro iron-panel">
              <div className="forge-intro-text">
                <h2>{CONFIG.MAKER_NAME}</h2>
                <p className="font-serif">
                  Working out of {CONFIG.FORGE_LOCATION}, we focus on functional Highland patterns: the sgian dubh, the dirk, and the claymore. All work is hand-forged in-house, balancing historical design with modern metallurgy.
                </p>
                <p>
                  By moving to a batch-drop model, we preserve the purity of our focus. Rather than processing custom backlogs, we forge small, high-precision editions of fifteen to forty blades, dedicating our full attention to every quench, grind, and handle carvings.
                </p>
              </div>
              <div className="forge-intro-image">
                <div className="avatar-frame">VF</div>
              </div>
            </div>

            {/* Five Step Process */}
            <div className="process-section" style={{ marginTop: '80px' }}>
              <div className="section-title-group">
                <span className="section-tag">The 5 Steps</span>
                <h3 className="section-title">OUR FORGING PROCESS</h3>
                <div className="section-divider"></div>
              </div>

              <div className="process-grid">
                {/* Step 1 */}
                <div className="process-card iron-panel">
                  <div className="process-step-num">01</div>
                  <h4>Forge</h4>
                  <p>
                    Blades are drawn out at high temperatures from high-carbon bar stock. We hammer-taper the steel profiles to lock in a distal taper.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="process-card iron-panel">
                  <div className="process-step-num">02</div>
                  <h4>Grind</h4>
                  <p>
                    Bevels are rough-ground by hand to establish clean symmetry, leaving exactly one millimeter of steel along the edge to survive the oil quench.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="process-card iron-panel">
                  <div className="process-step-num">03</div>
                  <h4>Quench</h4>
                  <p>
                    Reheated to non-magnetic critical heat, the blade is plunged into oil, locking it into a hard structure. Double tempering cycles adjust hardness to 58-61 HRC.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="process-card iron-panel">
                  <div className="process-step-num">04</div>
                  <h4>Fit</h4>
                  <p>
                    Hilt components are hand-filed from brass or iron. Timber handles (Scottish bog oak, elm, walnut) are shaped and pinned with copper or brass pins.
                  </p>
                </div>

                {/* Step 5 */}
                <div className="process-card iron-panel">
                  <div className="process-step-num">05</div>
                  <h4>Sharpen</h4>
                  <p>
                    Edges are ground to a precise apex and stropped on thick leather charges until they slice fibers smoothly. Finished blades are oiled and cataloged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Route: CARE */}
        {currentPath === '/care' && (
          <div className="care-page-container">
            <div className="section-title-group">
              <span className="section-tag">High-Carbon Steel Care</span>
              <h1 className="section-title">BLADE CARE & PRESERVATION MANUAL</h1>
              <div className="section-divider"></div>
              <p style={{ color: 'var(--text-ash)' }}>This guide serves as the digital care manual accessed via the QR card included with your blade.</p>
            </div>

            <div className="parchment-scroll care-scroll-layout">
              <div className="care-step">
                <h3 className="care-step-title">1. Dry Immediately</h3>
                <p>
                  High-carbon steel is not stainless steel. It will react to water and humidity. Never wash your blade in a dishwasher. Hand-wash with warm water and soap immediately after use, and dry it completely with a clean towel.
                </p>
              </div>

              <div className="care-step">
                <h3 className="care-step-title">2. Apply Protective Oil</h3>
                <p>
                  Before storing your blade, apply a thin coat of food-safe mineral oil (such as camellia oil) to the entire steel surface. This creates a barrier against moisture in the air.
                </p>
              </div>

              <div className="care-step">
                <h3 className="care-step-title">3. Avoid Long-Term Sheath Storage</h3>
                <p>
                  Do not store your high-carbon steel blades inside leather sheaths for long periods. Leather absorbs moisture and salts from tanning, which will accelerate corrosion on the steel face.
                </p>
              </div>

              <div className="care-step">
                <h3 className="care-step-title">4. Edge Honing & Stropping</h3>
                <p>
                  Maintain the edge with a leather strop loaded with fine abrasive compound (like chromium oxide). Avoid automated grinding wheels or aggressive steel rods, which can overheat the tempered edge.
                </p>
              </div>

              <div className="care-step">
                <h3 className="care-step-title">5. Understanding the Patina</h3>
                <p>
                  Over time and usage, high-carbon steel will develop a grey or blue coloration (patina), especially after cutting acidic foods. This is not rust. It is a stable oxide layer that helps protect the steel from red rust. Embrace the patina as the record of its use.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Route: FAQ */}
        {currentPath === '/faq' && (
          <div className="faq-page-container">
            <div className="section-title-group">
              <span className="section-tag">Blacksmith Codex</span>
              <h1 className="section-title">TECHNICAL QUESTIONS & OPERATIONS</h1>
              <div className="section-divider"></div>
            </div>

            <div className="accordion-list">
              {FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className={`accordion-item ${isOpen ? 'open' : ''}`}>
                    <div 
                      className="accordion-trigger"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                    >
                      <span className="accordion-question">{faq.question}</span>
                      <ChevronDown size={18} className="accordion-icon" />
                    </div>
                    {isOpen && (
                      <div className="accordion-content">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Route: VIP */}
        {currentPath === '/vip' && (
          <div className="vip-page-container">
            <div className="section-title-group">
              <span className="section-tag">VIP List</span>
              <h1 className="section-title">BATCH FIRST ACCESS</h1>
              <div className="section-divider"></div>
            </div>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <VipCapture />
            </div>
          </div>
        )}

        {/* Route: CUSTOM (Closed books) */}
        {currentPath === '/custom' && (
          <div className="custom-page-container">
            <div className="section-title-group">
              <span className="section-tag">Custom Commissions</span>
              <h1 className="section-title">THE CUSTOM BOOKS ARE CLOSED</h1>
              <div className="section-divider"></div>
            </div>
            
            <div className="closed-books-announcement iron-panel text-center">
              <Lock size={48} className="closed-lock-icon" />
              <p className="closed-books-notice font-serif">
                The custom books are closed. All blades now release in numbered batches.
              </p>
              <p className="closed-books-subtext">
                To guarantee maximum attention to detail, Vogie Forge has transitioned to batch releases. We no longer take commission requests or custom patterns.
              </p>
              <p className="closed-books-action-prompt">
                To secure first access to Batch 001 releases, register for the first-access VIP list below.
              </p>
              
              <div style={{ maxWidth: '500px', margin: '32px auto 0' }}>
                <VipCapture />
              </div>
            </div>
          </div>
        )}

        {/* Route: SCRIPTURE */}
        {currentPath === '/scripture' && (
          <div className="scripture-page-container">
            <div className="section-title-group">
              <span className="section-tag">Scripture Reflection</span>
              <h1 className="section-title">THE SWORD OF THE SPIRIT</h1>
              <div className="section-divider"></div>
            </div>

            <div className="godsword-banner">
              <span className="scripture-ref">Ephesians 6 v17</span>
              <p className="scripture-quote font-serif">
                'And take the helmet of salvation, and the sword of the Spirit, which is the word of God:'
              </p>
            </div>

            <div className="parchment-scroll godsword-parchment">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--gold-solid)', marginBottom: '24px', textAlign: 'center' }}>Concerning the Possession of God's Word</h3>
              
              <p className="drop-cap-parchment" style={{ fontSize: '18px', color: 'var(--ink-dark)', lineHeight: '1.8', marginBottom: '20px' }}>
                An interest in the sword will eventually lead one to recognise that history's best seller, the King James Bible, refers to itself as the 'sword of the Spirit'. Every sword is historically known for offense as well as protection, a symbol of power as well as guardianship. 
              </p>
              
              <p style={{ fontSize: '18px', color: 'var(--ink-dark)', lineHeight: '1.8', marginBottom: '20px' }}>
                According to Hebrews chapter 4 v12, 'the word of God is quick, and powerful, and sharper than any two edged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and morrow, and is a discerner of the thoughts and intents of the heart.' 1 Peter 1 v23 says one is 'born again, not of corruptible seed, but of incorruptible, by the word of God, which liveth and abideth for ever.'
              </p>

              <p style={{ fontSize: '18px', color: 'var(--ink-dark)', lineHeight: '1.8', marginBottom: '20px' }}>
                In John 12 v48, Jesus says, 'He that rejecteth me, and receiveth not my words, hath one that judgeth him: the word that I have spoken, the same shall judge him in the last day.' It is interesting to see from scripture that God's word, or sword, is intended to be man's greatest friend, or greatest foe; the hope of our eternal protection, or the instrument of our eternal destruction. 
              </p>

              <p style={{ fontSize: '18px', color: 'var(--ink-dark)', lineHeight: '1.8', marginBottom: '24px' }}>
                Considering all this, what sword could be of greater importance, or worth possessing? For this reason, Vogie Forge offers free King James Bibles upon request, while supplies last. If you would like to request one, please email us directly.
              </p>

              <div className="text-center" style={{ marginTop: '32px' }}>
                <a href="mailto:vogieforge@gmail.com?subject=Free Bible Request" className="custom-button" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                  Request a Free Bible via Email
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-emblem">VOGIE FORGE</span>
        
        <div className="footer-links">
          <a href="/" onClick={(e) => handleLinkClick(e, '/')}>Home</a>
          <a href="/drops" onClick={(e) => handleLinkClick(e, '/drops')}>Drops</a>
          <a href="/collection" onClick={(e) => handleLinkClick(e, '/collection')}>Collection</a>
          <a href="/culinary" onClick={(e) => handleLinkClick(e, '/culinary')}>Culinary</a>
          <a href="/the-forge" onClick={(e) => handleLinkClick(e, '/the-forge')}>The Forge</a>
          <a href="/care" onClick={(e) => handleLinkClick(e, '/care')}>Care</a>
          <a href="/faq" onClick={(e) => handleLinkClick(e, '/faq')}>FAQ</a>
          <a href="/custom" onClick={(e) => handleLinkClick(e, '/custom')}>Custom</a>
          <a href="/scripture" onClick={(e) => handleLinkClick(e, '/scripture')}>Scripture Oath</a>
        </div>

        <div className="footer-legal-notices" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '12px', color: 'var(--text-ash)', lineHeight: '1.6' }}>
          <p className="warning-text" style={{ marginBottom: '8px', color: 'var(--gold-solid)' }}>
            <ShieldAlert size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Age Restriction & Warnings: Hand-forged blades are intended strictly for culinary, utility, or collector display purposes. Delivery requires 18+ age verification. Please check local jurisdiction rules regarding imports and carriage of high-carbon steel blades.
          </p>
        </div>

        <p className="footer-text">
          &copy; {new Date().getFullYear()} Vogie Forge. Hand forged in Scotland. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
