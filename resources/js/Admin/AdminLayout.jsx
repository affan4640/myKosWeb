import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout({ children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0b0b1a] text-white">
            <Sidebar open={open} setOpen={setOpen} />

            <div className="flex-1 flex flex-col">
                <Topbar setOpen={setOpen} />

                <main className="p-6 md:p-10">{children}</main>
            </div>
        </div>
    );
}