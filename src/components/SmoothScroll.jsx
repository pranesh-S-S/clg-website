import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * SmoothScroll — wraps children with Lenis for buttery-smooth inertial scrolling.
 * Disabled on touch devices where native scroll is already smooth and Lenis adds overhead.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Detect touch-primary devices — native scroll is smoother than Lenis on mobile
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) return

    const lenis = new Lenis({
      duration: 1.2,
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
