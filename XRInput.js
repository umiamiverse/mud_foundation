#pragma lifecycle(startup,update,dispose)

/**
 * Creates a visual line representation of a ray for debugging.
 * @param {THREE.Vector3} origin - The starting point of the ray.
 * @param {THREE.Vector3} direction - The direction vector of the ray (will be normalized).
 * @param {number} length - The visible length of the line.
 * @param {number} color - The color of the line (e.g., 0x00FF00).
 * @returns {{ray: THREE.Ray, line: THREE.Line}} An object containing the ray and the visual line mesh.
 */
function CreateRayLine(origin, direction, length = 10, color = 0x00ff00) {
    // 1. Create the THREE.Ray
    const ray = new THREE.Ray(origin, direction.normalize());

    // 2. Calculate the start and end points for the line geometry
    const startPoint = ray.origin;
    const endPoint = new THREE.Vector3();
    ray.at(length, endPoint); 

    // 3. Create the Line Geometry
    const geometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);

    // 4. Create the Line Material
    const material = new THREE.LineBasicMaterial({ color: color });

    // 5. Create the Line Mesh
    const line = new THREE.Line(geometry, material);
    
    // Store the desired length on the line object for the update function
    line.userData.rayLength = length;


    return { ray: ray, line: line };
}

/**
 * Updates the visual line's geometry to match the current ray's origin and direction.
 * @param {{ray: THREE.Ray, line: THREE.Line}} rayLineObject - The object returned by createRayLine.
 */
function updateRayLine(rayLineObject, raycastObject) {
    const { ray, line } = rayLineObject;
    const length = line.userData.rayLength;
    //console.log(ray);
    ray.origin.set(raycastObject.position.x, raycastObject.position.y, raycastObject.position.z); // Move the starting point
    ray.direction.set(raycastObject.direction.x, raycastObject.direction.y, raycastObject.direction.z).normalize(); // Change direction to the negative X-axis
    
    
    // 1. Recalculate the end point based on the updated ray
    const startPoint = ray.origin;
    const endPoint = new THREE.Vector3();
    ray.at(length, endPoint); 

    // 2. Get the position attribute of the geometry
    const positionAttribute = line.geometry.attributes.position;

    // 3. Update the start point (index 0) in the buffer
    positionAttribute.setXYZ(0, startPoint.x, startPoint.y, startPoint.z);

    // 4. Update the end point (index 1) in the buffer
    positionAttribute.setXYZ(1, endPoint.x, endPoint.y, endPoint.z);

    // 5. Tell three.js to re-read the data
    positionAttribute.needsUpdate = true;
    //line.frustumCulled = false;

}

function RayCastHit(_controller, _hitObject){
    let state;
    if(Input.xr.count() > 1){
        const {raycaster} = _controller;
        //console.log(_controller);
        const intercept = raycaster.intersectObject(_hitObject, true);
        if(intercept.length > 0){
        for(let i = 0; i< intercept.length; i++){
            //console.log(intercept[i].object.tag);
            if(intercept[i].object.tag == _hitObject.tag){
                state = true;
            }
        }
        }else{
            state = false;
        }


    }else{
        state = null;
    }

    return state;
}



// A. INITIAL SETUP

// Define the initial ray properties
const initialOrigin = new THREE.Vector3(0, 0, 0);
const initialDirection = new THREE.Vector3(0, 0, -1); // Facing into the scene
const rayLength = 15;

// Create the ray line object (this contains the THREE.Ray and the THREE.Line)
const rightControllerRay = CreateRayLine(initialOrigin, initialDirection, rayLength, 0x0000FF);
const leftControllerRay = CreateRayLine(initialOrigin, initialDirection, rayLength, 0x0000FF);

// Add the visual line to your scene
scene.add(rightControllerRay.line);
scene.add(leftControllerRay.line);

rightControllerRay.line.frustumCulled = false;
leftControllerRay.line.frustumCulled = false;

let rightControllerIndex = -1;
let leftControllerIndex = -1; 

const controllerGrip = 0;
const controllerTrigger = 1;

let testCube = scene.getObjectByName("testcube");

const XR_MOVE_SPEED = 2.0;

function startup() {

        Input.xr.start();

}
/*
*  Fired on every frame, allowing for continuous updates and dynamic behavior.
*/
function update(delta,time) {


    if(Input.xr.count() > 0){
        //console.log("XR Found");
        for (let i = 0; i < Input.xr.count(); i++) {
             if (Input.xr.handedness(i) == 'left') {
                  leftControllerIndex = i;
            } else if (Input.xr.handedness(i) == 'right') {
                  rightControllerIndex = i;
         }
       }
       
       //console.log(rightControllerIndex + " " + Input.xr.handedness(0) + leftControllerIndex + " " + Input.xr.handedness(1));
       
       if (leftControllerIndex !== -1) {
             
             //Raycast
             const leftRaycast = Input.xr.raycast(leftControllerIndex);
             updateRayLine(leftControllerRay, leftRaycast);
             
             
             //movement
             const leftJoystick = Input.xr.axes(leftControllerIndex);         
             if (leftJoystick && leftJoystick.length >= 2) {
                  const leftJoyX = -leftJoystick[2];
                  const leftJoyY = -leftJoystick[3];
                  const movement = new THREE.Vector3(
                leftJoyX * XR_MOVE_SPEED * delta,0, leftJoyY * XR_MOVE_SPEED * delta
              );
              console.log("leftJoyx" + leftJoyX + " leftjoyy " + leftJoyY);

              movement.applyQuaternion(avatarPOV.quaternion);
              avatarRig.position.add(movement);
              }


             if (Input.xr.isButtonReleased(leftControllerIndex, 1)) {
                   console.log('Button released');
             }

    
        }//left controller check end
       

        if (rightControllerIndex !== -1) {
             const rightRaycast = Input.xr.raycast(rightControllerIndex);
             updateRayLine(rightControllerRay, rightRaycast);
        

            if(RayCastHit(rightRaycast, testCube)){
                 console.log("hit test cube");
                 testCube.color = "red";
             }else{
                 testCube.color = "green";
             }
        }

    }//end of xr

}// end of update
/*
*  Fired on object destruction, enabling disposal of resources and proper finalization.
*/
function dispose() {
     Input.xr.stop();

}


