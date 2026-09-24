import { colors } from '@/constants/theme';
import { clsx } from 'clsx';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const AuthTextField = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'none',
    autoComplete,
    textContentType,
    editable = true,
    maxLength,
    returnKeyType,
    onSubmitEditing,
    rightAction,
    inputRef,
}: AuthTextFieldProps) => {
    return (
        <View className="auth-field">
            <View className="auth-field-label-row">
                <Text className="auth-label">{label}</Text>
                {rightAction && (
                    <TouchableOpacity onPress={rightAction.onPress} hitSlop={8}>
                        <Text className="auth-field-action">{rightAction.label}</Text>
                    </TouchableOpacity>
                )}
            </View>
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.mutedForeground}
                className={clsx('auth-input', error && 'auth-input-error')}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                autoComplete={autoComplete}
                textContentType={textContentType}
                editable={editable}
                maxLength={maxLength}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
            />
            {error ? <Text className="auth-error">{error}</Text> : null}
        </View>
    );
};

export default AuthTextField;
