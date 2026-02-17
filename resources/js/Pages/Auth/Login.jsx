import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import LoginLayout from "@/Layouts/LoginLayout";
import ForgotPasswordModal from "@/Components/Auth/ForgotPasswordModal";
import PageTransition from "@/Components/PageTransition";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [retrySeconds, setRetrySeconds] = useState(0);

    const handleSubmit = () => {
        // Reset errors
        setErrors({});

        // Validate fields
        const newErrors = {};
        if (!data.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!data.password) {
            newErrors.password = "Password is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setProcessing(true);

        // Use Inertia router for proper login handling
        router.post(
            route("login"),
            {
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: () => {
                    // Inertia will automatically redirect to the intended page (usually dashboard)
                    // The backend should handle the redirect logic
                },
                onError: (errors) => {
                    setErrors(errors);

                    // backend includes numeric `throttle_seconds` when rate-limited
                    const throttleVal =
                        errors?.throttle_seconds ||
                        errors?.throttle_seconds?.[0];
                    const emailMsg = errors?.email || errors?.email?.[0] || "";

                    if (throttleVal) {
                        const seconds = Number(throttleVal);
                        if (!Number.isNaN(seconds) && seconds > 0) {
                            setIsRateLimited(true);
                            setRetrySeconds(seconds);
                        }
                    } else {
                        // fallback: try to parse seconds from the translated message (best-effort)
                        const m = String(emailMsg).match(/(\d+)\s*second/);
                        if (m) {
                            setIsRateLimited(true);
                            setRetrySeconds(Number(m[1]));
                        }
                    }

                    setProcessing(false);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    // countdown timer for throttle
    useEffect(() => {
        if (!isRateLimited || retrySeconds <= 0) return;

        const id = setInterval(() => {
            setRetrySeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(id);
                    setIsRateLimited(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [isRateLimited, retrySeconds]);

    return (
        <>
            <PageTransition>
                <LoginLayout>
                    <Head title="Log in" />

                    <div className="flex-1 flex items-center justify-center p-3 sm:p-4 lg:p-6">
                        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-4 sm:mb-6">
                                Welcome Back!
                            </h2>

                            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                                Log in to securely manage your organization's
                                activities, teams, and resources from one
                                centralized workspace.
                            </p>

                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            <div className="space-y-4 sm:space-y-5">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                                        placeholder=""
                                        autoComplete="username"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={data.password}
                                            onChange={handleChange}
                                            onKeyPress={handleKeyPress}
                                            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 pr-12"
                                            placeholder=""
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing || isRateLimited}
                                    className="w-full bg-[#04095D] text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-full hover:bg-[#030746] focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                >
                                    {processing
                                        ? "Signing in..."
                                        : isRateLimited
                                          ? `Try again in ${retrySeconds}s`
                                          : "Login"}
                                </button>

                                {canResetPassword && (
                                    <div className="flex justify-end mt-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowForgotPassword(true)
                                            }
                                            className="text-sm text-red-600 hover:text-red-700 italic"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 sm:mt-8 text-center">
                                <p className="text-gray-700 text-xs sm:text-sm">
                                    Don't have an account?{" "}
                                    <Link
                                        href={route("register")}
                                        className="text-[#04095D] hover:text-[#030746] font-semibold"
                                    >
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </LoginLayout>
            </PageTransition>
            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />
        </>
    );
}
