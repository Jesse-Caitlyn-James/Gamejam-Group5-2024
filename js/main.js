let factory;
let idleManager;
let menuManager;
let battleManager = null;

let buttonGroup;

let darkModeButton;
let gameStateButton;

let sysColour = 10;
let gameSpeed = 30;
let gameState = 2;

// Preload Resources


function preload(){
    
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    
    buttonGroup = new Group();

    factory = new UnitFactory();
    idleManager = new IdleManager();
    menuManager = new MenuManager();
    
    
    darkModeButton = new GameButton(windowWidth - 50, windowHeight - 50, 40, 40, "🌕", darkModeSwitch);
    darkModeButton.sprite.textSize = 30;
    gameStateButton = new GameButton(windowWidth - 100, windowHeight - 50, 40, 40, gameState, gameStateSwitch);
}

function draw(){
    clear();
    background(sysColour);
    fill(sysColour+50);

    // *REMEMBER* We are making an idle game, this should be called NO-MATTER what - probably
    idleManager.idleUpdate();
    
    switch (gameState){
        case 0:
            menuManager.menuUpdate(sysColour);
            menuManager.menuSprites.visible = true;
            idleManager.idleSprites.visible = false;
            idleManager.idleSprites.overlaps(allSprites);

            if (battleManager != null){
                battleManager.battleSprites.remove();
            }
            battleManager = null;
            break;
        case 1:
            idleManager.idleSprites.visible = true;
            menuManager.menuSprites.visible = false;
            menuManager.menuSprites.overlaps(allSprites);
            
            if (battleManager != null){
                battleManager.battleSprites.remove();
            }
            battleManager = null;
            break;
        case 2:
            // We could just rebuild the whole battle class on every event
            if (battleManager == null){
                battleManager = new BattleManager();
            }

            battleManager.battleUpdate(sysColour);
            battleManager.battleSprites.visible = true;

            menuManager.menuSprites.visible = false;
            menuManager.menuSprites.overlaps(allSprites);
            idleManager.idleSprites.visible = false;
            idleManager.idleSprites.overlaps(allSprites);
            break;
        }
    
    buttonCheck();    
    rect(0, windowHeight-99, windowWidth, 100);

    
    textSize(50);
    fill(255);
    text("Resources: " + idleManager.resources[0], 20, 50);
    text("CoolBucks: " + idleManager.resources[1], 400, 50);
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

function gameStateSwitch(){
    gameState++;
    
    // Change the > #num to add more pages - yes, jank, i know
    if (gameState > 2){
        gameState = 0;
    }

    gameStateButton.sprite.text = gameState;
    menuManager.pageState = 0;
}
// Look into https://p5js.org/examples/advanced-canvas-rendering-multiple-canvases/ for UI page