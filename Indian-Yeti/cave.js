class Cave {
    constructor(){
        this.size = 65;
        //this.x = 100; //this.size + random(245); 
        //this.y = 800; //this.size + random(800); 

        this.x = 1050; 
        this.y = 240;

        
        this.food = 10;
        this.sightline = 45000; // < p.seeSquared/6
        this.homeSweetHome = true;

    }

    show(){
        image(caveSprite, this.x - this.size/2, this.y - this.size/2);
    }

    detected(p){
                
        var xDel = p.x - this.x;
        var yDel = p.y - this.y;

        // home sweet home bonus in tighter sightline 
        if ((!this.homeSweetHome) && ((sq(xDel) + sq(yDel)) <= this.sightline)) 
        {
             //if (!this.homeSweetHome){
                this.homeSweetHome = true;
                p.score += 1000 * pow(p.migration,3); //100000 // 2000
                p.migration ++;
             //}
        }
    }


    insideCave(p){

        p.inCave = false;
  
        if ((p.x > this.x - 20 )&&(p.x < this.x + 20)){

            if ((p.y > this.y - 20 )&&(p.y < this.y + 20)){
                p.inCave = true;

                this.food += p.food;
                p.score += 1 + p.food * 100 * pow(p.migration,3);  // 10000
                p.bodyTemp += 5;

                p.food = 0;
                
            }

        }
  
      }

}