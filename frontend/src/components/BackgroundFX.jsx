import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
function FloatingCubes() {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
      groupRef.current.rotation.x += 0.005
    }
  })
  
  const cubes = Array.from({ length: 20 }, (_, i) => (
    <mesh
      key={i}
      position={[
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ]}
      rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
    >
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial 
        color={new THREE.Color().setHSL(Math.random(), 0.8, 0.6)}
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  ))
  
  return <group ref={groupRef}>{cubes}</group>
}

function GridField() {
  const gridRef = useRef()
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 20 - 10
    }
  })
  
  return (
    <group ref={gridRef}>
      <gridHelper args={[50, 50, '#00ff88', '#004422']} />
    </group>
  )
}

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} color="#00ff88" intensity={0.5} />
        <pointLight position={[-10, -10, -10]} color="#0088ff" intensity={0.5} />
        
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
        
        <FloatingCubes />
        <GridField />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Additional overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-darker/20 to-cyber-darker/80" />
    </div>
  )
}
