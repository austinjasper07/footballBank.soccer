'use client';

export default function BlogSearch({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-1/4 px-4 py-3 border border-divider rounded-lg mb-6 text-primary-text"
      placeholder="Search blog titles..."
    />
  );
}
