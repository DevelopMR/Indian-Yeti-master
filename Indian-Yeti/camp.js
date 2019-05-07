class Camp {
    constructor(){
        this.size = 50;
        this.x = 835 + random(295); 
        this.y = this.size + random(800); 
        
        this.food = 1000;

        this.discovered = false; // starts false
        
    }

    show(){
        if (this.discovered){
            image(campSprite, this.x - this.size/2 , this.y - this.size/2);
        }

        

    }

    detected(p){
                
        var xDel = p.x - this.x;
        var yDel = p.y - this.y;

        var leftHalf = (sq(xDel) + sq(yDel));
        var rightHalf = p.seeSquared;

        if (leftHalf <= rightHalf) {
             if (!this.discovered){
                this.discovered = true;
                p.score += 400;
             }
        }

        
    }

    insideCamp(p){

        p.inCamp = false;
  
        if ((p.x > this.x - 15 )&&(p.x < this.x + 15)){

            if ((p.y > this.y - 15 )&&(p.y < this.y + 15)){
                p.inCamp = true;

            

                if ((p.food < 100)&&(this.food > 1)) {
                    p.score+=50;
                    p.food++;
                    this.food--;
                }

                p.score+=50;
            }
        }
  
      }


}