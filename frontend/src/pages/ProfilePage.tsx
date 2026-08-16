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
  const [saveError, setSaveError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [timezone, setTimezone] = useState('');

  const canSubmit = useMemo(() => !!profile && !saving, [profile, saving]);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName ?? '');
    setAvatarUrl(profile.avatarUrl ?? '');
    setBio(profile.bio ?? '');
    setTimezone(profile.timezone ?? '');
  }, [profile]);

  const onSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveError(null);
    try {
      await update({
        displayName,
        avatarUrl,
        bio,
        timezone,
      });
      setSavedAt(new Date().toLocaleTimeString());
    } catch (cause) {
      setSaveError(cause instanceof Error ? cause.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const action = (
    <button
      type="button"
      className="mi-btn-primary h-9 px-4 text-xs"
      onClick={() => {
        void onSave();
      }}
      disabled={!canSubmit}
    >
      {saving ? 'Saving...' : 'Save Profile'}
    </button>
  );

  return (
    <MainLayout>
      <PageShell
        title="Profile &amp; Settings"
        subtitle="Analyst identity and workspace preferences"
        action={action}
      >
        <div className="p-6 md:p-8 max-w-[1080px] mx-auto w-full space-y-6">
          {loading && <Loader message="Loading profile..." />}
          {error && !loading && <ErrorState message={error} onRetry={refetch} />}

          {!loading && !error && profile && (
            <div className="space-y-6">
              {/* Section 1: Progression & Status Overview */}
              <section className="border border-mi-rule bg-mi-paper p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-mi-rule pb-3">
                  <div>
                    <div className="text-[10px] font-mono text-mi-muted uppercase">ANALYST LEVEL</div>
                    <h2 className="text-xl font-semibold text-mi-ink mt-0.5">
                      Level {profile.level ?? 1} Analyst
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <div className="p-2.5 bg-mi-surface-soft border border-mi-rule text-right">
                      <div className="text-mi-muted">TOTAL XP</div>
                      <div className="font-bold text-mi-ink">{profile.xp ?? 0}</div>
                    </div>
                    <div className="p-2.5 bg-mi-surface-soft border border-mi-rule text-right">
                      <div className="text-mi-muted">RUN STREAK</div>
                      <div className="font-bold text-mi-change">{profile.streakDays ?? 0}d</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-mi-text leading-relaxed">
                  Progression reflects verified mathematical simulation executions, model calibrations, and sensitivity analyses.
                </p>
              </section>

              {/* Section 2: Identity Settings */}
              <section className="border border-mi-rule bg-mi-paper p-6 space-y-5">
                <div className="border-b border-mi-rule pb-2">
                  <h3 className="text-sm font-semibold text-mi-ink">
                    Identity &amp; Profile Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-mono text-mi-muted uppercase block mb-1">
                      Display Name
                    </label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mi-input h-10 text-xs"
                      placeholder="e.g. Elena Rostova"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-mi-muted uppercase block mb-1">
                      Timezone
                    </label>
                    <input
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="mi-input h-10 text-xs"
                      placeholder="e.g. UTC, Europe/London"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-mono text-mi-muted uppercase block mb-1">
                      Avatar Image URL
                    </label>
                    <input
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="mi-input h-10 text-xs"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-mono text-mi-muted uppercase block mb-1">
                      Professional Bio / Focus
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="mi-input p-3 text-xs"
                      placeholder="Quantitative risk modeling, continuous diffusion, equilibrium game theory..."
                    />
                  </div>
                </div>

                {saveError && (
                  <div className="p-3 bg-mi-danger/10 border border-mi-danger text-xs font-mono text-mi-danger">
                    {saveError}
                  </div>
                )}

                {savedAt && (
                  <div className="p-3 bg-mi-success/10 border border-mi-success text-xs font-mono text-mi-success">
                    Profile saved successfully at {savedAt}.
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </PageShell>
    </MainLayout>
  );
}

export default ProfilePage;
