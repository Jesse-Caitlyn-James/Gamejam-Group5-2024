class BattleManager{
    constructor(){
        this.battleSprites = new Group();
        this.battleSprites.collider = "none";
        this.playerSpawn = new this.battleSprites.Sprite(25, windowHeight * 0.2, 50, 50);
        this.enemySpawn = new this.battleSprites.Sprite(windowWidth - 25, windowHeight * 0.2, 50, 50);

        this.buttonGroup = new Group();
        this.buttonGroup.y = windowHeight * 0.375;

        this.unit1Button = new this.buttonGroup.Sprite();
        this.unit1Button.callback = this.spawnUnit1;
        this.unit1Button.x = 100;
        this.unit1Button.w = 100;
        this.unit1Button.text = "Unit1";
    }

    battleUpdate(){
        rect(0, windowHeight * 0.1, windowWidth, windowHeight * 0.2);
        rect(0, windowHeight * 0.35, windowWidth, windowHeight * 0.05);

        this.spriteLogic();

        this.buttonCheck();
    }

    spriteLogic(){
        for(let i = 0; i < this.battleSprites.length; i++){
            let unit = this.battleSprites[i];
            if(unit.team == "player"){
                unit.moveTo(this.enemySpawn, unit.moveSpeed);
            }
        }
    }

    spawnUnit1(){
        let y = random(windowHeight * 0.1, windowHeight * 0.3);
        let unit = new battleManager.battleSprites.Sprite(battleManager.playerSpawn.x, y, 30);
        unit.range = 50;
        unit.team = "player";
        unit.moveSpeed = 0.3;
    }

    buttonCheck(){
        if(mouse.presses()){
            for(let i = 0; i < this.buttonGroup.length; i++){
                let corner1x = this.buttonGroup[i].x - this.buttonGroup[i].w/2;
                let corner1y = this.buttonGroup[i].y - this.buttonGroup[i].h/2;
                let corner2x = this.buttonGroup[i].x + this.buttonGroup[i].w/2;
                let corner2y = this.buttonGroup[i].y + this.buttonGroup[i].h/2;
    
                if(mouse.x > corner1x && mouse.x < corner2x && mouse.y > corner1y && mouse.y < corner2y){
                    this.buttonGroup[i].callback();
                }
            }
        }
    }
}