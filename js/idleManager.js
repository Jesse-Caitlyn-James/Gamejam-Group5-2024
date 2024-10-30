class IdleManager{
    constructor(){
        this.resourceGroup = new Group();
        this.resourceGathererGroup = new Group();
        this.gatherTarget = this.createTarget();

        // UI buttons gettin made
        this.gathererButton = new GameButton(110, windowHeight-50, 200, 80, "Gatherer", this.createResourceGatherer);
    }
    
    createTarget(){
        let target = new Sprite();
        target.d = 100;
        target.image = imgTarget;
        target.image.scale = 0.8;
        target.collider = 'none';
        target.picked = false;

        return target;
    }
    
    createResourceGatherer(){
        factory.makeUnit("gatherer", idleManager.resourceGathererGroup);
    }

    createResource(){
        // Works similar to the above - factory code not implemented yet
        // factory.makeUnit("resource", idleManager.resourceGroup);
    }

    checkResources(){
        // Checks conditions for spawning new resources
        // different function cause we can make this more complex later
        if(this.resourceGroup.length < 20){
            this.createResource();
        }
    }
    
    idleUpdate(){
        // Following is the target and gatherer movement code
        this.moveTarget();

        for(let i = 0; i < this.resourceGathererGroup.length; i++){
            this.resourceGathererGroup[i].moveTo(this.gatherTarget, 0.5);
        }

        // Following is the resource creation and handling code
        this.checkResources();
        this.harvestResources();
    }

    moveTarget(){
        if(mouse.pressing()){
            let targetDist = dist(mouse.x, mouse.y, this.gatherTarget.x, this.gatherTarget.y);
            if (targetDist <= 50){
                this.gatherTarget.picked = true;
            }
        }
        else{
            this.gatherTarget.picked = false;
        }

        if(this.gatherTarget.picked){
            this.gatherTarget.x = mouse.x;
            this.gatherTarget.y = mouse.y;
        }
    }

    harvestResources(){
        for(let i = 0; i < this.resourceGroup; i++){
            let resource = this.resourceGroup[i];
            for(let j = 0; j < this.resourceGathererGroup; j++){
                let gatherer = this.resourceGathererGroup[j];
                let gatherDist = dist(resource.x, resource.y, gatherer.x, gatherer.y);
                if(gatherDist < 20){
                    resource.health--;
                    if (resource.health == 0){
                        // Code to add resource to player's resource pool
                        // Or we could make the gatherer hold the resource to take back to base?
                        // I have the code for this^ somewhere
                        // Code to add this resource to removal list
                        // Pretty sure p5 removes immediately so we can't remove it during the loop
                    }
                }
            }
        }
    }
}