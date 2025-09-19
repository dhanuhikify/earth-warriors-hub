import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Calendar, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  content: string;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
}

const NGODashboard = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setProfile(data);
    }
  };

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } else {
      setNotifications(data || []);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('notification-files')
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('notification-files')
      .getPublicUrl(fileName);

    return { url: publicUrl.publicUrl, name: file.name };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let fileUrl = null;
      let fileName = null;

      if (selectedFile) {
        const fileData = await uploadFile(selectedFile);
        fileUrl = fileData.url;
        fileName = fileData.name;
      }

      const { error } = await supabase
        .from('notifications')
        .insert({
          ngo_id: user.id,
          title: newPost.title,
          content: newPost.content,
          file_url: fileUrl,
          file_name: fileName,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification posted successfully!",
      });

      setNewPost({ title: '', content: '' });
      setSelectedFile(null);
      fetchNotifications();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post notification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">NGO Dashboard</h1>
              <p className="text-muted-foreground">{profile?.full_name || 'Welcome'}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Post New Notification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Post New Notification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter notification title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Enter notification content"
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="file">Attach File (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                    {selectedFile && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Upload className="h-4 w-4" />
                        {selectedFile.name}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB)
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Posting...' : 'Post Notification'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Posted Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Your Posted Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No notifications posted yet
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4 space-y-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">{notification.content}</p>
                      {notification.file_url && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <a
                            href={notification.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {notification.file_name}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(notification.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NGODashboard;