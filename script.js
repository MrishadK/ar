// Import Three.js and GLTFLoader
import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';

// Initialize variables
let scene, camera, renderer, arSession;
let glbModel;

init();

async function init() {
  // Create a WebGLRenderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true; // Enable WebXR
  document.body.appendChild(renderer.domElement);

  // Create a scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc); // Light gray background

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10).normalize();
  scene.add(directionalLight);

  // Create a camera
  camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );
  camera.position.set(0, 1.6, 3); // Position the camera
  scene.add(camera);

  // Load the GLB model
  const loader = new GLTFLoader();
  loader.load(
    'assets/wings.glb',
    (gltf) => {
      console.log('Model loaded successfully:', gltf);
      glbModel = gltf.scene;
      glbModel.scale.set(0.1, 0.1, 0.1);
      scene.add(glbModel);
    },
    undefined,
    (error) => console.error('Error loading model:', error)
  );

  // Check WebXR Support
  if (!navigator.xr || !(await navigator.xr.isSessionSupported('immersive-ar'))) {
    alert('WebXR immersive AR is not supported on this device or browser.');
    return;
  }

  // Request an AR session
  const sessionInit = { optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } };
  try {
    arSession = await navigator.xr.requestSession('immersive-ar', sessionInit);
    renderer.xr.setSession(arSession);
    renderer.xr.setReferenceSpaceType('local');

    // Listen for session end
    arSession.addEventListener('end', () => {
      console.log('AR session ended.');
      renderer.setAnimationLoop(null);
    });
  } catch (error) {
    console.error('Failed to start AR session:', error);
    alert('Failed to start AR session. Please check your device and browser.');
    return;
  }

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Start rendering
  renderer.setAnimationLoop(render);
}

function render() {
  if (glbModel) {
    glbModel.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}
