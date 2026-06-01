import { useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";

export default function MobileFilterDrawer({ open, onClose, children }) {
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`
                    fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden
                    transition-opacity duration-300
                    ${open ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
            />

            {/* Drawer */}
            <div
                className={`
                    fixed left-0 right-0 bottom-0 z-50 lg:hidden
                    max-h-[88vh] overflow-hidden
                    rounded-t-3xl
                    bg-white dark:bg-dark-bg
                    border-t border-mint-200 dark:border-dark-border/20
                    shadow-2xl
                    transition-transform duration-300 ease-out
                    ${open ? "translate-y-0" : "translate-y-full"}
                `}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 rounded-full bg-mint-300" />
                </div>

                {/* Header */}
                <div
                    className="
                        sticky top-0 z-10
                        flex items-center justify-between
                        px-4 pb-4
                        bg-white dark:bg-dark-bg
                        border-b border-mint-100 dark:border-dark-border/20
                    "
                >
                    <div className="flex items-center gap-2">
                        <div
                            className="
                                w-9 h-9 rounded-xl flex items-center justify-center
                                bg-mint-50 dark:bg-dark-card
                                border border-mint-200 dark:border-dark-border/20
                            "
                        >
                            <SlidersHorizontal className="w-4 h-4 text-mint-300" />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-kost-dark dark:text-mint-50">
                                Filter Pencarian
                            </h2>
                            <p className="text-xs text-kost-muted dark:text-mint-100/50">
                                Atur kos sesuai kebutuhanmu
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            w-9 h-9 rounded-xl flex items-center justify-center
                            bg-mint-50 dark:bg-dark-card
                            border border-mint-200 dark:border-dark-border/20
                            text-kost-muted dark:text-mint-100/60
                            hover:text-kost-dark dark:hover:text-mint-50
                            transition
                        "
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[calc(88vh-90px)] overflow-y-auto px-4 py-4 pb-8">
                    {children}
                </div>
            </div>
        </>
    );
}