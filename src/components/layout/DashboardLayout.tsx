import Header from "../modules/header/Header";
import Footer from "../layout/FooterLayaout"; 
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#DBEAFE] flex flex-col">
            <Toaster position="top-center" reverseOrder={false} />
            <Header />
            
            <main className="flex-grow">
                <div className="max-w-5xl mt-6 md:mt-12 pb-3 md:pb-8 mx-5 lg:mx-auto">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
