class UnitFactory{
    constructor(){
        
    }
    
    makeUnit(type, group = null){
        switch(type){
            case "gatherer":
                this.makeGatherer(group);
                break;
            case "resource":
                this.makeResources(group);
                break;
            }
    }
    
    makeGatherer(group){
        let unit;
        if (group != null){
            unit = new group.Sprite();
        }
        else{
            unit = new Sprite();
        }
        unit.x = windowWidth/2;
        unit.y = windowHeight/2;
        unit.w = 10;
        unit.h = 10;
        unit.holdingResource = false;
        unit.cargo = null;
        unit.target = null;
        unit.oldTarget = null;
        unit.moveSpeed = 0.1;
        unit.mined = 0;
        unit.mineEfficiency = 5;
    }

    makeResources(group){
        let unit;
        if (group != null){
            unit = new group.Sprite();
        }
        else{
            unit = new Sprite();
        }
        unit.x = random(windowWidth - 30);
        unit.y = -20;
        unit.w = 30;
        unit.h = 30;
        unit.collider = "none";
        unit.health = 10;
        unit.type = 0;
    }

    makeBase(){
        let unit = new Sprite();
        unit.x = windowWidth/2;
        unit.y = windowHeight/2;
        unit.d = 100;
        unit.collider = "static";
        unit.color = "grey";
        unit.travelSpeed = 0.05;
        return unit;
    }
}