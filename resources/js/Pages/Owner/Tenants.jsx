import OwnerLayout from "@/Layouts/OwnerLayout";
import TableTenants from "@/Components/Owner/TableTenants";
import Pagination from "@/Components/Pagination";
import { usePage } from "@inertiajs/react";

export default function Tenants({ tenants }) {

    console.log(tenants);

    const { ownerProperties } = usePage().props;

    return(
        <OwnerLayout>

        <TableTenants tenants={tenants.data ?? []} />

        <Pagination links={tenants.links} />

        </OwnerLayout>
    );
}