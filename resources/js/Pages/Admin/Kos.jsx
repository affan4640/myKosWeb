import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Kos() {

    // dummy data
    const kosData = [
        {
            id: 1,
            name: "Kos Unej",
            location: "Jember",
            price: 700000,
        },
        {
            id: 2,
            name: "Kos Mastrip",
            location: "Jember",
            price: 850000,
        },
    ];

    const [selectedKos, setSelectedKos] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleEdit = (kos) => {
        setSelectedKos(kos);
        setIsOpen(true);
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-6">Kos Management</h1>

            <TableKos kos={kosData} onEdit={handleEdit} />

            <EditKosModal
                isOpen={isOpen}
                kos={selectedKos}
                onClose={() => setIsOpen(false)}
            />
        </AdminLayout>
    );
}