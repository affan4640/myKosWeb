import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import TableTransaksi from "@/Components/Admin/TableTransaksi";

/* ================= DUMMY ================= */
const dummyTransactions = {
    data: [
        {
            id: 1,
            user: { name: "Budi Santoso" },
            kos: { name: "Kos Exclusive Sudirman" },
            total: 2500000,
            status: "paid",
            date: "2025-01-10",
        },
        {
            id: 2,
            user: { name: "Siti Aminah" },
            kos: { name: "Kos Nyaman Jember" },
            total: 550000,
            status: "pending",
            date: "2025-01-12",
        },
    ],
    links: [],
};

export default function Transaksi({ transactions }) {

    const data = transactions || dummyTransactions;

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-6">
                Informasi Transaksi
            </h1>

            <TableTransaksi transactions={data.data} />

            {data.links.length > 0 && (
                <Pagination links={data.links} />
            )}
        </AdminLayout>
    );
}