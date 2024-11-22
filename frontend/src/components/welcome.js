import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const CharacterAnimation = () => {
  const containerRef = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 场景初始化
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // 添加地板
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // 加载 3D 人物模型
    const loader = new GLTFLoader();
    let character = null;
    loader.load(
      '/deadpool/scene.gltf', // 改为 .gltf 文件路径
      (gltf) => {
        console.log('加载 3D 模型成功:');
        character = gltf.scene;
        character.position.set(-5, 0, 0);
        character.scale.set(0.5, 0.5, 0.5);
        scene.add(character);
      },
      undefined,
      (error) => {
        console.error('加载 3D 模型时出错:', error);
      }
    );

    // 动画逻辑
    let positionX = -5;
    let isMoving = true;

    const animate = () => {
      requestAnimationFrame(animate);

      if (character && isMoving) {
        positionX += 0.05; // 每帧移动
        character.position.x = positionX;

        if (positionX >= 2) {
          isMoving = false; // 停止移动
          setTimeout(() => {
            scene.remove(character); // 移除人物
          }, 1000);
        }
      }

      renderer.render(scene, camera);
    };
    //animate();

    // 清理资源
    return () => {
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn && (
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '24px' }}>
          欢迎来到...
        </div>
      )}
      <div ref={containerRef} />
      {!isLoggedIn && (
        <button
          onClick={handleLogin}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            fontSize: '16px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          登录
        </button>
      )}
    </div>
  );
};

export default CharacterAnimation;
