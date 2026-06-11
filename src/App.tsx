import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Mail, 
  Check, 
  ChevronDown, 
  Sliders, 
  Award, 
  Hammer, 
  ChevronRight,
  Send,
  Play,
  BookOpen
} from 'lucide-react';
import './App.css';
const heroBg = 'https://static.wixstatic.com/media/cd5cc7_89e156a4623340d59bd3b7263dcb518c~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_90/file.jpg';

// Interfaces
interface SwordItem {
  id: string;
  name: string;
  category: 'claymore' | 'dirk' | 'sgian-dubh' | 'broadsword' | 'viking';
  price: string;
  status: 'sold' | 'available';
  weight: string;
  length: string;
  steel: string;
  desc: string;
  image: string;
}

interface WipPost {
  id: string;
  date: string;
  title: string;
  desc: string;
  youtubeId?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// Data catalog matching the blacksmith archives
const CATALOG_ITEMS: SwordItem[] = [
  {
    id: 'sw-01',
    name: 'Pattern Welded Basket Hilt Broadsword',
    category: 'broadsword',
    price: '£2,850',
    status: 'sold',
    weight: '1.2 kg (2.6 lbs)',
    length: '98 cm (38.5 in)',
    steel: '1095 & 15N20 Pattern Welded (320 layers)',
    desc: 'Fully hand-forged basket hilt broadsword. Heartwood carved lining, premium wire wrap grip, and hand-filed steel hilt bars.',
    image: 'https://static.wixstatic.com/media/cd5cc7_a06d45bbf61f40f3a2ba49000ab99674~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-02',
    name: 'Kingsway Claymore',
    category: 'claymore',
    price: '£3,400',
    status: 'sold',
    weight: '2.1 kg (4.6 lbs)',
    length: '142 cm (56 in)',
    steel: 'En45 Spring Steel, hardened & tempered',
    desc: 'Highland two-handed claymore. Hand-filed steel guard with quatrefoil terminals, leather wrapped grip, and custom carved oak scabbard.',
    image: 'https://static.wixstatic.com/media/cd5cc7_d17e6d868e244b88ae9ce97bee4f56d3~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-03',
    name: 'The Glormhor Claymore',
    category: 'claymore',
    price: '£3,150',
    status: 'sold',
    weight: '1.95 kg (4.3 lbs)',
    length: '136 cm (53.5 in)',
    steel: '1095 High Carbon Steel',
    desc: 'A magnificent Highland Claymore. Grip of select dense Scottish Walnut with sterling silver hilt collars.',
    image: 'https://static.wixstatic.com/media/cd5cc7_608d3041215b438d84866f1eb6f050fc~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-04',
    name: 'The Nessie Hunter Viking Sword',
    category: 'viking',
    price: '£2,250',
    status: 'sold',
    weight: '1.05 kg (2.3 lbs)',
    length: '92 cm (36.2 in)',
    steel: '1095 and 15N20 Twist Pattern Welded',
    desc: 'A maritime Viking Age sword. Bronze pommel and guard with embedded silver wire, hand-carved bog oak grip.',
    image: 'https://static.wixstatic.com/media/cd5cc7_2fb62267a3b74570bb7c67d1eb216e62~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-05',
    name: 'Robert the Bruce Claymore',
    category: 'claymore',
    price: '£3,250',
    status: 'sold',
    weight: '2.0 kg (4.4 lbs)',
    length: '138 cm (54.3 in)',
    steel: 'En45 Spring Steel, double tempered',
    desc: 'An iconic tribute to the King of Scots. Featuring a massive down-sloping crossguard and high-contrast leather wrapping.',
    image: 'https://static.wixstatic.com/media/cd5cc7_13800a6ff3e84655a9fc1abec5669604~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-06',
    name: 'Late Viking Age Type X Sword',
    category: 'viking',
    price: '£2,400',
    status: 'sold',
    weight: '1.1 kg (2.4 lbs)',
    length: '94 cm (37 in)',
    steel: '1095 & 15N20 Pattern Welded core',
    desc: 'Inspired by the Urnes style design. Pommel and guard inlaid with sterling silver wire, handle wrapped in fine linen cord.',
    image: 'https://static.wixstatic.com/media/cd5cc7_3d4be62be7b64efaa085ec4e9b0f0477~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-07',
    name: 'Acanthus Medieval Hand and a Half',
    category: 'broadsword',
    price: '£2,100',
    status: 'sold',
    weight: '1.45 kg (3.2 lbs)',
    length: '112 cm (44.1 in)',
    steel: '1095 High Carbon Steel, mirror polished',
    desc: 'A versatile hand-and-a-half sword. Hilt elements detailed with hand-engraved acanthus leaf motifs, grip carved from Scottish oak.',
    image: 'https://static.wixstatic.com/media/cd5cc7_0141010818d14e8e881f908b3d3c3a34~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-08',
    name: 'Oronsay Claymore',
    category: 'claymore',
    price: '£3,550',
    status: 'sold',
    weight: '2.25 kg (5.0 lbs)',
    length: '144 cm (56.7 in)',
    steel: 'Twisted Damascus multi-billet steel',
    desc: 'A majestic greatsword. Crossguard decorated with intricate viking-style silver wire inlaying hammered into milled channels.',
    image: 'https://static.wixstatic.com/media/cd5cc7_3d9edf736394455b893f49f8687133bb~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-09',
    name: 'Kilmartin Scottish Arming Sword',
    category: 'broadsword',
    price: '£1,950',
    status: 'sold',
    weight: '1.15 kg (2.5 lbs)',
    length: '96 cm (37.8 in)',
    steel: 'En45 Spring Steel, oil quenched',
    desc: 'A classic single-handed arming sword. Wheel pommel with brass insert, crossguard flared with traditional terminals.',
    image: 'https://static.wixstatic.com/media/cd5cc7_dbc27d8854bc43d09a959cc0519f4703~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-10',
    name: 'Celtic Crusader Sword',
    category: 'broadsword',
    price: '£2,300',
    status: 'sold',
    weight: '1.25 kg (2.75 lbs)',
    length: '101 cm (39.8 in)',
    steel: '1095 High Carbon Steel',
    desc: 'Forged for balance and impact. Crossguard inscribed with Celtic knotwork, pommel features an inlaid red copper cross.',
    image: 'https://static.wixstatic.com/media/cd5cc7_fed3574bb234413796a217e0bfd2917c~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-11',
    name: 'Basket Hilt Broadsword',
    category: 'broadsword',
    price: '£2,600',
    status: 'sold',
    weight: '1.3 kg (2.9 lbs)',
    length: '97 cm (38.2 in)',
    steel: 'En45 Spring Steel, hand-filed hilt',
    desc: 'Traditional Scottish basket hilt. High-strength steel basket cage lined with red wool felt sleeve, grip bound in shagreen skin.',
    image: 'https://static.wixstatic.com/media/cd5cc7_f1d89a542e2c4c6e8aa16d4d55029b13~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-12',
    name: 'Irish Wedding Sword',
    category: 'broadsword',
    price: '£2,150',
    status: 'sold',
    weight: '1.2 kg (2.6 lbs)',
    length: '99 cm (39.0 in)',
    steel: '1095 High Carbon Steel',
    desc: 'A ceremonial wedding arming sword. Ring pommel, brass wire wrapped grip, custom green velvet lined wood scabbard.',
    image: 'https://static.wixstatic.com/media/cd5cc7_ec0c96e57f044b85bfc35bfe8019e993~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-13',
    name: 'Govan Short Sword',
    category: 'dirk',
    price: '£1,450',
    status: 'sold',
    weight: '0.8 kg (1.76 lbs)',
    length: '65 cm (25.6 in)',
    steel: 'En45 Spring Steel',
    desc: 'A robust short sword. Pommel carved from highland oak, guard fitted with heavy steel bars, grip bound with black leather.',
    image: 'https://static.wixstatic.com/media/cd5cc7_cd11fc4d7bc64048afa7010bd81a2bef~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-14',
    name: 'Dunbar Claymore',
    category: 'claymore',
    price: '£3,350',
    status: 'sold',
    weight: '2.1 kg (4.6 lbs)',
    length: '141 cm (55.5 in)',
    steel: 'En45 Spring Steel, hardened & tempered',
    desc: 'A stunning greatsword replica. Featuring steel crossguard with quatrefoil ends, double-handed leather grip, and walnut scabbard.',
    image: 'https://static.wixstatic.com/media/cd5cc7_5480718775ed4f19a0d4026f304d129c~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  },
  {
    id: 'sw-15',
    name: 'The Marshall Longsword',
    category: 'broadsword',
    price: '£2,200',
    status: 'sold',
    weight: '1.4 kg (3.1 lbs)',
    length: '118 cm (46.5 in)',
    steel: '1095 High Carbon Steel',
    desc: 'A medieval longsword for two-handed use. Distal taper, leather wrapped hilt with riser rings, and matching iron pommel.',
    image: 'https://static.wixstatic.com/media/cd5cc7_200d132341b644ffb70c35970271a3ed~mv2.jpg/v1/fill/w_450,h_330,al_c,q_85/file.jpg'
  }
];

const WIP_POSTS: WipPost[] = [
  {
    id: 'wip-01',
    date: 'V. VII. MMXXIII',
    title: 'The Elizabeth: Ceremonial Sword of State of Scotland',
    desc: 'We are incredibly honored to have completed the entire custom hand-carved wood scabbard and gilt lettering for the new Sword of State of Scotland. Dane worked closely with his family. His wife Angelyn sewed the seams of the silken purple velvet scabbard sleeve, and his sons John and Luke helped with hilt detailing. The sword was officially presented to King Charles III at his Scottish Coronation.',
    youtubeId: 'R-xBoEqfSGQ'
  },
  {
    id: 'wip-02',
    date: 'XII. V. MMXXIV',
    title: 'Forging a Twist Pattern Basket Hilt',
    desc: 'Latest forge updates: welding 15N20 and 1095 steel billets, twisting them at 1050 degrees Celsius, and drawing out the central core to forge a 320-layer basket hilt broadsword blade. Hardness quenched at 58 HRC.',
  }
];

const FAQS: FAQItem[] = [
  {
    id: 'faq-01',
    question: 'How are your blades made? Is it stock removal?',
    answer: 'Absolutely not. All Vogie Forge blades are honestly hand-forged in Scotland. We draw them out from thick high carbon steel bar stock using hand hammers and an anvil. This process compacts the steel fibers along the edges, yielding structural properties, weight distribution, and edge-holding strength that flat bar-stock grinding cannot replicate.'
  },
  {
    id: 'faq-02',
    question: 'Why do your swords taper towards the tip?',
    answer: 'Historical accuracy. Authentic swords kept in museums are thick near the guard (1/4" to 1/2") to provide rigidity and support, and taper to a thin tip (1/16") to ensure speed and maneuverability. We replicate this distal taper faithfully. Factory-made replicas are typically a uniform 3/16" thick, which makes them feel heavy and sluggish.'
  },
  {
    id: 'faq-03',
    question: 'What is your commission policy?',
    answer: 'We request a 50% deposit to begin custom commission works. The remaining balance plus shipping cost is due before the completed sword is shipped out. We provide progress photo logs throughout the forging and hilt carving process.'
  },
  {
    id: 'faq-04',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide (including the USA, Canada, Germany, and Australia) via secure, tracked courier services. Shipping costs vary based on the item weight and destination.'
  }
];

const TESTIMONIALS = [
  {
    quote: "When I received my Claymore, I was speechless at the beauty of the sword and the amazing details that Dane had carved into the scabbard, really capturing the story of my ancestors; it was more than I could have imagined or asked for.",
    author: "Donna, U.S.A."
  },
  {
    quote: "Hey! The Bannockburn was delivered today, & I must say, It is astonishing! The first thing you notice when you pick this sword up, is how easy it is to handle. This is not a small weapon, but it is very lively in the hands! Thank you!",
    author: "M.F. USA"
  },
  {
    quote: "A true Craftsman creating works of Art... Your Claymore will be a guaranteed hit at the Games... the new Claymore will be over the top.",
    author: "President of Clan McDuffee, Indiana, USA"
  }
];

// Custom ornamental Celtic Knot divider
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

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'customizer' | 'wip' | 'qa' | 'godsword' | 'contact'>('home');
  const [catalogFilter, setCatalogFilter] = useState<string>('all');
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  
  // Customizer State
  const [swordType, setSwordType] = useState<'claymore' | 'dirk' | 'sgian-dubh'>('claymore');
  const [bladeSteel, setBladeSteel] = useState<'high-carbon' | 'pattern-welded'>('high-carbon');
  const [hiltMetal, setHiltMetal] = useState<'bronze' | 'steel' | 'sterling-silver'>('steel');
  const [gripWood, setGripWood] = useState<'oak' | 'walnut' | 'ebony'>('oak');
  const [engraving, setEngraving] = useState<'none' | 'celtic-braid' | 'family-emblem'>('none');
  
  // Testimonial index
  const [testimonialIndex, setTestimonialIndex] = useState<number>(0);
  
  // Contact Form simulation
  const [formData, setFormData] = useState({ name: '', email: '', message: '', customSpecs: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Auto rotate testimonials slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Customizer calculations
  const calculateSpecs = () => {
    let baseWeight = 0;
    let baseLength = '';
    let basePrice = 0;
    let balanceOffset = 0;
    
    switch (swordType) {
      case 'claymore':
        baseWeight = 1900;
        baseLength = '135 cm (53 in)';
        basePrice = 2800;
        balanceOffset = 8;
        break;
      case 'dirk':
        baseWeight = 450;
        baseLength = '48 cm (19 in)';
        basePrice = 950;
        balanceOffset = 1.5;
        break;
      case 'sgian-dubh':
        baseWeight = 110;
        baseLength = '20 cm (8 in)';
        basePrice = 450;
        balanceOffset = 0.5;
        break;
    }
    
    if (bladeSteel === 'pattern-welded') {
      basePrice += swordType === 'claymore' ? 800 : swordType === 'dirk' ? 350 : 200;
    }
    
    let weightMod: number;
    if (hiltMetal === 'bronze') {
      basePrice += 150;
      weightMod = 120;
    } else if (hiltMetal === 'sterling-silver') {
      basePrice += 400;
      weightMod = 180;
    } else {
      weightMod = 90;
    }
    
    if (gripWood === 'walnut') basePrice += 50;
    if (gripWood === 'ebony') basePrice += 120;
    
    if (engraving === 'celtic-braid') basePrice += 180;
    if (engraving === 'family-emblem') basePrice += 300;
    
    const finalWeight = baseWeight + weightMod;
    const finalBalance = Math.max(0.5, parseFloat((balanceOffset - (weightMod / 60)).toFixed(1)));
    
    const deposit = basePrice * 0.5;
    
    return {
      weight: `${(finalWeight / 1000).toFixed(2)} kg (${((finalWeight / 1000) * 2.204).toFixed(1)} lbs)`,
      length: baseLength,
      price: `£${basePrice.toLocaleString()}`,
      balance: `${finalBalance} cm (from guard)`,
      deposit: `£${deposit.toLocaleString()}`
    };
  };

  const currentSpecs = calculateSpecs();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', message: '', customSpecs: '' });
    }, 5000);
  };

  const filteredCatalog = catalogFilter === 'all' 
    ? CATALOG_ITEMS 
    : CATALOG_ITEMS.filter(item => item.category === catalogFilter);

  return (
    <div className="vogie-app">
      {/* Navigation bar */}
      <header className="navbar">
        <a href="#home" className="nav-brand" onClick={() => setActiveTab('home')}>
          <div className="brand-emblem">VF</div>
          <span className="brand-text">VOGIE FORGE</span>
        </a>
        <nav className="nav-menu">
          <span className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</span>
          <span className={`nav-link ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>Ledger</span>
          <span className={`nav-link ${activeTab === 'customizer' ? 'active' : ''}`} onClick={() => setActiveTab('customizer')}>Forge Builder</span>
          <span className={`nav-link ${activeTab === 'wip' ? 'active' : ''}`} onClick={() => setActiveTab('wip')}>Forge Logs</span>
          <span className={`nav-link ${activeTab === 'qa' ? 'active' : ''}`} onClick={() => setActiveTab('qa')}>Q&A</span>
          <span className={`nav-link ${activeTab === 'godsword' ? 'active' : ''}`} onClick={() => setActiveTab('godsword')}>God's Word</span>
          <span className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>Commission</span>
        </nav>
      </header>

      {/* Hero Section */}
      {activeTab === 'home' && (
        <section className="hero-section">
          <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }}></div>
          <div className="hero-overlay"></div>
          <div className="hero-content" style={{ textAlign: 'left', marginRight: 'auto', maxWidth: '850px' }}>
            <span className="hero-tagline">Scotland's Hand-Forged Legacy</span>
            <h1 className="hero-title">Forged from Iron. Tempered by Fire.</h1>
            <p className="hero-desc">
              We hammer, quench, and temper blades of historical distinction. Highland Claymores, Ceremonial Swords of State, and ancestral daggers hand-forged in the shadow of the Cairngorm mountains.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'flex-start' }}>
              <button className="custom-button" onClick={() => setActiveTab('customizer')}>
                <Hammer size={16} /> Forge Custom Blade
              </button>
              <button className="custom-button-secondary" onClick={() => setActiveTab('catalog')}>
                View Ledger Archives <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main View Area */}
      <main className="view-container">
        
        {/* Home View */}
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {/* Authenticity story */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
              <div className="iron-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px', borderLeft: '4px solid var(--gold-solid)' }}>
                <span style={{ color: 'var(--gold-solid)', fontStyle: 'italic', fontSize: '15px' }}>The Blacksmithing Tenets</span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--text-bone)' }}>Blades Drawn, Quenched & Tempered by Hand</h2>
                <p className="drop-cap" style={{ color: 'var(--text-tarnish)', fontSize: '17px', lineHeight: '1.8' }}>
                  Our workshop shuns the shortcuts of flat stock removal. Every blade starts as a thick carbon steel billet, drawn out at white heat under the hammer to establish a perfect distal taper.
                </p>
                <p style={{ color: 'var(--text-tarnish)', fontSize: '17.5px' }}>
                  We forge steel thick at the guard to ensure rigidity, tapering to a swift, maneuverable tip. This method ensures structural strength and balance that factory blades cannot duplicate.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button className="custom-button" onClick={() => setActiveTab('qa')}>
                    <BookOpen size={16} /> Consult the Forge Manual
                  </button>
                </div>
              </div>
              
              <div className="parchment-scroll" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: 'var(--ink-red)' }}>The Ancestral Oath</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--ink-red)', fontSize: '18px', fontWeight: 'bold' }}>I.</span>
                    <span style={{ fontSize: '16px', color: 'var(--ink-dark)' }}>No cheap alloys or zinc castings. Only authentic high carbon spring steels (En45, 1095) hardened in oil.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--ink-red)', fontSize: '18px', fontWeight: 'bold' }}>II.</span>
                    <span style={{ fontSize: '16px', color: 'var(--ink-dark)' }}>Handles and scabbards carved exclusively from Scottish oak, walnut, or ebony, to replicate museum metrics.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--ink-red)', fontSize: '18px', fontWeight: 'bold' }}>III.</span>
                    <span style={{ fontSize: '16px', color: 'var(--ink-dark)' }}>Blades subjected to multiple tempering cycles to ensure structural integrity and flexibility.</span>
                  </li>
                </ul>
              </div>
            </div>

            <CelticDivider />

            {/* Testimonials Scroll */}
            <div className="testimonials-section parchment-scroll">
              <div className="testimonial-container">
                <span className="section-tag" style={{ color: 'var(--ink-red)' }}>Recorded Chronicles</span>
                <p className="testimonial-quote drop-cap-parchment">
                  {TESTIMONIALS[testimonialIndex].quote}
                </p>
                <span className="testimonial-author">
                  Written by: {TESTIMONIALS[testimonialIndex].author}
                </span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '24px' }}>
                  {TESTIMONIALS.map((_, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        width: '10px', 
                        height: '10px', 
                        border: '1px solid var(--ink-dark)',
                        background: idx === testimonialIndex ? 'var(--ink-red)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease'
                      }}
                      onClick={() => setTestimonialIndex(idx)}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            <CelticDivider />

            {/* Featured Items ledger */}
            <div>
              <div className="section-title-group">
                <span className="section-tag">Forged Relics</span>
                <h2 className="section-title">THE LEDGER OF COMPLETED WORKS</h2>
                <div className="section-divider"></div>
              </div>
              <div className="catalog-grid">
                {CATALOG_ITEMS.slice(0, 3).map((sword) => (
                  <div key={sword.id} className="iron-panel-interactive sword-card">
                    <div className="card-image-wrap">
                      <img src={sword.image} alt={sword.name} className="sword-card-img" />
                      <span className="sold-badge">SOLD</span>
                    </div>
                    <div className="card-content">
                      <span className="sword-category">{sword.category}</span>
                      <span className="sword-name">{sword.name}</span>
                      <div className="sword-spec-row" style={{ marginTop: '8px' }}>
                        <span>Steel</span>
                        <span>{sword.steel}</span>
                      </div>
                      <div className="sword-spec-row">
                        <span>Weight</span>
                        <span>{sword.weight}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product Catalog */}
        {activeTab === 'catalog' && (
          <div>
            <div className="section-title-group">
              <span className="section-tag">Blacksmith Folio</span>
              <h2 className="section-title">RECENT COMPLETED COMMISSIONS</h2>
              <div className="section-divider"></div>
            </div>

            <div className="catalog-filters">
              {['all', 'claymore', 'broadsword', 'viking', 'dirk'].map((cat) => (
                <button 
                  key={cat} 
                  className={`custom-button-secondary ${catalogFilter === cat ? 'active' : ''}`}
                  onClick={() => setCatalogFilter(cat)}
                  style={{ 
                    borderColor: catalogFilter === cat ? 'var(--gold-solid)' : '',
                    color: catalogFilter === cat ? 'var(--gold-glow)' : '',
                    background: catalogFilter === cat ? 'rgba(197, 160, 89, 0.05)' : ''
                  }}
                >
                  {cat.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            <div className="catalog-grid">
              {filteredCatalog.map((sword) => (
                <div key={sword.id} className="iron-panel-interactive sword-card">
                  <div className="card-image-wrap">
                    <img src={sword.image} alt={sword.name} className="sword-card-img" />
                    <span className="sold-badge">SOLD</span>
                  </div>
                  <div className="card-content">
                    <span className="sword-category">{sword.category}</span>
                    <span className="sword-name">{sword.name}</span>
                    <p className="sword-desc" style={{ minHeight: '60px', margin: '8px 0 16px' }}>
                      {sword.desc}
                    </p>
                    <div className="sword-spec-row">
                      <span>Steel Composition</span>
                      <span>{sword.steel}</span>
                    </div>
                    <div className="sword-spec-row">
                      <span>Weight</span>
                      <span>{sword.weight}</span>
                    </div>
                    <div className="sword-spec-row">
                      <span>Length</span>
                      <span>{sword.length}</span>
                    </div>
                    <div className="sword-price-box">
                      <span style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-ash)' }}>Est. Commission Cost</span>
                      <span className="sword-name" style={{ color: 'var(--gold-glow)' }}>{sword.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forge Customizer */}
        {activeTab === 'customizer' && (
          <div>
            <div className="section-title-group">
              <span className="section-tag">Blacksmith Workbench</span>
              <h2 className="section-title">COMMISSION SPECIFICATION BUILDER</h2>
              <div className="section-divider"></div>
            </div>

            <div className="customizer-layout">
              {/* Left Column: Options Selection */}
              <div className="iron-panel customizer-options">
                
                {/* 1. Sword Type */}
                <div className="option-group">
                  <label className="option-label">1. Weapon Pattern</label>
                  <div className="option-grid">
                    <button 
                      className={`option-btn ${swordType === 'claymore' ? 'selected' : ''}`}
                      onClick={() => setSwordType('claymore')}
                    >
                      Claymore
                      <span className="option-btn-desc">Highland two-handed greatsword</span>
                    </button>
                    <button 
                      className={`option-btn ${swordType === 'dirk' ? 'selected' : ''}`}
                      onClick={() => setSwordType('dirk')}
                    >
                      Highland Dirk
                      <span className="option-btn-desc">Traditional sidearm dagger</span>
                    </button>
                    <button 
                      className={`option-btn ${swordType === 'sgian-dubh' ? 'selected' : ''}`}
                      onClick={() => setSwordType('sgian-dubh')}
                    >
                      Sgian Dubh
                      <span className="option-btn-desc">Stocking dagger ornament</span>
                    </button>
                  </div>
                </div>

                {/* 2. Steel Pattern */}
                <div className="option-group">
                  <label className="option-label">2. Blade Steel & Layering</label>
                  <div className="option-grid">
                    <button 
                      className={`option-btn ${bladeSteel === 'high-carbon' ? 'selected' : ''}`}
                      onClick={() => setBladeSteel('high-carbon')}
                    >
                      Mono High Carbon
                      <span className="option-btn-desc">Hardened En45 spring steel</span>
                    </button>
                    <button 
                      className={`option-btn ${bladeSteel === 'pattern-welded' ? 'selected' : ''}`}
                      onClick={() => setBladeSteel('pattern-welded')}
                    >
                      Pattern Welded
                      <span className="option-btn-desc">Damascus weld (320 layers)</span>
                    </button>
                  </div>
                </div>

                {/* 3. Pommel / Guard fittings */}
                <div className="option-group">
                  <label className="option-label">3. Guard & Fittings Alloy</label>
                  <div className="option-grid">
                    <button 
                      className={`option-btn ${hiltMetal === 'steel' ? 'selected' : ''}`}
                      onClick={() => setHiltMetal('steel')}
                    >
                      Hand-filed Iron
                      <span className="option-btn-desc">Tempered steel fittings</span>
                    </button>
                    <button 
                      className={`option-btn ${hiltMetal === 'bronze' ? 'selected' : ''}`}
                      onClick={() => setHiltMetal('bronze')}
                    >
                      Cast Bronze
                      <span className="option-btn-desc">Warm glowing antique copper alloy</span>
                    </button>
                    <button 
                      className={`option-btn ${hiltMetal === 'sterling-silver' ? 'selected' : ''}`}
                      onClick={() => setHiltMetal('sterling-silver')}
                    >
                      Sterling Silver
                      <span className="option-btn-desc">Precious metal hilt detailing</span>
                    </button>
                  </div>
                </div>

                {/* 4. Grip hardwood */}
                <div className="option-group">
                  <label className="option-label">4. Carved Grip Hardwood</label>
                  <div className="option-grid">
                    <button 
                      className={`option-btn ${gripWood === 'oak' ? 'selected' : ''}`}
                      onClick={() => setGripWood('oak')}
                    >
                      Highland Oak
                      <span className="option-btn-desc">Tough fibrous native wood</span>
                    </button>
                    <button 
                      className={`option-btn ${gripWood === 'walnut' ? 'selected' : ''}`}
                      onClick={() => setGripWood('walnut')}
                    >
                      Scottish Walnut
                      <span className="option-btn-desc">Dark figured rich grain wood</span>
                    </button>
                    <button 
                      className={`option-btn ${gripWood === 'ebony' ? 'selected' : ''}`}
                      onClick={() => setGripWood('ebony')}
                    >
                      Gabon Ebony
                      <span className="option-btn-desc">Imported dense ironwood</span>
                    </button>
                  </div>
                </div>

                {/* 5. Custom Engraving */}
                <div className="option-group">
                  <label className="option-label">5. Ancestral Carvings & Lettering</label>
                  <div className="option-grid">
                    <button 
                      className={`option-btn ${engraving === 'none' ? 'selected' : ''}`}
                      onClick={() => setEngraving('none')}
                    >
                      None
                      <span className="option-btn-desc">Plain polished finish</span>
                    </button>
                    <button 
                      className={`option-btn ${engraving === 'celtic-braid' ? 'selected' : ''}`}
                      onClick={() => setEngraving('celtic-braid')}
                    >
                      Celtic Braid
                      <span className="option-btn-desc">Hand-carved interlaced braids</span>
                    </button>
                    <button 
                      className={`option-btn ${engraving === 'family-emblem' ? 'selected' : ''}`}
                      onClick={() => setEngraving('family-emblem')}
                    >
                      Family Crest
                      <span className="option-btn-desc">Gilt heraldic steel engraving</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Preview & Cost summary */}
              <div className="iron-panel customizer-preview">
                <div className="hilt-visualizer-box">
                  <span className="visualizer-overlay">BLACKSMITH SCHEMATIC</span>
                  
                  {/* Dynamic SVG Sword Representation */}
                  <svg width="150" height="240" viewBox="0 0 100 200" fill="none">
                    <defs>
                      <linearGradient id="welded-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" className="welded-steel-stop-1" />
                        <stop offset="50%" className="welded-steel-stop-2" />
                        <stop offset="100%" className="welded-steel-stop-1" />
                      </linearGradient>
                    </defs>

                    {/* Blade drawing */}
                    {swordType === 'claymore' && (
                      <path d="M50,140 L46,20 L50,10 L54,20 L50,140 Z" fill={bladeSteel === 'pattern-welded' ? 'url(#welded-gradient)' : '#7d7a75'} stroke="#3a3835" strokeWidth="1" />
                    )}
                    {swordType === 'dirk' && (
                      <path d="M50,140 L47,50 L50,40 L53,50 L50,140 Z" fill={bladeSteel === 'pattern-welded' ? 'url(#welded-gradient)' : '#7d7a75'} stroke="#3a3835" strokeWidth="1" />
                    )}
                    {swordType === 'sgian-dubh' && (
                      <path d="M50,140 L48,80 L50,75 L52,80 L50,140 Z" fill={bladeSteel === 'pattern-welded' ? 'url(#welded-gradient)' : '#7d7a75'} stroke="#3a3835" strokeWidth="1" />
                    )}

                    {/* Crossguard drawing */}
                    {swordType === 'claymore' && (
                      <path 
                        d="M20,140 L80,140 L76,145 L24,145 Z" 
                        fill={hiltMetal === 'bronze' ? '#c59a3f' : hiltMetal === 'sterling-silver' ? '#d9d9d9' : '#55524e'} 
                      />
                    )}
                    {(swordType === 'dirk' || swordType === 'sgian-dubh') && (
                      <path 
                        d="M36,140 L64,140 L61,144 L39,144 Z" 
                        fill={hiltMetal === 'bronze' ? '#c59a3f' : hiltMetal === 'sterling-silver' ? '#d9d9d9' : '#55524e'} 
                      />
                    )}

                    {/* Wood Grip drawing */}
                    <rect 
                      x="45" 
                      y="145" 
                      width="10" 
                      height="30" 
                      rx="1"
                      fill={gripWood === 'oak' ? '#8e714d' : gripWood === 'walnut' ? '#5a4634' : '#1c1c1a'} 
                    />
                    
                    {/* Pommel drawing */}
                    <circle 
                      cx="50" 
                      cy="178" 
                      r="6" 
                      fill={hiltMetal === 'bronze' ? '#c59a3f' : hiltMetal === 'sterling-silver' ? '#d9d9d9' : '#55524e'} 
                    />
                  </svg>
                </div>

                <div className="preview-stat-card">
                  <span className="option-label">Calculated Metrics</span>
                  
                  <div className="sword-spec-row">
                    <span>Blade Length</span>
                    <span>{currentSpecs.length}</span>
                  </div>
                  
                  <div className="sword-spec-row">
                    <span>Estimated Weight</span>
                    <span>{currentSpecs.weight}</span>
                  </div>

                  <div className="sword-spec-row">
                    <span>Point of Balance</span>
                    <span>{currentSpecs.balance}</span>
                  </div>

                  <div className="sword-spec-row" style={{ borderBottom: 'none' }}>
                    <span>Estimated Cost</span>
                    <span className="preview-price">{currentSpecs.price}</span>
                  </div>

                  <div className="deposit-info-pill">
                    <ShieldAlert size={14} style={{ marginRight: '8px', color: 'var(--gold-solid)', display: 'inline', verticalAlign: 'middle' }} />
                    <span>A deposit of <strong>{currentSpecs.deposit}</strong> (50 percent) is requested to book a commission slot.</span>
                  </div>

                  <button className="custom-button" style={{ width: '100%', marginTop: '8px' }} onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      customSpecs: `Pattern: ${swordType.toUpperCase()}, Steel: ${bladeSteel.toUpperCase()}, Hilt: ${hiltMetal.toUpperCase()}, Wood: ${gripWood.toUpperCase()}, Engraving: ${engraving.toUpperCase()}` 
                    }));
                    setActiveTab('contact');
                  }}>
                    Record Specs to Ledger
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WIP / Videos page */}
        {activeTab === 'wip' && (
          <div>
            <div className="section-title-group">
              <span className="section-tag">Forge Chronicle</span>
              <h2 className="section-title">WORK IN PROGRESS & ANCESTRAL PROJECTS</h2>
              <div className="section-divider"></div>
            </div>

            <div className="wip-grid">
              {WIP_POSTS.map((post) => (
                <div key={post.id} className="iron-panel wip-card">
                  {post.youtubeId && (
                    <div className="video-embed-container">
                      <iframe
                        className="video-iframe"
                        src={`https://www.youtube.com/embed/${post.youtubeId}`}
                        title="Vogie Forge Youtube"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  <div className="wip-content">
                    <span className="wip-date">{post.date}</span>
                    <h3 className="wip-title">{post.title}</h3>
                    <p className="wip-desc">{post.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coronation details */}
            <div className="coronation-banner">
              <div className="coronation-text">
                <span className="coronation-tag">Coronation Presentation</span>
                <h3 className="coronation-title">The Sword of State presented to King Charles III</h3>
                <p className="coronation-desc">
                  The Elizabeth ceremonial Sword of State of Scotland, housed in Edinburgh Castle, represents the newest addition to the Honours of Scotland. Dane at Vogie Forge carved the entire wood scabbard and designed the gilt lettering. The purple silken velvet sleeve was stitched by hand in our workshop by Angelyn.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <a href="https://youtu.be/R-xBoEqfSGQ" target="_blank" rel="noreferrer" className="custom-button" style={{ textDecoration: 'none' }}>
                    <Play size={16} /> View Coronation presentation
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Award size={96} style={{ color: 'var(--gold-solid)', filter: 'drop-shadow(0 0 10px rgba(197, 160, 89, 0.2))' }} />
              </div>
            </div>
          </div>
        )}

        {/* Q&A Accordion page */}
        {activeTab === 'qa' && (
          <div>
            <div className="section-title-group">
              <span className="section-tag">Blacksmith Codex</span>
              <h2 className="section-title">TECHNICAL QUESTIONS & MANUAL</h2>
              <div className="section-divider"></div>
            </div>

            <div className="accordion-list">
              {FAQS.map((faq) => {
                const isOpen = activeFaq === faq.id;
                return (
                  <div key={faq.id} className={`accordion-item ${isOpen ? 'open' : ''}`}>
                    <div 
                      className="accordion-trigger"
                      onClick={() => setActiveFaq(isOpen ? null : faq.id)}
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

            {/* Blacksmith Process details */}
            <div style={{ marginTop: '80px', borderTop: '1px solid var(--border-iron)', paddingTop: '64px' }}>
              <div className="section-title-group">
                <span className="section-tag">Anvil Methods</span>
                <h2 className="section-title">THE TRADITIONAL BLACKSMITHING METHOD</h2>
                <div className="section-divider"></div>
              </div>

              <div className="quality-banner-grid">
                <div className="iron-panel quality-card">
                  <div className="quality-icon-wrap">
                    <Sliders size={20} />
                  </div>
                  <h3 className="quality-title">Taper & Balance</h3>
                  <p className="quality-desc">
                    By drawing out steel from a thick billet, we achieve the historical weight profile (1/4" to 1/2" thick near the hilt, tapering to 1/16" at the tip). This ensures the sword is light and maneuverable in the hand.
                  </p>
                </div>

                <div className="iron-panel quality-card">
                  <div className="quality-icon-wrap">
                    <Hammer size={20} />
                  </div>
                  <h3 className="quality-title">Compacting Fibres</h3>
                  <p className="quality-desc">
                    The hammering process compacts the steel grains along the edges, resulting in a structural strength and edge durability that industrial machine-ground blades can never achieve.
                  </p>
                </div>

                <div className="iron-panel quality-card">
                  <div className="quality-icon-wrap">
                    <Award size={20} />
                  </div>
                  <h3 className="quality-title">Museum Authenticity</h3>
                  <p className="quality-desc">
                    Each guard, grip carving, and scabbard layout is inspired by historical relics in museums, keeping heritage alive with honest, handmade craftsmanship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* God's Word Section */}
        {activeTab === 'godsword' && (
          <div>
            <div className="section-title-group">
              <span className="section-tag">Scripture Reflection</span>
              <h2 className="section-title">THE SWORD OF THE SPIRIT</h2>
              <div className="section-divider"></div>
            </div>

            <div className="godsword-banner" style={{
              backgroundImage: 'linear-gradient(rgba(10, 9, 8, 0.75), rgba(10, 9, 8, 0.95)), url("https://static.wixstatic.com/media/cd5cc7_75f893fef5774cd3ad077e26c170a3cc~mv2.jpg/v1/fill/w_1200,h_400,al_c,q_85/file.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid var(--border-iron)',
              borderBottom: '3px double var(--gold-solid)',
              padding: '64px 32px',
              textAlign: 'center',
              maxWidth: '850px',
              margin: '0 auto 56px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                color: 'var(--gold-solid)',
                letterSpacing: '2px',
                display: 'block',
                marginBottom: '16px',
                textShadow: 'var(--glow-gold)'
              }}>
                Ephesians 6 v17
              </span>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '22px',
                fontStyle: 'italic',
                color: 'var(--text-bone)',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.6',
                textShadow: '2px 2px 8px rgba(0,0,0,0.9)'
              }}>
                'And take the helmet of salvation, and the sword of the Spirit, which is the word of God:'
              </p>
            </div>

            <div className="parchment-scroll" style={{ padding: '48px', maxWidth: '850px', margin: '0 auto' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--ink-red)', marginBottom: '24px', textAlign: 'center' }}>Concerning the Possession of God's Word</h3>
              
              <p className="drop-cap-parchment" style={{ fontSize: '18px', color: 'var(--ink-dark)', lineHeight: '1.8', marginBottom: '20px' }}>
                An interest in the sword will eventually lead one to recognise that history's best seller, the King James Bible, refers to itself as the 'sword of the Spirit'. Every sword is known as a weapon of offense as well as defense, a symbol of power as well as protection. 
              </p>
              
              <p style={{ fontSize: '18px', color: 'var(--ink-dark)', lineHeight: '1.8', marginBottom: '20px' }}>
                According to Hebrews chapter 4 v12, 'the word of God is quick, and powerful, and sharper than any two edged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and morrow, and is a discerner of the thoughts and intents of the heart.' 1 Peter 1 v23 says one is 'born again, not of corruptible seed, but of incorruptible, by the word of God, which liveth and abideth for ever.'
              </p>

              <p style={{ fontSize: '18px', color: 'var(--ink-dark)', lineHeight: '1.8', marginBottom: '20px' }}>
                In John 12 v48, Jesus says, 'He that rejecteth me, and receiveth not my words, hath one that judgeth him: the word that I have spoken, the same shall judge him in the last day.' It is interesting to see from scripture that God's word, or sword, is intended to be man's greatest friend, or greatest foe; the hope of our eternal protection, or the instrument of our eternal destruction. 
              </p>

              <p style={{ fontSize: '18px', color: 'var(--ink-dark)', lineHeight: '1.8', marginBottom: '20px' }}>
                'And this is the record, that God hath given to us eternal life, and this life is in his Son' (1 John 5 v11). This 'record' is also called the 'gospel' in 1 Corinthians 15 v1-4, 'how that Christ died for our sins according to the scriptures; And that he was buried, and that he rose again the third day according to the scriptures:' Faith in God's word as the written record of the gospel determines our eternal destination, and therefore Acts 16 v31 states, 'believe on the Lord Jesus Christ, and thou shalt be saved'.
              </p>

              <p style={{ fontSize: '18px', color: 'var(--ink-dark)', lineHeight: '1.8', marginBottom: '24px' }}>
                Considering all this, what sword could be of greater importance, or worth possessing? For this reason, Vogie Forge offers free King James Bibles upon request, while supplies last. Please contact us for more information.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                <button className="custom-button" style={{ background: 'var(--ink-red)', borderColor: 'var(--ink-red)', color: 'white' }} onClick={() => {
                  setFormData(prev => ({ ...prev, message: 'I would like to request a free copy of the King James Bible, as offered on your website.' }));
                  setActiveTab('contact');
                }}>
                  Request a Free Bible
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Contact page */}
        {activeTab === 'contact' && (
          <div>
            <div className="section-title-group">
              <span className="section-tag">Commence Work</span>
              <h2 className="section-title">RECORD ANCESTRAL COMMISSION ENQUIRY</h2>
              <div className="section-divider"></div>
            </div>

            <div className="contact-layout">
              {/* Left Column: Form */}
              <div className="iron-panel contact-form-panel">
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', marginBottom: '24px' }}>SEND MESSAGE TO FORGE</h3>
                
                {formSubmitted ? (
                  <div style={{ background: 'rgba(197, 160, 89, 0.05)', border: '1px solid var(--gold-solid)', padding: '28px', borderRadius: '2px', color: 'var(--text-bone)', textAlign: 'center' }}>
                    <Check size={32} style={{ color: 'var(--gold-solid)', margin: '0 auto 12px' }} />
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>RECORD LOGGED</h4>
                    <p style={{ color: 'var(--text-tarnish)', fontSize: '15px' }}>
                      Thank you for submitting your details. Dane will review your commission request and get back to you shortly at the email provided.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-row-2col">
                      <div className="form-group">
                        <label className="form-label">Name of Enquirer</label>
                        <input 
                          type="text" 
                          required 
                          className="custom-input" 
                          placeholder="e.g. John McDuffee"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          className="custom-input" 
                          placeholder="e.g. john@mcduffee.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Custom Specifications (Selected Builder Specs)</label>
                      <input 
                        type="text" 
                        className="custom-input" 
                        placeholder="Select options in the Customizer to fill this automatically..."
                        value={formData.customSpecs}
                        onChange={(e) => setFormData(prev => ({ ...prev, customSpecs: e.target.value }))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Message Details (Ancestral lineage, reference symbols, grip length)</label>
                      <textarea 
                        required 
                        rows={6} 
                        className="custom-input" 
                        placeholder="Detail your ancestral heritage carvings, historical reference material, or specific measurements..."
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      ></textarea>
                    </div>

                    <button type="submit" className="custom-button" style={{ width: '100%' }}>
                      <Send size={14} /> Send Message to Forge
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Policies & Contacts */}
              <div className="iron-panel contact-info-panel">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', borderBottom: '1px solid var(--border-iron)', paddingBottom: '8px' }}>DIRECT CONTACT</h3>
                  
                  <div className="contact-info-card">
                    <Mail size={16} className="contact-info-icon" />
                    <div className="meta-field">
                      <span className="meta-label">Email Address</span>
                      <a href="mailto:vogieforge@gmail.com" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>vogieforge@gmail.com</a>
                    </div>
                  </div>

                  <div className="contact-info-card">
                    <MapPin size={16} className="contact-info-icon" />
                    <div className="meta-field">
                      <span className="meta-label">Forge Location</span>
                      <span className="meta-value">The Highlands, Scotland, UK</span>
                    </div>
                  </div>
                </div>

                <div className="parchment-scroll policy-card">
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--ink-red)' }}>COMMISSION LAWS</h4>
                  <ul className="policy-list">
                    <li className="policy-list-item">
                      <span className="policy-bullet">▪</span>
                      <span>50 percent deposit required to book slot in blacksmith ledger.</span>
                    </li>
                    <li className="policy-list-item">
                      <span className="policy-bullet">▪</span>
                      <span>Payments accepted via secure bank transfer or PayPal.</span>
                    </li>
                    <li className="policy-list-item">
                      <span className="policy-bullet">▪</span>
                      <span>Outstanding balance and shipping cost due before courier dispatch.</span>
                    </li>
                    <li className="policy-list-item">
                      <span className="policy-bullet">▪</span>
                      <span>14 day cancellation policy applies to non-personalized blades.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-emblem">VOGIE FORGE</span>
        <div style={{ display: 'flex', gap: '24px', fontSize: '15px', fontFamily: 'var(--font-accent)' }}>
          <a href="#home" style={{ color: 'var(--text-tarnish)', textDecoration: 'none' }} onClick={() => setActiveTab('home')}>Home</a>
          <a href="#ledger" style={{ color: 'var(--text-tarnish)', textDecoration: 'none' }} onClick={() => setActiveTab('catalog')}>Ledger</a>
          <a href="#builder" style={{ color: 'var(--text-tarnish)', textDecoration: 'none' }} onClick={() => setActiveTab('customizer')}>Builder</a>
          <a href="#godsword" style={{ color: 'var(--text-tarnish)', textDecoration: 'none' }} onClick={() => setActiveTab('godsword')}>God's Word</a>
          <a href="#qa" style={{ color: 'var(--text-tarnish)', textDecoration: 'none' }} onClick={() => setActiveTab('qa')}>Q&A</a>
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Vogie Forge. Hand forged in Scotland. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
