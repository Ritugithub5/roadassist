import { useNavigate } from 'react-router-dom'
import {
  FaArrowRight, FaCheck, FaHeart, FaShieldAlt,
  FaBriefcase, FaMapMarkerAlt, FaLinkedin, FaTwitter,
  FaRocket, FaBullseye, FaHandshake, FaClock,
} from 'react-icons/fa'
import car4 from '../image/car4.png'

const About = () => {
  const navigate = useNavigate()

  const careers = [
    { role: 'Senior Full-Stack Engineer', dept: 'Engineering', location: 'Bangalore / Remote', type: 'Full-time', color: 'from-stone-500 to-rose-500', applyUrl: 'mailto:careers@roadassist.in?subject=Application: Senior Full-Stack Engineer' },
    { role: 'Product Designer (UI/UX)', dept: 'Design', location: 'Remote', type: 'Full-time', color: 'from-rose-400 to-stone-500', applyUrl: 'mailto:careers@roadassist.in?subject=Application: Product Designer' },
    { role: 'Operations Manager — South', dept: 'Operations', location: 'Bangalore', type: 'Full-time', color: 'from-stone-600 to-rose-500', applyUrl: 'mailto:careers@roadassist.in?subject=Application: Operations Manager South' },
    { role: 'Partner Success Associate', dept: 'Growth', location: 'Mumbai', type: 'Full-time', color: 'from-rose-400 to-stone-600', applyUrl: 'mailto:careers@roadassist.in?subject=Application: Partner Success Associate' },
    { role: 'Backend Engineer (Node.js)', dept: 'Engineering', location: 'Remote', type: 'Full-time', color: 'from-stone-500 to-rose-400', applyUrl: 'mailto:careers@roadassist.in?subject=Application: Backend Engineer' },
    { role: 'Marketing Intern', dept: 'Marketing', location: 'Remote', type: 'Internship', color: 'from-rose-400 to-stone-500', applyUrl: 'mailto:careers@roadassist.in?subject=Application: Marketing Intern' },
  ]

  const team = [
    { name: 'Padmalabha Gouda', role: 'Founder & CEO', initials: 'PG', color: 'from-stone-500 to-rose-500', bio: 'Ex-Ola, IIT-B alumnus. Obsessed with real-world problems.', linkedin: 'https://linkedin.com', twitter: '#' },
    { name: 'Ananya Sharma', role: 'Head of Product', initials: 'AS', color: 'from-rose-400 to-stone-500', bio: 'Designs every pixel to feel calm during chaos.', linkedin: 'https://linkedin.com', twitter: '#' },
    { name: 'Vikram Reddy', role: 'CTO', initials: 'VR', color: 'from-stone-600 to-rose-500', bio: 'Built scalable systems for 10M+ users.', linkedin: 'https://linkedin.com', twitter: '#' },
    { name: 'Meera Iyer', role: 'Head of Ops', initials: 'MI', color: 'from-rose-400 to-stone-600', bio: 'Ensures every partner is verified, every job delivered.', linkedin: 'https://linkedin.com', twitter: '#' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100">
      {/* ================= HERO ================= */}
      <section className="relative w-full pt-28 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-stone-300/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-300/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 mb-5">
              <FaHeart className="text-rose-500 text-xs" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-800">
                About RoadAssist
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-stone-950 mb-5">
              We're building India's most{' '}
              <span className="bg-gradient-to-r from-stone-400 via-rose-400 to-stone-600 bg-clip-text text-transparent">
                trusted roadside network.
              </span>
            </h1>

            <p className="text-base md:text-lg text-stone-700 leading-relaxed mb-8 max-w-lg">
              Every 8 minutes, a vehicle breaks down somewhere in India. We're on a mission to make sure no driver is ever stranded alone.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/request-service')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-stone-500 via-rose-500 to-stone-600 text-white font-bold shadow-lg shadow-rose-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Request Help <FaArrowRight className="text-xs" />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-stone-200 text-stone-900 font-semibold hover:border-rose-400 hover:bg-rose-50 transition-all"
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-rose-400/20 to-transparent rounded-3xl blur-2xl" />
            <img
              src={car4}
              alt="RoadAssist car"
              className="relative w-full rounded-2xl shadow-2xl shadow-stone-900/10 border-2 border-white"
            />
          </div>
        </div>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="relative py-16 px-6 border-y border-stone-200 bg-white/60">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold tracking-widest uppercase mb-3 border border-rose-200">
              Our Story
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-950 mb-4 leading-tight">
              Born from a{' '}
              <span className="bg-gradient-to-r from-stone-400 via-rose-400 to-stone-600 bg-clip-text text-transparent">
                real breakdown.
              </span>
            </h2>
            <div className="space-y-4 text-stone-800 leading-relaxed">
              <p>
                In 2024, our founder was stranded on the Mumbai-Pune expressway at 2 AM.
                No nearby garage. No way to find a tow. Three hours of stress, ₹12,000 lost,
                and zero accountability.
              </p>
              <p>
                That night, <strong className="text-stone-950">RoadAssist</strong> was born — with a simple promise:
                <em className="text-rose-600"> "No driver should ever feel stranded alone."</em>
              </p>
              <p>
                Today, we connect thousands of drivers with verified mechanics, transparent
                pricing, and real-time tracking — all from a single tap.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {['No hidden fees', 'Verified partners only', '24/7 availability', 'Pan-India coverage'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-stone-800 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center flex-shrink-0">
                    <FaCheck className="text-rose-600 text-[9px]" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Mission card — stone + rose gradient */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-stone-500 via-rose-400 to-stone-600 rounded-3xl p-8 text-white overflow-hidden shadow-2xl shadow-rose-500/20">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
              <div className="relative">
                <FaBullseye className="text-3xl mb-4 opacity-95" />
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-95 mb-2">
                  Our Mission
                </p>
                <p className="font-display text-2xl font-bold leading-snug mb-6">
                  Make roadside assistance as easy as ordering food.
                </p>

                <div className="space-y-3 pt-6 border-t border-white/30">
                  {[
                    { icon: <FaHandshake />, text: 'Trust over transactions' },
                    { icon: <FaClock />, text: 'Speed as a feature' },
                    { icon: <FaShieldAlt />, text: 'Safety as non-negotiable' },
                  ].map((v, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-semibold">
                      <div className="w-8 h-8 rounded-lg bg-white/25 backdrop-blur flex items-center justify-center text-sm">
                        {v.icon}
                      </div>
                      {v.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CORE VALUES ================= */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold tracking-widest uppercase mb-3 border border-rose-200">
              What Drives Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-950">
              Our core{' '}
              <span className="bg-gradient-to-r from-stone-400 via-rose-400 to-stone-600 bg-clip-text text-transparent">
                values.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <FaHandshake />, title: 'Trust First', desc: 'Every partner is background-checked. Every price is upfront. Every driver is protected.', color: 'from-stone-500 to-rose-500' },
              { icon: <FaRocket />, title: 'Speed Matters', desc: "Emergencies don't wait. We optimize every second — from matching to arrival.", color: 'from-rose-400 to-stone-500' },
              { icon: <FaHeart />, title: 'Human-Centered', desc: 'We treat every stranded driver like family. Empathy is coded into everything we build.', color: 'from-stone-600 to-rose-400' },
            ].map((v, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white border border-stone-200 hover:border-rose-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white text-2xl mb-4 shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform`}>
                  {v.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-stone-950 mb-2">{v.title}</h3>
                <p className="text-sm text-stone-700 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TEAM ================= */}
      <section className="py-16 px-6 bg-white/60 border-y border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold tracking-widest uppercase mb-3 border border-rose-200">
              Our Team
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-950 mb-3">
              The people{' '}
              <span className="bg-gradient-to-r from-stone-400 via-rose-400 to-stone-600 bg-clip-text text-transparent">
                behind the wheel.
              </span>
            </h2>
            <p className="text-sm text-stone-700 max-w-2xl mx-auto">
              A small, obsessed team of engineers, designers, and operators — building for the road.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-stone-200 p-5 text-center hover:border-rose-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 transition-all"
              >
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg shadow-rose-500/20 mb-4 group-hover:scale-110 transition-transform`}>
                  {m.initials}
                </div>
                <h3 className="font-display font-bold text-stone-950 text-sm">{m.name}</h3>
                <p className="text-[11px] font-bold text-rose-600 mb-2">{m.role}</p>
                <p className="text-[11px] text-stone-700 leading-relaxed mb-3">{m.bio}</p>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-rose-100 flex items-center justify-center text-stone-700 hover:text-rose-700 transition-colors"
                    title="LinkedIn"
                  >
                    <FaLinkedin className="text-xs" />
                  </a>
                  <a
                    href={m.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-rose-100 flex items-center justify-center text-stone-700 hover:text-rose-700 transition-colors"
                    title="Twitter"
                  >
                    <FaTwitter className="text-xs" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About