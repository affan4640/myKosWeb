import AdminLayout from "../../Layouts/AdminLayout";
import Card from "../../Components/Admin/Card";
import Charts from "../../Components/Admin/Charts";
import Activity from "../../Components/Admin/Activity";


export default function Dashboard({ stats,chartData, activities }) {
    return (
        <AdminLayout>

            {/* TITLE */}
            <h1 className="text-2xl font-bold mb-6 text-kost-dark dark:text-mint-50">Dashboard</h1>

            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card title="Users" value={stats.users} />
                <Card title="Kos Listed" value={stats.kos} />
                <Card title="Bookings" value={stats.bookings} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <Charts data={chartData || []} />
                </div>
                <Activity activities={activities || []} />
            </div>

        </AdminLayout>
    );
}