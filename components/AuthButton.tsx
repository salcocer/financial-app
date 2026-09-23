import { colors } from '@/constants/theme';
import clsx from 'clsx';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

const AuthButton = ({ label, onPress, loading, disabled }: AuthButtonProps) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            className={clsx('auth-button', isDisabled && 'auth-button-disabled')}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.85}>
            {loading ? (
                <ActivityIndicator color={colors.primary} />
            ) : (
                <Text className="auth-button-text">{label}</Text>
            )}
        </TouchableOpacity>
    );
};

export default AuthButton;
