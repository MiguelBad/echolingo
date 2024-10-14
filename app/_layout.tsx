import React from "react";
import { Stack } from "expo-router";
import { UserProvider } from "@/contexts/UserContext";

export default function RootLayout() {
    return (
        <UserProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="index" />
            </Stack>
        </UserProvider>
    );
}
