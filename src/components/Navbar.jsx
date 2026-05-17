import { useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

/**
 * Navbar — minimal glassmorphism nav that blurs on scroll.
 */
export default function Navbar() {
  const { scrollYProgress } = useScroll()
  const bgOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 0.85])
  const blur = useTransform(scrollYProgress, [0, 0.05], [0, 20])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = ['Home', 'Programs', 'Placements', 'Campus', 'Contact']

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-4"
        style={{
          backgroundColor: useTransform(bgOpacity, (v) => `rgba(5, 10, 18, ${v})`),
          backdropFilter: useTransform(blur, (v) => `blur(${v}px)`),
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 relative z-[101]">
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
            {navLinks.map((item) => (
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
          <button 
            className="lg:hidden text-white relative z-[101] w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <motion.span 
              className="w-6 h-0.5 bg-white block rounded-full origin-center"
              animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 8 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              className="w-6 h-0.5 bg-white block rounded-full"
              animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span 
              className="w-6 h-0.5 bg-white block rounded-full origin-center"
              animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -8 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[90] bg-[#050a12]/95 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center gap-8 px-6"
          >
            {navLinks.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.1 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white text-2xl font-['Outfit'] font-bold tracking-wider hover:text-amber-400 transition-colors"
              >
                {item}
              </motion.a>
            ))}
            <motion.a
              href="https://admission.velammalitech.edu.in/"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-[#0a1628] px-10 py-4 rounded-full text-lg font-extrabold tracking-wide hover:shadow-[0_8px_30px_rgba(212,168,67,0.4)] transition-all"
            >
              Apply Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
