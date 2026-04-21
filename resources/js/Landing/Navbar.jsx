import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");

    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Contact", label: "Contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            const sections = navItems
                .map((item) => {
                    const section = document.querySelector(item.href);
                    if (section) {
                        return {
                            id: item.href.replace("#", ""),
                            offset: section.offsetTop - 200,
                            height: section.offsetHeight,
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            const current = window.scrollY;

            const active = sections.find(
                (s) => current >= s.offset && current < s.offset + s.height,
            );

            if (active) setActiveSection(active.id);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);

        if (section) {
            window.scrollTo({
                top: section.offsetTop - 80,
                behavior: "smooth",
            });
        }

        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                isOpen
                    ? "bg-background"
                    : scrolled
                      ? "bg-background/80 backdrop-blur-xl shadow-sm"
                      : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-[8%] lg:px-[16%]">
                <div className="flex items-center justify-between h-16">
                    {/* LOGO */}
                    <a
                        href="#Home"
                        onClick={(e) => scrollToSection(e, "#Home")}
                        className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    >
                        <div className="flex items-center gap-2">
                            <img
                                src={logo}
                                alt="MyKost"
                                className="w-12 h-12"
                            />
                        </div>
                    </a>

                    {/* DESKTOP */}
                    <div className="hidden md:flex items-center space-x-8">
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
                                    className="relative text-sm font-medium group"
                                >
                                    <span
                                        className={`transition ${
                                            active
                                                ? "text-primary font-semibold"
                                                : "text-gray-600 group-hover:text-primary"
                                        }`}
                                    >
                                        {item.label}
                                    </span>

                                    <span
                                        className={`absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-primary to-secondary transform origin-left transition ${
                                            active
                                                ? "scale-x-100"
                                                : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                    />
                                </a>
                            );
                        })}

                        {/* LOGIN BUTTON */}
                        <a href={route('login')}>
                            <div className="relative group">
                                {/* BORDER GLOW */}
                                <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-primary to-secondary opacity-60 group-hover:opacity-100 blur-sm transition"></div>

                                {/* BUTTON */}
                                <div className="relative px-4 py-2 rounded-lg bg-background text-sm font-medium text-gray-700 border border-transparent group-hover:text-primary transition">
                                    Login
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* MOBILE BUTTON */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-700"
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
                <div className="px-6 py-6 space-y-4 bg-background">
                    {navItems.map((item, i) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`block text-lg transition ${
                                activeSection === item.href.substring(1)
                                    ? "text-primary font-semibold"
                                    : "text-gray-600"
                            }`}
                            style={{
                                transitionDelay: `${i * 100}ms`,
                            }}
                        >
                            {item.label}
                        </a>
                    ))}
                    <a href="#login" className="block text-lg text-gray-600">
                        Login
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
