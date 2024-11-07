class BattleManager{
    constructor(){
        this.battleSprites = new Group();
        this.battleSprites.collider = "none";
        this.playerSpawn = new this.battleSprites.Sprite(25, windowHeight * 0.2, 50, 50);
        this.playerSpawn.team = "player";
        this.playerSpawn.cash = 100;
        this.playerSpawn.health = 100;
        this.enemySpawn = new this.battleSprites.Sprite(windowWidth - 25, windowHeight * 0.2, 50, 50);
        this.enemySpawn.team = "enemy";
        this.enemySpawn.cash = 100;
        this.enemySpawn.health = 100;

        this.buttonGroup = new Group();
        this.buttonGroup.y = windowHeight * 0.375;

        // Yes i could make this simpler, fite me
        this.unit1Button = new this.buttonGroup.Sprite();
        this.unit1Button.callback = this.spawnUnit1;
        this.unit1Button.x = 100;
        this.unit1Button.w = 100;
        this.unit1Button.text = "Unit1: 10";
        this.battleSprites.push(this.unit1Button);

        this.unit2Button = new this.buttonGroup.Sprite();
        this.unit2Button.callback = this.spawnUnit2;
        this.unit2Button.x = 250;
        this.unit2Button.w = 100;
        this.unit2Button.text = "Unit2: 25";
        this.battleSprites.push(this.unit2Button);

        this.unit3Button = new this.buttonGroup.Sprite();
        this.unit3Button.callback = this.spawnUnit3;
        this.unit3Button.x = 400;
        this.unit3Button.w = 100;
        this.unit3Button.text = "Unit3: 50";
        this.battleSprites.push(this.unit3Button);
    }

    battleUpdate(){
        rect(0, windowHeight * 0.1, windowWidth, windowHeight * 0.2);
        rect(0, windowHeight * 0.35, windowWidth, windowHeight * 0.05);
        text("$" + this.playerSpawn.cash, 0, windowHeight * 0.35);

        this.spriteLogic();
        this.enemyLogic();

        this.buttonCheck();
    }

    spriteLogic(){
        for(let i = 0; i < this.battleSprites.length; i++){
            let unit = this.battleSprites[i];
            if(unit.callback != undefined){
                continue;
            }
            
            // Fight Logic
            for(let j = 0; j < this.battleSprites.length; j++){
                let otherUnit = this.battleSprites[j];
                if(otherUnit.callback != undefined){
                    continue;
                }

                let fightDist = dist(unit.x, unit.y, otherUnit.x, otherUnit.y);
                if(fightDist <= unit.range && otherUnit.team != unit.team && unit.target == null){

                    unit.target = otherUnit;
                }

                if(unit.target != null){
                    if(unit.target.health > 0){
                        if(frameCount % unit.cooldown == 0){
                            this.createProjectile(unit, otherUnit);
                            unit.vel.x = 0;
                            unit.vel.y = 0;
                        }
                    } else {
                        unit.target = null;
                    }
                } else {
                    // Movement logic, will need a check in them for if enemy is in range
                    if(unit.team == "player" && unit != this.playerSpawn){
                        unit.moveTo(this.enemySpawn, unit.moveSpeed);
                    }
                    if(unit.team == "enemy" && unit != this.enemySpawn){
                        unit.moveTo(this.playerSpawn, unit.moveSpeed);
                    }
                }
            }
            
            if(unit.health <= 0){
                unit.remove();
            }
        }
    }

    enemyLogic(){

    }

    // Generic
    spawnUnit1(team = "player"){
        if(team == "player"){
            if(battleManager.playerSpawn.cash >= 10){
                battleManager.playerSpawn.cash -= 10;
            } else {
                return;
            }
        } else {
            if(battleManager.enemySpawn.cash >= 10){
                battleManager.enemySpawn.cash -= 10;
            } else {
                return;
            }
        }
        let y = random(windowHeight * 0.1, windowHeight * 0.3);
        let unit = new battleManager.battleSprites.Sprite(battleManager.playerSpawn.x, y, 25);
        unit.range = 50;
        unit.team = team;
        unit.moveSpeed = 0.3;
        unit.health = 25;
        unit.damage = 5;
        unit.cooldown = 90;
        unit.target = null;
    }

    // Ranged
    spawnUnit2(team = "player"){
        if(team == "player"){
            if(battleManager.playerSpawn.cash >= 25){
                battleManager.playerSpawn.cash -= 25;
            } else {
                return;
            }
        } else {
            if(battleManager.enemySpawn.cash >= 25){
                battleManager.enemySpawn.cash -= 25;
            } else {
                return;
            }
        }
        let y = random(windowHeight * 0.1, windowHeight * 0.3);
        let unit = new battleManager.battleSprites.Sprite(battleManager.playerSpawn.x, y, 10);
        unit.range = 200;
        unit.team = team;
        unit.moveSpeed = 0.5;
        unit.health = 15;
        unit.damage = 15;
        unit.cooldown = 180;
        unit.target = null;
    }

    // Tank
    spawnUnit3(team = "player"){
        if(team == "player"){
            if(battleManager.playerSpawn.cash >= 50){
                battleManager.playerSpawn.cash -= 50;
            } else {
                return;
            }
        } else {
            if(battleManager.enemySpawn.cash >= 50){
                battleManager.enemySpawn.cash -= 50;
            } else {
                return;
            }
        }
        let y = random(windowHeight * 0.1, windowHeight * 0.3);
        let unit = new battleManager.battleSprites.Sprite(battleManager.playerSpawn.x, y, 40);
        unit.range = 100;
        unit.team = team;
        unit.moveSpeed = 0.1;
        unit.health = 50;
        unit.damage = 10;
        unit.cooldown = 120;
        unit.target = null;
    }

    createProjectile(parent, target){

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