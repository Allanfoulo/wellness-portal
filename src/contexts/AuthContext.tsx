
import React, { createContext, useContext, useEffect, useState } from 'react';
import { demoCredentials, mockUsers } from '@/lib/supabase';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  birthday?: string;
  medical_notes?: string;
  emergency_contact?: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('auth_user');
    const savedProfile = localStorage.getItem('auth_profile');
    
    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser));
      setProfile(JSON.parse(savedProfile));
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check demo credentials
      const isAdmin = email === demoCredentials.admin.email && password === demoCredentials.admin.password;
      const isUser = email === demoCredentials.user.email && password === demoCredentials.user.password;
      
      if (!isAdmin && !isUser) {
        return { error: 'Invalid email or password' };
      }

      const mockUser = mockUsers[email as keyof typeof mockUsers];
      if (!mockUser) {
        return { error: 'User not found' };
      }

      const userSession = { id: mockUser.id, email: mockUser.email };
      
      // Save to localStorage
      localStorage.setItem('auth_user', JSON.stringify(userSession));
      localStorage.setItem('auth_profile', JSON.stringify(mockUser));
      
      setUser(userSession);
      setProfile(mockUser);

      toast.success('Welcome back!');
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // For demo purposes, just create a new user profile
      const newUser = {
        id: Date.now().toString(),
        email,
        full_name: fullName,
        phone: '',
        birthday: '',
        medical_notes: '',
        emergency_contact: '',
        role: 'user' as const
      };

      const userSession = { id: newUser.id, email: newUser.email };
      
      // Save to localStorage
      localStorage.setItem('auth_user', JSON.stringify(userSession));
      localStorage.setItem('auth_profile', JSON.stringify(newUser));
      
      setUser(userSession);
      setProfile(newUser);

      toast.success('Account created successfully!');
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_profile');
      setUser(null);
      setProfile(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: 'Not authenticated' };

    try {
      const updatedProfile = { ...profile, ...updates };
      
      // Save to localStorage
      localStorage.setItem('auth_profile', JSON.stringify(updatedProfile));
      
      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
