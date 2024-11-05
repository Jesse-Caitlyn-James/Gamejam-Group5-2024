class MenuManager {
    constructor() {
        this.oldColour = 0;
        this.pageState = 2;
        this.panelX = windowWidth * 0.1;
        this.panelY = windowHeight * 0.1;
        this.menuSprites = new Group();

        this.page0 = new GameButton(windowWidth - 150, this.panelY + 50, 200, 100, "Main", this.page0);
        this.menuSprites.push(this.page0.sprite);
        this.page1 = new GameButton(windowWidth - 150, this.panelY + 200, 200, 100, "Something", this.page1);
        this.menuSprites.push(this.page1.sprite);
        this.page2 = new GameButton(windowWidth - 150, this.panelY + 350, 200, 100, "Credits", this.page2);
        this.menuSprites.push(this.page2.sprite);
    }

    menuUpdate(colour) {
        fill(150);
        rect(this.panelX, this.panelY, windowWidth * 0.6, windowHeight * 0.8);
        this.oldColour = colour;
        fill(0);

        switch (this.pageState) {
            case 0:
                this.drawMain();
                break;
            case 1:
                this.drawSomething();
                break;
            case 2:
                this.drawCredits();
                break;
        }
        this.buttonCheck();

        fill(this.oldColour);
    }

    drawMain(){
        textAlign(LEFT, TOP);
        let s = "this is the Generic page, The Stupid p5 text wrap doesn't work, TAD help us, good lord imma kermit";
        text(s, this.panelX, this.panelY, 100, 100);
    }

    drawSomething(){
        textAlign(LEFT, TOP);
        let s = "IDK what this page is for, The Stupid p5 text wrap doesn't work, TAD help us, good lord imma kermit";
        text(s, this.panelX, this.panelY, 100, 100);
    }

    drawCredits() {
        textAlign(LEFT, TOP);
        let s = "this is the credits page, The Stupid p5 text wrap doesn't work, TAD help us, good lord imma kermit";
        text(s, this.panelX, this.panelY, 100, 100);
    }


    // Super Jank page switching
    page0(){
        menuManager.pageState = 0;
    }
    page1(){
        menuManager.pageState = 1;
    }
    page2(){
        menuManager.pageState = 2;
    }

    buttonCheck(){
        if(mouse.presses()){
            for(let i = 0; i < this.menuSprites.length; i++){
                let corner1x = this.menuSprites[i].x - this.menuSprites[i].w/2;
                let corner1y = this.menuSprites[i].y - this.menuSprites[i].h/2;
                let corner2x = this.menuSprites[i].x + this.menuSprites[i].w/2;
                let corner2y = this.menuSprites[i].y + this.menuSprites[i].h/2;
    
                if(mouse.x > corner1x && mouse.x < corner2x && mouse.y > corner1y && mouse.y < corner2y){
                    this.menuSprites[i].gameButton.callback();
                }
            }
        }
    }
}