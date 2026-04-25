import { LayoutDashboard, Users, Settings, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const menus = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Users", icon: Users },
    { name: "Settings", icon: Settings },
];

export default function Sidebar({ open, setOpen }) {
    const [active, setActive] = useState("Dashboard");

    return (
        <AnimatePresence>
            {(open || window.innerWidth >= 768) && (
                <motion.div
                    initial={{ x: -260 }}
                    animate={{ x: 0 }}
                    exit={{ x: -260 }}
                    transition={{ duration: 0.3 }}
                    className="fixed md:relative z-50 w-64 h-fullscreen bg-[#0f0f2a] border-r border-white/10 flex flex-col"
                >
                    <div className="p-6 flex items-center justify-between">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                            MyKost Admin
                        </h1>

                        <button
                            className="md:hidden text-gray-400 hover:text-white"
                            onClick={() => setOpen(false)}
                        >
                            <X />
                        </button>
                    </div>

                    <div className="flex-1 px-4 space-y-2">
                        {menus.map((menu, i) => {
                            const Icon = menu.icon;
                            const isActive = active === menu.name;

                            return (
                                <div
                                    key={i}
                                    onClick={() => setActive(menu.name)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group
                                    ${
                                        isActive
                                            ? "bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 text-white"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <Icon
                                        className={`w-5 h-5 transition ${
                                            isActive
                                                ? "text-indigo-400"
                                                : "group-hover:text-white"
                                        }`}
                                    />
                                    <span className="text-sm font-medium">
                                        {menu.name}
                                    </span>

                                    {isActive && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-white/10">
                        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition">
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}