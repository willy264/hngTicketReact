import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Zap, FolderKanban } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import { useAuth } from "../hooks/useAuth";
import { mockAuthApi } from "../lib/utils";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const user = await mockAuthApi.login(email, password);
      login(user);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: ShieldCheck, text: "Secure authentication" },
    { icon: Zap, text: "Real-time updates" },
    { icon: FolderKanban, text: "Organized ticket management" },
  ];

  return (
    <div className="min-h-screen flex w-full">
      <div className="hidden lg:flex lg:w-1/2 justify-center relative bg-blue-600 p-12">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-blue-800">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center max-w-md">
          <h1 className="text-5xl font-bold text-white mb-8">Welcome Back!</h1>
          <p className="text-xl text-blue-100">
            Sign in to your account to manage tickets and track support requests.
          </p>
          <div className="mt-12 space-y-8">
            {features.map(({ icon: Icon, text }, idx) => (
              <div key={idx} className="flex items-center space-x-4 text-blue-100">
                <Icon className="w-6 h-6" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-600">Sign in to continue to your dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700">Email address</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="mt-1 block w-full"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="mt-1 block w-full"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full py-3 px-4">
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;