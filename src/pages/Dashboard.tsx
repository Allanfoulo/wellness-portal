
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { OnboardingModal } from '@/components/OnboardingModal';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AppointmentsTab } from '@/components/dashboard/AppointmentsTab';
import { ProfileTab } from '@/components/dashboard/ProfileTab';

const Dashboard = () => {
  const { profile, updateProfile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    birthday: profile?.birthday || '',
    medical_notes: profile?.medical_notes || '',
    emergency_contact: profile?.emergency_contact || '',
  });

  // Check if profile is incomplete
  const isProfileIncomplete = () => {
    return !profile?.full_name || !profile?.phone || !profile?.birthday;
  };

  useEffect(() => {
    // Show onboarding if profile is incomplete
    if (profile && isProfileIncomplete()) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const handleOnboardingComplete = async (data: typeof profileData) => {
    const { error } = await updateProfile(data);
    
    if (!error) {
      setShowOnboarding(false);
      toast.success('Profile completed successfully!');
    } else {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      <div className="container-luxury py-8">
        <DashboardHeader />

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="bg-white/50 border border-lavender-100">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-white">
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentsTab />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </div>

      <OnboardingModal 
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={() => setShowOnboarding(false)}
        initialData={profileData}
      />
    </div>
  );
};

export default Dashboard;
