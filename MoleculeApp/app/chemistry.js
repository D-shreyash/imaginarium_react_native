import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ChemistryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Chemistry Icon on Top Center */}
      <Ionicons name="flask" size={60} color="#2c3e50" style={styles.icon} />

      <Text style={styles.title}>Chemistry</Text>
      <Text style={styles.subtitle}>Explore Chemistry topics</Text>

      {/* Molecular Structure Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("./molecule")}
      >
        <Text style={styles.buttonText}>Molecular Structure</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 18,
    color: "#2c3e50",
    marginTop: 10,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#34495e",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});
