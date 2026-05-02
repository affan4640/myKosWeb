import { useForm, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    User,
    Lock,
    Upload,
    ArrowLeft,
    Image as ImageIcon,
    ShieldCheck,
    MailCheck,
} from "lucide-react";

/* ================= TOAST ================= */
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        if (message) {
            const t = setTimeout(() => onClose(), 3000);
            return () => clearTimeout(t);
        }
    }, [message]);

    if (!message) return null;

    return (
        <div
            className={`fixed top-5 right-5 px-4 py-3 rounded-xl shadow-lg text-sm text-white z-50
            ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
            {message}
        </div>
    );
};

/* ================= PASSWORD STRENGTH ================= */
const getStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length > 6) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;
    return score;
};

export default function Profile() {
    const { auth } = usePage().props;

    const [tab, setTab] = useState("profile");
    const [preview, setPreview] = useState(null);
    const [toast, setToast] = useState(null);

    /* ================= FORM ================= */
    const profileForm = useForm({
        name: auth.user.name || "",
        photo: null,
    });

    const passwordForm = useForm({
        password: "",
        password_confirmation: "",
    });

    const personalForm = useForm({
        phone: "",
        address: "",
    });

    /* ================= SUBMIT ================= */
    const submitProfile = (e) => {
        e.preventDefault();

        profileForm.post(route("profile.update"), {
            forceFormData: true,
            onSuccess: () =>
                setToast({ message: "Profil berhasil diupdate", type: "success" }),
            onError: () =>
                setToast({ message: "Gagal update profil", type: "error" }),
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();

        passwordForm.post(route("profile.password"), {
            onSuccess: () =>
                setToast({ message: "Password berhasil diupdate", type: "success" }),
            onError: () =>
                setToast({ message: "Gagal update password", type: "error" }),
        });
    };

    /* ================= UPLOAD ================= */
    const handleFile = (file) => {
        profileForm.setData("photo", file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const strength = getStrength(passwordForm.data.password);

    return (
        <div className="min-h-screen bg-[#ECF4E8] px-[5%] lg:px-[10%] py-10">
            {/* TOAST */}
            <Toast
                message={toast?.message}
                type={toast?.type}
                onClose={() => setToast(null)}
            />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* HEADER */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.visit("/")}
                        className="p-2 bg-white rounded-lg shadow-sm hover:shadow transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div>
                        <h1 className="text-2xl font-bold text-[#2f3e46]">
                            Profile Settings
                        </h1>
                        <p className="text-sm text-gray-500">
                            Kelola akun kamu dengan mudah
                        </p>
                    </div>
                </div>

                {/* EMAIL STATUS */}
                <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <MailCheck className="w-4 h-4 text-green-500" />
                        {auth.user.email_verified_at
                            ? "Email sudah terverifikasi"
                            : "Email belum terverifikasi"}
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-2">
                    {["profile", "security", "personal"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2 rounded-xl text-sm transition ${
                                tab === t
                                    ? "bg-[#ABE7B2] text-[#2f3e46]"
                                    : "bg-white text-gray-500"
                            }`}
                        >
                            {t === "profile"
                                ? "Profile"
                                : t === "security"
                                ? "Security"
                                : "Data Pribadi"}
                        </button>
                    ))}
                </div>

                {/* ================= PROFILE ================= */}
                {tab === "profile" && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-5">
                        <h2 className="font-semibold flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Informasi Profil
                        </h2>

                        <form onSubmit={submitProfile} className="space-y-5">
                            {/* UPLOAD */}
                            <label
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition block"
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        className="w-20 h-20 rounded-full mx-auto object-cover"
                                    />
                                ) : (
                                    <>
                                        <ImageIcon className="mx-auto w-6 h-6 text-gray-400" />
                                        <p className="text-sm text-gray-500">
                                            Drag & drop atau klik upload
                                        </p>
                                    </>
                                )}

                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleFile(e.target.files[0])
                                    }
                                />
                            </label>

                            {/* NAME */}
                            <input
                                type="text"
                                value={profileForm.data.name}
                                onChange={(e) =>
                                    profileForm.setData("name", e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-xl bg-gray-100 outline-none"
                            />

                            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] text-white">
                                {profileForm.processing ? "Saving..." : "Simpan"}
                            </button>
                        </form>
                    </div>
                )}

                {/* ================= SECURITY ================= */}
                {tab === "security" && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-5">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Keamanan
                        </h2>

                        <form onSubmit={submitPassword} className="space-y-4">
                            <input
                                type="password"
                                placeholder="Password baru"
                                value={passwordForm.data.password}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        "password",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-3 rounded-xl bg-gray-100"
                            />

                            {/* STRENGTH */}
                            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                    className={`h-full transition-all ${
                                        ["w-0", "w-1/4 bg-red-400", "w-2/4 bg-yellow-400", "w-3/4 bg-blue-400", "w-full bg-green-500"][strength]
                                    }`}
                                />
                            </div>

                            <input
                                type="password"
                                placeholder="Konfirmasi password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-3 rounded-xl bg-gray-100"
                            />

                            <button className="px-5 py-2.5 rounded-xl bg-[#2f3e46] text-white">
                                {passwordForm.processing
                                    ? "Updating..."
                                    : "Update Password"}
                            </button>
                        </form>
                    </div>
                )}

                {/* ================= PERSONAL ================= */}
                {tab === "personal" && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
                        <h2 className="font-semibold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Data Pribadi
                        </h2>

                        <input
                            placeholder="Nama Lengkap"
                            value={personalForm.data.name}
                            onChange={(e) =>
                                personalForm.setData("name", e.target.value)
                            }
                            className="w-full p-3 rounded-xl bg-gray-100 outline-none"
                        />


                        <input
                            placeholder="No HP"
                            value={personalForm.data.phone}
                            onChange={(e) =>
                                personalForm.setData("phone", e.target.value)
                            }
                            className="w-full p-3 rounded-xl bg-gray-100 outline-none"
                        />

                        <input
                            placeholder="Alamat"
                            value={personalForm.data.address}
                            onChange={(e) =>
                                personalForm.setData("address", e.target.value)
                            }
                            className="w-full p-3 rounded-xl bg-gray-100 outline-none"
                        />

                        <input
                            placeholder="Kota Asal"
                            value={personalForm.data.city}
                            onChange={(e) =>
                                personalForm.setData("city", e.target.value)
                            }
                            className="w-full p-3 rounded-xl bg-gray-100 outline-none"
                        />

                        <input
                            placeholder="Status"
                            value={personalForm.data.status}
                            onChange={(e) =>
                                personalForm.setData("status", e.target.value)
                            }
                            className="w-full p-3 rounded-xl bg-gray-100 outline-none"
                        />

                        <button className="px-5 py-2.5 rounded-xl bg-[#ABE7B2] text-[#2f3e46]">
                            Simpan Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}