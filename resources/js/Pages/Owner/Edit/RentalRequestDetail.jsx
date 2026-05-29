import OwnerLayout from "@/Layouts/OwnerLayout";
import {
    Phone,
    Mail,
    User,
    Home,
    ArrowLeft,
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";

function InfoBlock({ label, value }) {
    return (
        <div>
            <p className="text-[10px] text-kost-muted font-bold uppercase tracking-widest mb-1">
                {label}
            </p>
            <p className="text-kost-dark dark:text-mint-50 text-sm leading-relaxed">
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

export default function RentalRequestDetail({ rental }) {

    const handleApprove = () => {
        router.put(route("owner.rental-request.update", rental.id), {
            status: "approved",
        });
    };
    
    const handleReject = async (rentalId) => {
    
        const result = await Swal.fire({
            title: "Tolak Pengajuan Sewa?",
            icon: "warning",
            input: "textarea",
            inputLabel: "Alasan Penolakan",
            inputPlaceholder: "Masukkan alasan penolakan pengajuan sewa...",
            inputAttributes: {
                maxlength: 255,
            },
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#ef4444",
            background: "#0f172a",
            color: "#fff",
            inputValidator: (value) => {
                if (!value) {
                    return "Alasan wajib diisi";
                }
            }
        });
    
        if (result.isConfirmed) {
    
            router.put(
                route('owner.rental-request.update', rental.id),
                {
                    status: "rejected",
                    rejection_reason: result.value
                }
            );
    
        }
    };

    return (
        <OwnerLayout>
            <div className="max-w-7xl mx-auto p-2 space-y-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-sm text-kost-muted hover:text-kost-dark dark:hover:text-mint-50 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* DESKRIPSI */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-mint-200 dark:border-dark-border/20 rounded-2xl">
                            <h3 className="font-semibold text-kost-dark dark:text-mint-50 mb-4 flex items-center gap-2">
                                <Home className="w-4 h-4 text-primary" />
                                Detail Pengajuan Sewa
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <InfoBlock label="Tipe Kamar" value={rental.room_type.name} />
                                <InfoBlock label="Tanggal Mulai" value={rental.start_date} />
                                <InfoBlock label="Durasi" value={rental.duration_value}/>
                                <InfoBlock label="Tipe" value={rental.duration_type} />
                                <InfoBlock label="Note" value={rental.note} />
                            </div>
                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">

                        {/* USER */}
                        <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-mint-200 dark:border-dark-border/20 rounded-2xl">
                            <h4 className="text-sm font-semibold mb-4 text-kost-dark dark:text-mint-50">
                                Kontak Pemohon
                            </h4>

                            <div className="space-y-4">
                                <ProfileItem icon={<User />} label="Nama" value={rental.tenant?.name} />
                                <ProfileItem icon={<User />} label="Jenis Kelamin" value={rental.tenant?.jenis_kelamin} />
                                <ProfileItem icon={<Mail />} label="Email" value={rental.tenant?.email} />
                                <ProfileItem icon={<Phone />} label="Telepon" value={rental.tenant?.phone} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTION */}
                {rental.status === "pending" && (
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleReject}
                            className="flex-1 py-3 rounded-xl border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition"
                        >
                            Tolak
                        </button>

                        <button
                            onClick={handleApprove}
                            className="flex-1 py-3 rounded-xl bg-primary text-white hover:opacity-90 transition"
                        >
                            Approve
                        </button>
                    </div>
                )}

                {rental.status === "approved" && (
                    <div className="p-4 bg-white dark:bg-dark-card rounded-2xl rounded-xl text-center text-sm font-semibold mb-4 text-kost-dark dark:text-mint-50 border border-mint-200 dark:border-dark-border/20 rounded-2xl">
                        Pengajuan telah disetujui
                    </div>
                )}
            </div>
        </OwnerLayout>
    );
}