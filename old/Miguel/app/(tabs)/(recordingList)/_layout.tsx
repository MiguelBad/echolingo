import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useThemeColor } from '@/hooks/useThemeColor';

function recordingListLayout() {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: bgColor,
                },
                headerTintColor: textColor,
            }}
        >
            <Stack.Screen
                name='index'
                options={{
                    headerShown: true,
                    title: 'Recording Database',
                }}
            />
        </Stack>
    );
}

export default recordingListLayout;

const styles = StyleSheet.create({
})
