import { useCallback, useEffect, useState } from 'react';
import { profileService } from '../services/profile.service';
import type { Profile, UpdateProfileRequest } from '../types/api.types';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getMe();
      setProfile(data);
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const update = useCallback(async (payload: UpdateProfileRequest) => {
    const updated = await profileService.updateMe(payload);
    setProfile(updated);
    return updated;
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetch,
    update,
  };
}
