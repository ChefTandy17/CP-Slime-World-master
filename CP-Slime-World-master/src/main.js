// Code Practice: Slime World
// Name: Tyvin Tandy
// Date: 2/15/2025

let config = {
    type: Phaser.AUTO,
    render: {
        pixelArt: true          //to make the art look nice
    },
    width: 320,
    height: 240,
    physics: {
        default: "arcade",      //Phasers arcade mode
        arcade: {
            debug: true         
        }
    },
    zoom: 2,
    scene: [ Overworld ]
}

const game = new Phaser.Game(config)