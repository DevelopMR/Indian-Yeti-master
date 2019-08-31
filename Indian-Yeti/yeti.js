class Yeti {

    constructor() {

        this.cave = new Cave();
        this.inCave = false;
        
        this.x = this.cave.x - 65;
        this.y = this.cave.y;

        this.velX = 0;
        this.velY = 0;
        this.stepSize = 13; //15// 9; // 4
        this.velStepSize = this.stepSize / 20;
        this.fearFactor = 1;
        this.visionDist = 600; //500; // 240
        this.heatVision = this.visionDist * 1.5; //
        this.seeSquared = sq(this.visionDist + 25); // 25 half camp
        this.seeSquaredHeat = sq(this.heatVision + 25); 
        this.bodyTemp = 200;

        this.size = 35; // width  and height
        this.halfsize = this.size/2;
        this.dead = false;
        this.food = 2; // food in hand

        this.trail = [];

        this.isBest = false;

        this.army = new Army(this);
        this.inCamp = false;
        this.migration = 1;
        this.headwind = .01;

        // genome PROJECT SPECIFIC HACK
        // Vision values
        this.vision0 = 0;  
        this.vision1 = 0;  
        this.vision2 = 0;  
        this.vision3 = 0; 
        this.vision4 = 0;  
        this.vision5 = 0; 
        this.vision6 = 0; 
        this.vision7 = 0; 
        this.vision8 = 0; 
        
        this.vision9 = 0; 
        this.vision10 = 0; 
        this.vision11 = 0; 
        this.vision12 = 0;
        this.vision13 = 0;
        this.vision14 = 0;
        this.vision15 = 0;
        
        // Response values
        this.response0 = 0; 
        this.response1 = 0; 
        this.response2 = 0; 
        this.response3 = 0; 


        //-----------------------------------------------------------------------
        //neat stuff
        this.fitness = 0;
        this.vision = []; //the input array fed into the neuralNet
        this.decision = []; //the out put of the NN
        this.unadjustedFitness;
        this.lifespan = 0; //how long the player lived for this.fitness
        this.bestScore = 0; //stores the this.score achieved used for replay
        this.dead = false;
        this.score = 0; // account for two new pipes to the left
        this.gen = 0;

        this.species = 0;

        this.genomeInputs = 10;
        this.genomeOutputs = 4;

        this.brain = new Genome(this.genomeInputs, this.genomeOutputs);

        this.face = this.getFace(); //
        //this.textSize =  45 + random(20);


    }

    getFace(){
      var face = ".";
      var faceChoice = random(7) | 0; // bitwise OR conversion to integer trick
      switch(faceChoice){
        case 1:
            face = "0";
        break;
        case 2:
            face = "1";
        break;
        case 3:
            face = "2";
        break;
        case 4:
            face = "3";
        break;
        case 5:
            face = "4";
        break;
        case 6:
            face = "5";
        break;
    }

      return face;
    }


    show() {

        this.army.show();
        this.cave.show();
        
        // custom font
        textFont('indianyetiregular');
        textAlign(CENTER, TOP);
        strokeWeight(0);
        stroke(0);
        textSize(55); // 55

        if (this.isBest) {
          textSize(85);
          fill(255,0,0);
          text(this.face, this.x - this.halfsize, this.y - this.halfsize);

          } else
          if (!this.cave.homeSweetHome){
            // twinkle
            var s = 20 + random(80) | 0;
            colorMode(HSB);
            fill("hsla(220, "+ s +"%, 50%, .4)");
            text(this.face, this.x - this.halfsize, this.y - this.halfsize);
            colorMode(RGB);
          } 
          
          else {
            fill(0, 0, 0, 96);
            text(this.face, this.x - this.halfsize, this.y - this.halfsize);
      
          }
    }


    update() {

        this.lifespan++;
        this.score += .25 * sq(this.migration); //1
        
        // cold impact
        this.bodyTemp = constrain(this.bodyTemp, 0, 200);
        this.bodyTemp -= .45; //.15

        // update army
        this.army.update();
 
        this.move();

        // scoring 
        
        if (!dieOff) {
            this.checkCollisions();
        }
    }


    move() {
        this.velY += this.headwind * 3.5 * Math.sin(dayCounter/60) * Math.cos((this.x+dayCounter)/60); // with phased limiting
        this.velX += this.headwind + .018 * Math.cos((this.x+dayCounter)/60);

/*         if (!this.dead) {
            this.velY = constrain(this.velY, -1.2, 1.2);
        } else {
            this.velY = constrain(this.velY, -1.2, 1.2);
        } */

        this.y += this.velY;
        this.x += this.velX;
        
    }


    checkCollisions() { 
        
        // check boundary
        if((this.x  - this.halfsize < 0 || this.x + this.halfsize > 1180) || (this.y  - this.halfsize < 0 || this.y + this.halfsize > 900)) {
            this.dead = true;
            pauseBecauseDead = true;
        }


        // check Army
        this.army.detected(this);
        if(this.army.collided(this)) {
            this.dead = true;
            pauseBecauseDead = true;
        }
 
        // check camp
        this.army.camp.detected(this);
        this.army.camp.insideCamp(this);

        // check cave
        this.cave.detected(this);
        this.cave.insideCave(this);

        // check body temp
        if (this.bodyTemp <= 0){

          this.food--; // eat, papa 

          if(this.food < 0 ){
            this.dead = true;
            pauseBecauseDead = true;
          }
          else{
            this.bodyTemp = 200;
          }
          
        }

    }




    // ACTIONS
    up() {
        if (!this.dead) {
          //this.velY += -this.stepSize / 10;
          this.y += -this.stepSize;
          this.bodyTemp +=.12; // .35
        }
      }

    down() {
        if (!this.dead) {
          //this.velY += this.stepSize / 10;
          this.y += this.stepSize;
          this.bodyTemp +=.12;
        }
      }  

    left() {
        if (!this.dead) {
          //this.velX += -this.stepSize / 10;
          this.x += -this.stepSize;
          this.bodyTemp +=.12;
        }
      }

    right() {
        if (!this.dead) {
          //this.velX += this.stepSize / 10;
          this.x += this.stepSize;
          this.bodyTemp +=.12;
        }
      }




      soldierSort(a, b) {
        if (a[1] < b[1]) {
          return -1;
        }
        if (a[1] > b[1]) {
          return 1;
        }
        // a must be equal to b
        return 0;
      }


    //----------------------------------------neat functions
    look() {


        var soldierArray = [];
        var distSold0X = this.army.soldiers[0].x - this.x;
        var distSold0Y = this.army.soldiers[0].y - this.y;
        soldierArray[0] = [0, sq(distSold0X)+sq(distSold0Y), distSold0X, distSold0Y, this.army.soldiers[0].velX, this.army.soldiers[0].velY];
        

        var distSold1X = this.army.soldiers[1].x - this.x;
        var distSold1Y = this.army.soldiers[1].y - this.y;
        soldierArray[1] = [1, sq(distSold1X)+sq(distSold1Y), distSold1X, distSold1Y, this.army.soldiers[1].velX, this.army.soldiers[1].velY];
        

        var distSold2X = this.army.soldiers[2].x - this.x;
        var distSold2Y = this.army.soldiers[2].y - this.y;
        soldierArray[2] = [2, sq(distSold2X)+sq(distSold2Y), distSold2X, distSold2Y, this.army.soldiers[2].velX, this.army.soldiers[2].velY];

        // // ** DO NOT SORT?? ** 
        soldierArray.sort(this.soldierSort); // arranges them by distance

        var closest = soldierArray[0];
        var middle = soldierArray[1];
        var furthest = soldierArray[2];



        if (closest[1] > this.seeSquaredHeat){
          closest[2] = null;
          closest[3] = null;
          closest[4] = null;
          closest[5] = null;
        }


        if (middle[1] > this.seeSquaredHeat){
          middle[2] = null;
          middle[3] = null;
          middle[4] = null;
          middle[5] = null;
        }
        

        if (furthest[1] > this.seeSquaredHeat){
          furthest[2] = null;
          furthest[3] = null;
          furthest[4] = null;
          furthest[5] = null;
        }



        this.vision = [];

        this.vision[0] = map(this.x, 0, 1180, 0, 1); // x pos
        this.vision[1] = map(this.y, 0, 900, 0, 1); // y pos


        // closest
        this.vision[2] = map(closest[2], -this.heatVision, this.heatVision, -1, 1); // x pos
        this.vision[3] = map(closest[3], -this.heatVision, this.heatVision, -1, 1); // y pos
        // this.vision[4] = map(closest[4], -this.heatVision, this.heatVision, -1, 1); // x Vel
        // this.vision[5] = map(closest[5], -this.heatVision, this.heatVision, -1, 1); // y Vel

        // middle
        this.vision[4] = map(middle[2], -this.heatVision, this.heatVision, -1, 1);
        this.vision[5] = map(middle[3], -this.heatVision, this.heatVision, -1, 1);
        // this.vision[8] = map(middle[4], -this.heatVision, this.heatVision, -1, 1);
        // this.vision[9] = map(middle[5], -this.heatVision, this.heatVision, -1, 1);

        // furthest
        this.vision[6] = map(furthest[2], -this.heatVision, this.heatVision, -1, 1);
        this.vision[7] = map(furthest[3], -this.heatVision, this.heatVision, -1, 1);
        // this.vision[12] = map(furthest[4], -this.heatVision, this.heatVision, -1, 1);
        // this.vision[13] = map(furthest[5], -this.heatVision, this.heatVision, -1, 1);


        this.vision[8] = map(this.food, 0, 100, 0, 1); // 14
        this.vision[9] = map(this.bodyTemp, 0, 200, 0, 1); // 15

        this.vision0 = this.x;
        this.vision1 = this.y;

        if (closest[2]!=null)
        {
          this.vision2 = closest[2].toFixed(1);
          this.vision3 = closest[3].toFixed(1);
          //this.vision4 = closest[4].toFixed(1);
          //this.vision5 = closest[5].toFixed(1);

        } else {
          this.vision2 = "";
          this.vision3 = "";
          //this.vision4 = "";
          //this.vision5 = "";
        }
        
        if (middle[2]!=null)
        {
          this.vision4 = middle[2].toFixed(1);
          this.vision5 = middle[3].toFixed(1);
          //this.vision8 = middle[4].toFixed(1);
          //this.vision9 = middle[5].toFixed(1);

        } else {
          this.vision4 = "";
          this.vision5 = "";
          //this.vision8 = "";
          //this.vision9 = "";
        }


        if (furthest[2]!=null)
        {
          this.vision6 = furthest[2].toFixed(1);
          this.vision7 = furthest[3].toFixed(1);
          //this.vision12 = furthest[4].toFixed(1);
          //this.vision13 = furthest[5].toFixed(1);
        } else {
          this.vision6 = "";
          this.vision7 = "";
          //this.vision12 = "";
          //this.vision13 = "";
        }

        this.vision8 = this.food;
        this.vision9 = this.bodyTemp.toFixed(1);

    }




    //-----------------------------------------
    //gets the output of the this.brain then converts them to actions
    think() {

        var max = 0;
        var maxIndex = 0;
        //get the output of the neural network
        this.decision = this.brain.feedForward(this.vision);

        // 0.6
        // .4 for softmax

        var limit = 0.40

        if (this.decision[0] > limit) {
        this.up();
        }

        if (this.decision[1] > limit) {
        this.down();
        }

        if (this.decision[2] > limit) {
        this.left();
        }

        if (this.decision[3] > limit) {
        this.right();
        }


        this.response0 = this.decision[0];
        this.response1 = this.decision[1];
        this.response2 = this.decision[2];
        this.response3 = this.decision[3];

        
    }


    //-------------------------------------------
    //returns a clone of this player with the same brian
    clone() {
    var clone = new Yeti(); //Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;
    //print("cloning done");
    return clone;
    }

    //-------------------------------------------
    //since there is some randomness in games sometimes when we want to replay the game we need to remove that randomness
    //this fuction does that

    cloneForReplay() {
    var clone = new Yeti(); // Player();
    clone.brain = this.brain.clone();
    clone.fitness = this.fitness;
    clone.brain.generateNetwork();
    clone.gen = this.gen;
    clone.bestScore = this.score;

    return clone;
    }

    //-------------------------------------------
    //fot Genetic algorithm
    calculateFitness() {
      this.fitness = 1 + this.score + pow(this.migration, 3) * (this.lifespan + this.food * 20 + this.cave.food * 20 );
      // this.fitness = 1 + sq(this.score) + this.lifespan / 50.0 + this.cave.food/20; // TOO HIGH 
    }


    //-------------------------------------------
    crossover(parent2) {

    var child = new Yeti(); //Player();
    child.brain = this.brain.crossover(parent2.brain);
    child.brain.generateNetwork();
    return child;
    }




}