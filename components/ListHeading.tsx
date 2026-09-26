import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

const ListHeading = ({ title }: ListHeadingProps) => {
    const { t } = useTranslation();
    return (
        <View className="list-head">
            <Text className="list-title">{title}</Text>
            <TouchableOpacity className="list-action">
                <Text className="list-action-text">{t('list.seeAll')}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ListHeading;
