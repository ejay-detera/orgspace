import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [timer, setTimer] = useState(180); // 3 minutes in seconds
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Timer effect for verification code expiry
    useState(() => {
        if (step === 2 && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [step, timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendResetLink = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Validate email
        if (!email.trim()) {
            setErrors({ email: 'Email is required' });
            setProcessing(false);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: 'Email is invalid' });
            setProcessing(false);
            return;
        }

        try {
            await router.post(route('password.email'), { email });
            setStep(2);
            setTimer(180); // Reset timer
        } catch (error) {
            setErrors({ email: 'Unable to send reset link. Please try again.' });
        } finally {
            setProcessing(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const code = verificationCode.join('');
        if (code.length !== 4) {
            setErrors({ code: 'Please enter the complete 4-digit code' });
            setProcessing(false);
            return;
        }

        try {
            await router.post(route('password.verify'), { 
                email, 
                code 
            });
            setStep(3);
        } catch (error) {
            setErrors({ code: 'Invalid verification code. Please try again.' });
        } finally {
            setProcessing(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Validate passwords
        if (!newPassword) {
            setErrors({ password: 'Password is required' });
            setProcessing(false);
            return;
        }

        if (newPassword.length < 8) {
            setErrors({ password: 'Password must be at least 8 characters' });
            setProcessing(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' });
            setProcessing(false);
            return;
        }

        try {
            await router.post(route('password.reset'), {
                email,
                code: verificationCode.join(''),
                password: newPassword,
                password_confirmation: confirmPassword
            });
            setStep(4);
        } catch (error) {
            setErrors({ password: 'Unable to reset password. Please try again.' });
        } finally {
            setProcessing(false);
        }
    };

    const handleCodeInput = (index, value) => {
        if (value.length > 1) return; // Only allow single digit
        
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);
        
        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`code-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleResendCode = async () => {
        setProcessing(true);
        try {
            await router.post(route('password.email'), { email });
            setTimer(180); // Reset timer
            setVerificationCode(['', '', '', '']);
            setErrors({});
        } catch (error) {
            setErrors({ code: 'Unable to resend code. Please try again.' });
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        // Reset all state
        setStep(1);
        setEmail('');
        setVerificationCode(['', '', '', '']);
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
        setTimer(180);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 relative">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Step 1: Email Input */}
                {step === 1 && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#04095D] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Forgot Your Password?</h3>
                        <p className="text-gray-600 mb-6">
                            Enter your email address and we will send you a password reset link.
                        </p>
                        
                        <form onSubmit={handleSendResetLink} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-[#04095D] text-white px-4 py-3 rounded-xl hover:bg-[#030746] transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Step 2: Verification Code */}
                {step === 2 && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#04095D] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Password Recovery</h3>
                        <p className="text-gray-600 mb-6">
                            A 4-digit verification code has been sent to: <span className="font-medium">{email}</span>. 
                            Enter the code below to continue.
                        </p>
                        
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <div className="flex justify-center gap-2 mb-4">
                                {verificationCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`code-input-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeInput(index, e.target.value)}
                                        className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-[#04095D] border-gray-300"
                                    />
                                ))}
                            </div>
                            
                            {timer > 0 && (
                                <p className="text-sm text-gray-500 mb-4">
                                    Code expires in {formatTime(timer)}
                                </p>
                            )}
                            
                            {errors.code && (
                                <p className="text-sm text-red-600 mb-4">{errors.code}</p>
                            )}
                            
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={processing || timer > 0}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Resend Code
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-[#04095D] text-white px-4 py-3 rounded-xl hover:bg-[#030746] transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                        </form>
                        
                        <p className="text-xs text-gray-500 mt-4">
                            Didn't receive the email? Check your spam folder or resend the code.
                        </p>
                    </div>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-[#04095D] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h3>
                        <p className="text-gray-600 mb-6">
                            Please enter your new password
                        </p>
                        
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New Password"
                                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm password"
                                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#04095D] focus:border-transparent ${
                                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            
                            <div className="text-left space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Minimum of 8 characters
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Must include letters and numbers
                                </div>
                            </div>
                            
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                            
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#04095D] text-white px-4 py-3 rounded-xl hover:bg-[#030746] transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Resetting...' : 'Done'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Password changed successfully!</h3>
                        <p className="text-gray-600 mb-6">
                            You can now go back to the login page and sign in with your new password.
                        </p>
                        
                        <button
                            onClick={handleClose}
                            className="w-full bg-[#04095D] text-white px-4 py-3 rounded-xl hover:bg-[#030746] transition-colors"
                        >
                            Log In
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
