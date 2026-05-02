import { useState } from "react";
import {
    MapPin,
    Star,
    Wifi,
    Car,
    Snowflake,
    ArrowLeft,
    Heart,
    MessageCircle,
} from "lucide-react";
import { router } from "@inertiajs/react";

const kos = {
    name: "Kos Exclusive Unej",
    location: "Jalan Kalimantan No.45, Jember",
    price: 2500000,
    rating: 4.8,
    images: [
        "https://source.unsplash.com/800x500/?room",
        "https://source.unsplash.com/800x500/?apartment",
        "https://source.unsplash.com/800x500/?bedroom",
    ],
    facilities: ["AC", "Wifi", "Parkir"],
    description:
        "Kos eksklusif di pusat kota Jakarta dengan fasilitas lengkap, keamanan 24 jam, dan lokasi strategis dekat perkantoran.",
};

const rekomendasiKos = [
    {
        id: 1,
        name: "Kos Nyaman Mastrip",
        location: "Jalan Mastrip, Jember",
        price: 1800000,
        rating: 4.6,
        image: "https://source.unsplash.com/400x300/?apartment",
    },
    {
        id: 2,
        name: "Kos Minimalis Sumatra",
        location: "Jalan Sumatra, Jember",
        price: 2200000,
        rating: 4.7,
        image: "https://source.unsplash.com/400x300/?bedroom",
    },
    {
        id: 3,
        name: "Kos Dekat Unej",
        location: "Jalan Kalimantan, Jember",
        price: 2000000,
        rating: 4.5,
        image: "https://source.unsplash.com/400x300/?room",
    },
];

const RecomCard = ({ kos }) => (
    <div className="min-w-[220px] bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
        <img src={kos.image} className="w-full h-32 object-cover" />

        <div className="p-3 space-y-1">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                {kos.name}
            </h3>

            <p className="text-xs text-gray-500 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {kos.location}
            </p>

            <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-[#2f3e46]">
                    Rp {kos.price.toLocaleString()}
                </span>

                <div className="flex items-center text-yellow-500 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    {kos.rating}
                </div>
            </div>
        </div>
    </div>
);

export default function DetailKos() {
    const [activeImage, setActiveImage] = useState(0);

    return (
        <div className="min-h-screen bg-[#ECF4E8] pb-16">
            {/* ================= NAV TOP ================= */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b px-[6%] lg:px-[10%] py-3 flex items-center justify-between">
                <button
                    onClick={() => router.visit("/search")}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </button>

                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                        <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                        <MessageCircle className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ================= HERO IMAGE ================= */}
            <div className="px-[6%] lg:px-[10%] mt-6">
                <div className="grid lg:grid-cols-3 gap-4">
                    {/* MAIN */}
                    <img
                        src={kos.images[activeImage]}
                        className="lg:col-span-2 w-full h-[320px] object-cover rounded-2xl"
                    />

                    {/* THUMB */}
                    <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                        {kos.images.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                onClick={() => setActiveImage(i)}
                                className={`h-24 w-full object-cover rounded-xl cursor-pointer border-2 ${
                                    activeImage === i
                                        ? "border-[#ABE7B2]"
                                        : "border-transparent"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="px-[6%] lg:px-[10%] mt-8 grid lg:grid-cols-3 gap-10">
                {/* LEFT */}
                <div className="lg:col-span-2 space-y-6">
                    {/* TITLE */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 text-xs bg-[#ABE7B2]/40 text-[#2f3e46] rounded-full">
                                ⭐ Best Choice
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-[#2f3e46]">
                            {kos.name}
                        </h1>

                        <div className="flex items-center text-gray-500 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {kos.location}
                        </div>

                        <div className="flex items-center gap-2 text-yellow-500">
                            <Star className="w-4 h-4" />
                            {kos.rating}
                        </div>
                    </div>

                    {/* FASILITAS */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="font-semibold mb-4">
                            Fasilitas Unggulan
                        </h2>

                        <div className="flex flex-wrap gap-3">
                            {kos.facilities.map((f) => (
                                <div className="px-4 py-2 rounded-xl bg-[#ECF4E8] text-sm flex items-center gap-2">
                                    {f === "Wifi" && (
                                        <Wifi className="w-4 h-4" />
                                    )}
                                    {f === "AC" && (
                                        <Snowflake className="w-4 h-4" />
                                    )}
                                    {f === "Parkir" && (
                                        <Car className="w-4 h-4" />
                                    )}
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DESKRIPSI */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h2 className="font-semibold mb-3">Deskripsi</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {kos.description}
                        </p>
                    </div>

                    {/* MAP */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <iframe
                            src="https://www.google.com/maps?q=Jakarta&output=embed"
                            className="w-full h-64 rounded-xl border-0"
                        />
                    </div>
                </div>

                
                {/* RIGHT (BOOKING CARD) */}
                <div className="sticky top-24 h-fit">
                    <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
                        <div>
                            <p className="text-gray-500 text-sm">Harga</p>
                            <p className="text-2xl font-bold text-[#2f3e46]">
                                Rp {kos.price.toLocaleString()}
                            </p>
                        </div>

                        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] text-white font-medium hover:opacity-90">
                            Booking Sekarang
                        </button>

                        <button className="w-full py-3 rounded-xl border text-[#2f3e46] flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Chat Pemilik
                        </button>

                        <div className="text-xs text-gray-400 text-center">
                            Pembayaran aman & terpercaya
                        </div>
                    </div>
                </div>


                {/* ================= REKOMENDASI ================= */}
                <div className="px-[6%] lg:px-[10%] mt-12">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#2f3e46]">
                            Kos Serupa di Sekitar
                        </h2>

                        <button
                            onClick={() => router.visit("/search")}
                            className="text-sm text-[#93BFC7] hover:underline"
                        >
                            Lihat semua
                        </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {rekomendasiKos.map((item) => (
                            <RecomCard key={item.id} kos={item} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
