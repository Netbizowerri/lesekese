export interface Product {
  id: string;
  name: string;
  sizeMl: number;
  sizeLabel: string;
  priceNgn: number;
  originalPriceNgn?: number;
  popular?: boolean;
  description: string;
  kills: string[];
  sprayType: string;
  coverageArea: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Bulk Available';
  rating: number;
  reviewsCount: number;
  image?: string;
}

export interface DistributorLocation {
  id: string;
  name: string;
  zone: 'Lagos Island' | 'Lagos Mainland' | 'Abuja' | 'Port Harcourt' | 'Ibadan' | 'Edo & South';
  address: string;
  landmark: string;
  phone: string;
  whatsapp: string;
  hours: string;
  lat: number;
  lng: number;
  isPrimary?: boolean;
  photoUrl?: string;
  stockAvailable: {
    ml500: boolean;
    ml250: boolean;
    ml100: boolean;
  };
}

export interface FAQItem {
  id: string;
  category: 'Safety' | 'Efficacy' | 'Application' | 'Ordering' | 'Storage';
  question: string;
  answer: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: 'Bulk Order' | 'Retailer Inquiry' | 'Distributor Application' | 'General Question' | 'Report Issue';
  preferredLocation: string;
  quantityRequested?: string;
  message: string;
  newsletterOptIn: boolean;
}

export interface LeadSubmission {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Closed';
  location: string;
  message: string;
}

export interface InventoryItem {
  size: string;
  inStock: number;
  soldMtd: number;
  reorderThreshold: number;
  unitPrice: number;
}
