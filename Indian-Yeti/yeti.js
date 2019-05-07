class Yeti {

    constructor() {

        this.cave = new Cave();
        this.inCave = false;
        
        this.x = this.cave.x + 65;
        this.y = this.cave.y;

        this.velX = 0;
        this.velY = 0;
        this.stepSize = 4;
        this.fearFactor = 1;
        this.visionDist = 125;
        this.heatVision = this.visionDist * 1.5;
        this.seeSquared = sq(this.visionDist + 25); // 25 half camp
        this.bodyTemp = 200;

        this.size = 35; // width ? 
        this.halfsize = this.size/2;
        this.dead = false;
        this.food = 0; // food in hand

        this.trail = [];

        this.isBest = false;

        this.army = new Army(this);
        this.inCamp = false;

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
        this.vision8 = 0; //
        
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

        this.genomeInputs = 7;
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
        this.score += .05;
        
        // cold impact
        this.bodyTemp = constrain(this.bodyTemp, 0, 200);
        this.bodyTemp -= .2;
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
        //this.velY += gravity + waveY;
        //this.velX += headwind + waveX;

        if (!this.dead) {
            this.velY = constrain(this.velY, -20, 20);
        } else {
            this.velY = constrain(this.velY, -20, 20);
        }

        if (!this.isOnGround) {
            this.y += this.velY;
            this.x += this.velX;
        }
    }


    checkCollisions() { 
        
        // check boundary
        if((this.x  - this.halfsize < 0 || this.x + this.halfsize > 1180) || (this.y  - this.halfsize < 0 || this.y + this.halfsize > 900)) {
            this.dead = true;
            pauseBecauseDead = true;
        }


        // check Army
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
          this.velY += -this.stepSize * this.fearFactor;
          this.bodyTemp +=.3;
        }
      }

    down() {
        if (!this.dead) {
          this.velY += this.stepSize * this.fearFactor;
          this.bodyTemp +=.3;
        }
      }  

    left() {
        if (!this.dead) {
          this.velX += -this.stepSize * this.fearFactor;
          this.bodyTemp +=.3;
        }
      }

    right() {
        if (!this.dead) {
          this.velX += this.stepSize * this.fearFactor;
          this.bodyTemp +=.3;
        }
      }


    //----------------------------------------neat functions
    look() {


        var distCave = sqrt(sq(this.x - this.cave.x) + sq(this.y - this.cave.y));
        var distCamp = sqrt(sq(this.x - this.army.camp.x) + sq(this.y - this.army.camp.y));
        var distSold0 = sqrt(sq(this.x - this.army.soldiers[0].x) + sq(this.y - this.army.soldiers[0].y));
        var distSold1 = sqrt(sq(this.x - this.army.soldiers[1].x) + sq(this.y - this.army.soldiers[1].y));
        var distSold2 = sqrt(sq(this.x - this.army.soldiers[2].x) + sq(this.y - this.army.soldiers[2].y));

        this.vision = [];

        this.vision[0] = map(this.x, 0, 1180, 0, 1); // x pos
        this.vision[1] = map(this.y, 0, 900, 0, 1); // y pos
        this.vision[2] = map(distCave, 0, 1400, 0, 1);
        this.vision[3] = map(distCamp, 0, 1400, 0, 1);
        this.vision[4] = map(distSold0, 0, 1400, 0, 1);
        this.vision[5] = map(distSold1, 0, 1400, 0, 1);
        this.vision[6] = map(distSold2, 0, 1400, 0, 1);

        this.vision0 = this.x;
        this.vision1 = this.y;
        this.vision2 = distCave;
        this.vision3 = distCamp;
        this.vision4 = distSold0;
        this.vision5 = distSold1;
        this.vision6 = distSold2;

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
      //this.fitness = 1 + this.score * this.score + this.lifespan / 20.0; // UPDATE BIGLY
      this.fitness = 1 + this.score + this.lifespan / 50.0 + this.cave.food/20;
    }


    //-------------------------------------------
    crossover(parent2) {

    var child = new Yeti(); //Player();
    child.brain = this.brain.crossover(parent2.brain);
    child.brain.generateNetwork();
    return child;
    }




}