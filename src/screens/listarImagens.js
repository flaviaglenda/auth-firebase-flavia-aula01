// Flávia Glenda Guimarães Carvalho
import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, Image, ActivityIndicator, Pressable } from "react-native";
import s3 from '../../awsConfig';

const BUCKET_NAME = "bucket-storage-senai-04";
const FOLDER = "imagens/";

export default function ListarImagens({ navigation }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await s3.listObjectsV2({
                    Bucket: BUCKET_NAME,
                    Prefix: FOLDER,
                }).promise();

                const imageFiles = response.Contents?.filter((file) =>
                    file.Key.match(/\.(jpg|jpeg|png)$/i)
                ) || [];

                const imageURLs = imageFiles.map((file) => ({
                    name: file.Key.split("/").pop(),
                    url: `https://${BUCKET_NAME}.s3.amazonaws.com/${file.Key}`,
                }));

                setImages(imageURLs);
            } catch (error) {
                console.error("Erro ao listar imagens:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Galeria de Fotos</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.gallery}>
                    {images.map((img, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image source={{ uri: img.url }} style={styles.image} />
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
    gallery: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: '100%',
    },
    imageContainer: {
        width: '48%',
        marginBottom: 16,
        padding: 4,
    },
    image: {
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
