import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Navbar — minimal glassmorphism nav that blurs on scroll.
 */
export default function Navbar() {
  const { scrollYProgress } = useScroll()
  const bgOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 0.85])
  const blur = useTransform(scrollYProgress, [0, 0.05], [0, 20])

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-4"
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(5, 10, 18, ${v})`),
        backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <img
            src="https://velammalitech.edu.in/wp-content/themes/VelammalIT/assets/images/logo.png"
            alt="VIT"
            className="h-10 md:h-12 brightness-150 drop-shadow-lg"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-['Outfit'] font-extrabold text-lg tracking-wide">VIT</span>
            <span className="text-white/60 text-[0.55rem] font-medium tracking-wider hidden sm:block">
              AICTE • Anna University • NAAC
            </span>
          </div>
        </a>

        {/* Nav Links — hidden on mobile */}
        <div className="hidden lg:flex items-center gap-8">
          {['Home', 'Programs', 'Placements', 'Campus', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white/70 hover:text-white text-sm font-medium tracking-wide transition-colors duration-300"
            >
              {item}
            </a>
          ))}
          <a
            href="https://admission.velammalitech.edu.in/"
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a1628] px-6 py-2.5 rounded-full text-sm font-bold tracking-wide hover:shadow-[0_8px_30px_rgba(212,168,67,0.4)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Apply Now
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden text-white/80 text-2xl" aria-label="Menu">☰</button>
      </div>
    </motion.nav>
  )
}
