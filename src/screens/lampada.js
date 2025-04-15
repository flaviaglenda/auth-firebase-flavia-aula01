// Flávia Glenda Guimarães Carvalho
import React, { useState } from 'react';
import { View, Image, Pressable, StyleSheet, Text } from 'react-native';

export default function Lampada({ navigation }) {
    const [acesa, setAcesa] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: acesa ? '#fff' : '#000' }]}>
            <Image
                source={acesa ? require('../../assets/luz_acesa.png') : require('../../assets/luz_apagada.png')}
                style={styles.imagem}
            />

            <Pressable style={styles.botaoAcender} onPress={() => setAcesa(!acesa)}>
                <Text style={styles.textoBotao}>
                    {acesa ? 'Apagar' : 'Acender'}
                </Text>
            </Pressable>

            <Pressable style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                <Text style={styles.textoBotao}>Voltar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagem: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    botaoAcender: {
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 10,
    },
    botaoVoltar: {
        backgroundColor: '#285137',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
