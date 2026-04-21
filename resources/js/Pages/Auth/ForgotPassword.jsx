import InputError from "@/Components/InputError";
import { Head, useForm, Link } from "@inertiajs/react";
import logo from "../../../assets/logo.png";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <>
            <Head title="Lupa Password" />

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
                        Lupa Password
                    </p>

                    {/* DESC */}
                    <p className="text-xs text-gray-500 text-center mb-5 leading-relaxed">
                        Masukkan email kamu, kami akan kirim link untuk reset password.
                    </p>

                    {/* STATUS */}
                    {status && (
                        <div className="mb-4 text-sm text-green-500 text-center">
                            {status}
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={submit} className="space-y-5">

                        <div>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="text-sm mt-1 w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="email@gmail.com"
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition"
                        >
                            Kirim Link Reset
                        </button>
                    </form>

                    {/* BACK TO LOGIN */}
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