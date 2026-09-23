import AuthButton from '@/components/AuthButton';
import AuthTextField from '@/components/AuthTextField';
import { icons } from '@/constants/icons';
import { APP_NAME, PASSWORD_MIN_LENGTH, RESEND_COOLDOWN_SECONDS } from '@/constants/auth';
import { isValidEmail, isValidPassword } from '@/lib/utlis';
import { useSignIn } from '@clerk/expo';
import clsx from 'clsx';
import { Link, router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Phase = 'request' | 'verify' | 'reset';

const ForgotPassword = () => {
    const { signIn, errors, fetchStatus } = useSignIn();

    const [phase, setPhase] = useState<Phase>('request');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    const isSubmitting = fetchStatus === 'fetching';
    const passwordIsLongEnough = isValidPassword(newPassword);

    const cooldownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (cooldownTimer.current) clearInterval(cooldownTimer.current);
        };
    }, []);

    const startResendCooldown = () => {
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        if (cooldownTimer.current) clearInterval(cooldownTimer.current);
        cooldownTimer.current = setInterval(() => {
            setResendCooldown(current => {
                if (current <= 1) {
                    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
                    return 0;
                }
                return current - 1;
            });
        }, 1000);
    };

    const handleSendCode = async () => {
        setFormError(null);

        if (!isValidEmail(email)) {
            setFormError('Enter a valid email address to continue.');
            return;
        }

        const { error: identifierError } = await signIn.create({ identifier: email.trim() });
        if (identifierError) return;

        const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
        if (sendError) {
            setFormError('Could not send a reset code. Please try again.');
            return;
        }

        startResendCooldown();
        setPhase('verify');
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setFormError(null);
        const { error } = await signIn.resetPasswordEmailCode.sendCode();
        if (error) {
            setFormError('Could not resend the code. Please try again shortly.');
            return;
        }
        startResendCooldown();
    };

    const handleVerifyCode = async () => {
        setFormError(null);

        if (code.trim().length === 0) {
            setFormError('Enter the code we sent to your email.');
            return;
        }

        const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code: code.trim() });
        if (error) return;

        if (signIn.status === 'needs_new_password') {
            setPhase('reset');
        } else if (signIn.status === 'complete') {
            await signIn.finalize();
        } else {
            setFormError('That code did not work. Please try again.');
        }
    };

    const handleResetPassword = async () => {
        setFormError(null);

        if (!passwordIsLongEnough) {
            setFormError(`Your new password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
            return;
        }
        if (newPassword !== confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }

        const { error } = await signIn.resetPasswordEmailCode.submitPassword({
            password: newPassword,
            signOutOfOtherSessions: true,
        });
        if (error) return;

        if (signIn.status === 'complete') {
            await signIn.finalize();
        }
    };

    const handleBack = () => {
        if (phase === 'request') {
            router.back();
            return;
        }
        setFormError(null);
        setPhase('request');
    };

    return (
        <SafeAreaView className="auth-safe-area" edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                className="auth-screen"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    className="auth-scroll"
                    contentContainerClassName="auth-content"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>
                    <TouchableOpacity className="auth-back-button" onPress={handleBack} hitSlop={8}>
                        <Image source={icons.back} className="auth-back-icon" resizeMode="contain" />
                    </TouchableOpacity>

                    <View className="auth-brand-block">
                        {phase === 'request' && (
                            <>
                                <Text className="auth-title">Reset your password</Text>
                                <Text className="auth-subtitle">
                                    Enter the email for your {APP_NAME} account and we&apos;ll send you a
                                    reset code
                                </Text>
                            </>
                        )}
                        {phase === 'verify' && (
                            <>
                                <Text className="auth-title">Check your email</Text>
                                <Text className="auth-subtitle">
                                    Enter the 6-digit code we sent to {email.trim()}
                                </Text>
                            </>
                        )}
                        {phase === 'reset' && (
                            <>
                                <Text className="auth-title">Choose a new password</Text>
                                <Text className="auth-subtitle">
                                    For your security, this will sign you out of your other devices
                                </Text>
                            </>
                        )}
                    </View>

                    <View className="auth-card">
                        <View className="auth-form">
                            {formError && (
                                <View className="auth-error-banner">
                                    <Text className="auth-error-banner-text">{formError}</Text>
                                </View>
                            )}

                            {errors.global && errors.global.length > 0 && (
                                <View className="auth-error-banner">
                                    <Text className="auth-error-banner-text">
                                        {errors.global[0].longMessage || errors.global[0].message}
                                    </Text>
                                </View>
                            )}

                            {phase === 'request' && (
                                <>
                                    <AuthTextField
                                        label="Email"
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Enter your email"
                                        keyboardType="email-address"
                                        autoComplete="email"
                                        textContentType="emailAddress"
                                        returnKeyType="go"
                                        onSubmitEditing={handleSendCode}
                                        error={errors.fields.identifier?.message}
                                    />
                                    <AuthButton
                                        label="Send reset code"
                                        onPress={handleSendCode}
                                        loading={isSubmitting}
                                    />
                                </>
                            )}

                            {phase === 'verify' && (
                                <>
                                    <AuthTextField
                                        label="Verification code"
                                        value={code}
                                        onChangeText={setCode}
                                        placeholder="000000"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        returnKeyType="go"
                                        onSubmitEditing={handleVerifyCode}
                                        error={errors.fields.code?.message}
                                    />
                                    <AuthButton
                                        label="Verify code"
                                        onPress={handleVerifyCode}
                                        loading={isSubmitting}
                                    />
                                    <View className="auth-resend-row">
                                        <Text className="auth-link-copy">Didn&apos;t get a code?</Text>
                                        <Text
                                            className="auth-link"
                                            onPress={handleResend}
                                            suppressHighlighting={resendCooldown > 0}>
                                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
                                        </Text>
                                    </View>
                                </>
                            )}

                            {phase === 'reset' && (
                                <>
                                    <AuthTextField
                                        label="New password"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        placeholder="Enter a new password"
                                        secureTextEntry={!showPassword}
                                        autoComplete="password-new"
                                        textContentType="newPassword"
                                        returnKeyType="next"
                                        error={errors.fields.password?.message}
                                        rightAction={{
                                            label: showPassword ? 'Hide' : 'Show',
                                            onPress: () => setShowPassword(current => !current),
                                        }}
                                    />
                                    <Text
                                        className={clsx(
                                            'auth-helper',
                                            newPassword.length > 0 && passwordIsLongEnough && 'text-success'
                                        )}>
                                        At least {PASSWORD_MIN_LENGTH} characters
                                    </Text>

                                    <AuthTextField
                                        label="Confirm new password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        placeholder="Re-enter your new password"
                                        secureTextEntry={!showPassword}
                                        autoComplete="password-new"
                                        textContentType="newPassword"
                                        returnKeyType="go"
                                        onSubmitEditing={handleResetPassword}
                                        error={
                                            confirmPassword.length > 0 && confirmPassword !== newPassword
                                                ? 'Passwords do not match'
                                                : null
                                        }
                                    />
                                    <AuthButton
                                        label="Reset password"
                                        onPress={handleResetPassword}
                                        loading={isSubmitting}
                                    />
                                </>
                            )}
                        </View>

                        <View className="auth-link-row">
                            <Link href="/(auth)/sign-in" className="auth-link">
                                Back to sign in
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgotPassword;
