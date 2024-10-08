import { Tabs, useLocalSearchParams } from "expo-router";
import { TabBarIcon, UserIcon, ClipboardListIcon } from "@/components/navigation/TabBarIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CourseProvider } from "@/contexts/CourseContext";
import { DharugProvider } from "@/contexts/DharugContext";

export default function RootLayout() {
    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const tabFocusColor = useThemeColor({}, 'tabIconSelected');
    const tabUnfocusedColor = useThemeColor({}, 'tabIconDefault');

    const params = useLocalSearchParams();
    const userType = Array.isArray(params.userType) ? params.userType[0] : params.userType;
    const userName = Array.isArray(params.userName) ? params.userName[0] : params.userName;

    return (
        <CourseProvider>
            <DharugProvider>
                <Tabs
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: bgColor,
                            shadowColor: textColor,
                        },
                        headerTintColor: textColor,
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: "Home",
                            tabBarActiveTintColor: tabFocusColor,
                            tabBarInactiveTintColor: tabUnfocusedColor,
                            tabBarIcon: ({ size, focused }) => (
                                <TabBarIcon
                                    name={focused ? 'home' : 'home-outline'}
                                    color={focused ? tabFocusColor : tabUnfocusedColor}
                                    size={size} />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="(tasks)"
                        options={{
                            title: "Tasks",
                            headerShown: false,
                            tabBarActiveTintColor: tabFocusColor,
                            tabBarInactiveTintColor: tabUnfocusedColor,
                            tabBarIcon: ({ color, focused }) => (
                                <ClipboardListIcon color={focused ? tabFocusColor : tabUnfocusedColor} />
                            ),
                            href: userType === 'teacher' ? null : "/(tasks)"
                        }}
                    />
                    <Tabs.Screen
                        name="(recordingList)"
                        options={{
                            title: "Recording List",
                            headerShown: false,
                            tabBarActiveTintColor: tabFocusColor,
                            tabBarInactiveTintColor: tabUnfocusedColor,
                            tabBarIcon: ({ color, focused }) => (
                                <TabBarIcon
                                    name={focused ? 'list' : 'list-sharp'}
                                    color={focused ? tabFocusColor : tabUnfocusedColor} />
                            ),
                            href: userType !== 'teacher' ? null : "/(recordingList)"
                        }}
                    />

                    <Tabs.Screen
                        name="(addRecording)"
                        options={{
                            title: "Add Recording",
                            headerShown: false,
                            tabBarActiveTintColor: tabFocusColor,
                            tabBarInactiveTintColor: tabUnfocusedColor,
                            tabBarIcon: ({ color, focused }) => (
                                <TabBarIcon
                                    name={focused ? 'add' : 'add-sharp'}
                                    color={focused ? tabFocusColor : tabUnfocusedColor} />
                            ),
                            href: userType !== 'teacher' ? null : "/(addRecording)"
                        }}
                    />

                    <Tabs.Screen
                        name="profile"
                        options={{
                            title: "Profile",
                            tabBarActiveTintColor: tabFocusColor,
                            tabBarInactiveTintColor: tabUnfocusedColor,
                            tabBarIcon: ({ color, focused }) => (
                                <UserIcon color={focused ? tabFocusColor : tabUnfocusedColor} />
                            )
                        }}
                    />
                </Tabs>
            </DharugProvider>
        </CourseProvider >
    );
}
