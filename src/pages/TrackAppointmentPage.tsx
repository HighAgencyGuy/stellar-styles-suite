import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  Loader2, 
  Calendar, 
  Clock, 
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  HourglassIcon
} from "lucide-react";

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: HourglassIcon, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending Confirmation' },
  confirmed: { icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Confirmed' },
  completed: { icon: CheckCircle, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Cancelled' },
};

export default function TrackAppointmentPage() {
  const [phone, setPhone] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('customer_phone', phone.trim())
        .order('preferred_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary/30">
        <div className="container-salon">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Track Your Appointment
            </h1>
            <div className="divider-gold mt-4 mb-6" />
            <p className="text-lg text-muted-foreground">
              Enter your phone number to view the status of your appointments.
            </p>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="section-padding">
        <div className="container-salon max-w-xl mx-auto">
          <Card className="card-elegant p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-elegant flex-1"
                  />
                  <Button type="submit" disabled={loading} className="btn-gold">
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Results */}
          {searched && (
            <div className="mt-8">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : appointments.length === 0 ? (
                <Card className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No appointments found for this phone number.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Make sure you entered the same phone number used when booking.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-semibold">
                    Your Appointments ({appointments.length})
                  </h2>
                  {appointments.map((apt) => {
                    const status = statusConfig[apt.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    const isPast = new Date(apt.preferred_date) < new Date();
                    
                    return (
                      <Card key={apt.id} className={`card-elegant ${isPast && apt.status !== 'completed' ? 'opacity-60' : ''}`}>
                        <CardContent className="p-4 md:p-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-display text-lg font-semibold">
                                  {apt.service_type}
                                </h3>
                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(apt.preferred_date).toLocaleDateString('en-NG', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {apt.preferred_time}
                                  </span>
                                </div>
                              </div>
                              <Badge className={status.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                            </div>

                            {apt.status === 'pending' && (
                              <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                                We'll confirm your appointment via WhatsApp shortly.
                              </p>
                            )}

                            {apt.status === 'confirmed' && !isPast && (
                              <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                Your appointment is confirmed! We look forward to seeing you.
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
