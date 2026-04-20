import { useCallback, useEffect, useState } from 'react';
import { modelsService } from '../services/models.service';
import type { CreateSavedModelRequest, SavedModel } from '../types/api.types';

export function useSavedModels() {
  const [models, setModels] = useState<SavedModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await modelsService.list();
      setModels(data);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const create = useCallback(
    async (payload: CreateSavedModelRequest) => {
      const next = await modelsService.create(payload);
      setModels((prev) => [next, ...prev.filter((item) => item.id !== next.id)]);
      return next;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    await modelsService.remove(id);
    setModels((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return {
    models,
    loading,
    error,
    refetch: fetch,
    create,
    remove,
  };
}
