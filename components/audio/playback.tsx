import useAudio from "@/hooks/recording/useAudio";
import Slider from "@react-native-community/slider";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { TabBarIcon } from "../navigation/TabBarIcon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useFocusEffect, useNavigation } from "expo-router";
import { Sound } from "expo-av/build/Audio";

export type URI = string | null | undefined;

type PlayButtonProps = {
    uri: URI;
    startSound: (uri: string, startPos: number | undefined) => Promise<void>;
    sound: Sound | undefined;
    status: boolean;
    playing: boolean;
    setPlaying: React.Dispatch<SetStateAction<boolean>>;
    onGoing: boolean;
    setOnGoing: React.Dispatch<SetStateAction<boolean>>;
    fileName?: string;
};

type ForwardBackwardProp = {
    f_or_b: string;
    uri: URI;
    startSound: (uri: string, startPos: number | undefined) => Promise<void>;
    progress: number;
    duration: number;
};

type SliderProp = {
    uri: URI;
    startSound: (uri: string, startPos: number | undefined) => Promise<void>;
    progress: number;
    duration: number;
    setPlaying: React.Dispatch<SetStateAction<boolean>>;
};

const useColor = () => {
    return {
        bgColor: useThemeColor({}, "background"),
        textColor: useThemeColor({}, "text"),
        primary: useThemeColor({}, "primary"),
        primary_tint: useThemeColor({}, "primary_tint"),
        secondary: useThemeColor({}, "secondary"),
        seconday_tint: useThemeColor({}, "secondary_tint"),
    };
};

export default function AudioPlayback({ uri }: { uri: URI; disabled?: boolean; fileName?: string }) {
    const { startSound, status, progress, duration, nextRecording, sound } = useAudio();
    const [playing, setPlaying] = useState<boolean>(false);
    const [onGoing, setOnGoing] = useState<boolean>(false);
    const color = useColor();
    const navigation = useNavigation();

    const soundRef = useRef(sound);
    useEffect(() => {
        soundRef.current = sound;
    }, [sound]);

    useEffect(() => {
        if (status) {
            setOnGoing(false);
            setPlaying(false);
        }
    }, [status]);

    useEffect(() => {
        if (uri && onGoing) {
            nextRecording(uri);
        }
    }, [uri]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                if (navigation.getId() === "/(tabs)/(recordingList)") {
                    soundRef.current?.pauseAsync();
                    soundRef.current = undefined;
                }
            };
        }, [])
    );

    return (
        <View style={[styles.mainView, { backgroundColor: color.primary_tint }]}>
            <AudioSlider
                uri={uri}
                progress={progress}
                duration={duration}
                startSound={startSound}
                setPlaying={setPlaying}
            />
            <View style={styles.playControls}>
                <ForwardBackward
                    f_or_b="b"
                    uri={uri}
                    startSound={startSound}
                    progress={progress}
                    duration={duration}
                />
                <PlayButton
                    uri={uri}
                    startSound={startSound}
                    sound={sound}
                    status={status}
                    playing={playing}
                    setPlaying={setPlaying}
                    onGoing={onGoing}
                    setOnGoing={setOnGoing}
                />
                <ForwardBackward
                    f_or_b="f"
                    uri={uri}
                    startSound={startSound}
                    progress={progress}
                    duration={duration}
                />
            </View>
        </View>
    );
}

const PlayButton: React.FC<PlayButtonProps> = ({
    uri,
    startSound,
    sound,
    playing,
    setPlaying,
    onGoing,
    setOnGoing,
}) => {
    const color = useColor();

    const startButton = () => {
        if (typeof uri === "string") {
            startSound(uri, undefined);
        }

        setOnGoing(true);
        setPlaying(true);
    };

    const pausePlayButton = () => {
        if (playing) {
            sound?.pauseAsync();
        } else {
            sound?.playAsync();
        }
        setPlaying(!playing);
    };

    return (
        <Pressable
            onPress={onGoing ? () => pausePlayButton() : () => startButton()}
            disabled={uri ? undefined : true}
        >
            <TabBarIcon
                color={uri ? color.primary : color.secondary}
                size={50}
                name={playing ? "pause-circle-sharp" : "play-circle-sharp"}
            />
        </Pressable>
    );
};

const ForwardBackward: React.FC<ForwardBackwardProp> = ({
    f_or_b,
    uri,
    startSound,
    progress,
    duration,
}) => {
    const color = useColor();
    const changePosition = () => {
        if (typeof uri === "string") {
            if (f_or_b === "f") {
                const moveTo = duration < 5000 ? duration : progress + 5000;
                startSound(uri, moveTo);
            } else {
                const moveTo = progress < 5000 ? 0 : progress - 5000;
                startSound(uri, moveTo);
            }
        }
    };

    return (
        <Pressable onPress={() => changePosition()} disabled={uri ? undefined : true}>
            <TabBarIcon
                color={uri ? color.primary : color.secondary}
                size={30}
                name={f_or_b === "f" ? "play-skip-forward" : "play-skip-back"}
            />
        </Pressable>
    );
};

const AudioSlider: React.FC<SliderProp> = ({ uri, startSound, progress, duration, setPlaying }) => {
    const [position, setPosition] = useState<number>();
    const color = useColor();

    useEffect(() => {
        setPosition(progress);
    }, [progress]);

    const changePosition = (val: number) => {
        setPosition(val);

        if (typeof uri === "string") {
            setPlaying(true);
            startSound(uri, val);
        }
    };

    return (
        <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={(val) => changePosition(val)}
            minimumTrackTintColor={color.primary}
            maximumTrackTintColor={color.secondary}
            thumbTintColor={color.primary}
            disabled={uri ? false : true}
        />
    );
};

const styles = StyleSheet.create({
    mainView: {
        marginTop: 10,
        borderRadius: 20,
        marginBottom: 10,
    },

    playControls: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 40,
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 20,
    },

    slider: {
        paddingTop: 20,
        marginLeft: 20,
        marginRight: 20,
    },
});
