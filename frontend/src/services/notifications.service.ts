import client from './api.client';
import type { NotificationItem } from '../types/api.types';

export const notificationsService = {
  list(): Promise<NotificationItem[]> {
    return client.get<NotificationItem[]>('/notifications').then((r) => r.data);
  },

  markRead(id: string): Promise<NotificationItem> {
    return client.patch<NotificationItem>(`/notifications/${id}/read`).then((r) => r.data);
  },
};
