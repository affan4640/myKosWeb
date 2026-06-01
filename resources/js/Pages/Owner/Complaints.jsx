import OwnerLayout from "@/Layouts/OwnerLayout";
import Pagination from "@/Components/Pagination";
import { Head, router } from "@inertiajs/react";
import {
    Search,
    MessageSquareWarning,
    X,
    Image as ImageIcon,
    Clock,
    Loader2,
    CheckCircle,
} from "lucide-react";
import { useState } from "react";

const statusConfig = {
    pending: {
        label: "Pending",
        className:
            "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20",
    },
    process: {
        label: "Diproses",
        className:
            "bg-mint-50 dark:bg-mint-200/10 text-kost-dark dark:text-mint-100 border-mint-200 dark:border-mint-300/20",
    },
    done: {
        label: "Selesai",
        className:
            "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    },
};

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="rounded-2xl p-5 bg-white dark:bg-dark-card border border-mint-200 dark:border-dark-border/20">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-kost-muted dark:text-mint-100/40">
                    {title}
                </p>
                <p className="text-2xl font-semibold text-kost-dark dark:text-mint-50 mt-1">
                    {value ?? 0}
                </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-mint-100 dark:bg-mint-200/10 border border-mint-200 dark:border-mint-300/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-mint-300" />
            </div>
        </div>
    </div>
);

const ComplaintCard = ({ complaint }) => {
    const status = statusConfig[complaint.status] || statusConfig.pending;

    const updateStatus = (value) => {
        router.put(
            route('owner.complaints.status', complaint.id),
            { status: value },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <div className="rounded-2xl p-5 bg-white dark:bg-dark-card border border-mint-200 dark:border-dark-border/20 space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-mint-100 dark:bg-mint-200/10 border border-mint-200 dark:border-mint-300/20 flex items-center justify-center flex-shrink-0">
                        <MessageSquareWarning className="w-5 h-5 text-mint-300" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-kost-dark dark:text-mint-50">
                            {complaint.title}
                        </h3>

                        <p className="text-xs text-kost-muted dark:text-mint-100/40 mt-1">
                            {complaint.property?.name ?? "-"} •{" "}
                            {complaint.tenant?.name ?? "Anonim"}
                        </p>

                        <div className="flex items-center gap-1.5 text-xs text-kost-muted dark:text-mint-100/30 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(complaint.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                },
                            )}
                        </div>
                    </div>
                </div>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${status.className}`}
                >
                    {status.label}
                </span>
            </div>

            <p className="text-sm text-kost-muted dark:text-mint-100/60 leading-relaxed">
                {complaint.description}
            </p>

            {complaint.image && (
                <div className="rounded-xl overflow-hidden border border-mint-200 dark:border-dark-border/20">
                    <img
                        src={`/storage/${complaint.image}`}
                        alt={complaint.title}
                        className="w-full max-h-56 object-cover"
                    />
                </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-mint-200 dark:border-dark-border/20">
                <button
                    onClick={() => updateStatus("new")}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                        complaint.status === "new"
                            ? statusConfig.pending.className
                            : "bg-white dark:bg-dark-bg border-mint-200 dark:border-dark-border/20 text-kost-muted dark:text-mint-100/50 hover:bg-mint-50 dark:hover:bg-dark-card"
                    }`}
                >
                    Pending
                </button>

                <button
                    onClick={() => updateStatus("process")}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                        complaint.status === "process"
                            ? statusConfig.process.className
                            : "bg-white dark:bg-dark-bg border-mint-200 dark:border-dark-border/20 text-kost-muted dark:text-mint-100/50 hover:bg-mint-50 dark:hover:bg-dark-card"
                    }`}
                >
                    Proses
                </button>

                <button
                    onClick={() => updateStatus("done")}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                        complaint.status === "done"
                            ? statusConfig.done.className
                            : "bg-white dark:bg-dark-bg border-mint-200 dark:border-dark-border/20 text-kost-muted dark:text-mint-100/50 hover:bg-mint-50 dark:hover:bg-dark-card"
                    }`}
                >
                    Selesai
                </button>
            </div>
        </div>
    );
};

export default function Complaints({
    complaints = { data: [], links: [] },
    stats = {
        total: 0,
        new: 0,
        process: 0,
        done: 0,
    },
    filters = {},
}) {
    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");

    const handleFilter = (newFilters) => {
        router.get(route("owner.complaints.index"), newFilters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (value) => {
        setSearch(value);
        handleFilter({
            search: value,
            status,
        });
    };

    const handleStatus = (value) => {
        const nextStatus = status === value ? "" : value;

        setStatus(nextStatus);

        handleFilter({
            search,
            status: nextStatus,
        });
    };

    const handleReset = () => {
        setSearch("");
        setStatus("");
        handleFilter({});
    };

    const activeFilter = search || status;

    return (
        <OwnerLayout>
            <Head title="Keluhan" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="rounded-2xl p-6 bg-white dark:bg-dark-card border border-mint-200 dark:border-dark-border/20">
                    <h1 className="text-lg font-semibold text-kost-dark dark:text-mint-50">
                        Keluhan Penyewa
                    </h1>
                    <p className="text-sm text-kost-muted dark:text-mint-100/40 mt-1">
                        Pantau dan kelola keluhan dari penghuni kos Anda.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Keluhan"
                        value={stats.total}
                        icon={MessageSquareWarning}
                    />
                    <StatCard
                        title="Pending"
                        value={stats.new}
                        icon={Clock}
                    />
                    <StatCard
                        title="Diproses"
                        value={stats.process}
                        icon={Loader2}
                    />
                    <StatCard
                        title="Selesai"
                        value={stats.done}
                        icon={CheckCircle}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-kost-muted dark:text-mint-100/40" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Cari judul, deskripsi, penyewa, atau kos..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none transition bg-white dark:bg-dark-card border border-mint-200 dark:border-dark-border/20 text-kost-dark dark:text-mint-50 placeholder-kost-muted dark:placeholder-mint-100/30 focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-300/30"
                        />
                    </div>

                    {["pending", "process", "done"].map((item) => {
                        const config = statusConfig[item];

                        return (
                            <button
                                key={item}
                                onClick={() => handleStatus(item)}
                                className={`px-3 py-2 rounded-xl text-xs border transition ${
                                    status === item
                                        ? config.className
                                        : "bg-white dark:bg-dark-card border-mint-200 dark:border-dark-border/20 text-kost-muted dark:text-mint-100/50 hover:bg-mint-50 dark:hover:bg-dark-bg"
                                }`}
                            >
                                {config.label}
                            </button>
                        );
                    })}

                    {activeFilter && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition text-red-400 hover:text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
                        >
                            <X className="w-3 h-3" />
                            Reset
                        </button>
                    )}
                </div>

                {complaints.data.length > 0 ? (
                    <div className="space-y-4">
                        {complaints.data.map((complaint) => (
                            <ComplaintCard
                                key={complaint.id}
                                complaint={complaint}
                            />
                        ))}

                        <Pagination links={complaints.links} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-mint-200 dark:border-dark-border/20 bg-white dark:bg-dark-card">
                        <ImageIcon className="w-10 h-10 text-mint-200 dark:text-mint-200/30" />
                        <p className="text-sm font-medium text-kost-dark dark:text-mint-50">
                            Belum ada keluhan
                        </p>
                        <p className="text-xs text-kost-muted dark:text-mint-100/40">
                            {activeFilter
                                ? "Tidak ada hasil untuk filter ini"
                                : "Keluhan dari penyewa akan muncul di sini"}
                        </p>
                    </div>
                )}
            </div>
        </OwnerLayout>
    );
}