import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const newsData = [
  {
    id: 1,
    title: "Chandrayaan-3 Launched!",
    content:
      "India successfully launched Chandrayaan-3, marking a significant achievement in space exploration.",
    imageUrl:
      "https://www.isro.gov.in/media_isro/image/index/Chandrayaan3/MRM_8583.JPG.webp",
    arUrl: "https://example.com/chandrayaan-ar",
  },
  {
    id: 2,
    title: "A Cactus Garden",
    content:
      "Welcome to the AR Cactus Garden! Go to below AR link tap anywhere on the screen to grow a cactus.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2020/03/05/16/10/cactus-4904784_1280.jpg",
    arUrl: "https://gsbehsev.8thwall.app/glb-ar-viewer/",
  },
  {
    id: 3,
    title: "Tech Innovations in 2025",
    content:
      "The latest advancements in AI, VR, and Quantum Computing are transforming industries.",
    imageUrl:
      "https://img.freepik.com/premium-photo/3d-technology-innovation-concepts_933496-6271.jpg",
    arUrl: "https://example.com/tech-ar",
  },
];

export default function NewsDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const news = newsData.find((n) => n.id === Number(id));

  if (!news) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>News Not Found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
        >
          <Text style={styles.buttonText}>Go Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleARPress = () => {
    // Special handling for Chandrayaan news item
    if (news.id === 1) {
      const modelURL =
        "https://res.cloudinary.com/dfzmx7rgc/image/upload/v1742712307/chandrayan_ntwd9p.glb";
      const arViewerUrl = `https://silly-stroopwafel-07be66.netlify.app/index.html?model=${encodeURIComponent(
        modelURL
      )}`;
      Linking.openURL(arViewerUrl);
    } else {
      // For other news items, use their original AR URLs
      Linking.openURL(news.arUrl);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{news.title}</Text>

      {news.imageUrl && (
        <Image
          source={{ uri: news.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Text style={styles.content}>{news.content}</Text>

      {news.arUrl && (
        <>
          <Text style={styles.arInfo}>
            Experience this in Augmented Reality! 🚀
          </Text>
          <TouchableOpacity style={styles.arButton} onPress={handleARPress}>
            <Text style={styles.arButtonText}>View in AR</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ecf0f1",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  content: {
    fontSize: 16,
    color: "#34495e",
    textAlign: "center",
    marginBottom: 20,
  },
  arInfo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#27ae60",
    textAlign: "center",
    marginTop: 20,
  },
  arButton: {
    backgroundColor: "#27ae60",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  arButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  button: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    width: "100%",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
