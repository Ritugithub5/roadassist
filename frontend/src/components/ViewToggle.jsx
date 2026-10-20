import { FaTh, FaList } from 'react-icons/fa'

const ViewToggle = ({ view, onChange }) => {
  return (
    <div className="inline-flex items-center bg-white border border-ink-200 rounded-xl p-1">
      <button
        onClick={() => onChange('grid')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
          view === 'grid'
            ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm'
            : 'text-ink-600 hover:text-ink-900'
        }`}
      >
        <FaTh className="text-[10px]" /> Grid
      </button>
      <button
        onClick={() => onChange('list')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
          view === 'list'
            ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm'
            : 'text-ink-600 hover:text-ink-900'
        }`}
      >
        <FaList className="text-[10px]" /> List
      </button>
    </div>
  )
}

export default ViewToggle