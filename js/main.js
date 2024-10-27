
/**
 * 
 * @param {*} x X Position
 * @param {*} y Y Position
 * @param {*} w Button Width
 * @param {*} h Button Height
 * @param {*} callback Callback Function for Click Event
*/    
class gameButton {
    constructor(x,y,w,h,callback = "hi"){
        this.sprite = new buttonGroup.Sprite();
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.w = w;
        this.sprite.h = h;
        this.sprite.collider = "none";
        this.sprite.gameButton = this;
        this.callback = callback;
    }
}


let buttonGroup


function setup(){
    createCanvas(windowWidth, windowHeight);
    buttonGroup = new Group();
    test = new gameButton(windowWidth/2, windowHeight/2, 100, 100);
}


function draw(){
    background(220);

    for(let i = 0; i < buttonGroup.length; i++){
        if(mouse.presses()){
            let corner1x = buttonGroup[i].x - buttonGroup[i].w/2;
            let corner1y = buttonGroup[i].y - buttonGroup[i].h/2;
            let corner2x = buttonGroup[i].x + buttonGroup[i].w/2;
            let corner2y = buttonGroup[i].y + buttonGroup[i].h/2;

            new Sprite(corner1x, corner1y, 10, 'pentagon');
            new Sprite(corner2x, corner2y, 10, 'pentagon');
        }
    }
}
