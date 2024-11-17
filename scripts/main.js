import * as THREE from 'three';
import {OrbitControls} from 
'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { Map, Water, Island} from './map';
import {popupActive, } from './popup';

async function main(){
//getting the data from API

let matrix = []
matrix = await getData();

const app = document.getElementById('app');
const h1 = document.getElementById('heart1');
const h2 = document.getElementById('heart2');
const h3 = document.getElementById('heart3');
let hearts = [h1,h2,h3];


//setting up renderer, scene, camera, initial camera position, orbit controls, fps tracker

const renderer = new THREE.WebGLRenderer();
renderer.setSize(app.clientWidth, app.clientHeight);
renderer.setClearColor(0x80a0e0);
renderer.domElement.style.borderRadius = "20px";
renderer.domElement.style.border = "5px gold solid";
renderer.domElement.id = 'renderer';
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
);
camera.position.set(30,30,30);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.enablePan = false;
controls.dampingFactor = 0.5;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2 - 0.5;
controls.minPolarAngle = 0 + 0.5
controls.maxDistance = 60
controls.minDistance = 25

controls.rotateSpeed = 0.35;
controls.zoomSpeed = 0.45;

controls.target.set(15,0,15); //center of the map

const stats = new Stats();
// app.appendChild(stats.dom);

let prev = null;
let wrong_islands = []

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', OnMouseClick);
const map = new Map();
map.generate(matrix);
scene.add(map);
// console.log(map);
lighting();
animate();


async function getData(){
  let matrix = [];
  let currentRow = [];
  let numStr = '';
  let char = '';
  
  const apiUrl = 'https://jobfair.nordeus.com/jf24-fullstack-challenge/test#';
  const cors1 = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

  //going over cors policy
  const response = await fetch(cors1);
  if (!response.ok)
    throw new Error(await response.text());
  for await (const chunk of response.body.values()) {
    let decodedChunk = new TextDecoder().decode(chunk);
    // console.log(decodedChunk);
    for (let i = 0; i < decodedChunk.length; i++) {
      char = decodedChunk[i];
      if (char === ' ' || char === '\n') {
        if (numStr.length > 0) {
        currentRow.push(parseInt(numStr, 10));
        numStr = '';
        }
    
        if (currentRow.length === 30) {
        matrix.push(currentRow);
        currentRow = [];
        }
    
        if (matrix.length === 30 && matrix[29].length == 30) {
          break;
        }
      }
      else {
        numStr += char;
      }
    }
  }
  // if (!(char === '' || char === ' ' || char === '\n')){
  //   numStr+=char;
  // }
  if (numStr.length > 0) {
    currentRow.push(parseInt(numStr, 10));
  }
  if (currentRow.length > 0) {
    matrix.push(currentRow);
  }
  // console.log(matrix);
  return matrix;
}

function animate() {
  // Animate
  requestAnimationFrame(animate);
  controls.update();
  stats.update();
  renderer.render(scene, camera);
  
  // console.log(wrong_islands);
}

function lighting(){
  // 6. Set up lighting
  const light1 = new THREE.DirectionalLight();
  light1.position.set(1,1,1);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight();
  light2.position.set(1,-1,-0.5);
  scene.add(light2);

  const light4 = new THREE.DirectionalLight();
  light4.position.set(1,2,1);
  scene.add(light4);

  const light3 = new THREE.AmbientLight();
  light3.intensity = 0.4;
  scene.add(light3);
}

window.addEventListener('resize', () => {
  camera.aspect = app.clientWidth / app.clientHeight;
  camera.updateProjectionMatrix();
  // renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setSize(app.clientWidth, app.clientHeight);
});


const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();


function clearPrev(){
  if(prev===null || prev in wrong_islands){
    return;
  }
  let block_mesh = prev.meshIsland;
  for(let i=0;i<block_mesh.count;i++){
    block_mesh.setColorAt(i, prev.user_colors[i]);
  }
  block_mesh.instanceColor.needsUpdate = true;
}

function onMouseMove(event){
  if (popupActive){
    return;
  }
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.offsetX / app.offsetWidth) * 2 - 1;
  pointer.y = -(event.offsetY / app.offsetHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera); 
  const intersects = raycaster.intersectObjects(scene.children);

  clearPrev();
  if (intersects.length > 0) {
    // intersects[0].object.material.color.set(0xff0000);
    // console.log(intersects[0]);

    let obj = intersects[0].object;
    let island = intersects[0].object.parent;
    for(let i = 0;i<wrong_islands.length;i++){
      if(wrong_islands[i].uuid === island.uuid){
        return;
      }
    }
    if(obj.parent instanceof Island){
      let island = intersects[0].object.parent;
      let block_mesh = intersects[0].object.parent.meshIsland;
      prev = island;
      for(let i=0;i<block_mesh.count;i++){
        let new_color = new THREE.Color(island.user_colors[i].r + 0.1, island.user_colors[i].g + 0.1, island.user_colors[i].b + 0.1);
        block_mesh.setColorAt(i,new_color);
      }
      block_mesh.instanceColor.needsUpdate = true;

    } 
    // console.log(outlinePass);
  }
}


function OnMouseClick(event){
  let intersects = raycaster.intersectObjects(scene.children);
  if (popupActive){
    return;
  }
  pointer.x = (event.offsetX / app.offsetWidth) * 2 - 1;
  pointer.y = -(event.offsetY / app.offsetHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  // const intersects = raycaster.intersectObjects(scene.children);

  if(intersects.length>0 && intersects[0].object.parent instanceof Island){
    let island = intersects[0].object.parent
    for(let i = 0;i<wrong_islands.length;i++){
      if(wrong_islands[i].uuid === island.uuid){
        return;
      }
    }
    let clicked_uuid = intersects[0].object.parent.uuid;
    if(confirm('Confirm box')){

      let island = intersects[0].object.parent;
      let block_mesh = intersects[0].object.parent.meshIsland

      if(clicked_uuid == intersects[0].object.parent.parent.maxHeightUUID){
        alert('You won!!');
        window.location.reload();
      }
      else{
        
        wrong_islands.push(island);
        // console.log(wrong_islands);
        if(wrong_islands.length === 3){
          hearts[wrong_islands.length-1].src = 'resources/images/pixel-heart-empty.png';
          hearts[wrong_islands.length-1].style.animation = '1';
          for(let i=0;i<block_mesh.count;i++){
            let new_color = new THREE.Color(0x666666);
            block_mesh.setColorAt(i,new_color);
          }
          alert('Player1 tried to swim in lava..');
          window.location.reload();
          
        }
        hearts[wrong_islands.length-1].src = 'resources/images/pixel-heart-empty.png';
        hearts[wrong_islands.length-1].style.animation = '1';
        // wrong_islands.push(island);
        for(let i=0;i<block_mesh.count;i++){
          let new_color = new THREE.Color(0x666666);
          block_mesh.setColorAt(i,new_color);
        }
        block_mesh.instanceColor.needsUpdate = true;
        prev = null;
      }
    }
  }
}

}

main();
