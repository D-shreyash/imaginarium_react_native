// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";

// import axios from "axios";

// export default function AuthScreen({ setLogin }) {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");

//   const handleAuth = async () => {
//     if (!email || !password || (!isLogin && !name)) {
//       return Alert.alert("Error", "Please fill all required fields.");
//     }

//     // if (!isLogin && password) {
//     //   return Alert.alert("Error", "Passwords do not match.");
//     // }

//     try {
//       const response = await axios.post(
//         isLogin
//           ? "http://192.168.100.25:3000/isuser"
//           : "http://192.168.100.25:3000/register",
//         isLogin ? { email, password } : { email, name, password }
//       );

//       // You can use response.data.token, response.data.user, etc.
//       Alert.alert("Success", isLogin ? "Logged in!" : "Signed up!");
//       setLogin(true);
//     } catch (error) {
//       console.error("Auth Error:", error);
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Something went wrong!"
//       );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         placeholderTextColor="#2c3e50"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       {!isLogin && (
//         <TextInput
//           style={styles.input}
//           placeholder="Your Name"
//           placeholderTextColor="#2c3e50"
//           value={name}
//           onChangeText={setName}
//         />
//       )}

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="#2c3e50"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
//         <Text style={styles.authButtonText}>
//           {isLogin ? "Login" : "Sign Up"}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
//         <Text style={styles.switchText}>
//           {isLogin
//             ? "Don't have an account? Sign Up"
//             : "Already have an account? Login"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ecf0f1",
//     padding: 16,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     backgroundColor: "#bdc3c7",
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 16,
//     color: "#2c3e50",
//   },
//   authButton: {
//     backgroundColor: "#34495e",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 24,
//     alignItems: "center",
//   },
//   authButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 18,
//   },
//   switchText: {
//     marginTop: 16,
//     textAlign: "center",
//     color: "#2c3e50",
//     fontWeight: "500",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function AuthScreen({ setLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      return Alert.alert("Error", "Please fill all required fields.");
    }

    try {
      const response = await axios.post(
        isLogin
          ? "http://192.168.50.85:3000/isuser"
          : "http://192.168.50.85:3000/register",
        isLogin ? { email, password } : { email, name, password }
      );

      const userData = {
        email,
        name: isLogin ? response.data?.name || "User" : name,
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));

      Alert.alert("Success", isLogin ? "Logged in!" : "Signed up!");
      setLogin(true);
    } catch (error) {
      console.error("Auth Error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong!"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Sign Up"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#2c3e50"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#2c3e50"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#2c3e50"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
        <Text style={styles.authButtonText}>
          {isLogin ? "Login" : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#bdc3c7",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    color: "#2c3e50",
  },
  authButton: {
    backgroundColor: "#34495e",
    padding: 15,
    borderRadius: 10,
    marginTop: 24,
    alignItems: "center",
  },
  authButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  switchText: {
    marginTop: 16,
    textAlign: "center",
    color: "#2c3e50",
    fontWeight: "500",
  },
});
