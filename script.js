// Import Three.js and GLTFLoader
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';

// Initialize variables
let scene, camera, renderer, arSession;
let glbModel;

init();

async function init() {
  // Create a WebGLRenderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create a scene
  scene = new THREE.Scene();

  // Add lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10).normalize();
  scene.add(light);

  // Load the GLB model
  const loader = new GLTFLoader();
  loader.load('assets/wings.glb', (gltf) => {
    glbModel = gltf.scene;
    glbModel.scale.set(0.1, 0.1, 0.1); // Adjust scale if needed
    scene.add(glbModel);
  });

  // Check for WebXR support
  if (!navigator.xr) {
    alert('WebXR not supported in this browser.');
    return;
  }

  // Request an AR session
  const sessionInit = { optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } };
  arSession = await navigator.xr.requestSession('immersive-ar', sessionInit);

  // Set up the XR frame loop
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local');
  renderer.xr.setSession(arSession);

  // Start rendering
  renderer.setAnimationLoop(render);
}

function render() {
  if (glbModel) {
    // Rotate the model for demonstration purposes
    glbModel.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}