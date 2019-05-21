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

        this.size = 35; // width  and height
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

        //this.face = 38 + random(7) | 0; // bitwise OR conversion to integer trick
        //this.textSize =  25 + random(10);


    }



    show() {

        this.army.show();
        this.cave.show();
        


        textFont('indianyetiregular');
        textAlign(CENTER, TOP);
        strokeWeight(0);
        textSize(35);

        if (this.isBest) {

          fill(255,0,0);
          text("1", this.x - this.halfsize, this.y - this.halfsize);

                //this.vertexYeti(this.x, this.y, 75);
                //image(bestYetiSprite, this.x - this.halfsize , this.y - this.halfsize, 65, 65);
           /*      strokeWeight(1);
            stroke(0,0,240);
            fill(0,0,0,0);
            arc(this.x, this.y, this.visionDist*2, this.visionDist*2, 0, TWO_PI);
            stroke(100,0,140);
            fill(0,0,0,0);
            arc(this.x, this.y, this.heatVision*2, this.heatVision*2, 0, TWO_PI); */

          } else {

            fill(180);
            text("1", this.x - this.halfsize, this.y - this.halfsize);

                //this.vertexYeti(this.x, this.y, 0);
                //image(yetiSprite, this.x - this.halfsize , this.y - this.halfsize, 55, 55);
          }
    }


    vertexYeti(x,y, color){

      push();
      translate(x,y);
       
       scale(.15);


       beginShape();
        fill(color);
        vertex(228,430);
        vertex(226,430); 
        vertex(226,444); 
        vertex(227,463); 
        vertex(225,476); 
        vertex(220,479); 
        vertex(175,485); 
        vertex(113,493); 
        vertex(82,497); 
        vertex(56,494); 
        vertex(57,489); 
        vertex(64,489); 
        vertex(68,486); 
        vertex(78,485); 
        vertex(105,480); 
        vertex(125,474); 
        vertex(144,470); 
        vertex(162,465); 
        vertex(168,463); 
        vertex(174,464); 
        vertex(178,464); 
        vertex(178,460); 
        vertex(209,455); 
        vertex(211,453); 
        vertex(213,451); 
        vertex(211,436); 
        vertex(207,439); 
        vertex(201,443); 
        vertex(195,441); 
        vertex(192,435);
        vertex(186,411); 
        vertex(184,401); 
        vertex(185,401);
        vertex(194,406); 
        vertex(203,406); 
        vertex(213,405); 
        vertex(248,401); 
        vertex(282,398); 
        vertex(285,397); 
        vertex(290,395); 
        vertex(294,399); 
        vertex(295,396); 
        vertex(306,395); 
        vertex(331,382); 
        vertex(348,375); 
        vertex(369,368); 
        vertex(367,373); 
        vertex(362,377); 
        vertex(332,396); 
        vertex(332,397); 
        vertex(356,395); 
        vertex(358,395); 
        vertex(378,398); 
        vertex(398,398); 
        vertex(390,403); 
        vertex(381,405); 
        vertex(359,406); 
        vertex(353,408); 
        vertex(348,413); 
        vertex(342,416); 
        vertex(340,416); 
        vertex(334,418); 
        vertex(329,414); 
        vertex(324,411); 
        vertex(286,414); 
        vertex(249,422); 
        vertex(236,427); 
        vertex(246,441); 
        vertex(251,442); 
        vertex(276,439); 
        vertex(300,438); 
        vertex(329,440); 
        vertex(357,442); 
        vertex(387,444); 
        vertex(366,450); 
        vertex(343,453); 
        vertex(344,456); 
        vertex(334,456); 
        vertex(319,459); 
        vertex(277,468); 
        vertex(250,469); 
        vertex(241,464); 
        vertex(233,450); 
        vertex(228,430);
       endShape(CLOSE);



      beginShape();
        vertex(172,429); 
        vertex(166,435); 
        vertex(179,439); 
        vertex(164,454); 
        vertex(160,455); 
        vertex(155,454); 
        vertex(144,446); 
        vertex(140,442); 
        vertex(142,438); 
        vertex(135,430); 
        vertex(151,426); 
        vertex(151,425); 
        vertex(142,419); 
        vertex(154,415); 
        vertex(166,413); 
        vertex(178,418); 
        vertex(166,426); 
        vertex(172,429);
      endShape(CLOSE);



      beginShape();
        vertex(172,285); 
        vertex(147,222); 
        vertex(137,201); 
        vertex(125,174); 
        vertex(125,172); 
        vertex(121,168); 
        vertex(124,163);
        vertex(135,149);
        vertex(139,147);
        vertex(143,152);
        vertex(163,206);
        vertex(181,249);
        vertex(187,260);
        vertex(175,258);
        vertex(179,277);
        vertex(183,292);
        vertex(188,306);
        vertex(189,306);
        vertex(190,268);
        vertex(193,189);
        vertex(194,170);
        vertex(198,118);
        vertex(199,61);
        vertex(200,50);
        vertex(202,66);
        vertex(203,86);
        vertex(202,118);
        vertex(203,150);
        vertex(202,175);
        vertex(202,191);
        vertex(201,201);
        vertex(203,285);
        vertex(204,311);
        vertex(204,334);
        vertex(214,332);
        vertex(214,326);
        vertex(211,282);
        vertex(209,246);
        vertex(205,214);
        vertex(206,181);
        vertex(208,144);
        vertex(211,122);
        vertex(214,106);
        vertex(219,82);
        vertex(225,40);
        vertex(224,33);
        vertex(220,26);
        vertex(221,25);
        vertex(225,29);
        vertex(228,38);
        vertex(229,47);
        vertex(221,127);
        vertex(220,143);
        vertex(218,145);
        vertex(220,147);
        vertex(220,150);
        vertex(218,154);
        vertex(219,160);
        vertex(219,165);
        vertex(218,168);
        vertex(221,170);
        vertex(222,173);
        vertex(219,174);
        vertex(221,179);
        vertex(220,179);
        vertex(220,184);
        vertex(221,187);
        vertex(222,201);
        vertex(221,205);
        vertex(222,220);
        vertex(224,243);
        vertex(227,266);
        vertex(232,315);
        vertex(232,328);
        vertex(234,332);
        vertex(238,333);
        vertex(257,333);
        vertex(283,332);
        vertex(299,331);
        vertex(296,333);
        vertex(355,331);
        vertex(350,336);
        vertex(344,338);
        vertex(309,342);
        vertex(265,346);
        vertex(238,347);
        vertex(233,347);
        vertex(233,356);
        vertex(260,355);
        vertex(262,353);
        vertex(265,352);
        vertex(273,354);
        vertex(282,353);
        vertex(312,351);
        vertex(338,349);
        vertex(339,349);
        vertex(353,350);
        vertex(367,351);
        vertex(351,354);
        vertex(335,356);
        vertex(338,357);
        vertex(361,356);
        vertex(366,358);
        vertex(358,361);
        vertex(349,361);
        vertex(344,361);
        vertex(327,362);
        vertex(314,366);
        vertex(300,367);
        vertex(287,368);
        vertex(275,373);
        vertex(265,375);
        vertex(246,379);
        vertex(224,386);
        vertex(221,390);
        vertex(218,391);
        vertex(221,388);
        vertex(219,387);
        vertex(191,395);
        vertex(169,400);
        vertex(163,403);
        vertex(158,405);
        vertex(154,401);
        vertex(153,387);
        vertex(157,373);
        vertex(163,369);
        vertex(186,365);
        vertex(189,361);
        vertex(189,354);
        vertex(168,356);
        vertex(134,363);
        vertex(127,365);
        vertex(120,367);
        vertex(115,361);
        vertex(114,350);
        vertex(117,339);
        vertex(124,334);
        vertex(128,333);
        vertex(132,333);
        vertex(149,333);
        vertex(184,332);
        vertex(189,331);
        vertex(189,314);
        vertex(171,312);
        vertex(161,301);
        vertex(148,293);
        vertex(143,293);
        vertex(128,295);
        vertex(124,292);
        vertex(124,281);
        vertex(130,272);
        vertex(139,268);
        vertex(150,272);
        vertex(168,285);
        vertex(171,286);
        vertex(172,285);


        beginContour();
          vertex(215,361); 
          vertex(215,353); 
          vertex(215,350); 
          vertex(212,349); 
          vertex(206,351); 
          vertex(204,357); 
          vertex(207,362); 
          vertex(215,361);
        endContour();

      endShape(CLOSE);





    


       pop();

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