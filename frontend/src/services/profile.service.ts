import client from './api.client';
import type { Profile, UpdateProfileRequest } from '../types/api.types';

export const profileService = {
  getMe(): Promise<Profile> {
    return client.get<Profile>('/profile/me').then((r) => r.data);
  },

  updateMe(payload: UpdateProfileRequest): Promise<Profile> {
    return client.patch<Profile>('/profile/me', payload).then((r) => r.data);
  },
};
