import { Box, OrbitControls, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, InstancedRigidBodies, quat } from "@react-three/rapier";
import { useRef, useState, useEffect,  useMemo} from "react";
import { Controls } from "../App";

import * as THREE from "three";


export const Experience = () => {
  const [hover, setHover] = useState(false);
  const cube = useRef();
  const [start, setStart] = useState(false);
  const kicker = useRef();
  const [hitSound] = useState(() => new Audio('./重物掉落砾石-砰砰声_爱给网_aigei_com.mp3'));
  const jump = () => {
    if (isOnFloor.current) {
      cube.current.applyImpulse({ x: 0, y: 5, z: 0 });
      isOnFloor.current = false;
    }
  };

  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );

  const handleMovement = () => {
    if (!isOnFloor.current) {
      return;
    }
    if (rightPressed) {
      cube.current.applyImpulse({ x: 0.1, y: 0, z: 0 });
    }
    if (leftPressed) {
      cube.current.applyImpulse({ x: -0.1, y: 0, z: 0 });
    }

    if (forwardPressed) {
      cube.current.applyImpulse({ x: 0, y: 0, z: -0.1 });
    }
    if (backPressed) {
      cube.current.applyImpulse({ x: 0, y: 0, z: 0.1 });
    }
  };

  const speed = useRef(3);

  useFrame((_state, delta) => {
    if (jumpPressed) {
      jump();
    }
    handleMovement();
    if (!start) {
      return;
    }
    const time = _state.clock.getElapsedTime();
    console.log(time);
    const eulerRotation = new THREE.Euler(0, time * 3, 0);
    const quaternionRotation = new THREE.Quaternion;
    quaternionRotation.setFromEuler(eulerRotation);
    kicker.current.setNextKinematicRotation(quaternionRotation);
    const angle = time / 5;
    const x = Math.cos(angle) * 3;
    const z = Math.sin(angle) * 3;
    kicker.current.setNextKinematicTranslation({ x: x, y: 0.75, z: z });
    //or
    // const curRotation = quat(kicker.current.rotation());
    // const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
    //   new THREE.Vector3(0, 1, 0),
    //   delta * speed.current
    // );
    // curRotation.multiply(incrementRotation);
    // kicker.current.setNextKinematicRotation(curRotation);
    // speed.current += delta;

    // console.log(speed);

  });

  const isOnFloor = useRef(true);

  const CollisionEnter = ({ other }) => {
    if (other.rigidBodyObject.name === "floor") {
      isOnFloor.current = true;
    };
    console.log('collision');
    setHover(true);
    hitSound.currentTime = Math.random() / 5
    hitSound.volume = Math.random();
    hitSound.play();
  }

  const XIA = useGLTF('../public/XIA.glb');

  const cubesCount = 3
  const cubes = useRef();
  
  const cubesTransforms = useMemo(() => {
    const positions = []
    const rotations = []
    const scales = []
    for (let i = 0; i < cubesCount; i++) {
      positions.push([
        (Math.random()-0.5)*8,
        6+i*0.2,
        (Math.random()-0.5)*8,
      ])
      rotations.push([0, 0, 0])
      scales.push([1, 1, 1])
    }
    return { positions, rotations, scales }
  }, [])
  // useEffect(()=>
  // {
  //   for(let i=0;i<cubesCount;i++)
  //   {
  //       const matrix=new THREE.Matrix4();
  //       matrix.compose(
  //         new THREE.Vector3(i*2,3,0),
  //         new THREE.Quaternion(),
  //         new THREE.Vector3(1,1,1)
  //       )
  //       cubes.current.setMatrixAt(i,matrix);
  //   }
  // },[])
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-10, 10, 0]} intensity={0.4} />
      <OrbitControls />
      <InstancedRigidBodies
        positions={cubesTransforms.positions}
        rotations={cubesTransforms.rotations}
        scales={cubesTransforms.scales}
      >
        <instancedMesh ref={cubes} args={[null, null, cubesCount]} castShadow >
          <boxGeometry />
          <meshStandardMaterial color="tomato" />
        </instancedMesh>
      </InstancedRigidBodies>
      <RigidBody
        position={[-2.5, 1, 0]}
        ref={cube}
        onCollisionEnter={CollisionEnter}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject.name === "floor") {
            isOnFloor.current = false;
          }
        }}
        onSleep={() => { console.log("sleep") }}
        onWake={() => { console.log("wake") }}

      >
        <Box
          castShadow
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          onClick={() => setStart(true)}
        >
          <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
        </Box>
      </RigidBody>

      <RigidBody type="kinematicPosition" position={[2, 0.75, 0]} ref={kicker}>
        {/* <group position={[2.5, 0, 0]}> */}
        <Box args={[4, 0.5, 0.5]}>
          <meshStandardMaterial color="peachpuff" />
        </Box>
        {/* </group> */}
      </RigidBody>

      <RigidBody type="fixed" name="floor" >
        <Box receiveShadow position={[0, 0, 0]} args={[10, 1, 10]}>
          <meshStandardMaterial color="springgreen" />
        </Box>
      </RigidBody>

      <primitive object={XIA.scene} scale={0.5} position={[0, 4, 0]} />

     
    </>
  );
};
