let buttonGroup;

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
}

function draw(){
    clear();
    background(220);

    // ToolBar
    rect(0, windowHeight-99, windowWidth, 100);

    idleManager.idleUpdate();

    buttonCheck();    
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