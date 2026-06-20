"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Floating, mouse-reactive blob field rendered behind the hero — the WebGL
// "wow" layer for the playful-maximalist redesign. Pure vanilla three.js
// (no @react-three/fiber) to keep the bundle light.
export default function Blob3D({ colors = [0xff6b6b, 0x4ecdc4, 0xffd93d] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9;

    const setSize = () => {
      const { clientWidth, clientHeight } = canvas.parentElement;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    setSize();

    const blobs = colors.map((color, i) => {
      const geo = new THREE.IcosahedronGeometry(1.6 - i * 0.25, 2);
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, wireframe: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((i - 1) * 2.6, Math.sin(i) * 1.2, -i * 1.5);
      scene.add(mesh);
      return mesh;
    });

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", setSize);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      blobs.forEach((mesh, i) => {
        mesh.rotation.x += 0.0016 + i * 0.0004;
        mesh.rotation.y += 0.0022;
        mesh.position.x += ((i - 1) * 2.6 + mouseX * 0.8 - mesh.position.x) * 0.02;
        mesh.position.y += (Math.sin(i) * 1.2 - mouseY * 0.8 - mesh.position.y) * 0.02;
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", setSize);
      blobs.forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      renderer.dispose();
    };
  }, [colors]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}
