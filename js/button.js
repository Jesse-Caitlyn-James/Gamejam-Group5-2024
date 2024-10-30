/**
 * 
 * @param {*} x X Position
 * @param {*} y Y Position
 * @param {*} w Button Width
 * @param {*} h Button Height
 * @param {*} callback Callback Function for Click Event
*/    
class GameButton {
    constructor(x,y,w,h,text = "",callback = console.log){
        this.sprite = new buttonGroup.Sprite();
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.w = w;
        this.sprite.h = h;
        this.sprite.text = text;
        this.sprite.textSize = w/this.sprite.text.length;
        this.sprite.collider = "none";
        this.sprite.gameButton = this;
        this.callback = callback;
    }
}