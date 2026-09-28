import { Product, BundleTier, DistributorLocation, FAQItem, LeadSubmission, InventoryItem } from '../types';

export const LOGO_IMAGE_URL = 'https://i.ibb.co/zhWkB5Fh/LESEKESE.jpg';
export const STORE_IMAGE_URL = '/src/assets/images/lesekese_market_store_1786352293184.jpg';
export const SEND_OFF_IMAGE_URL = 'https://i.ibb.co/JRRM44Q6/Untitled-design-5.jpg';

/* ---- LESEKESE Instant Killer 500ml (spray) imagery ---- */
export const HERO_IMAGE_URL = 'https://i.ibb.co/9mCbWFvp/Buy-Lesekese-Bedbugs-and-Cockroaches-Instant-Killer-3-1.png';
export const PRODUCT_IMAGE_SINGLE = 'https://i.ibb.co/wF5XmX3s/Whats-App-Image-2026-09-10-at-1-44-49-PM.jpg';
export const PRODUCT_IMAGE_MULTIPLE = 'https://i.ibb.co/XxXmg8QW/Buy-Lesekese-Bedbugs-and-Cockroaches-Instant-Killer.jpg';
export const PRODUCT_IN_ACTION_IMAGE = 'https://i.ibb.co/sdzNttW2/Lesekese.png';

/* ---- Distributor / store-locator section artwork ---- */
export const DISTRIBUTOR_SECTION_IMAGE =
  'https://i.ibb.co/MxMGrwHw/Lesekese-Bedbugs-Cockroach-Instant-Killer.jpg';

/* ---- "Join the LESEKESE family" (earn) banner ---- */
export const EARN_SECTION_IMAGE =
  'https://i.ibb.co/hFHt5ZKy/Lesekese-Bedbugs-Cockroach-Instant-Killer-1.jpg';

/* ---- Final CTA ("Say goodbye to bedbugs") video, self-hosted in /public/video ---- */
export const GOODBYE_VIDEO_URL = '/video/say-goodbye-to-bedbugs.mp4';
export const GOODBYE_VIDEO_POSTER = 'https://i.ibb.co/tpCFTmL0/Lesekese-banners-6.jpg';

/* Back-compat aliases for the single 500ml SKU */
export const BOTTLE_IMAGE_URL = PRODUCT_IMAGE_SINGLE;
export const ALL_PRODUCTS_IMAGE = PRODUCT_IMAGE_MULTIPLE;

/* ---- "Power of LESEKESE in action" video (plays in-page) ----
   The reel is self-hosted in /public/video/ and rendered with a native HTML5
   player, so it plays inside the page with no external dependency. */
export const ACTION_VIDEO_URL = '/video/lesekese-in-action.mp4';
export const ACTION_VIDEO_POSTER = 'https://i.ibb.co/kWsG7Lt/Lesekese-banners.jpg';

export const INSTANT_KILLER_PRODUCT_ID = 'prod-500';
export const SEND_OFF_PRODUCT_ID = 'prod-sendoff';

export const NAIROBI_WHATSAPP = '2348023725740';
export const NAIROBI_PHONE = '08023725740';
/** Order enquiries by email — the third ordering channel alongside WhatsApp and call. */
export const ORDER_EMAIL = 'lesekeseproducts@gmail.com';
/** Formspree inbox that receives orders submitted through the Order Now form. */
export const ORDER_FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrpzqnyz';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-500',
    name: 'LESEKESE Bedbugs & Cockroaches Instant Killer',
    sizeMl: 500,
    sizeLabel: '500ml Bottle',
    priceNgn: 10000,
    popular: true,
    description: 'One powerful 500ml bottle. Kills bedbugs, bedbug eggs and cockroaches on contact, with 3-day residual protection. Buy 1, 2, 3 or 5 bottles depending on how many rooms you need to treat — the more you buy, the more you save per room.',
    kills: [
      'Adult Bedbugs & Nymphs',
      'Bedbug Eggs (Larvae)',
      'German & American Cockroaches',
      'Mosquitoes & Midges',
      'Sand Flies & Fleas',
      'Wall Spiders & Ants'
    ],
    sprayType: 'Ergonomic Ergofit Trigger Pump',
    coverageArea: '1 Bottle = 1 Bedroom · 5 Bottles = Up to 6 Bedrooms (180 sq.m)',
    stockStatus: 'In Stock',
    rating: 4.9,
    reviewsCount: 384,
    image: PRODUCT_IMAGE_SINGLE
  },
  {
    id: 'prod-sendoff',
    name: 'LESEKESE SEND OFF',
    sizeMl: 250,
    sizeLabel: '250g Powder',
    priceNgn: 6000,
    popular: false,
    productType: 'powder',
    description: 'Specially formulated repellent powder that creates a powerful protective barrier against snakes, scorpions, reptiles and crawling pests. Proven effective for up to 3 weeks per application.',
    kills: [],
    features: [
      'Repels Snakes & All Reptiles',
      'Repels Scorpions & Centipedes',
      'Protects Homes, Farms & Compounds',
      'Up to 3 Weeks Residual Barrier',
      'Safe for Outdoor Perimeter Use',
      'Unpleasant-Odor Deterrent Formula'
    ],
    sprayType: 'Sprinkle Powder — No Sprayer Needed',
    coverageArea: 'Full Compound / Perimeter Protection',
    stockStatus: 'In Stock',
    rating: 4.8,
    reviewsCount: 97,
    image: SEND_OFF_IMAGE_URL
  }
];

/* ============================================================
   ONE SIZE. MANY PRICES.
   LESEKESE Instant Killer is sold exclusively in the 500ml
   bottle. Customers pick how MANY bottles they need — the
   quantity tier sets the price. Figures below are the official
   pricing and must match the standalone landing page exactly.
   ============================================================ */
export const BUNDLES: BundleTier[] = [
  {
    id: 'bundle-starter',
    label: 'Starter',
    bottles: 1,
    priceNgn: 10000,
    headline: '1 Bottle × 500ml',
    description:
      'Perfect for a 1-bedroom apartment. Kills bedbugs, eggs & cockroaches on contact.',
    bestFor: '1-bedroom apartment',
    coverage: 'Room-by-Room Treatment',
    includes: [
      'Kills Bedbugs on Contact',
      '3-Day Residual Protection',
      'Room-by-Room Treatment'
    ]
  },
  {
    id: 'bundle-family',
    label: 'Family',
    bottles: 2,
    priceNgn: 15000,
    listPriceNgn: 18000,
    badge: 'MOST POPULAR',
    highlight: true,
    headline: '2 Bottles × 500ml',
    description:
      'Ideal for a 2-bedroom flat. Covers full fumigation including hidden cracks & seams.',
    bestFor: '2-bedroom flat',
    coverage: 'Room-by-Room Treatment',
    includes: [
      'Kills Bedbugs on Contact',
      '3-Day Residual Protection',
      'Room-by-Room Treatment'
    ]
  },
  {
    id: 'bundle-full-house',
    label: 'Full House',
    bottles: 3,
    priceNgn: 20000,
    listPriceNgn: 27000,
    badge: 'BEST VALUE',
    headline: '3 Bottles × 500ml',
    description:
      'Complete 3-bedroom apartment fumigation. No more bedbugs or their eggs — guaranteed.',
    bestFor: '3-bedroom apartment',
    coverage: 'Full Apartment Fumigation',
    includes: [
      'Kills Bedbugs on Contact',
      '3-Day Residual Protection',
      'Full Apartment Fumigation'
    ]
  },
  {
    id: 'bundle-landlord',
    label: 'Landlord',
    bottles: 5,
    priceNgn: 25000,
    listPriceNgn: 45000,
    badge: 'MAX SAVINGS',
    headline: '5 Bottles × 500ml',
    description:
      'Treat multiple rooms or an entire building. Best for landlords, hostels & hotels.',
    bestFor: 'Multiple rooms / whole building',
    coverage: 'Full Apartment Fumigation',
    includes: [
      'Kills Bedbugs on Contact',
      '3-Day Residual Protection',
      'Full Apartment Fumigation'
    ]
  }
];

/** Flat per-bottle rate once you buy 2 or more (matches the Landlord tier). */
export const VOLUME_RATE_NGN = 5000;

/** Price any bottle count, honouring the published tiers. */
export function priceForBottleCount(bottles: number): number {
  const n = Math.max(1, Math.floor(bottles));
  const tier = BUNDLES.find((b) => b.bottles === n);
  return tier ? tier.priceNgn : n * VOLUME_RATE_NGN;
}

/** Closest published tier for a bottle count (for labelling/positioning). */
export function tierForBottleCount(bottles: number): BundleTier {
  const n = Math.max(1, Math.floor(bottles));
  return (
    BUNDLES.find((b) => b.bottles === n) ??
    BUNDLES.reduce((best, b) =>
      Math.abs(b.bottles - n) < Math.abs(best.bottles - n) ? b : best
    )
  );
}

export function savingsForBottleCount(bottles: number): number {
  const n = Math.max(1, Math.floor(bottles));
  const list = BUNDLES.find((b) => b.bottles === n)?.listPriceNgn;
  return list ? list - priceForBottleCount(n) : 0;
}

export const LOCATIONS: DistributorLocation[] = [
  {
    id: 'dist-01',
    name: 'Fagba Main Depot (Primary Market HQ)',
    zone: 'Lagos Mainland',
    address: 'Suite 2 Adedoja Plaza, Fagba Railway (beside Bokku), Lagos',
    landmark: 'Beside Bokku Supermarket, Fagba Railway, Lagos',
    phone: '08023725740',
    whatsapp: '2348023725740',
    hours: 'Mon - Sat: 7:30 AM - 6:30 PM WAT',
    lat: 6.6456,
    lng: 3.3289,
    isPrimary: true,
    photoUrl: STORE_IMAGE_URL,
    stockAvailable: { instantKiller: true, sendOff: true }
  },
  {
    id: 'dist-02',
    name: 'Fagba Junction Agro-Pharmacy',
    zone: 'Lagos Mainland',
    address: '42 Iju Road, Fagba Bus Stop, Ifako-Ijaiye, Lagos',
    landmark: 'Beside NNPC Filling Station',
    phone: '08034129850',
    whatsapp: '2348034129850',
    hours: 'Mon - Sat: 8:00 AM - 7:00 PM',
    lat: 6.6512,
    lng: 3.3341,
    isPrimary: false,
    photoUrl: STORE_IMAGE_URL,
    stockAvailable: { instantKiller: true, sendOff: true }
  },
  {
    id: 'dist-03',
    name: 'Ikeja Commercial Chemicals Store',
    zone: 'Lagos Mainland',
    address: 'Shop 8, Computer Village extension, Otigba Street, Ikeja, Lagos',
    landmark: 'Near Underbridge Ikeja',
    phone: '08051234900',
    whatsapp: '2348051234900',
    hours: 'Mon - Sat: 8:30 AM - 6:00 PM',
    lat: 6.5965,
    lng: 3.3421,
    stockAvailable: { instantKiller: true, sendOff: true }
  },
  {
    id: 'dist-04',
    name: 'Surulere Supermart & Agro Supply',
    zone: 'Lagos Mainland',
    address: '112 Adeniran Ogunsanya Street, Surulere, Lagos',
    landmark: 'Opposite Leisure Mall',
    phone: '08029871122',
    whatsapp: '2348029871122',
    hours: 'Mon - Sun: 8:00 AM - 8:00 PM',
    lat: 6.4985,
    lng: 3.3592,
    stockAvailable: { instantKiller: true, sendOff: true }
  },
  {
    id: 'dist-05',
    name: 'Lekki Phase 1 Household Centre',
    zone: 'Lagos Island',
    address: 'Admiralty Way, Gate 2 Plaza, Lekki Phase 1, Lagos',
    landmark: 'Beside Enyo Petrol Station',
    phone: '08182233445',
    whatsapp: '2348182233445',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    lat: 6.4478,
    lng: 3.4723,
    stockAvailable: { instantKiller: true, sendOff: false }
  },
  {
    id: 'dist-06',
    name: 'Abuja Wuse II Central Depot',
    zone: 'Abuja',
    address: 'Suite 204, Aminu Kano Crescent, Wuse II, Abuja FCT',
    landmark: 'Opposite Banex Plaza',
    phone: '08099887766',
    whatsapp: '2348099887766',
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    lat: 9.0765,
    lng: 7.4789,
    stockAvailable: { instantKiller: true, sendOff: true }
  },
  {
    id: 'dist-07',
    name: 'Port Harcourt Garrison Chemical Hub',
    zone: 'Port Harcourt',
    address: '45 Aba Road, Garrison Junction, Port Harcourt, Rivers State',
    landmark: 'Near Garrison Flyover',
    phone: '08077665544',
    whatsapp: '2348077665544',
    hours: 'Mon - Sat: 8:00 AM - 5:30 PM',
    lat: 4.8156,
    lng: 7.0123,
    stockAvailable: { instantKiller: true, sendOff: false }
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Safety',
    question: 'Is LESEKESE safe to use in bedrooms and residential living areas?',
    answer: 'Yes. LESEKESE is formulated for residential and commercial application. When sprayed according to instructions, allow the room to dry thoroughly (30–45 minutes with windows open for ventilation) before re-entry. It leaves no harsh lingering greasy residue.'
  },
  {
    id: 'faq-2',
    category: 'Efficacy',
    question: 'How long does the residual action last after spraying?',
    answer: 'LESEKESE features active micro-crystallization technology that continues killing bedbugs, nymphs, and cockroaches for 3+ days after application. Any newly hatched or hidden bugs creeping across sprayed surfaces will contact the residual layer and be eliminated.'
  },
  {
    id: 'faq-3',
    category: 'Efficacy',
    question: 'Does LESEKESE kill bedbug eggs and larvae?',
    answer: 'Yes. LESEKESE disrupts the outer waxy egg membrane and dehydrates larvae. For severe infestations, we recommend a second follow-up treatment 7–10 days after the initial spray to ensure 100% eradication of newly hatched nymphs.'
  },
  {
    id: 'faq-4',
    category: 'Application',
    question: 'Where exactly should I spray for maximum bedbug eradication?',
    answer: 'Focus on bed frame joints, wooden slats, mattress seams, headboards, wall cracks, electrical outlets surrounds, skirting boards, sofa cushions, and curtain folds. Bedbugs hide in 1mm cracks!'
  },
  {
    id: 'faq-5',
    category: 'Ordering',
    question: 'Can I order in bulk for hotel, hostel, or retail distribution?',
    answer: 'Absolutely! We offer discounted bulk carton pricing for hotels, hostels, pest control technicians, and retail distributors. Fill out our Bulk Order / Distributor form on the Contact page or message us directly on WhatsApp at 08023725740.'
  },
  {
    id: 'faq-6',
    category: 'Storage',
    question: 'What is the shelf life and storage requirement?',
    answer: 'Keep the spray bottle tightly sealed in a cool, dry place away from direct sunlight and out of reach of children. Sealed shelf life is 36 months from manufacture date.'
  },
  {
    id: 'faq-7',
    category: 'Send Off',
    question: 'What is LESEKESE SEND OFF and what pests does it repel?',
    answer: 'LESEKESE SEND OFF is a specially formulated 250g powder repellent designed to create a protective barrier against snakes, scorpions, reptiles and crawling pests. Its active formula produces an unpleasant odour and disturbing effect that discourages snakes and scorpions from entering treated areas. It is NOT an insecticide — it is a deterrent/repellent powder, suitable for outdoor perimeters, farms, compounds, and storage areas.'
  },
  {
    id: 'faq-8',
    category: 'Send Off',
    question: 'How do I apply LESEKESE SEND OFF and how long does it last?',
    answer: 'Simply sprinkle LESEKESE SEND OFF powder evenly on the ground around the area requiring protection — perimeter walls, entrances, boundaries, farm edges, store surrounds, and any location where reptile activity is a concern. Do not apply directly to people, animals, food, or water. One application provides a repellent barrier for up to 3 weeks, depending on rainfall and surface conditions. Reapply after heavy rain or when the repellent effect weakens.'
  },
  {
    id: 'faq-9',
    category: 'Send Off',
    question: 'Is LESEKESE SEND OFF safe for children and pets around the treated area?',
    answer: 'Keep children and pets away from freshly treated areas. Avoid breathing the dust during application. Wash hands thoroughly after use. Do not allow direct contact with eyes, skin, or clothing. If inhaled, move to fresh air immediately and seek medical attention if symptoms persist. When used as directed on outdoor perimeters, LESEKESE SEND OFF poses no risk to household members who are not in direct contact with the powder.'
  }
];

export const SAMPLE_LEADS: LeadSubmission[] = [
  {
    id: 'lead-101',
    createdAt: '2026-08-09 14:22',
    fullName: 'Chief Emeka Okonkwo',
    email: 'emeka.okonkwo@grandhotels.ng',
    phone: '08031112233',
    inquiryType: 'Bulk Order',
    status: 'New',
    location: 'Lagos Island (Lekki)',
    message: 'Need 50 cartons of 500ml LESEKESE for whole-hotel routine bedbug treatment.'
  },
  {
    id: 'lead-102',
    createdAt: '2026-08-08 09:15',
    fullName: 'Mrs. Alhaja Folashade Adebayo',
    email: 'folashade.stores@gmail.com',
    phone: '08023344556',
    inquiryType: 'Distributor Application',
    status: 'Contacted',
    location: 'Abule Egba, Lagos',
    message: 'I want to become an authorized retailer in Abule Egba extension market.'
  },
  {
    id: 'lead-103',
    createdAt: '2026-08-07 16:40',
    fullName: 'Engr. Tunde Bakare',
    email: 'tbakare@pestshield.ng',
    phone: '08187776655',
    inquiryType: 'Retailer Inquiry',
    status: 'Converted',
    location: 'Ikeja, Lagos',
    message: 'Pest management agency seeking regular weekly supply of 500ml bottles.'
  }
];

export const DISTRIBUTOR_INVENTORY: InventoryItem[] = [
  { size: 'Instant Killer 500ml — Starter (1 bottle)', inStock: 340, soldMtd: 1200, reorderThreshold: 100, unitPrice: 10000 },
  { size: 'Instant Killer 500ml — Family (2 bottles)', inStock: 210, soldMtd: 640, reorderThreshold: 80, unitPrice: 7500 },
  { size: 'Instant Killer 500ml — Full House (3 bottles)', inStock: 155, soldMtd: 480, reorderThreshold: 60, unitPrice: 6667 },
  { size: 'Instant Killer 500ml — Landlord (5 bottles)', inStock: 95, soldMtd: 310, reorderThreshold: 40, unitPrice: 5000 },
  { size: 'SEND OFF 250g Powder', inStock: 210, soldMtd: 195, reorderThreshold: 40, unitPrice: 6000 }
];
