import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, Download } from 'lucide-react';

interface NotificationCardProps {
  notification: {
    id: string;
    title: string;
    content: string;
    file_url: string | null;
    file_name: string | null;
    created_at: string;
  };
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          {notification.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{notification.content}</p>
        
        {notification.file_url && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
            <Download className="h-4 w-4 text-primary" />
            <a
              href={notification.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {notification.file_name || 'Download Attachment'}
            </a>
          </div>
        )}
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Posted on {new Date(notification.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;