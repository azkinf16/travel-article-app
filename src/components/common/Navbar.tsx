import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import Logout from "@/components/auth/Logout";

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          Travel App
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <span className="text-white">Welcome, {user.username}</span>
              <Link to="/articles" className="text-white hover:text-gray-200">
                Articles
              </Link>
              <Logout />
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-200">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-gray-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
