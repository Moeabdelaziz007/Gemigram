export interface Notification {
  id: string;
  userId: string;
  read: boolean;
  [key: string]: any; // Allow other properties like title, message, createdAt since we don't know the full schema
}
