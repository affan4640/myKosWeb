import AdminLayout from "../../Layouts/AdminLayout";
import Card from "../../Components/Admin/Card";
import Charts from "../../Components/Admin/Charts";
import Activity from "../../Components/Admin/Activity";


export default function Dashboard() {
    return (
        <AdminLayout>

            {/* TITLE */}
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* STATS */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card title="Users" value="120" />
                <Card title="Kos Listed" value="54" />
                <Card title="Bookings" value="89" />
            </div>

            {/* CHART + ACTIVITY */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                    <Charts />
                </div>
                <Activity />
            </div>

        </AdminLayout>
    );
}