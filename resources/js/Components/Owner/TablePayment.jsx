import { Link } from "@inertiajs/react";
import {
    Building2,
    CreditCard,
    User,
    Wallet,
    Calendar,
    CheckCircle2,
    XCircle,
} from "lucide-react";

export default function TablePayment({ payments }) {

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="mt-8">

            {/* DESKTOP */}
            <div className="
                hidden md:block rounded-xl overflow-hidden
                bg-white dark:bg-dark-card
                border border-mint-200 dark:border-dark-border/20
            ">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-mint-200 dark:border-dark-border/20">
                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Penyewa
                            </th>

                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Kos
                            </th>

                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Metode
                            </th>

                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Jumlah
                            </th>

                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Status
                            </th>

                            <th className="p-4 text-left text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Tanggal
                            </th>

                            <th className="p-4 text-right text-xs font-medium text-kost-muted dark:text-mint-100/40">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {payments.length > 0 ? (
                            payments.map((payment) => (
                                <tr
                                    key={payment.id}
                                    className="
                                        border-b last:border-0
                                        border-mint-200 dark:border-dark-border/20
                                        hover:bg-mint-50 dark:hover:bg-dark-bg
                                        transition
                                    "
                                >

                                    {/* TENANT */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="
                                                w-8 h-8 rounded-full
                                                flex items-center justify-center
                                                bg-mint-100 dark:bg-mint-200/10
                                                text-mint-300 dark:text-mint-200
                                            ">
                                                <User size={15} />
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                                    {payment.invoice?.contract?.tenant?.name}
                                                </p>

                                                <p className="text-xs text-kost-muted dark:text-mint-100/40">
                                                    {payment.invoice?.contract?.tenant?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* PROPERTY */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Building2
                                                className="w-4 h-4 text-mint-300"
                                            />

                                            <span className="text-sm text-kost-dark dark:text-mint-50">
                                                {
                                                    payment.invoice?.contract
                                                        ?.room_type?.property?.name
                                                }
                                            </span>
                                        </div>
                                    </td>

                                    {/* PAYMENT METHOD */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <CreditCard
                                                className="w-4 h-4 text-mint-300"
                                            />

                                            <div>
                                                <p className="text-sm text-kost-dark dark:text-mint-50">
                                                    {payment.payment_method}
                                                </p>

                                                <p className="text-xs text-kost-muted dark:text-mint-100/40">
                                                    {payment.payment_channel}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* AMOUNT */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Wallet
                                                className="w-4 h-4 text-mint-300"
                                            />

                                            <span className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                                {formatCurrency(payment.paid_amount)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-4">
                                        {payment.status === 'paid' ? (
                                            <div className="
                                                inline-flex items-center gap-1.5
                                                px-3 py-1 rounded-full text-xs
                                                bg-green-100 dark:bg-green-500/10
                                                text-green-600 dark:text-green-400
                                            ">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Paid
                                            </div>
                                        ) : (
                                            <div className="
                                                inline-flex items-center gap-1.5
                                                px-3 py-1 rounded-full text-xs
                                                bg-red-100 dark:bg-red-500/10
                                                text-red-600 dark:text-red-400
                                            ">
                                                <XCircle className="w-3.5 h-3.5" />
                                                {payment.status}
                                            </div>
                                        )}
                                    </td>

                                    {/* DATE */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar
                                                className="w-4 h-4 text-mint-300"
                                            />

                                            <span className="text-sm text-kost-muted dark:text-mint-100/50">
                                                {formatDate(payment.paid_at)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* ACTION */}
                                    <td className="p-4">
                                        <div className="flex justify-end">
                                            <Link
                                                href={`/owner/payments/detail/${payment.id}`}
                                                className="
                                                    inline-flex items-center gap-2
                                                    px-3 py-1.5 rounded-lg text-sm transition
                                                    bg-mint-50 dark:bg-dark-bg
                                                    border border-mint-200 dark:border-dark-border/20
                                                    text-kost-muted dark:text-mint-100/50
                                                    hover:bg-mint-200 dark:hover:bg-mint-200/20
                                                    hover:text-kost-dark dark:hover:text-mint-50
                                                "
                                            >
                                                Detail
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-14"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Wallet className="w-8 h-8 text-mint-200 dark:text-mint-200/30" />

                                        <p className="text-sm text-kost-muted dark:text-mint-100/30">
                                            Tidak ada riwayat pembayaran
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MOBILE */}
            <div className="md:hidden space-y-3">

                {payments.length > 0 ? (
                    payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="
                                rounded-xl p-4
                                bg-white dark:bg-dark-card
                                border border-mint-200 dark:border-dark-border/20
                            "
                        >

                            <div className="flex items-start justify-between gap-3 mb-3">

                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-kost-dark dark:text-mint-50 truncate">
                                        {
                                            payment.invoice?.contract
                                                ?.room_type?.property?.name
                                        }
                                    </p>

                                    <p className="text-xs text-kost-muted dark:text-mint-100/40">
                                        {payment.invoice?.contract?.tenant?.name}
                                    </p>
                                </div>

                                <div>
                                    {payment.status === 'verified' ? (
                                        <span className="
                                            px-2 py-1 rounded-full text-[10px]
                                            bg-green-100 dark:bg-green-500/10
                                            text-green-600 dark:text-green-400
                                        ">
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="
                                            px-2 py-1 rounded-full text-[10px]
                                            bg-red-100 dark:bg-red-500/10
                                            text-red-600 dark:text-red-400
                                        ">
                                            Pending
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 text-xs">

                                <div className="flex items-center justify-between">
                                    <span className="text-kost-muted dark:text-mint-100/40">
                                        Metode
                                    </span>

                                    <span className="text-kost-dark dark:text-mint-50">
                                        {payment.payment_channel}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-kost-muted dark:text-mint-100/40">
                                        Total
                                    </span>

                                    <span className="font-medium text-kost-dark dark:text-mint-50">
                                        {formatCurrency(payment.paid_amount)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-kost-muted dark:text-mint-100/40">
                                        Tanggal
                                    </span>

                                    <span className="text-kost-dark dark:text-mint-50">
                                        {formatDate(payment.paid_at)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="
                        flex flex-col items-center justify-center py-14 gap-2
                        rounded-xl border border-dashed
                        border-mint-200 dark:border-dark-border/20
                        bg-white dark:bg-dark-card
                    ">
                        <Wallet className="w-8 h-8 text-mint-200 dark:text-mint-200/30" />

                        <p className="text-sm text-kost-muted dark:text-mint-100/30">
                            Tidak ada riwayat pembayaran
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}