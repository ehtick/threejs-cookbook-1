import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
  import { GUI } from "three/addons/libs/lil-gui.module.min.js"

  let scene, camera, renderer, controls, mesh, material;

  init();

  function init(){
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 15);
    
    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
    scene.add(ambient);
    
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set( 1, 10, 6);
    scene.add(light);
    
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener( 'change', render ); 
    controls.target.set( 0, 2.1, 0 );
    controls.update();
      
    window.addEventListener( 'resize', resize, false);
    
    setBg();
    loadModel();

    const options = {
      matcap: 'none'
    }

   //TO DO - 1: create matcap material

    const gui = new GUI();
      gui.add( options, 'matcap', ['none', 'matcap1', 'matcap2', 'matcap3', 'matcap4']).onChange( value => {
      //TO DO - 3: update matcap
    })

    render();
  }

  function setBg(){

      new THREE.TextureLoader()
          .setPath('../../assets/')
          .load( 'radial.jpg', 
                  texture => {
                      texture.colorSpace = THREE.SRGBColorSpace;
                      scene.background = texture;
                      render();
                  }, null, 
                  err => {
                      console.error( err );
                      console.log( err.message );
                  });

  }

  function loadModel(){

      const loader = new GLTFLoader().setPath( '../../assets/' );
      loader.load( 'ShaderBall.glb',  gltf => {
          const scale = 3;

          gltf.scene.scale.set( scale, scale, scale );

          //TO DO - 2: Apply material

          scene.add( gltf.scene );

          mesh = gltf.scene;

          render();

      } );

  }

  function render(){
    renderer.render( scene, camera );  
  }

  function resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }