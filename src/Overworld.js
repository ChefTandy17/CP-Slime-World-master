class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene')
    }

    init() {
        this.VEL = 100  // slime velocity constant
    }

    preload() {
        this.load.path = './assets/'
        this.load.spritesheet('slime', 'slime.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.image('tilesetImage','tileset.png')
        this.load.tilemapTiledJSON('tilemapJSON','overworld.json')
    }

    create() {
        // creating a tilemap
        const map = this.add.tilemap('tilemapJSON')                              //create a tilemap object
        const tileset = map.addTilesetImage('tileset', 'tilesetImage')           //adding the tileset image named "tileset". Now add the image of it
        const backgroundLayer = map.createLayer("Background", tileset, 0,0);          //professor used "bgLayer" as the constant name. The "Background" name is from Tiled app
        const terrainLayer = map.createLayer("Terrain", tileset, 0,0)
        const treeLayer = map.createLayer("Trees", tileset, 0,0);


        //to create colliders
        terrainLayer.setCollisionByProperty({ collides: true })              //from Tiled, anything that collides is true, will be collidable. NOTE:THIS ALONE WON'T WORK
        treeLayer.setCollisionByProperty({ collides: true })   

        const slimeSpawn = map.findObject('Spawns', (obj) => obj.name === 'slimeSpawn')                                   

        // add slime
        this.slime = this.physics.add.sprite(slimeSpawn.x, slimeSpawn.y, 'slime', 0)
        this.slime.body.setCollideWorldBounds(true)

        // slime animation
        this.anims.create({
            key: 'jiggle',                                                          
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("slime",{
                start: 0,
                end: 1
            })                       //defined in preload()
        })
        this.slime.play('jiggle')

        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);     //phaser gives us the map.widthInPixels. same for height on where to go
        this.cameras.main.startFollow(this.slime, true, 0.25, 0.25)                                  //to follow the slime. 

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)   //this is to ensure that we can walk anywhere un the background tilemap

        //NOTE: it must be after the terrain layer and where we declare the slime variable. else it will not work
        this.physics.add.collider(this.slime, terrainLayer)
        this.physics.add.collider(this.slime, treeLayer)

        // input
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    update() {
        // slime movement
        this.direction = new Phaser.Math.Vector2(0)
        if(this.cursors.left.isDown) {
            this.direction.x = -1
        } else if(this.cursors.right.isDown) {
            this.direction.x = 1
        }

        if(this.cursors.up.isDown) {
            this.direction.y = -1
        } else if(this.cursors.down.isDown) {
            this.direction.y = 1
        }

        this.direction.normalize()
        this.slime.setVelocity(this.VEL * this.direction.x, this.VEL * this.direction.y)
    }
}