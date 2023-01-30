/*
    Create by oskhar
    don't copyright or copyleft
*/

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

        if (this.keyboard[' '] && this.world.user.rangeRender == 0) {
            this.world.user.rangeRender = 1;
        }

        if (this.world.user.rangeRender != 0) {
            this.world.user.jump();
            this.world.user.rangeRender = this.world.user.rangeRender <= 100 ? this.world.user.rangeRender + 1 : 0;
        }

        requestAnimationFrame(this.draw.bind(this));
        this.render(this.world, this.eye);

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

        // Create user
        this.user = new MyCube();
        this.add(this.user);

        // Create ground
        this.layoutGround = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });
        this.ground = new THREE.PlaneGeometry(500, 500, 100, 100);
        this.meshGround = new THREE.Mesh(this.ground, this.layoutGround);
        this.meshGround.receiveShadow = true;
        this.meshGround.position.set(0, -1, 0);
        this.meshGround.rotation.x = -Math.PI/2;
        this.add(this.meshGround);

        // Create grid
        this.grid = new THREE.GridHelper(100, 100, 0x0a0a0a, 0x000000);
        this.grid.position.set(0, -1, 0);
        this.add(this.grid);

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

        super(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial({
            color: 0xffff00
        }));
        this.position.set(0, -0.5, 0);
        this.receiveShadow = true;
        this.castShadow = true;
        this.rangeRender = 0;

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

// Run
let run = new App();

// Keyboard control
document.body.onkeydown = function (e) {
    run.keyboard[e.key] = true;
}

document.body.onkeyup = function (e) {
    run.keyboard[e.key] = false;
}






