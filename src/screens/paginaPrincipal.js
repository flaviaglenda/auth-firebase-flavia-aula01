// Flávia Glenda Guimarães Carvalho
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const PaginaPrincipal = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Página Principal</Text>

            <Pressable style={styles.botao} onPress={() => navigation.navigate('AdicionarUsuario')}>
                <Text style={styles.textoBotao}>Adicionar user</Text>
            </Pressable>

            <Pressable style={styles.botao} onPress={() => navigation.navigate('EditarPerfil')}>
                <Text style={styles.textoBotao}>Editar perfil</Text>
            </Pressable>

            <Pressable style={styles.botao} onPress={() => navigation.navigate('ListarJogadores')}>
                <Text style={styles.textoBotao}>Listar Jogadores</Text>
            </Pressable>

            <Pressable style={styles.botao} onPress={() => navigation.navigate('Lampada')}>
                <Text style={styles.textoBotao}>Lâmpada</Text>
            </Pressable>

            <Pressable style={styles.botao} onPress={() => navigation.navigate('CalcularImc')}>
                <Text style={styles.textoBotao}>Calcular IMC</Text>
            </Pressable>

            <Pressable style={styles.botao} onPress={() => navigation.navigate('SobreNos')}>
                <Text style={styles.textoBotao}>Sobre nós</Text>
            </Pressable>

            <Pressable style={styles.botao} onPress={() => navigation.navigate('ListarImagens')}>
                <Text style={styles.textoBotao}>Listar imagens</Text>
            </Pressable>

            <Pressable style={styles.botao} onPress={() => navigation.navigate('UploadImagens')}>
                <Text style={styles.textoBotao}>Carregar fotos</Text>
            </Pressable>

            <Pressable style={[styles.botao, styles.botaoLogout]} onPress={() => navigation.navigate('RealizarLogin')}>
                <Text style={styles.textoBotaoSair}>Sair</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#285137',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 30,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    botao: {
        backgroundColor: 'white',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: 200,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    botaoLogout: {
        backgroundColor: 'red',
    },
    textoBotao: {
        color: '#285137',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    textoBotaoSair: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default PaginaPrincipal;
