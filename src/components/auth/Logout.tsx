import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const { clearUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <Button onClick={handleLogout} variant="destructive">
      Logout
    </Button>
  );
}
