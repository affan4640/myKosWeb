import { Pencil, Trash2, MapPin } from "lucide-react";

export default function TableKos({ kos = [] }) {
    return (
        <div className="mt-6">
            <div className="bg-[#0f0f2a] border border-white/10 rounded-xl overflow-hidden">

                <table className="w-full">

                    {/* HEADER */}
                    <thead className="text-gray-400 text-sm border-b border-white/10 bg-white/5">
                        <tr>
                            <th className="p-4 text-left">Kos</th>
                            <th className="p-4 text-left">Lokasi</th>
                            <th className="p-4 text-left">Harga</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {kos.length > 0 ? (
                            kos.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t border-white/10 hover:bg-white/5 transition"
                                >
                                    {/* NAME */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={
                                                    item.image ||
                                                    "https://via.placeholder.com/60"
                                                }
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <span className="font-medium">
                                                {item.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* LOCATION */}
                                    <td className="p-4 text-gray-400 text-sm">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {item.location}
                                        </div>
                                    </td>

                                    {/* PRICE */}
                                    <td className="p-4 text-gray-300 text-sm">
                                        Rp {item.price?.toLocaleString()}
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-4">
                                        <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-300">
                                            Aktif
                                        </span>
                                    </td>

                                    {/* ACTION */}
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 transition">
                                                <Pencil className="w-4 h-4 text-gray-400 hover:text-indigo-300" />
                                            </button>

                                            <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition">
                                                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="text-center py-10 text-gray-500"
                                >
                                    Tidak ada data kos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}