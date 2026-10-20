import { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div
            key={i}
            className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen ? 'border-brand-300 shadow-lg shadow-brand-500/5' : 'border-ink-100'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left"
            >
              <span
                className={`font-semibold transition-colors ${
                  isOpen ? 'text-brand-600' : 'text-ink-900'
                }`}
              >
                {faq.q}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isOpen
                    ? 'bg-brand-500 text-white rotate-180'
                    : 'bg-ink-100 text-ink-500'
                }`}
              >
                <FaChevronDown className="text-xs" />
              </div>
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <p className="px-5 pb-5 text-sm text-ink-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default FAQAccordion