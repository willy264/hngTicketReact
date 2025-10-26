import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { mockTicketsApi, setCurrentUser } from "../lib/utils";
import { toast } from "sonner";

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setError("No user logged in");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        setCurrentUser(user.id);
        
        const ticketStats = await mockTicketsApi.getStats();
        setStats(ticketStats);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load statistics";
        setError(errorMessage);
        
        if (error instanceof Error && error.message === "No user logged in") {
          toast.error("Your session has expired — please log in again.");
        } else {
          toast.error("Failed to load dashboard statistics. Please retry.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name || "User"}!</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-6 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold mb-4">Total Tickets</h2>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <div className="p-6 bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold mb-4">Open Tickets</h2>
          <p className="text-4xl font-bold">{stats.open}</p>
        </div>
        <div className="p-6 bg-linear-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold mb-4">In Progress</h2>
          <p className="text-4xl font-bold">{stats.inProgress}</p>
        </div>
        <div className="p-6 bg-linear-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg text-white transform hover:scale-105 transition-transform">
          <h2 className="text-xl font-semibold mb-4">Closed Tickets</h2>
          <p className="text-4xl font-bold">{stats.closed}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <Link to="/tickets">
          <Button>Manage Tickets</Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;