import { useCallback, useEffect, useState } from 'react';
import { profileService } from '../services/profile.service';
import type { Profile, UpdateProfileRequest } from '../types/api.types';
import { readAuthSession } from '../shared/utils/auth-session';

function fallbackProfile(): Profile {
  const session = readAuthSession();
  const user = session?.user;
  const now = new Date().toISOString();

  return {
    id: user?.id ?? 'local-profile',
    userId: user?.id ?? 'local-user',
    avatarUrl: null,
    displayName: user?.name ?? 'Math Intellect User',
    bio: null,
    xp: 0,
    level: 1,
    streakDays: 0,
    timezone: null,
    intelligenceProfileJson: null,
    engagementStateJson: null,
    lastBehaviorTag: null,
    createdAt: now,
    updatedAt: now,
  };
}

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
      const message = (cause as Error).message;
      if (/internal server error/i.test(message)) {
        setProfile(fallbackProfile());
        setError(null);
        return;
      }
      setError(message);
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
