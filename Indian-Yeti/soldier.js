class Soldier{

    constructor (c, enemy){

        this.size = 25;
        this.halfsize = this.size/2;

        this.vision = 125;
        this.seesquared = sq(this.vision + enemy.halfsize);

        this.x = c.x - 5 - random(20);
        this.y = c.y - 20 + random(40);

        if (this.y - this.halfsize < 0){this.y = this.halfsize};
        if (this.y + this.halfsize > 900){this.y = 900 - this.halfsize};

        

        this.velX = (1 + random(2))*this.coinfFlip();
        this.velY = (1 + random(2))*this.coinfFlip();


        this.visible = false; // start false
        this.heatVisible = false;
        this.alert = false;
        this.alertVel = .25;
        this.enemy = enemy;

    }

    coinfFlip(){
        var coin = random();
        if (coin<=.5){
            return -1;
        }
        else {return 1}
    }

    show() {

        if (this.visible){
            image(soldierSeeSprite, this.x - this.halfsize, this.y - this.halfsize);
        }
        else if (this.heatVisible) {
            image(soldierHeatSprite, this.x - this.halfsize, this.y - this.halfsize);
        } else {
            image(soldierGhostSprite, this.x - this.halfsize, this.y - this.halfsize);
        }

        if (this.enemy.isBest){
            stroke(255,0,0);
            strokeWeight(1);
            fill(0,0,0,0);
            arc(this.x, this.y, this.vision*2, this.vision*2, 0, TWO_PI);
        }


    }

    update() {

        this.look(this.enemy);

        if (this.alert){

            // Response
            var xDel = this.enemy.x - this.x;
            var yDel = this.enemy.y - this.y;

            if (xDel < 0 ){
                this.velX -= this.alertVel;
            }
            if (xDel > 0 ){
                this.velX += this.alertVel;
            }
            if (yDel < 0 ){
                this.velY -= this.alertVel;
            }
            if (yDel > 0 ){
                this.velY += this.alertVel;
            }
            constrain(this.velY, -20, 20);
            constrain(this.velY, -20, 20);
        }
        
        this.x += this.velX;
        this.y += this.velY;

        this.collision();
    }

    look(p){
        this.alert = false;

        if (!p.inCave){
            var xDel = p.x - this.x;
            var yDel = p.y - this.y;

            var leftHalf = (sq(xDel) + sq(yDel));
            var rightHalf = this.seesquared;

            if (leftHalf <= rightHalf) {
                this.alert = true;
            }
   
        }

        if (p.inCamp){
            this.alert = true;
        }



    }


    collidedWithPlayer(p){

        if (( p.y < this.y + this.size ) && ( p.y + p.size > this.y )) {

            if (( p.x < this.x + this.size ) && ( p.x  + p.size > this.x )) {
                return true;
            }
        } 
        else { 
            return false;
        }
    }

    // borders, other soldiers, trail, cave, camp
    collision(){
        // 6 point boundary
        if (this.x - this.halfsize < 6 || this.x + this.halfsize > 1174) {
            this.velX = -this.velX;
        }
        if (this.y - this.halfsize < 6 || this.y + this.halfsize > 894) {
            this.velY = -this.velY;
        }

    }

    detected(p){

        var retRes = false;

        var xDel = p.x - this.x;
        var yDel = p.y - this.y;

        var leftHalf = (sq(xDel) + sq(yDel));
        
        this.visible = false;
        this.heatVisible = false;
        if (leftHalf <= p.seeSquared) { 
            this.visible = true; 
            retRes = true;
        }

        if (leftHalf <= p.seeSquaredHeat) { 
            this.heatVisible = true; 
            retRes = true;
        }
        
        return retRes;
    }

}