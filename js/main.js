let buttonGroup;

let darkModeButton;
let sysColour = 10;
let gameSpeed = 30;

// Preload Resources
let imgTarget;

function preload(){
    imgTarget = loadImage('../Assets/Images/target.png');
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    buttonGroup = new Group();

    factory = new UnitFactory();
    idleManager = new IdleManager();
    
    darkModeButton = new GameButton(windowWidth - 50, windowHeight - 50, 40, 40, "🌕", darkModeSwitch);
    darkModeButton.sprite.textSize = 30;
}

function draw(){
    clear();
    background(sysColour);
    fill(sysColour+50);

    // ToolBar
    
    idleManager.idleUpdate();
    
    buttonCheck();    
    rect(0, windowHeight-99, windowWidth, 100);
}

function buttonCheck(){
    if(mouse.presses()){
        for(let i = 0; i < buttonGroup.length; i++){
            let corner1x = buttonGroup[i].x - buttonGroup[i].w/2;
            let corner1y = buttonGroup[i].y - buttonGroup[i].h/2;
            let corner2x = buttonGroup[i].x + buttonGroup[i].w/2;
            let corner2y = buttonGroup[i].y + buttonGroup[i].h/2;

            if(mouse.x > corner1x && mouse.x < corner2x && mouse.y > corner1y && mouse.y < corner2y){
                buttonGroup[i].gameButton.callback();
            }
        }
    }
}

function darkModeSwitch(){
    if (sysColour == 220){
        sysColour = 10;
        darkModeButton.sprite.text = "☀";
    } else {
        sysColour = 220;
        darkModeButton.sprite.text = "🌕";
    }
}