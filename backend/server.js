const express = require("express");
const server = express();
const cors = require("cors");
const axios = require("axios");
const GoogleGenAI = require("@google/genai");
const { connectDB, getDB } = require("./config");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const THREE = require("three");
const fs = require("fs-extra");
const path = require("path");
const fetch = require("node-fetch");
const FormData = require("form-data");
const {
  Document,
  NodeIO,
  vec3,
  MeshPrimitive,
  Mesh,
  Material,
  Primitive,
} = require("@gltf-transform/core");
const { GLTFExporter } = require("node-three-gltf");

server.use(cors());
server.use(express.json());
connectDB();

server.get("/", (req, res) => {
  res.send("home page");
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: "null",
  api_key: "null",
  api_secret: "null",
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// Fetch molecule data from PubChem
server.get("/api/molecule/:formula", async (req, res) => {
  try {
    const { formula } = req.params;

    const response = await axios.get(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${formula}/JSON`
    );

    const compound = response.data.PC_Compounds?.[0];

    if (!compound || !compound.atoms || !compound.coords) {
      return res.status(404).json({
        error: "Could not find molecular data for this compound.",
      });
    }

    const atomIds = compound.atoms.aid;
    const elements = compound.atoms.element;
    const conformers = compound.coords?.[0]?.conformers?.[0];

    if (!conformers || !conformers.x || !conformers.y) {
      return res.status(404).json({
        error: "Could not find 3D coordinates for this compound.",
      });
    }

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

    res.json({ atoms, bonds });
  } catch (error) {
    console.error("Error fetching molecule data:", error);
    res.status(500).json({
      error:
        "Failed to fetch molecule data. Please check the formula and try again.",
    });
  }
});

// Generate and upload 3D model
server.post("/api/generate-model", async (req, res) => {
  const { atoms, bonds, formula } = req.body;

  console.log(formula, atoms, bonds);

  function computeCentroid(atoms) {
    if (!atoms || atoms.length === 0) return [0, 0, 0];

    const sum = atoms.reduce(
      (acc, atom) => {
        acc[0] += atom.position[0];
        acc[1] += atom.position[1];
        acc[2] += atom.position[2];
        return acc;
      },
      [0, 0, 0]
    );

    return sum.map((coord) => coord / atoms.length);
  }

  // Example usage:
  const centroid = computeCentroid(atoms);

  const moleculeData = { atoms, bonds };
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

  // Export scene to .glb using node-three-gltf
  const exporter = new GLTFExporter();
  const arrayBuffer = await exporter.parseAsync(scene, { binary: true });

  const formData = new FormData();
  formData.append("file", Buffer.from(arrayBuffer), `${formula}.glb`);
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
    res.status(200).json({
      success: true,
      modelURL: json.secure_url,
    });
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err);
    res.status(500).json({
      error: "Failed to molecule data",
    });
  }
});

const GEMINI_API_KEY = "null";

server.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const db = getDB();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const result = await db
      .collection("users")
      .insertOne({ email, name, password });

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertedId,
    });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

server.post("/isuser", async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = getDB();

    const user = await db.collection("users").findOne({ email, password });

    if (user) {
      res.status(200).json({ message: "User is present", userId: user._id });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error in /isuser:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

server.post("/ask-gemini", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Simple conversational prompt - no JSON formatting
  const conversationalPrompt = `
You are a helpful and friendly AI assistant. Respond naturally to the user's message in a conversational way.
Be helpful, informative, and engaging. Keep responses concise but complete.

User: ${prompt}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: conversationalPrompt,
                },
              ],
            },
          ],
        }),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API HTTP Error:", response.status, errorText);
      return res.status(response.status).json({
        error: `Gemini API returned ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    console.log("Full Gemini response:", JSON.stringify(data, null, 2));

    // Extract the conversational text response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("No text found in response:", data);
      return res
        .status(500)
        .json({ error: "No text content in Gemini response" });
    }

    console.log("Gemini response text:", text);

    // Return simple response object with just the text
    res.status(200).json({
      response: text.trim(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Network/Request Error:", err);

    if (err.name === "AbortError") {
      res.status(408).json({ error: "Request timeout" });
    } else if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      res.status(503).json({ error: "Network connectivity issue" });
    } else {
      res.status(500).json({
        error: "Failed to connect to Gemini API",
        details: err.message,
      });
    }
  }
});

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
