class IdleManager {
    constructor() {
        this.resourceGroup = new Group();
        this.resourceGathererGroup = new Group();
        
        this.base = factory.makeBase();
        
        this.startUp = false;
        // Remeber each second is 60 frames so Default: 30 = 1/2 sec, 60 = 1 sec
        this.gatherSpeed = 30;
        this.resources = [0];
        this.resourceLimit = 20;
        this.spawnRate = 300;
        
        // UI buttons gettin made
        this.gathererButton = new GameButton(110, windowHeight - 50, 200, 80, "Gatherer", this.createResourceGatherer);

    }
    
    createResourceGatherer() {
        factory.makeUnit("gatherer", idleManager.resourceGathererGroup);
    }
    
    createResource() {
        factory.makeUnit("resource", idleManager.resourceGroup);
    }
    
    checkResources() {
        if(!this.startUp){
            this.startUp = true;
            for (let i = 0; i < this.resourceLimit; i++) {
                this.createResource();
                this.resourceGroup[i].y = random(windowHeight - 150);
            }
        }

        if (this.resourceGroup.length < this.resourceLimit){
            if (frameCount % this.spawnRate == 0){
                this.createResource();
            }
        }
        // Spawn logic here
    }

    idleUpdate() {
        // Following is the target and gatherer movement code
        this.moveGatherers();
        this.moveWorld();

        // Following is the resource creation and handling code
        this.checkResources();
        this.harvestResources();
    }

    moveGatherers() {
        for(let i = 0; i < this.resourceGathererGroup.length; i++){
            let gatherer = this.resourceGathererGroup[i];

            this.findTarget(gatherer);
            
            if(gatherer.target == this.base){
                if(gatherer.collides(this.base)){
                    this.resources[gatherer.cargo]++;
                    gatherer.cargo = null;
                    gatherer.mined = 0;
                }
            }
            
            if (gatherer.oldTarget != null && gatherer.oldTarget.health <= 0){
                gatherer.target = null;
                this.findTarget(gatherer);
            } else {
                gatherer.target = gatherer.oldTarget;
            }

            gatherer.moveTowards(gatherer.target, 0.01);
            gatherer.rotation = gatherer.direction;
        }
    }

    findTarget(gatherer){
        if(gatherer.target == null || gatherer.cargo != null){
            if(gatherer.cargo != null){
                gatherer.target = this.base;
            }else{
                let resourceList = [];
                for (let j = 0; j < this.resourceGroup.length; j++){
                    if (this.resourceGroup[j].y > 0){
                        resourceList.push(this.resourceGroup[j]);
                    }
                }
                if (resourceList.length > 0){
                    gatherer.target = resourceList[Math.floor(random(resourceList.length))];
                    gatherer.oldTarget = gatherer.target;
                } else {
                    // gatherer afk targeting - i dunno how this'll work so ??
                }
            }
        }
    }

    moveWorld(){
        if (frameCount % 30 == 0){
            this.resourceGroup.vel.y = this.base.travelSpeed;
        }

        for (let i = 0; i < this.resourceGroup.length; i++){
            let resource = this.resourceGroup[i];
            if(resource.y > windowHeight - 100 - resource.h/2){
                resource.remove();
            }

            if(resource.overlaps(this.base)){
                resource.remove();
            }
        }

        for (let i = 0; i < this.resourceGathererGroup.length; i++){
            if(this.resourceGathererGroup[i].y > windowHeight - 100 - this.resourceGathererGroup[i].h/2){
                this.resourceGathererGroup[i].target = null;
            }
        }
    }

    harvestResources() {
        this.clickHarvest();

        if (frameCount % this.gatherSpeed == 0) {
            for (let i = 0; i < this.resourceGroup.length; i++) {
                let resource = this.resourceGroup[i];
                for (let j = 0; j < this.resourceGathererGroup.length; j++) {
                    let gatherer = this.resourceGathererGroup[j];
                    let gatherDist = dist(resource.x, resource.y, gatherer.x, gatherer.y);

                    if (gatherDist < resource.w + 20 && gatherer.target == resource) {
                        
                        let laser = new Sprite([[gatherer.x, gatherer.y], [random(resource.x-10, resource.x+10), random(resource.y-10, resource.y+10)]]);
                        laser.overlaps(allSprites);
                        laser.life = 10;
                        
                        resource.health--;
                        gatherer.mined++;
                        
                        if (gatherer.mined >= gatherer.mineEfficiency){
                            gatherer.cargo = resource.type;
                        }

                        if (resource.health == 0) {
                            resource.life = 0;
                        }
                    }
                } 
            }
        }
    }

    clickHarvest(){
        if(mouse.presses()){
            for(let i = 0; i < this.resourceGroup.length; i++){
                let resource = this.resourceGroup[i];
                if(mouse.x > resource.x - resource.w/2 && mouse.x < resource.x + resource.w/2 && mouse.y > resource.y - resource.h/2 && mouse.y < resource.y + resource.h/2){
                    resource.health--;

                    let laser = new Sprite([[this.base.x, this.base.y], [random(mouse.x-10, mouse.x+10), random(mouse.y-10, mouse.y+10)]]);
                    laser.overlaps(allSprites);
                    laser.life = 10;

                    if(resource.health == 0){
                        this.resources[resource.type]++;
                        resource.remove();
                    }
                }
            }
        }
    }
}