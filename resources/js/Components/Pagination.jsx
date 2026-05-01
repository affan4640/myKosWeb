import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <div className="flex flex-wrap gap-1 mt-6">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <span
                            key={index}
                            className="px-4 py-2 rounded-lg text-sm border border-white/5 text-gray-600 opacity-50 cursor-not-allowed bg-[#12122b]"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                
                return (
                <Link
                    key={index}
                    href={link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-4 py-2 rounded-lg text-sm border ${
                        link.active 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "bg-[#12122b] border-white/5 text-gray-400 hover:bg-white/5"
                    } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                />);
            })}
        </div>
    );
}