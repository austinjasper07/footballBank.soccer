// 'use client';

// export default function BlogSearch({ value, onChange }) {
//   return (
//     <div className="relative">
//       <input
//         type="text"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full lg:w-64 px-4 py-2 pl-10 border border-gray-200 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent transition-all"
//         placeholder="Search..."
//       />
//       <svg 
//         className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
//         fill="none" 
//         stroke="currentColor" 
//         viewBox="0 0 24 24"
//       >
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//       </svg>
//     </div>
//   );
// }

'use client';
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BlogSearch({
  value = "",
  onChange = () => {},
  onSubmit = () => {},
  debounceMs = 300,
  queryKey = "q",
  updateUrl = false, // set true if you want the component to update the URL query param
}) {
  const [input, setInput] = useState(value ?? "");
  const timerRef = useRef(null);
  const mountedRef = useRef(false);
  const router = updateUrl ? useRouter() : null;
  const searchParams = updateUrl ? useSearchParams() : null;

  // sync local state when parent updates value
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      setInput(value ?? "");
      return;
    }
    setInput(value ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const flushChange = (val) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onChange(val);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      onChange(val);
    }, debounceMs);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      flushChange(input);
      onSubmit(input);
      if (updateUrl && router && searchParams) {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        if (input) params.set(queryKey, input);
        else params.delete(queryKey);
        router.push(`${typeof window !== "undefined" ? window.location.pathname : "/"}?${params.toString()}`);
      }
    }
  };

  const handleClear = () => {
    setInput("");
    flushChange("");
    onSubmit("");
    if (updateUrl && router && searchParams) {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.delete(queryKey);
      router.push(`${typeof window !== "undefined" ? window.location.pathname : "/"}?${params.toString()}`);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full lg:w-64 px-4 py-2 pl-10 border border-gray-200 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-red focus:border-transparent transition-all"
        placeholder="Search..."
        aria-label="Search posts"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      {input ? (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          type="button"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}