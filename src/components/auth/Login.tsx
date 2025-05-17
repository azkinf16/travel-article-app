import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { login } from "@/lib/api";
import type { LoginForm, AuthResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  identifier: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const { setUser } = useAuthStore();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation<AuthResponse, Error, LoginForm>({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user, data.jwt);
      window.location.href = "/articles";
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-128px)] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              {...formRegister("identifier")}
              className={errors.identifier ? "border-red-500" : ""}
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm">
                {errors.identifier.message}
              </p>
            )}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              {...formRegister("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded cursor-pointer transition-colors"
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>
          {mutation.isError && (
            <p className="text-red-500 text-sm">{mutation.error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
