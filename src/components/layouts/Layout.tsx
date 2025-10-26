import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <div className="absolute top-10 right-10 w-72 h-72 bg-linear-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-2xl"/>
      
        <div className="absolute -bottom-50 left-40 w-96 h-96 bg-linear-to-br from-pink-600/10 to-orange-600/10 rounded-full blur-2xl"/>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-br from-green-600/5 to-blue-600/5 rounded-full blur-2xl"/>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
