import AdminLayout from "@/Layouts/AdminLayout";
import TableUsers from "@/Components/Admin/TableUsers";
import Pagination from "@/Components/Pagination";

export default function Users({ users }) {
    return (
        <AdminLayout>

            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            <TableUsers users={users.data} />

            <Pagination links={users.links}/>

        </AdminLayout>
    );
}