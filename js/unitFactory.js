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
            unit.image = "Assets/Images/gatherfella.png";
        }
        else{
            unit = new Sprite();
            unit.image = "Assets/Images/gatherfella.png";
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
        return unit;
    }

    makeResources(group){
        let unit;
        if (group != null){
            unit = new group.Sprite();
            unit.image = "Assets/Images/GemGeode.png";
        }
        else{
            unit = new Sprite();
            unit.image = "Assets/Images/GemGeode.png";
        }
        unit.x = random(windowWidth - 30);
        unit.y = -20;
        unit.w = 30;
        unit.h = 30;
        unit.collider = "none";
        unit.health = 10;
        unit.type = 0;
        return unit;
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