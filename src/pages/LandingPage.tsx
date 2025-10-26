import Hero from "../components/Hero";
import { Ticket, Bell, ListFilter } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* wavy SVG */}
      <div className="absolute top-0 left-0 w-full overflow-hidden z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="text-blue-50"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>
      
      <div className="relative z-10">
        <Hero />
      </div>

      <section className="relative py-20 pt-10 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-linear-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-linear-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-br from-green-400/5 to-blue-400/5 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose ZenFlow?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to manage support tickets effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Ticket Management",
                description:
                  "Create, update, and track tickets with our intuitive interface.",
                icon: (
                  <Ticket className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                ),
              },
              {
                title: "Real-time Updates",
                description:
                  "Get instant notifications on ticket status changes and updates.",
                icon: (
                  <Bell className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                ),
              },
              {
                title: "Priority Management",
                description:
                  "Organize tickets by priority and status for better workflow.",
                icon: (
                  <ListFilter
                    className="w-8 h-8 text-blue-600"
                    strokeWidth={1.5}
                  />
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;