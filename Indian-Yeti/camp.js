class Camp {
    constructor(){
        this.size = 50;
        //this.x = 1075; //835 + random(295); 
        //this.y = 100; //this.size + random(800); 
        
        this.x = 200; //this.size + random(245); 
        this.y = 630;

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

        if ((sq(xDel) + sq(yDel)) <= p.seeSquared) {
             if (!this.discovered){
                this.discovered = true;
                p.score += 5000 * p.migration; // 2000

                // home cave
                p.cave.homeSweetHome = false;
                
             }
        }

        
    }

    insideCamp(p){

        p.inCamp = false;
  
        if ((p.x > this.x - 25 )&&(p.x < this.x + 25)){

            if ((p.y > this.y - 25 )&&(p.y < this.y + 25)){
                p.inCamp = true;

            

                if ((p.food < 100)&&(this.food > 1)) {
                    p.score += 200 * p.migration;
                    p.food+=5;
                    this.food-=5;
                }

                
            }
        }
  
      }


}