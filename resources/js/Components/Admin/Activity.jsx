export default function RecentActivity() {
    const logs = [
        "User Budi mendaftar",
        "Booking baru dibuat",
        "Admin update data kos",
    ];

    return (
        <div className="bg-[#12122a] border border-white/5 rounded-xl p-5">

            <h3 className="text-sm text-gray-400 mb-4">
                Recent Activity
            </h3>

            <ul className="space-y-3">
                {logs.map((log, i) => (
                    <li key={i} className="text-sm text-gray-300">
                        • {log}
                    </li>
                ))}
            </ul>

        </div>
    );
}