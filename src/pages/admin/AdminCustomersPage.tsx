import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Plus, 
  Loader2, 
  Users,
  Search,
  Calendar,
  Trash2,
  Upload,
  Image,
  X
} from 'lucide-react';

interface CustomerRecord {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  style_done: string;
  notes: string | null;
  photos: string[] | null;
  appointment_date: string;
  created_at: string;
  updated_at: string;
}

export default function AdminCustomersPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [records, setRecords] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [styleDone, setStyleDone] = useState('');
  const [notes, setNotes] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchRecords();
    }
  }, [isAdmin]);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_records')
        .select('*')
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching records:', err);
      toast({
        title: 'Error',
        description: 'Failed to load customer records',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedPhotos(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPhotoPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (selectedPhotos.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const file of selectedPhotos) {
      const fileExt = file.name.split('.').pop();
      const fileName = `customer-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('styles')
        .upload(`customers/${fileName}`, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('styles')
        .getPublicUrl(`customers/${fileName}`);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !styleDone || !appointmentDate) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in customer name, style, and date',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    setUploadingPhotos(selectedPhotos.length > 0);

    try {
      // Upload photos first
      const photoUrls = await uploadPhotos();

      const { error } = await supabase
        .from('customer_records')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone || null,
          style_done: styleDone,
          notes: notes || null,
          appointment_date: appointmentDate,
          photos: photoUrls.length > 0 ? photoUrls : null,
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Customer record added',
      });

      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setStyleDone('');
      setNotes('');
      setAppointmentDate('');
      setSelectedPhotos([]);
      photoPreviews.forEach(url => URL.revokeObjectURL(url));
      setPhotoPreviews([]);
      setShowForm(false);

      fetchRecords();
    } catch (err) {
      console.error('Add error:', err);
      toast({
        title: 'Failed to add',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
      setUploadingPhotos(false);
    }
  };

  const handleDelete = async (id: string, photos: string[] | null) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      // Delete photos from storage
      if (photos && photos.length > 0) {
        for (const photoUrl of photos) {
          const fileName = photoUrl.split('/').pop();
          if (fileName) {
            await supabase.storage.from('styles').remove([`customers/${fileName}`]);
          }
        }
      }

      const { error } = await supabase
        .from('customer_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Deleted',
        description: 'Customer record removed',
      });

      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: 'Delete failed',
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

  const filteredRecords = records.filter(r => 
    r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.style_done.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.customer_phone && r.customer_phone.includes(searchTerm))
  );

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
          <h1 className="font-display text-2xl font-semibold mt-2">Customer Records</h1>
        </div>
      </header>

      <main className="container-salon py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-elegant"
            />
          </div>
          <Button 
            className="btn-gold"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        </div>

        {/* Add Form */}
        {showForm && (
          <Card className="card-elegant mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                New Customer Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name *</Label>
                    <Input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full name"
                      className="input-elegant"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                      className="input-elegant"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Style Done *</Label>
                    <Input
                      value={styleDone}
                      onChange={(e) => setStyleDone(e.target.value)}
                      placeholder="e.g., Box braids, medium length"
                      className="input-elegant"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Appointment Date *</Label>
                    <Input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="input-elegant"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Hair type, preferences, special requests..."
                    className="input-elegant min-h-[100px]"
                  />
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-2">
                  <Label>Photos</Label>
                  <div className="flex flex-wrap gap-4">
                    {/* Photo Previews */}
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative w-24 h-24">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Add Photo Button */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <Image className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="btn-gold" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {uploadingPhotos ? 'Uploading Photos...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Save Record
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedPhotos([]);
                      photoPreviews.forEach(url => URL.revokeObjectURL(url));
                      setPhotoPreviews([]);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Records List */}
        <h2 className="font-display text-xl font-semibold mb-4">
          Records ({filteredRecords.length})
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            {searchTerm 
              ? 'No records match your search.'
              : 'No customer records yet. Add your first record above!'}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="card-elegant">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Photos */}
                    {record.photos && record.photos.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {record.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`${record.customer_name} - Style ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg font-semibold">
                            {record.customer_name}
                          </h3>
                          {record.customer_phone && (
                            <p className="text-sm text-muted-foreground">
                              {record.customer_phone}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(record.appointment_date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="font-medium text-primary">{record.style_done}</p>
                        {record.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleDelete(record.id, record.photos)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
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
