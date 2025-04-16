// Flávia Glenda Guimarães Carvalho
import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Video } from "expo-av";
import s3 from '../../awsConfig';

const BUCKET_NAME = "bucket-storage-senai-04";
const FOLDER = "videos/";

export default function ListarVideosPorCategoria({ navigation }) {
    const [category, setCategory] = useState("");  
    const [categories, setCategories] = useState([]);  
    const [videos, setVideos] = useState([]); 
    const [loading, setLoading] = useState(true);  

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await s3.listObjectsV2({
                    Bucket: BUCKET_NAME,
                    Prefix: FOLDER,
                    Delimiter: "/",
                }).promise();

                const categoryFolders = response.CommonPrefixes?.map((prefix) => 
                    prefix.Prefix.replace(FOLDER, "").replace("/", "")
                ) || [];

                setCategories(categoryFolders);
                if (categoryFolders.length > 0) setCategory(categoryFolders[0]);
            } catch (error) {
                console.error("Erro ao listar categorias:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchVideos = async () => {
            if (!category) return;
            setLoading(true);
            const prefix = `${FOLDER}${category}/`;

            try {
                const response = await s3.listObjectsV2({
                    Bucket: BUCKET_NAME,
                    Prefix: prefix,
                }).promise();

                const videoFiles = response.Contents?.filter((file) =>
                    file.Key.match(/\.(mp4|mov|mkv|webm)$/i)
                ) || [];

                const videoURLs = videoFiles.map((file) => ({
                    name: file.Key.split("/").pop(),
                    url: `https://${BUCKET_NAME}.s3.amazonaws.com/${encodeURIComponent(file.Key)}`,
                }));

                setVideos(videoURLs);
            } catch (error) {
                console.error("Erro ao listar vídeos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [category]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Galeria de Vídeos</Text>

            <Text style={styles.subtitle}>Selecione uma categoria</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                >
                    {categories.map((cat) => (
                        <Picker.Item key={cat} label={cat} value={cat} />
                    ))}
                </Picker>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#32CD32" />
            ) : (
                <View style={styles.gallery}>
                    {videos.map((video, index) => (
                        <View key={index} style={styles.videoContainer}>
                            <Text style={styles.videoTitle}>{video.name}</Text>
                            <Video
                                source={{ uri: video.url }}
                                useNativeControls
                                resizeMode="contain"
                                shouldPlay={false}  // Configurar se o vídeo deve iniciar automaticamente
                                style={styles.video}
                            />
                        </View>
                    ))}
                </View>
            )}

            <Pressable style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                <Text style={styles.textoBotao}>Voltar</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: "center",
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#285137',  
        marginBottom: 20,
        textAlign: 'center',
        textTransform: 'uppercase', 
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 18,
        color: '#285137',  
        marginBottom: 10,
    },
    pickerContainer: {
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#285137',  
        borderRadius: 8,
        overflow: "hidden",
    },
    gallery: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: '100%',
    },
    videoContainer: {
        width: '100%',
        marginBottom: 16,
        padding: 4,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#285137',  
        marginBottom: 8,
    },
    video: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        resizeMode: "cover",
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    botaoVoltar: {
        backgroundColor: '#285137',  
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 20,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
