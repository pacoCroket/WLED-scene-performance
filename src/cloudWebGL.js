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

// Debug
let gui, lightingFolder, positionFolder;

let scene,
  camera,
  renderer,
  composer,
  cloudParticles = [],
  lightParticles = [];

function initGui() {
  gui = new dat.GUI();
  lightingFolder = gui.addFolder("Lighting");
  positionFolder = gui.addFolder("Position");
}

export function initCloud() {
  initGui();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = 1.16;
  camera.rotation.y = -0.12;
  camera.rotation.z = 0.27;

  positionFolder.add(camera.position, "x", -200, 1000);
  positionFolder.add(camera.position, "y", -200, 1000);
  positionFolder.add(camera.position, "z", -200, 1000);
  positionFolder.add(camera.rotation, "x", -1, 2);
  positionFolder.add(camera.rotation, "y", -0.2, 0.2);

  let ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  handleLights();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.fog = new THREE.FogExp2(0x222222, 0.001);
  renderer.setClearColor(scene.fog.color);
  // document.body.appendChild(renderer.domElement);

  let loader = new THREE.TextureLoader();

  loader.load(smokeRef, (texture) => {
    const cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
    });

    for (let p = 0; p < 10; p++) {
      let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
      cloud.position.set(Math.random() * 400 - 200, 500, Math.random() * 250 - 500);
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
  return renderer.domElement;
}

function handleComposer() {
  const bloomEffect = new BloomEffect({
    blendFunction: BlendFunction.SOFT_LIGHT,
    kernelSize: KernelSize.SMALL,
    useLuminanceFilter: true,
    luminanceThreshold: 0.3,
    luminanceSmoothing: 0.75,
  });
  bloomEffect.blendMode.opacity.value = 1.5;
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
  let directionalLight = new THREE.DirectionalLight(0x333333);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  for (let i = 0; i < 30; i++) {
    const light = new THREE.PointLight(0x000000, 50, 750, 1.7);
    light.position.set(Math.random() * 400 - 200, 420, Math.random() * 250 - 500);
    scene.add(light);
    const pointLightHelper = new THREE.PointLightHelper(light, 2);
    scene.add(pointLightHelper);
    lightParticles.push(light);
  }

  // debug
  lightingFolder.add(lightParticles[0].position, "x", 0, 200).onChange(() => {
    for (let i = 0; i < lightParticles.length; i++) {
      const light = lightParticles[i];
      light.position.x = lightParticles[0].position.x;
    }
  });
  lightingFolder.add(lightParticles[0].position, "y", 200, 500).onChange(() => {
    for (let i = 0; i < lightParticles.length; i++) {
      const light = lightParticles[i];
      light.position.y = lightParticles[0].position.y;
    }
  });
  lightingFolder.add(lightParticles[0].position, "z", -500, 200).onChange(() => {
    for (let i = 0; i < lightParticles.length; i++) {
      const light = lightParticles[i];
      light.position.z = lightParticles[0].position.z;
    }
  });
  lightingFolder.add(lightParticles[0], "distance", 0, 2000).onChange(() => {
    for (let i = 0; i < lightParticles.length; i++) {
      const light = lightParticles[i];
      light.distance = lightParticles[0].distance;
    }
  });
  lightingFolder.add(lightParticles[0], "decay", 0, 4).onChange(() => {
    for (let i = 0; i < lightParticles.length; i++) {
      const light = lightParticles[i];
      light.decay = lightParticles[0].decay;
    }
  });
  lightingFolder.add(lightParticles[0], "power", 0, 2000).onChange(() => {
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
  composer.render(0.1);
  requestAnimationFrame(render);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
