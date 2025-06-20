import Header from "../modules/header/Header";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#DBEAFE]">
            <Header />
            <div className="max-w-5xl mt-6 md:mt-12 pb-3 md:pb-8 mx-5 lg:mx-auto min-h-screen">
                <div >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
