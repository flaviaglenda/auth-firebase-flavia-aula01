// Flávia Glenda Guimarães Carvalho
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, Pressable, StyleSheet, ImageBackground, ActivityIndicator, } from "react-native";
import SweetAlert from "react-native-sweet-alert";
import * as ImagePicker from "expo-image-picker";
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import AWS from "aws-sdk";
import app from "../../firebaseConfig";
import s3config from "../../awsConfig";

export default function EditarPerfil({ navigation }) {
    const db = getFirestore(app);
    const auth = getAuth();
    const [user, setUser] = useState(null);

    const [nome, setNome] = useState("");
    const [novoEmail, setNovoEmail] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [fotoAtual, setFotoAtual] = useState(require("../../assets/mulherr_icon.avif"));

    const [loading, setLoading] = useState(true);

    const S3_BUCKET = "bucket-storage-senai-04";
    const s3 = new AWS.S3(s3config);

    useEffect(() => {
        (async () => {
            const currentUser = auth.currentUser;
            setUser(currentUser);
            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setNome(data.nome || "");
                    setNovoEmail(currentUser.email || "");
                    setFotoAtual(
                        data.photoURL ? { uri: data.photoURL } : require("../../assets/mulherr_icon.avif")
                    );
                }
            }
            setLoading(false);
        })();
    }, []);

    const showAlert = (title, message, style = "default") => {
        SweetAlert.showAlertWithOptions({
            title,
            subTitle: message,
            confirmButtonTitle: "OK",
            style,
        });
    };

    const uploadImage = async (uri) => {
        try {
            const filename = uri.split("/").pop();
            const currentUser = auth.currentUser;
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
            showAlert("Sucesso", "Foto de perfil atualizada!", "success");
        } catch (error) {
            console.error("Erro ao enviar imagem:", error);
            showAlert("Erro", "Não foi possível atualizar a foto.", "error");
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
        if (!user) {
            showAlert("Atenção", "Usuário não autenticado.", "error");
            return;
        }
        if (!senhaAtual) {
            showAlert("Atenção", "Digite sua senha atual.", "error");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, senhaAtual);
            await reauthenticateWithCredential(user, credential);

            await updateDoc(doc(db, "users", user.uid), { nome });

            if (novoEmail !== user.email) {
                await updateEmail(user, novoEmail);
            }

            if (novaSenha) {
                await updatePassword(user, novaSenha);
            }

            showAlert("Sucesso", "Perfil atualizado com sucesso!", "success");
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            if (error.code === "auth/invalid-credential") {
                showAlert("Erro", "Senha atual incorreta.", "error");
            } else if (error.code === "auth/operation-not-allowed") {
                showAlert(
                    "Erro",
                    "Mudança de e‑mail não permitida. Habilite Email/Password no Console Firebase.",
                    "error"
                );
            } else {
                showAlert("Erro", "Ocorreu um erro ao atualizar o perfil.", "error");
            }
        }
    };

    if (loading) {
        return (
            <View style={styles.background}>
                <ActivityIndicator size="large" color="#02782e" />
                <Text style={{ color: "#fff", marginTop: 10 }}>Carregando usuário...</Text>
            </View>
        );
    }

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
    textoBotao: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
    textoBotaoVoltar: {
        color: "#285137",
        fontSize: 16,
        fontWeight: "bold",
    },
});
