import { ThreeMFLoader } from "three/examples/jsm/loaders/3MFLoader.js"
import { attribute } from "three/examples/jsm/nodes/Nodes.js"

export default function CustomObject()
{
    const verticesCount=10*3
    const positions=new Float32Array(verticesCount*3)
    for(let i=0;i<verticesCount*3;i++)
        positions[i]=(Math.random()-0.5)*3
    // positions[i]=i%2?-1:1
        
    return <mesh>
        <bufferGeometry>
            <bufferAttribute 
                attach="attributes-position"
                count={verticesCount} 
                itemSize={3}
                array={positions} 
                />
        </bufferGeometry>
        <meshStandardMaterial color="#bbbbbb" side={THREE.DoubleSide}/>
    </mesh>
}