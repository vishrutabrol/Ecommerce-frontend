import React from "react";
import Navbar from '../components/Navbar/Navbar';
import Footer from "../components/Footer/Footer";



const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="dashboard-layout flex flex-col min-h-screen w-screen overflow-x-hidden">
            {/* <header>My Portfolio</header> */}
            <header className="w-full">
                <Navbar></Navbar>
                
            </header>
            <main className="w-screen flex-1">
                {children}
            </main>
            <footer className="text-center w-full">
                <Footer />
            </footer>
        </div>
    )
}
export default DashboardLayout