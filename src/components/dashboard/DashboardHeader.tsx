
import { useAuth } from '@/contexts/AuthContext';

export const DashboardHeader = () => {
  const { profile } = useAuth();

  return (
    <div className="mb-8 animate-fade-in">
      <h1 className="text-3xl font-playfair font-bold text-charcoal-800 mb-2">
        Welcome back, {profile?.full_name}
      </h1>
      <p className="text-charcoal-600">
        Manage your appointments and personal information
      </p>
    </div>
  );
};
