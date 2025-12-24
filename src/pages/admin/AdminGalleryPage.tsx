import { useState, useEffect, useRef } from 'react';
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
  Upload, 
  Trash2, 
  Loader2, 
  ImagePlus,
  Star
} from 'lucide-react';

interface GalleryStyle {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string | null;
  is_featured: boolean;
  created_at: string;
}

const categories = ['Braids', 'Natural', 'Weave', 'Special Occasion', 'Other'];

export default function AdminGalleryPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [styles, setStyles] = useState<GalleryStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchStyles();
    }
  }, [isAdmin]);

  const fetchStyles = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_styles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStyles(data || []);
    } catch (err) {
      console.error('Error fetching styles:', err);
      toast({
        title: 'Error',
        description: 'Failed to load gallery styles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !title || !category) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields and select an image',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Upload image to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('styles')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('styles')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('gallery_styles')
        .insert({
          title,
          category,
          image_url: publicUrl,
          description: description || null,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Success!',
        description: 'Style uploaded successfully',
      });

      // Reset form
      setTitle('');
      setCategory('');
      setDescription('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh list
      fetchStyles();
    } catch (err) {
      console.error('Upload error:', err);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload style. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this style?')) return;

    try {
      // Extract filename from URL
      const fileName = imageUrl.split('/').pop();
      
      // Delete from storage
      if (fileName) {
        await supabase.storage.from('styles').remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('gallery_styles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Deleted',
        description: 'Style removed from gallery',
      });

      setStyles(styles.filter(s => s.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete style',
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('gallery_styles')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setStyles(styles.map(s => 
        s.id === id ? { ...s, is_featured: !currentStatus } : s
      ));

      toast({
        title: currentStatus ? 'Removed from featured' : 'Added to featured',
      });
    } catch (err) {
      console.error('Update error:', err);
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
          <h1 className="font-display text-2xl font-semibold mt-2">Gallery Management</h1>
        </div>
      </header>

      <main className="container-salon py-8">
        {/* Upload Form */}
        <Card className="card-elegant mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImagePlus className="w-5 h-5" />
              Upload New Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Box Braids Medium"
                    className="input-elegant"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the style"
                  className="input-elegant"
                />
              </div>

              <div className="space-y-2">
                <Label>Image *</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div 
                    className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex-1 flex items-center">
                    <Button 
                      type="submit" 
                      className="btn-gold w-full sm:w-auto"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Style
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Gallery Grid */}
        <h2 className="font-display text-xl font-semibold mb-4">
          Your Gallery ({styles.length} styles)
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : styles.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No styles uploaded yet. Upload your first style above!
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {styles.map((style) => (
              <Card key={style.id} className="overflow-hidden card-elegant group">
                <div className="aspect-square relative">
                  <img 
                    src={style.image_url} 
                    alt={style.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => toggleFeatured(style.id, style.is_featured)}
                      title={style.is_featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <Star className={`w-4 h-4 ${style.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(style.id, style.image_url)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {style.is_featured && (
                    <div className="absolute top-2 left-2">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-medium truncate">{style.title}</p>
                  <p className="text-sm text-muted-foreground">{style.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
