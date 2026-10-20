import { Link } from 'react-router-dom'
import {
  FaCarCrash, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShieldAlt,
  FaHeart, FaArrowRight, FaApple, FaGooglePlay,
} from 'react-icons/fa'

const Footer = () => {
  const socials = [
    { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaLinkedinIn />, href: '#', label: 'LinkedIn' },
    { icon: <FaYoutube />, href: '#', label: 'YouTube' },
  ]

  const footerLinks = {
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Team', path: '/about#team' },
    ],
    Services: [
      { name: 'Roadside Help', path: '/request-service' },
      { name: 'Store', path: '/store' },
      { name: 'Insurance', path: '/insurance' },
      { name: 'My Garage', path: '/vehicles' },
      { name: 'Service History', path: '/history' },
    ],
    Partners: [
      { name: 'Become a Partner', path: '/mechanics' },
    ],
    Support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/help#contact' },
    ],
  }

  return (
    <footer className="relative bg-warm-900 text-ink-300 overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-6">
        {/* ================= TOP SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column (spans 2) */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <FaCarCrash className="text-white text-lg" />
              </div>
              <span className="font-display text-2xl font-bold text-white">
                Road<span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Assist</span>
              </span>
            </Link>

            <p className="text-sm text-ink-400 leading-relaxed mb-6 max-w-sm">
              India's most trusted roadside assistance platform. Verified mechanics,
              transparent pricing, and real-time tracking — 24/7, anywhere.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-6">
              <a href="tel:18001234567" className="flex items-center gap-3 text-sm text-ink-300 hover:text-amber-400 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-amber-400 text-xs" />
                </div>
                <span>1800-123-4567 (Toll-free)</span>
              </a>
              <a href="mailto:hello@roadassist.in" className="flex items-center gap-3 text-sm text-ink-300 hover:text-amber-400 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-amber-400 text-xs" />
                </div>
                <span>hello@roadassist.in</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-ink-300">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-amber-400 text-xs" />
                </div>
                <span>Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display text-white font-bold text-sm mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2.5 text-sm">
                {links.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.path}
                      className="text-ink-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group"
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer