import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GUI } from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Create a scene
let scene = new THREE.Scene();

// Create a camera
let camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 5);
scene.add(camera);

// Create a renderer
const canvas = document.querySelector('#draw');
let renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Load HDR environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/zwartkops_start_morning_1k.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
});


// Controls for the camera to move around
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

//3d model loader
const loader = new GLTFLoader();
loader.load('./Models/3dmodel.glb', (gltf) => {
    scene.add(gltf.scene);
});


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// GUI panel
const gui = new GUI();
const materialFolder = gui.addFolder('Material');
materialFolder.add(material, 'metalness', 0, 1, 0.01).name('Metalness');
materialFolder.add(material, 'roughness', 0, 1, 0.01).name('Roughness');

const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(camera.position, 'x', -10, 10, 0.01).name('Camera X');
cameraFolder.add(camera.position, 'y', -10, 10, 0.01).name('Camera Y');
cameraFolder.add(camera.position, 'z', -10, 10, 0.01).name('Camera Z');
cameraFolder.add(camera, 'zoom', 0.1, 5, 0.1).name('Zoom').onChange(() => camera.updateProjectionMatrix());

materialFolder.open();
cameraFolder.open();