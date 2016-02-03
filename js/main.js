var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.startX = startX;
    this.startY = startY;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = frame % 6;
    var yindex = 0;

    console.log(frame + " " + xindex + " " + yindex);

    // New
    var xindex = this.reverse ? this.frames - this.currentFrame() - 1 :  frame % 6;


    ctx.drawImage(this.spriteSheet,
        (xindex * this.frameWidth) + this.startX,this.startY,  // source from sheet
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth,
        this.frameHeight);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Dude(game, spritesheet) {
    this.forwardWalk = new Animation(spritesheet,0,0, 83, 125, 0.3, 6, true, false);
    this.backWalk = new Animation(spritesheet, 0 ,128,83,125, 0.3, 6, true, false);
    this.x = 0;
    this.y = 400;
    this.game = game;
    this.ctx = game.ctx;
    this.isEnd = false;
}

Dude.prototype.draw = function () {
//    console.log("drawing");
    if(this.isEnd) {

        console.log("Got Here!! :D");
        this.backWalk.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }else {
        this.forwardWalk.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}

Dude.prototype.update = function() {
    if(this.isOffScreen()) {
        this.x-=2;
        this.isEnd = true;
    } else {
        if(this.isEnd) this.x -= 2;
        else this.x +=2
    }
}

Dude.prototype.isOffScreen = function (){
    if(this.x >= this.game.surfaceWidth) return true;
    else if (this.x < 0 - 83){
        this.isEnd = false;
        return false;
    }
}

AM.queueDownload("img/walk.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

//    var img = AM.getAsset("img/$linkEdit.png");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Dude(gameEngine, AM.getAsset("img/walk.png")));

    console.log("All Done!");
});