import { useState, useEffect } from "react";
import Sidebar from "@/Components/Admin/Sidebar";
import Topbar from "@/Components/Admin/Topbar";

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // close sidebar when resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setSidebarOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex h-screen bg-[#0b0b1a] text-white overflow-hidden">

            {/* OVERLAY MOBILE */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                <Topbar setOpen={setSidebarOpen} />

                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>

            </div>
        </div>
    );
}