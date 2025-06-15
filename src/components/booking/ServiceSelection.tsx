
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign } from 'lucide-react';
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

interface ServiceSelectionProps {
  onServiceSelect: (service: Service) => void;
  selectedServiceId?: string;
}

export const ServiceSelection = ({ onServiceSelect, selectedServiceId }: ServiceSelectionProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600"></div>
      </div>
    );
  }

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-semibold text-charcoal-800 mb-2">
          Select a Service
        </h2>
        <p className="text-charcoal-600">Choose from our available wellness services</p>
      </div>

      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-charcoal-700 capitalize">{category}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryServices.map((service) => (
              <Card 
                key={service.id}
                className={`luxury-card cursor-pointer transition-all hover:shadow-lg ${
                  selectedServiceId === service.id ? 'ring-2 ring-lavender-500' : ''
                }`}
                onClick={() => onServiceSelect(service)}
              >
                <CardHeader>
                  <CardTitle className="font-playfair text-lg text-charcoal-800">
                    {service.name}
                  </CardTitle>
                  <CardDescription className="text-charcoal-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-charcoal-600">
                      <Clock className="w-4 h-4 mr-1 text-lavender-600" />
                      {service.duration} min
                    </div>
                    <Badge variant="secondary" className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {service.price}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full mt-4 luxury-button"
                    variant={selectedServiceId === service.id ? "default" : "outline"}
                  >
                    {selectedServiceId === service.id ? 'Selected' : 'Select Service'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
