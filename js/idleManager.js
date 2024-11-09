class IdleManager {
    constructor(bgImg) {
        this.shopManager = new ShopManager();

        this.idleSprites = new Group();
        this.resourceGroup = new Group();
        this.resourceGathererGroup = new Group();

        this.base = factory.makeBase();
        this.idleSprites.push(this.base);

        this.startUp = false;
        // Remeber each second is 60 frames so Default: 30 = 1/2 sec, 60 = 1 sec
        this.gatherSpeed = 30;
        this.unitSpeed = 0.01;
        this.resourceLimit = 20;
        this.resourceHealth = 10;

        this.resources = [10, 0];
        this.spawnRate = 300;

        this.gathererCost = 0;
        this.upgradeCosts = [10, 10, 10, 10, 10];

        this.bgPos = -100;
        this.bgImg = bgImg;

        // UI buttons gettin made
        this.gathererButton = new GameButton(110, windowHeight - 50, 200, 80, "Gatherer: OIL$" + this.gathererCost, this.createResourceGatherer);
        this.gathererButton.sprite.textSize = 20;
        this.upgradeManager = new UpgradeManager(upgrades)
    }

    createResourceGatherer() {
        if (idleManager.resources[1] >= idleManager.gathererCost) {
            idleManager.resources[1] -= idleManager.gathererCost;
            let unit = factory.makeUnit("gatherer", idleManager.resourceGathererGroup);
            idleManager.idleSprites.push(unit);
            idleManager.gathererCost += 10;
            idleManager.gathererButton.sprite.text = "Gatherer: OIL$" + idleManager.gathererCost;
        }
    }

    createResource() {
        let unit = factory.makeUnit("resource", idleManager.resourceGroup);
        unit.health = this.resourceHealth;
        this.idleSprites.push(unit);
    }

    checkResources() {
        if (!this.startUp) {
            this.startUp = true;
            for (let i = 0; i < this.resourceLimit; i++) {
                this.createResource();
                this.resourceGroup[i].y = random(windowHeight - 150);
            }
        }

        if (this.resourceGroup.length < this.resourceLimit) {
            if (frameCount % this.spawnRate == 0) {
                this.createResource();
            }
        }
    }

    idleUpdate() {
        this.runBackground();

        // Following is the target and gatherer movement code
        this.moveGatherers();
        this.moveWorld();

        // Following is the resource creation and handling code
        this.checkResources();
        this.harvestResources();

        this.shopManager.shopUpdate();
    }

    moveGatherers() {
        for (let i = 0; i < this.resourceGathererGroup.length; i++) {
            let gatherer = this.resourceGathererGroup[i];

            this.findTarget(gatherer);

            if (gatherer.target == this.base) {
                if (gatherer.collides(this.base)) {
                    this.resources[gatherer.cargo]++;
                    gatherer.cargo = null;
                    gatherer.mined = 0;
                }
            }

            if (gatherer.oldTarget != null && gatherer.oldTarget.health <= 0) {
                gatherer.target = null;
                this.findTarget(gatherer);
            } else {
                gatherer.target = gatherer.oldTarget;
            }

            gatherer.moveTowards(gatherer.target, this.unitSpeed);
            gatherer.rotation = gatherer.direction + 90;
        }
    }

    findTarget(gatherer) {
        if (gatherer.target == null || gatherer.cargo != null) {
            if (gatherer.cargo != null) {
                gatherer.target = this.base;
            } else {
                let resourceList = [];
                for (let j = 0; j < this.resourceGroup.length; j++) {
                    if (this.resourceGroup[j].y > 0) {
                        resourceList.push(this.resourceGroup[j]);
                    }
                }
                if (resourceList.length > 0) {
                    gatherer.target = resourceList[Math.floor(random(resourceList.length))];
                    gatherer.oldTarget = gatherer.target;
                } else {
                    // gatherer afk targeting - i dunno how this'll work so ??
                }
            }
        }
    }

    moveWorld() {
        if (frameCount % 30 == 0) {
            this.resourceGroup.vel.y = this.base.travelSpeed;
        }

        for (let i = 0; i < this.resourceGroup.length; i++) {
            let resource = this.resourceGroup[i];
            if (resource.y > windowHeight - 100 - resource.h / 2) {
                resource.remove();
            }

            if (resource.overlaps(this.base)) {
                resource.remove();
            }
        }

        for (let i = 0; i < this.resourceGathererGroup.length; i++) {
            if (this.resourceGathererGroup[i].y > windowHeight - 100 - this.resourceGathererGroup[i].h / 2) {
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

                        let laser = new Sprite([[gatherer.x, gatherer.y], [random(resource.x - 10, resource.x + 10), random(resource.y - 10, resource.y + 10)]]);
                        this.idleSprites.push(laser);
                        laser.overlaps(allSprites);
                        laser.life = 10;

                        resource.health--;
                        gatherer.mined++;

                        if (gatherer.mined >= gatherer.mineEfficiency) {
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

    clickHarvest() {
        if (mouse.presses()) {
            for (let i = 0; i < this.resourceGroup.length; i++) {
                let resource = this.resourceGroup[i];
                if (mouse.x > resource.x - resource.w / 2 && mouse.x < resource.x + resource.w / 2 && mouse.y > resource.y - resource.h / 2 && mouse.y < resource.y + resource.h / 2) {
                    resource.health--;

                    let laser = new Sprite([[this.base.x, this.base.y], [random(mouse.x - 10, mouse.x + 10), random(mouse.y - 10, mouse.y + 10)]]);
                    this.idleSprites.push(laser);
                    laser.overlaps(allSprites);
                    laser.life = 10;

                    if (resource.health % 5 == 0) {
                        this.resources[resource.type]++;
                    }
                    if (resource.health == 0){
                        resource.remove();
                    }
                }
            }
        }
    }

    runBackground() {
        for (let i = 0; i < windowWidth; i += 46) {
            for (let j = this.bgPos; j < windowHeight; j += 46) {
                image(this.bgImg, i, j);
            }
        }

        this.bgPos += this.base.travelSpeed;
        if (this.bgPos >= 0) {
            this.bgPos = -50;
        }
    }

    unitUpgrade(type) {
        switch (type) {
            case 0:
                if (this.upgradeCosts[0] <= this.resources[0]) {
                    this.resources[0] -= this.upgradeCosts[0];
                    this.upgradeCosts[0] += 10;
                    this.upgradeManager.buttonGroup[0].cost = this.upgradeCosts[0];
                    if (this.gatherSpeed > 0) {
                        this.gatherSpeed--;
                    }
                }
                break;
            case 1:
                if (this.upgradeCosts[1] <= this.resources[0]) {
                    this.resources[0] -= this.upgradeCosts[1];
                    this.upgradeCosts[1] += 10;
                    this.upgradeManager.buttonGroup[1].cost = this.upgradeCosts[1];
                    this.unitSpeed += 0.001;
                }
                break;
            case 2:
                if (this.upgradeCosts[2] <= this.resources[0]) {
                    this.resources[0] -= this.upgradeCosts[2];
                    this.upgradeCosts[2] += 10;
                    this.upgradeManager.buttonGroup[2].cost = this.upgradeCosts[2];
                    this.base.travelSpeed += 0.005;
                    if(this.spawnRate > 0){
                        this.spawnRate -= 5;
                    }
                }
                break;
            case 3:
                if (this.upgradeCosts[3] <= this.resources[0]) {
                    this.resources[0] -= this.upgradeCosts[3];
                    this.upgradeCosts[3] += 10;
                    this.upgradeManager.buttonGroup[3].cost = this.upgradeCosts[3];
                    this.resourceLimit++;
                }
                break;
            case 4:
                if (this.upgradeCosts[4] <= this.resources[0]) {
                    this.resources[0] -= this.upgradeCosts[4];
                    this.upgradeCosts[4] += 10;
                    this.upgradeManager.buttonGroup[4].cost = this.upgradeCosts[4];
                    this.resourceHealth += 5;
                }
                break;

        }
    }
}

class UpgradeManager {
    constructor(upgrades) {
        this.upgrades = upgrades;
        this.buttonGroup = new Group();
        this.state = 0;
        this.openBtn = new GameButton(320, windowHeight - 50, 200, 80, "Upgrades", () => {
            if (this.state >= 1) {
                this.state = 0;
                this.buttonGroup.visible = false;
            } else {
                this.state = 1;
                this.buttonGroup.visible = true;
            }
        })
        this.drawUpgradeList()
    }

    draw() {
        switch (this.state) {
            case 0:
                break;
            case 1:
                this.drawBaseWindow()
                break;
        }

        for (let i = 0; i < this.buttonGroup.length; i++) {
            let btn = this.buttonGroup[i];
            btn.text = this.upgrades[i].name + " Min$" + btn.cost;
        }
    }

    drawBaseWindow() {
        fill(255, 255, 255, 180)
        rect(0, windowHeight - 200, windowWidth, 100)
    }

    drawUpgradeList() {
        let btnW = 150
        let btnH = 50
        let x = -100;
        let y = windowHeight - 150
        textAlign(LEFT, TOP);

        for (let i = 0; i < this.upgrades.length; i++) {
            let btn = new GameButton(x += btnW + 50, y, btnW, btnH, this.upgrades[i].name + " Min$10", this.upgrades[i].callback);
            btn.sprite.cost = 10;
            btn.sprite.fill = 200;
            btn.sprite.textSize = 15;
            btn.sprite.visible = false;
            this.buttonGroup.push(btn.sprite);
        }
        fill(sysColour + 50)
    }
}

upgrades = [
    { name: "Collect Speed", desc: "Increases unit gathering speed", callback: function () { idleManager.unitUpgrade(0) } },
    { name: "Unit Speed", desc: "Increases unit movespeed speed", callback: function () { idleManager.unitUpgrade(1) } },
    { name: "Base Speed", desc: "Increases base movespeed speed", callback: function () { idleManager.unitUpgrade(2) } },
    { name: "Resource Limit", desc: "Increases total number of resources", callback: function () { idleManager.unitUpgrade(3) } },
    { name: "Resource Purity", desc: "Increases resources per node", callback: function () { idleManager.unitUpgrade(4) } },
]
