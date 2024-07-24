import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useMemo } from "react";
import { Experience } from "./components/Experience";
// const created=(state) =>
//   {
//     console.log(state.gl);
//   }

// const created=(scene) =>
//   {
//     scene.background=new THREE.Color('red');
//   }

const created=({gl}) =>
{
  gl.setClearColor('#ff0000',1);
}
function App() {
  return (
    <Canvas camera={ {
      fov:45,
      near:0.1,
      far:200,
      position: [0, 1, 5]
    }} shadows
    onCreated={created} 
    >
      <Suspense>
      <Physics debug gravity={[0,-1.6,0]}>
        <Experience />
      </Physics>
      </Suspense>
    </Canvas>

  );
}

export default App;
