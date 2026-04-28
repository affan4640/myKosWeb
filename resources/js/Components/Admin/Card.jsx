export default function Card({ title, value, icon: Icon }) {
    return (
        <div className="bg-[#12122a] border border-white/5 rounded-xl p-5 hover:border-primary/40 transition">

            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">{title}</p>

                {Icon && (
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-4 h-4 text-primary" />
                    </div>
                )}
            </div>

            <h2 className="text-2xl font-bold mt-3">{value}</h2>
        </div>
    );
}