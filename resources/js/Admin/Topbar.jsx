import { Menu, Search, Bell } from "lucide-react";

export default function Topbar({ setOpen }) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b0b1a]">

            {/* LEFT */}
            <div className="flex items-center gap-4">
                {/* MOBILE MENU */}
                <button
                    onClick={() => setOpen(true)}
                    className="md:hidden text-gray-400 hover:text-white transition"
                >
                    <Menu />
                </button>

                {/* TITLE */}
                <h1 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                    Dashboard
                </h1>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                {/* SEARCH */}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-56 pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/30 transition"
                    />
                </div>

                {/* NOTIFICATION */}
                <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
                    <Bell className="w-5 h-5 text-gray-400" />

                    {/* DOT */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* USER */}
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center text-sm font-bold">
                        A
                    </div>

                    <div className="hidden md:block">
                        <p className="text-sm font-medium">Affan</p>
                        <p className="text-xs text-gray-400">Admin</p>
                    </div>
                </div>

            </div>
        </div>
    );
}