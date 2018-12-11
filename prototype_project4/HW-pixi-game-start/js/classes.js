class Player extends PIXI.Sprite{
    constructor(x=0,y=sceneHeight-100){
        super(PIXI.loader.resources["images/Figure.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(0.3);
        this.x = x;
        this.y = y;
    }
}

class Fedora extends PIXI.Sprite{
    constructor(x=0, y=sceneHeight-600){
        super(PIXI.loader.resources["images/Fedora.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(0.3);
        this.x = x;
        this.y = y;
        
        this.isFalling = true;
    }
}
    
class Tutorial extends PIXI.Sprite{
    constructor(x=300, y=sceneHeight-300){
        super(PIXI.loader.resources["images/tutorial.png"].texture);
        this.anchor.set(.5,.5);
        this.scale.set(0.3);
        this.x = x;
        this.y = y;
    }
}
    

    
   /* reflectX(){
        this.fwd.x *= -1;
    }
    
    reflectY(){
        this.fwd.y *= -1;
    }*/

