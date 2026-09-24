import AuthButton from '@/components/AuthButton';
import AuthTextField from '@/components/AuthTextField';
import {
    APP_NAME,
    APP_TAGLINE,
    PASSWORD_MIN_LENGTH,
    RESEND_COOLDOWN_SECONDS,
} from '@/constants/auth';
import { isValidEmail, isValidPassword } from '@/lib/utlis';
import { useSignUp } from '@clerk/expo';
import { clsx } from 'clsx';
import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Phase = 'form' | 'verify';

const SignUp = () => {
    const { email: prefilledEmail } = useLocalSearchParams<{ email?: string }>();
    const { signUp, errors, fetchStatus } = useSignUp();

    const [phase, setPhase] = useState<Phase>('form');
    const [email, setEmail] = useState(prefilledEmail ?? '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [code, setCode] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    const isSubmitting = fetchStatus === 'fetching';
    const passwordIsLongEnough = isValidPassword(password);

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

    const handleCreateAccount = async () => {
        setFormError(null);

        if (!isValidEmail(email)) {
            setFormError('Enter a valid email address to continue.');
            return;
        }
        if (!passwordIsLongEnough) {
            setFormError(`Your password must be at least ${PASSWORD_MIN_LENGTH} characters.`);
            return;
        }
        if (password !== confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }

        const { error } = await signUp.password({
            emailAddress: email.trim(),
            password,
        });

        if (error) return;

        if (signUp.status === 'complete') {
            await signUp.finalize();
            return;
        }

        if (signUp.unverifiedFields.includes('email_address')) {
            const { error: codeError } = await signUp.verifications.sendEmailCode();
            if (codeError) {
                setFormError('Could not send a verification code. Please try again.');
                return;
            }
            startResendCooldown();
            setPhase('verify');
            return;
        }

        setFormError('Something needs your attention before we can finish creating your account.');
    };

    const handleVerify = async () => {
        setFormError(null);

        if (code.trim().length === 0) {
            setFormError('Enter the code we sent to your email.');
            return;
        }

        const { error } = await signUp.verifications.verifyEmailCode({ code: code.trim() });
        if (error) return;

        if (signUp.status === 'complete') {
            await signUp.finalize();
            return;
        }

        setFormError('That code did not complete your sign-up. Please try again.');
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setFormError(null);
        const { error } = await signUp.verifications.sendEmailCode();
        if (error) {
            setFormError('Could not resend the code. Please try again shortly.');
            return;
        }
        startResendCooldown();
    };

    const handleChangeEmail = async () => {
        await signUp.reset();
        setCode('');
        setFormError(null);
        setPhase('form');
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
                    <View className="auth-brand-block">
                        <View className="auth-logo-wrap">
                            <View className="auth-logo-mark">
                                <Text className="auth-logo-mark-text">{APP_NAME.charAt(0)}</Text>
                            </View>
                            <View>
                                <Text className="auth-wordmark">{APP_NAME}</Text>
                                <Text className="auth-wordmark-sub">{APP_TAGLINE}</Text>
                            </View>
                        </View>

                        {phase === 'form' ? (
                            <>
                                <Text className="auth-title">Create your account</Text>
                                <Text className="auth-subtitle">
                                    Track every subscription and bill in one place
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text className="auth-title">Check your email</Text>
                                <Text className="auth-subtitle">
                                    Enter the 6-digit code we sent to {email.trim()}
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

                            {phase === 'form' ? (
                                <>
                                    <AuthTextField
                                        label="Email"
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="Enter your email"
                                        keyboardType="email-address"
                                        autoComplete="email"
                                        textContentType="emailAddress"
                                        returnKeyType="next"
                                        error={errors.fields.emailAddress?.message}
                                    />

                                    <AuthTextField
                                        label="Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Enter your password"
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
                                            password.length > 0 &&
                                                passwordIsLongEnough &&
                                                'text-success'
                                        )}>
                                        At least {PASSWORD_MIN_LENGTH} characters
                                    </Text>

                                    <AuthTextField
                                        label="Confirm password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        placeholder="Re-enter your password"
                                        secureTextEntry={!showPassword}
                                        autoComplete="password-new"
                                        textContentType="newPassword"
                                        returnKeyType="go"
                                        onSubmitEditing={handleCreateAccount}
                                        error={
                                            confirmPassword.length > 0 &&
                                            confirmPassword !== password
                                                ? 'Passwords do not match'
                                                : null
                                        }
                                    />

                                    {/* Required mount point for Clerk's bot-protection captcha (Gate 10). */}
                                    <View nativeID="clerk-captcha" />

                                    <AuthButton
                                        label="Create account"
                                        onPress={handleCreateAccount}
                                        loading={isSubmitting}
                                    />
                                </>
                            ) : (
                                <>
                                    <AuthTextField
                                        label="Verification code"
                                        value={code}
                                        onChangeText={setCode}
                                        placeholder="000000"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        returnKeyType="go"
                                        onSubmitEditing={handleVerify}
                                        error={errors.fields.code?.message}
                                    />

                                    <AuthButton
                                        label="Verify email"
                                        onPress={handleVerify}
                                        loading={isSubmitting}
                                    />

                                    <View className="auth-resend-row">
                                        <Text className="auth-link-copy">
                                            Didn&apos;t get a code?
                                        </Text>
                                        <Text
                                            className="auth-link"
                                            onPress={handleResend}
                                            suppressHighlighting={resendCooldown > 0}>
                                            {resendCooldown > 0
                                                ? `Resend in ${resendCooldown}s`
                                                : 'Resend'}
                                        </Text>
                                    </View>

                                    <Text
                                        className="auth-link text-center"
                                        onPress={handleChangeEmail}>
                                        Use a different email
                                    </Text>
                                </>
                            )}
                        </View>

                        {phase === 'form' && (
                            <View className="auth-link-row">
                                <Text className="auth-link-copy">Already have an account?</Text>
                                <Link href="/(auth)/sign-in" className="auth-link">
                                    Sign in
                                </Link>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUp;
