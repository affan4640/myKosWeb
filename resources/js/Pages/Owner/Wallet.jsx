import OwnerLayout from "@/Layouts/OwnerLayout";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    Wallet as WalletIcon,
    Plus,
    Building2,
    CreditCard,
    Trash2,
    ArrowDownToLine,
    History,
    ReceiptText,
    Loader2,
} from "lucide-react";

const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

const CardShell = ({ children, className = "" }) => (
    <div
        className={`
            rounded-2xl
            bg-white dark:bg-dark-card
            border border-mint-200 dark:border-dark-border/20
            transition-colors duration-300
            ${className}
        `}
    >
        {children}
    </div>
);

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-start gap-3">
        <div
            className="
                w-10 h-10 rounded-xl flex-shrink-0
                flex items-center justify-center
                bg-mint-100 dark:bg-mint-200/10
                border border-mint-200 dark:border-mint-300/20
                text-mint-300 dark:text-mint-200
            "
        >
            <Icon className="w-5 h-5" />
        </div>

        <div>
            <h2 className="text-sm font-semibold text-kost-dark dark:text-mint-50">
                {title}
            </h2>
            {subtitle && (
                <p className="text-xs text-kost-muted dark:text-mint-100/40 mt-1">
                    {subtitle}
                </p>
            )}
        </div>
    </div>
);

const inputClass = `
    w-full rounded-xl px-4 py-3 text-sm
    bg-mint-50 dark:bg-dark-bg
    border border-mint-200 dark:border-dark-border/20
    text-kost-dark dark:text-mint-50
    placeholder:text-kost-muted/60 dark:placeholder:text-mint-100/30
    focus:outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-300/30
    transition
`;

const StatusBadge = ({ status }) => {
    const normalized = status || "pending";

    const className =
        normalized === "approved" || normalized === "paid" || normalized === "success"
            ? "bg-mint-200/60 dark:bg-mint-200/20 text-kost-dark dark:text-mint-100 border-mint-200 dark:border-mint-300/20"
            : normalized === "rejected" || normalized === "failed"
              ? "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border-red-200 dark:border-red-500/20"
              : "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20";

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${className}`}
        >
            {normalized}
        </span>
    );
};

export default function Wallet({
    wallet = { balance: 0, transactions: [] },
    bankAccounts = [],
    withdrawals = [],
}) {
    const [showBankForm, setShowBankForm] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        bank_name: "",
        account_name: "",
        account_number: "",
        bank_account_id: "",
        amount: "",
    });

    const submitBank = (e) => {
        e.preventDefault();

        post("/owner/wallet/bank-account", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowBankForm(false);
            },
        });
    };

    const submitWithdraw = (e) => {
        e.preventDefault();

        post("/owner/wallet/withdraw", {
            preserveScroll: true,
            onSuccess: () => reset("bank_account_id", "amount"),
        });
    };

    return (
        <OwnerLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-bold text-kost-dark dark:text-mint-50">
                        Wallet
                    </h1>
                    <p className="text-sm text-kost-muted dark:text-mint-100/40 mt-1">
                        Kelola saldo, rekening bank, dan penarikan dana kos Anda.
                    </p>
                </div>

                {/* BALANCE */}
                <CardShell className="p-6 overflow-hidden relative">
                    <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-mint-200/30 dark:bg-mint-200/10 blur-2xl" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div className="flex items-start gap-4">
                            <div
                                className="
                                    w-12 h-12 rounded-2xl flex-shrink-0
                                    flex items-center justify-center
                                    bg-mint-200 dark:bg-mint-200/20
                                    text-kost-dark dark:text-mint-50
                                "
                            >
                                <WalletIcon className="w-6 h-6" />
                            </div>

                            <div>
                                <p className="text-sm text-kost-muted dark:text-mint-100/40">
                                    Saldo Wallet
                                </p>

                                <h2 className="text-3xl md:text-4xl font-bold mt-2 text-kost-dark dark:text-mint-50">
                                    {formatRupiah(wallet.balance)}
                                </h2>

                                <p className="text-xs text-kost-muted dark:text-mint-100/40 mt-2">
                                    Saldo tersedia untuk ditarik ke rekening bank Anda.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowBankForm(true)}
                            className="
                                inline-flex items-center justify-center gap-2
                                px-4 py-2.5 rounded-xl text-sm font-medium transition
                                bg-mint-300 hover:bg-secondary
                                text-white
                                shadow-sm
                            "
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Rekening
                        </button>
                    </div>
                </CardShell>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* BANK ACCOUNTS */}
                        <CardShell className="p-5 md:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                                <SectionTitle
                                    icon={Building2}
                                    title="Rekening Bank"
                                    subtitle="Daftar rekening tujuan penarikan saldo."
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowBankForm(!showBankForm)}
                                    className="
                                        inline-flex items-center justify-center gap-2
                                        px-4 py-2 rounded-xl text-sm font-medium transition
                                        bg-mint-50 dark:bg-dark-bg
                                        border border-mint-200 dark:border-dark-border/20
                                        text-kost-dark dark:text-mint-50
                                        hover:bg-mint-100 dark:hover:bg-dark-card
                                    "
                                >
                                    <Plus className="w-4 h-4" />
                                    {showBankForm ? "Tutup Form" : "Tambah Rekening"}
                                </button>
                            </div>

                            {showBankForm && (
                                <form
                                    onSubmit={submitBank}
                                    className="
                                        mb-6 p-4 rounded-2xl
                                        bg-mint-50 dark:bg-dark-bg
                                        border border-mint-200 dark:border-dark-border/20
                                        space-y-4
                                    "
                                >
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Nama Bank"
                                            value={data.bank_name}
                                            onChange={(e) =>
                                                setData("bank_name", e.target.value)
                                            }
                                            className={inputClass}
                                        />

                                        <input
                                            type="text"
                                            placeholder="Nama Pemilik Rekening"
                                            value={data.account_name}
                                            onChange={(e) =>
                                                setData("account_name", e.target.value)
                                            }
                                            className={inputClass}
                                        />

                                        <input
                                            type="text"
                                            placeholder="Nomor Rekening"
                                            value={data.account_number}
                                            onChange={(e) =>
                                                setData("account_number", e.target.value)
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="
                                                inline-flex items-center justify-center gap-2
                                                px-5 py-2.5 rounded-xl text-sm font-medium transition
                                                bg-mint-300 hover:bg-secondary text-white
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                            "
                                        >
                                            {processing && (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            )}
                                            Simpan Rekening
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-3">
                                {bankAccounts.length > 0 ? (
                                    bankAccounts.map((bank) => (
                                        <div
                                            key={bank.id}
                                            className="
                                                flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
                                                p-4 rounded-2xl
                                                bg-mint-50 dark:bg-dark-bg
                                                border border-mint-200 dark:border-dark-border/20
                                            "
                                        >
                                            <div className="flex items-start gap-3 min-w-0">
                                                <div
                                                    className="
                                                        w-10 h-10 rounded-xl flex-shrink-0
                                                        flex items-center justify-center
                                                        bg-white dark:bg-dark-card
                                                        border border-mint-200 dark:border-dark-border/20
                                                        text-mint-300
                                                    "
                                                >
                                                    <CreditCard className="w-5 h-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-kost-dark dark:text-mint-50">
                                                        {bank.bank_name}
                                                    </p>

                                                    <p className="text-sm text-kost-muted dark:text-mint-100/50 mt-0.5">
                                                        {bank.account_number}
                                                    </p>

                                                    <p className="text-xs text-kost-muted dark:text-mint-100/30 mt-0.5">
                                                        {bank.account_name}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="
                                                    inline-flex items-center justify-center gap-1.5
                                                    px-3 py-2 rounded-xl text-xs transition
                                                    bg-red-50 dark:bg-red-500/10
                                                    border border-red-200 dark:border-red-500/20
                                                    text-red-500 dark:text-red-400
                                                    hover:bg-red-100 dark:hover:bg-red-500/20
                                                "
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Hapus
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        className="
                                            flex flex-col items-center justify-center py-12 gap-2
                                            rounded-2xl border border-dashed
                                            border-mint-200 dark:border-dark-border/20
                                            bg-mint-50 dark:bg-dark-bg
                                        "
                                    >
                                        <Building2 className="w-9 h-9 text-mint-200 dark:text-mint-200/30" />
                                        <p className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                            Belum ada rekening
                                        </p>
                                        <p className="text-xs text-kost-muted dark:text-mint-100/40">
                                            Tambahkan rekening untuk melakukan withdraw.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardShell>

                        {/* WITHDRAW HISTORY */}
                        <CardShell className="p-5 md:p-6">
                            <div className="mb-5">
                                <SectionTitle
                                    icon={History}
                                    title="Riwayat Withdraw"
                                    subtitle="Daftar penarikan saldo yang pernah diajukan."
                                />
                            </div>

                            <div className="space-y-3">
                                {withdrawals.length > 0 ? (
                                    withdrawals.map((withdrawal) => (
                                        <div
                                            key={withdrawal.id}
                                            className="
                                                flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
                                                p-4 rounded-2xl
                                                bg-mint-50 dark:bg-dark-bg
                                                border border-mint-200 dark:border-dark-border/20
                                            "
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-kost-dark dark:text-mint-50">
                                                    {formatRupiah(withdrawal.amount)}
                                                </p>

                                                <p className="text-xs text-kost-muted dark:text-mint-100/40 mt-1">
                                                    {withdrawal.bank_account?.bank_name ||
                                                        "Rekening tidak ditemukan"}
                                                </p>
                                            </div>

                                            <div className="sm:text-right space-y-1">
                                                <StatusBadge status={withdrawal.status} />

                                                <p className="text-xs text-kost-muted dark:text-mint-100/30">
                                                    {withdrawal.created_at}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        className="
                                            flex flex-col items-center justify-center py-12 gap-2
                                            rounded-2xl border border-dashed
                                            border-mint-200 dark:border-dark-border/20
                                            bg-mint-50 dark:bg-dark-bg
                                        "
                                    >
                                        <History className="w-9 h-9 text-mint-200 dark:text-mint-200/30" />
                                        <p className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                            Belum ada riwayat withdraw
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardShell>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">
                        {/* WITHDRAW FORM */}
                        <CardShell className="p-5 md:p-6">
                            <div className="mb-5">
                                <SectionTitle
                                    icon={ArrowDownToLine}
                                    title="Withdraw Saldo"
                                    subtitle="Ajukan penarikan ke rekening aktif."
                                />
                            </div>

                            <form onSubmit={submitWithdraw} className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-kost-muted dark:text-mint-100/50">
                                        Rekening Tujuan
                                    </label>

                                    <select
                                        value={data.bank_account_id}
                                        onChange={(e) =>
                                            setData("bank_account_id", e.target.value)
                                        }
                                        className={`${inputClass} mt-2`}
                                    >
                                        <option value="">Pilih Rekening</option>

                                        {bankAccounts.map((bank) => (
                                            <option key={bank.id} value={bank.id}>
                                                {bank.bank_name} -{" "}
                                                {bank.account_number}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-kost-muted dark:text-mint-100/50">
                                        Nominal Withdraw
                                    </label>

                                    <input
                                        type="number"
                                        placeholder="Contoh: 500000"
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData("amount", e.target.value)
                                        }
                                        className={`${inputClass} mt-2`}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="
                                        w-full inline-flex items-center justify-center gap-2
                                        px-5 py-3 rounded-xl text-sm font-medium transition
                                        bg-mint-300 hover:bg-secondary text-white
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    "
                                >
                                    {processing && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                    Withdraw
                                </button>
                            </form>
                        </CardShell>

                        {/* TRANSACTION HISTORY */}
                        <CardShell className="p-5 md:p-6">
                            <div className="mb-5">
                                <SectionTitle
                                    icon={ReceiptText}
                                    title="Riwayat Transaksi"
                                    subtitle="Aktivitas masuk dan keluar wallet."
                                />
                            </div>

                            <div className="space-y-3">
                                {wallet.transactions?.length > 0 ? (
                                    wallet.transactions.map((trx) => (
                                        <div
                                            key={trx.id}
                                            className="
                                                flex items-start justify-between gap-3
                                                p-4 rounded-2xl
                                                bg-mint-50 dark:bg-dark-bg
                                                border border-mint-200 dark:border-dark-border/20
                                            "
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-kost-dark dark:text-mint-50 line-clamp-1">
                                                    {trx.description}
                                                </p>

                                                <p className="text-xs text-kost-muted dark:text-mint-100/40 mt-1 capitalize">
                                                    {trx.type}
                                                </p>
                                            </div>

                                            <p
                                                className={`
                                                    text-sm font-semibold flex-shrink-0
                                                    ${
                                                        trx.type === "credit"
                                                            ? "text-mint-300"
                                                            : "text-red-400"
                                                    }
                                                `}
                                            >
                                                {trx.type === "credit" ? "+" : "-"}
                                                {formatRupiah(trx.amount)}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div
                                        className="
                                            flex flex-col items-center justify-center py-12 gap-2
                                            rounded-2xl border border-dashed
                                            border-mint-200 dark:border-dark-border/20
                                            bg-mint-50 dark:bg-dark-bg
                                        "
                                    >
                                        <ReceiptText className="w-9 h-9 text-mint-200 dark:text-mint-200/30" />
                                        <p className="text-sm font-medium text-kost-dark dark:text-mint-50">
                                            Belum ada transaksi
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardShell>
                    </div>
                </div>
            </div>
        </OwnerLayout>
    );
}