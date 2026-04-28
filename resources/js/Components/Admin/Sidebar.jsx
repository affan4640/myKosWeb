import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Home,
    ClipboardList,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, usePage } from "@inertiajs/react";

const menuSections = [
    {
        title: "MAIN",
        items: [
            { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
        ],
    },
    {
        title: "MANAGEMENT",
        items: [
            { name: "Users", icon: Users, href: "/admin/users" },
            { name: "Kos", icon: Home, href: "/admin/kos" },
            { name: "Booking", icon: ClipboardList, href: "/admin/booking" },
        ],
    },
    {
        title: "SYSTEM",
        items: [
            { name: "Settings", icon: Settings, href: "/admin/settings" },
        ],
    },
];

export default function Sidebar() {
    const { url } = usePage();

    return (
        <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            className="w-64 h-screen bg-[#0b0b1a] border-r border-white/10 flex flex-col"
        >
            {/* LOGO */}
            <div className="p-6 text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MyKost Admin
            </div>

            {/* MENU */}
            <div className="flex-1 px-4 space-y-6 overflow-y-auto">
                {menuSections.map((section, i) => (
                    <div key={i}>
                        <p className="text-xs text-gray-500 px-2 mb-2">
                            {section.title}
                        </p>

                        {section.items.map((item, j) => {
                            const Icon = item.icon;
                            const isActive = url.startsWith(item.href);

                            return (
                                <Link
                                    key={j}
                                    href={item.href}
                                    preserveState
                                    preserveScroll
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
                                    ${
                                        isActive
                                            ? "bg-primary/20 text-white"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* LOGOUT */}
            <div className="p-4 border-t border-white/10">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Link>
            </div>
        </motion.aside>
    );
}