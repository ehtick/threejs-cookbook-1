import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"
import { RGBELoader } from "three/addons/loaders/RGBELoader.js"
import { GUI } from "three/addons/libs/lil-gui.module.min.js"

let scene, camera, renderer, clock, params, light;

init();

function init(){
    const assetPath = "../../assets/";

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0.11, 0.11, 0.18);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.y = 0.03;
    controls.update();

    const ambient = new THREE.HemisphereLight(0xffffff, 0xaaaa66, 0.2);
    scene.add(ambient);

    //Add lights here

    light = new THREE.DirectionalLight();
    light.visible = false;
    light.position.set(1,2,1);
    scene.add(light);

    loadModel('camera');

    params = {
        environment: "none",
        background: "none",
        light: false,
        exposure: 2
    }

    renderer.toneMappingExposure = params.exposure;

    const gui = new GUI();
    gui.add(params, 'environment', ['none', 'apartment', 'factory', 'field_sky', 'living_room', 'venice_sunset_1k']).onChange( value => { setEnvironment(value); });
    gui.add(params, 'background', ['none', 'apartment', 'factory', 'field_sky', 'living_room', 'venice_sunset_1k']).onChange( value => { setEnvironment(value, true); });
    gui.add(params, 'light').onChange( value => { light.visible = value; } );
    gui.add(params, 'exposure', 0, 5, 0.1).onChange( value => { renderer.toneMappingExposure = value; });

    window.addEventListener( 'resize', resize, false);

    update();
}

function loadModel(name){
    const loader = new GLTFLoader().setPath('../../assets/');

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../../node_modules/three/examples/jsm/libs/draco/' ); 
    loader.setDRACOLoader( dracoLoader );

    loader.load(
        `${name}.glb`,
        gltf => { 
            scene.add( gltf.scene ); 
        },
        xhr => { 
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        err => { 
            console.log( `An error happened ${err.message}` ) 
        }
    );
}

function  setEnvironment(name, bg=false){
    //TO DO
}

function update(){
    requestAnimationFrame( update );
    renderer.render( scene, camera );   
}

function resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}