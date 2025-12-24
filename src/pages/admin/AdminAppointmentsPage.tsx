import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AppointmentCalendar } from '@/components/admin/AppointmentCalendar';
import { 
  ArrowLeft, 
  Loader2, 
  Calendar,
  Phone,
  Mail,
  Clock,
  Check,
  X,
  MessageSquare,
  List,
  CalendarDays
} from 'lucide-react';

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminAppointmentsPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchAppointments();
    }
  }, [isAdmin]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('preferred_date', { ascending: true })
        .order('preferred_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      toast({
        title: 'Error',
        description: 'Failed to load appointments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status } : a
      ));

      if (selectedAppointment?.id === id) {
        setSelectedAppointment({ ...selectedAppointment, status });
      }

      toast({
        title: 'Status updated',
        description: `Appointment marked as ${status}`,
      });
    } catch (err) {
      console.error('Update error:', err);
      toast({
        title: 'Update failed',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container-salon py-4">
          <a 
            href="/admin" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </a>
          <div className="flex items-center justify-between mt-2">
            <h1 className="font-display text-2xl font-semibold">Appointments</h1>
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <Badge className="bg-yellow-500">
                  {pendingCount} pending
                </Badge>
              )}
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'calendar')}>
                <TabsList>
                  <TabsTrigger value="list" className="gap-1">
                    <List className="w-4 h-4" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="gap-1">
                    <CalendarDays className="w-4 h-4" />
                    Calendar
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      <main className="container-salon py-8">
        {viewMode === 'list' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className={filter === status ? 'btn-gold' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>

            {/* Appointments List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredAppointments.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                {filter === 'all' 
                  ? 'No appointments yet. They will appear here when customers book.'
                  : `No ${filter} appointments.`}
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => (
                  <Card key={apt.id} className="card-elegant">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Main Info */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-display text-lg font-semibold">
                                {apt.customer_name}
                              </h3>
                              <p className="text-primary font-medium">{apt.service_type}</p>
                            </div>
                            <Badge className={statusColors[apt.status]}>
                              {apt.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(apt.preferred_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {apt.preferred_time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {apt.customer_phone}
                            </span>
                            {apt.customer_email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {apt.customer_email}
                              </span>
                            )}
                          </div>

                          {apt.notes && (
                            <div className="flex items-start gap-2 p-3 bg-secondary/30 rounded-lg">
                              <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
                              <p className="text-sm">{apt.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {apt.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateStatus(apt.id, 'confirmed')}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => updateStatus(apt.id, 'cancelled')}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => updateStatus(apt.id, 'completed')}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {viewMode === 'calendar' && (
          <AppointmentCalendar 
            appointments={appointments} 
            onSelectAppointment={setSelectedAppointment}
          />
        )}
      </main>

      {/* Appointment Detail Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent>
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  {selectedAppointment.customer_name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-primary font-medium">{selectedAppointment.service_type}</p>
                  <Badge className={statusColors[selectedAppointment.status]}>
                    {selectedAppointment.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(selectedAppointment.preferred_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedAppointment.preferred_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedAppointment.customer_phone}</span>
                  </div>
                  {selectedAppointment.customer_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedAppointment.customer_email}</span>
                    </div>
                  )}
                </div>

                {selectedAppointment.notes && (
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-sm">{selectedAppointment.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {selectedAppointment.status === 'pending' && (
                    <>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatus(selectedAppointment.id, 'confirmed')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => updateStatus(selectedAppointment.id, 'cancelled')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {selectedAppointment.status === 'confirmed' && (
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => updateStatus(selectedAppointment.id, 'completed')}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
