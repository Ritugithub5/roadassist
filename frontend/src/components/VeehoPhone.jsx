import { FaCarCrash, FaCalendarAlt } from 'react-icons/fa'

const VeehoPhone = () => {
  return (
    <div className="relative w-[150px] md:w-[175px] lg:w-[195px]">
      {/* Phone Frame */}
      <div className="relative rounded-[1.8rem] bg-ink-900 p-[4px] shadow-[0_15px_35px_-10px_rgba(15,23,42,0.35)]">
        {/* Screen (tall so bottom gets cut) */}
        <div className="relative rounded-[1.5rem] overflow-hidden bg-white h-[550px]">
          {/* Notch */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-ink-900 rounded-full z-20 flex items-center justify-end pr-2">
            <div className="w-1 h-1 rounded-full bg-ink-700" />
          </div>

          {/* Status bar */}
          <div className="relative pt-7 px-3 flex justify-between items-center text-[8px] text-ink-900 font-semibold">
            <span>9:41</span>
            <div className="flex gap-0.5 items-center">
              <span>●●●</span>
              <span>100%</span>
            </div>
          </div>

          {/* App content */}
          <div className="relative px-3 pt-4">
            {/* Logo */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
                <FaCarCrash className="text-white text-[8px]" />
              </div>
              <span className="font-display font-bold text-[10px] text-ink-900">
                Road<span className="text-brand-600">Assist</span>
              </span>
            </div>

            {/* Track Your Service Card */}
            <div className="bg-white rounded-xl p-3 border border-ink-100 shadow-[0_6px_20px_-8px_rgba(15,23,42,0.15)]">
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center mb-2">
                  <FaCalendarAlt className="text-brand-600 text-[10px]" />
                </div>
                <p className="text-[9px] font-bold text-ink-900 leading-tight">
                  Track Your
                </p>
                <p className="text-[9px] font-bold text-ink-900 leading-tight">
                  Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating shadow under phone */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-ink-900/15 blur-xl rounded-full" />
    </div>
  )
}

export default VeehoPhone