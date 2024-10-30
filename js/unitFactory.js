class UnitFactory{
    constructor(){
        
    }
    
    makeUnit(type, group = null){
        switch(type){
            case "gatherer":
                this.makeGatherer(group);
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
}