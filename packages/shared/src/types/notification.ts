export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  icon: string | null;
  isRead: boolean;
  readAt: Date | null;
  metadata: Record<string, any>;
  createdAt: Date;
}
