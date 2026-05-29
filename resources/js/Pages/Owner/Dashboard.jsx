import OwnerLayout from "@/Layouts/OwnerLayout";
import {
    Home,
    BedDouble,
    CheckCircle,
    Wallet,
    AlertTriangle,
    Star,
    CreditCard,
    ArrowUpRight,
    TrendingUp,
    MessageSquare,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { Link, usePage } from "@inertiajs/react";

const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value ?? 0);

const StatCard = ({ title, value, subtitle, icon: Icon, accent = false }) => (
    <div
        className={`
        rounded-2xl p-5 transition
        bg-white dark:bg-dark-card
        border
        ${
            accent
                ? "border-mint-300 dark:border-mint-300/30"
                : "border-mint-200 dark:border-dark-border/20"
        }
    `}
    >
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <p className="text-xs text-kost-muted dark:text-mint-100/40">
                    {title}
                </p>
                <h3 className="text-xl font-medium text-kost-dark dark:text-mint-50 mt-1.5 truncate">
                    {value}
                </h3>
                {subtitle && (
                    <p className="text-xs text-kost-muted dark:text-mint-100/30 mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
            <div
                className="
                w-10 h-10 rounded-xl flex-shrink-0
                flex items-center justify-center
                bg-mint-100 dark:bg-mint-200/10
                border border-mint-200 dark:border-mint-300/20
            "
            >
                <Icon className="w-5 h-5 text-mint-300" />
            </div>
        </div>
    </div>
);

const SectionCard = ({ title, children, action, className = "" }) => (
    <div
        className={`
        rounded-2xl p-5 h-full
        bg-white dark:bg-dark-card
        border border-mint-200 dark:border-dark-border/20
        transition-colors duration-300
        ${className}
    `}
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-kost-dark dark:text-mint-50">
                {title}
            </h3>
            {action}
        </div>
        {children}
    </div>
);

// const RevenueChart = ({ data }) => {
//     const isDark = document.documentElement.classList.contains("dark");
//     const axisColor = isDark ? "#6b9e94" : "#7aa080";

//     const CustomTooltip = ({ active, payload, label }) => {
//         if (!active || !payload?.length) return null;
//         return (
//             <div
//                 className="
//                 px-3 py-2 rounded-lg text-xs
//                 bg-white dark:bg-dark-card
//                 border border-mint-200 dark:border-dark-border/20
//             "
//             >
//                 <p className="text-kost-muted dark:text-mint-100/40 mb-1">
//                     {label}
//                 </p>
//                 <p className="font-medium text-kost-dark dark:text-mint-50">
//                     {formatRupiah(payload[0].value)}
//                 </p>
//             </div>
//         );
//     };

//     return (
//         <SectionCard
//             title="Revenue 6 Bulan Terakhir"
//             action={
//                 <span className="flex items-center gap-1 text-xs text-mint-300">
//                     <TrendingUp className="w-3.5 h-3.5" />
//                     Bulan ini
//                 </span>
//             }
//         >
//             <ResponsiveContainer width="100%" height={220}>
//                 <LineChart
//                     data={data}
//                     margin={{ top: 8, right: 12, left: -15, bottom: 0 }}
//                 >
//                     <CartesianGrid
//                         strokeDasharray="3 3"
//                         stroke="#ABE7B2"
//                         opacity={0.18}
//                         vertical={false}
//                     />
//                     <XAxis
//                         dataKey="name"
//                         tick={{ fill: axisColor, fontSize: 12 }}
//                         axisLine={false}
//                         tickLine={false}
//                     />
//                     <YAxis
//                         tick={{ fill: axisColor, fontSize: 12 }}
//                         axisLine={false}
//                         tickLine={false}
//                         tickFormatter={(v) => `${v / 1000000}jt`}
//                     />
//                     <Tooltip
//                         content={<CustomTooltip />}
//                         cursor={{
//                             stroke: "#93BFC7",
//                             strokeWidth: 1,
//                             strokeDasharray: "4 4",
//                             opacity: 0.5,
//                         }}
//                     />
//                     <Line
//                         type="monotone"
//                         dataKey="revenue"
//                         stroke="#93BFC7"
//                         strokeWidth={2.5}
//                         dot={{ fill: "#93BFC7", r: 4, strokeWidth: 0 }}
//                         activeDot={{ fill: "#93BFC7", r: 6, strokeWidth: 0 }}
//                     />
//                 </LineChart>
//             </ResponsiveContainer>
//         </SectionCard>
//     );
// };

const OccupancyCard = ({ occupied, total }) => {
    const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
    const color =
        pct >= 80 ? "bg-mint-300" : pct >= 50 ? "bg-yellow-400" : "bg-red-400";

    return (
        <SectionCard title="Occupancy Rate">
            <div className="flex flex-col items-center justify-center py-4">
                {/* Circle */}
                <div className="relative w-32 h-32 mb-4">
                    <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 120 120"
                    >
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="#ECF4E8"
                            strokeWidth="12"
                            className="dark:opacity-20"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="#93BFC7"
                            strokeWidth="12"
                            strokeDasharray={`${pct * 3.14} 314`}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-2xl font-medium text-kost-dark dark:text-mint-50">
                            {pct}%
                        </p>
                        <p className="text-[10px] text-kost-muted dark:text-mint-100/40">
                            Terisi
                        </p>
                    </div>
                </div>

                <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs text-kost-muted dark:text-mint-100/40">
                        <span>{occupied} terisi</span>
                        <span>{total - occupied} kosong</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-mint-100 dark:bg-dark-bg overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ${color}`}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};

const activityColor = (type) =>
    ({
        review: "bg-mint-200",
        // payment: "bg-mint-300",
        complaint: "bg-red-400",
        booking: "bg-yellow-400",
    })[type] ?? "bg-mint-200";

export default function Dashboard() {
    const {
        stats = {},
        // revenueData = [],
        recentReviews = [],
        // recentPayments = [],
        complaints = [],
        activities = [],
    } = usePage().props;

    const sortedActivities = [...activities].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    return (
        <OwnerLayout>
            <div className="space-y-5">
                <div>
                    <h1 className="text-lg font-medium text-kost-dark dark:text-mint-50">
                        Dashboard
                    </h1>
                    <p className="text-sm text-kost-muted dark:text-mint-100/40 mt-0.5">
                        Ringkasan performa kos dan operasional Anda.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard
                        title="Properti Aktif"
                        value={stats.totalProperties ?? 0}
                        subtitle="Kos yang dikelola"
                        icon={Home}
                    />
                    <StatCard
                        title="Kamar Terisi"
                        value={`${stats.occupiedRooms ?? 0}/${stats.totalRooms ?? 0}`}
                        subtitle="Kontrak aktif"
                        icon={CheckCircle}
                    />
                    <StatCard
                        title="Pendapatan Bulan Ini"
                        value={formatRupiah(stats.monthlyRevenue)}
                        icon={Wallet}
                        accent
                    />
                    <StatCard
                        title="Pendapatan Keseluruhan"
                        value={formatRupiah(stats.totalRevenue)}
                        icon={Wallet}
                    />
                </div>

                {/* <div className="grid lg:grid-cols-3 gap-4">
                    {/* <div className="lg:col-span-2">
                        <RevenueChart data={revenueData} />
                    </div>
                    <OccupancyCard
                        occupied={stats.occupiedRooms ?? 0}
                        total={stats.totalRooms ?? 0}
                    /> *
                </div> */}

                <div className="grid lg:grid-cols-3 gap-4">
                    <SectionCard title="Aktivitas Terbaru">
                        {sortedActivities.length > 0 ? (
                            <div className="space-y-3">
                                {sortedActivities.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3"
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activityColor(item.type)}`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-kost-dark dark:text-mint-50 truncate">
                                                {item.text}
                                            </p>
                                            <p className="text-xs text-kost-muted dark:text-mint-100/40 mt-0.5">
                                                {item.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-kost-muted dark:text-mint-100/40">
                                Belum ada aktivitas
                            </p>
                        )}
                    </SectionCard>

                    <SectionCard
                        title="Keluhan Pending"
                        action={
                            stats.pendingComplaints > 0 && (
                                <span className="text-xs text-red-400 font-medium">
                                    {stats.pendingComplaints} pending
                                </span>
                            )
                        }
                    >
                        {complaints.length > 0 ? (
                            <div className="space-y-2">
                                {complaints.map((item) => (
                                    <div
                                        key={item.id}
                                        className="
                                        flex items-center justify-between gap-3 p-3 rounded-xl
                                        bg-mint-50 dark:bg-dark-bg
                                        border border-mint-200 dark:border-dark-border/20
                                    "
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                            <p className="text-sm text-kost-dark dark:text-mint-50 truncate">
                                                {item.title}
                                            </p>
                                        </div>
                                        <span className="text-xs text-kost-muted dark:text-mint-100/40 flex-shrink-0">
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-kost-muted dark:text-mint-100/40">
                                Tidak ada keluhan pending
                            </p>
                        )}
                    </SectionCard>

                    <SectionCard title="Aksi Cepat">
                        <div className="grid gap-2">
                            {[
                                {
                                    label: "Tambah Tipe Kamar",
                                    href: "/owner/room-types/create",
                                },
                                {
                                    label: "Lihat Keluhan",
                                    href: "/owner/complaints",
                                },
                                // {
                                //     label: "Lihat Pembayaran",
                                //     href: "/owner/payments",
                                // },
                                {
                                    label: "Lihat Ulasan",
                                    href: "/owner/reviews",
                                },
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="
                    flex items-center justify-between p-3 rounded-xl text-sm transition
                    bg-mint-50 dark:bg-dark-bg
                    border border-mint-200 dark:border-dark-border/20
                    text-kost-dark dark:text-mint-50
                    hover:bg-mint-100 dark:hover:bg-dark-card
                "
                                >
                                    {item.label}
                                    <ArrowUpRight className="w-4 h-4 text-mint-300" />
                                </Link>
                            ))}
                        </div>
                    </SectionCard>
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                    <SectionCard
                        title="Review Terbaru"
                        action={
                            stats.avgRating > 0 && (
                                <div className="flex items-center gap-1 text-xs text-yellow-500">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-400" />
                                    <span>{stats.avgRating}</span>
                                </div>
                            )
                        }
                    >
                        {recentReviews.length > 0 ? (
                            <div className="space-y-3">
                                {recentReviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="
                                        p-3 rounded-xl
                                        bg-mint-50 dark:bg-dark-bg
                                        border border-mint-200 dark:border-dark-border/20
                                    "
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-sm font-medium text-kost-dark dark:text-mint-50 capitalize">
                                                {review.user?.name ?? "Anonim"}
                                            </p>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300 dark:stroke-mint-100/20"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-xs text-kost-muted dark:text-mint-100/50 line-clamp-2">
                                                "{review.comment}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 py-8">
                                <MessageSquare className="w-8 h-8 text-mint-200 dark:text-mint-200/30" />
                                <p className="text-xs text-kost-muted dark:text-mint-100/40">
                                    Belum ada review
                                </p>
                            </div>
                        )}
                    </SectionCard>

                    {/* <SectionCard title="Pembayaran Terbaru">
                        {recentPayments.length > 0 ? (
                            <div className="space-y-2">
                                {recentPayments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="
                                        flex items-center justify-between p-3 rounded-xl
                                        bg-mint-50 dark:bg-dark-bg
                                        border border-mint-200 dark:border-dark-border/20
                                    "
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className="
                                                w-8 h-8 rounded-lg flex-shrink-0
                                                flex items-center justify-center
                                                bg-mint-100 dark:bg-mint-200/10
                                                border border-mint-200 dark:border-mint-300/20
                                            "
                                            >
                                                <CreditCard className="w-4 h-4 text-mint-300" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-kost-dark dark:text-mint-50 truncate capitalize">
                                                    {payment.contract?.user
                                                        ?.name ?? "-"}
                                                </p>
                                                <p className="text-xs text-kost-muted dark:text-mint-100/40">
                                                    {formatRupiah(
                                                        payment.amount,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <span
                                            className={`
                                            text-xs flex-shrink-0 px-2 py-0.5 rounded-full font-medium
                                            ${
                                                payment.status === "paid"
                                                    ? "bg-mint-100 dark:bg-mint-200/10 text-kost-dark dark:text-mint-100"
                                                    : "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                            }
                                        `}
                                        >
                                            {payment.status === "paid"
                                                ? "Lunas"
                                                : "Menunggu"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 py-8">
                                <CreditCard className="w-8 h-8 text-mint-200 dark:text-mint-200/30" />
                                <p className="text-xs text-kost-muted dark:text-mint-100/40">
                                    Belum ada pembayaran
                                </p>
                            </div>
                        )}
                    </SectionCard> */}
                </div>
            </div>
        </OwnerLayout>
    );
}
