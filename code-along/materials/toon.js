import * as THREE from "three";
    import { OrbitControls } from "three/addons/controls/OrbitControls.js";
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
    import { OutlineEffect } from 'three/addons/effects/OutlineEffect.js';
    import { LoadingBar } from "../../libs/LoadingBar.js";

    let camera, scene, renderer, clock, light, knight, mixer, outline;

    init();
    
    function init() {
        renderer = new THREE.WebGLRenderer({antialias: true, stencil: false});
        renderer.setPixelRatio( Math.min(2, window.devicePixelRatio ));
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 50 );
        camera.position.set( 1, 0.8, 2.5 );
        camera.lookAt(0,0.8,0);
        
        const col = 0xAAAAAA;
        scene = new THREE.Scene();
        scene.background = new THREE.Color( col );

        clock = new THREE.Clock();

        const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.2);
		scene.add(ambient);

        light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
        light.position.set( 4, 20, 20);
        scene.add( light );

        window.addEventListener( 'resize', onWindowResize, false );
        
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0.8, 0 );
        controls.update();
        
        loadModel();
    }

    function loadModel(){
        const loader = new GLTFLoader( ).setPath('../../assets/');
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '../../node_modules/three/examples/jsm/libs/draco/' );
        loader.setDRACOLoader( dracoLoader );
                
        const loadingBar = new LoadingBar();
        loadingBar.visible = true;
            
        // Load a glTF resource
        loader.load(
            // resource URL
            'knight3.glb',
            // called when the resource is loaded
            gltf => {
                let material;

                knight = gltf.scene;
                knight.children[1].visible = false;

                mixer = new THREE.AnimationMixer( knight );
                const action = mixer.clipAction( gltf.animations[2] );
                if ( action ) action.play();

                //Add material replacement code here
            
                loadingBar.visible = false;
            
                scene.add( knight );
            
                render(); 
            },
            // called while loading is progressing
            xhr => {
                loadingBar.update(name, xhr.loaded, xhr.total);        
            },
            // called when loading has errors
            err => {

                console.error( err );

            }
        );
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function render() {
        requestAnimationFrame( render );
        const dt = clock.getDelta();
        if (mixer) mixer.update(dt);

        renderer.render( scene, camera );
    } 