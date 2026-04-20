import { useCallback, useEffect, useState } from 'react';
import { notificationsService } from '../services/notifications.service';
import type { NotificationItem } from '../types/api.types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationsService.list();
      setNotifications(data);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const markRead = useCallback(async (id: string) => {
    const updated = await notificationsService.markRead(id);
    setNotifications((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  return {
    notifications,
    loading,
    error,
    refetch: fetch,
    markRead,
  };
}
