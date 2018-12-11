// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application(600,600);
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0xFFFFFF;

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;	

// pre-load the images
PIXI.loader.
add(["images/Figure.png","images/Fedora.png", "images/tutorial.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)}).
load(setup);

// aliases
let stage;

// game variables
let startScene;
let gameScene,player,scoreLabel,lifeLabel,shootSound,hitSound,fireballSound, gameOverScoreLabel;
let gameOverScene;

let fedoras = [];
let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;


let gravity = -4;

let timeSinceLastHat = 0;
let hatsLeftToDrop = false;
let currentHatIndex = 0;
let dt = 1/app.ticker.FPS;

let leftKey = keyboard("ArrowLeft");
let rightKey = keyboard("ArrowRight");
let upKey = keyboard("ArrowUp");



function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xff0000,
        fontSize: 48,
        fontFamily:"Verdana"
    });
    
    let startLabel1 = new PIXI.Text("Fedora Stacker");
    startLabel1.style = new PIXI.TextStyle({
        fill:0xFFFFFF,
        fontSize:60,
        fontFamily: 'Verdana',
        stroke:0xFF0000,
        strokeThickness: 6
    });
    startLabel1.x= sceneWidth/8;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);
    
    let startButton = new PIXI.Text("START");
    startButton.style = buttonStyle;
    startButton.x = sceneWidth/3;
    startButton.y = sceneHeight - 200;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on("pointerover", e=>e.target.alpha = 0.7);
    startButton.on("pointerout", e=>e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);
    
    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize:18,
        fontFamily: "Verdana",
        stroke: 0xFF0000,
        strokeThickness:4
    });
    
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);
    
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);
    
    
    // 3 - set up `gameOverScene`
    // 3A - make game over text
    let gameOverText = new PIXI.Text("Game Over!");
    textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 64,
        fontFamily: "Verdana",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    gameOverText.style = textStyle;
    gameOverText.x = 100;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);
    
    gameOverScoreLabel = new PIXI.Text();
    gameOverScoreLabel.style = textStyle;
    gameOverScoreLabel.x = 100;
    gameOverScoreLabel.y = sceneHeight/2;
    gameOverScene.addChild(gameOverScoreLabel);

    // 3B - make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 150;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup",startGame); // startGame is a function reference
    playAgainButton.on('pointerover',e=>e.target.alpha = 0.7); // concise arrow function with no brackets
    playAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0); // ditto
    gameOverScene.addChild(playAgainButton);
}

function increaseScoreBy(value){
    score += value;
    scoreLabel.text = `Score ${score}`;
}

function decreaseLifeBy(value){
    life-= value;
    life = parseInt(life);
    lifeLabel.text = `Lives: ${life}`;
}

function startGame(){
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    
    levelNum = 1;
    score = 0;
    life = 5;
    increaseScoreBy(0);
    decreaseLifeBy(0);
    player.x = 300;
    loadLevel();
}

function createFedoras(numOfHats){
    for(let i = 0; i<numOfHats; i++){
        let c= new Fedora();
        c.x = Math.random()*(sceneWidth - 50) + 25;
        c.isFalling = false;
        fedoras.push(c);
        gameScene.addChild(c);
    }
}

function FallingHats(){

}
function loadSpriteSheet(){
    let spritesheet = PIXI.BaseTexture.fromImage("images/explosions.png");
    let width = 64;
    let height = 64;
    let numFrames = 16;
    let textures = [];
    for(let i = 0; i<numFrames; i++){
        let frame = new PIXI.Texture(spritesheet, new PIXI.Rectangle(i*width, 64, width,height));
        textures.push(frame);
    }
    return textures;
}

function createExplosion(x,y,frameWidth, frameHeight){
    let w2 = frameWidth/2;
    let h2 = frameHeight/2;
    let expl = new PIXI.extras.AnimatedSprite(explosionTextures);
    expl.x =x-w2;
    expl.y = y-h2;
    expl.animationSpeed = 1/7;
    expl.loop = false;
    expl.onComplete = e=>gameScene.removeChild(expl);
    explosions.push(expl);
    gameScene.addChild(expl);
    expl.play();
    
}

function jumpStart(){
    player.vy = -12;
    
}

function jumpEnd(){
    player.vy = 0;
    
}

function setup() {
	stage = app.stage;
	// #1 - Create the `start` scene
    startScene =  new PIXI.Container();
    stage.addChild(startScene);
	
	// #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene)

	// #3 - Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene)
    
	// #4 - Create labels for all 3 scenes
    createLabelsAndButtons();
	
	// #5 - Create ship
	player = new Player();
    player.vx = 0;
    player.vy = 0;
    gameScene.addChild(player);
    
    //Set up Keystrokes
     //Left arrow key `press` method
  leftKey.press = () => {
    //Change the cat's velocity when the key is pressed
    player.vx = -5;
    player.vy = 0;
  };
  
  //Left arrow key `release` method
  leftKey.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!rightKey.isDown) {
      player.vx = 0;
    }
  };

  //Up
  upKey.press = () => {
      if(player.y >= sceneHeight-100){
          jumpStart();
      }
    
  };
  upKey.release = () => {
      jumpEnd();
  };

  //Right
  rightKey.press = () => {
    player.vx = 5;
    player.vy = 0;
  };
  rightKey.release = () => {
    if (!leftKey.isDown) {
      player.vx = 0;
    }
  };

    let tutorial = new Tutorial();
    startScene.addChild(tutorial);
    // #6 - Load Sounds

	// #7 - Load sprite sheet

	// #8 - Start update loop
    app.ticker.add(gameLoop);
}

function loadLevel(){
	//createCircles(levelNum * 5);
    createFedoras(levelNum * 5);
	paused = false;
}

function end(){
    paused = true;
    //circles.forEach(c=> gameScene.removeChild(c));
    //circles = [];
    
    explosions.forEach(e=> gameScene.removeChild(e));
    explosions = [];
    
    gameOverScene.visible = true;
    gameScene.visible = false;
    gameOverScoreLabel.text = "Final Score: " + score;
    
}

function gameLoop(){
	if (paused) return; // keep this commented out for now
	
	// #1 - Calculate "delta time"
    
    if (dt > 1/12) dt=1/12;
	// #2 - Move Ship
	/*let mousePosition = app.renderer.plugins.interaction.mouse.global;
    //ship.position = mousePosition;
	let amt = 6*dt;
    
    let newX = lerp(player.x, mousePosition.x, amt);
    let newY = lerp(player.y, mousePosition.y, amt);
    */
    let w2 = player.width/2;
    let h2 = player.height/2;
    
    player.x += player.vx;
    player.y += player.vy;

    if(player.y < sceneHeight-100){
        player.y-=gravity;
    }
    
    player.x = clamp(player.x, 0+w2, sceneWidth-w2);
    player.y = clamp(player.y, 0+h2, sceneHeight-h2);
    
	// #3 - Move Circles
	/*for (let c of circles){
        c.move(dt);
        
        if (c.x <= c.radius || c.x >= sceneWidth-c.radius){
            c.reflectX();
            c.move(dt);
        
        }
        if (c.y <= c.radius || c.y >= sceneHeight-c.radius){
            c.reflectY();
            c.move(dt);
        
        }
    }*/
    
    for(let f of fedoras)
    {
        f.y += gravity;
    }
	
	// #4 - Move Bullets
	
	// #5 - Check for Collisions
	/*for (let c of circles){
        for(let b of bullets){
            if(rectsIntersect(c,b)){
                fireballSound.play();
                createExplosion(c.x,c.y,64,64);
                gameScene.removeChild(c);
                c.isAlive = false;
                gameScene.removeChild(b);
                b.isAlive = false;
                increaseScoreBy(1);
            }
            
        }
        
        
        if (c.isAlive && rectsIntersect(c,ship)){
            hitSound.play();
            gameScene.removeChild(c);
            c.isAlive = false;
            decreaseLifeBy(1);
        }
    }*/
	
	// #6 - Now do some clean up
    
    //circles = circles.filter(c => c.isAlive);
    
    //explosions = explosions.filter(e=>e.playing);
	
	// #7 - Is game over?
	if (life <= 0){
        end();
        return; // return here so we skip #8 below
    }
	
	// #8 - Load next level
    if (fedoras.length = 0){
        levelNum ++;
        loadLevel();
    }
}