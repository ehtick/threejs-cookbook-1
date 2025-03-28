import * as THREE from "three"
    import { OrbitControls } from "three/addons/controls/OrbitControls.js"
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
    import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
    import { GUI } from "three/addons/libs/lil-gui.module.min.js"

    let camera, scene, renderer, gui, envMap, params, material;

    init();

    function init() {

        const container = document.createElement( 'div' );
        document.body.appendChild( container );

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
        camera.position.set( 2.5, 1.5, 3.0 );

        scene = new THREE.Scene();

        const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
        scene.add(ambient);
    
        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set( 1, 10, 6);
        scene.add(light);

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild( renderer.domElement );

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.target.set( 0, 1.2, 0 );
        controls.update();

        window.addEventListener( 'resize', onWindowResize );

        setEnvironment();
        
        createGUI();

        loadModel();

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        render();

    }

    function setEnvironment(){
        new RGBELoader()
            .setPath( '../../assets/hdr/' )
            .load( 'museum.hdr', texture => {

                texture.mapping = THREE.EquirectangularReflectionMapping;

                scene.background = texture;
                scene.environment = texture;

                render();
            });
    }

    function createGUI(){
        params = {
            color: 0xffffff,
            roughness: 0,
            transmission: 1,
            thickness: 2,
        };
        gui = new GUI();

        gui.addColor( params, 'color' ).onChange( value => {
            material.color.set( value );
            render();
        } );

        gui.add( params, 'roughness', 0, 1 ).onChange( value => {
            material.roughness = value;
            render();
        } );

        gui.add( params, 'transmission', 0, 1 ).onChange( value => {
            material.transmission = value;
            render();
        } );

        gui.add( params, 'thickness', 0, 5 ).onChange( value => {
            material.thickness = value;
            render();
        } );

        render();

    }

    function loadModel(){
        const loader = new GLTFLoader()
            .setPath( '../../libs/three/examples/models/gltf/Nefertiti/' )
            .load( 'Nefertiti.glb',  gltf => {

                gltf.scene.scale.set( 0.1, 0.1, 0.1 );

                material = new THREE.MeshPhysicalMaterial( {
                    color: params.color,
                    roughness: params.roughness,
                    transmission: params.transmission,
                    thickness: params.thickness,
                } );

                gltf.scene.traverse( child => {
                    if (child.isMesh){
                        child.material.dispose();
                        child.material = material;
                    }
                });
                    
                scene.add( gltf.scene );    
                
                render();

            } );
    }

    function render() {

        renderer.render( scene, camera );

    } 