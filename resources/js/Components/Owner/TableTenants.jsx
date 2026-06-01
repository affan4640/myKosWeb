import {
    Pencil,
    Trash2,
    Phone,
    CalendarDays,
    Mail,
    Bed,
    Users,
} from "lucide-react";

const getStatusColor = (status) => {
    switch (status) {
        case "active":
            return "bg-mint-200/60 text-kost-dark dark:bg-mint-200/20 dark:text-mint-100 border-mint-200 dark:border-mint-300/20";
        case "pending":
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20";
        case "expired":
            return "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20";
        default:
            return "bg-mint-50 text-kost-muted dark:bg-dark-bg dark:text-mint-100/60 border-mint-200 dark:border-dark-border/20";
    }
};

const StatusBadge = ({ status }) => (
    <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(
            status || "active",
        )}`}
    >
        {status || "active"}
    </span>
);

const TenantAvatar = ({ name }) => (
    <div
        className="
            w-9 h-9 rounded-full flex-shrink-0
            flex items-center justify-center
            text-sm font-medium capitalize
            bg-mint-200 dark:bg-mint-200/20
            text-kost-dark dark:text-mint-50
        "
    >
        {name?.charAt(0) || "?"}
    </div>
);

const ActionButtons = () => (
    <div className="flex justify-end gap-2">
        <button
            type="button"
            className="
                p-2 rounded-lg transition group
                bg-mint-50 dark:bg-dark-bg
                border border-mint-200 dark:border-dark-border/20
                hover:bg-mint-200 dark:hover:bg-mint-200/20
            "
        >
            <Pencil
                className="
                    w-4 h-4
                    text-kost-muted dark:text-mint-100/40
                    group-hover:text-kost-dark dark:group-hover:text-mint-50
                "
            />
        </button>

        <button
            type="button"
            className="
                p-2 rounded-lg transition group
                bg-mint-50 dark:bg-dark-bg
                border border-mint-200 dark:border-dark-border/20
                hover:bg-red-50 dark:hover:bg-red-500/10
                hover:border-red-200 dark:hover:border-red-500/20
            "
        >
            <Trash2
                className="
                    w-4 h-4
                    text-kost-muted dark:text-mint-100/40
                    group-hover:text-red-400
                "
            />
        </button>
    </div>
);

export default function TableTenants({ tenants = [] }) {
    return (
        <div className="mt-8">
            <div
                className="
                    rounded-xl overflow-hidden
                    bg-white dark:bg-dark-card
                    border border-mint-200 dark:border-dark-border/20
                    transition-colors duration-300
                "
            >
                <div className="flex items-center justify-between px-4 py-4 border-b border-mint-200 dark:border-dark-border/20">
                    <div>
                        <h2 className="text-sm font-semibold text-kost-dark dark:text-mint-50">
                            Daftar Penyewa
                        </h2>
                        <p className="text-xs text-kost-muted dark:text-mint-100/40 mt-1">
                            Semua data penghuni kos aktif.
                        </p>
                    </div>

                    <span
                        className="
                            px-3 py-1 rounded-full text-xs font-medium
                            bg-mint-200/60 text-kost-dark
                            dark:bg-mint-200/20 dark:text-mint-100
                        "
                    >
                        {tenants.length} Penyewa
                    </span>
                </div>

                <div className="hidden md:block">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-mint-200 dark:border-dark-border/20">
                                <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                    Penyewa
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                    No. Telp
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                    Tipe Kamar
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                    Tanggal Sewa
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                    Tanggal Keluar
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
                            {tenants.length > 0 ? (
                                tenants.map((tenant) => (
                                    <tr
                                        key={tenant.id}
                                        className="
                                            border-b last:border-0
                                            border-mint-200 dark:border-dark-border/20
                                            hover:bg-mint-50 dark:hover:bg-dark-bg
                                            transition
                                        "
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <TenantAvatar
                                                    name={tenant.name}
                                                />

                                                <div>
                                                    <p className="text-sm font-medium text-kost-dark dark:text-mint-50 capitalize">
                                                        {tenant.name || "-"}
                                                    </p>
                                                    <p className="text-xs text-kost-muted dark:text-mint-100/40 mt-0.5">
                                                        {tenant.email || "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-kost-muted dark:text-mint-100/50">
                                                <Phone className="w-4 h-4 text-kost-muted dark:text-mint-100/40" />
                                                {tenant.phone || "-"}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <span
                                                className="
                                                    px-3 py-1 rounded-full text-xs font-medium
                                                    bg-mint-200/50 text-kost-dark
                                                    dark:bg-mint-200/10 dark:text-mint-100
                                                "
                                            >
                                                {tenant.room_type?.name || "-"}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-kost-muted dark:text-mint-100/50">
                                                <CalendarDays className="w-4 h-4 text-kost-muted dark:text-mint-100/40" />
                                                {tenant.check_in || "-"}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-kost-muted dark:text-mint-100/50">
                                                <CalendarDays className="w-4 h-4 text-kost-muted dark:text-mint-100/40" />
                                                {tenant.check_out || "-"}
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            <StatusBadge
                                                status={tenant.status}
                                            />
                                        </td>

                                        <td className="p-4">
                                            <ActionButtons />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-12"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="
                                                    w-12 h-12 rounded-xl
                                                    bg-mint-50 dark:bg-dark-bg
                                                    flex items-center justify-center
                                                    mb-3
                                                "
                                            >
                                                <Users className="w-6 h-6 text-mint-200 dark:text-mint-200/30" />
                                            </div>

                                            <p className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                                Belum Ada Penyewa
                                            </p>

                                            <p className="text-sm text-kost-muted dark:text-mint-100/30 mt-1">
                                                Data penghuni kos akan muncul di
                                                sini.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden p-3 space-y-3">
                    {tenants.length > 0 ? (
                        tenants.map((tenant) => (
                            <div
                                key={tenant.id}
                                className="
                                    rounded-xl p-3
                                    bg-mint-50 dark:bg-dark-bg
                                    border border-mint-200 dark:border-dark-border/20
                                "
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <TenantAvatar name={tenant.name} />

                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-kost-dark dark:text-mint-50 capitalize truncate">
                                                {tenant.name || "-"}
                                            </p>

                                            <div className="mt-1">
                                                <StatusBadge
                                                    status={tenant.status}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <ActionButtons />
                                    </div>
                                </div>

                                <div className="space-y-2 pl-12">
                                    <div className="flex items-center gap-2 text-xs text-kost-muted dark:text-mint-100/50">
                                        <Mail className="w-3.5 h-3.5 flex-shrink-0 text-mint-300" />
                                        <span className="truncate">
                                            {tenant.email || "-"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-kost-muted dark:text-mint-100/50">
                                        <Phone className="w-3.5 h-3.5 flex-shrink-0 text-mint-300" />
                                        <span className="truncate">
                                            {tenant.phone || "-"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-kost-muted dark:text-mint-100/50">
                                        <Bed className="w-3.5 h-3.5 flex-shrink-0 text-mint-300" />
                                        <span className="truncate">
                                            {tenant.room_type?.name || "-"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-kost-muted dark:text-mint-100/50">
                                        <CalendarDays className="w-3.5 h-3.5 flex-shrink-0 text-mint-300" />
                                        <span>{tenant.check_in || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            className="
                                flex flex-col items-center justify-center py-12 gap-2
                                rounded-xl border border-dashed
                                border-mint-200 dark:border-dark-border/20
                                bg-mint-50 dark:bg-dark-bg
                            "
                        >
                            <Users className="w-8 h-8 text-mint-200 dark:text-mint-200/30" />

                            <p className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                Belum Ada Penyewa
                            </p>

                            <p className="text-xs text-kost-muted dark:text-mint-100/30">
                                Data penghuni kos akan muncul di sini.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
