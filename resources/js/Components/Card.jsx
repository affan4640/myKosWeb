import { Users } from "lucide-react";

export default function Card({ title, value, icon: Icon = Users }) {
    return (
        <div className="group relative">

            {/* SOFT GLOW */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 opacity-0 group-hover:opacity-100 transition"></div>

            {/* CARD */}
            <div className="relative bg-[#0f0f2a] border border-white/10 rounded-xl p-5 flex items-center justify-between transition hover:border-indigo-500/30">

                {/* LEFT */}
                <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <h2 className="text-2xl font-bold mt-1 text-white">
                        {value}
                    </h2>
                </div>

                {/* ICON */}
                <div className="w-11 h-11 rounded-lg bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-400" />
                </div>
            </div>
        </div>
    );
}