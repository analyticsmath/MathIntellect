import { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { PageShell } from '../layouts/PageShell';
import { ErrorState } from '../components/ui/ErrorState';
import { Loader } from '../components/ui/Loader';
import { useProfile } from '../hooks/useProfile';

export function ProfilePage() {
  const { profile, loading, error, update, refetch } = useProfile();
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [timezone, setTimezone] = useState('');

  const canSubmit = useMemo(() => !!profile && !saving, [profile, saving]);

  useEffect(() => {
    if (!profile) {
      return;
    }
    setDisplayName(profile.displayName ?? '');
    setAvatarUrl(profile.avatarUrl ?? '');
    setBio(profile.bio ?? '');
    setTimezone(profile.timezone ?? '');
  }, [profile]);

  const onSave = async () => {
    if (!profile) {
      return;
    }
    setSaving(true);
    try {
      await update({
        displayName,
        avatarUrl,
        bio,
        timezone,
      });
      setSavedAt(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <PageShell
        title="Profile"
        subtitle="Identity, progression, and behavior settings"
        action={(
          <button
            type="button"
            className="primary-cta text-xs"
            style={{ paddingTop: 8, paddingBottom: 8 }}
            onClick={() => {
              void onSave();
            }}
            disabled={!canSubmit}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        )}
      >
        <div className="px-3 md:px-6 pt-5 pb-10 space-y-5">
          {loading && <Loader message="Loading profile..." />}
          {error && !loading && <ErrorState message={error} onRetry={refetch} />}

          {!loading && !error && profile && (
            <>
              <section className="premium-card p-5 md:p-6" data-tilt>
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <p className="section-kicker">Progress Snapshot</p>
                    <h2 className="mt-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.3rem)' }}>Level {profile.level} Strategist</h2>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      AI adaptation is active. Skill drift, behavior tags, and progression refresh after every mission.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="surface-glass rounded-xl px-4 py-2">
                      <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>XP</p>
                      <p className="text-lg font-semibold" style={{ color: 'var(--brand-blue)' }}>{profile.xp}</p>
                    </div>
                    <div className="surface-glass rounded-xl px-4 py-2">
                      <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-muted)' }}>Streak</p>
                      <p className="text-lg font-semibold" style={{ color: 'var(--signal-cyan)' }}>{profile.streakDays}d</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="premium-card p-5 md:p-6" data-tilt>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-secondary)' }}>
                      Display Name
                    </span>
                    <input
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      className="w-full mt-2 px-3 py-2.5 rounded-xl"
                      style={{ border: '1px solid var(--line-soft)', background: 'rgba(11,16,32,0.78)' }}
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-secondary)' }}>
                      Timezone
                    </span>
                    <input
                      value={timezone}
                      onChange={(event) => setTimezone(event.target.value)}
                      placeholder="e.g. Asia/Karachi"
                      className="w-full mt-2 px-3 py-2.5 rounded-xl"
                      style={{ border: '1px solid var(--line-soft)', background: 'rgba(11,16,32,0.78)' }}
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-secondary)' }}>
                      Avatar URL
                    </span>
                    <input
                      value={avatarUrl}
                      onChange={(event) => setAvatarUrl(event.target.value)}
                      placeholder="https://..."
                      className="w-full mt-2 px-3 py-2.5 rounded-xl"
                      style={{ border: '1px solid var(--line-soft)', background: 'rgba(11,16,32,0.78)' }}
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--text-secondary)' }}>
                      Bio
                    </span>
                    <textarea
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                      rows={4}
                      className="w-full mt-2 px-3 py-2.5 rounded-xl"
                      style={{ border: '1px solid var(--line-soft)', background: 'rgba(11,16,32,0.78)' }}
                    />
                  </label>
                </div>
                {savedAt && (
                  <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    Saved at {savedAt}
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </PageShell>
    </MainLayout>
  );
}
