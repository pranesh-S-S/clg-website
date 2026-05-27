import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const TOTAL_FRAMES = 144

// Detect mobile once at module level to avoid repeated checks
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

// On mobile, load only every 2nd frame (72 frames) to halve memory + network
const FRAME_STEP = IS_MOBILE ? 2 : 1
const FRAME_COUNT = Math.ceil(TOTAL_FRAMES / FRAME_STEP)

// Fewer particles on mobile (5 vs 15) to reduce GPU compositing layers
const PARTICLE_COUNT = IS_MOBILE ? 5 : 15
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  width: 2 + (i * 17 % 5),
  left: (i * 23 + 7) % 100,
  bottom: (i * 13) % 20,
  duration: 8 + (i * 11 % 12),
  delay: (i * 7 % 10),
}))

export default function Hero() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [images, setImages] = useState([])
  const [loaded, setLoaded] = useState(0)
  const frameIndexRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // --- SCROLL TRANSFORMS ---
  // Frame sequencing: 0→143 over the entire scroll
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1])

  const isMobile = IS_MOBILE;

  // --- DESKTOP (LAPTOP) TIMINGS (100% UNTOUCHED) ---
  const desktopOpacityRange = [0.15, 0.35];
  const desktopYRange = [0.15, 0.4, 1];
  const desktopYVals = [150, 0, 0];
  const desktopBadgeOpacity = [0.12, 0.3];
  const desktopCtaOpacity = [0.18, 0.38];

  // --- MOBILE TIMINGS ---
  // Trigger much earlier so text is guaranteed to be visible with just a small scroll
  const mobileOpacityRange = [0.02, 0.12];
  const mobileYRange = [0.02, 0.15, 1];
  const mobileYVals = [50, 0, 0];
  const mobileBadgeOpacity = [0.01, 0.1];
  const mobileCtaOpacity = [0.03, 0.15];

  // Text fades in as it rises from bottom, stays solid permanently (no fade-out)
  const textOpacity = useTransform(scrollYProgress, isMobile ? mobileOpacityRange : desktopOpacityRange, [0, 1])

  // Text starts below viewport, rises to center, and STAYS at center
  const textY = useTransform(scrollYProgress, isMobile ? mobileYRange : desktopYRange, isMobile ? mobileYVals : desktopYVals)

  // Badge fades in slightly before the main text
  const badgeOpacity = useTransform(scrollYProgress, isMobile ? mobileBadgeOpacity : desktopBadgeOpacity, [0, 1])

  // CTA buttons fade in with text, stay visible permanently
  const ctaOpacity = useTransform(scrollYProgress, isMobile ? mobileCtaOpacity : desktopCtaOpacity, [0, 1])

  // Giant background VELAMMAL text
  const bigTextY = useTransform(scrollYProgress, [0.0, 0.9], [100, -250])
  const bigTextOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.75, 0.9], [0, 0.08, 0.12, 0])

  // Scroll hint disappears quickly
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  // Bottom gradient overlay intensifies near the end for clean transition
  const overlayOpacity = useTransform(scrollYProgress, [0.7, 1], [0.8, 1])

  // On mobile, skip every other frame (load frames 1,3,5,...) to halve downloads
  const frameUrls = useMemo(() =>
    Array.from({ length: FRAME_COUNT }, (_, i) => {
      const actualFrame = i * FRAME_STEP + 1 // 1-indexed source filenames
      return `/frames/ezgif-frame-${String(actualFrame).padStart(3, '0')}.jpg`
    }), [])

  // Preload frames and show page immediately after first frame
  useEffect(() => {
    const loadedImages = new Array(FRAME_COUNT).fill(null)
    let count = 0
    frameUrls.forEach((url, i) => {
      const img = new Image()
      img.src = url
      img.onload = img.onerror = () => {
        count++
        setLoaded(count)
        loadedImages[i] = img
        if (i === 0) setImages(loadedImages)
      }
    })
  }, [frameUrls])

  // Canvas rendering — rAF-throttled to prevent layout thrashing on mobile
  useEffect(() => {
    if (images.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    // DPR capped at 1 on mobile (saves 4x pixel fill), 1.5 on desktop
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5)

    let drawParams = { dx: 0, dy: 0, sw: 0, sh: 0 }
    let rafId = null
    let pendingFrame = -1

    function resizeCanvas() {
      const cw = window.innerWidth * dpr
      const ch = window.innerHeight * dpr
      canvas.width = cw
      canvas.height = ch
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      
      // Pre-calculate image drawing parameters to save CPU on scroll
      if (images[0]) {
        const iw = images[0].naturalWidth || 1920
        const ih = images[0].naturalHeight || 1080
        const scale = Math.max(cw / iw, ch / ih)
        drawParams.sw = iw * scale
        drawParams.sh = ih * scale
        drawParams.dx = (cw - drawParams.sw) / 2
        drawParams.dy = (ch - drawParams.sh) / 2
      }

      // Redraw current frame after resize
      const idx = frameIndexRef.current
      if (images[idx]?.complete) drawCover(images[idx])
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas, { passive: true })

    function drawCover(img) {
      ctx.drawImage(img, drawParams.dx, drawParams.dy, drawParams.sw, drawParams.sh)
    }

    // Batch canvas draws into a single rAF to avoid redundant paints
    function scheduleDrawFrame(idx) {
      pendingFrame = idx
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null
          if (pendingFrame >= 0 && images[pendingFrame]?.complete) {
            drawCover(images[pendingFrame])
          }
        })
      }
    }

    const unsubscribe = frameIndex.on("change", (latest) => {
      const idx = Math.min(Math.max(0, Math.round(latest)), FRAME_COUNT - 1)
      if (idx !== frameIndexRef.current) {
        frameIndexRef.current = idx
        scheduleDrawFrame(idx)
      }
    })

    // Draw first frame immediately
    if (images[0]?.complete) drawCover(images[0])

    return () => {
      unsubscribe()
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [images, frameIndex])

  const loadingPercent = Math.round((loaded / FRAME_COUNT) * 100)
  const isLoaded = images.length > 0

  return (
    <div 
      ref={containerRef} 
      className="relative"
      style={{ height: typeof window !== 'undefined' && window.innerWidth < 768 ? '250vh' : '400vh' }}
    >
      {/* Loading screen */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[200] bg-[#050a12] flex flex-col items-center justify-center gap-6">
          <div className="font-['Outfit'] text-white/40 text-sm tracking-[6px] uppercase">Loading Experience</div>
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
              style={{ width: `${loadingPercent}%` }}
            />
          </div>
          <div className="text-white/30 text-xs font-mono">{loadingPercent}%</div>
        </div>
      )}

      {/* Sticky hero viewport */}
      <div className="hero-canvas-wrapper">
        {/* Layer 1: Canvas — GPU-promoted for compositing */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'contents' }} />

        {/* Layer 2: Giant VELAMMAL text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none"
          style={{ y: bigTextY, opacity: bigTextOpacity, willChange: 'transform, opacity' }}
        >
          <span className="font-['Outfit'] font-black text-white text-[clamp(5rem,20vw,24rem)] leading-none tracking-tighter select-none whitespace-nowrap">
            VELAMMAL
          </span>
        </motion.div>

        {/* Layer 3: Dark gradient — intensifies at end for smooth transition */}
        <motion.div
          className="absolute inset-0 z-[3] pointer-events-none bg-gradient-to-b from-[#050a12]/15 via-transparent to-[#050a12]"
          style={{ opacity: overlayOpacity }}
        />

        {/* Layer 4: Content — centered in viewport */}
        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <motion.div
            className="flex flex-col items-center"
            style={{ y: textY, opacity: textOpacity, willChange: 'transform, opacity' }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-[#050a12]/95 border border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.3)] px-5 py-2 rounded-full mb-6 backdrop-blur-md pointer-events-auto"
              style={{ opacity: badgeOpacity }}
            >
              <span className="text-amber-400 text-xs md:text-sm font-bold tracking-[3px] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                🎓 TNEA 1237 &nbsp;|&nbsp; Admissions 2026-27
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="font-['Outfit'] font-extrabold text-white text-[clamp(2rem,6vw,4.5rem)] leading-[1.1] max-w-3xl mb-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
            >
              Engineering the{' '}
              <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Future</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-white/95 text-sm md:text-lg max-w-xl mb-8 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] font-medium"
            >
              Velammal Institute of Technology — Ranked 2nd in Tamil Nadu. NAAC Accredited. NBA Approved.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center pointer-events-auto"
              style={{ opacity: ctaOpacity }}
            >
              <a href="#campus" className="bg-white/20 border-2 border-white/50 text-white px-8 py-3 rounded-full font-bold text-sm backdrop-blur-md hover:bg-white/30 transition-all duration-300 shadow-[0_4px_20px_rgba(255,255,255,0.15)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Explore Campus
              </a>
              <a href="https://admission.velammalitech.edu.in/register" target="_blank" rel="noreferrer"
                className="bg-gradient-to-r from-amber-400 to-amber-500 text-[#0a1628] px-8 py-3 rounded-full font-extrabold text-sm shadow-[0_4px_25px_rgba(251,191,36,0.5)] hover:shadow-[0_12px_40px_rgba(212,168,67,0.6)] hover:-translate-y-0.5 transition-all duration-300">
                Admissions Open →
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Bright Scroll Hint */}
        <motion.div
          className="absolute bottom-[12vh] md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-[20]"
          style={{ opacity: scrollHintOpacity, scale: scrollHintOpacity }}
        >
          <span className="font-['Outfit'] text-xs uppercase tracking-[6px] text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] font-bold">
            Scroll to Explore
          </span>
          <motion.div
            className="w-8 h-12 border-2 border-amber-400/50 rounded-full flex justify-center p-1 relative shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            <motion.div
              className="w-1.5 h-3 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,1)]"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>

        {/* Particles */}
        <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-400/25"
              style={{
                width: p.width + 'px', height: p.width + 'px',
                left: p.left + '%', bottom: p.bottom + '%',
                animation: `floatParticle ${p.duration}s linear infinite`,
                animationDelay: p.delay + 's',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

