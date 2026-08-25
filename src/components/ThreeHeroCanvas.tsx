'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeHeroCanvasProps {
  className?: string;
}

export default function ThreeHeroCanvas({ className = '' }: ThreeHeroCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [interactiveTip, setInteractiveTip] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.8);
    camera.lookAt(0, 0.2, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 3. Lighting Setup (Warm Architectural Light)
    const ambientLight = new THREE.AmbientLight(0xFFF6EC, 1.2);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xFFE8D1, 3.5);
    mainSpot.position.set(4, 6, 4);
    mainSpot.angle = Math.PI / 4;
    mainSpot.penumbra = 0.8;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    mainSpot.shadow.bias = -0.0001;
    scene.add(mainSpot);

    const warmRim = new THREE.DirectionalLight(0xD49226, 2.0);
    warmRim.position.set(-4, 3, -3);
    scene.add(warmRim);

    const softFill = new THREE.PointLight(0xF4EFE6, 1.0, 10);
    softFill.position.set(0, -1, 3);
    scene.add(softFill);

    // 4. Group for the 3D Coffee Cup & Table Assembly
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // --- Ceramic Material ---
    const ceramicMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFAF7F2,
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
    });

    const saucerAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x382922,
      roughness: 0.4,
      metalness: 0.1,
    });

    const goldTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xD49226,
      metalness: 0.85,
      roughness: 0.25,
    });

    // --- 3D Cup Geometry ---
    // Cup Body (Lathe)
    const cupPoints: THREE.Vector2[] = [];
    cupPoints.push(new THREE.Vector2(0, 0));
    cupPoints.push(new THREE.Vector2(0.55, 0.02));
    cupPoints.push(new THREE.Vector2(0.68, 0.1));
    cupPoints.push(new THREE.Vector2(0.85, 0.5));
    cupPoints.push(new THREE.Vector2(0.98, 0.95));
    cupPoints.push(new THREE.Vector2(1.0, 1.05));
    cupPoints.push(new THREE.Vector2(0.93, 1.05));
    cupPoints.push(new THREE.Vector2(0.91, 0.95));
    cupPoints.push(new THREE.Vector2(0.78, 0.5));
    cupPoints.push(new THREE.Vector2(0.60, 0.15));
    cupPoints.push(new THREE.Vector2(0, 0.1));

    const cupGeo = new THREE.LatheGeometry(cupPoints, 48);
    const cupMesh = new THREE.Mesh(cupGeo, ceramicMaterial);
    cupMesh.castShadow = true;
    cupMesh.receiveShadow = true;
    cupMesh.position.y = 0.08;
    sceneGroup.add(cupMesh);

    // Cup Handle (Torus segment)
    const handleGeo = new THREE.TorusGeometry(0.35, 0.07, 16, 32, Math.PI * 0.9);
    const handleMesh = new THREE.Mesh(handleGeo, ceramicMaterial);
    handleMesh.position.set(0.95, 0.65, 0);
    handleMesh.rotation.z = -Math.PI / 6;
    handleMesh.castShadow = true;
    sceneGroup.add(handleMesh);

    // Gold Rim on Cup
    const goldRimGeo = new THREE.TorusGeometry(0.965, 0.015, 12, 48);
    const goldRimMesh = new THREE.Mesh(goldRimGeo, goldTrimMaterial);
    goldRimMesh.position.y = 1.13;
    goldRimMesh.rotation.x = Math.PI / 2;
    sceneGroup.add(goldRimMesh);

    // --- Saucer Geometry ---
    const saucerPoints: THREE.Vector2[] = [];
    saucerPoints.push(new THREE.Vector2(0, 0));
    saucerPoints.push(new THREE.Vector2(0.9, 0.02));
    saucerPoints.push(new THREE.Vector2(1.45, 0.12));
    saucerPoints.push(new THREE.Vector2(1.52, 0.22));
    saucerPoints.push(new THREE.Vector2(1.48, 0.23));
    saucerPoints.push(new THREE.Vector2(1.38, 0.14));
    saucerPoints.push(new THREE.Vector2(0.85, 0.05));
    saucerPoints.push(new THREE.Vector2(0, 0.03));

    const saucerGeo = new THREE.LatheGeometry(saucerPoints, 48);
    const saucerMesh = new THREE.Mesh(saucerGeo, ceramicMaterial);
    saucerMesh.receiveShadow = true;
    saucerMesh.castShadow = true;
    sceneGroup.add(saucerMesh);

    // Saucer Gold Rim
    const saucerGoldRimGeo = new THREE.TorusGeometry(1.48, 0.012, 12, 48);
    const saucerGoldRimMesh = new THREE.Mesh(saucerGoldRimGeo, goldTrimMaterial);
    saucerGoldRimMesh.position.y = 0.225;
    saucerGoldRimMesh.rotation.x = Math.PI / 2;
    sceneGroup.add(saucerGoldRimMesh);

    // --- Coffee Liquid & Latte Art Surface ---
    // Create Procedural Canvas for Latte Art
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Rich Espresso Crema Base
      const gradient = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
      gradient.addColorStop(0, '#B87232');
      gradient.addColorStop(0.35, '#8C4D1D');
      gradient.addColorStop(0.75, '#562D11');
      gradient.addColorStop(1, '#2B1406');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // Microfoam Swirls & Rosette / Tulip Heart Art
      ctx.fillStyle = '#FFF8EE';
      ctx.shadowColor = 'rgba(86, 45, 17, 0.4)';
      ctx.shadowBlur = 8;

      // Center Tulip / Heart Layers
      for (let i = 0; i < 4; i++) {
        const y = 310 - i * 42;
        const radiusX = 65 - i * 10;
        const radiusY = 40 - i * 6;

        ctx.beginPath();
        ctx.ellipse(256, y, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top Heart Finial
      ctx.beginPath();
      ctx.arc(242, 150, 20, 0, Math.PI * 2);
      ctx.arc(270, 150, 20, 0, Math.PI * 2);
      ctx.fill();

      // Drawn Center Stem Cut Line
      ctx.strokeStyle = '#6E3A15';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(256, 110);
      ctx.lineTo(256, 360);
      ctx.stroke();

      // Micro Crema flecks
      ctx.fillStyle = '#9C5824';
      for (let j = 0; j < 60; j++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 140 + Math.random() * 95;
        const fx = 256 + Math.cos(angle) * dist;
        const fy = 256 + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(fx, fy, 1 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const latteTexture = new THREE.CanvasTexture(canvas);
    latteTexture.anisotropy = 8;

    const coffeeGeo = new THREE.CircleGeometry(0.88, 36);
    const coffeeMaterial = new THREE.MeshStandardMaterial({
      map: latteTexture,
      roughness: 0.35,
      metalness: 0.1,
    });
    const coffeeMesh = new THREE.Mesh(coffeeGeo, coffeeMaterial);
    coffeeMesh.position.y = 0.98;
    coffeeMesh.rotation.x = -Math.PI / 2;
    sceneGroup.add(coffeeMesh);

    // --- 5. 3D Floating Coffee Beans with Procedural Details ---
    const beanGroup = new THREE.Group();
    scene.add(beanGroup);

    const createCoffeeBean = () => {
      const bean = new THREE.Group();

      // Bean Body
      const bodyGeo = new THREE.SphereGeometry(0.14, 24, 16);
      bodyGeo.scale(1.0, 1.45, 0.75);

      const beanMat = new THREE.MeshStandardMaterial({
        color: 0x432B1E,
        roughness: 0.45,
        metalness: 0.15,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, beanMat);
      bodyMesh.castShadow = true;
      bean.add(bodyMesh);

      // Bean Center Split Groove
      const grooveGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.36, 12);
      const grooveMat = new THREE.MeshStandardMaterial({
        color: 0xD8B288,
        roughness: 0.7,
      });
      const grooveMesh = new THREE.Mesh(grooveGeo, grooveMat);
      grooveMesh.position.z = 0.095;
      bean.add(grooveMesh);

      return bean;
    };

    const beans: { mesh: THREE.Group; basePos: THREE.Vector3; speed: number; rotSpeed: THREE.Vector3; amp: number }[] = [];
    const beanOffsets = [
      { x: -1.7, y: 1.2, z: 0.6, speed: 0.8, amp: 0.15 },
      { x: 1.8, y: 1.6, z: -0.4, speed: 1.1, amp: 0.2 },
      { x: -1.4, y: -0.4, z: 1.2, speed: 0.9, amp: 0.12 },
      { x: 1.6, y: -0.2, z: 0.9, speed: 0.7, amp: 0.18 },
      { x: 0.2, y: 2.2, z: -1.0, speed: 1.2, amp: 0.25 },
      { x: -2.2, y: 0.6, z: -0.8, speed: 0.6, amp: 0.14 },
    ];

    beanOffsets.forEach((b) => {
      const beanMesh = createCoffeeBean();
      beanMesh.position.set(b.x, b.y, b.z);
      beanMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      beanGroup.add(beanMesh);

      beans.push({
        mesh: beanMesh,
        basePos: new THREE.Vector3(b.x, b.y, b.z),
        speed: b.speed,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.015
        ),
        amp: b.amp,
      });
    });

    // --- 6. 3D Steam Particle System ---
    const steamParticleCount = 48;
    const steamGeometry = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamParticleCount * 3);
    const steamAlphas = new Float32Array(steamParticleCount);
    const steamVelocities: { x: number; y: number; z: number; age: number; maxAge: number }[] = [];

    for (let i = 0; i < steamParticleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.35;
      steamPositions[i * 3] = Math.cos(angle) * radius;
      steamPositions[i * 3 + 1] = 1.0 + Math.random() * 1.6;
      steamPositions[i * 3 + 2] = Math.sin(angle) * radius;

      steamAlphas[i] = Math.random() * 0.4;

      steamVelocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: 0.008 + Math.random() * 0.007,
        z: (Math.random() - 0.5) * 0.003,
        age: Math.random() * 100,
        maxAge: 120 + Math.random() * 80,
      });
    }

    steamGeometry.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

    // Procedural Soft Puff Steam Texture
    const steamCanvas = document.createElement('canvas');
    steamCanvas.width = 128;
    steamCanvas.height = 128;
    const sCtx = steamCanvas.getContext('2d');
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      sGrad.addColorStop(0, 'rgba(255, 248, 238, 0.45)');
      sGrad.addColorStop(0.4, 'rgba(244, 239, 230, 0.25)');
      sGrad.addColorStop(0.8, 'rgba(230, 215, 194, 0.08)');
      sGrad.addColorStop(1, 'rgba(230, 215, 194, 0)');
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const steamTexture = new THREE.CanvasTexture(steamCanvas);

    const steamMaterial = new THREE.PointsMaterial({
      size: 0.65,
      map: steamTexture,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const steamParticles = new THREE.Points(steamGeometry, steamMaterial);
    sceneGroup.add(steamParticles);

    // --- 7. Golden Aroma Dust / Floating Micro Sparkles ---
    const aromaCount = 35;
    const aromaGeo = new THREE.BufferGeometry();
    const aromaPositions = new Float32Array(aromaCount * 3);
    for (let i = 0; i < aromaCount * 3; i += 3) {
      aromaPositions[i] = (Math.random() - 0.5) * 4;
      aromaPositions[i + 1] = (Math.random() - 0.3) * 3.5;
      aromaPositions[i + 2] = (Math.random() - 0.5) * 3;
    }
    aromaGeo.setAttribute('position', new THREE.BufferAttribute(aromaPositions, 3));
    const aromaMat = new THREE.PointsMaterial({
      color: 0xD49226,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const aromaField = new THREE.Points(aromaGeo, aromaMat);
    scene.add(aromaField);

    setIsLoaded(true);

    // --- 8. Mouse & Scroll Reactivity ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.2;
    let targetRotY = -0.3;
    let currentRotX = 0.2;
    let currentRotY = -0.3;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
      targetRotY = -0.3 + x * 0.75;
      targetRotX = 0.2 + y * 0.45;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        targetRotY = -0.3 + x * 0.5;
        targetRotX = 0.2 + y * 0.3;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // --- 9. Animation Loop ---
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation for cup orientation
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      // Gentle continuous levitation
      sceneGroup.rotation.x = currentRotX + Math.sin(elapsedTime * 0.8) * 0.03;
      sceneGroup.rotation.y = currentRotY + Math.cos(elapsedTime * 0.6) * 0.03;
      sceneGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.06;

      // Animate Floating Beans
      beans.forEach((b, idx) => {
        b.mesh.rotation.x += b.rotSpeed.x;
        b.mesh.rotation.y += b.rotSpeed.y;
        b.mesh.rotation.z += b.rotSpeed.z;

        b.mesh.position.y = b.basePos.y + Math.sin(elapsedTime * b.speed + idx) * b.amp;
        b.mesh.position.x = b.basePos.x + Math.cos(elapsedTime * (b.speed * 0.7) + idx) * 0.05;
      });

      // Animate Steam Particles
      const positions = steamGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < steamParticleCount; i++) {
        const vel = steamVelocities[i];
        vel.age += 1;

        positions[i * 3 + 1] += vel.y;
        positions[i * 3] += Math.sin(elapsedTime * 2 + i) * 0.002;
        positions[i * 3 + 2] += Math.cos(elapsedTime * 2 + i) * 0.002;

        if (vel.age > vel.maxAge || positions[i * 3 + 1] > 2.8) {
          vel.age = 0;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 0.35;
          positions[i * 3] = Math.cos(angle) * radius;
          positions[i * 3 + 1] = 0.98 + Math.random() * 0.1;
          positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
      }
      steamGeometry.attributes.position.needsUpdate = true;

      // Animate Aroma Field
      aromaField.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-[420px] sm:h-[500px] lg:h-[580px] cursor-grab active:cursor-grabbing transition-opacity duration-1000"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />

      {/* Floating 3D Badge Overlay */}
      <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 pointer-events-none">
        <div className="glass-panel px-4 py-2.5 rounded-full shadow-warm-sm flex items-center space-x-2 border border-cream-300/60 animate-pulse-subtle">
          <span className="w-2 h-2 rounded-full bg-amberGold-500 animate-ping inline-block" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-espresso-700 font-medium">
            3D Interactive Roast
          </span>
        </div>
      </div>
    </div>
  );
}
