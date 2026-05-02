import { motion, AnimatePresence } from "framer-motion";
import { User, Home, X, Download } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function LoginModal({ open, setOpen }) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={() => setOpen(false)}
                    />

                    {/* MODAL */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ duration: 0.25 }}
                        className="fixed z-50 inset-0 flex items-center justify-center px-4"
                    >
                        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

                            {/* CLOSE */}
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                            >
                                <X />
                            </button>

                            {/* TITLE */}
                            <h2 className="text-xl font-bold text-[#2f3e46] mb-2">
                                Masuk ke MyKost
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Pilih jenis akun kamu
                            </p>

                            {/* OPTIONS */}
                            <div className="space-y-4">

                                {/* USER */}
                                <Link
                                    href={route("login")}
                                    className="group block"
                                >
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#ABE7B2] hover:bg-[#f8fff9] transition">
                                        
                                        <div className="p-3 rounded-lg bg-[#ABE7B2]/20">
                                            <User className="text-[#2f3e46]" />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-[#2f3e46]">
                                                Pencari Kos
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Cari & booking kos dengan mudah
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                                {/* OWNER */}
                                <a
                                    href="#"
                                    onClick={() => {
                                        window.open(
                                            "https://play.google.com/store",
                                            "_blank"
                                        );
                                    }}
                                    className="group block"
                                >
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#93BFC7] hover:bg-[#f5fbfc] transition">
                                        
                                        <div className="p-3 rounded-lg bg-[#93BFC7]/20">
                                            <Home className="text-[#2f3e46]" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[#2f3e46]">
                                                Owner Kos
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Kelola kos lewat aplikasi mobile
                                            </p>
                                        </div>

                                        <Download className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition" />
                                    </div>
                                </a>
                            </div>

                            {/* FOOTER */}
                            <p className="text-xs text-gray-400 mt-6 text-center">
                                Dengan masuk, kamu menyetujui syarat & ketentuan
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}