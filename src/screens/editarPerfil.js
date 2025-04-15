//Flávia Glenda Guimarães Carvalho
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, } from "firebase/auth";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import app from '../../firebaseConfig';
import s3 from '../../awsConfig'

export default function EditarPerfil({ navigation }) {
    const [nome, setNome] = useState('Flávia Glenda');
    const [email, setEmail] = useState('flaviaglenda15@gmail.com');
    const [senha, setSenha] = useState('240824');
    const [foto, setFoto] = useState(require('../../assets/mulherr_icon.avif'));


    const S3_BUCKET = "bucket-storage-senai-04";
    const s3 = new AWS.S3();

    const editarPerfil = ({ navigation }) => {
        const auth = getAuth();
        const db = getFirestore(app);
        const user = auth.currentUser;
        const userDocRef = doc(db, "users", user.uid);

        const [nome, setNome] = useState("");
        const [novoEmail, setNovoEmail] = useState("");
        const [novaSenha, setNovaSenha] = useState("");
        const [senhaAtual, setSenhaAtual] = useState("");
        const [fotoAtual, setFotoAtual] = useState("")
    }

    return (
        <ImageBackground
            source={require('../../assets/fundo_pagina.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.titulo}>Editar Perfil</Text>

                <Image source={foto} style={styles.imagemPerfil} />

                <Pressable style={styles.botaoFoto}>
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
                    value={email}
                    onChangeText={setEmail}
                    placeholder="E-mail"
                    keyboardType="email-address"
                    placeholderTextColor="#ccc"
                />

                <TextInput
                    style={styles.input}
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Senha"
                    secureTextEntry
                    placeholderTextColor="#ccc"
                />

                <View style={styles.botoesContainer}>
                    <Pressable style={styles.botaoSalvar}>
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
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    container: {
        width: '90%',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        alignItems: 'center',
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    imagemPerfil: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    botaoFoto: {
        backgroundColor: '#02782e',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 20,
    },
    input: {
        width: '90%',
        backgroundColor: '#e9e5e5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    botoesContainer: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    botaoSalvar: {
        backgroundColor: '#02782e',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    botaoVoltar: {
        backgroundColor: '#e9e5e5',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textoBotaoVoltar: {
        color: '#285137',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
