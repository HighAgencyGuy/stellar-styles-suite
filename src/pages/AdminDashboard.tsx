import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Camera, 
  DollarSign, 
  Calendar, 
  Users, 
  LogOut, 
  Loader2,
  Sparkles,
  Star
} from 'lucide-react';

interface Stats {
  pendingAppointments: number;
  galleryStyles: number;
  activePrices: number;
  customerRecords: number;
}

interface GalleryStyle {
  id: string;
  title: string;
  category: string;
  image_url: string;
  is_featured: boolean;
}

interface PriceItem {
  id: string;
  service_name: string;
  category: string;
  price: number;
  duration: string | null;
}

const adminActions = [
  {
    title: 'Upload Styles',
    description: 'Add new hairstyle photos to your gallery',
    icon: Camera,
    href: '/admin/gallery',
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Manage Prices',
    description: 'Update your service prices',
    icon: DollarSign,
    href: '/admin/prices',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    title: 'Appointments',
    description: 'View and manage booking requests',
    icon: Calendar,
    href: '/admin/appointments',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'Customer Records',
    description: 'Track customer styles and notes',
    icon: Users,
    href: '/admin/customers',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
];

export default function AdminDashboard() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    pendingAppointments: 0,
    galleryStyles: 0,
    activePrices: 0,
    customerRecords: 0,
  });
  const [recentStyles, setRecentStyles] = useState<GalleryStyle[]>([]);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats in parallel
      const [appointmentsRes, stylesRes, pricesRes, recordsRes] = await Promise.all([
        supabase.from('appointments').select('id, status'),
        supabase.from('gallery_styles').select('*').order('created_at', { ascending: false }),
        supabase.from('price_list').select('*').eq('is_active', true).order('category'),
        supabase.from('customer_records').select('id'),
      ]);

      const pendingAppointments = (appointmentsRes.data || []).filter(a => a.status === 'pending').length;
      const galleryData = stylesRes.data || [];
      const pricesData = pricesRes.data || [];
      const customerRecords = (recordsRes.data || []).length;

      setStats({
        pendingAppointments,
        galleryStyles: galleryData.length,
        activePrices: pricesData.length,
        customerRecords,
      });

      // Get recent styles (up to 6)
      setRecentStyles(galleryData.slice(0, 6));
      setPrices(pricesData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  // Group prices by category
  const pricesByCategory = prices.reduce((acc, price) => {
    if (!acc[price.category]) {
      acc[price.category] = [];
    }
    acc[price.category].push(price);
    return acc;
  }, {} as Record<string, PriceItem[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container-salon py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
              <h1 className="font-display text-xl font-semibold">Stellar Styles</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-salon py-8">
        <div className="mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">
            Welcome back!
          </h2>
          <p className="text-muted-foreground">
            What would you like to do today?
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {adminActions.map((action) => (
            <Card 
              key={action.title}
              className="card-elegant cursor-pointer hover:scale-[1.02] transition-transform duration-200"
              onClick={() => navigate(action.href)}
            >
              <CardContent className="p-6 md:p-8">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-semibold mb-2">
                  {action.title}
                </h3>
                <p className="text-muted-foreground">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h3 className="font-display text-xl font-semibold mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {loadingData ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : stats.pendingAppointments}
              </p>
              <p className="text-sm text-muted-foreground">Pending Appointments</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {loadingData ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : stats.galleryStyles}
              </p>
              <p className="text-sm text-muted-foreground">Gallery Styles</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {loadingData ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : stats.activePrices}
              </p>
              <p className="text-sm text-muted-foreground">Active Prices</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {loadingData ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : stats.customerRecords}
              </p>
              <p className="text-sm text-muted-foreground">Customer Records</p>
            </Card>
          </div>
        </div>

        {/* Recent Gallery Styles */}
        {recentStyles.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Recent Gallery Styles</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/gallery')}>
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentStyles.map((style) => (
                <Card key={style.id} className="overflow-hidden card-elegant">
                  <div className="aspect-square relative">
                    <img
                      src={style.image_url}
                      alt={style.title}
                      className="w-full h-full object-cover"
                    />
                    {style.is_featured && (
                      <div className="absolute top-2 left-2">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-2">
                    <p className="text-sm font-medium truncate">{style.title}</p>
                    <p className="text-xs text-muted-foreground">{style.category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Current Prices */}
        {Object.keys(pricesByCategory).length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Current Prices</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/prices')}>
                Edit Prices
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(pricesByCategory).map(([category, items]) => (
                <Card key={category} className="card-elegant">
                  <CardContent className="p-4">
                    <h4 className="font-display font-semibold text-primary mb-3">{category}</h4>
                    <div className="space-y-2">
                      {items.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{item.service_name}</span>
                          <span className="font-medium">₦{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                      {items.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">
                          +{items.length - 5} more services
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Back to Website */}
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            ← View public website
          </a>
        </div>
      </main>
    </div>
  );
}
