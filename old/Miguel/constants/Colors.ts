/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#53414e';
const tintColorDark = '#53414e';

export const Colors = {
    light: {
        text: '#0e0b0d',
        background: '#efebed',
        tint: tintColorLight,
        icon: '#78605e',
        secondary: '#241d1e',
        tabIconDefault: '#b09b9e',
        tabIconSelected: tintColorLight,
        accent: '#d0c9ce',
    },
    dark: {
        text: '#f4f1f3',
        background: '#141012',
        secondary: '#241d1e',
        tint: tintColorDark,
        icon: '#78605e',
        tabIconDefault: '#b09b9e',
        tabIconSelected: tintColorDark,
        accent: '#362f33',
    },
};

