// smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    // allow empty hrefs or disabled anchors to keep non-working behavior:
    if (this.classList.contains('disabled')) return;
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// modal for certificates
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const modalClose = document.getElementById('modal-close');

document.querySelectorAll('.cert-card img').forEach(img => {
  img.addEventListener('click', () => {
    const src = img.dataset.full || img.src;
    modalImg.src = src;
    modalCaption.textContent = img.alt || '';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

function closeModal(){
  modal.style.display = 'none';
  modalImg.src = '';
  modalCaption.textContent = '';
  document.body.style.overflow = '';
}

// footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Example: how to enable social buttons later (explanation below)
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.href;
    if(url && url !== '#') window.open(url, '_blank');
  });
});
/* ---------- 3D rotating globe (Three.js) ---------- */
(() => {
    // helper to convert latitude/longitude into 3D position
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z =  (radius * Math.sin(phi) * Math.sin(theta));
  const y =  (radius * Math.cos(phi));
  return new THREE.Vector3(x, y, z);
}

  if (typeof THREE === 'undefined') return; // ensure three.js loaded

  // canvas must exist (you added <canvas id="bg3d"></canvas>)
  const canvas = document.getElementById('bg3d');
  if (!canvas) return;

  // three.js essentials
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 3000);
  camera.position.set(0, 0, 650);

  // lights
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.9);
  dir.position.set(5, 3, 5);
  scene.add(dir);

  // load textures (local files recommended)
  const loader = new THREE.TextureLoader();
  const earthTex = loader.load('images/earth/earth.jpg', undefined, undefined, (err) => {
    console.warn('Failed to load earth.jpg — check path images/earth/earth.jpg');
  });
  const cloudsTex = loader.load('images/earth/clouds.png', undefined, undefined, () => {});

  // Earth sphere
  const R = 200;
  const earthGeo = new THREE.SphereGeometry(R, 64, 64);
  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTex,
    metalness: 0.0,
    roughness: 0.9,
  });
  const earth = new THREE.Mesh(earthGeo, earthMat);
  scene.add(earth);
  

  // subtle cloud layer (slightly larger, transparent)
  const cloudGeo = new THREE.SphereGeometry(R * 1.005, 64, 64);
  const cloudMat = new THREE.MeshStandardMaterial({
    map: cloudsTex,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const clouds = new THREE.Mesh(cloudGeo, cloudMat);
  scene.add(clouds);

  // faint atmosphere glow - a soft transparent sphere
  const atmGeo = new THREE.SphereGeometry(R * 1.06, 32, 32);
  const atmMat = new THREE.MeshBasicMaterial({
    color: 0x7fb3ff,
    transparent: true,
    opacity: 0.05,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  });
  const atmosphere = new THREE.Mesh(atmGeo, atmMat);
  scene.add(atmosphere);

  // mouse interaction variables
  const mouse = {x: 0, y: 0};
  let targetRotX = 0, targetRotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    // map mouse to small rotation targets
    targetRotY = mouse.x * 0.35; // yaw
    targetRotX = mouse.y * 0.18; // pitch
  }, { passive: true });

  // gentle auto-rotation speed
  const autoSpeed = 0.0025;

  // animate loop
  let last = 0;
  function animate(time) {
    const delta = (time - last) / 16.666; // normalize to ~60fps
    last = time;

    // auto-rotate Earth and clouds
    earth.rotation.y += autoSpeed * delta;
    clouds.rotation.y += (autoSpeed * 1.08) * delta;

    // smoothly interpolate to mouse-target rotations for a parallax effect
    earth.rotation.x += (targetRotX - earth.rotation.x) * 0.06;
    earth.rotation.y += (targetRotY - earth.rotation.y) * 0.06;

    // clouds slight bob
    clouds.rotation.x = earth.rotation.x * 1.01;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // handle resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, { passive: true });

  // perf hint: hide canvas on small screens (optional)
  function toggleMobileCanvas(){
    if(window.innerWidth < 700) canvas.style.display = 'none';
    else canvas.style.display = 'block';
  }
  toggleMobileCanvas();
  window.addEventListener('resize', toggleMobileCanvas, { passive: true });

  
})();

const hamburger = document.getElementById('hamburger');
const sideMenu = document.getElementById('side-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  sideMenu.classList.toggle('open');
});

// Open project space
const projectsLink = document.getElementById('projects-link');
const projectsSpace = document.getElementById('projects-space');
const backHome = document.getElementById('back-home');

projectsLink.addEventListener('click', (e) => {
  e.preventDefault();

  // Close the side menu if it’s open
  sideMenu.classList.remove('open');
  hamburger.classList.remove('open');

  // Show the projects overlay
  projectsSpace.style.display = 'block';
});




// Back button
backHome.addEventListener('click', () => {
  projectsSpace.style.display = 'none';
});



