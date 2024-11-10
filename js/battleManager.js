class BattleManager{
    constructor(){
        this.battleSprites = new Group();
        this.battleSprites.collider = "none";
        this.projectiles = new Group();

        this.playerSpawn = new this.battleSprites.Sprite(25, windowHeight * 0.2, 50, 50);
        this.playerSpawn.team = "player";
        this.playerSpawn.cash = 200;
        this.playerSpawn.health = 100;
        this.playerSpawn.image = baseImg;
        this.playerSpawn.scale = 3;

        this.enemySpawn = new this.battleSprites.Sprite(windowWidth - 25, windowHeight * 0.2, 50, 50);
        this.enemySpawn.team = "enemy";
        this.enemySpawn.cash = 100;
        this.enemySpawn.health = 100;
        this.enemySpawn.image = enemyImg;
        this.enemySpawn.scale = 3;

        this.buttonGroup = new Group();
        this.buttonGroup.y = windowHeight * 0.375;

        // Yes i could make this simpler, fite me
        this.unit1Button = new this.buttonGroup.Sprite();
        this.unit1Button.callback = this.spawnUnit1;
        this.unit1Button.x = 100;
        this.unit1Button.w = 100;
        this.unit1Button.text = "Unit1: 10";
        this.unit1Button.textSize = 20;
        this.unit1Button.collider = "none";
        this.battleSprites.push(this.unit1Button);

        this.unit2Button = new this.buttonGroup.Sprite();
        this.unit2Button.callback = this.spawnUnit2;
        this.unit2Button.x = 250;
        this.unit2Button.w = 100;
        this.unit2Button.text = "Unit2: 25";
        this.unit2Button.textSize = 20;
        this.unit2Button.collider = "none";
        this.battleSprites.push(this.unit2Button);

        this.unit3Button = new this.buttonGroup.Sprite();
        this.unit3Button.callback = this.spawnUnit3;
        this.unit3Button.x = 400;
        this.unit3Button.w = 100;
        this.unit3Button.text = "Unit3: 50";
        this.unit3Button.textSize = 20;
        this.unit3Button.collider = "none";
        this.battleSprites.push(this.unit3Button);
    }

    battleUpdate(){
        rect(0, windowHeight * 0.1, windowWidth, windowHeight * 0.2);
        rect(0, windowHeight * 0.35, windowWidth, windowHeight * 0.05);
        text("$" + this.playerSpawn.cash, 0, windowHeight * 0.32);

        if(frameCount % 60 == 0){
            this.playerSpawn.cash++;
            this.enemySpawn.cash++;
        }

        this.spriteLogic();
        this.projectileHandling();
        if(frameCount % 60 == 0){
            this.enemyLogic();
        }

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
                        if(unit.fireTime >= unit.cooldown && unit.target == otherUnit){
                            this.createProjectile(unit, otherUnit);
                            unit.fireTime = 0;
                        }
                        unit.vel.x = 0;
                        unit.vel.y = 0;
                    } else {
                        unit.target = null;
                    }
                } else {
                    // Movement logic, will need a check in them for if enemy is in range
                    if(unit.team == "player" && unit != this.playerSpawn){
                        unit.moveTo(this.enemySpawn, unit.moveSpeed);
                        unit.rotation = unit.direction + 90;

                    }
                    if(unit.team == "enemy" && unit != this.enemySpawn){
                        unit.moveTo(this.playerSpawn, unit.moveSpeed);
                        unit.rotation = unit.direction + 90;
                    }
                }
            }
            
            if(unit.health <= 0){
                if(unit.team == "player"){
                    this.enemySpawn.cash += 5;
                } else {
                    this.playerSpawn.cash += 5;
                }
                
                if(unit == this.playerSpawn){
                    gameState = 0;
                    gameStateButton.sprite.text = "Battle";
                }
                
                if(unit == this.enemySpawn){
                    idleManager.resources[1] += 50;
                    idleManager.resources[0] += 50;
                    gameState = 0;
                    gameStateButton.sprite.text = "Battle";
                }
                
                unit.remove();
            }
            unit.fireTime++;
        }
    }

    enemyLogic(){
        let enemy1 = 0;
        let enemy2 = 0;
        let enemy3 = 0;
        for(let i = 0; i < this.battleSprites.length; i++){
            let unit = this.battleSprites[i];
            if(unit.team == "enemy"){
                switch(unit.range){
                    case 75:
                        enemy1++;
                        break;
                    case 200:
                        enemy2++;
                        break;
                    case 100:
                        enemy3++;
                        break;
                }
            }
        }

        if(enemy1 < 3){
            this.spawnUnit1("enemy");
        } else if(enemy2 < 2) {
            this.spawnUnit2("enemy");
        } else if(enemy1 < 6) {
            this.spawnUnit1("enemy");
        } else {
            this.spawnUnit3("enemy");
        }
    }

    projectileHandling(){
        this.projectiles.overlaps(this.projectiles);
        for(let i = 0; i < this.projectiles.length; i++){
            let projectile = this.projectiles[i];
            for(let j = 0; j < this.battleSprites.length; j++){
                let unit = this.battleSprites[j];
                if(unit.callback != undefined || unit.team == projectile.team){
                    continue;
                }

                if(projectile.overlaps(unit)){
                    unit.health -= projectile.damage;
                    projectile.remove();
                }
            }
        }
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
        let unit ;
        if(team == "player"){
        unit = new battleManager.battleSprites.Sprite(battleManager.playerSpawn.x, y, 25);
        } else {
            unit = new battleManager.battleSprites.Sprite(battleManager.enemySpawn.x, y, 25);
        }
        unit.range = 75;
        unit.team = team;
        unit.moveSpeed = 0.9;
        unit.health = 25;
        unit.damage = 5;
        unit.cooldown = 90;
        unit.target = null;
        unit.image = gathererImg;
        unit.scale = 2;
        unit.fireTime = 0;
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
        let unit ;
        if(team == "player"){
            unit = new battleManager.battleSprites.Sprite(battleManager.playerSpawn.x, y, 10);
        } else {
            unit = new battleManager.battleSprites.Sprite(battleManager.enemySpawn.x, y, 10);
        }
        unit.range = 200;
        unit.team = team;
        unit.moveSpeed = 1.5;
        unit.health = 15;
        unit.damage = 15;
        unit.cooldown = 180;
        unit.target = null;
        unit.image = gathererImg;
        unit.scale = 1.5;
        unit.fireTime = 0;
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
        let unit ;
        if(team == "player"){
            unit = new battleManager.battleSprites.Sprite(battleManager.playerSpawn.x, y, 50);
        } else {
            unit = new battleManager.battleSprites.Sprite(battleManager.enemySpawn.x, y, 50);
        }
        unit.range = 100;
        unit.team = team;
        unit.moveSpeed = 0.3;
        unit.health = 50;
        unit.damage = 10;
        unit.cooldown = 120;
        unit.target = null;
        unit.image = gathererImg;
        unit.scale = 3;
        unit.fireTime = 0;
    }

    createProjectile(parent, target){
        let projectile = new this.projectiles.Sprite(parent.x, parent.y);
        projectile.d = 5;
        projectile.life = 60;
        projectile.damage = parent.damage;
        projectile.team = parent.team;
        projectile.moveTowards(target.x + random(), target.y, 0.1);
        projectile.rotation = projectile.direction;
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