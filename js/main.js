import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/OBJLoader.js";
import { DeviceOrientationControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/DeviceOrientationControls.js";

// Create a Three.js scene
const scene = new THREE.Scene();

// Create a camera and set its position
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 500;

// Create a renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true for transparent background
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Instantiate a loader for the .obj file
const loader = new OBJLoader();

// Load the .obj file
let object;
loader.load(
  'models/model.obj', // Update the path to your .obj file
  function (obj) {
    object = obj;
    scene.add(object);
    object.position.set(0, 0, 0); // Center the model
    object.scale.set(10, 10, 10); // Adjust the scale
    changeObjectColor(object, 0x3cb371); // Change color to your desired color
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

// Function to change the color of the object
function changeObjectColor(object, colorHex) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(colorHex);
    }
  });
}

// Create a video element for the camera feed
const video = document.createElement('video');
video.autoplay = true;
video.style.display = 'none'; // Hide the video element

// Access the user's camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream; // Set the video source to the camera stream
    const videoTexture = new THREE.VideoTexture(video); // Create a texture from the video feed
    scene.background = videoTexture; // Set the video texture as the scene background
  })
  .catch((err) => {
    console.error("Error accessing the camera: ", err);
  });

// Set up device orientation controls
const deviceControls = new DeviceOrientationControls(camera, renderer.domElement);
deviceControls.enable = true;

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  // Update device orientation controls
  deviceControls.update();

  // Render the scene
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
