import { useState } from "react";
import { MapPin, Search, Star } from "lucide-react";

/* ================= DUMMY DATA ================= */
const kosList = [
    {
        id: 1,
        name: "Kos Bebas Unej",
        location: "Jl. Kalimantan, Jember",
        price: 550000,
        rating: 4.8,
        image: "https://source.unsplash.com/400x300/?room",
    },
    {
        id: 2,
        name: "Kos Nyaman Mastrip",
        location: "Jl. Mastrip, Jember",
        price: 520000,
        rating: 4.5,
        image: "https://source.unsplash.com/400x300/?apartment",
    },
];

/* ================= SEARCH ================= */
const SearchBar = ({ keyword, setKeyword }) => (
    <div className="flex items-center bg-white rounded-full shadow-md px-4 py-1">
        <MapPin className="w-5 h-5 text-gray-400" />

        <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari lokasi, kampus, atau kos..."
            className="flex-1 py-3 px-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none border-none focus:ring-0"
        />

        <button className="px-5 py-2 rounded-full text-sm text-white bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] flex items-center gap-2">
            <Search className="w-4 h-4" />
            Cari
        </button>
    </div>
);

/* ================= FILTER SIDEBAR ================= */
const FilterSidebar = ({ price, setPrice }) => (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Filter</h3>
            <button className="text-xs text-red-500">Reset</button>
        </div>

        {/* PRICE */}
        <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
                Harga / bulan
            </p>

            {[
                { label: "< 1 Juta", value: "1" },
                { label: "1 - 2 Juta", value: "2" },
                { label: "> 2 Juta", value: "3" },
            ].map((p) => (
                <label
                    key={p.value}
                    className="flex items-center gap-2 text-sm text-gray-600 mb-2"
                >
                    <input
                        type="radio"
                        checked={price === p.value}
                        onChange={() => setPrice(p.value)}
                    />
                    {p.label}
                </label>
            ))}
        </div>

        {/* FACILITIES */}
        <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Fasilitas</p>

            {["AC", "Wifi", "Parkir"].map((f) => (
                <label key={f} className="block text-sm text-gray-600 mb-1">
                    <input type="checkbox" className="mr-2" />
                    {f}
                </label>
            ))}
        </div>
    </div>
);

/* ================= CARD ================= */
const KosCard = ({ kos }) => (
    <div className="flex bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group">
        {/* IMAGE */}
        <div className="relative w-44">
            <img
                src={kos.image}
                className="w-full h-full object-cover group-hover:scale-105 transition"
            />

            {/* BADGE */}
            <span className="absolute top-2 left-2 bg-[#ABE7B2] text-xs px-2 py-1 rounded-full text-[#2f3e46] font-medium">
                Kos Rekomendasi
            </span>
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-4 space-y-2">
            <h3 className="font-semibold text-gray-800 text-sm">{kos.name}</h3>

            <div className="flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                {kos.location}
            </div>

            {/* FACILITIES */}
            <p className="text-xs text-gray-400">
                WiFi • AC • Kamar Mandi Dalam
            </p>

            {/* PRICE + RATING */}
            <div className="flex items-center justify-between mt-2">
                <div>
                    <p className="text-xs text-gray-400 line-through">
                        Rp {(kos.price + 200000).toLocaleString()}
                    </p>

                    <p className="font-bold text-[#2f3e46]">
                        Rp {kos.price.toLocaleString()}
                        <span className="text-xs text-gray-500"> /bulan</span>
                    </p>
                </div>

                <div className="flex items-center text-yellow-500 text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    {kos.rating}
                </div>
            </div>
        </div>
    </div>
);

/* ================= MAP ================= */
const MapView = () => (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm">
        <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4365.980185054929!2d113.7202130459274!3d-8.158558349815621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd699e31fb22e71%3A0x3027a76e352bd10!2sJember%2C%20Kec.%20Kaliwates!5e1!3m2!1sid!2sid"
            className="w-full h-full border-0"
        />
    </div>
);

/* ================= MAIN ================= */
export default function SearchPage() {
    const [keyword, setKeyword] = useState("");
    const [price, setPrice] = useState("all");

    const filtered = kosList.filter((k) => {
        const matchLocation = k.location
            .toLowerCase()
            .includes(keyword.toLowerCase());

        const matchPrice =
            price === "all" ||
            (price === "1" && k.price < 1000000) ||
            (price === "2" && k.price >= 1000000 && k.price <= 2000000) ||
            (price === "3" && k.price > 2000000);

        return matchLocation && matchPrice;
    });

    return (
        <div className="min-h-screen bg-[#ECF4E8] px-[6%] lg:px-[10%] py-6">
            {/* HEADER */}
            <div className="sticky top-0 z-20 bg-[#ECF4E8] pb-4">
                <SearchBar keyword={keyword} setKeyword={setKeyword} />
            </div>

            {/* CONTENT */}
            <div className="flex gap-6 mt-6">
                {/* FILTER */}
                <div className="hidden lg:block w-[260px]">
                    <FilterSidebar price={price} setPrice={setPrice} />
                </div>

                {/* LIST */}
                <div className="flex-1 space-y-4">
                    <p className="text-sm text-gray-500">
                        {filtered.length} kos ditemukan
                    </p>

                    {filtered.map((kos) => (
                        <KosCard key={kos.id} kos={kos} />
                    ))}
                </div>

                {/* MAP */}
                <div className="hidden lg:block w-[35%] h-[650px] sticky top-24">
                    <MapView />
                </div>
            </div>
        </div>
    );
}
