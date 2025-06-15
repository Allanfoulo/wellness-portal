
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceSelection } from './ServiceSelection';
import { DateTimeSelection } from './DateTimeSelection';
import { BookingConfirmation } from './BookingConfirmation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

type BookingStep = 'service' | 'datetime' | 'confirmation';

export const BookingFlow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep('datetime');
  };

  const handleDateTimeSelect = (datetime: Date) => {
    setSelectedDateTime(datetime);
    setCurrentStep('confirmation');
  };

  const handleBackToService = () => {
    setCurrentStep('service');
    setSelectedService(null);
    setSelectedDateTime(null);
  };

  const handleBackToDateTime = () => {
    setCurrentStep('datetime');
    setSelectedDateTime(null);
  };

  const handleConfirmBooking = async (notes: string) => {
    if (!user || !selectedService || !selectedDateTime) {
      toast.error('Missing booking information');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          service_id: selectedService.id,
          appointment_date: selectedDateTime.toISOString(),
          status: 'pending',
          notes: notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        toast.error('Failed to create appointment. Please try again.');
        return;
      }

      toast.success('Appointment booked successfully!');
      navigate('/dashboard?tab=appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'service':
        return (
          <ServiceSelection
            onServiceSelect={handleServiceSelect}
            selectedServiceId={selectedService?.id}
          />
        );
      case 'datetime':
        return selectedService ? (
          <DateTimeSelection
            service={selectedService}
            onDateTimeSelect={handleDateTimeSelect}
            selectedDateTime={selectedDateTime || undefined}
          />
        ) : null;
      case 'confirmation':
        return selectedService && selectedDateTime ? (
          <BookingConfirmation
            service={selectedService}
            datetime={selectedDateTime}
            onConfirm={handleConfirmBooking}
            onBack={handleBackToDateTime}
            loading={loading}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Navigation */}
      <div className="flex items-center justify-center space-x-4 pb-6">
        {(['service', 'datetime', 'confirmation'] as BookingStep[]).map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === step
                  ? 'bg-lavender-600 text-white'
                  : index < ['service', 'datetime', 'confirmation'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            {index < 2 && (
              <div
                className={`w-16 h-0.5 ${
                  index < ['service', 'datetime', 'confirmation'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Back Button for non-first steps */}
      {currentStep !== 'service' && (
        <div className="mb-6">
          <button
            onClick={currentStep === 'datetime' ? handleBackToService : handleBackToDateTime}
            className="text-lavender-600 hover:text-lavender-700 font-medium"
            disabled={loading}
          >
            ← Back to {currentStep === 'datetime' ? 'Services' : 'Date & Time'}
          </button>
        </div>
      )}

      {renderCurrentStep()}
    </div>
  );
};
