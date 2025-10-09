function CreateMaterialFromTexture(imagePath){
    const curTexture =  new THREE.TextureLoader().load(imagePath);
    const curMaterial = new THREE.MeshBasicMaterial( { map:curTexture});
    return curMaterial;
}

function CreateSkyboxMaterial(imagePath){
    const curTexture =  new THREE.TextureLoader().load(imagePath);
    const curMaterial = new THREE.MeshBasicMaterial( { map:curTexture,side:THREE.BackSide });
    return curMaterial;
}

//Usage: Skybox Example

let skyBoxImagePath = 'https://persistence.mud.foundation/files/2be978a8-23a5-446d-8513-d4c3b5e7c8f9.png';

let skyboxMaterial = CreateMaterialFromTexture(skyBoxImagePath);

let skyBoxObject3D = cast(self.parent, THREE.Object3D);

function startup() {
    skyBoxObject3D.children[0].material = skyboxMaterial;

}
