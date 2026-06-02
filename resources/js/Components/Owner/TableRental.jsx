import { Link } from "@inertiajs/react";
import {
    Eye,
    Home,
    User,
    Bed,
    CalendarDays,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";

const StatusBadge = ({ status }) => {
    const isApproved = status === "approved";
    const isRejected = status === "rejected";

    return (
        <span
            className={`
                px-3 py-1 rounded-full text-xs font-medium border
                ${
                    isApproved
                        ? "bg-mint-200/60 dark:bg-mint-200/20 text-kost-dark dark:text-mint-100 border-mint-200 dark:border-mint-300/20"
                        : isRejected
                          ? "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border-red-200 dark:border-red-500/20"
                          : "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"
                }
            `}
        >
            {isApproved ? "Disetujui" : isRejected ? "Ditolak" : "Menunggu"}
        </span>
    );
};

const StatusIcon = ({ status }) => {
    if (status === "approved") {
        return <CheckCircle className="w-3.5 h-3.5 text-mint-300" />;
    }

    if (status === "rejected") {
        return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    }

    return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
};

const TenantAvatar = () => (
    <div
        className="
            w-9 h-9 rounded-lg flex-shrink-0
            flex items-center justify-center
            bg-mint-100 dark:bg-mint-200/10
            border border-mint-200 dark:border-mint-300/20
            text-mint-300 dark:text-mint-200
        "
    >
        <User size={16} />
    </div>
);

const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatDuration = (rental) => {
    if (!rental.duration_value || !rental.duration_type) return "-";

    return `${rental.duration_value} ${
        rental.duration_type === "monthly" ? "Bulan" : "Hari"
    }`;
};

export default function TableRental({ rentals = [] }) {
    return (
        <div className="mt-8">
            <div
                className="
                    hidden md:block
                    rounded-xl overflow-hidden
                    bg-white dark:bg-dark-card
                    border border-mint-200 dark:border-dark-border/20
                    transition-colors duration-300
                "
            >
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-mint-200 dark:border-dark-border/20">
                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Nama Penyewa
                            </th>
                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Tipe Kamar Dipilih
                            </th>
                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Tanggal Mulai Sewa
                            </th>
                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Durasi
                            </th>
                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Status
                            </th>
                            <th className="p-4 text-right text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {rentals.length > 0 ? (
                            rentals.map((rental) => (
                                <tr
                                    key={rental.id}
                                    className="
                                        border-b last:border-0
                                        border-mint-200 dark:border-dark-border/20
                                        hover:bg-mint-50 dark:hover:bg-dark-bg
                                        transition
                                    "
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <TenantAvatar />

                                            <span className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                                {rental.tenant?.name || "-"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-4 text-sm text-kost-muted dark:text-mint-100/50">
                                        {rental.room_type?.name || "-"}
                                    </td>

                                    <td className="p-4 text-sm text-kost-muted dark:text-mint-100/50">
                                        {formatDate(rental.start_date)}
                                    </td>

                                    <td className="p-4 text-sm text-kost-muted dark:text-mint-100/50">
                                        {formatDuration(rental)}
                                    </td>

                                    <td className="p-4">
                                        <StatusBadge status={rental.status} />
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-end">
                                            <Link
                                                href={`/owner/rental-request/detail/${rental.id}`}
                                                className="
                                                    inline-flex items-center gap-2
                                                    px-3 py-1.5 rounded-lg text-sm
                                                    font-medium transition group
                                                    bg-mint-50 dark:bg-dark-bg
                                                    border border-mint-200 dark:border-dark-border/20
                                                    text-kost-muted dark:text-mint-100/50
                                                    hover:bg-mint-200 dark:hover:bg-mint-200/20
                                                    hover:border-mint-300 dark:hover:border-mint-300/30
                                                    hover:text-kost-dark dark:hover:text-mint-50
                                                "
                                            >
                                                <Eye className="w-4 h-4" />
                                                Review
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-14">
                                    <div className="flex flex-col items-center gap-2">
                                        <Home className="w-8 h-8 text-mint-200 dark:text-mint-200/30" />
                                        <p className="text-sm text-kost-muted dark:text-mint-100/30">
                                            Tidak ada data pengajuan
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3">
                {rentals.length > 0 ? (
                    rentals.map((rental) => (
                        <div
                            key={rental.id}
                            className="
                                rounded-xl p-3
                                bg-white dark:bg-dark-card
                                border border-mint-200 dark:border-dark-border/20
                                transition-colors duration-300
                            "
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <TenantAvatar />

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-kost-dark dark:text-mint-50 truncate">
                                            {rental.tenant?.name || "-"}
                                        </p>

                                        <div className="flex items-center gap-2 mt-1">
                                            <StatusIcon status={rental.status} />
                                            <StatusBadge status={rental.status} />
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/owner/rental-request/${rental.id}`}
                                    className="
                                        flex-shrink-0 inline-flex items-center gap-1.5
                                        px-3 py-1.5 rounded-lg text-xs
                                        font-medium transition group
                                        bg-mint-50 dark:bg-dark-bg
                                        border border-mint-200 dark:border-dark-border/20
                                        text-kost-muted dark:text-mint-100/50
                                        hover:bg-mint-200 dark:hover:bg-mint-200/20
                                        hover:text-kost-dark dark:hover:text-mint-50
                                    "
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    Review
                                </Link>
                            </div>

                            <div className="space-y-2 pl-12">
                                <div className="flex items-center gap-2 text-xs text-kost-muted dark:text-mint-100/50">
                                    <Bed className="w-3.5 h-3.5 flex-shrink-0 text-mint-300" />
                                    <span className="truncate">
                                        {rental.roomType?.name || "-"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-kost-muted dark:text-mint-100/50">
                                    <CalendarDays className="w-3.5 h-3.5 flex-shrink-0 text-mint-300" />
                                    <span>
                                        Mulai: {formatDate(rental.start_date)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-kost-muted dark:text-mint-100/50">
                                    <Clock className="w-3.5 h-3.5 flex-shrink-0 text-mint-300" />
                                    <span>
                                        Durasi: {formatDuration(rental)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div
                        className="
                            flex flex-col items-center justify-center py-14 gap-2
                            rounded-xl border border-dashed
                            border-mint-200 dark:border-dark-border/20
                            bg-white dark:bg-dark-card
                        "
                    >
                        <Home className="w-8 h-8 text-mint-200 dark:text-mint-200/30" />
                        <p className="text-sm text-kost-muted dark:text-mint-100/30">
                            Tidak ada data pengajuan
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}