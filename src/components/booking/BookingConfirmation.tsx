
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, User } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface BookingConfirmationProps {
  service: Service;
  datetime: Date;
  onConfirm: (notes: string) => void;
  onBack: () => void;
  loading?: boolean;
}

export const BookingConfirmation = ({ 
  service, 
  datetime, 
  onConfirm, 
  onBack, 
  loading = false 
}: BookingConfirmationProps) => {
  const { profile } = useAuth();
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(notes);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-semibold text-charcoal-800 mb-2">
          Confirm Your Appointment
        </h2>
        <p className="text-charcoal-600">Review your appointment details before booking</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center">
              <User className="w-5 h-5 mr-2 text-lavender-600" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm text-charcoal-600">Name</Label>
              <p className="font-medium text-charcoal-800">{profile?.full_name}</p>
            </div>
            <div>
              <Label className="text-sm text-charcoal-600">Email</Label>
              <p className="font-medium text-charcoal-800">{profile?.email}</p>
            </div>
            <div>
              <Label className="text-sm text-charcoal-600">Phone</Label>
              <p className="font-medium text-charcoal-800">
                {profile?.phone || 'Not provided'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair">Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-charcoal-800 mb-2">{service.name}</h3>
              <p className="text-sm text-charcoal-600 mb-3">{service.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-charcoal-600">
                  <Calendar className="w-4 h-4 mr-2 text-lavender-600" />
                  {format(datetime, 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="flex items-center text-sm text-charcoal-600">
                  <Clock className="w-4 h-4 mr-2 text-lavender-600" />
                  {format(datetime, 'h:mm a')} ({service.duration} minutes)
                </div>
                <div className="flex items-center text-sm text-charcoal-600">
                  <DollarSign className="w-4 h-4 mr-2 text-lavender-600" />
                  ${service.price}
                </div>
              </div>
            </div>

            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Available
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-playfair">Additional Notes</CardTitle>
          <CardDescription>
            Any special requests or information we should know about?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any additional notes or special requests..."
            className="luxury-input min-h-[100px]"
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          className="flex-1 luxury-button"
        >
          {loading ? 'Booking...' : 'Confirm Appointment'}
        </Button>
      </div>
    </div>
  );
};
