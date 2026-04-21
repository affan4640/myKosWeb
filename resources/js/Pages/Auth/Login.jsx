import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import logo from "../../../assets/logo.png";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />

            {/* BACKGROUND */}
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden">
                {/* GRID BACKGROUND */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#00000010_1px,transparent_1px),linear-gradient(90deg,#00000010_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* GLOW */}
                <div className="absolute w-[400px] h-[400px] bg-green-400/30 blur-3xl rounded-full"></div>

                {/* CARD */}
                <div className="relative w-full max-w-sm p-7 rounded-2xl bg-white/70 backdrop-blur-xl border border-green-100 shadow-xl">
                    {/* TITLE */}
                    <div className="flex justify-center mb-3">
                        <img
                            src={logo}
                            alt="MyKost"
                            className="w-20 h-20 object-contain"
                        />
                    </div>
                    <p className="text-md bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center mb-4">
                        Masuk ke akun kamu
                    </p>

                    {/* STATUS */}
                    {status && (
                        <div className="mb-4 text-sm text-green-400">
                            {status}
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={submit} className="space-y-5">
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

                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="text-gray-500"
                            />

                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="text-sm mt-1 w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        {/* REMEMBER + FORGOT */}
                        <div className="flex justify-between text-sm text-gray-500">
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                Remember
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="hover:text-primary"
                                >
                                    Lupa?
                                </Link>
                            )}
                        </div>

                        {/* BUTTON */}
                        {/* GOOGLE LOGIN */}
                        <a
                            href={route('google.redirect')}
                            className="w-full flex items-center justify-center gap-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="w-4 h-4"
                            />
                            Login dengan Google
                        </a>

                        {/* SEPARATOR */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-xs text-gray-400">atau</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition"
                        >
                            Login
                        </button>
                    </form>

                    {/* REGISTER */}
                    <p className="text-sm text-gray-500 mt-6 text-center">
                        Belum punya akun?{" "}
                        <Link
                            href={route("register")}
                            className="text-primary hover:underline"
                        >
                            Daftar
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
