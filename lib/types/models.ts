export interface Notification {
  id: string;
  userId: string;
  read: boolean;
  message?: string;
  title?: string;
  createdAt?: any;
  type?: string;
}
