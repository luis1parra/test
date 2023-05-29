let cube;
let scene;
let OrbitControls;
var raycaster = new THREE.Raycaster();

export function updateCubePosition() {
    /*
  if (camera && cube) {
      const screenSize = new THREE.Vector2(container.clientWidth, container.clientHeight);
      console.log("Screen size:", screenSize);
  
      const corner = new THREE.Vector3(screenSize.x * 0.5 - 20, screenSize.y * 0.5 - 20, 1);
      console.log("Corner:", corner);
  
      camera.updateMatrixWorld();
      console.log("Camera matrix world updated");
  
      const worldPos = new THREE.Vector3(); 
      worldPos.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrixInverse, corner));
      console.log("World position:", worldPos);
  
      cube.position.copy(worldPos);
      console.log("Cube position:", cube.position);
      
  }
  */
  }
  
  
    //import * as MyThree from "./threeLibraries/three.js";
    export function createCube(sceneLoaded) {
      
      scene = sceneLoaded;
     // Create an array of materials with different colors.
     const geometry = new THREE.BoxGeometry();

     const materials = [
       new THREE.MeshBasicMaterial({ color: 0xff0000 }),
       new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
       new THREE.MeshBasicMaterial({ color: 0x0000ff }),
       new THREE.MeshBasicMaterial({ color: 0xffff00 }),
       new THREE.MeshBasicMaterial({ color: 0xff00ff }),
       new THREE.MeshBasicMaterial({ color: 0x00ffff })
     ];
     
     // Create the cube using the materials array.
     cube = new THREE.Mesh(geometry, materials);

     cube.position.x=7;
     cube.position.y=2;

     scene.add(cube);
     
     // Add click functionality for faces.
     const raycaster = new THREE.Raycaster();
     const mouse = new THREE.Vector2();
     function onMouseMove(event) {
       event.preventDefault();
     
       mouse.x = (container.clientWidth / container.clientWidth) * 2 - 1;
       mouse.y = -(container.clientHeight / container.clientHeight) * 2 + 1;
     
       raycaster.setFromCamera(mouse, camera);
       const intersects = raycaster.intersectObjects([cube]);
     
       if (intersects.length > 0) {
         container.style.cursor = 'pointer';
       } else {
         container.style.cursor = 'auto';
       }
     }
     
      // Update cube position to match the camera's upper right corner
      updateCubePosition();
      
    }


    export function onClickCube(event, container, mouse, camera, orbitControl) {
  
    
      mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;
    
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([cube]);
    
      // Log mouse coordinates and raycaster
      console.log("Mouse coordinates:", mouse);
      console.log("Raycaster:", raycaster,intersects);
    
      // Create a line to visualize the raycast
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([raycaster.ray.origin, raycaster.ray.origin.clone().add(raycaster.ray.direction.multiplyScalar(100))]);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      
      
      if (intersects.length > 0) {
        console.log("Face clicked:", intersects[0].faceIndex);
        vistasCamera(camera, orbitControl,"ArrowLeft");
      }
    }
    

     

    export function vistasCamera(camera, orbitControl ,key) {
        switch(key) {
          case 'ArrowLeft': // left arrow
            cube.rotation.y -= Math.PI / 2;
            camera.position.set(-100, 0, 0);
            camera.lookAt(0, 0, 0);
            break;
          case 'ArrowUp': // up arrow
          cube.rotation.x += Math.PI / 2;
            camera.position.set(0, 100, 0);
            camera.lookAt(0, 0, 0);
            break;
          case 'ArrowRight': // right arrow
          cube.rotation.y += Math.PI / 2;
            camera.position.set(100, 0, 0);
            camera.lookAt(0, 0, 0);
            break;
          case 'ArrowDown': // down arrow
            cube.rotation.x -= Math.PI / 2;
            orbitControl.enabled = true;
            camera.position.set(50, 50, 50); // reset the camera position to a default 3/4 view
            break;
        }
      }