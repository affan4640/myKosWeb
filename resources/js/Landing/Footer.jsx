import React from "react";
import { Smartphone, Download } from "lucide-react";

export default function Footer() {
    return (
        <footer
            className="px-[5%] lg:px-[10%] py-10 border-t border-[#ABE7B2]/40"
            style={{ background: "#ECF4E8" }}
        >
            <div className="grid md:grid-cols-3 gap-8">
                {/* BRAND */}
                <div>
                    <h2 className="text-xl font-bold text-[#2f3e46]">
                        MyKost
                    </h2>

                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                        Platform pencarian kos modern untuk membantu mahasiswa
                        dan perantau menemukan tempat tinggal terbaik dengan
                        mudah, cepat, dan aman.
                    </p>
                </div>

                {/* NAVIGATION */}
                <div>
                    <h3 className="font-semibold mb-3 text-[#2f3e46]">
                        Navigation
                    </h3>

                    <ul className="space-y-2 text-gray-600 text-sm">
                        <li>
                            <a
                                href="#Home"
                                className="hover:text-[#2f3e46] transition"
                            >
                                Home
                            </a>
                        </li>

                        <li>
                            <a
                                href="#About"
                                className="hover:text-[#2f3e46] transition"
                            >
                                About
                            </a>
                        </li>

                        <li>
                            <a
                                href="#Showcase"
                                className="hover:text-[#2f3e46] transition"
                            >
                                Showcase
                            </a>
                        </li>

                        <li>
                            <a
                                href="#Contact"
                                className="hover:text-[#2f3e46] transition"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>

                {/* DOWNLOAD APP */}
                <div>
                    <h3 className="font-semibold mb-3 text-[#2f3e46]">
                        Download App
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        Nikmati pengalaman mencari kos lebih praktis melalui
                        aplikasi mobile MyKost.
                    </p>

                    <button
                        className="
                            inline-flex items-center gap-2
                            px-4 py-2 rounded-xl
                            bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2]
                            text-white text-sm font-medium
                            shadow-sm hover:opacity-90 transition
                        "
                    >
                        <Smartphone className="w-4 h-4" />
                        Download App
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 mt-10">
                Copyright © 2026 MyKost Team. All Rights Reserved.
            </div>
        </footer>
    );
}