
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, Mail, Heart, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingModal } from '@/components/OnboardingModal';

interface Appointment {
  id: string;
  service: {
    name: string;
    duration: number;
    price: number;
  };
  appointment_date: string;
  status: string;
  notes?: string;
}

const Dashboard = () => {
  const { profile, updateProfile, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch appointments from database
  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          status,
          notes,
          services (
            name,
            duration,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
        return;
      }

      const formattedAppointments = data.map(appointment => ({
        id: appointment.id,
        service: {
          name: appointment.services.name,
          duration: appointment.services.duration,
          price: appointment.services.price,
        },
        appointment_date: appointment.appointment_date,
        status: appointment.status,
        notes: appointment.notes,
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  useEffect(() => {
    // Show onboarding if profile is incomplete
    if (profile && isProfileIncomplete()) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await updateProfile(profileData);
    
    if (!error) {
      setIsEditing(false);
      setShowOnboarding(false);
    } else {
      toast.error(error);
    }
  };

  const handleOnboardingComplete = async (data: typeof profileData) => {
    const { error } = await updateProfile(data);
    
    if (!error) {
      setShowOnboarding(false);
      toast.success('Profile completed successfully!');
    } else {
      toast.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      <div className="container-luxury py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-playfair font-bold text-charcoal-800 mb-2">
            Welcome back, {profile?.full_name}
          </h1>
          <p className="text-charcoal-600">
            Manage your appointments and personal information
          </p>
        </div>

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

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-playfair font-semibold text-charcoal-800">
                Your Appointments
              </h2>
              <Button className="luxury-button">
                <Calendar className="w-4 h-4 mr-2" />
                Book New Appointment
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600"></div>
              </div>
            ) : appointments.length === 0 ? (
              <Card className="luxury-card">
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 text-charcoal-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-charcoal-800 mb-2">No appointments yet</h3>
                  <p className="text-charcoal-600 mb-4">Book your first appointment to get started</p>
                  <Button className="luxury-button">
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {appointments.map((appointment, index) => (
                  <Card 
                    key={appointment.id} 
                    className={`luxury-card animate-slide-in-left animation-delay-${index * 200}`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="font-playfair text-xl text-charcoal-800">
                            {appointment.service.name}
                          </CardTitle>
                          <CardDescription className="text-charcoal-600">
                            {appointment.notes && `Notes: ${appointment.notes}`}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-charcoal-600">
                          <Calendar className="w-4 h-4 mr-2 text-lavender-600" />
                          {formatDate(appointment.appointment_date)}
                        </div>
                        <div className="flex items-center text-charcoal-600">
                          <Clock className="w-4 h-4 mr-2 text-lavender-600" />
                          {formatTime(appointment.appointment_date)}
                        </div>
                        <div className="text-charcoal-600">
                          Duration: {appointment.service.duration} min
                        </div>
                        <div className="text-charcoal-600 font-semibold">
                          ${appointment.service.price}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-playfair font-semibold text-charcoal-800">
                Profile Information
              </h2>
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="luxury-button"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="font-playfair flex items-center">
                  <User className="w-5 h-5 mr-2 text-lavender-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Keep your information up to date for the best service experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={profileData.full_name}
                          onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                          className="luxury-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="luxury-input"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthday">Birthday</Label>
                      <Input
                        id="birthday"
                        type="date"
                        value={profileData.birthday}
                        onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                        className="luxury-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact">Emergency Contact</Label>
                      <Input
                        id="emergency_contact"
                        value={profileData.emergency_contact}
                        onChange={(e) => setProfileData({ ...profileData, emergency_contact: e.target.value })}
                        className="luxury-input"
                        placeholder="Name and phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medical_notes">Medical Notes</Label>
                      <Textarea
                        id="medical_notes"
                        value={profileData.medical_notes}
                        onChange={(e) => setProfileData({ ...profileData, medical_notes: e.target.value })}
                        className="luxury-input min-h-[100px]"
                        placeholder="Any allergies, medical conditions, or preferences..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="submit" className="luxury-button">
                        Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-lavender-600" />
                        <div>
                          <div className="text-sm text-charcoal-600">Full Name</div>
                          <div className="font-medium text-charcoal-800">
                            {profile?.full_name || 'Not provided'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-lavender-600" />
                        <div>
                          <div className="text-sm text-charcoal-600">Email</div>
                          <div className="font-medium text-charcoal-800">
                            {profile?.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-lavender-600" />
                        <div>
                          <div className="text-sm text-charcoal-600">Phone</div>
                          <div className="font-medium text-charcoal-800">
                            {profile?.phone || 'Not provided'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-lavender-600" />
                        <div>
                          <div className="text-sm text-charcoal-600">Birthday</div>
                          <div className="font-medium text-charcoal-800">
                            {profile?.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Not provided'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 md:col-span-2">
                        <AlertCircle className="w-5 h-5 text-lavender-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm text-charcoal-600">Emergency Contact</div>
                          <div className="font-medium text-charcoal-800">
                            {profile?.emergency_contact || 'Not provided'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 md:col-span-2">
                        <Heart className="w-5 h-5 text-lavender-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm text-charcoal-600">Medical Notes</div>
                          <div className="font-medium text-charcoal-800">
                            {profile?.medical_notes || 'No medical notes provided'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
