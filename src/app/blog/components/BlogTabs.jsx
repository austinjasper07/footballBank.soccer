'use client';



export default function BlogTabs({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`${
            cat === active
              ? 'bg-accent-red text-white'
              : 'bg-primary-white border border-divider text-primary-text hover:text-accent-red hover:border-accent-red'
          } px-4 py-2 rounded-full text-sm font-medium transition-colors`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
