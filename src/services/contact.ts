// src/services/contact.ts
import { api } from './base';

export type InquiryType = 'general' | 'order' | 'bulk' | 'reseller' | 'subscription' | 'referral' | 'partnership';

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiryType: InquiryType;
}

// Public contact form (POST /api/contact). Stored for the admin Messages page and emailed to admins.
export const contactAPI = {
  send: async (input: ContactMessageInput) => {
    const response = await api.post('/api/contact', input);
    return response.data as { success: boolean; message: string };
  },
};

// Same limits as the ContactMessage model, so long input is caught before it is sent
export const CONTACT_LIMITS = { name: 100, email: 200, phone: 30, subject: 200, message: 5000 } as const;
