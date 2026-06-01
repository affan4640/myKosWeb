import { router } from "@inertiajs/react";
import { Eye, Trash2, CreditCard, Home, CalendarDays, Wallet } from "lucide-react";

const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(value ?? 0);

const StatusBadge = ({ status }) => {
    const statusClass =
        status === "paid"
            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
            : status === "waiting_verification"
            ? "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"
              : "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border-red-200 dark:border-red-500/20";

    const label =
        status === "paid"
            ? "Lunas"
            : status === "waiting_verification"
            ? "Pending"
            : status === "unpaid"
            ? "Belum Dibayar"
            : "Terlambat";

    return (
        <span
            className={`
                px-3 py-1 rounded-full text-xs font-medium border capitalize
                ${statusClass}
            `}
        >
            {label}
        </span>
    );
};

const UserAvatar = ({ name }) => (
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

const ActionButton = ({ id }) => {
    return (
        <button
            type="button"
            onClick={() => router.get(route("admin.transactions.detail", id))}
            className={`
                p-2 rounded-lg transition group
                bg-mint-50 dark:bg-dark-bg
                border border-mint-200 dark:border-dark-border/20
            `}
        >
            <Eye className="w-4 h-4 text-kost-muted dark:text-mint-100/40 group-hover:text-kost-dark dark:group-hover:text-mint-50" />
        </button>
    );
};

export default function TableTransaksi({ transactions = [] }) {
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
                    <thead className="uppercase tracking-wider">
                        <tr className="border-b border-mint-200 dark:border-dark-border/20">
                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Nama
                            </th>
                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Kos
                            </th>
                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Tanggal
                            </th>
                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Total
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
                        {transactions.length > 0 ? (
                            transactions.map((trx) => (
                                <tr
                                    key={trx.id}
                                    className="
                                        border-b last:border-0
                                        border-mint-200 dark:border-dark-border/20
                                        hover:bg-mint-50 dark:hover:bg-dark-bg
                                        transition
                                    "
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar name={trx.contract.tenant.name} />

                                            <span className="text-sm font-medium text-kost-dark dark:text-mint-50 capitalize">
                                                {trx.contract.tenant.name || "-"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-4 text-sm text-kost-muted dark:text-mint-100/50">
                                        {trx.contract.room_type.property.name || "-"}
                                    </td>

                                    <td className="p-4 text-sm text-kost-muted dark:text-mint-100/50">
                                        {trx.updated_at 
                                        ? new Date(trx.updated_at).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })
                                        : '-'}
                                    </td>

                                    <td className="p-4 text-sm text-kost-muted dark:text-mint-100/50">
                                        {formatRupiah(trx.amount)}
                                    </td>

                                    <td className="p-4">
                                        <StatusBadge status={trx.status} />
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <ActionButton id={trx.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-14">
                                    <div className="flex flex-col items-center gap-2">
                                        <CreditCard className="w-8 h-8 text-mint-200 dark:text-mint-200/30" />
                                        <p className="text-sm text-kost-muted dark:text-mint-100/30">
                                            Tidak ada transaksi
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3">
                {transactions.length > 0 ? (
                    transactions.map((trx) => (
                        <div
                            key={trx.id}
                            className="
                                rounded-xl p-3
                                bg-white dark:bg-dark-card
                                border border-mint-200 dark:border-dark-border/20
                                transition-colors duration-300
                            "
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <UserAvatar name={trx.contract.tenant.name} />

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-kost-dark dark:text-mint-50 capitalize truncate">
                                            {trx.contract.tenant.name || "-"}
                                        </p>

                                        <div className="mt-1">
                                            <StatusBadge status={trx.status} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <ActionButton id={trx.id}/>
                                </div>
                            </div>

                            <div className="space-y-2 pl-12">
                                <div className="flex items-center gap-2 text-xs text-kost-muted dark:text-mint-100/50">
                                    <Home className="w-3.5 h-3.5 flex-shrink-0 text-mint-300" />
                                    <span className="truncate">
                                        {trx.contract.room_type.property.name || "-"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-kost-muted dark:text-mint-100/50">
                                    <CalendarDays className="w-3.5 h-3.5 flex-shrink-0 text-mint-300" />
                                    <span>{trx.updated_at
                                        ? new Date(trx.updated_at).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })
                                    : '-'}</span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-kost-muted dark:text-mint-100/50">
                                    <Wallet className="w-3.5 h-3.5 flex-shrink-0 text-mint-300" />
                                    <span>{formatRupiah(trx.amount)}</span>
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
                        <CreditCard className="w-8 h-8 text-mint-200 dark:text-mint-200/30" />
                        <p className="text-sm text-kost-muted dark:text-mint-100/30">
                            Tidak ada transaksi
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}