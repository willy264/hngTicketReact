import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <div className="absolute top-50 right-10 w-72 h-72 bg-linear-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-2xl"/>
      
        <div className="absolute -bottom-50 left-40 w-96 h-96 bg-linear-to-br from-pink-600/10 to-orange-600/10 rounded-full blur-2xl"/>
        
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
