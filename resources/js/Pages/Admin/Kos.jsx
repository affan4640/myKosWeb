import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import TableKos from "@/Components/Admin/TableKos";

export default function Kos({ kos }) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Kos Management</h1>

                    <button className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm">
                        + Tambah Kos
                    </button>
                </div>

                {/* TABLE */}
                <TableKos kos={kos?.data || []} />

                {/* PAGINATION */}
                <Pagination links={kos?.links || []} />
            </div>
        </AdminLayout>
    );
}