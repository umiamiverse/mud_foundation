#pragma lifecycle(startup,update,dispose)

let rays = [];
let raycaster = null;
let raycastObjects = [];

function createRaycastLine(controllerIndex) {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1)
  ]);

  const material = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.8
  });

  const line = new THREE.Line(geometry, material);
  line.frustumCulled = false;
  scene.add(line);

  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), dotMaterial);
  dot.frustumCulled = false;
  scene.add(dot);

  return {
    controllerIndex,
    geometry,
    material,
    dotMaterial,
    line,
    dot,
    lastHitName: null,
    currentHitName: null,
    maxLength: 10
  };
}

function getRay(controllerIndex) {
  return rays.find(r => r.controllerIndex === controllerIndex);
}

function isHovering(controllerIndex, name) {
  const ray = getRay(controllerIndex);
  if (!ray) return false;
  return ray.currentHitName === name;
}

function isHoverEnter(controllerIndex, name) {
  const ray = getRay(controllerIndex);
  if (!ray) return false;
  return ray.currentHitName === name && ray.lastHitName !== name;
}

function isHoverExit(controllerIndex, name) {
  const ray = getRay(controllerIndex);
  if (!ray) return false;
  return ray.currentHitName !== name && ray.lastHitName === name;
}

function isClicked(controllerIndex, name) {
  const ray = getRay(controllerIndex);
  if (!ray) return false;
  return ray.currentHitName === name && Input.xr.isButtonReleased(controllerIndex, 0);
}

function updateRaycastLine(ray) {
  const { controllerIndex, geometry, material, dotMaterial, line, dot } = ray;

  if (Input.xr.count() === 0) {
    line.visible = false;
    dot.visible = false;
    return;
  }

  const origin = Input.xr.position(controllerIndex);
  if (!origin) return;

  const orientation = Input.xr.orientation(controllerIndex);
  const forward = new THREE.Vector3(0, 0, -1);
  forward.applyQuaternion(orientation);

  raycaster.set(origin, forward.normalize());

  const intersects = raycaster.intersectObjects(raycastObjects, true);

  let endPoint;

  if (intersects.length > 0) {
    const hit = intersects[0];
    endPoint = hit.point.clone();
    dot.visible = true;
    dot.position.copy(endPoint);

    let target = hit.object;
    while (target.parent && !target.name) {
      target = target.parent;
    }

    ray.currentHitName = target.name;
  } else {
    ray.currentHitName = null;
    endPoint = origin.clone().addScaledVector(forward, ray.maxLength);
    dot.visible = false;
  }

  const positions = geometry.attributes.position;
  positions.setXYZ(0, origin.x, origin.y, origin.z);
  positions.setXYZ(1, endPoint.x, endPoint.y, endPoint.z);
  positions.needsUpdate = true;

  line.visible = true;
}

function disposeRaycastLine(ray) {
  scene.remove(ray.line);
  scene.remove(ray.dot);
  ray.geometry.dispose();
  ray.material.dispose();
  ray.dotMaterial.dispose();
}

function startup() {
  raycaster = new THREE.Raycaster();

  //const togglePanel = cast(scene.getObjectByName("togglePanel"), THREE.Object3D);
  const testCube    = cast(scene.getObjectByName("testCube"), THREE.Object3D);
  //const testCube2   = cast(scene.getObjectByName("testcube2"), THREE.Object3D);

  raycastObjects = [testCube].filter(Boolean);

  rays.push(createRaycastLine(0)); // right controller
  rays.push(createRaycastLine(1)); // left controller
}



function update(delta, time) {
  // Update all rays first
  rays.forEach(ray => {
    updateRaycastLine(ray);
  });

  // Then check states by controller index and object name
  if (isHoverEnter(0, "testCube")) {
    console.log("right controller hover enter testcube");
  }

//   if (isHovering(0, "testcube")) {
//     console.log("right controller hovering testcube");
//   }

  if (isHoverExit(0, "testCube")) {
    console.log("right controller hover exit testcube");
  }

  if (isClicked(0, "testCube")) {
    console.log("right controller clicked testcube");
  }

   // Update lastHitName at end of frame
  rays.forEach(ray => {
    ray.lastHitName = ray.currentHitName;
  });
}

function dispose() {
  rays.forEach(disposeRaycastLine);
  rays = [];
}