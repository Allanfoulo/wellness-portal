
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface AppointmentAnalytics {
  date: string;
  appointments: number;
  revenue: number;
}

interface ServiceAnalytics {
  name: string;
  count: number;
  revenue: number;
}

interface StatusAnalytics {
  status: string;
  count: number;
  percentage: number;
}

export const AdminAnalytics = () => {
  const [appointmentTrends, setAppointmentTrends] = useState<AppointmentAnalytics[]>([]);
  const [serviceStats, setServiceStats] = useState<ServiceAnalytics[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      await Promise.all([
        fetchAppointmentTrends(),
        fetchServiceStats(),
        fetchStatusBreakdown()
      ]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentTrends = async () => {
    const startDate = startOfDay(subDays(new Date(), 30));
    const endDate = endOfDay(new Date());

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        appointment_date,
        services (price)
      `)
      .gte('appointment_date', startDate.toISOString())
      .lte('appointment_date', endDate.toISOString())
      .eq('status', 'completed');

    if (error) {
      console.error('Error fetching appointment trends:', error);
      return;
    }

    // Group by date
    const trendsMap = new Map<string, { appointments: number; revenue: number }>();
    
    data?.forEach(appointment => {
      const date = format(new Date(appointment.appointment_date), 'MMM dd');
      const current = trendsMap.get(date) || { appointments: 0, revenue: 0 };
      current.appointments += 1;
      current.revenue += Number(appointment.services?.price || 0);
      trendsMap.set(date, current);
    });

    const trends = Array.from(trendsMap.entries()).map(([date, stats]) => ({
      date,
      ...stats
    }));

    setAppointmentTrends(trends);
  };

  const fetchServiceStats = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        services (
          name,
          price
        )
      `)
      .eq('status', 'completed');

    if (error) {
      console.error('Error fetching service stats:', error);
      return;
    }

    const serviceMap = new Map<string, { count: number; revenue: number }>();
    
    data?.forEach(appointment => {
      const serviceName = appointment.services?.name || 'Unknown';
      const price = Number(appointment.services?.price || 0);
      const current = serviceMap.get(serviceName) || { count: 0, revenue: 0 };
      current.count += 1;
      current.revenue += price;
      serviceMap.set(serviceName, current);
    });

    const stats = Array.from(serviceMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);

    setServiceStats(stats);
  };

  const fetchStatusBreakdown = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('status');

    if (error) {
      console.error('Error fetching status breakdown:', error);
      return;
    }

    const statusMap = new Map<string, number>();
    data?.forEach(appointment => {
      const status = appointment.status;
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    const total = data?.length || 0;
    const breakdown = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / total) * 100)
    }));

    setStatusBreakdown(breakdown);
  };

  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lavender-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-semibold text-charcoal-800 mb-2">
          Analytics & Reports
        </h2>
        <p className="text-charcoal-600">
          Insights into your clinic's performance over the last 30 days
        </p>
      </div>

      {/* Appointment Trends */}
      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-playfair flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-lavender-600" />
            Appointment & Revenue Trends
          </CardTitle>
          <CardDescription>
            Daily appointment count and revenue over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentTrends.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={appointmentTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="appointments"
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="revenue"
                    orientation="right"
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="appointments"
                    dataKey="appointments" 
                    fill="#8B5CF6" 
                    name="Appointments"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="revenue"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Revenue ($)"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-charcoal-600">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-lavender-400" />
                <p>No completed appointments found for trend analysis</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Popular Services */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-lavender-600" />
              Popular Services
            </CardTitle>
            <CardDescription>
              Most booked services by appointment count
            </CardDescription>
          </CardHeader>
          <CardContent>
            {serviceStats.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceStats.slice(0, 5)} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      type="number"
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis 
                      type="category"
                      dataKey="name" 
                      stroke="#6B7280"
                      fontSize={12}
                      width={120}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#8B5CF6"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-charcoal-600">
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-lavender-400" />
                  <p>No service data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointment Status Breakdown */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-playfair flex items-center">
              <Users className="w-5 h-5 mr-2 text-lavender-600" />
              Appointment Status
            </CardTitle>
            <CardDescription>
              Distribution of appointment statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusBreakdown.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percentage }) => `${status} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-charcoal-600">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-lavender-400" />
                  <p>No appointment data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Revenue Table */}
      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-playfair flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-lavender-600" />
            Service Revenue Breakdown
          </CardTitle>
          <CardDescription>
            Revenue generated by each service
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serviceStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-lavender-100">
                    <th className="text-left py-3 px-4 font-semibold text-charcoal-800">Service</th>
                    <th className="text-right py-3 px-4 font-semibold text-charcoal-800">Bookings</th>
                    <th className="text-right py-3 px-4 font-semibold text-charcoal-800">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceStats.map((service, index) => (
                    <tr key={service.name} className="border-b border-lavender-50 hover:bg-lavender-25">
                      <td className="py-3 px-4 text-charcoal-800">{service.name}</td>
                      <td className="py-3 px-4 text-right text-charcoal-600">{service.count}</td>
                      <td className="py-3 px-4 text-right font-semibold text-charcoal-800">
                        ${service.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-charcoal-600">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-lavender-400" />
              <p>No revenue data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
