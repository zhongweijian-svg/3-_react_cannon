import { Float, Text, Html, Box, TransformControls, OrbitControls, useKeyboardControls, PivotControls, MeshReflectorMaterial, } from "@react-three/drei";
import { CuboidCollider, RigidBody, quat } from "@react-three/rapier";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Perf } from "r3f-perf";
// import { Controls } from "../App";
// import CustomObject from "./CustomObject";
import * as THREE from "three";
import { useControls, button } from 'leva'
import { color } from "three/examples/jsm/nodes/Nodes.js";
extend({ OrbitControls: OrbitControls })

export const Experience = () => {
  const { camera, gl } = useThree();
  const cubeRef = useRef();
  // const [hover,setHover]=useState();
  
  const cccRef = useRef();
  const jump = () => {
    cccRef.current.applyImpulse({ x: 0, y:0, z:8 })
    // cccRef.current.applyTorqueImpulse({ 
    // x:0, 
    // y:10*(Math.random()-0.5), 
    // z: 0 
    // })
    };
  // const groupRef = useRef();

  const planeRef = useRef();
  const redballRef = useRef();

  const { perfVisible } = useControls({
    perfVisible: { value: false }
  })
  const { position, position_2, colormesh, visible } = useControls({
    position:
    {
      value: { x: 0, y: 0, z: 0, },
      min: -5,
      max: 5,
      step: 0.1,
    },
    position_2:
    {
      value: 3,
      min: -5,
      max: 5,
      step: 0.1
    },
    colormesh: '#ff0000',
    visible: true,
    myInterval: {
      min: 0,
      max: 10,
      value: [4, 5]
    },
    clickMe: button(() => { console.log("click") }),
    choice: { options: ['a', 'b', 'c'] }
  })
  console.log(position)
  const { planeScale } = useControls('plane', {
    planeScale:
    {
      value: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
    }
  })


  useFrame((state, delta) => {
    // cubeRef.current.rotation.y += delta;
  })

  return (
    <>
      {perfVisible ? <Perf position="bottom-left" /> : null}
      <OrbitControls args={[camera, gl.domElement]} makeDefault></OrbitControls>

      <directionalLight intensity={1.5} position={[1, 2, 3]} />
      <ambientLight intensity={0.2}></ambientLight>

      {/* <group ref={groupRef}> */}
      <RigidBody position={[0,0,0]} ref={cccRef} gravityScale={1} restitution={0.5} friction={1.3} mass={0.1}>
        <Box
          position={[1, position_2, 1]}
          scale={1.5}
          // ref={cubeRef}
          onClick={jump}
        >
          {/* <torusGeometry args={[1, 0.1, 8, 100]} /> */}
          <meshBasicMaterial color={"blue"} />
        </Box>
        {/* <CuboidCollider args={[0.5,0.5,0.5]} /> */}
      </RigidBody>
      <PivotControls anchor={[0, 0, 0]} depthTest={false} castShadow={false}
        lineWidth={3} axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
      // scale={100} fixed
      >
        <mesh
          position={[1, 3, 1]}
          scale={1.5}
        >
          <sphereGeometry args={[1, 16]} />
          <meshStandardMaterial color={"yellow"} />
        </mesh>
      </PivotControls >
      <mesh castShadow
        position={[4 + position.x, 3 + position.y, -3 + position.z]}
        scale={1.5}
        ref={redballRef}
        visible={visible}
      >
        <sphereGeometry args={[1, 16]} />
        <meshPhongMaterial color={colormesh} />
        <Html position={[0, 2, 0]} center
          wrapperClass="label" distanceFactor={8}
          occlude={{
            redballRef
            // , planeRef
          }}
        >.......test.......</Html>
      </mesh>

      <mesh
        position={[-2, 3, -2]}
        scale={1.5}
      >
        <sphereGeometry args={[1, 1, 8, 100]} />
        <meshPhongMaterial />
      </mesh>
      {/* </group> */}
      <Float speed={6} floatIntensity={2}>
        <Text position={[0, 4, 0]}
          font="/silkscreen-v4-latin-regular.woff" maxWidth={1}
          color="black">hello world!</Text>
      </Float>
      {/* <CustomObject/> */}
      <TransformControls
        // makeDefault   
        object={redballRef}
        mode="translate"
      // translate scale rotate
      />
      <RigidBody
      //  colliders="plane"
       >
        <mesh receiveShadow
          rotation-x={-Math.PI * 0.5}
          scale={10 * planeScale}
          ref={planeRef}
        >
          <planeGeometry type="fixed" />
          {/* <meshPhongMaterial color={"greenyellow"}/> */}
          <MeshReflectorMaterial resolution={512} blur={[1000, 1000]} mixBlur={1} mirror={1} />
        
        </mesh>
      </RigidBody>
    </>
  );

};
