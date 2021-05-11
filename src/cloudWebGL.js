import smokeRef from "./res/smoke.png";
import {
  BloomEffect,
  EffectPass,
  EffectComposer,
  BlendFunction,
  KernelSize,
  RenderPass,
} from "postprocessing";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Debug
let gui, lightingFolder, positionFolder;

let scene,
  camera,
  renderer,
  composer,
  controls,
  parentNode,
  cloudParticles = [],
  lightParticles = [];

function initGui() {
  // remove prev GUI
  document.querySelector(".dg.main.a")?.remove();
  gui = new dat.GUI();
  lightingFolder = gui.addFolder("Lighting");
  positionFolder = gui.addFolder("Position");
}

export function initCloud(_parentNode) {
  parentNode = _parentNode;
  initGui();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, parentNode.offsetWidth / parentNode.offsetHeight, 1, 1000);
  // camera.position.x = 100;
  // camera.position.x = 100;
  camera.position.y = -808;
  // camera.position.z = -100;
  // camera.rotation.x = 0.5;
  // camera.rotation.y = Math.PI / 2;
  // camera.rotation.z = 0.8;

  positionFolder.add(camera.position, "x", -200, 1000);
  positionFolder.add(camera.position, "y", -200, 1000);
  positionFolder.add(camera.position, "z", -200, 1000);
  positionFolder.add(camera.rotation, "x", -1, 2);
  positionFolder.add(camera.rotation, "y", -0.2, 0.2);

  let ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  handleLights();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.fog = new THREE.FogExp2(0x050505, 0.001);
  renderer.setClearColor(scene.fog.color);

  let loader = new THREE.TextureLoader();

  loader.load(smokeRef, (texture) => {
    const cloudGeo = new THREE.PlaneBufferGeometry(600, 600, 16, 16);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });

    positionFolder.add(cloudMaterial, "opacity", 0, 1);

    for (let p = 0; p < 15; p++) {
      let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
      cloud.position.set(1400 * (randn_bm() * 2 - 1), 50 * Math.random(), 600 * (randn_bm() * 2 - 1));
      cloud.rotation.x = Math.PI / 2;
      // cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.55;
      cloud.rotation.delta = (Math.random() * Math.round(Math.random()) * 2 - 1) * 0.0005;
      cloudParticles.push(cloud);
      scene.add(cloud);
    }
  });

  handleComposer();
  controls = new OrbitControls(camera, renderer.domElement);

  renderer.setSize(parentNode.offsetWidth, parentNode.offsetHeight);
  window.addEventListener("resize", onWindowResize);

  render();
  return renderer.domElement;
}

function handleComposer() {
  const bloomEffect = new BloomEffect({
    blendFunction: BlendFunction.SOFT_LIGHT,
    kernelSize: KernelSize.SMALL,
    useLuminanceFilter: true,
    luminanceThreshold: 0.2,
    luminanceSmoothing: 0.75,
  });
  bloomEffect.blendMode.opacity.value = 0.9;
  lightingFolder.add(bloomEffect.blendMode.opacity, "value", 0, 10).name("BlendModeOpacity");

  let effectPass = new EffectPass(camera, bloomEffect);
  effectPass.renderToScreen = true;

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(effectPass);
}

export function setLights(colors) {
  for (let i = 0; i < colors.length; i++) {
    // limit the lights to defined light particles
    if (i >= lightParticles.length) break;
    lightParticles[i].color.setStyle(colors[i]);
  }
}

export function handleLights() {
  let directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(0, -200, 0);
  scene.add(directionalLight);
  // const pointLightHelper = new THREE.DirectionalLightHelper(directionalLight, 2);
  // scene.add(pointLightHelper);

  lightingFolder.add(directionalLight, "intensity", 0, 10).name("dir intensiry");
  const lightCount = 30;

  let xFactor, zFactor;
  for (let i = 0; i < lightCount; i++) {
    const light = new THREE.PointLight(0xff0000, 30, 400, 4);
    if (i % 3 == 0) {
      xFactor = 40 * (i * 0.2 + (Math.random() - 0.5));
      zFactor = 600 * (0.4 * randn_bm() + 0.6 * Math.random() - 0.5);
    }

    light.position.set(-600 + i * 30 + xFactor, 20 - Math.random() * 20, zFactor + Math.random() * 100);
    scene.add(light);
    lightParticles.push(light);

    const pointLightHelper = new THREE.PointLightHelper(light, 2, 0x660000);
    scene.add(pointLightHelper);
  }

  // debug
  lightingFolder.add(lightParticles[0].position, "y", -100, 100).onChange(() => {
    for (let i = 0; i < lightParticles.length; i++) {
      lightParticles[i].distance = lightParticles[0].position.y;
    }
  });
  lightingFolder.add(lightParticles[0], "distance", 0, 1000).onChange(() => {
    for (let i = 0; i < lightParticles.length; i++) {
      const light = lightParticles[i];
      light.distance = lightParticles[0].distance;
    }
  });
  lightingFolder.add(lightParticles[0], "decay", 0, 200).onChange(() => {
    for (let i = 0; i < lightParticles.length; i++) {
      const light = lightParticles[i];
      light.decay = lightParticles[0].decay;
    }
  });
  lightingFolder.add(lightParticles[0], "power", 0, 200).onChange(() => {
    for (let i = 0; i < lightParticles.length; i++) {
      const light = lightParticles[i];
      light.power = lightParticles[0].power;
    }
  });
  lightingFolder.add(lightParticles[0], "intensity", 0, 100).onChange(() => {
    for (let i = 0; i < lightParticles.length; i++) {
      const light = lightParticles[i];
      light.intensity = lightParticles[0].intensity;
    }
  });
}

function render() {
  cloudParticles.forEach((p) => {
    p.rotation.z += p.rotation.delta;
  });
  controls.update();
  composer.render(0.1);
  requestAnimationFrame(render);
}

function onWindowResize() {
  camera.aspect = parentNode.offsetWidth / parentNode.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(parentNode.offsetWidth, parentNode.offsetHeight);
}

function randn_bm() {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
  return num;
}
