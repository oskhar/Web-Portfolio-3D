// Class
class MyEye extends THREE.PerspectiveCamera {

    // Constructor
    constructor (fov, asp, nea, far) {

        super(fov, asp, nea, far);
        this.position.z = 10;
        this.position.y = 1.5;
        this.rotation.x -= 0.1;

    }

    // Method
    gerakan (corz, corx) {

        this.position.z -= corz;
        this.position.x -= corx;

    }

}

// Export
export {MyEye};