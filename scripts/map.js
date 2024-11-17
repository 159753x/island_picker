import * as THREE from 'three';
import {blocks} from './blocks';

const geometryBox = new THREE.BoxGeometry();

const materialBlue = new THREE.MeshLambertMaterial({
    color: 0x5555aa,
    wireframe: false
});

export class Map extends THREE.Group{
    constructor(size = 30){
        super();
        this.size = size;
        this.maxHeight = 0;
        this.maxHeightUUID = '';
    }

    generate(data){
        //adding water
        const water = new Water();
        water.generate(data);
        this.add(water);
        // let i1 = new Island();
        Islands.generateIslandsArray(data);
        // console.log(Islands.islands);
        // console.log(data);

        Islands.islands.forEach(i => {
            let island = new Island();
            island.generate(i,data);
            this.add(island);

            if(this.maxHeight<island.averageHeight){
                this.maxHeight = island.averageHeight;
                this.maxHeightUUID = island.uuid;
            }
        });

    }

}

class Islands{
    static islands = [];
    static generateIslandsArray(data){
        let data_copy= JSON.parse(JSON.stringify(data));
        for(let i=0;i<data_copy.length;i++){
            for(let j=0;j<data_copy.length;j++){
                if(data_copy[i][j]<1){
                    continue;
                }
                else{
                    let tarr = [];
                    tarr = bfs(i,j,tarr,data_copy,data);
                    this.islands.push(tarr)
                }
            }
        }
        function bfs(i,j,tarr,data,r_data){
            let q = []
            // temp = q.shift()
            data[i][j] = -1;
            q.push([i,j]);
            tarr.push([i,j]);

            while(q.length>0){
                let temp = q.shift();
                let i = temp[0];
                let j = temp[1];
                let dirs = [[1,0],[0,1],[-1,0],[0,-1]]
                dirs.forEach(dir => {
                    if ((i+dir[0]>-1 && i+dir[0]<data.length) && 
                    (j+dir[1]>-1 && j+dir[1]<data.length) && 
                    r_data[i+dir[0]][j+dir[1]]>0 && data[i+dir[0]][j+dir[1]]!==-1){

                        q.push([i+dir[0],j+dir[1]]);
                        data[i+dir[0]][j+dir[1]] = -1;
                        tarr.push([i+dir[0],j+dir[1]])
                    }
                });
            }
            return tarr

        }
    }
}

export class Island extends THREE.Group{

    constructor(){
        super();
        this.averageHeight = 0;
        this.count = 0;
        this.block_geometries = [];
        this.meshIsland = null;
        this.matrix4 = new THREE.Matrix4();
        this.user_colors = [];
    }
    generate(coord, data){
        const materialGreen = new THREE.MeshLambertMaterial({
            wireframe: false
        });
        this.meshIsland = new THREE.InstancedMesh(geometryBox, materialGreen, 30*30*10);
        this.meshIsland.count = 0;
        // const matrix4 = new THREE.Matrix4();

        coord.forEach(c => {
            this.count++;
            this.averageHeight+=data[c[0]][c[1]];
            let maxH = Math.ceil(data[c[0]][c[1]]/100);
            for(let h = 0; h<maxH; h++){
                let block_instance = this.meshIsland.count
                this.matrix4.setPosition(c[0],h,c[1]);
                if (h==1){
                    this.meshIsland.setColorAt(block_instance, new THREE.Color(blocks.sand.color))
                    this.meshIsland.setMatrixAt(block_instance,this.matrix4);
                    this.user_colors.push(new THREE.Color(blocks.sand.color));
                    // this.add(this.meshIsland);
                    this.meshIsland.count++;
                    continue;
                }
                if(h>=9){
                    this.meshIsland.setColorAt(block_instance, new THREE.Color())
                    this.meshIsland.setMatrixAt(block_instance,this.matrix4);
                    this.user_colors.push(new THREE.Color());
                    // this.add(this.meshIsland);
                    this.meshIsland.count++;
                    continue;
                }
                if (h===maxH-1){
                    this.meshIsland.setColorAt(block_instance, new THREE.Color(blocks.grass.color))
                    this.meshIsland.setMatrixAt(block_instance,this.matrix4);
                    this.user_colors.push(new THREE.Color(blocks.grass.color));
                    // this.add(this.meshIsland);
                    this.meshIsland.count++;
                    continue;
                }
                this.meshIsland.setColorAt(block_instance, new THREE.Color(blocks.dirt.color))
                this.meshIsland.setMatrixAt(block_instance,this.matrix4);
                this.user_colors.push(new THREE.Color(blocks.dirt.color));
                // this.add(this.meshIsland);
                this.meshIsland.count++
            }
        });
        this.averageHeight = this.averageHeight/this.count;
        this.add(this.meshIsland);

    }
}

export class Water extends THREE.Group{
    constructor(){
        super();
        this.size = 30;
    }
    generate(data){
        const meshWater = new THREE.InstancedMesh(geometryBox, materialBlue, 30*30*5);
        meshWater.count = 0;
        const matrix4 = new THREE.Matrix4();
        for(let i = 0;i<this.size;i++){
            for(let j = 0;j<this.size;j++){
                // if(data[i][j]===0){
                // }
                matrix4.setPosition(i,0,j);
                meshWater.setMatrixAt(meshWater.count++,matrix4);
                this.add(meshWater);
                    
                
            }
        }
    }
}