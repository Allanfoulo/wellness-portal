
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AppointmentWithDetails {
  id: string;
  appointment_date: string;
  status: string;
  notes: string | null;
  services: {
    name: string;
    duration: number;
    price: number;
  };
  profiles: {
    full_name: string;
    email: string;
    phone: string | null;
  };
}

export const AdminAppointmentManagement = () => {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
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
          ),
          profiles (
            full_name,
            email,
            phone
          )
        `)
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error updating appointment:', error);
        toast.error('Failed to update appointment status');
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

      toast.success('Appointment status updated successfully');
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment status');
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

  const filteredAppointments = appointments.filter(apt => 
    statusFilter === 'all' || apt.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-playfair font-semibold text-charcoal-800">
          Appointment Management
        </h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Appointments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAppointments.length === 0 ? (
        <Card className="luxury-card">
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 text-charcoal-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-charcoal-800 mb-2">No appointments found</h3>
            <p className="text-charcoal-600">
              {statusFilter === 'all' ? 'No appointments have been scheduled yet' : `No ${statusFilter} appointments found`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment, index) => (
            <Card 
              key={appointment.id} 
              className={`luxury-card animate-slide-in-left animation-delay-${index * 100}`}
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
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-charcoal-800 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2 text-lavender-600" />
                      Client Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-charcoal-600">Name: </span>
                        <span className="font-medium text-charcoal-800">
                          {appointment.profiles.full_name}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-2 text-charcoal-600" />
                        <span className="text-charcoal-800">{appointment.profiles.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-2 text-charcoal-600" />
                        <span className="text-charcoal-800">
                          {appointment.profiles.phone || 'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-charcoal-800 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-lavender-600" />
                      Appointment Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2 text-charcoal-600" />
                        <span className="text-charcoal-800">
                          {format(new Date(appointment.appointment_date), 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-2 text-charcoal-600" />
                        <span className="text-charcoal-800">
                          {format(new Date(appointment.appointment_date), 'h:mm a')} 
                          ({appointment.services.duration} min)
                        </span>
                      </div>
                      <div>
                        <span className="text-charcoal-600">Price: </span>
                        <span className="font-semibold text-charcoal-800">${appointment.services.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  {appointment.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
