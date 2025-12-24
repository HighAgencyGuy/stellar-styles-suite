import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Camera, 
  DollarSign, 
  Calendar, 
  Users, 
  LogOut, 
  Loader2,
  Sparkles
} from 'lucide-react';

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

        {/* Quick Stats - Coming Soon */}
        <div className="mt-12">
          <h3 className="font-display text-xl font-semibold mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">--</p>
              <p className="text-sm text-muted-foreground">Pending Appointments</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">--</p>
              <p className="text-sm text-muted-foreground">Gallery Styles</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">--</p>
              <p className="text-sm text-muted-foreground">Active Prices</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">--</p>
              <p className="text-sm text-muted-foreground">Customer Records</p>
            </Card>
          </div>
        </div>

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
