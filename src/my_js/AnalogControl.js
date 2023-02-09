// Class
class AnalogControl {

    // Constructor
    constructor () {

        // Atribute
        this.pin = [];
        this.keyboard = [];
        this.touch = false;
        this.xAnalog = 0;
        this.yAnalog = 0;

    }

    // Method
    addToDom () {

        for (let i = 0; i < 9; i++) {

            this.pin[i] = document.createElement('div');
            this.pin[i].id = "pin"+i;
            this.pin[i].style.position = "absolute";
            this.pin[i].style.height = (Math.floor(innerWidth / 6) - 80) +"px";
            this.pin[i].style.width = (Math.floor(innerWidth / 6) - 80) +"px";
            this.pin[i].style.background = "transparent";
            this.pin[i].style.borderRadius = "50%";
            this.pin[i].style.border = "20px solid rgba(255, 255, 255, 0.3)";
            this.pin[i].style.top = (innerHeight - innerWidth/2) + (Math.floor((i) / 3) * Math.floor(innerWidth/6)) + "px";
            this.pin[i].style.left = ((((i % 3) * Math.floor(innerWidth / 6) + (Math.ceil(i%3) * 20))+20) + (innerWidth / 2 - 50)) + "px";
            document.body.appendChild(this.pin[i]);

        }
        
    }

}

// Export
export {AnalogControl};