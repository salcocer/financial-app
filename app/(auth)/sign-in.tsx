import AuthButton from '@/components/AuthButton';
import AuthTextField from '@/components/AuthTextField';
import { APP_NAME, APP_TAGLINE, RESEND_COOLDOWN_SECONDS } from '@/constants/auth';
import { isValidEmail } from '@/lib/utlis';
import { useSignIn } from '@clerk/expo';
import { Link } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Phase = 'credentials' | 'verify';

const SignIn = () => {
    const { signIn, errors, fetchStatus } = useSignIn();

    const [phase, setPhase] = useState<Phase>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [code, setCode] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [accountNotFound, setAccountNotFound] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const isSubmitting = fetchStatus === 'fetching';

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

    const localEmailError =
        email.length > 0 && !isValidEmail(email) ? 'Enter a valid email address' : null;

    const handleSubmit = async () => {
        setFormError(null);
        setAccountNotFound(false);

        if (!isValidEmail(email)) {
            setFormError('Enter a valid email address to continue.');
            return;
        }
        if (password.length === 0) {
            setFormError('Enter your password to continue.');
            return;
        }

        const { error } = await signIn.password({
            emailAddress: email.trim(),
            password,
        });

        const userData = signIn.userData;

        if (error) {
            if (error.code === 'form_identifier_not_found') {
                setAccountNotFound(true);
            }
            return;
        }

        if (signIn.status === 'complete') {
            console.log({ userData });
            await signIn.finalize();
            return;
        }

        // Clerk asks for an email code when this device isn't trusted yet (Device Trust),
        // or as a second factor when email MFA is enabled.
        const needsEmailCode =
            (signIn.status === 'needs_client_trust' || signIn.status === 'needs_second_factor') &&
            signIn.supportedSecondFactors.some(factor => factor.strategy === 'email_code');

        if (needsEmailCode) {
            const { error: codeError } = await signIn.mfa.sendEmailCode();
            if (codeError) {
                setFormError('Could not send a verification code. Please try again.');
                return;
            }
            startResendCooldown();
            setPhase('verify');
            return;
        }

        setFormError(
            'This account needs additional verification that this app does not support yet. Please contact support.'
        );
    };

    const handleVerify = async () => {
        setFormError(null);

        if (code.trim().length === 0) {
            setFormError('Enter the code we sent to your email.');
            return;
        }

        const { error } = await signIn.mfa.verifyEmailCode({ code: code.trim() });
        if (error) return;

        if (signIn.status === 'complete') {
            await signIn.finalize();
            return;
        }

        setFormError('That code did not complete your sign-in. Please try again.');
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setFormError(null);
        const { error } = await signIn.mfa.sendEmailCode();
        if (error) {
            setFormError('Could not resend the code. Please try again shortly.');
            return;
        }
        startResendCooldown();
    };

    const handleChangeEmail = async () => {
        await signIn.reset();
        setCode('');
        setFormError(null);
        setPhase('credentials');
    };

    return (
        <SafeAreaView className="auth-safe-area" edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                className="auth-screen"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    className="auth-scroll"
                    contentContainerClassName="auth-content"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
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

                        {phase === 'credentials' ? (
                            <>
                                <Text className="auth-title">Welcome back</Text>
                                <Text className="auth-subtitle">
                                    Sign in to continue managing your subscriptions
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text className="auth-title">Check your email</Text>
                                <Text className="auth-subtitle">
                                    To confirm it&apos;s you, enter the 6-digit code we sent to{' '}
                                    {email.trim()}
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

                            {accountNotFound && (
                                <View className="auth-error-banner">
                                    <Text className="auth-error-banner-text">
                                        We couldn&apos;t find an account with that email.{' '}
                                        <Link
                                            href={{
                                                pathname: '/(auth)/sign-up',
                                                params: { email: email.trim() },
                                            }}
                                            className="auth-link"
                                        >
                                            Create one
                                        </Link>
                                    </Text>
                                </View>
                            )}

                            {errors.global && errors.global.length > 0 && (
                                <View className="auth-error-banner">
                                    <Text className="auth-error-banner-text">
                                        {errors.global[0].longMessage || errors.global[0].message}
                                    </Text>
                                </View>
                            )}

                            {phase === 'credentials' ? (
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
                                        error={errors.fields.identifier?.message ?? localEmailError}
                                    />

                                    <AuthTextField
                                        label="Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Enter your password"
                                        secureTextEntry={!showPassword}
                                        autoComplete="password"
                                        textContentType="password"
                                        returnKeyType="go"
                                        onSubmitEditing={handleSubmit}
                                        error={errors.fields.password?.message}
                                        rightAction={{
                                            label: showPassword ? 'Hide' : 'Show',
                                            onPress: () => setShowPassword(current => !current),
                                        }}
                                    />

                                    <Link href="/(auth)/forgot-password" className="self-end">
                                        <Text className="auth-field-action">Forgot password?</Text>
                                    </Link>

                                    <AuthButton
                                        label="Sign in"
                                        onPress={handleSubmit}
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
                                        autoComplete="one-time-code"
                                        textContentType="oneTimeCode"
                                        maxLength={6}
                                        returnKeyType="go"
                                        onSubmitEditing={handleVerify}
                                        error={errors.fields.code?.message}
                                    />

                                    <AuthButton
                                        label="Verify and sign in"
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
                                            suppressHighlighting={resendCooldown > 0}
                                        >
                                            {resendCooldown > 0
                                                ? `Resend in ${resendCooldown}s`
                                                : 'Resend'}
                                        </Text>
                                    </View>

                                    <Text
                                        className="auth-link text-center"
                                        onPress={handleChangeEmail}
                                    >
                                        Use a different email
                                    </Text>
                                </>
                            )}
                        </View>

                        {phase === 'credentials' && (
                            <View className="auth-link-row">
                                <Text className="auth-link-copy">New to {APP_NAME}?</Text>
                                <Link href="/(auth)/sign-up" className="auth-link">
                                    Create an account
                                </Link>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignIn;
