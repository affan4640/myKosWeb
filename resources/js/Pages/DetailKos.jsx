import { useState, useEffect } from "react";
import {
    MapPin, Star, Wifi, Car, Snowflake, ArrowLeft, Heart,
    MessageCircle, Bath, BedDouble, Users, CheckCircle,
    ChevronLeft, ChevronRight, Share2, Sun, Moon, LogIn,
} from "lucide-react";
import { router, Link, usePage } from "@inertiajs/react";
import { MapContainer, Marker, Popup } from "react-leaflet";
import { createLocationIcon } from "@/Components/Map/CustomMarker";
import GoogleTileLayer from "@/Components/Map/GoogleTileLayer";
import RoomTypeModal from "@/Components/Search/RoomTypeModal";
import FlashAlert from "@/Components/FlashAlert";

const FACILITY_ICONS = {
    WiFi:                <Wifi      className="w-4 h-4" />,
    Wifi:                <Wifi      className="w-4 h-4" />,
    AC:                  <Snowflake className="w-4 h-4" />,
    Parkir:              <Car       className="w-4 h-4" />,
    "Kamar Mandi Dalam": <Bath      className="w-4 h-4" />,
};

const RecomCard = ({ item }) => (
    <Link
        href={route("kos.detail", item.id)}
        className="
            min-w-[210px] rounded-2xl overflow-hidden flex-shrink-0
            bg-white        dark:bg-dark-card
            border border-mint-200 dark:border-dark-border/20
            hover:border-mint-300 dark:hover:border-mint-300/30
            hover:shadow-sm transition group
        "
    >
        <div className="overflow-hidden h-32">
            <img
                src={
                    item.images?.[0]
                        ? `/storage/${item.images[0].image_path}`
                        : "https://placehold.co/400x300/ECF4E8/93BFC7?text=Kos"
                }
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
        </div>
        <div className="p-3 space-y-1">
            <h3 className="text-sm font-medium text-kost-dark dark:text-mint-50 line-clamp-1">
                {item.name}
            </h3>
            <p className="text-xs text-kost-muted dark:text-mint-100/50 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {item.city}
            </p>
            <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-kost-dark dark:text-mint-50">
                    Rp {Number(item.room_types?.[0]?.price ?? 0).toLocaleString("id-ID")}
                </span>
                {item.rating && (
                    <div className="flex items-center gap-0.5 text-yellow-500 text-xs">
                        <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-500" />
                        {item.rating}
                    </div>
                )}
            </div>
        </div>
    </Link>
);

const SectionCard = ({ title, children }) => (
    <div className="
        rounded-2xl p-6
        bg-white        dark:bg-dark-card
        border border-mint-200 dark:border-dark-border/20
        space-y-4 transition-colors duration-300
    ">
        {title && (
            <h2 className="text-sm font-medium text-kost-dark dark:text-mint-50">
                {title}
            </h2>
        )}
        {children}
    </div>
);

const LoginPrompt = ({ text }) => (
    <Link
        href={route("login")}
        className="
            w-full py-2.5 rounded-xl text-sm transition
            flex items-center justify-center gap-2
            bg-mint-50 dark:bg-dark-bg
            border border-mint-200 dark:border-dark-border/20
            text-kost-muted dark:text-mint-100/50
            hover:bg-mint-100 dark:hover:bg-dark-card
            hover:text-kost-dark dark:hover:text-mint-50
        "
    >
        <LogIn className="w-4 h-4" />
        {text}
    </Link>
);

export default function DetailKos({
    property     = null,
    similar      = [],
    isWishlisted: initialWishlisted = false,
}) {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;

    const images     = property?.images      ?? [];
    const roomTypes  = property?.room_types  ?? [];
    const facilities = property?.facilities  ?? [];

    const icon = createLocationIcon();

    const [activeImage,    setActiveImage]    = useState(0);
    const [isWishlisted,   setIsWishlisted]   = useState(initialWishlisted);
    const [wishlistLoading,setWishlistLoading]= useState(false);
    const [selectedRoom,   setSelectedRoom]   = useState(roomTypes[0] ?? null);
    const [modalRoom,      setModalRoom]      = useState(null);
    const [isDark,         setIsDark]         = useState(
        () => localStorage.getItem("theme") === "dark"
    );

    if (!property) {
        return (
            <div className="min-h-screen bg-mint-50 dark:bg-dark-bg flex items-center justify-center">
                <p className="text-sm text-kost-muted dark:text-mint-100/40">Memuat data kos...</p>
            </div>
        );
    }

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    const prevImage = () => setActiveImage((p) => (p - 1 + images.length) % images.length);
    const nextImage = () => setActiveImage((p) => (p + 1) % images.length);

    const lowestPrice = roomTypes.length > 0
        ? Math.min(...roomTypes.map((r) => Number(r.price)))
        : null;

    const handleWishlist = () => {
        if (!isLoggedIn) {
            router.visit(route("login"));
            return;
        }

        setWishlistLoading(true);
        const prev = isWishlisted;
        setIsWishlisted(!prev); 

        router.post(
            route("wishlist.update"),
            { property_id: property.id },
            {
                preserveScroll: true,
                onError: () => setIsWishlisted(prev), 
                onFinish: () => setWishlistLoading(false),
            }
        );
    };

    const handleBook = (room) => {
        setModalRoom(null);
        if (!isLoggedIn) {
            router.visit(route("login"));
            return;
        }
        router.visit(route("booking.create", { room_type_id: room.id }));
    };

    const handleChat = () => {
        if (!isLoggedIn) {
            router.visit(route("login"));
            return;
        }
    };

    return (
        <div className="min-h-screen bg-mint-50 dark:bg-dark-bg pb-20 transition-colors duration-300">

            <div className="
                sticky top-0 z-50
                bg-white/90 dark:bg-dark-card/90
                backdrop-blur border-b
                border-mint-200 dark:border-dark-border/20
                px-[6%] lg:px-[10%] py-3
                flex items-center justify-between
            ">
                <FlashAlert />

                <button
                    onClick={() => window.history.back()}
                    className="
                        flex items-center gap-2 text-sm transition
                        text-kost-muted dark:text-mint-100/50
                        hover:text-kost-dark dark:hover:text-mint-50
                    "
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </button>

                <p className="text-sm font-medium text-kost-dark dark:text-mint-50 truncate max-w-[200px] hidden sm:block">
                    {property.name}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigator.share?.({ title: property.name, url: window.location.href })}
                        className="
                            p-2 rounded-lg transition
                            bg-mint-50 dark:bg-dark-bg
                            border border-mint-200 dark:border-dark-border/20
                            text-kost-muted dark:text-mint-100/40
                            hover:text-kost-dark dark:hover:text-mint-50
                        "
                    >
                        <Share2 className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleWishlist}
                        disabled={wishlistLoading}
                        title={!isLoggedIn ? "Login untuk menyimpan wishlist" : ""}
                        className="
                            p-2 rounded-lg transition
                            bg-mint-50 dark:bg-dark-bg
                            border border-mint-200 dark:border-dark-border/20
                            disabled:opacity-50
                        "
                    >
                        <Heart className={`w-4 h-4 transition ${
                            isWishlisted && isLoggedIn
                                ? "fill-red-400 stroke-red-400"
                                : "text-kost-muted dark:text-mint-100/40"
                        }`} />
                    </button>

                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="
                            p-2 rounded-lg transition
                            bg-mint-50 dark:bg-dark-card
                            border border-mint-200 dark:border-dark-border/20
                            text-kost-muted dark:text-mint-100/60
                            hover:bg-mint-100 dark:hover:bg-dark-card/60
                        "
                        aria-label="Toggle dark mode"
                    >
                        {isDark
                            ? <Sun  className="w-4 h-4 text-mint-200" />
                            : <Moon className="w-4 h-4" />
                        }
                    </button>
                </div>
            </div>

            <div className="px-[6%] lg:px-[10%] mt-6 space-y-6">

                <div className="grid lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-2 relative rounded-2xl overflow-hidden h-[320px] group">
                        <img
                            src={
                                images[activeImage]
                                    ? `/storage/${images[activeImage].image_path}`
                                    : "https://placehold.co/800x500/ECF4E8/93BFC7?text=Kos"
                            }
                            alt={property.name}
                            className="w-full h-full object-cover"
                        />
                        {images.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition bg-white/80 dark:bg-dark-card/80 text-kost-dark dark:text-mint-50 opacity-0 group-hover:opacity-100">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition bg-white/80 dark:bg-dark-card/80 text-kost-dark dark:text-mint-50 opacity-0 group-hover:opacity-100">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs bg-black/40 text-white backdrop-blur-sm">
                                    {activeImage + 1}/{images.length}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                        {images.slice(0, 3).map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`relative h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                                    activeImage === i ? "border-mint-300" : "border-transparent hover:border-mint-200"
                                }`}
                            >
                                <img src={`/storage/${img.image_path}`} className="w-full h-full object-cover" />
                                {i === 2 && images.length > 3 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">+{images.length - 3}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-2 space-y-5">

                        <SectionCard>
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-2">
                                    {property.type && (
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-mint-50 dark:bg-dark-bg text-kost-muted dark:text-mint-100/60 border border-mint-200 dark:border-dark-border/20">
                                            Kos {property.type}
                                        </span>
                                    )}
                                    <h1 className="text-xl font-medium text-kost-dark dark:text-mint-50">
                                        {property.name}
                                    </h1>
                                    <p className="flex items-center gap-1.5 text-sm text-kost-muted dark:text-mint-100/50">
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        {property.address}, {property.city}
                                    </p>
                                </div>
                                {property.rating && (
                                    <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                                        <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
                                        <span className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                            {property.rating}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </SectionCard>

                        {roomTypes.length > 0 && (
                            <SectionCard title="Tipe Kamar">
                                <div className="space-y-3">
                                    {roomTypes.map((room) => (
                                        <div
                                            key={room.id}
                                            onClick={() => setSelectedRoom(room)}
                                            className={`
                                                cursor-pointer rounded-xl p-4 border transition
                                                ${selectedRoom?.id === room.id
                                                    ? "bg-mint-100 dark:bg-mint-200/10 border-mint-300 dark:border-mint-300/30"
                                                    : "bg-mint-50 dark:bg-dark-bg border-mint-200 dark:border-dark-border/20 hover:bg-mint-100 dark:hover:bg-mint-200/10"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        {selectedRoom?.id === room.id && (
                                                            <CheckCircle className="w-4 h-4 text-mint-300" />
                                                        )}
                                                        <p className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                                            {room.name}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-kost-muted dark:text-mint-100/50">
                                                        {room.room_width && room.room_length && (
                                                            <span>{room.room_width}×{room.room_length} m</span>
                                                        )}
                                                        {room.capacity && (
                                                            <span className="flex items-center gap-1">
                                                                <Users className="w-3 h-3" />
                                                                {room.capacity} orang
                                                            </span>
                                                        )}
                                                        <span className="px-2 py-0.5 rounded-full bg-mint-200/60 dark:bg-mint-200/20 text-kost-dark dark:text-mint-100">
                                                            {room.total_rooms} unit
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                                            Rp {Number(room.price).toLocaleString("id-ID")}
                                                        </p>
                                                        <p className="text-xs text-kost-muted dark:text-mint-100/40">
                                                            /{room.rental_type === "monthly" ? "bulan" : "hari"}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setModalRoom(room); }}
                                                        className="
                                                            px-3 py-1.5 rounded-lg text-xs transition flex-shrink-0
                                                            bg-white dark:bg-dark-card
                                                            border border-mint-200 dark:border-dark-border/20
                                                            text-kost-muted dark:text-mint-100/50
                                                            hover:bg-mint-100 dark:hover:bg-dark-bg
                                                            hover:text-kost-dark dark:hover:text-mint-50
                                                        "
                                                    >
                                                        Detail
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        )}

                        <RoomTypeModal
                            room={modalRoom}
                            onClose={() => setModalRoom(null)}
                            onBook={handleBook}
                        />

                        {facilities.length > 0 && (
                            <SectionCard title="Fasilitas">
                                <div className="flex flex-wrap gap-2">
                                    {facilities.map((f) => (
                                        <div key={f.id} className="
                                            flex items-center gap-2 px-3 py-2 rounded-xl text-sm
                                            bg-mint-50 dark:bg-dark-bg
                                            border border-mint-200 dark:border-dark-border/20
                                            text-kost-muted dark:text-mint-100/60
                                        ">
                                            {FACILITY_ICONS[f.name] ?? null}
                                            {f.name}
                                        </div>
                                    ))}
                                </div>
                            </SectionCard>
                        )}

                        {property.description && (
                            <SectionCard title="Deskripsi">
                                <p className="text-sm text-kost-muted dark:text-mint-100/60 leading-relaxed whitespace-pre-line">
                                    {property.description}
                                </p>
                            </SectionCard>
                        )}

                        {property.rules && (
                            <SectionCard title="Peraturan Kos">
                                <p className="text-sm text-kost-muted dark:text-mint-100/60 leading-relaxed whitespace-pre-line">
                                    {property.rules}
                                </p>
                            </SectionCard>
                        )}

                        {property.latitude && property.longitude && (
                            <SectionCard title="Lokasi">
                                <div className="rounded-xl overflow-hidden h-56 border border-mint-200 dark:border-dark-border/20">
                                    <MapContainer
                                        center={[property.latitude, property.longitude]}
                                        zoom={16}
                                        style={{ height: "250px" }}
                                    >
                                        <GoogleTileLayer />
                                        <Marker position={[property.latitude, property.longitude]} icon={icon}>
                                            <Popup>{property.name}</Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                                <p className="text-xs text-kost-muted dark:text-mint-100/40 flex items-center gap-1 mt-2">
                                    <MapPin className="w-3 h-3" />
                                    {property.address}, {property.city}
                                </p>
                            </SectionCard>
                        )}
                    </div>

                    <div className="sticky top-20 h-fit space-y-3">
                        <SectionCard>
                            <div>
                                <p className="text-xs text-kost-muted dark:text-mint-100/40 mb-0.5">
                                    Mulai dari
                                </p>
                                <p className="text-xl font-medium text-kost-dark dark:text-mint-50">
                                    Rp {Number(selectedRoom?.price ?? lowestPrice ?? 0).toLocaleString("id-ID")}
                                    <span className="text-xs text-kost-muted dark:text-mint-100/40 font-normal ml-1">
                                        /{selectedRoom?.rental_type === "monthly" ? "bulan" : "hari"}
                                    </span>
                                </p>
                                {selectedRoom && (
                                    <p className="text-xs text-mint-300 mt-0.5">
                                        Tipe: {selectedRoom.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 pt-2 border-t border-mint-200 dark:border-dark-border/20">
                                {isLoggedIn ? (
                                    <>
                                        <button
                                            onClick={() => handleBook(selectedRoom)}
                                            disabled={!selectedRoom}
                                            className="
                                                w-full py-2.5 rounded-xl text-sm font-medium transition
                                                bg-mint-200      dark:bg-mint-200/20
                                                border border-mint-200 dark:border-mint-300/20
                                                text-kost-dark   dark:text-mint-50
                                                hover:bg-mint-300 dark:hover:bg-mint-300/30
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                            "
                                        >
                                            Booking Sekarang
                                        </button>

                                        {/* Chat */}
                                        <button
                                            onClick={handleChat}
                                            className="
                                                w-full py-2.5 rounded-xl text-sm transition
                                                flex items-center justify-center gap-2
                                                bg-mint-50 dark:bg-dark-bg
                                                border border-mint-200 dark:border-dark-border/20
                                                text-kost-muted dark:text-mint-100/50
                                                hover:bg-mint-100 dark:hover:bg-dark-card
                                                hover:text-kost-dark dark:hover:text-mint-50
                                            "
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Chat Pemilik
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <LoginPrompt text="Login untuk Booking" />
                                        <LoginPrompt text="Login untuk Chat" />

                                        <p className="text-xs text-kost-muted dark:text-mint-100/30 text-center pt-1">
                                            Sudah punya akun?{" "}
                                            <Link href={route("login")} className="text-mint-300 hover:underline">
                                                Masuk di sini
                                            </Link>
                                        </p>
                                    </>
                                )}
                            </div>

                            <p className="text-xs text-kost-muted dark:text-mint-100/30 text-center">
                                Pembayaran aman & terpercaya
                            </p>
                        </SectionCard>
                    </div>
                </div>

                {similar.length > 0 && (
                    <div className="space-y-4 mt-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                Kos Serupa di Sekitar
                            </h2>
                            <Link href="/search" className="text-xs text-mint-300 hover:underline">
                                Lihat semua
                            </Link>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {similar.map((item) => (
                                <RecomCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}