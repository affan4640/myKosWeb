import React, { useState, useEffect } from "react";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import logo from "../../assets/logo.png";
import { Link, usePage } from "@inertiajs/react";
import LoginModal from "./LoginModal";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [openLogin, setOpenLogin] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);

    const { auth } = usePage().props;

    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Showcase", label: "Showcase" },
        { href: "#Contact", label: "Contact" },
    ];

    /* ================= SCROLL ================= */
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
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* LOCK SCROLL */
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
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
    };

    return (
        <>
            <nav
                className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                    isOpen
                        ? "bg-[#ECF4E8]"
                        : scrolled
                        ? "bg-[#ECF4E8]/80 backdrop-blur-md shadow-sm"
                        : "bg-transparent"
                }`}
            >
                <div className="mx-auto px-[5%] lg:px-[10%]">
                    <div className="flex items-center justify-between h-16">

                        {/* LOGO */}
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="flex items-center gap-2"
                        >
                            <img src={logo} className="w-10 h-10" />
                            <span className="font-bold bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] bg-clip-text text-transparent">
                                MyKost
                            </span>
                        </a>

                        {/* DESKTOP */}
                        <div className="hidden md:flex items-center gap-8">

                            {/* MENU */}
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
                                            className={`${
                                                active
                                                    ? "text-[#2f3e46] font-semibold"
                                                    : "text-gray-600 group-hover:text-[#2f3e46]"
                                            }`}
                                        >
                                            {item.label}
                                        </span>

                                        <span
                                            className={`absolute left-0 bottom-0 h-[2px] w-full bg-[#ABE7B2] transition ${
                                                active
                                                    ? "scale-x-100"
                                                    : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                        />
                                    </a>
                                );
                            })}

                            {/* AUTH */}
                            {!auth?.user ? (
                                <button
                                    onClick={() => setOpenLogin(true)}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] text-white text-sm font-medium shadow-sm hover:opacity-90 transition"
                                >
                                    Login
                                </button>
                            ) : (
                                <div className="relative">

                                    {/* USER BUTTON */}
                                    <button
                                        onClick={() => setOpenProfile(!openProfile)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/50 transition"
                                    >
                                        {/* AVATAR */}
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] flex items-center justify-center text-white text-sm font-bold">
                                            {auth.user.name.charAt(0)}
                                        </div>

                                        <span className="text-sm text-[#2f3e46] font-medium">
                                            {auth.user.name}
                                        </span>

                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    </button>

                                    {/* DROPDOWN */}
                                    {openProfile && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fade-in">

                                            <div className="px-4 py-3 border-b">
                                                <p className="text-sm font-medium text-gray-800">
                                                    {auth.user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {auth.user.email}
                                                </p>
                                            </div>

                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>

                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* MOBILE */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-[#2f3e46]"
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div
                    className={`md:hidden transition-all duration-300 ${
                        isOpen
                            ? "max-h-screen opacity-100"
                            : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                >
                    <div className="px-6 py-6 space-y-4 bg-[#ECF4E8]">

                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href)}
                                className="block text-lg text-gray-700"
                            >
                                {item.label}
                            </a>
                        ))}

                        {!auth?.user ? (
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setOpenLogin(true);
                                }}
                                className="w-full py-2 rounded-lg bg-[#ABE7B2]"
                            >
                                Login
                            </button>
                        ) : (
                            <>
                                <div className="text-sm text-gray-700">
                                    {auth.user.name}
                                </div>

                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="w-full text-left text-red-500"
                                >
                                    Logout
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <LoginModal open={openLogin} setOpen={setOpenLogin} />
        </>
    );
};

export default Navbar;