class UnitFactory{
    constructor(){
        
    }
    
    makeUnit(type, group = null){
        let unit;
        
        switch(type){
            case "gatherer":
                unit = this.makeGatherer(group);
                return unit;
            case "resource":
                unit = this.makeResources(group);
                return unit;
            }
    }
    
    makeGatherer(group){
        let unit;
        if (group != null){
            unit = new group.Sprite();
            unit.image = gathererImg;
        }
        else{
            unit = new Sprite();
            unit.image = gathererImg;
        }
        unit.x = windowWidth/2;
        unit.y = windowHeight/2;
        unit.w = 10;
        unit.h = 10;
        unit.scale = 3;
        unit.holdingResource = false;
        unit.cargo = null;
        unit.target = null;
        unit.oldTarget = null;
        unit.moveSpeed = 0.1;
        unit.mined = 0;
        unit.mineEfficiency = 5;
        return unit;
    }

    makeResources(group, health){
        let unit;
        if (group != null){
            unit = new group.Sprite();
            unit.image = gemImg;
        }
        else{
            unit = new Sprite();
            unit.image = gemImg;
        }
        unit.x = random(windowWidth - 30);
        unit.y = -20;
        unit.w = 10;
        unit.h = 10;
        unit.scale = 5;
        unit.collider = "none";
        unit.health = health;
        unit.type = 0;
        unit.debug = true;
        return unit;
    }

    makeBase(){
        let unit = new Sprite();
        unit.image = baseImg;
        unit.x = windowWidth/2;
        unit.y = windowHeight/2;
        unit.d = 50;
        unit.scale = 4;
        unit.collider = "static";
        unit.color = "grey";
        unit.travelSpeed = 0.05;
        return unit;
    }
}