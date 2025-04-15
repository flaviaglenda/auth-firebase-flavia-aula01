// Flávia Glenda Guimarães Carvalho
import React, { useState } from "react";
import { View, TextInput, Pressable, Text, ImageBackground, Image, StyleSheet, } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";
import AwesomeAlert from "react-native-awesome-alerts";

const S3_BUCKET = "bucket-storage-senai-04";
const s3 = new AWS.S3();

const registerUser = async (email, password, nome, imageUri, showCustomAlert) => {
    const auth = getAuth(getApp());
    const firestore = getFirestore(getApp());

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
        const filePath = `profile_images/${user.uid}/${filename}`;

        const response = await fetch(imageUri);
        const blob = await response.blob();

        const uploadParams = {
            Bucket: S3_BUCKET,
            Key: filePath,
            Body: blob,
            ContentType: "image/jpeg",
        };

        const uploadResult = await s3.upload(uploadParams).promise();
        const photoURL = uploadResult.Location;

        await setDoc(doc(firestore, "users", user.uid), {
            uid: user.uid,
            email: email,
            nome: nome,
            photoURL: photoURL,
        });

        console.log("Usuário registrado e imagem salva no S3");
        return user;
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        showCustomAlert("Erro", "Não foi possível registrar o usuário.", false);
    }
};

export default function Cadastro({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome] = useState("");
    const [imageUri, setImageUri] = useState(null);

    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(true);

    const showCustomAlert = (title, message, success = true) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setIsSuccess(success);
        setShowAlert(true);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !nome || !imageUri) {
            showCustomAlert("Erro", "Por favor, preencha todos os campos e selecione uma imagem.", false);
            return;
        }

        if (password.length < 6) {
            showCustomAlert("Erro", "A senha deve ter no mínimo 6 caracteres.", false);
            return;
        }

        const user = await registerUser(email, password, nome, imageUri, showCustomAlert);
        if (user) {
            showCustomAlert("Sucesso", "Usuário cadastrado com sucesso!");
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/fundo_pagina.png")}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.titulo}>Cadastro</Text>

                <Image
                    source={
                        imageUri
                            ? { uri: imageUri }
                            : require("../../assets/mulherr_icon.avif")
                    }
                    style={styles.imagemPerfil}
                />

                <Pressable style={styles.botaoFoto} onPress={pickImage}>
                    <Text style={styles.textoBotao}>Selecionar Imagem</Text>
                </Pressable>

                <TextInput
                    placeholder="Nome"
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                />

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    placeholder="Senha"
                    placeholderTextColor="#ccc"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.botoesContainer}>
                    <Pressable style={styles.botaoSalvar} onPress={handleRegister}>
                        <Text style={styles.textoBotao}>Registrar</Text>
                    </Pressable>

                    <Pressable style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                        <Text style={styles.textoBotaoVoltar}>Voltar</Text>
                    </Pressable>
                </View>
            </View>

            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alertTitle}
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor={isSuccess ? "#4BB543" : "#DD6B55"}
                onConfirmPressed={() => {
                    setShowAlert(false);
                    if (isSuccess) {
                        setEmail("");
                        setPassword("");
                        setNome("");
                        setImageUri(null);
                    }
                }}
            />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    container: {
        width: "90%",
        padding: 20,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 10,
        alignItems: "center",
    },
    titulo: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
        textTransform: "uppercase",
    },
    imagemPerfil: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    botaoFoto: {
        backgroundColor: "#02782e",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    input: {
        width: "90%",
        backgroundColor: "#e9e5e5",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    botoesContainer: {
        flexDirection: "row",
        width: "90%",
        justifyContent: "space-between",
        marginTop: 10,
    },
    botaoSalvar: {
        backgroundColor: "#02782e",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: "48%",
        alignItems: "center",
    },
    botaoVoltar: {
        backgroundColor: "#e9e5e5",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: "48%",
        alignItems: "center",
    },
    textoBotao: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    textoBotaoVoltar: {
        color: "#285137",
        fontSize: 16,
        fontWeight: "bold",
    },
});
