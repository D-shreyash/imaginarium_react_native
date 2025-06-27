import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

export default function Home() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const newsScrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      newsScrollRef.current?.scrollTo({
        x: (scrollX._value + 300) % (newsData.length * 300),
        animated: true,
      });
      scrollX.setValue((scrollX._value + 300) % (newsData.length * 300));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle" size={50} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search topics..."
        placeholderTextColor="#7f8c8d"
      />

      {/* News Feed */}
      <Text style={styles.sectionTitle}>News Feed</Text>
      <ScrollView
        ref={newsScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.newsFeed}
        scrollEventThrottle={16}
      >
        {newsData.map((news) => (
          <TouchableOpacity
            key={news.id}
            style={styles.newsItem}
            onPress={() => router.push(`/news/${news.id}`)}
          >
            <ImageBackground
              source={{ uri: news.imageUrl }}
              style={styles.newsImage}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.newsText}>{news.title}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoryContainer}>
        {["Maths", "Chemistry", "Biology", "Physics", "English"].map(
          (topic) => (
            <TouchableOpacity
              key={topic}
              style={styles.categoryCard}
              onPress={() => router.push(`/${topic.toLowerCase()}`)}
            >
              <Text style={styles.categoryText}>{topic}</Text>
            </TouchableOpacity>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ecf0f1", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#2c3e50" },
  input: {
    backgroundColor: "#bdc3c7",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    color: "#2c3e50",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 24,
    color: "#2c3e50",
  },
  newsFeed: { flexDirection: "row", marginTop: 8, height: 150 },
  newsItem: {
    marginRight: 12,
    borderRadius: 10,
    overflow: "hidden",
    width: 300,
    height: 140,
  },
  newsImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    borderRadius: 10,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 12,
    borderRadius: 10,
  },
  newsText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  categoryContainer: { flexDirection: "column", marginTop: 16 },
  categoryCard: {
    backgroundColor: "#34495e",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    elevation: 5,
  },
  categoryText: { color: "white", fontWeight: "700", fontSize: 18 },
});
