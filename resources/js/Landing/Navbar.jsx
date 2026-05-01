import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";
import { Link } from "@inertiajs/react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");

    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Showcase", label: "Showcase" },
        { href: "#Contact", label: "Contact" },
    ];

    useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);

        let currentSection = "Home";

        navItems.forEach((item) => {
            const section = document.querySelector(item.href);
            if (!section) return;

            const rect = section.getBoundingClientRect();

            if (rect.top <= 150 && rect.bottom >= 150) {
                currentSection = item.href.replace("#", "");
            }
        });

        setActiveSection(currentSection);
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
                    ? "bg-[#ECF4E8]"
                    : scrolled
                    ? "bg-[#ECF4E8]/80 backdrop-blur-xl shadow-sm"
                    : "bg-transparent"
            }`}
        >
            <div className="mx-auto px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-16">

                    <a
                        href="#Home"
                        onClick={(e) => scrollToSection(e, "#Home")}
                        className="flex items-center gap-2"
                    >
                        <img src={logo} alt="MyKos" className="w-10 h-10" />
                        <span className="bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] bg-clip-text text-transparent">
                            MyKost
                        </span>
                    </a>

                    <div className="hidden md:flex items-center space-x-8">
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
                                                ? "text-[#2f3e46] font-semibold"
                                                : "text-gray-600 group-hover:text-[#2f3e46]"
                                        }`}
                                    >
                                        {item.label}
                                    </span>

                                    <span
                                        className={`absolute left-0 bottom-0 h-[2px] w-full bg-[#ABE7B2] transform origin-left transition ${
                                            active
                                                ? "scale-x-100"
                                                : "scale-x-0 group-hover:scale-x-100"
                                        }`}
                                    />
                                </a>
                            );
                        })}

                        <a href={route("login")}>
                            <div className="relative group">
                                <div className="absolute -inset-[1px] rounded-lg bg-[#ABE7B2] opacity-50 blur-sm group-hover:opacity-100 transition"></div>

                                <div className="relative px-4 py-2 rounded-lg bg-white text-sm font-medium text-gray-700 group-hover:text-black transition">
                                    Login
                                </div>
                            </div>
                        </a>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-[#2f3e46]"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            <Link
                                                        href={route('logout')}
                                                        method="post"
                                                        as="button"
                                                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
                                                    >
                                                        Logout
                                                    </Link>

            <div
                className={`md:hidden transition-all duration-300 ${
                    isOpen
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-6 py-6 space-y-4 bg-[#ECF4E8]">
                    {navItems.map((item, i) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`block text-lg transition ${
                                activeSection === item.href.substring(1)
                                    ? "text-[#2f3e46] font-semibold"
                                    : "text-gray-600"
                            }`}
                            style={{
                                transitionDelay: `${i * 100}ms`,
                            }}
                        >
                            {item.label}
                        </a>
                    ))}

                    <a
                        href={route("login")}
                        className="block text-lg text-gray-700"
                    >
                        Login
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;