import OwnerLayout from "@/Layouts/OwnerLayout";
import {
    Phone,
    Mail,
    User,
    Home,
    ArrowLeft,
    FileText,
} from "lucide-react";

function InfoBlock({ label, value }) {
    return (
        <div>
            <p className="text-[10px] text-kost-muted font-bold uppercase tracking-widest mb-1">
                {label}
            </p>
            <p className="text-kost-dark dark:text-mint-50 text-sm leading-relaxed font-medium">
                {value || "-"}
            </p>
        </div>
    );
}

function ProfileItem({ icon, label, value }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="p-2 bg-mint-100 dark:bg-dark-card rounded-lg text-kost-muted group-hover:text-primary transition">
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-kost-muted font-bold uppercase tracking-widest">
                    {label}
                </p>
                <p className="text-sm text-kost-dark dark:text-mint-50 font-medium">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function TransactionDetail({ payment }) {
    // Helper format mata uang Rupiah
    const formatRupiah = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Helper format tanggal berdasarkan updated_at
    const formatTanggal = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }) + " WIB";
    };

    // Helper badge status warna
    const renderStatusBadge = (status) => {
        const statusMap = {
            paid: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
            waiting_verification: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
            unpaid: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
        };

        const currentStyle = statusMap[status?.toLowerCase()] || "bg-slate-50 text-slate-600 border-slate-200";

        return (
            <span className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-xl border ${currentStyle}`}>
                {status}
            </span>
        );
    };

    const hitungDurasiSewa = (startDateString, endDateString) => {
        if (!startDateString || !endDateString) return "-";

        const start = new Date(startDateString);
        const end = new Date(endDateString);

        // Hitung total selisih bulan
        let months = (end.getFullYear() - start.getFullYear()) * 12;
        months -= start.getMonth();
        months += end.getMonth();

        // Jika selisihnya tepat dalam hitungan bulan (minimal 1 bulan)
        if (months > 0) {
            return `${months} Bulan`;
        }

        // Jika kurang dari 1 bulan, hitung dalam satuan Hari
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return `${diffDays} Hari`;
    };

    return (
        <OwnerLayout>
            <div className="max-w-7xl mx-auto p-2 space-y-6">
                {/* TOMBOL KEMBALI */}
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-sm text-kost-muted hover:text-kost-dark dark:hover:text-mint-50 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </button>

                {/* GRID LAYOUT MAPS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* KIRI: DETAIL INVOICE & PROPERTI */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* SEKSI 1: DETAIL INVOICE */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-mint-200 dark:border-dark-border/20">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-mint-100 dark:border-dark-border/10 pb-4">
                                <h3 className="font-semibold text-kost-dark dark:text-mint-50 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Detail Invoice / Tagihan
                                </h3>
                                <div>
                                    {renderStatusBadge(payment.status)}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <InfoBlock label="No. Invoice" value={payment.invoice.external_id} />
                                <InfoBlock label="Tanggal" value={formatTanggal(payment.updated_at)} />
                                <InfoBlock 
                                    label="Total Transaksi" 
                                    value={<span className="text-base font-bold text-primary">{formatRupiah(payment.paid_amount)}</span>} 
                                />
                                <InfoBlock label="Metode Pembayaran" value={payment.payment_method || "Xendit Gateway"} />
                            </div>
                        </div>

                        {/* SEKSI 2: DETAIL PROPERTI KOS */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-mint-200 dark:border-dark-border/20">
                            <h3 className="font-semibold text-kost-dark dark:text-mint-50 mb-4 flex items-center gap-2">
                                <Home className="w-4 h-4 text-primary" />
                                Informasi Kamar & Properti
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <InfoBlock label="Nama Kos" value={payment.invoice.contract?.room_type?.property?.name} />
                                <InfoBlock label="Tipe Kamar" value={payment.invoice.contract?.room_type?.name} />
                                <InfoBlock label="Durasi Sewa" value={hitungDurasiSewa(payment.invoice.contract?.start_date, payment.invoice.contract?.end_date)} />
                                <InfoBlock label="Tanggal Mulai Kontrak" value={formatTanggal(payment.invoice.contract?.start_date)} />
                            </div>
                        </div>

                    </div>

                    {/* KANAN: KONTAK TENANT */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-mint-200 dark:border-dark-border/20">
                            <h4 className="text-sm font-semibold mb-4 text-kost-dark dark:text-mint-50 flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Kontak Penyewa (Tenant)
                            </h4>

                            <div className="space-y-4">
                                <ProfileItem icon={<User className="w-4 h-4" />} label="Nama" value={payment.invoice.contract?.tenant?.name} />
                                <ProfileItem icon={<User className="w-4 h-4" />} label="Jenis Kelamin" value={payment.invoice.contract?.tenant?.jenis_kelamin} />
                                <ProfileItem icon={<Mail className="w-4 h-4" />} label="Email" value={payment.invoice.contract?.tenant?.email} />
                                <ProfileItem icon={<Phone className="w-4 h-4" />} label="Telepon" value={payment.invoice.contract?.tenant?.phone} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </OwnerLayout>
    );
}