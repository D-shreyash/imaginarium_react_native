import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const SERVER_URL = "http://192.168.50.85:3000/ask-gemini";

export default function Chatbot() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) {
      return Alert.alert("Input Required", "Please enter a message.");
    }

    setLoading(true);
    setResponse("");

    try {
      const result = await axios.post(SERVER_URL, { prompt });
      setResponse(result.data.response);
      setPrompt(""); // Clear input after sending
    } catch (err) {
      console.error("Server Error:", err.message);
      Alert.alert("Error", "Failed to get a response from the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with AI</Text>

      <ScrollView style={styles.chatArea}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007aff" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}

        {response && !loading && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type your message..."
          value={prompt}
          onChangeText={setPrompt}
          style={styles.input}
          multiline
          maxLines={4}
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.disabledButton]}
          onPress={handleAsk}
          disabled={loading}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 60,
    paddingBottom: 20,
    color: "#333",
  },
  chatArea: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  responseContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#007aff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  sendButtonText: {
    color: "#white",
    fontWeight: "600",
    fontSize: 16,
  },
});
