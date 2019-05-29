class Cave {
    constructor(){
        this.size = 65;
        //this.x = 100; //this.size + random(245); 
        //this.y = 800; //this.size + random(800); 

        this.x = 1050; 
        this.y = 240;

        
        this.food = 100;

        this.homeSweetHome = true;

    }

    show(){
        image(caveSprite, this.x - this.size/2, this.y - this.size/2);
    }

    detected(p){
                
        var xDel = p.x - this.x;
        var yDel = p.y - this.y;

        // home sweet home bonus
        if ((!this.homeSweetHome) && ((sq(xDel) + sq(yDel)) <= p.seeSquared)) 
        {
             //if (!this.homeSweetHome){
                this.homeSweetHome = true;
                p.score += 75000 * p.migration; // 2000
                p.migration++;
             //}
        }
    }


    insideCave(p){

        p.inCave = false;
  
        if ((p.x > this.x - 20 )&&(p.x < this.x + 20)){

            if ((p.y > this.y - 20 )&&(p.y < this.y + 20)){
                p.inCave = true;

                this.food += p.food;
                p.score += 1 + p.food * 2000 * p.migration;
                p.bodyTemp += 1;

                p.food = 0;
                
            }

        }
  
      }

}