// Class
class MySun extends THREE.SpotLight {

    // Constructor
    constructor (besarLangkah) {

        // Atribute
        super(0xffffff);
        this.besarLangkah = besarLangkah;
        this.castShadow = true;
        this.position.y = 5;
        this.penumbra = 0.5;

    }

    // Method
    depan () {

        this.position.z -= this.besarLangkah;
        this.target.position.z -= this.besarLangkah;
        this.target.updateMatrixWorld();

    }

    // Method
    belakang () {

        this.position.z += this.besarLangkah;
        this.target.position.z += this.besarLangkah;
        this.target.updateMatrixWorld();

    }

    // Method
    kanan () {

        this.position.x += this.besarLangkah;
        this.target.position.x += this.besarLangkah;
        this.target.updateMatrixWorld();

    }

    // Method
    kiri () {

        this.position.x -= this.besarLangkah;
        this.target.position.x -= this.besarLangkah;
        this.target.updateMatrixWorld();

    }

}

// Export
export {MySun};