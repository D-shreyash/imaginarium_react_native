import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { authService } from "./api";

export default function HomeScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const newsScrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthStatus = async () => {
      try {
        const isAuthenticated = await authService.isAuthenticated();
        if (!isAuthenticated) {
          // If not authenticated, redirect to welcome screen
          router.replace("/welcome");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/welcome");
      }
    };

    checkAuthStatus();

    // Set up news scroll interval
    const interval = setInterval(() => {
      if (newsScrollRef.current) {
        const currentX = scrollX.__getValue(); // ✅ Get current value safely
        newsScrollRef.current.scrollTo({
          x: (currentX + 300) % 900,
          animated: true,
        });
        scrollX.setValue((currentX + 300) % 900);
      }
    }, 3000);


    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle" size={50} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Search topics..."
        placeholderTextColor="#7f8c8d"
      />

      <Text style={styles.sectionTitle}>News Feed</Text>
      <ScrollView
        ref={newsScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.newsFeed}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={[styles.newsItem, { backgroundColor: "#3498db" }]}>
          <Text style={styles.newsText}>News 1</Text>
        </View>
        <View style={[styles.newsItem, { backgroundColor: "#2ecc71" }]}>
          <Text style={styles.newsText}>News 2</Text>
        </View>
        <View style={[styles.newsItem, { backgroundColor: "#e74c3c" }]}>
          <Text style={styles.newsText}>News 3</Text>
        </View>
      </ScrollView>

      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoryContainer}>
        {["Maths", "Chemistry", "Biology", "Physics", "English"].map(
          (topic) => (
            <TouchableOpacity
              key={topic}
              style={styles.categoryCard}
              onPress={() => {
                // Using lowercase in the route paths for consistency
                const routeMap = {
                  Maths: "/maths",
                  Chemistry: "/chemistry",
                  Biology: "/biology",
                  Physics: "/physics",
                  English: "/english",
                };

                if (routeMap[topic]) {
                  router.push(routeMap[topic]); // Using router instead of navigation
                }
              }}
            >
              <Text style={styles.categoryText}>{topic}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <Text style={styles.sectionTitle}>Explore</Text>
      <View style={styles.sectionContainer}>
        <Text>Explore content here...</Text>
      </View>

      <Text style={styles.sectionTitle}>Virtual Tour</Text>
      <View style={styles.sectionContainer}>
        <Text>Virtual tour content here...</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
  },
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
  newsFeed: {
    flexDirection: "row",
    marginTop: 8,
    height: 150,
  },
  newsItem: {
    padding: 16,
    marginRight: 10,
    borderRadius: 8,
    width: 300,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  newsText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: "column",
    marginTop: 16,
  },
  categoryCard: {
    backgroundColor: "#34495e",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    elevation: 5,
  },
  categoryText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
  sectionContainer: {
    backgroundColor: "#d5dbdb",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
});