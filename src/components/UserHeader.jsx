import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

export function UserHeader({slug, href}) {
  const { user, isAuthenticated } = useKindeBrowserClient();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated || !user) return null;

  const toggleDropdown = () => setOpen((prev) => !prev);
  const closeDropdown = () => setOpen(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="focus:outline-none flex items-center gap-2"
        aria-label="User menu"
      >
        <FaUser size={20} />
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {open && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
          onMouseLeave={closeDropdown}
        >
          <div className="py-1">
            <Link
              href={href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={closeDropdown}
            >
              {slug}
            </Link>
            <LogoutLink
              onClick={closeDropdown}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </LogoutLink>
          </div>
        </div>
      )}
    </div>
  );
}