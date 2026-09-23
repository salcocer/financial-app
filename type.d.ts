import type React from 'react';
import type {
    ImageSourcePropType,
    KeyboardTypeOptions,
    TextInput,
    TextInputProps,
} from 'react-native';

declare global {
    interface AppTab {
        name: string;
        title: string;
        icon: ImageSourcePropType;
    }

    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }

    interface Subscription {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        plan?: string;
        category?: string;
        paymentMethod?: string;
        status?: string;
        startDate?: string;
        price: number;
        currency?: string;
        billing: string;
        renewalDate?: string;
        color?: string;
    }

    interface SubscriptionCardProps extends Omit<Subscription, 'id'> {
        expanded: boolean;
        onPress: () => void;
        onCancelPress?: () => void;
        isCancelling?: boolean;
    }

    interface UpcomingSubscription {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        price: number;
        currency?: string;
        daysLeft: number;
    }

    interface UpcomingSubscriptionCardProps extends Omit<UpcomingSubscription, 'id'> {}

    interface ListHeadingProps {
        title: string;
    }

    interface AuthTextFieldProps {
        label: string;
        value: string;
        onChangeText: (value: string) => void;
        placeholder?: string;
        error?: string | null;
        secureTextEntry?: boolean;
        keyboardType?: KeyboardTypeOptions;
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
        autoComplete?: TextInputProps['autoComplete'];
        textContentType?: TextInputProps['textContentType'];
        editable?: boolean;
        maxLength?: number;
        returnKeyType?: TextInputProps['returnKeyType'];
        onSubmitEditing?: () => void;
        rightAction?: { label: string; onPress: () => void };
        inputRef?: React.RefObject<TextInput | null>;
    }

    interface AuthButtonProps {
        label: string;
        onPress: () => void;
        loading?: boolean;
        disabled?: boolean;
    }
}

export {};
