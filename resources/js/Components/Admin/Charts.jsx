import {
    LineChart, Line, XAxis, Tooltip, ResponsiveContainer
} from "recharts";

const data = [
    { name: "Mon", users: 40 },
    { name: "Tue", users: 70 },
    { name: "Wed", users: 55 },
    { name: "Thu", users: 90 },
    { name: "Fri", users: 120 },
];

export default function StatsChart() {
    return (
        <div className="bg-[#12122a] border border-white/5 rounded-xl p-5">

            <h3 className="text-sm text-gray-400 mb-4">
                User Growth
            </h3>

            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <XAxis dataKey="name" stroke="#666" />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#6366f1"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}