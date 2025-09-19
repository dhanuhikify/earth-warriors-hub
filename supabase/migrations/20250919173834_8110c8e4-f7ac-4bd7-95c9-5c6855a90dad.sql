-- Create notifications table for NGO posts
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ngo_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "NGOs can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'ngo'
  )
  AND auth.uid() = ngo_id
);

CREATE POLICY "NGOs can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = ngo_id);

CREATE POLICY "NGOs can delete their own notifications" 
ON public.notifications 
FOR DELETE 
USING (auth.uid() = ngo_id);

CREATE POLICY "NGOs can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = ngo_id);

CREATE POLICY "Students and teachers can view all notifications" 
ON public.notifications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('student', 'teacher')
  )
);

-- Create storage bucket for notification files
INSERT INTO storage.buckets (id, name, public) VALUES ('notification-files', 'notification-files', true);

-- Create storage policies for notification files
CREATE POLICY "NGOs can upload notification files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'notification-files' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'ngo'
  )
);

CREATE POLICY "NGOs can view their own notification files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'notification-files' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'ngo'
  )
);

CREATE POLICY "Students and teachers can view notification files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'notification-files');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();