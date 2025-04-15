// Flávia Glenda Guimarães Carvalho
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground, TextInput } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { getFirestore, collection, getDocs, addDoc, Timestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { format } from "date-fns";
import Icon from 'react-native-vector-icons/Feather';
import AwesomeAlert from 'react-native-awesome-alerts';
import { app } from "../../firebaseConfig";

export default function ListarJogadores({ navigation }) {
    const redirecionarLogout = () => {
        navigation.navigate('PaginaPrincipal');
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [jogadores, setJogadores] = useState([]);
    const [jogadorAtual, setJogadorAtual] = useState(null);

    const [nome, setNome] = useState("");
    const [altura, setAltura] = useState("");
    const [camisa, setCamisa] = useState("");
    const [nascimento, setNascimento] = useState("");

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertColor, setAlertColor] = useState("#02782e");

    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [jogadorAExcluir, setJogadorAExcluir] = useState(null);

    useEffect(() => {
        carregarJogadores();
    }, []);

    const carregarJogadores = async () => {
        try {
            const querySnapshot = await getDocs(collection(getFirestore(app), "real-madrid"));
            const listaJogadores = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setJogadores(listaJogadores);
        } catch (error) {
            mostrarAlerta("Erro", "Erro ao listar jogadores.", "error");
        }
    };

    const mostrarAlerta = (titulo, mensagem, tipo) => {
        setAlertTitle(titulo);
        setAlertMessage(mensagem);
        setAlertColor(tipo === "success" ? "#4BB543" : "#D32F2F");
        setAlertVisible(true);
    };

    const limparFormulario = () => {
        setNome("");
        setAltura("");
        setCamisa("");
        setNascimento("");
        setMostrarFormulario(false);
        setJogadorAtual(null);
    };

    const addJogador = async () => {
        if (!nome || !altura || !camisa || !nascimento) {
            mostrarAlerta("Erro", "Por favor, preencha todos os campos.", "error");
            return;
        }

        try {
            const jogadoresCollection = collection(getFirestore(app), "real-madrid");
            const [day, month, year] = nascimento.split("/");
            const nascimentoDate = new Date(`${year}-${month}-${day}`);
            const nascimentoTimestamp = Timestamp.fromDate(nascimentoDate);

            await addDoc(jogadoresCollection, {
                nome: nome,
                altura: parseFloat(altura),
                camisa: camisa,
                nascimento: nascimentoTimestamp,
            });

            mostrarAlerta("Sucesso", "Jogador adicionado com sucesso!", "success");
            limparFormulario();
            carregarJogadores();
        } catch (error) {
            mostrarAlerta("Erro", "Ocorreu um erro ao adicionar o jogador.", "error");
        }
    };

    const editarJogador = (jogador) => {
        setJogadorAtual(jogador);
        setNome(jogador.nome);
        setAltura(jogador.altura.toString());
        setCamisa(jogador.camisa.toString());

        const dataFormatada = format(jogador.nascimento.toDate(), "dd/MM/yyyy");
        setNascimento(dataFormatada);

        setModalVisible(true);
        setMostrarFormulario(true);
    };

    const salvarJogador = async () => {
        const db = getFirestore(app);
        const jogadorRef = doc(db, "real-madrid", jogadorAtual.id);

        const [day, month, year] = nascimento.split("/");
        const nascimentoDate = new Date(`${year}-${month}-${day}T00:00:00`);
        const nascimentoTimestamp = Timestamp.fromDate(nascimentoDate);

        await updateDoc(jogadorRef, {
            nome,
            altura: parseFloat(altura),
            camisa,
            nascimento: nascimentoTimestamp,
        });

        const atualizarJogadores = jogadores.map((jogador) =>
            jogador.id === jogadorAtual.id
                ? { ...jogador, nome, altura, camisa, nascimento: nascimentoTimestamp }
                : jogador
        );

        setJogadores(atualizarJogadores);
        setModalVisible(false);
        setMostrarFormulario(false);
    };

    const deletarJogador = (id) => {
        setJogadorAExcluir(id);
        setConfirmDeleteVisible(true);
    };

    const confirmarExclusao = async () => {
        const db = getFirestore(app);
        const jogadorRef = doc(db, "real-madrid", jogadorAExcluir);

        await deleteDoc(jogadorRef);
        setJogadores(jogadores.filter((j) => j.id !== jogadorAExcluir));
        setConfirmDeleteVisible(false);
        setJogadorAExcluir(null);
    };

    return (
        <ImageBackground
            source={require('../../assets/fundo_jogadores.png')}
            style={styles.background}
            resizeMode="cover">
            <View style={styles.container}>
                <View style={styles.barraSuperior}>
                    <Pressable style={styles.logoutBotao} onPress={redirecionarLogout}>
                        <Text style={styles.logoutTexto}>Voltar</Text>
                    </Pressable>
                    <View style={styles.tituloContainer}>
                        <Text style={styles.titulo}>Lista de jogadores</Text>
                        <Pressable onPress={() => {
                            setMostrarFormulario(!mostrarFormulario);
                            limparFormulario();
                        }}>
                            <Icon name={mostrarFormulario ? "x" : "plus"} size={24} color="#fff" style={styles.iconeAdd} />
                        </Pressable>
                    </View>
                </View>

                {mostrarFormulario && (
                    <View style={styles.formulario}>
                        <Text style={styles.subtitulo}>{jogadorAtual ? "Editar Jogador" : "Adicionar Jogador"}</Text>
                        <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
                        <TextInput placeholder="Altura" value={altura} onChangeText={setAltura} keyboardType="numeric" style={styles.input} />
                        <TextInput placeholder="Camisa" value={camisa} onChangeText={setCamisa} keyboardType="numeric" style={styles.input} />
                        <TextInput placeholder="Nascimento (dd/mm/aaaa)" value={nascimento} onChangeText={setNascimento} style={styles.input} />

                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
                            <Pressable style={styles.botaoAdd} onPress={jogadorAtual ? salvarJogador : addJogador}>
                                <Text style={{ color: "#fff" }}>{jogadorAtual ? "Salvar" : "Adicionar"}</Text>
                            </Pressable>
                            <Pressable style={[styles.botaoAdd, { backgroundColor: "#aaa" }]} onPress={limparFormulario}>
                                <Text style={{ color: "#fff" }}>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

                <FlashList
                    data={jogadores}
                    style={styles.FlashList}
                    keyExtractor={(item) => item.id}
                    estimatedItemSize={50}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.nome}>Nome: {item.nome}</Text>
                            <Text style={styles.altura}>Altura: {item.altura}</Text>
                            <Text style={styles.camisa}>Camisa: {item.camisa}</Text>
                            <Text style={styles.nascimento}>
                                Nascimento: {item.nascimento
                                    ? format(item.nascimento.toDate(), "dd/MM/yyyy")
                                    : "Data inválida"}
                            </Text>

                            <View style={styles.iconesContainer}>
                                <Pressable onPress={() => editarJogador(item)}>
                                    <Icon name="edit" size={24} color="#02782e" style={styles.icone} />
                                </Pressable>
                                <Pressable onPress={() => deletarJogador(item.id)}>
                                    <Icon name="trash-2" size={24} color="#D32F2F" style={styles.icone} />
                                </Pressable>
                            </View>
                        </View>
                    )}
                />

                <AwesomeAlert
                    show={alertVisible}
                    showProgress={false}
                    title={alertTitle}
                    message={alertMessage}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmText="OK"
                    confirmButtonColor={alertColor}
                    onConfirmPressed={() => setAlertVisible(false)}
                />

                <AwesomeAlert
                    show={confirmDeleteVisible}
                    showProgress={false}
                    title="Confirmar Exclusão"
                    message="Tem certeza que deseja excluir este jogador?"
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="Cancelar"
                    confirmText="Excluir"
                    confirmButtonColor="#D32F2F"
                    cancelButtonColor="#aaa"
                    onCancelPressed={() => setConfirmDeleteVisible(false)}
                    onConfirmPressed={confirmarExclusao}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    barraSuperior: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    tituloContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        color: '#fff',
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#02782e',
    },
    iconeAdd: {
        marginLeft: 8,
    },
    logoutBotao: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    logoutTexto: {
        color: '#02782e',
        fontWeight: 'bold',
        fontSize: 16,
    },
    FlashList: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: "#fff",
        elevation: 2,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    item: {
        padding: 16,
        backgroundColor: "#f7f7f7",
        borderRadius: 8,
        marginVertical: 8,
    },
    nome: {
        color: '#02782e',
        fontSize: 19,
        fontWeight: "bold",
    },
    altura: {
        fontSize: 16,
        color: '#02782e',
    },
    camisa: {
        fontSize: 16,
        color: '#02782e',
    },
    nascimento: {
        fontSize: 16,
        color: '#02782e',
    },
    iconesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    icone: {
        marginLeft: 16,
    },
    formulario: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    input: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        borderRadius: 6,
        marginBottom: 8,
    },
    botaoAdd: {
        backgroundColor: "#02782e",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        alignItems: "center",
    },
});