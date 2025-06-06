
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Demo data for the application
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
