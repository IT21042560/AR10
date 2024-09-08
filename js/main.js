import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js";

// Create a Three.js scene
const scene = new THREE.Scene();

// Create a camera and set its position
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50; // Adjust as needed

// Create a renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Instantiate a loader for the .obj file
const loader = new OBJLoader();

// Load the .obj file
let object;
loader.load(
  'models/model.obj', // Ensure this path is correct
  function (obj) {
    object = obj;
    scene.add(object);
    object.position.set(0, 0, 0); // Center the model
    object.scale.set(10, 10, 10); // Adjust the scale
    changeObjectColor(object, 0x3cb371); // Change color to your desired color
    console.log('Model loaded successfully');
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('Error loading model:', error);
  }
);

// Function to change the color of the object
function changeObjectColor(object, colorHex) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(colorHex);
      child.material.needsUpdate = true; // Ensure the material is updated
    }
  });
}

// Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// Set up camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();
