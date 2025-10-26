import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xl font-bold text-gray-900">ZenFlow</span>
          </Link>

          <nav className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-6">
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/tickets"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Tickets
                </Link>
                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      {user.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                  <Button
                    onClick={logout}
                    className="bg-white text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-300"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="flex items-center space-x-4">
                <li>
                  <Link to="/auth/login">
                    <Button
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-blue-600"
                    >
                      Login
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/auth/signup">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      Get Started
                    </Button>
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
