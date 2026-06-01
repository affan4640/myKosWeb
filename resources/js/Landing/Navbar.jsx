import React, { useState, useEffect } from "react";
import {
    Menu,
    X,
    LogOut,
    User,
    ChevronDown,
    LayoutDashboard,
    Home,
    Info,
    Image,
    Phone,
    UserCircle,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { Link, usePage } from "@inertiajs/react";
import LoginModal from "./LoginModal";

const Navbar = () => {
    const { auth } = usePage().props;

    const isAdmin = auth?.user?.role === "admin";
    const isOwner = auth?.user?.role === "owner";

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [openLogin, setOpenLogin] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);

    const navItems = [
        { href: "#Home", label: "Home", icon: Home },
        { href: "#About", label: "About", icon: Info },
        { href: "#Showcase", label: "Showcase", icon: Image },
        { href: "#Contact", label: "Contact", icon: Phone },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            let current = "Home";

            navItems.forEach((item) => {
                const el = document.querySelector(item.href);
                if (!el) return;

                const rect = el.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    current = item.href.replace("#", "");
                }
            });

            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();

        const el = document.querySelector(href);

        if (el) {
            window.scrollTo({
                top: el.offsetTop - 80,
                behavior: "smooth",
            });
        }

        setIsOpen(false);
        setOpenProfile(false);
    };

    const closeMobileMenu = () => {
        setIsOpen(false);
        setOpenProfile(false);
    };

    return (
        <>
            <nav
                className={`
                    fixed top-0 left-0 w-full z-50
                    transition-all duration-500
                    ${
                        isOpen
                            ? "bg-[#ECF4E8]"
                            : scrolled
                              ? "bg-[#ECF4E8]/85 backdrop-blur-xl shadow-sm border-b border-white/40"
                              : "bg-transparent"
                    }
                `}
            >
                <div className="mx-auto px-4 sm:px-6 lg:px-[10%]">
                    <div className="flex items-center justify-between h-16">
                        {/* LOGO */}
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="flex items-center gap-2 group"
                        >
                            <img
                                src={logo}
                                alt="MyKost"
                                className="w-10 h-10 object-contain"
                            />

                            <span className="font-bold text-lg bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] bg-clip-text text-transparent">
                                MyKost
                            </span>
                        </a>

                        {/* DESKTOP */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => {
                                const active =
                                    activeSection === item.href.substring(1);

                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={(e) =>
                                            scrollToSection(e, item.href)
                                        }
                                        className="relative text-sm group"
                                    >
                                        <span
                                            className={`transition ${
                                                active
                                                    ? "text-[#2f3e46] font-semibold"
                                                    : "text-gray-600 group-hover:text-[#2f3e46]"
                                            }`}
                                        >
                                            {item.label}
                                        </span>

                                        <span
                                            className={`absolute left-0 -bottom-1 h-[2px] w-full bg-[#ABE7B2] transition-transform origin-left ${
                                                active
                                                    ? "scale-x-100"
                                                    : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                        />
                                    </a>
                                );
                            })}

                            {!auth?.user ? (
                                <button
                                    onClick={() => setOpenLogin(true)}
                                    className="
                                        px-4 py-2 rounded-xl
                                        bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2]
                                        text-white text-sm font-medium
                                        shadow-sm hover:opacity-90
                                        transition
                                    "
                                >
                                    Sign in
                                </button>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setOpenProfile(!openProfile)
                                        }
                                        className="
                                            flex items-center gap-3
                                            px-3 py-2 rounded-xl
                                            hover:bg-white/50
                                            transition
                                        "
                                    >
                                        <div
                                            className="
                                                w-8 h-8 rounded-full
                                                bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2]
                                                flex items-center justify-center
                                                text-white text-sm font-bold
                                            "
                                        >
                                            {auth.user.name?.charAt(0)}
                                        </div>

                                        <span className="text-sm text-[#2f3e46] font-medium max-w-[120px] truncate">
                                            {auth.user.name}
                                        </span>

                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    </button>

                                    {openProfile && (
                                        <div
                                            className="
                                                absolute right-0 mt-2 w-56
                                                bg-white rounded-2xl shadow-xl
                                                border border-gray-100
                                                overflow-hidden z-50
                                            "
                                        >
                                            <div className="px-4 py-3 border-b bg-gray-50">
                                                <p className="text-sm font-semibold text-gray-800 truncate">
                                                    {auth.user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {auth.user.email}
                                                </p>
                                            </div>

                                            {isAdmin && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    Dashboard Admin
                                                </Link>
                                            )}

                                            {isOwner && (
                                                <Link
                                                    href="/owner/dashboard"
                                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50"
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    Dashboard Owner
                                                </Link>
                                            )}

                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>

                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* MOBILE TOGGLE */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="
                                md:hidden
                                w-10 h-10 rounded-xl
                                flex items-center justify-center
                                bg-white/60
                                border border-[#ABE7B2]/40
                                text-[#2f3e46]
                                active:scale-95
                                transition
                            "
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div
                    className={`
                        md:hidden
                        fixed left-0 right-0 top-16 bottom-0
                        bg-black/30 backdrop-blur-sm
                        transition-all duration-300
                        ${
                            isOpen
                                ? "opacity-100 visible"
                                : "opacity-0 invisible pointer-events-none"
                        }
                    `}
                    onClick={closeMobileMenu}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`
                            mx-4 mt-3
                            rounded-3xl
                            bg-[#ECF4E8]
                            border border-white/70
                            shadow-2xl
                            overflow-hidden
                            transition-all duration-300
                            ${
                                isOpen
                                    ? "translate-y-0 opacity-100"
                                    : "-translate-y-4 opacity-0"
                            }
                        `}
                    >
                        {/* USER / AUTH HEADER */}
                        <div className="p-4 border-b border-[#ABE7B2]/30">
                            {auth?.user ? (
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            w-12 h-12 rounded-2xl
                                            bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2]
                                            flex items-center justify-center
                                            text-white font-bold
                                            shadow-sm
                                        "
                                    >
                                        {auth.user.name?.charAt(0)}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#2f3e46] truncate">
                                            {auth.user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-semibold text-[#2f3e46]">
                                        Selamat datang di MyKost
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Masuk untuk menyimpan wishlist dan
                                        booking kos.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* NAV ITEMS */}
                        <div className="p-3 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active =
                                    activeSection === item.href.substring(1);

                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={(e) =>
                                            scrollToSection(e, item.href)
                                        }
                                        className={`
                                            flex items-center gap-3
                                            px-4 py-3 rounded-2xl
                                            text-sm font-medium
                                            transition
                                            ${
                                                active
                                                    ? "bg-white text-[#2f3e46] shadow-sm"
                                                    : "text-gray-600 hover:bg-white/60 hover:text-[#2f3e46]"
                                            }
                                        `}
                                    >
                                        <div
                                            className={`
                                                w-9 h-9 rounded-xl
                                                flex items-center justify-center
                                                ${
                                                    active
                                                        ? "bg-[#ABE7B2]/40"
                                                        : "bg-white/60"
                                                }
                                            `}
                                        >
                                            <Icon className="w-4 h-4 text-[#93BFC7]" />
                                        </div>

                                        <span>{item.label}</span>
                                    </a>
                                );
                            })}
                        </div>

                        {/* AUTH ACTIONS */}
                        <div className="p-3 border-t border-[#ABE7B2]/30">
                            {!auth?.user ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setOpenLogin(true);
                                    }}
                                    className="
                                        w-full
                                        flex items-center justify-center gap-2
                                        py-3 rounded-2xl
                                        bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2]
                                        text-white text-sm font-semibold
                                        shadow-sm
                                        active:scale-[0.98]
                                        transition
                                    "
                                >
                                    <UserCircle className="w-4 h-4" />
                                    Masuk Sekarang
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    {isAdmin && (
                                        <Link
                                            href="/admin/dashboard"
                                            onClick={closeMobileMenu}
                                            className="
                                                flex items-center justify-center gap-2
                                                w-full py-3 rounded-2xl
                                                bg-indigo-50 text-indigo-600
                                                text-sm font-semibold
                                            "
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard Admin
                                        </Link>
                                    )}

                                    {isOwner && (
                                        <Link
                                            href="/owner/dashboard"
                                            onClick={closeMobileMenu}
                                            className="
                                                flex items-center justify-center gap-2
                                                w-full py-3 rounded-2xl
                                                bg-indigo-50 text-indigo-600
                                                text-sm font-semibold
                                            "
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard Owner
                                        </Link>
                                    )}

                                    <Link
                                        href="/profile"
                                        onClick={closeMobileMenu}
                                        className="
                                            flex items-center justify-center gap-2
                                            w-full py-3 rounded-2xl
                                            bg-white text-[#2f3e46]
                                            text-sm font-semibold
                                            border border-[#ABE7B2]/40
                                        "
                                    >
                                        <User className="w-4 h-4" />
                                        Profile
                                    </Link>

                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="
                                            flex items-center justify-center gap-2
                                            w-full py-3 rounded-2xl
                                            bg-red-50 text-red-500
                                            text-sm font-semibold
                                            border border-red-100
                                        "
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <LoginModal open={openLogin} setOpen={setOpenLogin} />
        </>
    );
};

export default Navbar;