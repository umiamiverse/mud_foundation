#pragma lifecycle(startup, update)

// Get the renderer's DOM element (usually the canvas) for cursor control
const domElement = renderer.domElement;

// Cast the parent of this script to a THREE.Object3D (ensures correct type)
const target = cast(self.parent, THREE.Object3D);
//console.log(target);

const showhide = scene.getObjectByName("showhide");

// Traverse all child objects of the target and tag them with their parent's name (or 'Unnamed')
target.traverse(p => {
    p.tag = target.name || 'Unnamed'; // Used for identification on click
});

function startup(){
    showhide.visible = false;
}

function update(delta, time) {
    // Get the current raycaster from the mouse input using the camera
    
    const { raycaster } = Input.mouse.raycast(camera);

    // Intersect the ray with the target object and its children
    const intercept = raycaster.intersectObject(target, true);
    const isHovering = intercept.length > 0; // True if mouse is over any part of the target

    if (isHovering) {
        target.color = "red"; // Change target color to red on hover
        domElement.style.cursor = 'pointer'; // Show pointer cursor
        showhide.visible = true;
        
    } else {
        target.color = "#00FF00"; // Revert color when not hovering
        showhide.visible = false;
    }

    // On left mouse button release while hovering
    if (Input.mouse.isButtonReleased(MouseButton.Left) && isHovering) {
        // Log the tag of the object that was clicked (e.g., parent's name)
        console.log(intercept[0].object.tag);
    }
}

