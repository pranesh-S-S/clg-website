import { useEffect, useRef } from 'react';
import './LegacySite.css';

export default function LegacySite() {
  const statsRef = useRef(null);

  useEffect(() => {
    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.stat-number');
    let counterStarted = false;

    const animateCounters = () => {
      if (counterStarted) return;
      counterStarted = true;
      
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const spanNode = counter.querySelector('span');
        const suffixHtml = spanNode ? `<span>${spanNode.textContent}</span>` : '';
        
        let current = 0;
        const duration = 1500; // 1.5 seconds
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          current = target * easeProgress;
          
          counter.innerHTML = Math.floor(current) + suffixHtml;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.innerHTML = target + suffixHtml;
          }
        }
        requestAnimationFrame(updateCounter);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.unobserve(statsRef.current);
      }
    }, { threshold: 0.3 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  return (
    <div className="legacy-site">
      {/* ===== STATS BAR ===== */}
      <section className="stats-section" ref={statsRef}>
        <div className="legacy-container">
          <div className="stats-grid">
            <div className="stat-item fade-up">
              <div className="stat-number" data-target="2">0<span>nd</span></div>
              <div className="stat-label">Rank in Tamil Nadu</div>
            </div>
            <div className="stat-item fade-up fade-up-delay-1">
              <div className="stat-number" data-target="7">0<span>+</span></div>
              <div className="stat-label">UG Programs</div>
            </div>
            <div className="stat-item fade-up fade-up-delay-2">
              <div className="stat-number" data-target="497">0<span>+</span></div>
              <div className="stat-label">Colleges Outranked</div>
            </div>
            <div className="stat-item fade-up fade-up-delay-3">
              <div className="stat-number" data-target="17">0<span>+ Yrs</span></div>
              <div className="stat-label">Of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="about-section" id="about">
        <div className="legacy-container">
          <div className="about-grid">
            <div className="about-image fade-up">
              <img src="https://velammalitech.edu.in/wp-content/themes/VelammalIT/assets/images/about.jpg" alt="Velammal Institute of Technology" />
              <div className="about-image-badge">A+<small>NAAC Grade</small></div>
            </div>
            <div className="fade-up fade-up-delay-1">
              <div className="section-label">About Us</div>
              <h2 className="section-title">Welcome to Velammal Institute of Technology</h2>
              <p className="section-desc">Velammal Institute of Technology, the brainchild of our Honorable Chairman, bloomed on 14th August 2008 — intended to provide world-class technical education to conquer tomorrow's technology. Affiliated to Anna University and approved by AICTE.</p>
              <div className="about-features">
                <div className="about-feature">
                  <div className="about-feature-icon">🏆</div>
                  <div>
                    <h4>2nd Rank in Tamil Nadu</h4>
                    <p>Among 497 Engineering Colleges — Anna University Rankings.</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="about-feature-icon">✅</div>
                  <div>
                    <h4>NAAC Accredited & NBA Approved</h4>
                    <p>Recognized for quality education standards and outcomes.</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="about-feature-icon">🔬</div>
                  <div>
                    <h4>DSIR-SIRO Recognized</h4>
                    <p>Research centers in ECE & Physics with funded projects & patents.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROGRAMS / DEPARTMENTS ===== */}
      <section className="programs-section" id="programs">
        <div className="legacy-container">
          <div className="section-label fade-up">Our Departments</div>
          <h2 className="section-title fade-up">B.E / B.Tech Programs</h2>
          <p className="section-desc fade-up">7 UG programs and 1 PG program — all affiliated to Anna University, Chennai.</p>
          <div className="programs-grid">
            <div className="program-card fade-up">
              <div className="program-icon">💻</div>
              <h3>Computer Science & Engineering</h3>
              <p>Master algorithms, AI, and software development with cutting-edge labs and industry-ready curriculum.</p>
              <a href="https://velammalitech.edu.in/cse-about-the-department/" className="program-link" target="_blank" rel="noreferrer">Learn More →</a>
            </div>
            <div className="program-card fade-up fade-up-delay-1">
              <div className="program-icon">🤖</div>
              <h3>AI & Data Science</h3>
              <p>Explore machine learning, deep learning, and big data analytics in state-of-the-art AI laboratories.</p>
              <a href="https://velammalitech.edu.in/ai-ds/" className="program-link" target="_blank" rel="noreferrer">Learn More →</a>
            </div>
            <div className="program-card fade-up fade-up-delay-2">
              <div className="program-icon">🌐</div>
              <h3>Information Technology</h3>
              <p>Build expertise in networking, cloud computing, cybersecurity, and full-stack web development.</p>
              <a href="https://velammalitech.edu.in/it-about-the-department/" className="program-link" target="_blank" rel="noreferrer">Learn More →</a>
            </div>
            <div className="program-card fade-up fade-up-delay-3">
              <div className="program-icon">📡</div>
              <h3>Electronics & Communication</h3>
              <p>Design communication systems, VLSI circuits, and embedded solutions for the connected world.</p>
              <a href="https://velammalitech.edu.in/ece-about-the-department/" className="program-link" target="_blank" rel="noreferrer">Learn More →</a>
            </div>
            <div className="program-card fade-up fade-up-delay-4">
              <div className="program-icon">⚡</div>
              <h3>Electrical & Electronics</h3>
              <p>Power systems, renewable energy, robotics, and IoT — powering the future of infrastructure.</p>
              <a href="https://velammalitech.edu.in/eee-about-the-department/" className="program-link" target="_blank" rel="noreferrer">Learn More →</a>
            </div>
            <div className="program-card fade-up">
              <div className="program-icon">⚙️</div>
              <h3>Mechanical & Mechatronics</h3>
              <p>From manufacturing to automation — design, build, and innovate with hands-on engineering.</p>
              <a href="https://velammalitech.edu.in/mech-about-the-department/" className="program-link" target="_blank" rel="noreferrer">Learn More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAMPUS LIFE ===== */}
      <section className="campus-section" id="campus">
        <div className="legacy-container">
          <div className="section-label fade-up">Campus Life</div>
          <h2 className="section-title fade-up">Life at Velammal Knowledge Park</h2>
          <p className="section-desc fade-up">World-class infrastructure at Chennai–Kolkata Highway, Panchetti with everything students need to thrive.</p>
          <div className="campus-grid">
            <div className="campus-card fade-up">
              <img src="https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80" alt="Sports facilities" />
              <div className="campus-card-overlay"><div><h4>Sports & NCC</h4><p>Athletics, NCC & inter-college competitions</p></div></div>
            </div>
            <div className="campus-card fade-up fade-up-delay-1">
              <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80" alt="Central Library" />
              <div className="campus-card-overlay"><div><h4>Central Library</h4><p>Extensive digital & print resources</p></div></div>
            </div>
            <div className="campus-card fade-up fade-up-delay-2">
              <img src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80" alt="Innovation Labs" />
              <div className="campus-card-overlay"><div><h4>Innovation Labs</h4><p>R&D Center, IIC & incubation support</p></div></div>
            </div>
            <div className="campus-card fade-up fade-up-delay-3">
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" alt="Events & Clubs" />
              <div className="campus-card-overlay"><div><h4>Clubs & Fests</h4><p>NSS, YRC, UBA & 20+ active clubs</p></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ACHIEVEMENTS / TESTIMONIALS ===== */}
      <section className="testimonials-section" id="achievements">
        <div className="legacy-container">
          <div class="section-label fade-up">Proud Achievements</div>
          <h2 className="section-title fade-up">Our Students Shine Bright</h2>
          <p className="section-desc fade-up">Anna University Gold Medalists, SIH Winners & Industry-Ready Graduates.</p>
          <div className="testimonials-track" id="testimonialsTrack">
            <div className="testimonial-card fade-up">
              <div className="testimonial-stars">🥇🥇🥇</div>
              <p className="testimonial-text">"Our CSE student Mannem Hema Sri received the Anna University Gold Medal from the Honorable Governor Mr. R.N. Ravi — a proud moment for the entire VIT family."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">HS</div>
                <div><div className="testimonial-name">Mannem Hema Sri</div><div className="testimonial-role">B.E CSE — Gold Medalist</div></div>
              </div>
            </div>
            <div className="testimonial-card fade-up fade-up-delay-1">
              <div className="testimonial-stars">🥇🥇🥇</div>
              <p className="testimonial-text">"Mr. Abdul Malik of AI&DS, 2025 batch, received the Gold Medal from Anna University — proving that VIT's AI program produces industry-leading talent."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">AM</div>
                <div><div className="testimonial-name">Abdul Malik</div><div className="testimonial-role">B.Tech AI&DS — Gold Medalist, Batch 2025</div></div>
              </div>
            </div>
            <div className="testimonial-card fade-up fade-up-delay-2">
              <div className="testimonial-stars">🏆🏆🏆</div>
              <p className="testimonial-text">"Congratulations to our III Year CSE students who were appreciated at Smart India Hackathon 2025 held in Haryana — showcasing innovation at the national level."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">CS</div>
                <div><div className="testimonial-name">CSE Team</div><div className="testimonial-role">Smart India Hackathon 2025 — Appreciated</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section" id="apply">
        <div className="legacy-container">
          <h2 className="cta-title fade-up">Admissions Open 2026-27</h2>
          <p className="cta-desc fade-up">TNEA Code: <strong>1237</strong> &nbsp;|&nbsp; NAAC Accredited &nbsp;|&nbsp; NBA Approved &nbsp;|&nbsp; Anna University Affiliated</p>
          <div className="hero-buttons fade-up">
            <a href="https://admission.velammalitech.edu.in/" className="btn-primary" target="_blank" rel="noreferrer">Register Online →</a>
            <a href="https://velammalitech.edu.in/wp-content/uploads/2024/03/VIT-Brochure-24_25-12P_compressed.pdf" className="btn-secondary" target="_blank" rel="noreferrer">Download Brochure</a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="contact">
        <div className="legacy-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="logo">
                <img src="https://velammalitech.edu.in/wp-content/themes/VelammalIT/assets/images/logo.png" alt="VIT Logo" style={{height: '42px', width: 'auto', borderRadius: '0'}} />
                VIT
              </a>
              <p>Velammal Institute of Technology, "Velammal Knowledge Park", Chennai–Kolkata Highway, Panchetti, Thiruvallur District.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <a href="#about">About Us</a>
              <a href="#programs">Departments</a>
              <a href="https://velammalitech.edu.in/placement-summary/" target="_blank" rel="noreferrer">Placements</a>
              <a href="https://velammalitech.edu.in/naac/" target="_blank" rel="noreferrer">NAAC</a>
              <a href="https://velammalitech.edu.in/nirf/" target="_blank" rel="noreferrer">NIRF</a>
            </div>
            <div className="footer-col">
              <h4>Admissions</h4>
              <a href="https://admission.velammalitech.edu.in/" target="_blank" rel="noreferrer">Online Registration</a>
              <a href="https://velammalitech.edu.in/scholarships/" target="_blank" rel="noreferrer">Scholarships</a>
              <a href="https://velammalitech.edu.in/hostel/" target="_blank" rel="noreferrer">Hostel Info</a>
              <a href="https://velammalitech.edu.in/campus-infrastructure/" target="_blank" rel="noreferrer">Infrastructure</a>
              <a href="https://velammalitech.edu.in/career-at-velammal-institute-of-technology/" target="_blank" rel="noreferrer">Careers</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="#">📍 Panchetti, Thiruvallur District</a>
              <a href="tel:9087556789">📞 9087556789</a>
              <a href="tel:04422446300">📞 044-2244 6300</a>
              <a href="mailto:info@velammaltrust.com">✉️ info@velammaltrust.com</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Velammal Institute of Technology. All rights reserved. &nbsp;|&nbsp; TNEA Code: 1237</p>
            <div className="footer-socials">
              <a href="https://www.facebook.com/VelammalITech/" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
              <a href="https://twitter.com/VelammalITech" target="_blank" rel="noreferrer" aria-label="Twitter">𝕏</a>
              <a href="https://youtu.be/_ml9OD3K4kY" target="_blank" rel="noreferrer" aria-label="YouTube">▶</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
