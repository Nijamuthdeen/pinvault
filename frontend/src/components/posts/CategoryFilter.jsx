const CATEGORIES = ['All', 'Art', 'Travel', 'Food', 'Fashion', 'Photography', 'Architecture', 'Nature', 'DIY', 'Technology', 'General'];

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-3 sm:px-4 py-3 scrollbar-hide">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat === 'All' ? '' : cat)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            (cat === 'All' && !selected) || selected === cat
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}