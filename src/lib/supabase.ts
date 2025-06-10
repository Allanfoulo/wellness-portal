import { supabase } from '@/integrations/supabase/client';

// Fetch services from the database
export const fetchServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data || [];
};

// Demo credentials for testing (can be removed once real authentication is working)
export const demoCredentials = {
  admin: {
    email: 'admin@elysian.com',
    password: 'admin123',
    role: 'admin'
  },
  user: {
    email: 'user@elysian.com',
    password: 'user123',
    role: 'user'
  }
};

// Demo data for fallback (keeping for backward compatibility)
export const demoServices = [
  {
    id: 1,
    name: 'Therapeutic Massage',
    description: 'Deep tissue massage to relieve tension and promote healing',
    duration: 60,
    price: 120,
    category: 'massage',
    image: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Acupuncture Session',
    description: 'Traditional acupuncture for holistic wellness and pain relief',
    duration: 45,
    price: 90,
    category: 'acupuncture',
    image: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Meditation & Mindfulness',
    description: 'Guided meditation session for mental clarity and relaxation',
    duration: 30,
    price: 60,
    category: 'meditation',
    image: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'Aromatherapy Treatment',
    description: 'Essential oil therapy for emotional balance and stress relief',
    duration: 75,
    price: 150,
    category: 'aromatherapy',
    image: '/placeholder.svg'
  },
  {
    id: 5,
    name: 'Reiki Energy Healing',
    description: 'Energy healing session to restore balance and vitality',
    duration: 60,
    price: 100,
    category: 'energy',
    image: '/placeholder.svg'
  },
  {
    id: 6,
    name: 'Facial Rejuvenation',
    description: 'Luxury facial treatment for skin renewal and glow',
    duration: 90,
    price: 180,
    category: 'skincare',
    image: '/placeholder.svg'
  }
];

// Mock user data (keeping for backward compatibility)
export const mockUsers = {
  'admin@elysian.com': {
    id: '1',
    email: 'admin@elysian.com',
    full_name: 'Admin User',
    phone: '(555) 123-4567',
    birthday: '1990-01-01',
    medical_notes: 'No known allergies',
    emergency_contact: 'Jane Doe - (555) 987-6543',
    role: 'admin' as const
  },
  'user@elysian.com': {
    id: '2',
    email: 'user@elysian.com',
    full_name: 'Demo User',
    phone: '(555) 234-5678',
    birthday: '1985-05-15',
    medical_notes: 'Prefers gentle pressure for massages',
    emergency_contact: 'John Smith - (555) 876-5432',
    role: 'user' as const
  }
};
