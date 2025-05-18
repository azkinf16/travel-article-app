import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Logout from "@/components/auth/Logout";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / App Title */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow-lg"
        >
          Travel App
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium">{user.username}</span>
              </div>
              <Logout className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors" />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-white font-semibold hover:bg-white/10 hover:text-blue-100 transition-colors shadow-sm"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-8 h-8" />
          ) : (
            <Menu className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-gradient-to-b from-blue-600 to-indigo-700 px-4 pb-4 pt-2 shadow-lg animate-fade-in-down rounded-b-2xl">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium">{user.username}</span>
              </div>
              <Logout
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/10 hover:text-blue-100 transition-colors shadow"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/10 hover:text-blue-100 transition-colors shadow"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
