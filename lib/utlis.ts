import { PASSWORD_MIN_LENGTH } from '@/constants/auth';
import dayjs from 'dayjs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const formatCurrency = (value: number, currency = 'USD'): string => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    } catch {
        return value.toFixed(2);
    }
};

export const formatSubscriptionDateTime = (value?: string): string => {
    if (!value) return 'Not provided';
    const parsedDate = dayjs(value);
    return parsedDate.isValid() ? parsedDate.format('MM/DD/YYYY') : 'Not provided';
};

export const formatStatusLabel = (value?: string): string => {
    if (!value) return 'Unknown';
    return value.charAt(0).toUpperCase() + value.slice(1);
};

export const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value.trim());

export const isValidPassword = (value: string): boolean => value.length >= PASSWORD_MIN_LENGTH;
