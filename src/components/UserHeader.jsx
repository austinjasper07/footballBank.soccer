import { useAuth } from "@/context/NewAuthContext";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";

export function UserHeader({slug, href}) {
  const { role, isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isAdmin = role === "admin";
  const isPlayer = role === "player";
  const isEditor = role === "editor";

  if (!isAuthenticated || !user) return null;

  const toggleDropdown = () => setOpen((prev) => !prev);
  const closeDropdown = () => setOpen(false);

  const getDashboardLink = () => {
    if (isAdmin) return "/admin";
    if (isPlayer) return "/player-profile";
    if (isEditor) return "/editor";
    return "/profile";
  };

  const getDashboardLabel = () => {
    if (isAdmin) return "Admin Dashboard";
    if (isPlayer) return "Player Profile";
    if (isEditor) return "Editor Dashboard";
    return "My Profile";
  };

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
            {/* Home Link */}
            <Link
              href="/"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={closeDropdown}
            >
              Home
            </Link>
            
            {/* Profile Link */}
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={closeDropdown}
            >
              My Profile
            </Link>
            
            {/* Admin Dashboard Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={closeDropdown}
              >
                Admin Dashboard
              </Link>
            )}
            
            {/* Editor Dashboard Link */}
            {isEditor && (
              <Link
                href="/editor"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={closeDropdown}
              >
                Editor Dashboard
              </Link>
            )}
            
            {/* Admin can access Editor Dashboard */}
            {isAdmin && (
              <Link
                href="/editor"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={closeDropdown}
              >
                Editor Dashboard
              </Link>
            )}
            
            <button
              onClick={async () => {
                closeDropdown();
                await logout(true);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
