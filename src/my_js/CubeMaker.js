// Class
class MyCube extends THREE.Mesh {

    // Constructor
    constructor (besarLangkah) {

        super(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({
            color: 0xff0ac0
        }));

        this.besarLangkah = besarLangkah;
        this.position.set(0, -0.75, 0);
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

        this.position.z -= this.besarLangkah;
        this.rotation.x -= this.besarLangkah;

    }

    // Method
    belakang () {

        this.position.z += this.besarLangkah;
        this.rotation.x += this.besarLangkah;

    }

    // Method
    kanan () {

        this.position.x += this.besarLangkah;
        this.rotation.z += this.besarLangkah;

    }

    // Method
    kiri () {

        this.position.x -= this.besarLangkah;
        this.rotation.z -= this.besarLangkah;

    }

}

// Export
export {MyCube};