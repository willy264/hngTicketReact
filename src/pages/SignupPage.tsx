import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Fingerprint, Clock, Sparkles } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import { useAuth } from "../hooks/useAuth";
import { mockAuthApi } from "../lib/utils";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const user = await mockAuthApi.signup(name, email, password);
      login(user);
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const features = [
    { icon: Fingerprint, text: "Secure account creation" },
    { icon: Clock, text: "Quick setup process" },
    { icon: Sparkles, text: "Customizable experience" },
  ];

  return (
    <div className="min-h-screen flex flex-row-reverse w-full">
      {/* Left Pattern Section */}
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
          <h1 className="text-5xl font-bold text-white mb-8">Create Account</h1>
          <p className="text-xl text-blue-100">
            Join our platform and start managing your support tickets efficiently.
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

      {/* Right Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
            <p className="mt-2 text-gray-600">Start managing your support tickets today</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700">Full name</Label>
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700">Email address</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;