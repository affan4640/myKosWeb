import InputError from "@/Components/InputError";
import { Head, useForm, Link } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import logo from "../../../assets/logo.png";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Konfirmasi Password" />

            {/* BACKGROUND */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden">

                {/* GRID */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#00000010_1px,transparent_1px),linear-gradient(90deg,#00000010_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* GLOW */}
                <div className="absolute w-[400px] h-[400px] bg-green-400/30 blur-3xl rounded-full"></div>

                {/* CARD */}
                <div className="relative w-full max-w-sm p-7 rounded-2xl bg-white/70 backdrop-blur-xl border border-green-100 shadow-xl">

                    {/* LOGO */}
                    <div className="flex justify-center mb-3">
                        <img
                            src={logo}
                            alt="MyKost"
                            className="w-20 h-20 object-contain"
                        />
                    </div>

                    {/* TITLE */}
                    <p className="text-md bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center mb-3">
                        Konfirmasi Password
                    </p>

                    {/* DESC */}
                    <p className="text-xs text-gray-500 text-center mb-5">
                        Demi keamanan, masukkan kembali password kamu.
                    </p>

                    {/* FORM */}
                    <form onSubmit={submit} className="space-y-5">

                        {/* PASSWORD */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="text-sm w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition"
                        >
                            Konfirmasi
                        </button>
                    </form>

                    {/* BACK */}
                    <p className="text-sm text-gray-500 mt-6 text-center">
                        Kembali ke{" "}
                        <Link
                            href={route("login")}
                            className="text-primary hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </>
    );
}