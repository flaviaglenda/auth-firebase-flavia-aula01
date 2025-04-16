// Flávia Glenda Guimarães Carvalho
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    Pressable,
    StyleSheet,
    ImageBackground,
} from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import * as ImagePicker from "expo-image-picker";
import {
    getAuth,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    updateDoc,
    getDoc,
} from "firebase/firestore";
import AWS from "aws-sdk";
import app from "../../firebaseConfig";
import s3config from "../../awsConfig";

export default function EditarPerfil({ navigation }) {
    const db = getFirestore(app);
    const [nome, setNome] = useState("");
    const [novoEmail, setNovoEmail] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [fotoAtual, setFotoAtual] = useState(require("../../assets/mulherr_icon.avif"));
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [successAlert, setSuccessAlert] = useState(false);
    const [user, setUser] = useState(null);

    const S3_BUCKET = "bucket-storage-senai-04";
    const s3 = new AWS.S3(s3config);

    useEffect(() => {
        const loadUserData = async () => {
            const currentUser = getAuth().currentUser;
            setUser(currentUser);

            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setNome(data.nome || "");
                    setNovoEmail(currentUser.email || "");
                    setFotoAtual(data.photoURL ? { uri: data.photoURL } : require("../../assets/mulherr_icon.avif"));
                }
            }
        };

        loadUserData();
    }, []);

    const showAlert = (message, success = false) => {
        setAlertMessage(message);
        setSuccessAlert(success);
        setAlertVisible(true);
    };

    const uploadImage = async (uri) => {
        try {
            const filename = uri.substring(uri.lastIndexOf("/") + 1);
            const currentUser = getAuth().currentUser;
            const filePath = `profile_images/${currentUser.uid}/${filename}`;

            const response = await fetch(uri);
            const blob = await response.blob();

            const uploadParams = {
                Bucket: S3_BUCKET,
                Key: filePath,
                Body: blob,
                ContentType: "image/jpeg",
            };

            const uploadResult = await s3.upload(uploadParams).promise();
            const photoURL = uploadResult.Location;

            await updateDoc(doc(db, "users", currentUser.uid), { photoURL });
            setFotoAtual({ uri: photoURL });
        } catch (error) {
            console.error("Erro ao enviar imagem", error);
            showAlert("Erro ao atualizar a foto.");
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            await uploadImage(result.assets[0].uri);
        }
    };

    const handleUpdateProfile = async () => {
        const currentUser = getAuth().currentUser;

        if (!currentUser) {
            showAlert("Usuário não autenticado. Faça login novamente.");
            return;
        }

        if (!senhaAtual) {
            showAlert("Digite sua senha atual para atualizar o perfil.");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(currentUser.email, senhaAtual);
            await reauthenticateWithCredential(currentUser, credential);

            await updateDoc(doc(db, "users", currentUser.uid), { nome });

            if (novoEmail !== currentUser.email) {
                await updateEmail(currentUser, novoEmail);
            }

            if (novaSenha) {
                await updatePassword(currentUser, novaSenha);
            }

            showAlert("Perfil atualizado com sucesso!", true);
        } catch (error) {
            console.error("Erro ao atualizar perfil: ", error);
            showAlert("Ocorreu um erro ao atualizar o perfil.");
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/fundo_pagina.png")}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.titulo}>Editar Perfil</Text>

                <Image source={fotoAtual} style={styles.imagemPerfil} />

                <Pressable style={styles.botaoFoto} onPress={handlePickImage}>
                    <Text style={styles.textoBotao}>Alterar Foto</Text>
                </Pressable>

                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome"
                    placeholderTextColor="#ccc"
                />

                <TextInput
                    style={styles.input}
                    value={novoEmail}
                    onChangeText={setNovoEmail}
                    placeholder="E-mail"
                    keyboardType="email-address"
                    placeholderTextColor="#ccc"
                />

                <TextInput
                    style={styles.input}
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                    placeholder="Nova Senha"
                    secureTextEntry
                    placeholderTextColor="#ccc"
                />

                <TextInput
                    style={styles.input}
                    value={senhaAtual}
                    onChangeText={setSenhaAtual}
                    placeholder="Senha Atual"
                    secureTextEntry
                    placeholderTextColor="#ccc"
                />

                <View style={styles.botoesContainer}>
                    <Pressable style={styles.botaoSalvar} onPress={handleUpdateProfile}>
                        <Text style={styles.textoBotao}>Salvar</Text>
                    </Pressable>

                    <Pressable style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                        <Text style={styles.textoBotaoVoltar}>Voltar</Text>
                    </Pressable>
                </View>
            </View>

            <AwesomeAlert
                show={alertVisible}
                showProgress={false}
                title={successAlert ? "Sucesso!" : "Atenção"}
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor={successAlert ? "#4BB543" : "#DD6B55"}
                onConfirmPressed={() => {
                    setAlertVisible(false);
                    if (successAlert) navigation.goBack();
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
