import smokeRef from "./res/smoke.png";
import * as POSTPROCESSING from "postprocessing";
import * as THREE from "three";

let scene,
  camera,
  renderer,
  composer,
  cloudParticles = [];

export function initCloud() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = 1.16;
  camera.rotation.y = -0.12;
  camera.rotation.z = 0.27;

  let ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  handleLights();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.fog = new THREE.FogExp2(0x03544e, 0.001);
  renderer.setClearColor(scene.fog.color);
  document.body.appendChild(renderer.domElement);

  let loader = new THREE.TextureLoader();

  loader.load(smokeRef, (texture) => {
    const cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
    });

    for (let p = 0; p < 10; p++) {
      let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
      cloud.position.set(Math.random() * 800 - 400, 500, Math.random() * 500 - 500);
      cloud.rotation.x = 1.16;
      cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.55;
      cloud.rotation.delta = (Math.random() * Math.round(Math.random()) * 2 - 1) * 0.0005;
      cloudParticles.push(cloud);
      scene.add(cloud);
    }
  });

  handleComposer();

  window.addEventListener("resize", onWindowResize);

  render();
}

function handleComposer() {
  const bloomEffect = new POSTPROCESSING.BloomEffect({
    blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
    kernelSize: POSTPROCESSING.KernelSize.SMALL,
    useLuminanceFilter: true,
    luminanceThreshold: 0.3,
    luminanceSmoothing: 0.75,
  });
  bloomEffect.blendMode.opacity.value = 1.5;

  let effectPass = new POSTPROCESSING.EffectPass(camera, bloomEffect);
  effectPass.renderToScreen = true;

  composer = new POSTPROCESSING.EffectComposer(renderer);
  composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));
  composer.addPass(effectPass);
}

export function handleLights() {
  let directionalLight = new THREE.DirectionalLight(0xff8c19);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  let orangeLight = new THREE.PointLight(0xcc6600, 50, 450, 1.7);
  orangeLight.position.set(200, 300, 100);
  scene.add(orangeLight);
  let redLight = new THREE.PointLight(0xd8547e, 50, 450, 1.7);
  redLight.position.set(100, 300, 100);
  scene.add(redLight);
  let blueLight = new THREE.PointLight(0x3677ac, 50, 450, 1.7);
  blueLight.position.set(300, 300, 200);
  scene.add(blueLight);
}

function render() {
  cloudParticles.forEach((p) => {
    p.rotation.z += p.rotation.delta;
  });
  composer.render(0.3);
  requestAnimationFrame(render);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
