import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Layers, Cpu, Smartphone } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";


const projects = [
    {
        id: 1,
        title: "Cari Kos",
        desc: "Temukan kos berdasarkan lokasi, harga, dan fasilitas.",
        img: "/img/app1.png",
    },
    {
        id: 2,
        title: "Detail Kos",
        desc: "Lihat foto, fasilitas, dan review pengguna.",
        img: "/img/app2.png",
    },
    {
        id: 3,
        title: "Booking Kos",
        desc: "Booking langsung tanpa ribet.",
        img: "/img/app3.png",
    },
];

const features = [
    {
        title: "Smart Search",
        desc: "Filter berdasarkan harga, lokasi, dan fasilitas",
    },
    {
        title: "Real-time Booking",
        desc: "Pesan kamar langsung dari aplikasi",
    },
    {
        title: "User Reviews",
        desc: "Lihat rating & pengalaman pengguna",
    },
];

const techStacks = [
    {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
        name: "Tailwind",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    },
    {
        name: "Framer Motion",
        icon: "https://cdn.worldvectorlogo.com/logos/framer-motion.svg",
    },
    {
        name: "Laravel",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg",
    },
    {
        name: "Inertia",
        icon: "https://avatars.githubusercontent.com/u/47703742?s=200&v=4",
    },
    {
        name: "Supabase",
        icon: "https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png",
    },
    {
        name: "MySQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    },
    {
        name: "Vite",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
    },
    {
        name: "AOS",
        icon: "https://raw.githubusercontent.com/michalsnik/aos/master/src/assets/logo.png",
    },
    {
        name: "Flutter",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
    },
];


const tabs = [
    { id: "preview", label: "App Preview", icon: Smartphone },
    { id: "features", label: "Features", icon: Layers },
    { id: "tech", label: "Tech Stack", icon: Cpu },
];

export default function Showcase() {
    const [activeTab, setActiveTab] = useState("preview");

    useEffect(() => {
        AOS.init({ once: true, duration: 1000 });
    }, []);

    return (
        <div
            id="Showcase"
            className="min-h-screen px-[8%] lg:px-[16%] py-20 bg-background text-white"
        >
            {/* HEADER */}
            <div className="text-center mb-16" data-aos="fade-up">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    App Showcase
                </h2>
                <p className="text-gray-400 mt-3 max-w-xl mx-auto">
                    Lihat bagaimana MyKost membantu kamu menemukan tempat
                    tinggal dengan mudah.
                </p>
            </div>

            {/* TABS */}
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${
                                activeTab === tab.id
                                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "preview" && (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -80 }}
                        className="flex flex-wrap justify-center gap-10"
                    >
                        {projects.map((p, i) => (
                            <motion.div
                                key={p.id}
                                data-aos="fade-up"
                                data-aos-delay={i * 150}
                                whileHover={{ y: -10, scale: 1.05 }}
                                className="relative"
                            >
                                <div className="w-[220px] h-[420px] rounded-[30px] border border-white/10 bg-black shadow-2xl overflow-hidden relative">
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-10" />

                                    <img
                                        src={p.img}
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                        <h3 className="text-sm font-semibold">
                                            {p.title}
                                        </h3>
                                        <p className="text-xs text-gray-300">
                                            {p.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl -z-10 opacity-40" />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {activeTab === "features" && (
                    <motion.div
                        key="features"
                        initial={{ opacity: 0, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -80 }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                data-aos="fade-up"
                                data-aos-delay={i * 150}
                                whileHover={{ y: -12, scale: 1.03 }}
                                className="relative group"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>

                                <div className="relative bg-background/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-500 h-full flex flex-col justify-between overflow-hidden">

                                    <div className="mb-5">
                                        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 group-hover:scale-110 transition">
                                            <Layers className="w-6 h-6 text-primary" />
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition">
                                        {f.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                        {f.desc}
                                    </p>

                                    <div className="mt-4 h-[2px] w-0 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500"></div>

                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-r from-primary/10 to-secondary/10 blur-2xl opacity-0 group-hover:opacity-100 transition"></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {activeTab === "tech" && (
                    <motion.div
                        key="tech"
                        initial={{ opacity: 0, y: 80 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -80 }}
                        className="flex flex-wrap justify-center gap-10"
                    >
                        {techStacks.map((tech, i) => (
                            <motion.div
                                key={i}
                                data-aos="fade-up"
                                data-aos-delay={i * 100}
                                whileHover={{ scale: 1.15 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="w-16 h-16 bg-white/5 backdrop-blur rounded-xl flex items-center justify-center border border-white/10">
                                    <img
                                        src={tech.icon}
                                        className="w-10 h-10"
                                    />
                                </div>
                                <span className="text-sm text-gray-400">
                                    {tech.name}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
