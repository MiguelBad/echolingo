import { useRef, useState } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { View, StyleSheet, Button, Pressable } from "react-native";
import React from "react";
import { ImageBackground } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useUserNameContext } from "@/contexts/UserContext";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Camera() {
    const userName = useUserNameContext();
    const [facing, setFacing] = useState<CameraType>("front");
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<string>();
    const [didTake, setDidTake] = useState<boolean>(false);
    const cameraRef = useRef<CameraView | null>(null);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={{}}>
                <ThemedText style={{}}>We need your permission to show the camera</ThemedText>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    const takePicture = async () => {
        setDidTake(true);

        // todo error handle
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();

                if (!photo) {
                    throw new Error("Photo does not exist");
                }

                setPhotoUri(photo.uri);
            } catch (err) {
                console.error("Failed taking a picture", err);
                setDidTake(false);
            }
        }
    };

    const saveImage = async () => {
        try {
            if (!photoUri) {
                throw new Error("Image uri does not exist");
            }
            const response = await fetch(photoUri);
            const imageBlob = await response.blob();

            const filePath = `profilePic/${userName}`;
            const fileRef = ref(storage, filePath);
            if (!fileRef) {
                throw new Error("Failed to get reference of image");
            }

            await uploadBytes(fileRef, imageBlob);

            router.navigate({ pathname: "/(profile)" });
        } catch (error) {
            console.error("Failed to save image to firebase");
        }
    };

    return (
        <View style={styles.mainView}>
            {didTake ? (
                <ImageBackground
                    source={{ uri: photoUri }}
                    style={{
                        height: "100%",
                    }}
                    resizeMode="cover"
                >
                    <Pressable onPress={() => setDidTake(false)}>
                        <ThemedText style={{ color: "pink" }}>Take Another</ThemedText>
                    </Pressable>
                    <Pressable onPress={() => saveImage()}>
                        <ThemedText style={{ color: "pink" }}>Save</ThemedText>
                    </Pressable>
                </ImageBackground>
            ) : (
                <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                    <View style={styles.camera__topOptions}>
                        <Pressable
                            style={{}}
                            onPress={() => router.navigate({ pathname: "/(profile)" })}
                        >
                            <Ionicons name="close-sharp" size={40} />
                        </Pressable>
                        <Pressable style={{}} onPress={toggleCameraFacing}>
                            <Ionicons name="camera-reverse-sharp" size={40} />
                        </Pressable>
                    </View>
                    <View style={styles.camera__shutterContainer}>
                        <Pressable onPress={takePicture} style={styles.camera__shutter}>
                            <Ionicons name="ellipse-sharp" size={80} color="white" />
                        </Pressable>
                    </View>
                </CameraView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: "black",
    },

    camera: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },

    camera__shutter: {
        alignSelf: "flex-start",
        borderRadius: 75,
    },

    camera__shutterContainer: {
        alignSelf: "center",
        marginBottom: 20,
    },

    camera__topOptions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
    },
});
