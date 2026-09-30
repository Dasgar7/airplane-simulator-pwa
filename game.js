import * as THREE from "three";

const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7ec8e3);
scene.fog = new THREE.Fog(0x7ec8e3, 400, 2400);

const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.4, 5000);
const sun = new THREE.DirectionalLight(0xfff2d0, 1.4);
sun.position.set(200, 400, 120);
sun.castShadow = true;
scene.add(sun, new THREE.AmbientLight(0x88aacc, 0.55));

const world = new THREE.Group();
scene.add(world);

const water = new THREE.Mesh(
  new THREE.PlaneGeometry(8000, 8000),
  new THREE.MeshPhongMaterial({ color: 0x1c6ea4, shininess: 80 })
);
water.rotation.x = -Math.PI / 2;
water.position.y = -2;
scene.add(water);

const countries = [
  { id: "usa", name: "United States", x: 0, z: 0, color: 0x3d8b40, pay: 1 },
  { id: "bra", name: "Brazil", x: 380, z: 420, color: 0x2f9e44, pay: 1.1 },
  { id: "gbr", name: "United Kingdom", x: -520, z: -180, color: 0x6b8f3a, pay: 1.15 },
  { id: "fra", name: "France", x: -430, z: -40, color: 0x4caf50, pay: 1.1 },
  { id: "egy", name: "Egypt", x: 80, z: -480, color: 0xc2a25d, pay: 1.2 },
  { id: "ind", name: "India", x: 620, z: -220, color: 0xd4a017, pay: 1.15 },
  { id: "jpn", name: "Japan", x: 920, z: -80, color: 0x5aa469, pay: 1.35 },
  { id: "aus", name: "Australia", x: 760, z: 560, color: 0xc9a227, pay: 1.4 },
  { id: "ken", name: "Kenya", x: 160, z: 260, color: 0x7cb342, pay: 1.05 },
  { id: "can", name: "Canada", x: -80, z: -320, color: 0x66bb6a, pay: 1.1 }
];

const pads = [];
function makeIsland(c) {
  const group = new THREE.Group();
  group.position.set(c.x, 0, c.z);
  const land = new THREE.Mesh(
    new THREE.CylinderGeometry(90 + Math.random() * 30, 110, 16, 18),
    new THREE.MeshLambertMaterial({ color: c.color })
  );
  land.position.y = 6;
  land.receiveShadow = true;
  group.add(land);
  const runway = new THREE.Mesh(new THREE.BoxGeometry(18, 0.6, 90), new THREE.MeshLambertMaterial({ color: 0x333333 }));
  runway.position.y = 14.4;
  group.add(runway);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.62, 80), new THREE.MeshLambertMaterial({ color: 0xfff2a8 }));
  stripe.position.y = 14.5;
  group.add(stripe);
  const tower = new THREE.Mesh(new THREE.BoxGeometry(4, 16, 4), new THREE.MeshLambertMaterial({ color: 0xdfe7ef }));
  tower.position.set(16, 22, -20);
  group.add(tower);
  const label = makeLabel(c.name);
  label.position.set(0, 36, 0);
  group.add(label);
  world.add(group);
  pads.push({ ...c, pos: new THREE.Vector3(c.x, 14.6, c.z) });
}
function makeLabel(text) {
  const cv = document.createElement("canvas");
  cv.width = 512; cv.height = 128;
  const g = cv.getContext("2d");
  g.fillStyle = "rgba(8,20,32,0.75)";
  g.fillRect(0, 0, 512, 128);
  g.fillStyle = "#fff";
  g.font = "bold 48px sans-serif";
  g.textAlign = "center";
  g.fillText(text, 256, 80);
  const tex = new THREE.CanvasTexture(cv);
  const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  m.scale.set(50, 12.5, 1);
  return m;
}
countries.forEach(makeIsland);

function makeCloud(x, y, z) {
  const grp = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  for (let i = 0; i < 5; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(10 + Math.random() * 8, 8, 8), mat);
    s.position.set((Math.random() - 0.5) * 28, Math.random() * 6, (Math.random() - 0.5) * 16);
    grp.add(s);
  }
  grp.position.set(x, y, z);
  scene.add(grp);
}
for (let i = 0; i < 40; i++) makeCloud((Math.random() - 0.5) * 2000, 80 + Math.random() * 90, (Math.random() - 0.5) * 2000);

function makePlane() {
  const p = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(1.1, 6.2, 6, 12), new THREE.MeshPhongMaterial({ color: 0xe8eef5 }));
  body.rotation.z = Math.PI / 2;
  const wing = new THREE.Mesh(new THREE.BoxGeometry(10, 0.18, 2.2), new THREE.MeshPhongMaterial({ color: 0x2b6cb0 }));
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.2, 1.4), new THREE.MeshPhongMaterial({ color: 0x2b6cb0 }));
  tail.position.set(-3.4, 1.2, 0);
  const stab = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.14, 1.1), new THREE.MeshPhongMaterial({ color: 0x2b6cb0 }));
  stab.position.set(-3.3, 0.4, 0);
  const prop = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.2, 0.28), new THREE.MeshPhongMaterial({ color: 0x222 }));
  prop.position.set(3.7, 0, 0);
  p.add(body, wing, tail, stab, prop);
  p.userData.prop = prop;
  p.position.set(0, 18, 20);
  scene.add(p);
  return p;
}
const plane = makePlane();

const names = ["Ava", "Noah", "Mia", "Leo", "Sofia", "Kenji", "Amara", "Hugo", "Priya", "Omar"];
const needs = ["family visit", "job interview", "medical trip", "wedding", "concert", "relief supplies"];

let cash = 2500, fuel = 100, throttle = 0, speed = 0;
let yaw = 0, pitch = 0, roll = 0, grounded = true, mission = null, jobs = [];
const keys = {};

function refreshJobs() {
  jobs = [];
  for (let i = 0; i < 6; i++) {
    const from = countries[Math.floor(Math.random() * countries.length)];
    let to = countries[Math.floor(Math.random() * countries.length)];
    while (to.id === from.id) to = countries[Math.floor(Math.random() * countries.length)];
    const dist = Math.hypot(from.x - to.x, from.z - to.z);
    jobs.push({
      id: i + "-" + Date.now(),
      who: names[Math.floor(Math.random() * names.length)],
      need: needs[Math.floor(Math.random() * needs.length)],
      from, to,
      pay: Math.round((220 + dist * 1.4) * to.pay)
    });
  }
  renderJobs();
}
function renderJobs() {
  document.getElementById("jobList").innerHTML = jobs.map(j => `
    <div class="job">
      <div><b>${j.who}</b> · ${j.need}<br>${j.from.name} → ${j.to.name}<br>$${j.pay}</div>
      <button data-id="${j.id}">Accept</button>
    </div>`).join("");
  document.querySelectorAll("#jobList button").forEach(b => b.onclick = () => acceptJob(b.dataset.id));
}
function acceptJob(id) {
  const j = jobs.find(x => x.id === id);
  if (!j) return;
  mission = { ...j, stage: "pickup" };
  document.getElementById("jobs").classList.add("hidden");
  setMission(`Fly to ${j.from.name} and pick up ${j.who} (${j.need}).`);
}
function setMission(t) { document.getElementById("mission").textContent = t; }

const sticks = { L: { x: 0, y: 0 }, R: { x: 0, y: 0 } };
function bindStick(el, key) {
  const knob = el.querySelector(".knob");
  const set = (cx, cy) => {
    const r = el.getBoundingClientRect();
    let x = (cx - r.left - r.width / 2) / (r.width / 2);
    let y = (cy - r.top - r.height / 2) / (r.height / 2);
    const m = Math.hypot(x, y) || 1;
    if (m > 1) { x /= m; y /= m; }
    sticks[key] = { x, y };
    knob.style.left = `${36 + x * 36}px`;
    knob.style.top = `${36 + y * 36}px`;
  };
  const reset = () => { sticks[key] = { x: 0, y: 0 }; knob.style.left = "36px"; knob.style.top = "36px"; };
  el.addEventListener("pointerdown", e => { el.setPointerCapture(e.pointerId); set(e.clientX, e.clientY); });
  el.addEventListener("pointermove", e => { if (el.hasPointerCapture(e.pointerId)) set(e.clientX, e.clientY); });
  el.addEventListener("pointerup", reset);
  el.addEventListener("pointercancel", reset);
}
bindStick(document.getElementById("stickL"), "L");
bindStick(document.getElementById("stickR"), "R");

addEventListener("keydown", e => keys[e.code] = true);
addEventListener("keyup", e => keys[e.code] = false);
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

document.getElementById("startBtn").onclick = () => document.getElementById("menu").style.display = "none";
document.getElementById("jobsBtn").onclick = () => document.getElementById("jobs").classList.toggle("hidden");
document.getElementById("closeJobs").onclick = () => document.getElementById("jobs").classList.add("hidden");
document.getElementById("landBtn").onclick = () => tryLand();
document.getElementById("actBtn").onclick = () => interact();

function nearestPad() {
  let best = pads[0], d = 1e9;
  for (const p of pads) {
    const dd = plane.position.distanceTo(p.pos);
    if (dd < d) { d = dd; best = p; }
  }
  return { pad: best, d };
}
function tryLand() {
  const { pad, d } = nearestPad();
  if (d < 70 && plane.position.y < 40 && speed < 28) {
    grounded = true; speed = 0; throttle = 0;
    plane.position.copy(pad.pos); plane.position.y = 16.2;
    setMission(`Landed in ${pad.name}.`);
  } else setMission("Get closer, slower, and lower to land.");
}
function interact() {
  const { pad, d } = nearestPad();
  if (!mission || d > 55 || !grounded) {
    setMission("Land at a country airport first.");
    return;
  }
  if (mission.stage === "pickup" && pad.id === mission.from.id) {
    mission.stage = "drop";
    cash += 40;
    setMission(`${mission.who} is on board. Fly to ${mission.to.name}.`);
  } else if (mission.stage === "drop" && pad.id === mission.to.id) {
    cash += mission.pay;
    setMission(`Delivered ${mission.who} to ${mission.to.name}. +$${mission.pay}`);
    mission = null;
    refreshJobs();
  } else setMission("Wrong country for this job.");
}

function update(dt) {
  let yawIn = sticks.L.x + (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
  let pitchIn = sticks.L.y + (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
  if (keys.ShiftLeft || keys.ShiftRight) throttle = Math.min(1, throttle + dt * 0.4);
  if (keys.ControlLeft) throttle = Math.max(0, throttle - dt * 0.5);
  throttle = THREE.MathUtils.clamp(throttle - sticks.R.y * dt * 0.7, 0, 1);
  if (keys.Space) tryLand();
  if (keys.KeyE) { keys.KeyE = false; interact(); }
  if (keys.KeyJ) { keys.KeyJ = false; document.getElementById("jobs").classList.toggle("hidden"); }

  const target = grounded ? throttle * 8 : throttle * 90;
  speed += (target - speed) * dt * 1.4;
  if (!grounded) {
    yaw -= yawIn * dt * 1.2;
    pitch = THREE.MathUtils.clamp(pitch + pitchIn * dt * 0.9, -0.7, 0.7);
    roll = THREE.MathUtils.lerp(roll, -yawIn * 0.5, dt * 3);
    plane.position.y += -pitch * speed * dt * 0.55;
    plane.position.y = Math.max(8, plane.position.y);
    fuel = Math.max(0, fuel - dt * (0.35 + throttle));
    if (fuel <= 0) throttle = Math.max(0, throttle - dt);
  } else {
    pitch = THREE.MathUtils.lerp(pitch, 0, dt * 4);
    roll = THREE.MathUtils.lerp(roll, 0, dt * 4);
    if (throttle > 0.55) grounded = false;
  }
  plane.rotation.set(pitch, yaw, roll, "YXZ");
  const fwd = new THREE.Vector3(1, 0, 0).applyEuler(plane.rotation);
  plane.position.addScaledVector(fwd, speed * dt);
  plane.userData.prop.rotation.x += speed * dt * 2;

  const camOff = new THREE.Vector3(-16, 5.5, 0).applyEuler(plane.rotation);
  camera.position.lerp(plane.position.clone().add(camOff), 0.12);
  camera.lookAt(plane.position.x, plane.position.y + 1.2, plane.position.z);

  const { pad, d } = nearestPad();
  document.getElementById("cash").textContent = "$" + cash.toLocaleString();
  document.getElementById("speed").textContent = Math.round(speed * 1.8) + " kt";
  document.getElementById("alt").textContent = Math.round(plane.position.y * 12) + " ft";
  document.getElementById("fuel").textContent = Math.round(fuel) + "%";
  document.getElementById("nearest").textContent = `Nearest: ${pad.name} · ${Math.round(d)} m`;
  document.getElementById("actBtn").textContent = mission?.stage === "drop" ? "Drop Off" : "Pick Up";
  if (grounded && d < 80 && fuel < 100) fuel = Math.min(100, fuel + dt * 12);
}

let last = performance.now();
function loop(t) {
  update(Math.min(0.033, (t - last) / 1000));
  last = t;
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
refreshJobs();
requestAnimationFrame(loop);

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
let deferred;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferred = e;
  const b = document.getElementById("installBtn");
  b.hidden = false;
  b.onclick = async () => { deferred.prompt(); deferred = null; b.hidden = true; };
});
