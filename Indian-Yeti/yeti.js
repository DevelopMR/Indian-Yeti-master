class Yeti {

    constructor() {

        this.cave = new Cave();
        this.inCave = false;
        
        this.x = this.cave.x + 65;
        this.y = this.cave.y;

        this.velX = 0;
        this.velY = 0;
        this.stepSize = 4;
        this.velStepSize = this.stepSize / 20;
        this.fearFactor = 1;
        this.visionDist = 125;
        this.heatVision = this.visionDist * 1.5;
        this.seeSquared = sq(this.visionDist + 25); // 25 half camp
        this.seeSquaredHeat = sq(this.heatVision + 25); 
        this.bodyTemp = 200;

        this.size = 35; // width ? 
        this.halfsize = this.size/2;
        this.dead = false;
        this.food = 2; // food in hand

        this.trail = [];

        this.isBest = false;

        this.army = new Army(this);
        this.inCamp = false;

        this.headwind = .005;

        // genome PROJECT SPECIFIC HACK
        // Vision values
        this.vision0 = 0; // 
        this.vision1 = 0; // 
        this.vision2 = 0; // 
        this.vision3 = 0; // 
        this.vision4 = 0; // 
        this.vision5 = 0; //
        this.vision6 = 0; // 
        this.vision7 = 0; // 
        //this.vision8 = 0; //
        //this.vision9 = 0; 
        //this.vision10 = 0; 
        //this.vision11 = 0; 
        
        // Response values
        this.response0 = 0; // 
        this.response1 = 0; // 
        this.response2 = 0; // 
        this.response3 = 0; // 



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

        this.genomeInputs = 8;
        this.genomeOutputs = 4;

        this.brain = new Genome(this.genomeInputs, this.genomeOutputs);

    }



    show() {

        this.army.show();
        this.cave.show();
        //this.camp.show();

        if (this.isTop || humanPlaying) {
            image(bestYetiSprite, this.x - this.halfsize , this.y - this.halfsize);

            stroke(0,0,240);
            fill(0,0,0,0);
            arc(this.x, this.y, this.visionDist*2, this.visionDist*2, 0, TWO_PI);
            stroke(100,0,140);
            fill(0,0,0,0);
            arc(this.x, this.y, this.heatVision*2, this.heatVision*2, 0, TWO_PI);

          } else {
            image(yetiSprite, this.x - this.halfsize , this.y - this.halfsize);
          }
    }




    update() {

        this.lifespan++;
        this.score += .01;
        
        // cold impact
        this.bodyTemp = constrain(this.bodyTemp, 0, 200);
        this.bodyTemp -= .25;
        // update footprints
        // update army
        this.army.update();

 
        this.move();


        // scoring 
        

        if (!dieOff) {
            this.checkCollisions();
        }
    }



    move() {
        this.velY += this.headwind;
        this.velX += this.headwind;

        if (!this.dead) {
            this.velY = constrain(this.velY, -1.2, 1.2);
        } else {
            this.velY = constrain(this.velY, -1.2, 1.2);
        }

        
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
        this.cave.insideCave(this);

        // check body temp
        if (this.bodyTemp <= 0){
          this.dead = true;
          pauseBecauseDead = true;
        }

    }




    // ACTIONS
    up() {
        if (!this.dead) {
          //this.velY += -this.stepSize / 10;
          this.y += -this.stepSize;
          this.bodyTemp +=.3;
        }
      }

    down() {
        if (!this.dead) {
          //this.velY += this.stepSize / 10;
          this.y += this.stepSize;
          this.bodyTemp +=.3;
        }
      }  

    left() {
        if (!this.dead) {
          //this.velX += -this.stepSize / 10;
          this.x += -this.stepSize;
          this.bodyTemp +=.3;
        }
      }

    right() {
        if (!this.dead) {
          //this.velX += this.stepSize / 10;
          this.x += this.stepSize;
          this.bodyTemp +=.3;
        }
      }


    //----------------------------------------neat functions
    look() {


   
        /* var distCaveX = this.cave.x - this.x;
        var distCaveY = this.cave.y - this.y;

        var distCampX = this.army.camp.x - this.x;
        var distCampY = this.army.camp.y - this.y; */


        var distSold0X = this.army.soldiers[0].x - this.x;
        var distSold0Y = this.army.soldiers[0].y - this.y;

        if (sq(distSold0X)+sq(distSold0Y) > this.seeSquaredHeat){
          distSold0X = null;
          distSold0Y = null;
        }

        var distSold1X = this.army.soldiers[1].x - this.x;
        var distSold1Y = this.army.soldiers[1].y - this.y;

        if (sq(distSold1X)+sq(distSold1Y) > this.seeSquaredHeat){
          distSold1X = null;
          distSold1Y = null;
        }
        
        var distSold2X = this.army.soldiers[2].x - this.x;
        var distSold2Y = this.army.soldiers[2].y - this.y;

        if (sq(distSold2X)+sq(distSold2Y) > this.seeSquaredHeat){
          distSold2X = null;
          distSold2Y = null;
        }

        this.vision = [];

        this.vision[0] = map(this.x, 0, 1180, 0, 1); // x pos
        this.vision[1] = map(this.y, 0, 900, 0, 1); // y pos
/*      this.vision[2] = map(distCaveX, -1100, 1100, -1, 1);
        this.vision[3] = map(distCaveY, -850, 850, -1, 1);

        this.vision[4] = map(distCampX, -1100, 1100, -1, 1);
        this.vision[5] = map(distCampY, -850, 850, -1, 1); */

        this.vision[2] = map(distSold0X, -this.heatVision, this.heatVision, -1, 1);
        this.vision[3] = map(distSold0Y, -this.heatVision, this.heatVision, -1, 1);

        this.vision[4] = map(distSold1X, -this.heatVision, this.heatVision, -1, 1);
        this.vision[5] = map(distSold1Y, -this.heatVision, this.heatVision, -1, 1);

        this.vision[6] = map(distSold2X, -this.heatVision, this.heatVision, -1, 1);
        this.vision[7] = map(distSold2Y, -this.heatVision, this.heatVision, -1, 1);


        this.vision0 = this.x;
        this.vision1 = this.y;
        //this.vision2 = distCaveX;
        //this.vision3 = distCaveY;
        //this.vision4 = distCampX;
        //this.vision5 = distCampY;
        this.vision2 = distSold0X;
        this.vision3 = distSold0Y;
        this.vision4 = distSold1X;
        this.vision5 = distSold1Y;
        this.vision6 = distSold2X;
        this.vision7 = distSold2Y;

    }




    //-----------------------------------------
    //gets the output of the this.brain then converts them to actions
    think() {

        var max = 0;
        var maxIndex = 0;
        //get the output of the neural network
        this.decision = this.brain.feedForward(this.vision);

        if (this.decision[0] > 0.6) {
        this.up();
        }

        if (this.decision[1] > 0.6) {
        this.down();
        }

        if (this.decision[2] > 0.6) {
        this.left();
        }

        if (this.decision[3] > 0.6) {
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
      this.fitness = 1 + this.score + this.lifespan / 20.0 + this.cave.food/20;
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