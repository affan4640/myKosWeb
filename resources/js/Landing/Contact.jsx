import React, { useEffect } from "react";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Home,
    ArrowRight,
    Clock,
    HelpCircle,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function ContactUs() {
    useEffect(() => {
        AOS.init({
            duration: 900,
            once: true,
            offset: 40,
        });
    }, []);

    const contactCards = [
        {
            icon: MessageCircle,
            title: "Chat WhatsApp",
            desc: "Butuh bantuan cepat? Hubungi admin MyKost langsung.",
            value: "+62 819-3533-9292",
            href: "https://wa.me/6281935339292",
            action: "Chat Sekarang",
        },
        {
            icon: MapPin,
            title: "Lokasi Kami",
            desc: "Temui kami atau lihat area layanan MyKost.",
            value: "Politeknik Negeri Jember",
            href: "https://www.google.com/maps/search/?api=1&query=Politeknik%20Negeri%20Jember",
            action: "Lihat Lokasi",
        },
        {
            icon: Home,
            title: "Daftarkan Kos",
            desc: "Punya kos? Promosikan properti kamu di MyKost.",
            value: "Untuk pemilik kos",
            href: "/form-pengajuan",
            action: "Daftar Kos",
        },
    ];

    const faqs = [
        {
            question: "Apakah MyKost gratis digunakan?",
            answer: "Ya, pencari kos bisa menggunakan MyKost untuk mencari informasi kos secara gratis.",
        },
        {
            question: "Bagaimana cara mendaftarkan kos?",
            answer: "Pemilik kos bisa mengajukan data kos melalui halaman Daftarkan Kos.",
        },
        {
            question: "Apakah bisa booking online?",
            answer: "Bisa, jika kos tersebut menyediakan fitur booking melalui platform MyKost.",
        },
    ];

    return (
        <section
            id="Contact"
            className="
                relative overflow-hidden
                px-4 sm:px-6 lg:px-[10%]
                py-16 sm:py-20
                bg-[#ECF4E8]
            "
        >
            {/* Background decoration */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-[#ABE7B2]/30 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 -left-24 w-72 h-72 bg-[#93BFC7]/20 rounded-full blur-3xl" />

            <div className="relative">
                {/* HEADER */}
                <div
                    className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
                    data-aos="fade-up"
                >
                    <div
                        className="
                            inline-flex items-center gap-2
                            px-4 py-2 mb-4
                            rounded-full
                            bg-white/70
                            border border-[#ABE7B2]/40
                            text-xs sm:text-sm font-medium text-[#3a5a60]
                        "
                    >
                        <HelpCircle className="w-4 h-4 text-[#93BFC7]" />
                        Bantuan MyKost
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2f3e46] leading-tight">
                        Butuh Bantuan?
                    </h2>

                    <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                        Kami siap membantu pencari kos menemukan tempat tinggal
                        terbaik dan membantu pemilik kos mempromosikan
                        propertinya.
                    </p>
                </div>

                {/* MAIN CONTENT */}
                <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-10 items-start">
                    {/* LEFT INFO */}
                    <div
                        className="
                            bg-white/75 backdrop-blur
                            rounded-3xl
                            p-5 sm:p-6 lg:p-8
                            border border-[#ABE7B2]/40
                            shadow-sm
                        "
                        data-aos="fade-right"
                    >
                        <h3 className="text-xl sm:text-2xl font-semibold text-[#2f3e46]">
                            Hubungi MyKost
                        </h3>

                        <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
                            Pilih cara paling mudah untuk menghubungi kami.
                            Kamu bisa chat admin, melihat lokasi, atau
                            mendaftarkan kos milikmu.
                        </p>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#ECF4E8] flex items-center justify-center border border-[#ABE7B2]/40">
                                    <Mail className="w-5 h-5 text-[#93BFC7]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#2f3e46]">
                                        Email
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        mykostgweh@gmail.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#ECF4E8] flex items-center justify-center border border-[#ABE7B2]/40">
                                    <Phone className="w-5 h-5 text-[#93BFC7]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#2f3e46]">
                                        Telepon / WhatsApp
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        +62 819-3533-9292
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#ECF4E8] flex items-center justify-center border border-[#ABE7B2]/40">
                                    <Clock className="w-5 h-5 text-[#93BFC7]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#2f3e46]">
                                        Jam Layanan
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Senin - Sabtu, 08.00 - 17.00
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="
                                mt-6 p-4
                                rounded-2xl
                                bg-[#ECF4E8]
                                border border-[#ABE7B2]/40
                            "
                        >
                            <p className="text-sm font-medium text-[#2f3e46]">
                                Respon lebih cepat lewat WhatsApp
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                Cocok untuk pertanyaan seputar kos, booking,
                                atau kendala akun.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT ACTION CARDS */}
                    <div className="space-y-4" data-aos="fade-left">
                        {contactCards.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <a
                                    key={index}
                                    href={item.href}
                                    target={
                                        item.href.startsWith("http")
                                            ? "_blank"
                                            : undefined
                                    }
                                    rel={
                                        item.href.startsWith("http")
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                    className="
                                        group block
                                        bg-white/80 backdrop-blur
                                        rounded-3xl
                                        p-5 sm:p-6
                                        border border-[#ABE7B2]/40
                                        shadow-sm
                                        hover:shadow-md
                                        hover:-translate-y-1
                                        transition
                                    "
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="
                                                w-12 h-12
                                                rounded-2xl
                                                bg-gradient-to-br from-[#93BFC7] to-[#ABE7B2]
                                                flex items-center justify-center
                                                flex-shrink-0
                                            "
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base sm:text-lg font-semibold text-[#2f3e46]">
                                                {item.title}
                                            </h4>

                                            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                {item.desc}
                                            </p>

                                            <p className="text-sm font-medium text-[#3a5a60] mt-2 truncate">
                                                {item.value}
                                            </p>

                                            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#3a5a60]">
                                                {item.action}
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-10 sm:mt-14" data-aos="fade-up">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl sm:text-3xl font-bold text-[#2f3e46]">
                            Pertanyaan Umum
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Beberapa hal yang sering ditanyakan pengguna MyKost.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="
                                    bg-white/75
                                    rounded-2xl
                                    p-5
                                    border border-[#ABE7B2]/40
                                    shadow-sm
                                "
                            >
                                <h4 className="text-sm font-semibold text-[#2f3e46]">
                                    {faq.question}
                                </h4>
                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}