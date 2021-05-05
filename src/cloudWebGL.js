import smokeRef from "./res/smoke.png";
let scene,
  camera,
  renderer,
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

    for (let p = 0; p < 50; p++) {
      let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
      cloud.position.set(Math.random() * 800 - 400, 500, Math.random() * 500 - 500);
      cloud.rotation.x = 1.16;
      cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 2 * Math.PI;
      cloud.material.opacity = 0.55;
      cloudParticles.push(cloud);
      scene.add(cloud);
    }
  });

  render();
}

function render() {
  cloudParticles.forEach((p) => {
    p.rotation.z -= 0.001;
  });
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
