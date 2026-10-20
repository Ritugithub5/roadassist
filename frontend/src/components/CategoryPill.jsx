const CategoryPill = ({ category, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
        active
          ? 'bg-orange-500 text-white border-orange-500'
          : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400'
      }`}
    >
      <span>{category.icon}</span>
      {category.label}
    </button>
  )
}

export default CategoryPill