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
