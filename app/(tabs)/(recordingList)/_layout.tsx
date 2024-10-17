import React from "react";
import { Stack } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

function recordingListLayout() {
    const bgColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: bgColor,
                },
                headerTintColor: textColor,
                headerTitleStyle: { fontFamily: "Poppins-SemiBold" },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    title: "Recording Database",
                }}
            />
            <Stack.Screen
                name="viewRecording"
                options={{
                    headerShown: true,
                    title: "Recording Database",
                }}
            />
            <Stack.Screen
                name="markSubmissions"
                options={{
                    headerShown: true,
                    title: "Grade",
                }}
            />
        </Stack>
    );
}

export default recordingListLayout;
