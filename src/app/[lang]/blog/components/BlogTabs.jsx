'use client';



export default function BlogTabs({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`${
            cat === active
              ? 'bg-accent-red text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } px-4 py-2 rounded text-sm font-medium transition-colors`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
