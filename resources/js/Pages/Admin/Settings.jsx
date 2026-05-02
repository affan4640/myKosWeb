import AdminLayout from "@/Layouts/AdminLayout";
import { useState } from "react";
import { Save } from "lucide-react";

export default function Settings() {
    const [tab, setTab] = useState("general");

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* HEADER */}
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Settings
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Kelola konfigurasi aplikasi
                    </p>
                </div>

                {/* TABS */}
                <div className="flex gap-2">
                    {[
                        { key: "general", label: "General" },
                        { key: "payment", label: "Payment" },
                        { key: "security", label: "Security" },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-4 py-2 rounded-lg text-sm transition ${
                                tab === t.key
                                    ? "bg-indigo-500 text-white"
                                    : "bg-[#0f0f2a] text-gray-400 hover:bg-white/5"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* CONTENT */}
                <div className="bg-[#0f0f2a] border border-white/10 rounded-xl p-6">

                    {/* ================= GENERAL ================= */}
                    {tab === "general" && (
                        <div className="space-y-5">

                            <div>
                                <label className="text-sm text-gray-400">
                                    Nama Aplikasi
                                </label>
                                <input
                                    type="text"
                                    defaultValue="MyKost"
                                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 text-white outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400">
                                    Email Admin
                                </label>
                                <input
                                    type="email"
                                    defaultValue="admin@mykost.com"
                                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 text-white outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400">
                                    Deskripsi
                                </label>
                                <textarea
                                    rows="3"
                                    defaultValue="Platform pencarian kos modern"
                                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 text-white outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* ================= PAYMENT ================= */}
                    {tab === "payment" && (
                        <div className="space-y-5">

                            <div>
                                <label className="text-sm text-gray-400">
                                    Bank Transfer
                                </label>
                                <input
                                    type="text"
                                    placeholder="BCA / Mandiri / dll"
                                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 text-white"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400">
                                    Nomor Rekening
                                </label>
                                <input
                                    type="text"
                                    placeholder="1234567890"
                                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 text-white"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">
                                    Aktifkan Payment Gateway
                                </span>

                                <Toggle />
                            </div>
                        </div>
                    )}

                    {/* ================= SECURITY ================= */}
                    {tab === "security" && (
                        <div className="space-y-5">

                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">
                                    Two Factor Authentication
                                </span>

                                <Toggle />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">
                                    Email Verification
                                </span>

                                <Toggle defaultChecked />
                            </div>

                            <div>
                                <label className="text-sm text-gray-400">
                                    Session Timeout (menit)
                                </label>
                                <input
                                    type="number"
                                    defaultValue="30"
                                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white/5 text-white"
                                />
                            </div>
                        </div>
                    )}

                    {/* SAVE BUTTON */}
                    <div className="mt-6 flex justify-end">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white text-sm">
                            <Save className="w-4 h-4" />
                            Simpan Perubahan
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

/* ================= TOGGLE ================= */
function Toggle({ defaultChecked = false }) {
    const [enabled, setEnabled] = useState(defaultChecked);

    return (
        <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                enabled ? "bg-indigo-500" : "bg-gray-600"
            }`}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    enabled ? "translate-x-6" : ""
                }`}
            />
        </button>
    );
}