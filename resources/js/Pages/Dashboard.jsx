import AdminLayout from "../Admin/AdminLayout";
import Card from "../components/Card";
import TableUsers from "../components/TableUsers";

const users = [
    { id: 1, name: "Eki", email: "eki@mail.com", role: "Admin" },
    { id: 2, name: "Budi", email: "budi@mail.com", role: "User" },
];

export default function Dashboard() {
    return (
        <AdminLayout>
            <div className="grid md:grid-cols-3 gap-6">
                <Card title="Total Users" value="120" />
                <Card title="Active Kos" value="45" />
                <Card title="Bookings" value="320" />
            </div>

            <TableUsers users={users} />
        </AdminLayout>
    );
}