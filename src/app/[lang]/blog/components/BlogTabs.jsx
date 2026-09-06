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
              ? 'bg-primary-action text-primary-text-inverse'
              : 'bg-secondary-bg-alt text-primary-text hover:bg-primary-action/10'
          } px-4 py-2 rounded text-sm font-medium transition-colors`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
