import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    CalendarCheck,
    Star,
    Smartphone,
    Layers,
    Cpu,
    Code2,
    Server,
    Palette,
    Database,
    Zap,
    Sparkles,
} from "lucide-react";

import AOS from "aos";
import "aos/dist/aos.css";

import review1 from "../../assets/review1.jpeg";
import review2 from "../../assets/review2.jpeg";
import review3 from "../../assets/review3.jpeg";


const features = [
    {
        title: "Pencarian Kos Cerdas",
        desc: "Cari kos berdasarkan lokasi, harga, tipe kos, dan fasilitas yang dibutuhkan.",
        icon: Search,
    },
    {
        title: "Booking Lebih Praktis",
        desc: "Pengguna bisa melihat detail kos dan melakukan booking dengan alur yang sederhana.",
        icon: CalendarCheck,
    },
    {
        title: "Review & Rating",
        desc: "Bantu pencari kos melihat pengalaman pengguna lain sebelum memilih kos.",
        icon: Star,
    },
];

const projects = [
    {
        id: 1,
        title: "Cari Kos",
        desc: "Temukan kos sesuai lokasi dan kebutuhan.",
        img: review2,
    },
    {
        id: 2,
        title: "Detail Kos",
        desc: "Lihat foto, fasilitas, harga, dan lokasi kos.",
        img: review1,
    },
    {
        id: 3,
        title: "Booking Kos",
        desc: "Ajukan booking kos dengan lebih cepat.",
        img: review3,
    },
];

const techStacks = [
    {
        name: "React",
        desc: "Frontend UI",
        icon: Code2,
    },
    {
        name: "Laravel",
        desc: "Backend API",
        icon: Server,
    },
    {
        name: "Inertia.js",
        desc: "SPA Bridge",
        icon: Zap,
    },
    {
        name: "Tailwind CSS",
        desc: "Modern Styling",
        icon: Palette,
    },
    {
        name: "MySQL",
        desc: "Database",
        icon: Database,
    },
    {
        name: "Flutter",
        desc: "Mobile App",
        icon: Smartphone,
    },
];

const tabs = [
    { id: "features", label: "Fitur Unggulan", icon: Layers },
    { id: "preview", label: "App Review", icon: Smartphone },
    { id: "tech", label: "Tech Stack", icon: Cpu },
];

export default function Showcase() {
    const [activeTab, setActiveTab] = useState("features");

    useEffect(() => {
        AOS.init({
            once: true,
            duration: 800,
        });
    }, []);

    return (
        <section
            id="Showcase"
            className="min-h-screen px-[8%] lg:px-[14%] py-20 bg-background"
        >
            {/* HEADER */}
            <div className="text-center mb-16" data-aos="fade-up">
                <h2
          className="text-4xl md:text-5xl font-bold text-[#2d4a50]"
          data-aos="fade-up"
        >
          App Showcase
        </h2>

                <p className="mt-4 text-gray-600 text-lg"
          data-aos="fade-up"
          data-aos-delay="200">
                    Lihat bagaimana MyKost membantu pengguna menemukan kos
                    terbaik dengan pengalaman modern dan mudah digunakan.
                </p>
            </div>

            {/* TAB BUTTON */}
            <div className="flex justify-center gap-4 flex-wrap mb-14">
                {tabs.map((tab) => {
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2
                                px-6 py-3 rounded-2xl
                                text-sm font-medium
                                transition-all duration-300
                                ${
                                    activeTab === tab.id
                                        ? "bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] text-white shadow-lg scale-105"
                                        : "bg-white/60 border border-[#ABE7B2]/30 text-gray-600 hover:bg-white"
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {/* FEATURES */}
                {activeTab === "features" && (
                    <motion.div
                        key="features"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <motion.div
                                    key={feature.title}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                    whileHover={{ y: -10 }}
                                    className="
                                        relative group
                                    "
                                >
                                    <div
                                        className="
                                            absolute -inset-0.5
                                            bg-gradient-to-r
                                            from-[#93BFC7]
                                            to-[#ABE7B2]
                                            rounded-3xl
                                            blur opacity-10
                                            group-hover:opacity-40
                                            transition duration-500
                                        "
                                    />

                                    <div
                                        className="
                                            relative
                                            bg-white/70
                                            backdrop-blur-xl
                                            border border-[#ABE7B2]/30
                                            rounded-3xl
                                            p-7
                                            h-full
                                            overflow-hidden
                                        "
                                    >
                                        <div
                                            className="
                                                w-14 h-14 rounded-2xl
                                                flex items-center justify-center
                                                bg-gradient-to-r
                                                from-[#93BFC7]/20
                                                to-[#ABE7B2]/20
                                                border border-[#ABE7B2]/30
                                            "
                                        >
                                            <Icon className="w-6 h-6 text-[#93BFC7]" />
                                        </div>

                                        <h3 className="mt-6 text-lg font-semibold text-[#2f3e46]">
                                            {feature.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                                            {feature.desc}
                                        </p>

                                        <div
                                            className="
                                                absolute top-0 right-0
                                                w-28 h-28
                                                bg-gradient-to-r
                                                from-[#93BFC7]/10
                                                to-[#ABE7B2]/10
                                                blur-3xl
                                            "
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* APP REVIEW */}
                {activeTab === "preview" && (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className="flex flex-wrap justify-center gap-10"
                    >
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                whileHover={{ y: -10, scale: 1.04 }}
                                className="relative"
                            >
                                <div
                                    className="
                                        w-[220px] h-[420px]
                                        rounded-[34px]
                                        bg-black
                                        border border-white/10
                                        overflow-hidden
                                        shadow-2xl
                                        relative
                                    "
                                >
                                    {/* notch */}
                                    <div
                                        className="
                                            absolute top-2 left-1/2
                                            -translate-x-1/2
                                            w-20 h-4
                                            rounded-full
                                            bg-black z-10
                                        "
                                    />

                                    <img
                                        src={project.img}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />

                                    <div
                                        className="
                                            absolute bottom-0 left-0 right-0
                                            bg-gradient-to-t
                                            from-black/90
                                            to-transparent
                                            p-4
                                        "
                                    >
                                        <h3 className="text-sm font-semibold text-white">
                                            {project.title}
                                        </h3>

                                        <p className="text-xs text-gray-300 mt-1">
                                            {project.desc}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="
                                        absolute inset-0
                                        bg-gradient-to-r
                                        from-[#93BFC7]/20
                                        to-[#ABE7B2]/20
                                        blur-3xl
                                        -z-10
                                        opacity-40
                                    "
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* TECH STACK */}
                {activeTab === "tech" && (
                    <motion.div
                        key="tech"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {techStacks.map((tech, index) => {
                            const Icon = tech.icon;

                            return (
                                <motion.div
                                    key={tech.name}
                                    data-aos="fade-up"
                                    data-aos-delay={index * 80}
                                    whileHover={{ y: -6 }}
                                    className="
                                        bg-white/70
                                        backdrop-blur-xl
                                        border border-[#ABE7B2]/30
                                        rounded-3xl
                                        p-6
                                        flex items-center gap-4
                                        hover:border-[#93BFC7]/40
                                        transition-all
                                    "
                                >
                                    <div
                                        className="
                                            w-14 h-14 rounded-2xl
                                            flex items-center justify-center
                                            bg-gradient-to-r
                                            from-[#93BFC7]/20
                                            to-[#ABE7B2]/20
                                            border border-[#ABE7B2]/20
                                        "
                                    >
                                        <Icon className="w-6 h-6 text-[#93BFC7]" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-[#2f3e46]">
                                            {tech.name}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {tech.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
