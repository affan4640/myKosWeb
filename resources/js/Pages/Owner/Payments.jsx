import OwnerLayout from "@/Layouts/OwnerLayout";
import TablePayment from "@/Components/Owner/TablePayment";
import Pagination from "@/Components/Pagination";
import { usePage } from "@inertiajs/react";

export default function RentalRequest({ payments }) {

    const { ownerProperties } = usePage().props;

    return(
        <OwnerLayout>

        <TablePayment payments={payments.data} />

        <Pagination links={payments.links} />

        </OwnerLayout>
    );
}