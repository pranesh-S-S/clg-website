import { useEffect, lazy, Suspense } from 'react'
import SmoothScroll from './components/SmoothScroll'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

// Lazy-load LegacySite — it's below the fold and not needed during Hero scroll.
// This shaves ~17KB+ off the critical JS bundle so mobile CPUs focus on canvas.
const LegacySite = lazy(() => import('./components/LegacySite'))

/**
 * App — Root component.
 * Wraps everything in SmoothScroll for Lenis inertial physics.
 * Hero section is the cinematic frame-scrub experience.
 * Below the hero, the main site content loads natively.
 */
export default function App() {
  // Force scroll to top on load so user always sees the clouds first
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);
  return (
    <SmoothScroll>
      {/* Film grain overlay — always on top */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navbar />

      {/* Cinematic Hero — scroll-driven frame animation */}
      <Hero />

      {/* Transition into main site content natively */}
      <section className="relative z-10 w-full h-auto bg-[#f9fafb]">
        {/* Dark fade from hero into legacy light mode */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#050a12] via-[#050a12]/80 to-transparent pointer-events-none z-[11]" />
        
        {/* Native React component for legacy content — lazy loaded */}
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <LegacySite />
        </Suspense>
      </section>
    </SmoothScroll>
  )
}
