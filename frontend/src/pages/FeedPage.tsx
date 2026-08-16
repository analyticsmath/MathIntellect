import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { PageShell } from '../layouts/PageShell';
import { IntelligenceFeed } from '../modules/social/IntelligenceFeed';

export function FeedPage() {
  const navigate = useNavigate();

  const action = (
    <button
      type="button"
      className="mi-btn-primary h-9 px-4 text-xs"
      onClick={() => navigate('/app/simulations/new')}
    >
      + New Simulation
    </button>
  );

  return (
    <MainLayout>
      <PageShell
        title="Activity Stream"
        subtitle="Mathematical models &amp; published analysis records"
        action={action}
      >
        <div className="p-6 md:p-8 max-w-[1280px] mx-auto w-full space-y-6">
          <IntelligenceFeed />
        </div>
      </PageShell>
    </MainLayout>
  );
}

export default FeedPage;
