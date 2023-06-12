import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { AnalogControl } from './AnalogControl.js';
import * as Model from './Model.js';

// (main) Class
class App extends THREE.WebGLRenderer {

    // Constructor
    constructor () {

        // Atribute
        super();
        this.world = new MyWorld(0.05);
        this.eye = new MyEye(45, innerWidth/innerHeight, 1, 5000);
        this.keyboard = [];
        this.analog = new AnalogControl();
        this.rangeSide = 3;
        this.homeLampOff = true;

        // Set latar
        this.latar = document.createElement('div');
        this.latar.id = "latar";
        this.latar.style.position = "absolute";
        this.latar.style.top = "0px";
        this.latar.style.width = innerWidth + "px";
        this.latar.style.height = innerHeight + "px";

        // Rendering
        this.shadowMap.enabled = true;
        this.shadowMap.type = THREE.BasicShadowMap;
        this.setSize(innerWidth, innerHeight);
        this.latar.appendChild(this.domElement);
        document.body.appendChild(this.latar);
        this.draw();

    }

    // Method
    draw () {

        this.action();
        this.render(this.world, this.eye);
        // this.world.blendObj.roted();
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
        if (this.eye.position.z - this.world.user.position.z > 12)
            this.eye.gerakan(this.eye.position.z - this.world.user.position.z - 12, 0);
        else if (this.eye.position.z - this.world.user.position.z < 8)
            this.eye.gerakan(-8 + (this.eye.position.z - this.world.user.position.z), 0);
        if (this.eye.position.x - this.world.user.position.x < -this.rangeSide)
            this.eye.gerakan(0, this.rangeSide + this.eye.position.x - this.world.user.position.x);
        else if (this.eye.position.x - this.world.user.position.x > this.rangeSide)
            this.eye.gerakan(0, -this.rangeSide + (this.eye.position.x - this.world.user.position.x));

        // Action for jump
        if (this.keyboard['naik'] && this.world.user.rangeRender == 0) {
            this.world.user.rangeRender = 1;
        }
        if (this.world.user.rangeRender != 0) {
            this.world.user.jump();
            this.world.user.rangeRender = this.world.user.rangeRender <= 100 ? this.world.user.rangeRender + 1 : 0;
        }

        // Action analog control
        if (this.analog.touch) {
            this.keyboard = this.analog.keyboard;
        }

    }

}

// Class
class MyWorld extends THREE.Scene {

    // Constructor
    constructor (besarLangkah) {

        // Atribute
        super();
        this.background = new THREE.Color(0x101010);

        // Create sun
        this.sun = new MySun(besarLangkah);
        this.add(this.sun);
        this.add(new THREE.AmbientLight(0xffffff, 0.2));

        // Create user
        this.user = new MyCube(besarLangkah);
        this.add(this.user);

        // Create ground
        this.layoutGround = new THREE.MeshLambertMaterial({
            color: 0x33cc99
        });
        this.ground = new THREE.PlaneGeometry(50, 150, 1, 5);
        this.meshGround = new THREE.Mesh(this.ground, this.layoutGround);
        this.meshGround.receiveShadow = true;
        this.meshGround.position.set(0, -1, -60);
        this.meshGround.rotation.x = -Math.PI/2;
        this.add(this.meshGround);

        // Create 3d object
        for (let i = 0; i < Object.keys(Model.objectData).length; i++) {
            this.addBlend(Model.objectData[i]['path'], Model.objectData[i]['position'], Model.objectData[i]['rotation'], Model.objectData[i]['scale']);
            
        }

        // Create lamp
        for (let i = 0; i < Object.keys(Model.lampData).length; i++) {
            this.addBlend(Model.lampData[i]['path'], Model.lampData[i]['position'], Model.lampData[i]['rotation'], Model.lampData[i]['scale'], false);
            this.addLamp(Model.lampData[i]['light'], Model.lampData[i]['color']);
        }

        // Create action area
        for (let i = 0; i < Object.keys(Model.actionData).length; i++) {
            this.addAreaAction(Model.actionData[i]['path'], Model.actionData[i]['position'], Model.actionData[i]['scale']);
            
        }

        // Create lamp on my Home
        this.homeLamp = new THREE.PointLight(0xffffff, 10/3, 1, 2);
        this.homeLamp.position.set(19, 5, -24);
        this.homeLamp.castShadow = true;
        this.add(this.homeLamp);


        this.spritey = this.makeTextSprite( 
            "Tes", 
            { fontsize: 18, textColor: {r:255, g:255, b:255, a:1.0}}
        );
        this.spritey.position.set(-31.6,0,8);
        // this.add(this.spritey);

    }

    // Method
    makeTextSprite( message, parameters ) {

        if ( parameters === undefined ) parameters = {};
        var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
        var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
        var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
        var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:0, g:0, b:255, a:1.0 };
        var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;
        var metrics = context.measureText( message );
        var textWidth = metrics.width;

        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
        context.fillText( message, borderThickness, fontsize + borderThickness);

        var texture = new THREE.Texture(canvas) 
        texture.needsUpdate = true;
        var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
        return sprite;

    }

    // Method
    addInstance (trans) {

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
    addBlend (path, setp = [0, 0, 0], setr = [0, 0, 0], sets = [0, 0, 0], shadow = true) {

        new GLTFLoader().load(path, result => {

            this.blendObj = result.scene;
            if (shadow) {
                this.blendObj.traverse( function ( object ) {

                    if ( object.isMesh ) {
                        object.castShadow = true;
                        object.receiveShadow = true;
                    }

                });
            }
            this.blendObj.position.set(setp[0], setp[1], setp[2]);
            this.blendObj.rotation.set(setr[0], setr[1], setr[2]);
            this.blendObj.scale.x += sets[0];
            this.blendObj.scale.y += sets[1];
            this.blendObj.scale.z += sets[2];
            this.add(this.blendObj);

        });

    }

    // Method
    addLamp (set, color) {

        this.tmpLight = new THREE.PointLight(color, set[3]/3, set[3], set[4]);
        this.tmpLight.position.set(set[0], set[1], set[2]);
        this.tmpLight.castShadow = true;
        this.add(this.tmpLight);

    }

    // Method
    addAreaAction (path, setp, sets) {
        this.tmpTex = new THREE.TextureLoader().load(path);
        this.tmpMat = new THREE.SpriteMaterial({map: this.tmpTex});
        this.tmpSpr = new THREE.Sprite(this.tmpMat);
        this.tmpSpr.position.set(setp[0], setp[1], setp[2])
        this.tmpSpr.scale.x += sets[0];
        this.tmpSpr.scale.y += sets[1];
        this.tmpSpr.scale.z += sets[2];
        this.add(this.tmpSpr);
    }

}

// Class
class MyEye extends THREE.PerspectiveCamera {

    // Constructor
    constructor (fov, asp, nea, far) {

        super(fov, asp, nea, far);
        this.filmGauge = 4;
        this.position.z = 10;
        this.position.y = 10;
        this.rotation.x -= 0.1;

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

        if (this.position.z > -130) {

            this.position.z -= this.besarLangkah;
            this.target.position.z -= this.besarLangkah;
            this.target.updateMatrixWorld();

        }

    }

    // Method
    belakang () {

        if (this.position.z < 14) {

            this.position.z += this.besarLangkah;
            this.target.position.z += this.besarLangkah;
            this.target.updateMatrixWorld();

        }

    }

    // Method
    kanan () {

        // if (this.position.x < 14) {

            this.position.x += this.besarLangkah;
            this.target.position.x += this.besarLangkah;
            this.target.updateMatrixWorld();

        // }

    }

    // Method
    kiri () {

        if (this.position.x > -14) {

            this.position.x -= this.besarLangkah;
            this.target.position.x -= this.besarLangkah;
            this.target.updateMatrixWorld();

        }

    }

}

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

        if (this.position.z > -130) {

            this.position.z -= this.besarLangkah;
            this.rotation.x -= this.besarLangkah;

        }

    }

    // Method
    belakang () {

        if (this.position.z < 14) {

            this.position.z += this.besarLangkah;
            this.rotation.x += this.besarLangkah;

        }

    }

    // Method
    kanan () {

        // if (this.position.x < 14) {

            this.position.x += this.besarLangkah;
            this.rotation.z += this.besarLangkah;

        // }

    }

    // Method
    kiri () {

        if (this.position.x > -14) {

            this.position.x -= this.besarLangkah;
            this.rotation.z -= this.besarLangkah;

        }

    }

}

// Run
let run = new App();

// Keyboard control
document.body.onkeydown = function (e) {
    
    run.keyboard[e.key] = true;

    if (e.key == "o") {
        if (run.homeLampOff) {
            run.world.homeLamp.distance = 10;
            run.homeLampOff = false;
        } else {
            run.world.homeLamp.distance = 1;
            run.homeLampOff = true;
        }
    }

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

// Mouse control

// Analog control
window.touchAnalog = function(event) {
    let x = 0, y = 0;
    let tmpList = [ ['a', 'w'], ['w'], ['w', 'd'], ['a'], [' '], ['d'], ['a', 's'], ['s'], ['s', 'd'] ];

    if (event.touches && event.touches[0]) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else if (event.originalEvent && event.originalEvent.changedTouches[0]) {
        x = event.originalEvent.changedTouches[0].clientX;
        y = event.originalEvent.changedTouches[0].clientY;
    } else if (event.clientX && event.clientY) {
        x = event.clientX;
        y = event.clientY;
    }

    for (let i = 0; i < 9; i++) {

        if (

            x > ((((i % 3) * Math.floor(innerWidth / 6) + (Math.ceil(i%3) * 20))+20) + (innerWidth / 2 - 50)) &&
            x < ((((i % 3 + 1) * Math.floor(innerWidth / 6) + (Math.ceil(i%3) * 20))+20) + (innerWidth / 2 - 50)) &&
            y > (innerHeight - innerWidth/2) + (Math.floor((i) / 3) * Math.floor(innerWidth/6)) &&
            y < (innerHeight - innerWidth/2) + (Math.floor((i) / 3 + 1) * Math.floor(innerWidth/6))

        ) {

            run.keyboard = [];
            for (let k = 0; k < tmpList[i].length; k++) {
                run.keyboard[tmpList[i][k]] = true;
            }

        }
        
    }
}
window.addEventListener('touchstart', touchAnalog, false);
window.addEventListener('touchmove', touchAnalog, false);
window.addEventListener('touchend', function (event) { run.keyboard = []; }, false);

// Mobile detect
window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

// Config mobile device
if (mobileCheck()) {
    run.analog.addToDom();
    run.world.user.besarLangkah = 0.08;
    run.world.sun.besarLangkah = 0.08;
    run.rangeSide = 1;
}