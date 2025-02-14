import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { View, TextInput, Button, StyleSheet } from "react-native";
import * as THREE from "three";
import axios from "axios";

// Define colors for different elements
const elementColors = {
  1: "white", // Hydrogen
  6: "black", // Carbon
  7: "blue", // Nitrogen
  8: "red", // Oxygen
  9: "lightgreen", // Fluorine
  15: "orange", // Phosphorus
  16: "yellow", // Sulfur
  17: "green", // Chlorine
  35: "brown", // Bromine
  53: "purple", // Iodine
};

// Atom Component
const Atom = ({ position, color }) => (
  <mesh position={position}>
    <sphereGeometry args={[0.2, 32, 32]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

// Bond Component with Correct Rotation
const Bond = ({ start, end }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const midPoint = new THREE.Vector3()
    .addVectors(startVec, endVec)
    .multiplyScalar(0.5);

  // Calculate bond direction
  const direction = new THREE.Vector3()
    .subVectors(endVec, startVec)
    .normalize();
  const bondLength = startVec.distanceTo(endVec);

  // Calculate rotation using quaternion
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  return (
    <mesh position={midPoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.05, 0.05, bondLength, 32]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

// Main Component
export default function molecular_structure() {
  const [moleculeData, setMoleculeData] = useState({ atoms: [], bonds: [] });
  const [formula, setFormula] = useState("H2O");
  const controlsRef = React.useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = true; // ✅ Ensure controls stay active
    }
  }, [moleculeData]); // ✅ Only reset when molecule changes

  const fetchMoleculeData = async () => {
    try {
      const response = await axios.get(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${formula}/JSON`
      );

      console.log("API Response:", response.data); // Debugging step

      const compound = response.data.PC_Compounds?.[0];

      if (!compound || !compound.atoms || !compound.coords) {
        console.error("Invalid molecule data received.");
        return;
      }

      const atomIds = compound.atoms.aid;
      const elements = compound.atoms.element;
      const conformers = compound.coords?.[0]?.conformers?.[0];

      if (!conformers || !conformers.x || !conformers.y) {
        console.error("Molecular conformers data is missing.");
        return;
      }

      const atoms = atomIds.map((id, i) => ({
        id,
        element: elements[i],
        position: [
          conformers.x?.[i] ?? 0,
          conformers.y?.[i] ?? 0,
          conformers.z?.[i] ?? 0, // Ensure default values
        ],
      }));

      const bonds =
        compound.bonds?.aid1?.map((startIdx, i) => ({
          start: startIdx - 1,
          end: compound.bonds.aid2[i] - 1,
          order: compound.bonds.order[i],
        })) || [];

      console.log("Processed Molecule Data:", { atoms, bonds }); // Debugging step

      setMoleculeData({ atoms, bonds });
    } catch (error) {
      console.error("Error fetching molecule data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Chemical Formula"
        value={formula}
        onChangeText={setFormula}
        style={styles.input}
      />
      <Button title="Generate 3D Model" onPress={fetchMoleculeData} />
      <Canvas style={styles.canvas}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Render Atoms */}
        {moleculeData.atoms.map((atom, idx) => (
          <Atom
            key={idx}
            position={atom.position}
            color={elementColors[atom.element] || "gray"}
          />
        ))}

        {/* Render Bonds with Correct Angles */}
        {moleculeData.bonds.map((bond, idx) => (
          <Bond
            key={idx}
            start={moleculeData.atoms[bond.start].position}
            end={moleculeData.atoms[bond.end].position}
          />
        ))}

        <OrbitControls
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={0.5}
          makeDefault // ✅ Ensure OrbitControls is the active camera controller
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
  canvas: {
    height: 400,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
});
