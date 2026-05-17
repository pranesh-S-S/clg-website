import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const FRAME_COUNT = 144

// Pre-generate particle styles to avoid random values in render
const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
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

  // Text fades in as it rises from bottom, stays solid permanently (no fade-out)
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1])

  // Text starts below viewport, rises to center, and STAYS at center
  // 150px offset works on both mobile (small viewport) and desktop
  const textY = useTransform(scrollYProgress, [0.12, 0.4, 1], [150, 0, 0])

  // Badge fades in slightly before the main text
  const badgeOpacity = useTransform(scrollYProgress, [0.1, 0.24], [0, 1])

  // CTA buttons fade in with text, stay visible permanently
  const ctaOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1])

  // Giant background VELAMMAL text
  const bigTextY = useTransform(scrollYProgress, [0.0, 0.9], [100, -250])
  const bigTextOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.75, 0.9], [0, 0.08, 0.12, 0])

  // Scroll hint disappears quickly
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])

  // Bottom gradient overlay intensifies near the end for clean transition
  const overlayOpacity = useTransform(scrollYProgress, [0.7, 1], [0.8, 1])

  const frameUrls = useMemo(() =>
    Array.from({ length: FRAME_COUNT }, (_, i) =>
      `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
    ), [])

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

  // Canvas rendering — throttled to only redraw on frame change
  useEffect(() => {
    if (images.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    // Cap DPR at 1.5 on mobile to prevent GPU overload
    const isMobile = window.innerWidth < 768
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5)

    function resizeCanvas() {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      // Redraw current frame after resize
      const idx = frameIndexRef.current
      if (images[idx]?.complete) drawCover(images[idx])
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    function drawCover(img) {
      const cw = canvas.width, ch = canvas.height
      const iw = img.naturalWidth, ih = img.naturalHeight
      const scale = Math.max(cw / iw, ch / ih)
      const sw = iw * scale, sh = ih * scale
      ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh)
    }

    let animId
    function renderFrame() {
      const idx = Math.min(Math.max(0, Math.round(frameIndex.get())), FRAME_COUNT - 1)
      if (idx !== frameIndexRef.current) {
        frameIndexRef.current = idx
        if (images[idx]?.complete) drawCover(images[idx])
      }
      animId = requestAnimationFrame(renderFrame)
    }
    // Draw first frame immediately
    if (images[0]?.complete) drawCover(images[0])
    animId = requestAnimationFrame(renderFrame)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [images, frameIndex])

  const loadingPercent = Math.round((loaded / FRAME_COUNT) * 100)
  const isLoaded = images.length > 0

  return (
    <div ref={containerRef} className="relative h-[250vh] md:h-[400vh]">
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
        {/* Layer 1: Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Layer 2: Giant VELAMMAL text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none"
          style={{ y: bigTextY, opacity: bigTextOpacity }}
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
            style={{ y: textY, opacity: textOpacity }}
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
              className="font-['Outfit'] font-extrabold text-white text-[clamp(2rem,6vw,4.5rem)] leading-[1.1] max-w-3xl mb-5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            >
              Engineering the{' '}
              <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(251,191,36,0.3)]">Future</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-white/95 text-sm md:text-lg max-w-xl mb-8 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] font-medium"
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

