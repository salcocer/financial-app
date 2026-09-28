import { HStack, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
    containerBackground,
    font,
    foregroundStyle,
    lineLimit,
    minimumScaleFactor,
    opacity,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget } from 'expo-widgets';
import React from 'react';

type BalanceWidgetProps = {
    label?: string;
    amount?: string;
};

/**
 * iOS home screen widget that shows the current balance.
 *
 * The `'widget'` directive turns this function into a string that runs inside the
 * widget extension, not the app. It can't use hooks, app imports, or anything
 * declared outside the function — everything it shows arrives through props,
 * which the app sends with `BalanceWidget.updateSnapshot(...)`.
 */
const BalanceWidget = (props: BalanceWidgetProps) => {
    'widget';

    return (
        <HStack modifiers={[containerBackground('#ea7a53', 'widget')]}>
            <VStack alignment="leading" spacing={4}>
                <Text
                    modifiers={[
                        font({ size: 15, weight: 'semibold' }),
                        foregroundStyle('#ffffff'),
                        opacity(0.8),
                    ]}
                >
                    {props.label ?? 'Finly'}
                </Text>
                <Spacer />
                <Text
                    modifiers={[
                        font({ size: 30, weight: 'heavy', design: 'rounded' }),
                        foregroundStyle('#ffffff'),
                        lineLimit(1),
                        minimumScaleFactor(0.5),
                    ]}
                >
                    {props.amount ?? '—'}
                </Text>
            </VStack>
            <Spacer />
        </HStack>
    );
};

export default createWidget('BalanceWidget', BalanceWidget);
