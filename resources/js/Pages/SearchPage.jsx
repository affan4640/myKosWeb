import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";

import SearchBar from "@/Components/Search/SearchBar";
import FilterSidebar from "@/Components/Search/FilterSidebar";
import KosCard from "@/Components/Search/KosCard";
import ResultHeader from "@/Components/Search/ResultHeader";
import FilterChips from "@/Components/Search/FilterChips";
import MobileFilterDrawer from "@/Components/Search/MobileFilterDrawer";
import SkeletonCard from "@/Components/Search/SkeletonCard";
import SortDropdown from "@/Components/Search/SortDropdown";
import Pagination from "@/Components/Pagination";
import GoogleTileLayer from "@/Components/Map/GoogleTileLayer";
import { createLocationIcon } from "@/Components/Map/CustomMarker";
import useSearchFilter from "@/hooks/useSearchFilter";

import { MapContainer, Marker, Popup, Circle, useMap } from "react-leaflet";
import {
    Home,
    Loader2,
    SlidersHorizontal,
    X,
    Navigation,
    ArrowLeft,
    Sun,
    Moon,
    Heart
} from "lucide-react";

function ChangeMapView({ position }) {
    const map = useMap();

    useEffect(() => {
        // Guard: pastikan lat/lng valid sebelum flyTo
        if (
            !position ||
            position.lat == null ||
            position.lng == null ||
            isNaN(position.lat) ||
            isNaN(position.lng)
        ) return;

        map.flyTo([position.lat, position.lng], 15);
    }, [position]);

    return null;
}

/* ================================================================
   MAP VIEW
================================================================ */
const MapView = ({ properties, position, radius }) => {
    const icon = createLocationIcon();

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border border-mint-200 dark:border-dark-border/20">
            <MapContainer
                center={
                    // ✅ Pastikan center valid
                    position?.lat && position?.lng && !isNaN(position.lat) && !isNaN(position.lng)
                        ? [position.lat, position.lng]
                        : [-8.159822347307612, 113.72309285357674]
                }
                zoom={15}
                style={{ height: "100%", width: "100%" }}
            >
                <GoogleTileLayer />

                {/* ✅ Hanya render ChangeMapView jika position valid */}
                {position?.lat && position?.lng &&
                 !isNaN(position.lat) && !isNaN(position.lng) && (
                    <ChangeMapView position={position} />
                )}

                {position?.lat && position?.lng && (
                    <>
                        <Circle
                            center={[position.lat, position.lng]}
                            radius={radius * 1000}
                            pathOptions={{
                                color:       "#93BFC7",
                                fillColor:   "#ABE7B2",
                                fillOpacity: 0.15,
                                weight:      1.5,
                                dashArray:   "6 4",
                            }}
                        />
                        <Marker position={[position.lat, position.lng]}>
                            <Popup>Lokasi pencarian</Popup>
                        </Marker>
                    </>
                )}

                {properties.map((p) =>
                    // ✅ Guard koordinat property juga
                    p.latitude && p.longitude &&
                    !isNaN(parseFloat(p.latitude)) &&
                    !isNaN(parseFloat(p.longitude)) ? (
                        <Marker
                            key={p.id}
                            icon={icon}
                            position={[parseFloat(p.latitude), parseFloat(p.longitude)]}
                        >
                            <Popup>
                                <div className="space-y-1 min-w-[150px]">
                                    <p className="font-medium text-sm">{p.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{p.address}</p>
                                    <p className="text-xs font-medium text-green-600">
                                        Rp {Number(p.room_types?.[0]?.price ?? 0).toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                )}
            </MapContainer>
        </div>
    );
};

/* ================================================================
   RADIUS CONTROL
================================================================ */
const QUICK_MARKS = [1, 3, 5, 10, 20];

const RadiusControl = ({ radius, setRadius, position, onClearPosition }) => {
    const pct = ((radius - 1) / 19) * 100;

    return (
        <div
            className="
            flex items-center gap-3 px-4 py-2.5 rounded-xl
            bg-white        dark:bg-dark-card
            border border-mint-200 dark:border-dark-border/20
            transition-colors duration-300
        "
        >
            {/* Label */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
                <Navigation className="w-3.5 h-3.5 text-mint-300" />
                <span className="text-xs font-medium text-kost-dark dark:text-mint-50 hidden sm:inline">
                    Radius
                </span>
            </div>

            {/* Slider */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
                <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer outline-none"
                    style={{
                        background: `linear-gradient(to right, #93BFC7 ${pct}%, #ECF4E8 ${pct}%)`,
                    }}
                />

                {/* Value badge */}
                <span
                    className="
                    flex-shrink-0 min-w-[52px] text-center
                    px-2 py-0.5 rounded-lg text-xs font-medium
                    bg-mint-200      dark:bg-mint-200/20
                    border border-mint-200 dark:border-mint-300/20
                    text-kost-dark   dark:text-mint-50
                "
                >
                    {radius} km
                </span>
            </div>

            {/* Quick marks */}
            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                {QUICK_MARKS.map((m) => (
                    <button
                        key={m}
                        onClick={() => setRadius(m)}
                        className={`
                            px-2 py-0.5 rounded-md text-xs transition border
                            ${
                                radius === m
                                    ? "bg-mint-300 dark:bg-mint-300/40 text-white border-mint-300 dark:border-mint-300/40"
                                    : "bg-mint-50 dark:bg-dark-bg text-kost-muted dark:text-mint-100/40 border-mint-200 dark:border-dark-border/20 hover:bg-mint-100 dark:hover:bg-dark-card"
                            }
                        `}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* Clear position */}
            {position && (
                <button
                    onClick={onClearPosition}
                    title="Hapus lokasi"
                    className="
                        flex-shrink-0 flex items-center gap-1
                        px-2 py-1 rounded-lg text-xs transition
                        text-red-400 hover:text-red-500
                        bg-red-50 dark:bg-red-500/10
                        border border-red-200 dark:border-red-500/20
                    "
                >
                    <X className="w-3 h-3" />
                    <span className="hidden sm:inline">Hapus</span>
                </button>
            )}
        </div>
    );
};

/* ================================================================
   EMPTY STATE
================================================================ */
const EmptyState = ({ onReset, keyword }) => (
    <div
        className="
        flex flex-col items-center justify-center py-20 gap-3
        rounded-2xl border border-dashed
        border-mint-200 dark:border-dark-border/20
        bg-white dark:bg-dark-card
        transition-colors duration-300
    "
    >
        <div
            className="
            w-16 h-16 rounded-2xl flex items-center justify-center
            bg-mint-50 dark:bg-dark-bg
            border border-mint-200 dark:border-dark-border/20
        "
        >
            <Home className="w-7 h-7 text-mint-200 dark:text-mint-200/50" />
        </div>
        <div className="text-center px-4">
            <p className="text-sm font-medium text-kost-dark dark:text-mint-50">
                Kos tidak ditemukan
            </p>
            <p className="text-xs text-kost-muted dark:text-mint-100/40 mt-1">
                {keyword
                    ? `Tidak ada hasil untuk "${keyword}"`
                    : "Coba ubah atau hapus filter yang aktif"}
            </p>
        </div>
        <button
            onClick={onReset}
            className="
                px-5 py-2 rounded-xl text-xs font-medium transition
                bg-mint-200      dark:bg-mint-200/20
                border border-mint-200 dark:border-mint-300/20
                text-kost-dark   dark:text-mint-50
                hover:bg-mint-300 dark:hover:bg-mint-300/30
            "
        >
            Reset Filter
        </button>
    </div>
);

/* ================================================================
   ACTIVE FILTER COUNT
================================================================ */
const countActiveFilters = (applied) =>
    (applied.type !== "all" ? 1 : 0) +
    (applied.maxPrice !== 2000000 ? 1 : 0) +
    applied.facilities.length +
    (applied.wishlistOnly ? 1 : 0);

/* ================================================================
   MAIN
================================================================ */
export default function SearchPage({

    

    properties = [],
    query = "",
    facilities = [],
}) {

    const { auth } = usePage().props;
const user = auth?.user;
    const defaultFilters = { type: "all", maxPrice: 2000000, facilities: [], wishlistOnly: false };

    const [keyword, setKeyword] = useState(query);
    const [sortBy, setSortBy] = useState("relevance");
    const [showFilter, setShowFilter] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState(defaultFilters);
    const [applied, setApplied] = useState(defaultFilters);
    const [appliedKeyword, setAppliedKeyword] = useState(query);
    const [radius, setRadius] = useState(5);
    const [position, setPosition] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [isDark, setIsDark] = useState(
        () => localStorage.getItem("theme") === "dark",
    );

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
    const handleApply = () => {
        setApplied(filters);
        setAppliedKeyword(keyword);
        setShowFilter(false);
    };

    const handleSearch = () => {
        setIsLoading(true);
        setAppliedKeyword(keyword);
        router.get(
            "/search",
            { q: keyword },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const handleClear = () => {
        setAppliedKeyword("");
        setKeyword("");
        setPosition(null);
        setSelectedLocation(null);
    };

    const handleReset = () => {
        setKeyword("");
        setFilters(defaultFilters);
        setApplied(defaultFilters);
        setAppliedKeyword("");
        setShowFilter(false);
    };

    const patchApplied = (patch) => {
        const next = { ...applied, ...patch };
        setApplied(next);
        setFilters(next);
    };

    const handleWishlistFilter = () => {
    if (!user) {
        alert("Silakan login terlebih dahulu untuk menggunakan fitur wishlist.");
        router.get("/login");
        return;
    }

    patchApplied({
        wishlistOnly: !applied.wishlistOnly,
    });
};

    /* ── Derived ───────────────────────────── */
    const filtered = useSearchFilter({
        properties,
        applied,
        appliedKeyword,
        sortBy,
        position,
        radius,
        selectedLocation,
    });

    const activeCount = countActiveFilters(applied);

    const sidebar = (
        <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            keyword={keyword}
            setKeyword={setKeyword}
            onApply={handleApply}
            onReset={handleReset}
            facilities={facilities}
        />
    );

    

    return (
        <div
            className="
            min-h-screen
            bg-mint-50 dark:bg-dark-bg
            px-[5%] lg:px-[8%] py-2
            transition-colors duration-300
        "
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
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
                </div>

                {/* RIGHT */}
                <button
                    onClick={() => setIsDark(!isDark)}
                    className="
            p-2 rounded-lg
            bg-mint-50 dark:bg-dark-card
            border
            border-mint-200 dark:border-dark-border/20
            text-kost-muted dark:text-mint-100/60
            hover:bg-mint-100 dark:hover:bg-dark-card/60
            transition
        "
                    aria-label="Toggle dark mode"
                >
                    {isDark ? (
                        <Sun className="w-4 h-4 text-mint-200" />
                    ) : (
                        <Moon className="w-4 h-4" />
                    )}
                </button>
            </div>

            <div
                className="
                sticky top-0 z-20 space-y-2 pb-3 pt-1
                bg-mint-50/95 dark:bg-dark-bg/95 backdrop-blur-md
            "
            >
                {/* Search input */}
                <SearchBar
                    keyword={keyword}
                    setKeyword={setKeyword}
                    onSearch={handleSearch}
                    onClear={handleClear}
                    onSelectLocation={(loc) => {
    const lat = Number(loc.lat);
    const lng = Number(loc.lng);

    setKeyword(loc.name);
    setAppliedKeyword(loc.name);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setPosition({ lat, lng });
        setSelectedLocation(loc);
    } else {
        setPosition(null);
        setSelectedLocation(null);
    }
}}
                />

                {/* Radius control */}
                <RadiusControl
                    radius={radius}
                    setRadius={setRadius}
                    position={position}
                    onClearPosition={handleClear}
                />

                {/* Mobile: result count + filter toggle */}
                <div className="flex items-center justify-between lg:hidden">
                    <p className="text-xs text-kost-muted dark:text-mint-100/50">
                        {isLoading ? (
                            <span className="flex items-center gap-1 text-mint-300">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Mencari...
                            </span>
                        ) : (
                            <>
                                <strong className="text-kost-dark dark:text-mint-50">
                                    {filtered.length}
                                </strong>{" "}
                                kos ditemukan
                            </>
                        )}
                    </p>

                    <button
                        onClick={() => setShowFilter(true)}
                        className="
                            flex items-center gap-1.5 px-3 py-1.5
                            rounded-lg text-xs transition
                            bg-white dark:bg-dark-card
                            border border-mint-200 dark:border-dark-border/20
                            text-kost-dark dark:text-mint-50
                            hover:bg-mint-50 dark:hover:bg-dark-bg
                        "
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filter
                        {activeCount > 0 && (
                            <span
                                className="
                                w-4 h-4 rounded-full text-[10px] font-medium
                                flex items-center justify-center
                                bg-mint-300 text-white
                            "
                            >
                                {activeCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <MobileFilterDrawer
                open={showFilter}
                onClose={() => setShowFilter(false)}
            >
                {sidebar}
            </MobileFilterDrawer>

            <div className="flex gap-5 mt-4">
                {/* Filter — desktop */}
                <aside className="hidden lg:block w-[256px] flex-shrink-0">
                    {sidebar}
                </aside>

                {/* Results */}
                <main className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <ResultHeader
                            count={filtered.length}
                            keyword={appliedKeyword}
                            isLoading={isLoading}
                        />
                        <SortDropdown value={sortBy} onChange={setSortBy} />
                    </div>

                    {/* Active filter chips */}
                    <FilterChips
                        applied={applied}
                        onRemoveType={() => patchApplied({ type: "all" })}
                        onRemovePrice={() =>
                            patchApplied({ maxPrice: 2000000 })
                        }
                        onRemoveFacility={(f) =>
                            patchApplied({
                                facilities: applied.facilities.filter(
                                    (x) => x !== f,
                                ),
                            })
                        }
                        onClearAll={handleReset}
                    />

                    <div className="flex items-center gap-2 flex-wrap">
    <button
    onClick={handleWishlistFilter}
        className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition border
            ${
                applied.wishlistOnly
                    ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-500"
                    : "bg-white dark:bg-dark-card border-mint-200 dark:border-dark-border/20 text-kost-muted dark:text-mint-100/50"
            }
        `}
    >
        <Heart
            className={`w-4 h-4 ${
                applied.wishlistOnly ? "fill-red-500" : ""
            }`}
        />

        Wishlist
    </button>
</div>

                    {/* List */}
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : filtered.length > 0 ? (
                        <div className="space-y-3">
                            {filtered.map((kos) => (
                                <KosCard key={kos.id} kos={kos} />
                            ))}
                            <Pagination links={properties.links} />
                        </div>
                    ) : (
                        <EmptyState
                            onReset={handleReset}
                            keyword={appliedKeyword}
                        />
                    )}
                </main>

                {/* Map — desktop */}
                <aside className="hidden lg:block w-[32%] flex-shrink-0 h-[680px] sticky top-28">
                    <MapView
                        properties={filtered}
                        position={position}
                        radius={radius}
                    />
                </aside>
            </div>
        </div>
    );
}
