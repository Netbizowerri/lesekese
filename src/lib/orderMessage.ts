import { NAIROBI_WHATSAPP, ORDER_EMAIL } from '../data/mockData';

export interface OrderSummary {
  /** Product name, e.g. "LESEKESE Bedbugs & Cockroaches Instant Killer 500ml". */
  productName: string;
  /** Pack label for sprays, e.g. "2-Bottle"; for powders the pack count. */
  packLabel: string;
  /** Number of 500ml bottles, or 250g packs for powder. */
  units: number;
  /** Singular noun for one unit, e.g. "500ml bottle" or "250g pack". */
  unitLabel: string;
  totalNgn: number;
  pickup: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  address?: string;
  notes?: string;
}

const line = (label: string, value: string) => `${label}: ${value}`;

/** "2 × 500ml bottles" — pluralises the real unit noun, not a placeholder. */
export function formatUnits(units: number, unitLabel: string): string {
  return `${units} × ${unitLabel}${units > 1 ? 's' : ''}`;
}

/**
 * One canonical plain-text order summary shared by every channel (WhatsApp,
 * email and the Formspree form) so a customer gets the same details whichever
 * way they order.
 */
export function buildOrderMessage(s: OrderSummary): string {
  const parts = [
    'NEW ORDER — LESEKESE',
    '',
    line('Product', s.productName),
    line('Pack', `${s.packLabel} — ${formatUnits(s.units, s.unitLabel)}`),
    line('Total', `₦${s.totalNgn.toLocaleString()}`),
  ];

  if (s.customerName?.trim()) parts.push(line('Full name', s.customerName.trim()));
  if (s.customerPhone?.trim()) parts.push(line('Phone', s.customerPhone.trim()));
  if (s.customerEmail?.trim()) parts.push(line('Email', s.customerEmail.trim()));
  if (s.address?.trim()) parts.push(line('Delivery address', s.address.trim()));
  parts.push(line('Pickup / area', s.pickup));
  if (s.notes?.trim()) parts.push('', `Notes: ${s.notes.trim()}`);

  parts.push('', 'Please confirm my order and delivery details.');
  return parts.join('\n');
}

export function buildWhatsAppUrl(s: OrderSummary): string {
  return `https://wa.me/${NAIROBI_WHATSAPP}?text=${encodeURIComponent(buildOrderMessage(s))}`;
}

export function buildOrderMailto(s: OrderSummary): string {
  const subject = `New LESEKESE order — ${s.packLabel} (₦${s.totalNgn.toLocaleString()})`;
  return `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    buildOrderMessage(s)
  )}`;
}
