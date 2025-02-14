// import React from "react";
// import { View } from "react-native";
// import { Canvas } from "@react-three/fiber";
// import { useGLTF, OrbitControls } from "@react-three/drei";
// import { GLView } from "expo-gl";

// const MODEL_PATH = require("https://drive.google.com/uc?export=download&id=1eMwdXGff86xPYI1iKXC9uLWRqH8ysRdy");

// const ChandrayaanModel = () => {
//   const { scene } = useGLTF(MODEL_PATH);
//   return <primitive object={scene} scale={1} />;
// };

// export default function App() {
//   return (
//     <View style={{ flex: 1 }}>
//       <GLView style={{ flex: 1 }}>
//         <Canvas camera={{ position: [0, 2, 5] }}>
//           <ambientLight intensity={0.8} />
//           <directionalLight position={[0, 5, 10]} intensity={1} />
//           <ChandrayaanModel />
//           <OrbitControls />
//         </Canvas>
//       </GLView>
//     </View>
//   );
// }

import { View, Text } from "react-native";
import React from "react";

const biology = () => {
  return (
    <View>
      <Text>biology</Text>
    </View>
  );
};

export default biology;
