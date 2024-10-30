class IdleManager {
    constructor() {
        this.resourceGroup = new Group();
        this.resourceGathererGroup = new Group();
        this.gatherTarget = this.createTarget();

        // Remeber each second is 60 frames so Default: 30 = 1/2 sec, 60 = 1 sec
        this.gatherSpeed = 30;

        // UI buttons gettin made
        this.gathererButton = new GameButton(110, windowHeight - 50, 200, 80, "Gatherer", this.createResourceGatherer);
    }

    createTarget() {
        let target = new Sprite();
        target.d = 100;
        target.image = imgTarget;
        target.image.scale = 0.8;
        target.collider = 'none';
        target.picked = false;

        return target;
    }

    createResourceGatherer() {
        factory.makeUnit("gatherer", idleManager.resourceGathererGroup);
    }

    createResource() {
        factory.makeUnit("resource", idleManager.resourceGroup);
    }

    checkResources() {
        if (this.resourceGroup.length < 20) {
            this.createResource();
        }
    }

    idleUpdate() {
        // Following is the target and gatherer movement code
        this.moveTarget();

        for (let i = 0; i < this.resourceGathererGroup.length; i++) {
            this.resourceGathererGroup[i].moveTo(this.gatherTarget, 0.5);
        }

        // Following is the resource creation and handling code
        this.checkResources();
        this.harvestResources();
    }

    moveTarget() {
        if (mouse.pressing()) {
            let targetDist = dist(mouse.x, mouse.y, this.gatherTarget.x, this.gatherTarget.y);
            if (targetDist <= 50) {
                this.gatherTarget.picked = true;
            }
        }
        else {
            this.gatherTarget.picked = false;
        }

        if (this.gatherTarget.picked) {
            this.gatherTarget.x = mouse.x;
            this.gatherTarget.y = mouse.y;
        }
    }

    harvestResources() {
        if (frameCount % this.gatherSpeed == 0) {
            for (let i = 0; i < this.resourceGroup.length; i++) {
                let resource = this.resourceGroup[i];
                for (let j = 0; j < this.resourceGathererGroup.length; j++) {
                    let gatherer = this.resourceGathererGroup[j];
                    let gatherDist = dist(resource.x, resource.y, gatherer.x, gatherer.y);
                    if (gatherDist < 20) {
                        resource.health--;
                        if (resource.health == 0) {
                            // Code to add resource to player's resource pool
                            // Or we could make the gatherer hold the resource to take back to base?
                            // I have the code for this^ somewhere
                            resource.remove();
                        }
                    }
                }
            }
        }
    }
}