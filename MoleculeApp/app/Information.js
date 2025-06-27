// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const Profile = () => {
//   const [user, setUser] = useState({
//     name: "John Doe",
//     email: "john.doe@example.com",
//     joinDate: "January 2024",
//   });

//   const handleLogout = () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       {
//         text: "Logout",
//         style: "destructive",
//         onPress: () => {
//           Alert.alert("Success", "Logged out successfully!");
//           // Add your logout logic here if needed
//         },
//       },
//     ]);
//   };

//   const ProfileOption = ({ icon, title, onPress, showArrow = true }) => (
//     <TouchableOpacity style={styles.optionContainer} onPress={onPress}>
//       <View style={styles.optionLeft}>
//         <Ionicons name={icon} size={24} color="#34495e" />
//         <Text style={styles.optionTitle}>{title}</Text>
//       </View>
//       {showArrow && (
//         <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Profile</Text>
//         </View>

//         {/* Profile Info */}
//         <View style={styles.profileSection}>
//           <View style={styles.avatarContainer}>
//             <View style={styles.avatarPlaceholder}>
//               <Ionicons name="person" size={40} color="#ecf0f1" />
//             </View>
//           </View>
//           <Text style={styles.userName}>{user.name}</Text>
//           <Text style={styles.userEmail}>{user.email}</Text>
//           <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
//         </View>

//         {/* Profile Options */}
//         <View style={styles.optionsSection}>
//           <ProfileOption
//             icon="person-outline"
//             title="Edit Profile"
//             onPress={() => Alert.alert("Info", "Edit Profile functionality")}
//           />
//           <ProfileOption
//             icon="notifications-outline"
//             title="Notifications"
//             onPress={() => Alert.alert("Info", "Notifications settings")}
//           />
//           <ProfileOption
//             icon="shield-checkmark-outline"
//             title="Privacy & Security"
//             onPress={() => Alert.alert("Info", "Privacy settings")}
//           />
//           <ProfileOption
//             icon="help-circle-outline"
//             title="Help & Support"
//             onPress={() => Alert.alert("Info", "Help & Support")}
//           />
//           <ProfileOption
//             icon="information-circle-outline"
//             title="About"
//             onPress={() => Alert.alert("Info", "About this app")}
//           />
//         </View>

//         {/* Logout Button */}
//         <View style={styles.logoutSection}>
//           <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//             <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#34495e",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#ecf0f1",
//   },
//   header: {
//     backgroundColor: "#34495e",
//     paddingTop: 20,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#ecf0f1",
//     textAlign: "center",
//   },
//   profileSection: {
//     backgroundColor: "#fff",
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   avatarContainer: {
//     marginBottom: 15,
//   },
//   avatarPlaceholder: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#34495e",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   userName: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#2c3e50",
//     marginBottom: 5,
//   },
//   userEmail: {
//     fontSize: 16,
//     color: "#7f8c8d",
//     marginBottom: 5,
//   },
//   joinDate: {
//     fontSize: 14,
//     color: "#95a5a6",
//   },
//   optionsSection: {
//     backgroundColor: "#fff",
//     marginBottom: 20,
//   },
//   optionContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ecf0f1",
//   },
//   optionLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   optionTitle: {
//     fontSize: 16,
//     color: "#2c3e50",
//     marginLeft: 15,
//     fontWeight: "500",
//   },
//   logoutSection: {
//     backgroundColor: "#fff",
//     marginBottom: 30,
//   },
//   logoutButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//   },
//   logoutText: {
//     fontSize: 16,
//     color: "#e74c3c",
//     marginLeft: 15,
//     fontWeight: "500",
//   },
// });

// export default Profile;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Profile = ({ setLogin }) => {
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("user");
            Alert.alert("Success", "Logged out successfully!");
            // setLogin(false); // Optional: redirect to login
            router.push(`/auth/AuthScreen`);
          } catch (error) {
            console.error("Logout failed:", error);
          }
        },
      },
    ]);
  };

  const ProfileOption = ({ icon, title, onPress, showArrow = true }) => (
    <TouchableOpacity style={styles.optionContainer} onPress={onPress}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={24} color="#34495e" />
        <Text style={styles.optionTitle}>{title}</Text>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
      )}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#fff", fontSize: 18 }}>
          Please Login First...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#ecf0f1" />
            </View>
          </View>
          <Text style={styles.userName}>{user.email || "Unnamed User"}</Text>
          {/* <Text style={styles.userEmail}>{user.email}</Text> */}
          <Text style={styles.joinDate}>Well come {user.name}</Text>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsSection}>
          <ProfileOption
            icon="person-outline"
            title="Edit Profile"
            onPress={() => Alert.alert("Info", "Edit Profile functionality")}
          />
          <ProfileOption
            icon="notifications-outline"
            title="Notifications"
            onPress={() => Alert.alert("Info", "Notifications settings")}
          />
          <ProfileOption
            icon="shield-checkmark-outline"
            title="Privacy & Security"
            onPress={() => Alert.alert("Info", "Privacy settings")}
          />
          <ProfileOption
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => Alert.alert("Info", "Help & Support")}
          />
          <ProfileOption
            icon="information-circle-outline"
            title="About"
            onPress={() =>
              Alert.alert(
                "Info",
                "Developed by Shreyash, Pavan, Shubham, and Rupesh, Imaginarium is more than an app — it’s a space where imagination meets innovation."
              )
            }
          />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#34495e",
  },
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#34495e",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#34495e",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ecf0f1",
    textAlign: "center",
  },
  profileSection: {
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#34495e",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: "#95a5a6",
  },
  optionsSection: {
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 16,
    color: "#2c3e50",
    marginLeft: 15,
    fontWeight: "500",
  },
  logoutSection: {
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logoutText: {
    fontSize: 16,
    color: "#e74c3c",
    marginLeft: 15,
    fontWeight: "500",
  },
});

export default Profile;
