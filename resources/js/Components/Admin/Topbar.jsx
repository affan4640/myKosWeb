import { Menu, Search, Bell, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, usePage, router } from "@inertiajs/react";

export default function Topbar({ setOpen }) {
    const [openProfile, setOpenProfile] = useState(false);

    const { auth } = usePage().props;
    const user = auth.user;

    const { filters } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const currentPath = window.location.pathname;

            if (currentPath.startsWith('/admin')) {
                router.get(
                    currentPath,
                    {search: searchTerm},
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true
                    }
                );
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0b0b1a] sticky top-0 z-40">

            {/* LEFT */}
            <div className="flex items-center gap-4">
                
                {/* MOBILE MENU */}
                <button
                    onClick={() => setOpen(true)}
                    className="md:hidden text-gray-400 hover:text-white transition"
                >
                    <Menu />
                </button>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">

                {/* SEARCH */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="
                            w-60 pl-10 pr-4 py-2 rounded-lg
                            bg-[#12122b]
                            border border-white/5
                            text-sm text-white placeholder-gray-500
                            focus:outline-none focus:border-indigo-500
                            transition
                        "
                    />
                </div>

                {/* NOTIFICATION */}
                <button className="relative p-2 rounded-lg bg-[#12122b] hover:bg-[#1a1a3a] transition">
                    <Bell className="w-5 h-5 text-gray-400" />

                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* PROFILE */}
                <div className="relative">
                    <button
                        onClick={() => setOpenProfile(!openProfile)}
                        className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#12122b] border border-white/5 hover:bg-[#1a1a3a] transition"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center text-sm font-bold capitalize">
                            {user.name.charAt(0)}
                        </div>

                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-white capitalize">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                                {user.role}
                            </p>
                        </div>

                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* DROPDOWN */}
                    <AnimatePresence>
                        {openProfile && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="
                                    absolute right-0 mt-2 w-48
                                    bg-[#12122b]
                                    border border-white/10
                                    rounded-xl shadow-lg
                                    overflow-hidden
                                    z-50
                                "
                            >
                                <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition">
                                    Profile
                                </button>
                                <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition">
                                    Settings
                                </button>
                                <div className="border-t border-white/10"></div>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                                >
                                    Logout
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}