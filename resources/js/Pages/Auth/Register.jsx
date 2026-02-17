import { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import SignupLayout from "@/Layouts/SignupLayout";
import PageTransition from "@/Components/PageTransition";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [fieldErrors, setFieldErrors] = useState({});
    const [shakeFields, setShakeFields] = useState({});

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        birthdate: "",
        password: "",
        password_confirmation: "",
    });

    // Password strength checker
    useEffect(() => {
        if (data.password.length === 0) {
            setPasswordStrength("");
            return;
        }

        let strength = 0;
        if (data.password.length >= 8) strength++;
        if (data.password.match(/[a-z]/) && data.password.match(/[A-Z]/))
            strength++;
        if (data.password.match(/[0-9]/)) strength++;
        if (data.password.match(/[^a-zA-Z0-9]/)) strength++;

        if (strength <= 1) setPasswordStrength("weak");
        else if (strength === 2) setPasswordStrength("medium");
        else setPasswordStrength("strong");
    }, [data.password]);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const nextStep = () => {
        // Validate current step before proceeding
        if (currentStep === 1) {
            const newErrors = {};
            const newShakeFields = {};

            if (!data.first_name.trim()) {
                newErrors.first_name = "First name is required";
                newShakeFields.first_name = true;
            }
            if (!data.last_name.trim()) {
                newErrors.last_name = "Last name is required";
                newShakeFields.last_name = true;
            }
            if (!data.birthdate) {
                newErrors.birthdate = "Birthdate is required";
                newShakeFields.birthdate = true;
            } else {
                const selected = new Date(data.birthdate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selected > today) {
                    newErrors.birthdate = "Birthdate cannot be in the future";
                    newShakeFields.birthdate = true;
                }
            }

            if (Object.keys(newErrors).length > 0) {
                // Set field errors and shake animation
                setFieldErrors(newErrors);
                setShakeFields(newShakeFields);

                // Clear shake animation after 500ms
                setTimeout(() => {
                    setShakeFields({});
                }, 500);

                return;
            }
        }
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case "weak":
                return "text-red-500";
            case "medium":
                return "text-yellow-500";
            case "strong":
                return "text-green-500";
            default:
                return "";
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case "weak":
                return "Weak password";
            case "medium":
                return "Medium strength";
            case "strong":
                return "Strong password";
            default:
                return "";
        }
    };

    return (
        <PageTransition>
            <SignupLayout>
                <Head title="Register" />
                <style jsx>{`
                    @keyframes shake {
                        0%,
                        100% {
                            transform: translateX(0);
                        }
                        10%,
                        30%,
                        50%,
                        70%,
                        90% {
                            transform: translateX(-2px);
                        }
                        20%,
                        40%,
                        60%,
                        80% {
                            transform: translateX(2px);
                        }
                    }
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-shake {
                        animation: shake 0.5s ease-in-out;
                    }
                    .animate-fade-in {
                        animation: fadeIn 0.3s ease-out;
                    }
                `}</style>

                <div className="flex-1 flex items-center justify-center p-3 sm:p-4 lg:p-6">
                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-4 sm:mb-6">
                            Create Account
                        </h2>

                        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
                            Join us to manage your organization's activities,
                            teams, and resources from one centralized workspace.
                        </p>

                        {/* Progress Indicator */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <div
                                    className={`flex items-center ${currentStep >= 1 ? "text-[#04095D]" : "text-gray-400"}`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                            currentStep >= 1
                                                ? "bg-[#04095D] text-white"
                                                : "bg-gray-200 text-gray-400"
                                        }`}
                                    >
                                        1
                                    </div>
                                    <span className="ml-2 text-sm font-medium">
                                        Personal Info
                                    </span>
                                </div>
                                <div
                                    className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? "bg-[#04095D]" : "bg-gray-200"}`}
                                ></div>
                                <div
                                    className={`flex items-center ${currentStep >= 2 ? "text-[#04095D]" : "text-gray-400"}`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                            currentStep >= 2
                                                ? "bg-[#04095D] text-white"
                                                : "bg-gray-200 text-gray-400"
                                        }`}
                                    >
                                        2
                                    </div>
                                    <span className="ml-2 text-sm font-medium">
                                        Account Setup
                                    </span>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={
                                currentStep === 2
                                    ? submit
                                    : (e) => {
                                          e.preventDefault();
                                          nextStep();
                                      }
                            }
                        >
                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                htmlFor="first_name"
                                            >
                                                First name
                                            </label>
                                            <input
                                                id="first_name"
                                                name="first_name"
                                                value={data.first_name}
                                                className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 ${
                                                    fieldErrors.first_name
                                                        ? "border-red-500 animate-pulse"
                                                        : "border-gray-300"
                                                } ${
                                                    shakeFields.first_name
                                                        ? "animate-shake"
                                                        : ""
                                                }`}
                                                autoComplete="given-name"
                                                autoFocus
                                                onChange={(e) => {
                                                    setData(
                                                        "first_name",
                                                        e.target.value,
                                                    );
                                                    if (
                                                        fieldErrors.first_name
                                                    ) {
                                                        setFieldErrors(
                                                            (prev) => ({
                                                                ...prev,
                                                                first_name: "",
                                                            }),
                                                        );
                                                    }
                                                }}
                                                required
                                            />
                                            {fieldErrors.first_name && (
                                                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                                                    {fieldErrors.first_name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                htmlFor="middle_name"
                                            >
                                                Middle name{" "}
                                                <span className="text-gray-400">
                                                    (optional)
                                                </span>
                                            </label>
                                            <input
                                                id="middle_name"
                                                name="middle_name"
                                                value={data.middle_name}
                                                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                                                autoComplete="additional-name"
                                                onChange={(e) =>
                                                    setData(
                                                        "middle_name",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.middle_name && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.middle_name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                                htmlFor="last_name"
                                            >
                                                Last name
                                            </label>
                                            <input
                                                id="last_name"
                                                name="last_name"
                                                value={data.last_name}
                                                className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 ${
                                                    fieldErrors.last_name
                                                        ? "border-red-500 animate-pulse"
                                                        : "border-gray-300"
                                                } ${
                                                    shakeFields.last_name
                                                        ? "animate-shake"
                                                        : ""
                                                }`}
                                                autoComplete="family-name"
                                                onChange={(e) => {
                                                    setData(
                                                        "last_name",
                                                        e.target.value,
                                                    );
                                                    if (fieldErrors.last_name) {
                                                        setFieldErrors(
                                                            (prev) => ({
                                                                ...prev,
                                                                last_name: "",
                                                            }),
                                                        );
                                                    }
                                                }}
                                                required
                                            />
                                            {fieldErrors.last_name && (
                                                <p className="mt-1 text-sm text-red-600 animate-fade-in">
                                                    {fieldErrors.last_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                            htmlFor="birthdate"
                                        >
                                            Birthdate
                                        </label>
                                        <input
                                            id="birthdate"
                                            type="date"
                                            name="birthdate"
                                            value={data.birthdate}
                                            max={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            className={`w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white border rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent transition-all text-gray-900 ${
                                                fieldErrors.birthdate
                                                    ? "border-red-500 animate-pulse"
                                                    : "border-gray-300"
                                            } ${
                                                shakeFields.birthdate
                                                    ? "animate-shake"
                                                    : ""
                                            }`}
                                            onChange={(e) => {
                                                setData(
                                                    "birthdate",
                                                    e.target.value,
                                                );
                                                if (fieldErrors.birthdate) {
                                                    setFieldErrors((prev) => ({
                                                        ...prev,
                                                        birthdate: "",
                                                    }));
                                                }
                                            }}
                                            required
                                        />
                                        {fieldErrors.birthdate && (
                                            <p className="mt-1 text-sm text-red-600 animate-fade-in">
                                                {fieldErrors.birthdate}
                                            </p>
                                        )}
                                        {errors.birthdate && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.birthdate}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="bg-[#04095D] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#030746] focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:ring-offset-2 transition-all duration-200 text-sm sm:text-base"
                                        >
                                            Next Step
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Account Setup */}
                            {currentStep === 2 && (
                                <div className="space-y-4">
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
                                            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                                            autoComplete="username"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 sm:mt-5">
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
                                                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 pr-12"
                                                autoComplete="new-password"
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
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
                                        {passwordStrength && (
                                            <div className="mt-2">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span
                                                        className={`text-xs font-medium ${getPasswordStrengthColor()}`}
                                                    >
                                                        {getPasswordStrengthText()}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {data.password.length}
                                                        /20+ chars
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-300 ease-out ${
                                                            passwordStrength ===
                                                            "weak"
                                                                ? "bg-red-500 w-1/3"
                                                                : passwordStrength ===
                                                                    "medium"
                                                                  ? "bg-yellow-500 w-2/3"
                                                                  : "bg-green-500 w-full"
                                                        }`}
                                                    ></div>
                                                </div>
                                                <div className="mt-1 space-y-1">
                                                    <div
                                                        className={`flex items-center text-xs ${data.password.length >= 8 ? "text-green-600" : "text-gray-400"}`}
                                                    >
                                                        <svg
                                                            className="w-3 h-3 mr-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        At least 8 characters
                                                    </div>
                                                    <div
                                                        className={`flex items-center text-xs ${data.password.match(/[a-z]/) && data.password.match(/[A-Z]/) ? "text-green-600" : "text-gray-400"}`}
                                                    >
                                                        <svg
                                                            className="w-3 h-3 mr-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Upper & lowercase
                                                        letters
                                                    </div>
                                                    <div
                                                        className={`flex items-center text-xs ${data.password.match(/[0-9]/) ? "text-green-600" : "text-gray-400"}`}
                                                    >
                                                        <svg
                                                            className="w-3 h-3 mr-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        At least one number
                                                    </div>
                                                    <div
                                                        className={`flex items-center text-xs ${data.password.match(/[^a-zA-Z0-9]/) ? "text-green-600" : "text-gray-400"}`}
                                                    >
                                                        <svg
                                                            className="w-3 h-3 mr-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        Special character
                                                        (!@#$%^&*)
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 sm:mt-5">
                                        <label
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                            htmlFor="password_confirmation"
                                        >
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="password_confirmation"
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password_confirmation"
                                                value={
                                                    data.password_confirmation
                                                }
                                                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 pr-12"
                                                autoComplete="new-password"
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword,
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                            >
                                                {showConfirmPassword ? (
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
                                        {data.password_confirmation &&
                                            data.password !==
                                                data.password_confirmation && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    Passwords do not match
                                                </p>
                                            )}
                                        {errors.password_confirmation && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-6 sm:mt-8 space-y-4">
                                        <div className="flex justify-between">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:ring-offset-2 transition-all duration-200 text-sm sm:text-base"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-[#04095D] text-white font-semibold py-3 px-6 rounded-full hover:bg-[#030746] focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                            >
                                                {processing
                                                    ? "Creating account..."
                                                    : "Register"}
                                            </button>
                                        </div>

                                        <div className="text-center">
                                            <Link
                                                href={route("login")}
                                                className="text-sm text-gray-600 hover:text-gray-900"
                                            >
                                                Already have an account? Login
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </SignupLayout>
        </PageTransition>
    );
}
