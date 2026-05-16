import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * SmoothScroll — wraps children with Lenis for buttery-smooth inertial scrolling.
 * Lenis provides Apple-like scroll physics with momentum and smoothing.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return children
}
