import { Product, DistributorLocation, FAQItem, LeadSubmission, InventoryItem } from '../types';

export const LOGO_IMAGE_URL = 'https://i.ibb.co/zhWkB5Fh/LESEKESE.jpg';
export const ALL_PRODUCTS_IMAGE = 'https://i.ibb.co/TBmP6b9Q/Lesekese-1.png';
export const BOTTLE_IMAGE_URL = 'https://i.ibb.co/3yKmDdjr/Lesekese.png';
export const BOTTLE_IMAGE_250 = 'https://i.ibb.co/WpD7FHfc/Lesekese-3.png';
export const BOTTLE_IMAGE_100 = 'https://i.ibb.co/6Rfw30hp/Lesekese-4.png';
export const STORE_IMAGE_URL = '/src/assets/images/lesekese_market_store_1786352293184.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-500',
    name: 'LESEKESE 500ml (Big Size)',
    sizeMl: 500,
    sizeLabel: '500ml Heavy Duty',
    priceNgn: 3000,
    originalPriceNgn: 3500,
    popular: true,
    description: 'Maximum power spray for severe bedbug infestations, whole-house treatments, and commercial spaces. High-volume trigger nozzle.',
    kills: [
      'Adult Bedbugs & Nymphs',
      'Bedbug Eggs (Larvae)',
      'German Cockroaches',
      'Mosquitoes & Midges',
      'Sand Flies & Fleas',
      'Wall Spiders & Ants'
    ],
    sprayType: 'Ergonomic Ergofit Trigger Pump',
    coverageArea: 'Treats 3–4 Bedrooms (Up to 120 sq.m)',
    stockStatus: 'In Stock',
    rating: 4.9,
    reviewsCount: 384,
    image: BOTTLE_IMAGE_URL
  },
  {
    id: 'prod-250',
    name: 'LESEKESE 250ml (Medium Size)',
    sizeMl: 250,
    sizeLabel: '250ml Standard',
    priceNgn: 2000,
    originalPriceNgn: 2500,
    popular: false,
    description: 'Ideal size for targeted room treatments, mattress seam sprays, and routine kitchen bug control. Precision stream nozzle.',
    kills: [
      'Bedbugs & Nymphs',
      'American & German Cockroaches',
      'Mosquitoes',
      'Termites & Ants'
    ],
    sprayType: 'Precision Stream & Mist Pump',
    coverageArea: 'Treats 1–2 Bedrooms (Up to 60 sq.m)',
    stockStatus: 'In Stock',
    rating: 4.8,
    reviewsCount: 219,
    image: BOTTLE_IMAGE_250
  },
  {
    id: 'prod-100',
    name: 'LESEKESE 100ml (Small Size)',
    sizeMl: 100,
    sizeLabel: '100ml Travel & Spot',
    priceNgn: 1000,
    originalPriceNgn: 1300,
    popular: false,
    description: 'Compact travel size. Perfect for hotel stays, luggage spraying, vehicle seat cracks, or quick localized pest knockdowns.',
    kills: [
      'Bedbugs',
      'Cockroaches',
      'Mosquitoes',
      'Fleas & Lice'
    ],
    sprayType: 'Fine Mist Pocket Atomizer',
    coverageArea: 'Spot Treatment & Travel Protection',
    stockStatus: 'In Stock',
    rating: 4.7,
    reviewsCount: 142,
    image: BOTTLE_IMAGE_100
  }
];

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
    stockAvailable: { ml500: true, ml250: true, ml100: true }
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
    stockAvailable: { ml500: true, ml250: true, ml100: true }
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
    stockAvailable: { ml500: true, ml250: true, ml100: false }
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
    stockAvailable: { ml500: true, ml250: true, ml100: true }
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
    stockAvailable: { ml500: true, ml250: true, ml100: true }
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
    stockAvailable: { ml500: true, ml250: true, ml100: true }
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
    stockAvailable: { ml500: true, ml250: true, ml100: false }
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
  { size: '500ml Big Size', inStock: 340, soldMtd: 1200, reorderThreshold: 100, unitPrice: 3000 },
  { size: '250ml Medium Size', inStock: 520, soldMtd: 890, reorderThreshold: 150, unitPrice: 2000 },
  { size: '100ml Small Size', inStock: 180, soldMtd: 410, reorderThreshold: 50, unitPrice: 1000 }
];
