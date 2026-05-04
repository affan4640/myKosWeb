import { Eye, Trash2 } from "lucide-react";

export default function TableTransaksi({ transactions = [] }) {
    return (
        <div className="mt-8">

            {/* WRAPPER */}
            <div className="bg-[#0f0f2a] border border-white/10 rounded-xl overflow-hidden">

                <table className="w-full">

                    {/* HEADER */}
                    <thead className="text-gray-400 text-sm border-b border-white/10 bg-white/5">
                        <tr>
                            <th className="p-4 text-left">User</th>
                            <th className="p-4 text-left">Kos</th>
                            <th className="p-4 text-left">Tanggal</th>
                            <th className="p-4 text-left">Total</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((trx) => {
                                const statusColor =
                                    trx.status === "paid"
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : trx.status === "pending"
                                        ? "bg-yellow-500/20 text-yellow-300"
                                        : "bg-red-500/20 text-red-300";

                                return (
                                    <tr
                                        key={trx.id}
                                        className="border-t border-white/10 hover:bg-white/5 transition"
                                    >
                                        {/* USER */}
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#93BFC7] to-[#ABE7B2] flex items-center justify-center text-sm font-bold text-black">
                                                {trx.user.name.charAt(0)}
                                            </div>
                                            <span className="font-medium">
                                                {trx.user.name}
                                            </span>
                                        </td>

                                        {/* KOS */}
                                        <td className="p-4 text-gray-300 text-sm">
                                            {trx.kos.name}
                                        </td>

                                        {/* DATE */}
                                        <td className="p-4 text-gray-400 text-sm">
                                            {trx.date}
                                        </td>

                                        {/* TOTAL */}
                                        <td className="p-4 text-gray-300 text-sm font-medium">
                                            Rp {trx.total.toLocaleString()}
                                        </td>

                                        {/* STATUS */}
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                                            >
                                                {trx.status}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">

                                                {/* DETAIL */}
                                                <button className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 transition group">
                                                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-300" />
                                                </button>

                                                {/* DELETE */}
                                                <button className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition group">
                                                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-10 text-gray-500"
                                >
                                    Tidak ada transaksi
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}