
// Lifecycle directive - defines which functions to call at different stages
#pragma lifecycle(startup, update, dispose)

// Get the DOM element from the renderer (usually the canvas)
const domElement = renderer.domElement;

const togglePanel = cast(scene.getObjectByName("togglePanel"), THREE.Object3D);
const showhide = scene.getObjectByName("Canvas");

function CheckTarget(target){
    const { raycaster } = Input.mouse.raycast(camera);
    // Intersect the ray with the target object and its children
    const intercept = raycaster.intersectObject(target, true);
    const isHovering = intercept.length > 0; // True if mouse is over any part of the target
    return isHovering;
}

// Called once when the system or scene starts
function startup() {
    Input.mouse.start();  // Initialize mouse input handling
    // Input.keyboard.start();
    // Input.touch.start();
     showhide.visible = false;
}

// Called every frame (e.g. 60 times per second) to update state
function update() {
    domElement.style.cursor = 'default';  // Reset the cursor to default every frame
    // const { raycaster } = Input.mouse.raycast(camera);

    // // Intersect the ray with the target object and its children
    // const intercept = raycaster.intersectObject(target, true);
    // const isHovering = intercept.length > 0; // True if mouse is over any part of the target
    if(CheckTarget(togglePanel) == true){
        showhide.visible = true;
        domElement.style.cursor = 'pointer';
        togglePanel.color = "red";
    }else{
        togglePanel.color = "#00FF00";
        showhide.visible = false;
    }

    // if (isHovering) {
    //     target.color = "red"; // Change target color to red on hover
    //     domElement.style.cursor = 'pointer'; // Show pointer cursor
    //     showhide.visible = true;
        
    // } else {
    //     target.color = "#00FF00"; // Revert color when not hovering
    //     showhide.visible = false;
    // }

    // // On left mouse button release while hovering
    // if (Input.mouse.isButtonReleased(MouseButton.Left) && isHovering) {
    //     // Log the tag of the object that was clicked (e.g., parent's name)
    //     console.log(intercept[0].object.tag);
    // }
}

// Called when the system or scene is being cleaned up
function dispose() {
    Input.mouse.stop();  // Stop mouse input handling and clean up
    // Input.keyboard.stop();
    // Input.touch.stop();
}
