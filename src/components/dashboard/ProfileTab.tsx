import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, Calendar, Heart, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ProfileTab = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    birthday: profile?.birthday || '',
    medical_notes: profile?.medical_notes || '',
    emergency_contact: profile?.emergency_contact || '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Show loading toast
    toast({
      title: "Saving changes...",
      description: "Your profile is being updated.",
    });

    try {
      const { error } = await updateProfile(profileData);
      
      if (!error) {
        setIsEditing(false);
        toast({
          title: "Profile updated successfully!",
          description: "Your changes have been saved.",
        });
      } else {
        toast({
          title: "Error updating profile",
          description: error,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error updating profile",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update local state when profile changes
  useState(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        birthday: profile.birthday || '',
        medical_notes: profile.medical_notes || '',
        emergency_contact: profile.emergency_contact || '',
      });
    }
  });

  return (
    <div className="space-y-6">
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
                <Button 
                  type="submit" 
                  className="luxury-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
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
    </div>
  );
};
