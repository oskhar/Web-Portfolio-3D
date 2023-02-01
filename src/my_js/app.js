import * as THREE from '../../node_modules/three/build/three.module.js';
import {GLTFLoader} from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let nama = prompt("Masukan nama anda");

// (main) Class
class App extends THREE.WebGLRenderer {

    // Constructor
    constructor () {

        // Atribute
        super();
        this.world = new MyWorld();
        this.eye = new MyEye(45, innerWidth/innerHeight, 1, 100);
        this.keyboard = [];

        // Rendering
        this.shadowMap.enabled = true;
        this.shadowMap.type = THREE.BasicShadowMap;
        this.setSize(innerWidth, innerHeight);
        document.body.appendChild(this.domElement);
        this.draw();

    }

    // Method
    draw () {

        this.action();
        this.render(this.world, this.eye);
        requestAnimationFrame(this.draw.bind(this));

    }

    action () {

        // Action for move user & sun
        if (this.keyboard['w']) {
            this.world.user.depan();
            this.world.sun.depan();
        } else if (this.keyboard['s']) {
            this.world.user.belakang();
            this.world.sun.belakang();
        }
        if (this.keyboard['a']) {
            this.world.user.kiri();
            this.world.sun.kiri();
        } else if (this.keyboard['d']) {
            this.world.user.kanan();
            this.world.sun.kanan();
        }

        // Action for move eye
        if (this.eye.position.z - this.world.user.position.z > 14)
            this.eye.gerakan(this.eye.position.z - this.world.user.position.z - 14, 0);
        else if (this.eye.position.z - this.world.user.position.z < 8)
            this.eye.gerakan(-8 + (this.eye.position.z - this.world.user.position.z), 0);
        if (this.eye.position.x - this.world.user.position.x < -4)
            this.eye.gerakan(0, 4 + this.eye.position.x - this.world.user.position.x);
        else if (this.eye.position.x - this.world.user.position.x > 4)
            this.eye.gerakan(0, -4 + (this.eye.position.x - this.world.user.position.x));

        // Action for jump
        if (this.keyboard[' '] && this.world.user.rangeRender == 0) {
            this.world.user.rangeRender = 1;
        }
        if (this.world.user.rangeRender != 0) {
            this.world.user.jump();
            this.world.user.rangeRender = this.world.user.rangeRender <= 100 ? this.world.user.rangeRender + 1 : 0;
        }

    }

}

// Class
class MyWorld extends THREE.Scene {

    // Constructor
    constructor () {

        super();

        // Create sun
        this.sun = new MySun();
        this.add(this.sun);
        this.add(new THREE.AmbientLight(0xffffff, 0.2));

        // Create user
        this.user = new MyCube();
        this.add(this.user);

        // Create ground
        this.layoutGround = new THREE.MeshLambertMaterial({
            color: 0x33cc99
        });
        this.ground = new THREE.PlaneGeometry(10, 100, 1, 5);
        this.meshGround = new THREE.Mesh(this.ground, this.layoutGround);
        this.meshGround.receiveShadow = true;
        this.meshGround.position.set(0, -1, -40);
        this.meshGround.rotation.x = -Math.PI/2;
        this.add(this.meshGround);

        // Create 3d object
        new MyBlend('./lib/asset_3d/police.glb', this);
    }

    // Method
    addInstance (obj, trans) {

        this.tmpMesh = new THREE.InstancedMesh(

            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({color: 0x00ff00}),
            trans.length

        );

        for (let i = 0; i < trans.length; i++) {
            this.tmpMatrix = new THREE.Matrix4().makeTranslation(trans[i][0], trans[i][1], trans[i][2]);
            this.tmpMesh.setMatrixAt(i, this.tmpMatrix);
        }

        this.add(this.tmpMesh);

    }

    // Method
    textDua ( message, parameters ) {

    }

}

// Class
class MyEye extends THREE.PerspectiveCamera {

    // Constructor
    constructor (fov, asp, nea, far) {

        super(fov, asp, nea, far);
        this.position.z = 10;
        this.position.y = 2;

    }

    // Method
    gerakan (corz, corx) {

        this.position.z -= corz;
        this.position.x -= corx;

    }

}

// Class
class MySun extends THREE.SpotLight {

    // Constructor
    constructor () {

        super(0xffffff);
        this.castShadow = true;
        this.position.y = 10;

    }

    // Method
    depan () {

        this.position.z -= 0.05;
        this.target.position.z -= 0.05;
        this.target.updateMatrixWorld();

    }

    // Method
    belakang () {

        this.position.z += 0.05;
        this.target.position.z += 0.05;
        this.target.updateMatrixWorld();

    }

    // Method
    kanan () {

        this.position.x += 0.05;
        this.target.position.x += 0.05;
        this.target.updateMatrixWorld();

    }

    // Method
    kiri () {

        this.position.x -= 0.05;
        this.target.position.x -= 0.05;
        this.target.updateMatrixWorld();

    }

}

// Class
class MyCube extends THREE.Mesh {

    // Constructor
    constructor () {

        super(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({
            color: 0xff0ac0
        }));

        this.position.set(0, -0.75, 0);
        this.receiveShadow = true;
        this.castShadow = true;
        this.rangeRender = 0;
        this.sekalaRoted = 0;

    }

    // Method
    jump () {

        let i = 0;

        if (this.rangeRender <= 50) {
            this.position.y += 0.05;
        } else if (this.rangeRender <= 100) {
            this.position.y -= 0.05;
        }

    }

    // Method
    depan () {

        this.position.z -= 0.05;
        this.rotation.x -= 0.05;

    }

    // Method
    belakang () {

        this.position.z += 0.05;
        this.rotation.x += 0.05;

    }

    // Method
    kanan () {

        this.position.x += 0.05;
        this.rotation.z += 0.05;

    }

    // Method
    kiri () {

        this.position.x -= 0.05;
        this.rotation.z -= 0.05;

    }

}

// Class
class MyBlend extends GLTFLoader {

    // Constructor
    constructor (pathBlend, parentWorld) {

        super();
        var blendObj;
        this.load(pathBlend, (result) => {
            blendObj = result.scene.children[0];
            blendObj.castShadow = true;
            parentWorld.add(blendObj);
        });

    }


}

// Run
let run = new App();

// Keyboard control
document.body.onkeydown = function (e) {
    run.keyboard[e.key] = true;
}

document.body.onkeyup = function (e) {
    run.keyboard[e.key] = false;
}

// User resize app
document.body.onresize = function () {
   run.setSize(innerWidth, innerHeight);
   run.eye.aspect = innerWidth/innerHeight;
   run.eye.updateProjectionMatrix();
};
