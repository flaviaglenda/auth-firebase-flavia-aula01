//Flávia Glenda Guimarães Carvalho
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground } from 'react-native';

export default function CalcularImc({ navigation }) {
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [resultado, setResultado] = useState('');

    const calcularIMC = () => {
        if (peso && altura) {
            let imc = peso / ((altura / 100) * (altura / 100));
            setResultado(`Seu IMC é: ${imc.toFixed(2)}`);
        }
    };

    return (
        <ImageBackground 
            source={require('../../assets/fundo_pagina.png')} 
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.titulo}>Calcule seu IMC</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Peso (kg)"
                    keyboardType="numeric"
                    onChangeText={setPeso}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Altura (cm)"
                    keyboardType="numeric"
                    onChangeText={setAltura}
                />

                <View style={styles.botoesContainer}>
                    <Pressable style={styles.botaoCalcular} onPress={calcularIMC}>
                        <Text style={styles.textoBotaoCalcular}>Calcular</Text>
                    </Pressable>

                    <Pressable style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                        <Text style={styles.textoBotaoVoltar}>Voltar</Text>
                    </Pressable>
                </View>

                {resultado ? <Text style={styles.resultado}>{resultado}</Text> : null}
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#02782e',
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    botaoCalcular: {
        backgroundColor: '#02782e',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    botaoVoltar: {
        backgroundColor: '#e9e5e5',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
    textoBotaoCalcular: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textoBotaoVoltar: {
        color: '#02782e',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultado: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});
