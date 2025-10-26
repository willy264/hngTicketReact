import Footer from "../Footer";
import { Outlet } from "react-router-dom";

const LandingLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
