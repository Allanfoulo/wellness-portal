
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Phone, Calendar, Heart, AlertCircle } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (data: any) => void;
  onSkip: () => void;
  initialData: {
    full_name: string;
    phone: string;
    birthday: string;
    medical_notes: string;
    emergency_contact: string;
  };
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onSkip,
  initialData
}) => {
  const [formData, setFormData] = useState(initialData);
  const [step, setStep] = useState(1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.full_name.trim() !== '';
      case 2:
        return formData.phone.trim() !== '' && formData.birthday !== '';
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl">Complete Your Profile</DialogTitle>
          <DialogDescription>
            Help us provide you with the best service by completing your profile information.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mb-4">
          <div className="flex space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-3 h-3 rounded-full ${
                  stepNumber <= step ? 'bg-lavender-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <User className="w-5 h-5 mr-2 text-lavender-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="luxury-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Phone className="w-5 h-5 mr-2 text-lavender-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="luxury-input"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthday">Birthday *</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    className="luxury-input"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Heart className="w-5 h-5 mr-2 text-lavender-600" />
                  Additional Information
                </CardTitle>
                <CardDescription>
                  This information helps us provide better care (optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    className="luxury-input"
                    placeholder="Name and phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medical_notes">Medical Notes</Label>
                  <Textarea
                    id="medical_notes"
                    value={formData.medical_notes}
                    onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
                    className="luxury-input min-h-[80px]"
                    placeholder="Any allergies, medical conditions, or preferences..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between gap-2 pt-4">
            <div className="flex gap-2">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onSkip}>
                Skip for now
              </Button>
              
              {step < 3 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="luxury-button"
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" className="luxury-button">
                  Complete Profile
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
