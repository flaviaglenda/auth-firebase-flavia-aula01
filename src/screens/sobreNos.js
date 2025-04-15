// Flávia Glenda Guimarães Carvalho
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, ImageBackground } from 'react-native';

export default function SobreNos({ navigation }) {
    return (
        <ImageBackground
            source={require('../../assets/fundo_pagina.png')}
            style={styles.background}>

            <View style={styles.container}>
                <Pressable style={styles.botao} onPress={() => navigation.goBack()}>
                    <Text style={styles.textoBotao}>Voltar</Text>
                </Pressable>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}>

                    <Text style={styles.titulo}>Sobre o Real Madrid</Text>

                    <Image
                        source={require('../../assets/real_madrid.jpg')}
                        style={styles.imagemTime}
                    />

                    <Text style={styles.texto}>
                        O Real Madrid Club de Fútbol, fundado em 6 de março de 1902, é um dos clubes de futebol mais famosos e bem-sucedidos do mundo.
                        Com uma história repleta de glórias, o clube se tornou um verdadeiro símbolo do futebol mundial.
                    </Text>

                    <Text style={styles.subtitulo}>🏆 Títulos e Conquistas</Text>
                    <Text style={styles.texto}>
                        O Real Madrid é o clube com mais títulos da Liga dos Campeões da UEFA, tendo conquistado a competição em 14 ocasiões.
                        Além disso, o clube também coleciona dezenas de títulos nacionais, incluindo 35 Campeonatos Espanhóis (La Liga) e
                        20 Copas do Rei. No cenário internacional, o Real Madrid já venceu 5 Mundiais de Clubes da FIFA.
                    </Text>

                    <Text style={styles.subtitulo}>⚽ Grandes Lendas do Clube</Text>
                    <Text style={styles.texto}>
                        O Real Madrid teve em seu elenco alguns dos maiores jogadores da história do futebol. Entre os ídolos do clube, podemos destacar:
                        {'\n'}- Cristiano Ronaldo (Maior artilheiro da história do clube)
                        {'\n'}- Alfredo Di Stéfano (Lenda do futebol mundial)
                        {'\n'}- Raúl González (Símbolo da garra madridista)
                        {'\n'}- Zinedine Zidane (Craque como jogador e técnico vitorioso)
                        {'\n'}- Sergio Ramos (Capitão e líder em conquistas históricas)
                    </Text>

                    <Text style={styles.subtitulo}>🏟️ O Estádio Santiago Bernabéu</Text>
                    <Text style={styles.texto}>
                        O estádio do Real Madrid, o Santiago Bernabéu, é um dos templos do futebol mundial. Localizado no coração de Madri,
                        o estádio tem capacidade para mais de 80 mil torcedores e já foi palco de inúmeras finais históricas, incluindo finais da Champions League e da Copa do Mundo.
                    </Text>

                    <Text style={styles.subtitulo}>📈 O Clube Mais Valioso do Mundo</Text>
                    <Text style={styles.texto}>
                        Além do sucesso esportivo, o Real Madrid também é um dos clubes mais valiosos e rentáveis do mundo. Com milhões de torcedores espalhados pelo planeta,
                        o clube é conhecido por sua grande base de fãs e seus contratos milionários de patrocínio.
                    </Text>
                </ScrollView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    container: {
        width: '100%',
        maxWidth: 600,
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    content: {
        alignItems: 'center',
        flexGrow: 1,
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#02782e',
        marginBottom: 20,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    subtitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#02782e',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    imagemTime: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        marginBottom: 20,
    },
    texto: {
        fontSize: 16,
        color: '#000',
        textAlign: 'justify',
        marginBottom: 15,
        lineHeight: 24,
    },
    botao: {
        backgroundColor: '#02782e',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
