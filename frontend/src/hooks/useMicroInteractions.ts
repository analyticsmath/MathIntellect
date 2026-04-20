import { useEffect } from 'react';

function bindRipples() {
  const selectors = '.primary-cta, .secondary-cta, [data-ripple]';
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selectors));
  const cleanups: Array<() => void> = [];

  nodes.forEach((node) => {
    node.style.position = node.style.position || 'relative';
    node.style.overflow = 'hidden';

    const onPointerDown = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }

      node.style.transform = 'scale(0.985)';
      const ripple = document.createElement('span');
      ripple.className = 'ui-ripple';
      const size = Math.max(rect.width, rect.height) * 1.2;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      node.appendChild(ripple);

      window.setTimeout(() => {
        ripple.remove();
      }, 420);
    };

    const onRelease = () => {
      node.style.transform = '';
    };

    node.addEventListener('pointerdown', onPointerDown, { passive: true });
    node.addEventListener('pointerup', onRelease, { passive: true });
    node.addEventListener('pointercancel', onRelease, { passive: true });
    node.addEventListener('pointerleave', onRelease, { passive: true });

    cleanups.push(() => {
      node.removeEventListener('pointerdown', onPointerDown);
      node.removeEventListener('pointerup', onRelease);
      node.removeEventListener('pointercancel', onRelease);
      node.removeEventListener('pointerleave', onRelease);
    });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

function bindCardTilt() {
  const selectors = '.premium-card--interactive, [data-tilt]';
  const cards = Array.from(document.querySelectorAll<HTMLElement>(selectors));
  const cleanups: Array<() => void> = [];

  cards.forEach((card) => {
    card.classList.add('tilt-surface');

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 4;
      const rotateY = (x - 0.5) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    };

    const reset = () => {
      card.style.transform = '';
    };

    card.addEventListener('pointermove', onMove, { passive: true });
    card.addEventListener('pointerleave', reset, { passive: true });
    card.addEventListener('pointercancel', reset, { passive: true });

    cleanups.push(() => {
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', reset);
      card.removeEventListener('pointercancel', reset);
      card.style.transform = '';
    });
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

function bindScrollReveal() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!items.length) {
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const target = entry.target as HTMLElement;
        target.classList.add('stagger-reveal');
        observer.unobserve(target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
  );

  items.forEach((item, index) => {
    item.style.animationDelay = `${Math.min(index, 6) * 70}ms`;
    observer.observe(item);
  });

  return () => observer.disconnect();
}

export function useMicroInteractions(scopeKey: string) {
  useEffect(() => {
    const root = document.documentElement;
    let rafId = 0;
    const point = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const draw = () => {
      rafId = 0;
      root.style.setProperty('--cursor-x', `${point.x}px`);
      root.style.setProperty('--cursor-y', `${point.y}px`);
    };

    const onMove = (event: PointerEvent) => {
      point.x = event.clientX;
      point.y = event.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    const releaseRipples = bindRipples();
    const releaseTilt = bindCardTilt();
    const releaseReveal = bindScrollReveal();

    return () => {
      window.removeEventListener('pointermove', onMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      releaseRipples();
      releaseTilt();
      releaseReveal();
    };
  }, [scopeKey]);
}
