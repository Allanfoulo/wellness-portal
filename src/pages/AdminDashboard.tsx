import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Star,
  Settings,
  BarChart3
} from 'lucide-react';
import { AdminAppointmentManagement } from '@/components/admin/AdminAppointmentManagement';

const AdminDashboard = () => {
  const { profile } = useAuth();
  
  // Demo data for admin dashboard
  const stats = {
    totalRevenue: 15420,
    totalAppointments: 87,
    activeClients: 156,
    avgRating: 4.8,
  };

  const practitioners = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      specialty: 'Therapeutic Massage',
      rating: 4.9,
      appointments: 23,
      revenue: 2760,
    },
    {
      id: 2,
      name: 'Dr. Michael Torres',
      specialty: 'Acupuncture',
      rating: 4.8,
      appointments: 18,
      revenue: 1620,
    },
    {
      id: 3,
      name: 'Lisa Rodriguez',
      specialty: 'Meditation & Mindfulness',
      rating: 4.7,
      appointments: 15,
      revenue: 900,
    },
  ];

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      <div className="container-luxury py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-playfair font-bold text-charcoal-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-charcoal-600">
            Welcome back, {profile?.full_name}. Here's your clinic overview.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="luxury-card animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-charcoal-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-charcoal-800">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card animate-scale-in animation-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-charcoal-600">Appointments</p>
                  <p className="text-2xl font-bold text-charcoal-800">{stats.totalAppointments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card animate-scale-in animation-delay-400">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-charcoal-600">Active Clients</p>
                  <p className="text-2xl font-bold text-charcoal-800">{stats.activeClients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card animate-scale-in animation-delay-600">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-charcoal-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-charcoal-800">{stats.avgRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="bg-white/50 border border-lavender-100">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-white">
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="practitioners" className="data-[state=active]:bg-white">
              <Users className="w-4 h-4 mr-2" />
              Practitioners
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AdminAppointmentManagement />
          </TabsContent>

          <TabsContent value="practitioners" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-playfair font-semibold text-charcoal-800">
                Practitioner Performance
              </h2>
              <Button className="luxury-button">
                Add Practitioner
              </Button>
            </div>

            <div className="grid gap-6">
              {practitioners.map((practitioner, index) => (
                <Card 
                  key={practitioner.id} 
                  className={`luxury-card animate-scale-in animation-delay-${index * 200}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-playfair text-xl text-charcoal-800">
                          {practitioner.name}
                        </CardTitle>
                        <CardDescription className="text-charcoal-600">
                          {practitioner.specialty}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium text-charcoal-800">{practitioner.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-lavender-600">{practitioner.appointments}</div>
                        <div className="text-sm text-charcoal-600">Appointments</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-lavender-600">${practitioner.revenue.toLocaleString()}</div>
                        <div className="text-sm text-charcoal-600">Revenue</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-lavender-600">{practitioner.rating}</div>
                        <div className="text-sm text-charcoal-600">Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-playfair font-semibold text-charcoal-800">
              Analytics & Reports
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="font-playfair flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-lavender-600" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-charcoal-600">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-lavender-400" />
                      <p>Revenue analytics chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="font-playfair flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-lavender-600" />
                    Appointment Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-charcoal-600">
                    <div className="text-center">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-lavender-400" />
                      <p>Appointment analytics chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-playfair font-semibold text-charcoal-800">
              Clinic Settings
            </h2>

            <div className="grid gap-6">
              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="font-playfair">Operating Hours</CardTitle>
                  <CardDescription>
                    Set your clinic's operating hours for each day of the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center justify-between py-2">
                        <span className="font-medium text-charcoal-800">{day}</span>
                        <span className="text-charcoal-600">
                          {['Saturday', 'Sunday'].includes(day) ? '9:00 AM - 6:00 PM' : '8:00 AM - 8:00 PM'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="luxury-card">
                <CardHeader>
                  <CardTitle className="font-playfair">Service Management</CardTitle>
                  <CardDescription>
                    Manage your clinic's services, pricing, and availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="luxury-button">
                    Manage Services
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
