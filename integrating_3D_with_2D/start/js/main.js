let scene, camera, renderer, rotor, blade, turbineL, turbineR, clouds, material, chopper;
let mouseX = 0,
    mouseY = 0;
let windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;

let init = () => {
    //add detector to see if WebGL is supported
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    //set up a scene
    scene = new THREE.Scene();
    //add a camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //render the scene - start renderer and set it's size and background transparent
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    //transparent background colour for the renderer
    renderer.setClearColor(0xcaf8f1, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //add to webpage
    document.body.appendChild(renderer.domElement);

    //load cloud texture
    let textureLoader = new THREE.TextureLoader();
    let cl = textureLoader.load("img/cloud.png");
    //create group for clouds
    clouds = new THREE.Group();
    //make cloud material
    material = new THREE.SpriteMaterial({
        map: cl,
        opacity: 0.7
    });
    //make 20 random clouds
    for (i = 0; i < 20; i++) {
        let x = 600 * Math.random() - 300;
        let y = 200 * Math.random() - 100;
        let z = 1200 * Math.random() - 600;
        sprite = new THREE.Sprite(material);
        sprite.position.set(x, y, z);
        sprite.scale.x = sprite.scale.y = sprite.scale.z = 100;
        //add to group
        clouds.add(sprite);
    }
    console.log('loaded clouds ', clouds);

    //add to scene
    scene.add(clouds);

    console.log(scene);

    // Load 3d model
    let loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load('chopper.dae', function (collada) {
        let dae = collada.scene;
        dae.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        })

        dae.scale.x = dae.scale.y = dae.scale.z = 0.5;
        dae.rotation.y = Math.PI / 3;
        dae.position.x = 40;
        dae.updateMatrix();
        scene.add(dae);
        chopper = dae;

        rotor = scene.getObjectByName('Rotor', true);
        blade = scene.getObjectByName('blade', true);
        turbineL = scene.getObjectByName('TurbineL', true);
        turbineR = scene.getObjectByName('TurbineR', true);

        let light = scene.getObjectByName('spLight', true);
        light = light.children[0];
        light.castShadow = true;
        light.distance = 1000;
        light.penumbra = 1;
        render();
    });
    //position camera
    camera.position.set(-80, 70, 200);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
};

let onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - (windowHalfX - windowHalfX / 1.5));
    mouseY = (event.clientY - windowHalfY);
}


let render = () => {
    requestAnimationFrame(render);
    camera.lookAt(-100, 20, -80);
    camera.position.x += ((mouseX / 8) - camera.position.x) * 0.05;
    camera.position.y += (-(mouseY / 8) - camera.position.y) * 0.05;

    rotor.rotation.y += 0.15;
    blade.rotation.y += 0.3;
    turbineL.rotation.z += 0.3;
    turbineR.rotation.z += 0.3;

    for (i = 0; i < clouds.children.length; i++) {
        let obj = clouds.children[i];
        if (obj.position.z > -600) {
            obj.position.z -= 0.8;
            obj.position.x += 0.3;
        } else {
            obj.position.z = 300;
            obj.position.x = 600 * Math.random() - 300;
        }
    }

    let speed = Date.now() * 0.0015;
    chopper.position.y = (10 * Math.sin(speed));
    renderer.render(scene, camera);
};


//call the init function to run the code
init();
