import React, { useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Linking,
  Alert,
  Text,
} from "react-native";
import * as THREE from "three";
import axios from "axios";

// Define colors for different elements
const elementColors = {
  1: "white",
  6: "black",
  7: "blue",
  8: "red",
  9: "lightgreen",
  15: "orange",
  16: "yellow",
  17: "green",
  35: "brown",
  53: "purple",
};

// Atom Component
const Atom = ({ position, color }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.2, 32, 32]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

// Bond Component
const Bond = ({ start, end }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const midPoint = new THREE.Vector3()
    .addVectors(startVec, endVec)
    .multiplyScalar(0.5);

  const direction = new THREE.Vector3()
    .subVectors(endVec, startVec)
    .normalize();
  const bondLength = startVec.distanceTo(endVec);

  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  return (
    <mesh position={midPoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.05, 0.05, bondLength, 32]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default function MolecularStructure() {
  const [modelURL, setModelURL] = useState(null);
  const [moleculeData, setMoleculeData] = useState({ atoms: [], bonds: [] });
  const [formula, setFormula] = useState("H2O");
  const [isLoading, setIsLoading] = useState(false);

  // Backend API base URL
  const API_BASE_URL = "http://192.168.50.85:3000/api"; // Change this to your backend URL

  // Calculate centroid of atoms to center molecule
  const centroid = useMemo(() => {
    if (moleculeData.atoms.length === 0) return [0, 0, 0];

    const sum = moleculeData.atoms.reduce(
      (acc, atom) => {
        acc[0] += atom.position[0];
        acc[1] += atom.position[1];
        acc[2] += atom.position[2];
        return acc;
      },
      [0, 0, 0]
    );

    return sum.map((coord) => coord / moleculeData.atoms.length);
  }, [moleculeData]);

  // Function to handle AR view
  const handleViewInAR = () => {
    if (!modelURL) {
      Alert.alert(
        "No Model Available",
        "Please generate and upload a 3D model first before viewing in AR."
      );
      return;
    }

    const arViewerUrl = `https://silly-stroopwafel-07be66.netlify.app/index.html?model=${encodeURIComponent(
      modelURL
    )}`;
    Linking.openURL(arViewerUrl);
  };

  // Fetch molecule data and generate 3D model
  const fetchMoleculeAndGenerateModel = async () => {
    try {
      setIsLoading(true);
      setModelURL(null);

      // Step 1: Fetch molecule data from backend
      const moleculeResponse = await axios.get(
        `${API_BASE_URL}/molecule/${encodeURIComponent(formula)}`
      );

      const { atoms, bonds } = moleculeResponse.data;
      setMoleculeData({ atoms, bonds });

      // Step 2: Generate and upload 3D model
      const modelResponse = await axios.post(`${API_BASE_URL}/generate-model`, {
        atoms,
        bonds,
        formula,
      });

      if (modelResponse.data.success) {
        setModelURL(modelResponse.data.modelURL);
        Alert.alert("Success", modelResponse.data.message);
      } else {
        throw new Error(modelResponse.data.error || "Failed to generate model");
      }
    } catch (error) {
      console.error("Error:", error);

      let errorMessage = "An unexpected error occurred.";

      if (error.response) {
        // Backend returned an error response
        errorMessage =
          error.response.data.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Network error
        errorMessage =
          "Network error. Please check if the backend server is running.";
      } else {
        // Other error
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
      setMoleculeData({ atoms: [], bonds: [] });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch only molecule data for preview (without generating model)
  const fetchMoleculeDataOnly = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/molecule/${encodeURIComponent(formula)}`
      );

      const { atoms, bonds } = response.data;
      setMoleculeData({ atoms, bonds });
    } catch (error) {
      console.error("Error fetching molecule data:", error);

      let errorMessage = "Failed to fetch molecule data.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      Alert.alert("Error", errorMessage);
      setMoleculeData({ atoms: [], bonds: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Chemical Formula (e.g., H2O, CH4)"
        value={formula}
        onChangeText={setFormula}
        style={styles.input}
        editable={!isLoading}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Loading..." : "Preview Molecule"}
          onPress={fetchMoleculeDataOnly}
          disabled={isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Generating..." : "Generate 3D Model & Upload"}
          onPress={fetchMoleculeAndGenerateModel}
          disabled={isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={modelURL ? "View in AR" : "View in AR (Generate model first)"}
          onPress={handleViewInAR}
          disabled={!modelURL}
        />
      </View>

      {modelURL && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>✅ Model uploaded successfully!</Text>
          <Text style={styles.urlText} numberOfLines={1}>
            URL: {modelURL}
          </Text>
        </View>
      )}

      <Canvas style={styles.canvas}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Render Atoms */}
        {moleculeData.atoms.map((atom, idx) => (
          <Atom
            key={idx}
            position={[
              atom.position[0] - centroid[0],
              atom.position[1] - centroid[1],
              atom.position[2] - centroid[2],
            ]}
            color={elementColors[atom.element] || "gray"}
          />
        ))}

        {/* Render Bonds */}
        {moleculeData.bonds.map((bond, idx) => {
          const start = moleculeData.atoms[bond.start]?.position;
          const end = moleculeData.atoms[bond.end]?.position;
          if (!start || !end) return null;

          return (
            <Bond
              key={idx}
              start={[
                start[0] - centroid[0],
                start[1] - centroid[1],
                start[2] - centroid[2],
              ]}
              end={[
                end[0] - centroid[0],
                end[1] - centroid[1],
                end[2] - centroid[2],
              ]}
            />
          );
        })}

        <OrbitControls
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={0.5}
          makeDefault
        />
      </Canvas>
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
  input: {
    backgroundColor: "#bdc3c7",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    color: "#2c3e50",
    borderWidth: 1,
    borderColor: "#7f8c8d",
  },
  buttonContainer: {
    marginVertical: 5,
  },
  infoContainer: {
    backgroundColor: "#d5edda",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    borderColor: "#c3e6cb",
    borderWidth: 1,
  },
  infoText: {
    color: "#155724",
    fontWeight: "bold",
    textAlign: "center",
  },
  urlText: {
    color: "#155724",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  canvas: {
    height: 400,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginTop: 10,
  },
});
