import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LogoutProps {
  className?: string;
  onClick?: () => void;
}

export default function Logout({ className, onClick }: LogoutProps) {
  const { clearUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/login");
    onClick?.();
  };

  return (
    <Button onClick={handleLogout} className={className}>
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>Logout</span>
    </Button>
  );
}
