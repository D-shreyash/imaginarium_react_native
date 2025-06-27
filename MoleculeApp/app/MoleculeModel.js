import React, { useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { View, TextInput, Button, StyleSheet, Linking } from "react-native";
import * as THREE from "three";
import axios from "axios";

const modelUrl =
  "https://res.cloudinary.com/dfzmx7rgc/raw/upload/v1747571270/C60.glb";
const arViewerUrl = `https://silly-stroopwafel-07be66.netlify.app/index.html?model=${encodeURIComponent(
  modelUrl
)}`;

// 👉 Only for Web: Import GLTFExporter
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

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

export default function molecular_structure() {
  const [moleculeData, setMoleculeData] = useState({ atoms: [], bonds: [] });
  const [formula, setFormula] = useState("H2O");

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

  const fetchMoleculeData = async () => {
    try {
      const response = await axios.get(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${formula}/JSON`
      );

      const compound = response.data.PC_Compounds?.[0];

      if (!compound || !compound.atoms || !compound.coords) return;

      const atomIds = compound.atoms.aid;
      const elements = compound.atoms.element;
      const conformers = compound.coords?.[0]?.conformers?.[0];

      if (!conformers || !conformers.x || !conformers.y) return;

      const atoms = atomIds.map((id, i) => ({
        id,
        element: elements[i],
        position: [
          conformers.x?.[i] ?? 0,
          conformers.y?.[i] ?? 0,
          conformers.z?.[i] ?? 0,
        ],
      }));

      const bonds =
        compound.bonds?.aid1?.map((startIdx, i) => ({
          start: startIdx - 1,
          end: compound.bonds.aid2[i] - 1,
          order: compound.bonds.order[i],
        })) || [];

      setMoleculeData({ atoms, bonds });
    } catch (error) {
      console.error("Error fetching molecule data:", error);
    }
  };

  // Download as GLB with centered molecule
  const uploadToCloudinary = () => {
    const scene = new THREE.Scene();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    // Add atoms (offset by centroid)
    moleculeData.atoms.forEach((atom) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32),
        new THREE.MeshStandardMaterial({
          color: elementColors[atom.element] || "gray",
        })
      );
      mesh.position.set(
        atom.position[0] - centroid[0],
        atom.position[1] - centroid[1],
        atom.position[2] - centroid[2]
      );
      scene.add(mesh);
    });

    // Add bonds (offset by centroid)
    moleculeData.bonds.forEach((bond) => {
      const start = moleculeData.atoms[bond.start]?.position;
      const end = moleculeData.atoms[bond.end]?.position;
      if (!start || !end) return;

      const startVec = new THREE.Vector3(
        start[0] - centroid[0],
        start[1] - centroid[1],
        start[2] - centroid[2]
      );
      const endVec = new THREE.Vector3(
        end[0] - centroid[0],
        end[1] - centroid[1],
        end[2] - centroid[2]
      );
      const midPoint = new THREE.Vector3()
        .addVectors(startVec, endVec)
        .multiplyScalar(0.5);

      const direction = new THREE.Vector3()
        .subVectors(endVec, startVec)
        .normalize();
      const bondLength = startVec.distanceTo(endVec);

      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

      const bondMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, bondLength, 32),
        new THREE.MeshStandardMaterial({ color: "gray" })
      );
      bondMesh.position.copy(midPoint);
      bondMesh.quaternion.copy(quaternion);
      scene.add(bondMesh);
    });

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      async (gltf) => {
        const arrayBuffer = gltf; // It's already ArrayBuffer when binary: true

        const blob = new Blob([arrayBuffer], { type: "model/gltf-binary" });

        const formData = new FormData();
        formData.append("file", blob, `${formula}.glb`);
        formData.append("upload_preset", "raw_upload");
        formData.append("public_id", formula);

        try {
          const uploadRes = await fetch(
            "https://api.cloudinary.com/v1_1/dfzmx7rgc/raw/upload",
            {
              method: "POST",
              body: formData,
            }
          );
          const json = await uploadRes.json();
          console.log("✅ Cloudinary Upload Response:", json);
          alert("Model uploaded successfully!");
        } catch (err) {
          console.error("❌ Cloudinary upload error:", err);
          alert("Upload failed!");
        }
      },
      undefined,
      { binary: true }
    );
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
      <View style={{ marginVertical: 10 }}>
        <Button
          title="View in AR"
          onPress={() => Linking.openURL(arViewerUrl)}
        />
      </View>

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
          const start = moleculeData.atoms[bond.start].position;
          const end = moleculeData.atoms[bond.end].position;
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
  canvas: {
    height: 400,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
});
