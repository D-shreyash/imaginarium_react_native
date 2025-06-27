// app/news.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const newsData = [
  {
    id: 1,
    title: "Chandrayaan-3 Launched!",
    content:
      "India successfully launched Chandrayaan-3, marking a significant achievement in space exploration.",
    imageUrl:
      "https://www.isro.gov.in/media_isro/image/index/Chandrayaan3/MRM_8583.JPG.webp",
  },
  {
    id: 2,
    title: "A Cactus Garden",
    content:
      "Welcome to the AR Cactus Garden! Tap anywhere on the screen to grow a cactus.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2020/03/05/16/10/cactus-4904784_1280.jpg",
  },
  {
    id: 3,
    title: "Tech Innovations in 2025",
    content:
      "The latest advancements in AI, VR, and Quantum Computing are transforming industries.",
    imageUrl:
      "https://img.freepik.com/premium-photo/3d-technology-innovation-concepts_933496-6271.jpg",
  },
];

export default function News() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Latest News</Text>

      {newsData.map((news) => (
        <TouchableOpacity
          key={news.id}
          style={styles.newsCard}
          onPress={() => router.push(`/news/${news.id}`)} // Navigate to specific news item
        >
          {/* News Image */}
          <Image source={{ uri: news.imageUrl }} style={styles.newsImage} />

          {/* News Title */}
          <Text style={styles.newsTitle}>{news.title}</Text>

          {/* News Summary */}
          <Text style={styles.newsSummary}>{news.summary}</Text>

          {/* AR Icon if the news has AR content */}
          {news.arModel && (
            <Ionicons
              name="rocket"
              size={24}
              color="#f39c12"
              style={styles.arIcon}
            />
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ecf0f1",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  newsCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    transform: [{ scale: 1 }],
    transition: "transform 0.3s ease-in-out",
  },
  newsCardHovered: {
    transform: [{ scale: 1.05 }],
  },
  newsImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: "cover",
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
  },
  newsSummary: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 8,
    marginBottom: 12,
  },
  arIcon: {
    marginTop: 12,
    textAlign: "right",
  },
});
