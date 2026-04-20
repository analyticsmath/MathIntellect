import client from './api.client';
import type { CreateSavedModelRequest, SavedModel } from '../types/api.types';

export const modelsService = {
  list(): Promise<SavedModel[]> {
    return client.get<SavedModel[]>('/models').then((r) => r.data);
  },

  create(payload: CreateSavedModelRequest): Promise<SavedModel> {
    return client.post<SavedModel>('/models', payload).then((r) => r.data);
  },

  remove(id: string): Promise<void> {
    return client.delete(`/models/${id}`).then(() => undefined);
  },
};
