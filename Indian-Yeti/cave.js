class Cave {
    constructor(){
        this.size = 50;
        this.x = this.size + random(245); 
        this.y = this.size + random(800); 

        
        this.food = 100;

    }

    show(){
        image(caveSprite, this.x - this.size/2, this.y - this.size/2);
    }

    insideCave(p){

        p.inCave = false;
  
        if ((p.x > this.x - 15 )&&(p.x < this.x + 15)){

            if ((p.y > this.y - 15 )&&(p.y < this.y + 15)){
                p.inCave = true;

                this.food += p.food;
                p.score += 10 + p.food;
                p.bodyTemp += 1;

                p.food = 0;
            }

        }
  
      }

}