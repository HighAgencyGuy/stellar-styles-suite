import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Loader2, 
  DollarSign,
  Edit,
  Save,
  X
} from 'lucide-react';

interface PriceItem {
  id: string;
  service_name: string;
  category: string;
  price: number;
  duration: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

const categories = ['Braids', 'Natural', 'Weave', 'Special Occasion', 'Treatments', 'Other'];

export default function AdminPricesPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchPrices();
    }
  }, [isAdmin]);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('price_list')
        .select('*')
        .order('category', { ascending: true })
        .order('service_name', { ascending: true });

      if (error) throw error;
      setPrices(data || []);
    } catch (err) {
      console.error('Error fetching prices:', err);
      toast({
        title: 'Error',
        description: 'Failed to load prices',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceName || !category || !price) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in service name, category, and price',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('price_list')
        .insert({
          service_name: serviceName,
          category,
          price: parseFloat(price),
          duration: duration || null,
          description: description || null,
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Price added successfully',
      });

      // Reset form
      setServiceName('');
      setCategory('');
      setPrice('');
      setDuration('');
      setDescription('');

      fetchPrices();
    } catch (err) {
      console.error('Add error:', err);
      toast({
        title: 'Failed to add',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (item: PriceItem) => {
    setSaving(true);

    try {
      const { error } = await supabase
        .from('price_list')
        .update({
          service_name: item.service_name,
          category: item.category,
          price: item.price,
          duration: item.duration,
          description: item.description,
        })
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: 'Updated',
        description: 'Price updated successfully',
      });

      setEditingId(null);
    } catch (err) {
      console.error('Update error:', err);
      toast({
        title: 'Update failed',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this price?')) return;

    try {
      const { error } = await supabase
        .from('price_list')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Deleted',
        description: 'Price removed',
      });

      setPrices(prices.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: 'Delete failed',
        variant: 'destructive',
      });
    }
  };

  const updatePriceInList = (id: string, field: keyof PriceItem, value: any) => {
    setPrices(prices.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
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

  // Group prices by category
  const pricesByCategory = prices.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PriceItem[]>);

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
          <h1 className="font-display text-2xl font-semibold mt-2">Price Management</h1>
        </div>
      </header>

      <main className="container-salon py-8">
        {/* Add Form */}
        <Card className="card-elegant mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Service Name *</Label>
                  <Input
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g., Box Braids"
                    className="input-elegant"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="input-elegant">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price ($) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="150.00"
                    className="input-elegant"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (optional)</Label>
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 3-4 hours"
                    className="input-elegant"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description"
                    className="input-elegant"
                  />
                </div>
              </div>

              <Button type="submit" className="btn-gold" disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add Price
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Price List */}
        <h2 className="font-display text-xl font-semibold mb-4">
          Current Prices ({prices.length} services)
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : prices.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No prices added yet. Add your first service above!
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(pricesByCategory).map(([cat, items]) => (
              <Card key={cat} className="card-elegant">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{cat}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div 
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-secondary/30 rounded-lg"
                      >
                        {editingId === item.id ? (
                          <>
                            <Input
                              value={item.service_name}
                              onChange={(e) => updatePriceInList(item.id, 'service_name', e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updatePriceInList(item.id, 'price', parseFloat(e.target.value))}
                              className="w-24"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleUpdate(item)} disabled={saving}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <p className="font-medium">{item.service_name}</p>
                              {item.duration && (
                                <p className="text-sm text-muted-foreground">{item.duration}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-primary">
                                ${item.price.toFixed(2)}
                              </span>
                              <Button size="icon" variant="ghost" onClick={() => setEditingId(item.id)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
