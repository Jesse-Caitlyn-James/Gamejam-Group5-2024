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
    }

    makeResources(group){
        let unit;
        if (group != null){
            unit = new group.Sprite();
        }
        else{
            unit = new Sprite();
        }
        unit.x = random(windowWidth);
        unit.y = random(windowHeight-150);
        unit.w = 30;
        unit.h = 30;
        unit.collider = "none";
        unit.health = 20;
    }
}