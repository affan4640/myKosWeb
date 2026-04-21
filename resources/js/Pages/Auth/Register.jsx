import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Head, Link, useForm } from "@inertiajs/react";
import logo from "../../../assets/logo.png";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Register" />

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

                    {/* SUBTITLE */}
                    <p className="text-md bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center mb-4">
                        Buat akun baru
                    </p>

                    {/* FORM */}
                    <form onSubmit={submit} className="space-y-5">

                        {/* NAME */}
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Nama"
                                className="text-gray-500"
                            />
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="text-sm mt-1 w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Nama lengkap"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email"
                                className="text-gray-500"
                            />
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

                        {/* PASSWORD */}
                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="text-gray-500"
                            />
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="text-sm mt-1 w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Password"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Konfirmasi Password"
                                className="text-gray-500"
                            />
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData("password_confirmation", e.target.value)
                                }
                                className="text-sm mt-1 w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Ulangi password"
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition"
                        >
                            Daftar
                        </button>
                    </form>

                    {/* LOGIN LINK */}
                    <p className="text-sm text-gray-500 mt-6 text-center">
                        Sudah punya akun?{" "}
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