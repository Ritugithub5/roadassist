import { useState, useRef } from 'react'
import {
  FaShieldAlt, FaArrowRight, FaCheck, FaStar,
  FaFileAlt, FaClock, FaHeadset,
} from 'react-icons/fa'
import InsuranceCard from '../components/InsuranceCard'
import QuoteForm from '../components/QuoteForm'
import FAQAccordion from '../components/FAQAccordion'
import { partners, plans, faqs } from '../data/insurance'

const Insurance = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const formRef = useRef(null)

  const scrollToForm = (planId) => {
    setSelectedPlan(planId)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* ============ HERO ============ */}
      <section className="relative pt-28 pb-16 px-6 bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(180,120,60,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-5">
              <FaShieldAlt className="text-amber-700 text-xs" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-amber-800">
                Insurance
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-warm-900">
              Protect your car,{' '}
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                zero paperwork.
              </span>
            </h1>

            <p className="text-base text-warm-700 mb-6 max-w-lg">
              Compare 10+ insurers. Best price. Instant digital policy.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollToForm('any')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Get Free Quote <FaArrowRight className="text-xs" />
              </button>
              <button
                onClick={() => document.getElementById('partners')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-amber-200 text-warm-800 text-sm font-semibold hover:border-amber-400 hover:bg-amber-50 transition-all"
              >
                Compare Insurers
              </button>
            </div>
          </div>

          {/* Live Claims card */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-xl shadow-amber-900/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                  <FaShieldAlt className="text-sm" />
                </div>
                <div>
                  <p className="text-[10px] text-warm-700 uppercase tracking-wider">Live Claims</p>
                  <p className="font-display font-bold text-warm-900 text-sm">Settled Today</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Rohit S.', amount: '₹42,800', status: 'Settled' },
                  { name: 'Priya M.', amount: '₹28,400', status: 'Processing' },
                  { name: 'Anil K.', amount: '₹61,200', status: 'Settled' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-cream-50 border border-cream-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">
                        {c.name[0]}
                      </div>
                      <span className="text-xs text-warm-800 font-medium">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-warm-900">{c.amount}</p>
                      <p className={`text-[9px] font-semibold ${
                        c.status === 'Settled' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {c.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PARTNERS ============ */}
      <section className="py-14 px-6" id="partners">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wider uppercase mb-3">
              Top Insurance Partners
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-3">
              Compare. Choose. Save.
            </h2>
            <p className="text-warm-700 text-sm">
              All plans include free roadside assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map((p) => (
              <InsuranceCard
                key={p.id}
                partner={p}
                onGetQuote={(partner) => scrollToForm(partner.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY BUY + FORM ============ */}
      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wider uppercase mb-3">
              Why RoadAssist
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-warm-900 mb-3">
              Smart insurance,{' '}
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                made simple.
              </span>
            </h2>
            <p className="text-warm-700 text-sm mb-6">
              Your insurance partner from quote to claim.
            </p>

            <div className="space-y-4">
              {[
                { icon: <FaStar />, title: 'Best Price Guarantee', desc: 'We match or beat any quote — guaranteed.' },
                { icon: <FaFileAlt />, title: 'Zero Paperwork', desc: 'Digital policy in under 5 minutes.' },
                { icon: <FaHeadset />, title: '24/7 Claim Support', desc: 'We handle claims end-to-end.' },
                { icon: <FaClock />, title: 'Instant Renewal', desc: 'Switch insurers in seconds.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-amber-500/30">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-warm-900 text-sm mb-0.5">{item.title}</h4>
                    <p className="text-xs text-warm-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={formRef} id="quote-form">
            <QuoteForm preselectedPlan={selectedPlan} />
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold tracking-wider uppercase mb-3">
              FAQ
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-warm-900">
              Questions?{' '}
              <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                Answered.
              </span>
            </h2>
          </div>

          <FAQAccordion faqs={faqs} />
        </div>
      </section>
    </div>
  )
}

export default Insurance