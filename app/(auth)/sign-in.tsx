import AuthButton from '@/components/AuthButton';
import AuthTextField from '@/components/AuthTextField';
import { APP_NAME, APP_TAGLINE } from '@/constants/auth';
import { isValidEmail } from '@/lib/utlis';
import { useSignIn } from '@clerk/expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignIn = () => {
    const { signIn, errors, fetchStatus } = useSignIn();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [accountNotFound, setAccountNotFound] = useState(false);

    const isSubmitting = fetchStatus === 'fetching';

    const localEmailError = email.length > 0 && !isValidEmail(email) ? 'Enter a valid email address' : null;

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

        if (error) {
            if (error.code === 'form_identifier_not_found') {
                setAccountNotFound(true);
            }
            return;
        }

        if (signIn.status === 'complete') {
            await signIn.finalize();
            return;
        }

        setFormError(
            'This account needs additional verification that this app does not support yet. Please contact support.'
        );
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

                        <Text className="auth-title">Welcome back</Text>
                        <Text className="auth-subtitle">
                            Sign in to continue managing your subscriptions
                        </Text>
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
                                            className="auth-link">
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

                            <AuthButton label="Sign in" onPress={handleSubmit} loading={isSubmitting} />
                        </View>

                        <View className="auth-link-row">
                            <Text className="auth-link-copy">New to {APP_NAME}?</Text>
                            <Link href="/(auth)/sign-up" className="auth-link">
                                Create an account
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignIn;
