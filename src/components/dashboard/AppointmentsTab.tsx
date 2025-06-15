
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: string;
  services: {
    name: string;
    duration: number;
    price: number;
  };
  appointment_date: string;
  status: string;
  notes?: string;
}

export const AppointmentsTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

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
        services: {
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

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error updating appointment:', error);
        toast.error('Failed to update appointment');
        return;
      }

      // Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: newStatus }
            : apt
        )
      );

      toast.success('Appointment updated successfully');
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
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
      case 'completed':
        return 'bg-blue-100 text-blue-700';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair font-semibold text-charcoal-800">
          Your Appointments
        </h2>
        <Button 
          className="luxury-button"
          onClick={() => navigate('/booking')}
        >
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
            <Button 
              className="luxury-button"
              onClick={() => navigate('/booking')}
            >
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
                      {appointment.services.name}
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
                    Duration: {appointment.services.duration} min
                  </div>
                  <div className="text-charcoal-600 font-semibold">
                    ${appointment.services.price}
                  </div>
                </div>
                {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/booking')}
                    >
                      Reschedule
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
