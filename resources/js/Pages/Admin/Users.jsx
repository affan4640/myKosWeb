import AdminLayout from "@/Layouts/AdminLayout";
import TableUsers from "@/Components/Admin/TableUsers";

export default function Users() {
    const users = [
        { id: 1, name: "Admin", email: "admin@mail.com", role: "Admin" },
        { id: 2, name: "User", email: "user@mail.com", role: "User" },
    ];

    return (
        <AdminLayout>

            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            <TableUsers users={users} />

        </AdminLayout>
    );
}