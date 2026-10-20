import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaShieldAlt, FaChevronDown, FaPhone,
  FaEnvelope, FaWhatsapp, FaCarCrash, FaTools, FaTruckPickup,
  FaCarBattery, FaCreditCard, FaFileAlt, FaWrench, FaBullhorn,
  FaHeadset, FaUserShield, FaExclamationTriangle, FaTimes,
} from 'react-icons/fa'
import { MdOutlineTireRepair } from 'react-icons/md'

const Help = () => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sosOpen, setSosOpen] = useState(false)

  // ============ CONFIG — REPLACE WITH REAL NUMBERS ============
  const CONTACT = {
    emergencyPhone: '+911800123456',      // for SOS
    supportPhone: '+911800123456',         // for Call Us card
    supportPhoneDisplay: '1800-123-4567',  // for display
    whatsapp: '919876543210',              // WhatsApp number (no +)
    whatsappDisplay: '+91 98765 43210',    // for display
    email: 'help@roadassist.in',           // email
  }

  // ============ HELP TOPICS ============
  const helpTopics = [
    {
      id: 'breakdown',
      icon: <FaTools />,
      label: 'Breakdown Repair',
      color: 'from-amber-500 to-orange-500',
      questions: [
        { q: 'How long does a breakdown repair take?', a: 'Most on-site repairs (battery, tire, minor engine issues) are completed within 30-60 minutes. Major repairs may require towing to a garage.' },
        { q: "What if my issue can't be fixed on-site?", a: 'If the mechanic determines the issue requires a workshop, you can upgrade to towing within the app. The mechanic will help arrange it.' },
      ],
    },
    {
      id: 'towing',
      icon: <FaTruckPickup />,
      label: 'Towing',
      color: 'from-blue-500 to-indigo-600',
      questions: [
        { q: 'How far can you tow my vehicle?', a: 'Standard towing covers up to 30 km to any garage of your choice. Additional distance is billed at ₹25/km.' },
        { q: 'Is my vehicle insured during towing?', a: 'Yes. All our towing partners carry transit insurance up to ₹50,000 per job. Claims can be filed from the app.' },
      ],
    },
    {
      id: 'battery',
      icon: <FaCarBattery />,
      label: 'Battery',
      color: 'from-emerald-500 to-emerald-600',
      questions: [
        { q: 'How long does a jump-start take?', a: 'Typical arrival time is 15-20 minutes. The jump-start itself takes 5-10 minutes.' },
        { q: 'What if my battery is completely dead?', a: 'Our partners carry replacement batteries. If needed, they can install a new one on-site (extra cost).' },
      ],
    },
    {
      id: 'payment',
      icon: <FaCreditCard />,
      label: 'Payments',
      color: 'from-purple-500 to-purple-600',
      questions: [
        { q: 'What payment methods do you accept?', a: 'UPI, credit/debit cards, net banking, and cash (for select partners). All digital payments are encrypted.' },
        { q: 'Can I get a refund if I cancel?', a: 'Yes. Cancellations before the mechanic arrives get a 100% refund within 3-5 business days. Cancellations after arrival incur a 30% fee.' },
        { q: 'How do I download my invoice?', a: 'Go to your Service History, open the job, and tap "Download Invoice". A PDF is generated instantly.' },
      ],
    },
    {
      id: 'account',
      icon: <FaUserShield />,
      label: 'Account & Login',
      color: 'from-amber-500 to-orange-500',
      questions: [
        { q: 'How do I reset my password?', a: "Click 'Forgot password' on the login page. We'll send a reset link to your registered email within 2 minutes." },
        { q: 'Can I delete my account?', a: 'Yes. Go to Profile → Settings → Delete Account. Your data is wiped within 7 days as per our privacy policy.' },
      ],
    },
    {
      id: 'partners',
      icon: <FaWrench />,
      label: 'Partners',
      color: 'from-emerald-500 to-teal-600',
      questions: [
        { q: 'How do you verify mechanics?', a: 'We require government ID, address proof, professional certification, and a background check. Only 1 in 4 applicants are approved.' },
        { q: 'What if a mechanic behaves unprofessionally?', a: 'Report immediately from the job screen. We investigate within 24 hours and can suspend or ban the partner.' },
      ],
    },
  ]

  const filteredTopics = activeCategory === 'all'
    ? helpTopics
    : helpTopics.filter((t) => t.id === activeCategory)

  return (
    <div className="min-h-screen bg-cream-50">
      {/* ================= HERO ================= */}
      <section className="relative pt-28 pb-16 px-6 bg-gradient-to-br from-ink-900 via-ink-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-20 -left-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
            <FaHeadset className="text-brand-400 text-xs" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-400">
              Help & Safety Center
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            How can we <span className="gradient-text">help you today?</span>
          </h1>

          <p className="text-lg text-ink-300 max-w-2xl mx-auto mb-8">
            Find answers, safety guidelines, and direct support — all in one place.
          </p>

          {/* Quick contact row in hero */}
          <div className="flex flex-wrap justify-center gap-2">
            <a
              href={`tel:${CONTACT.emergencyPhone}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all"
            >
              <FaPhone className="text-emerald-400" /> Call Support
            </a>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=Hi%2C%20I%20need%20help%20with%20RoadAssist`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all"
            >
              <FaWhatsapp className="text-green-400" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ================= SAFETY SECTION ================= */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold tracking-widest uppercase mb-3 border border-red-200">
              🛡️ Safety First
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-2">
              Your safety is{' '}
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                non-negotiable.
              </span>
            </h2>
            <p className="text-sm text-warm-700">
              Built into every feature.
            </p>
          </div>

          {/* Protocol cards — 6 cards, one-line descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              { icon: <FaUserShield />, title: 'Verified Partners', desc: 'Background-checked & skill-tested.', color: 'from-emerald-500 to-emerald-600' },
              { icon: <FaShieldAlt />, title: 'Live Tracking', desc: 'Share trip status with family.', color: 'from-blue-500 to-blue-600' },
              { icon: <FaPhone />, title: '24/7 SOS Line', desc: 'One-tap call with GPS location.', color: 'from-red-500 to-red-600' },
              { icon: <FaCreditCard />, title: 'Secure Payments', desc: 'UPI, card, or cash with receipts.', color: 'from-purple-500 to-purple-600' },
              { icon: <FaFileAlt />, title: 'Insured Jobs', desc: 'Covered up to ₹50,000 per service.', color: 'from-amber-500 to-orange-500' },
              { icon: <FaBullhorn />, title: 'Report & Review', desc: 'Rate jobs and report issues.', color: 'from-rose-500 to-pink-500' },
            ].map((p, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-amber-100 hover:border-amber-300 p-5 hover:-translate-y-1 hover:shadow-lg transition-all flex items-start gap-4"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-warm-900 text-sm mb-0.5">{p.title}</h3>
                  <p className="text-xs text-warm-700 leading-snug">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency tips — one-line descriptions */}
          <div className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-100 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <FaExclamationTriangle />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-warm-900">
                  Stranded right now?
                </h3>
                <p className="text-xs text-warm-700">6 quick rules to stay safe</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: '🚗', title: 'Pull off safely', desc: 'Move to shoulder, hazard lights on.' },
                { icon: '🔦', title: 'Stay visible', desc: 'Wear reflective jacket at night.' },
                { icon: '📍', title: 'Share location', desc: 'Send live location to a contact.' },
                { icon: '🔒', title: 'Lock your doors', desc: 'Stay inside with doors locked.' },
                { icon: '⚠️', title: 'Verify the partner', desc: 'Match name, photo, and vehicle.' },
                { icon: '🆘', title: 'Use SOS if needed', desc: 'Control room responds in 60 seconds.' },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-red-100">
                  <div className="text-2xl flex-shrink-0">{t.icon}</div>
                  <div>
                    <p className="font-bold text-warm-900 text-xs mb-0.5">{t.title}</p>
                    <p className="text-[11px] text-warm-700 leading-snug">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= HELP CENTER ================= */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold tracking-widest uppercase mb-3 border border-amber-200">
              Help Center
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-3">
              Frequently asked <span className="gradient-text">questions.</span>
            </h2>
            <p className="text-sm text-warm-700 max-w-2xl mx-auto">
              Browse by topic or read all FAQs below.
            </p>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-500 shadow-md'
                  : 'bg-white text-warm-700 border-cream-200 hover:border-amber-300 hover:text-amber-700'
              }`}
            >
              All Topics
            </button>
            {helpTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveCategory(t.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  activeCategory === t.id
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-500 shadow-md'
                    : 'bg-white text-warm-700 border-cream-200 hover:border-amber-300 hover:text-amber-700'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* FAQ sections */}
          <div className="space-y-8 max-w-3xl mx-auto">
            {filteredTopics.map((topic) => (
              <div key={topic.id}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${topic.color} flex items-center justify-center text-white text-xs`}>
                    {topic.icon}
                  </div>
                  <h3 className="font-display font-bold text-warm-900">{topic.label}</h3>
                </div>

                <div className="space-y-2">
                  {topic.questions.map((f, qi) => {
                    const globalIndex = `${topic.id}-${qi}`
                    const isOpen = openFaq === globalIndex
                    return (
                      <div
                        key={qi}
                        className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                          isOpen ? 'border-amber-300 shadow-lg shadow-amber-500/5' : 'border-cream-200'
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : globalIndex)}
                          className="w-full flex items-center justify-between gap-4 p-4 text-left"
                        >
                          <span className={`font-semibold text-sm ${isOpen ? 'text-amber-700' : 'text-warm-900'}`}>
                            {f.q}
                          </span>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            isOpen ? 'bg-amber-500 text-white rotate-180' : 'bg-cream-100 text-warm-700'
                          }`}>
                            <FaChevronDown className="text-[10px]" />
                          </div>
                        </button>
                        <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                          <p className="px-4 pb-4 text-xs text-warm-700 leading-relaxed">
                            {f.a}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT SUPPORT (REAL LINKS) ================= */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold tracking-widest uppercase mb-3 border border-amber-200">
              Still need help?
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-3">
              Talk to <span className="gradient-text">a human.</span>
            </h2>
            <p className="text-sm text-warm-700 max-w-2xl mx-auto">
              Our support team is available 24/7. Average response time: under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Call Us */}
            <a
              href={`tel:${CONTACT.supportPhone}`}
              className="group bg-white rounded-2xl border border-amber-100 hover:border-amber-300 p-6 hover:-translate-y-1 hover:shadow-xl transition-all text-center cursor-pointer"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform">
                <FaPhone />
              </div>
              <h3 className="font-display font-bold text-warm-900 mb-1">Call Us</h3>
              <p className="text-xs text-warm-700 mb-3">Toll-free 24/7 support</p>
              <p className="text-sm font-bold text-amber-700">{CONTACT.supportPhoneDisplay}</p>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${CONTACT.whatsapp}?text=Hi%2C%20I%20need%20help%20with%20RoadAssist`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-amber-100 hover:border-amber-300 p-6 hover:-translate-y-1 hover:shadow-xl transition-all text-center cursor-pointer"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform">
                <FaWhatsapp />
              </div>
              <h3 className="font-display font-bold text-warm-900 mb-1">WhatsApp</h3>
              <p className="text-xs text-warm-700 mb-3">Chat with a support agent</p>
              <p className="text-sm font-bold text-amber-700">{CONTACT.whatsappDisplay}</p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${CONTACT.email}?subject=Support Request`}
              className="group bg-white rounded-2xl border border-amber-100 hover:border-amber-300 p-6 hover:-translate-y-1 hover:shadow-xl transition-all text-center cursor-pointer"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl mb-4 shadow-md group-hover:scale-110 transition-transform">
                <FaEnvelope />
              </div>
              <h3 className="font-display font-bold text-warm-900 mb-1">Email</h3>
              <p className="text-xs text-warm-700 mb-3">Reply within 4 hours</p>
              <p className="text-sm font-bold text-amber-700">{CONTACT.email}</p>
            </a>
          </div>

          {/* Emergency block */}
          <div className="mt-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl flex-shrink-0">
                🆘
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-xl font-bold mb-1">Emergency on the road?</h3>
                <p className="text-white/90 text-sm">
                  Don't wait. Tap the SOS button in the app or call our 24/7 emergency line.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {/* Request Help → request wizard */}
                <button
                  onClick={() => navigate('/request-service')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-red-600 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <FaCarCrash /> Request Help
                </button>

                {/* SOS → opens confirm modal */}
                <button
                  onClick={() => setSosOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white font-bold hover:bg-white/30 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  <FaPhone className="animate-pulse" /> SOS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOS CONFIRM MODAL ================= */}
      {sosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSosOpen(false)}
            className="absolute inset-0 bg-red-950/60 backdrop-blur-sm animate-fadeIn"
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slideUp">
            <div className="h-1.5 bg-gradient-to-r from-red-500 to-rose-600" />
            <button
              onClick={() => setSosOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-cream-100 flex items-center justify-center text-warm-700 transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>

            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600 text-3xl mb-4 animate-pulse">
                🆘
              </div>
              <h2 className="font-display text-xl font-bold text-warm-900 mb-2">
                Emergency SOS?
              </h2>
              <p className="text-sm text-warm-700 mb-6">
                This will call our 24/7 emergency control room and share your GPS location.
              </p>

              <div className="space-y-2">
                {/* Call Emergency */}
                <a
                  href={`tel:${CONTACT.emergencyPhone}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-xl transition-all active:scale-95"
                >
                  <FaPhone /> Call Emergency Line
                </a>

                {/* WhatsApp SOS with location prompt */}
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}?text=SOS%21%20I%20need%20immediate%20help.%20My%20location%3A%20`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
                >
                  <FaWhatsapp /> WhatsApp SOS
                </a>

                {/* Cancel */}
                <button
                  onClick={() => setSosOpen(false)}
                  className="w-full py-3 rounded-xl bg-cream-100 text-warm-700 font-semibold hover:bg-cream-200 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-[10px] text-warm-700 mt-4">
                Only use SOS for genuine emergencies.
              </p>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
            .animate-fadeIn { animation: fadeIn 0.2s ease-out }
            .animate-slideUp { animation: slideUp 0.3s ease-out }
          `}</style>
        </div>
      )}
    </div>
  )
}

export default Help