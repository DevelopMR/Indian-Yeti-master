var player;

var army;

var pauseBecauseDead;
var yetiSprite;
var bestYetiSprite;
var soldierSprite;
var caveSprite;
var campSprite;


var dieOff = false;

var dayCounter = 360*Math.random();

//---------------------------------------- neat globals

var nextConnectionNo = 1000;
var population;
var speciesCount = 0; // global variable (yuck) for number of species
var speed = 120; // 60

var superSpeed = 1;
var showBest = false; //true if only show the best of the previous generation
var runBest = false; //true if replaying the best ever game
var humanPlaying = false; //true if the user is playing

var humanPlayer;


var showBrain = false;
var showBestEachGen = false;
var upToGen = 0;
var genPlayerTemp; //player

var showNothing = false;



function preload() {

    yetiBoxSprite = loadImage("images/yeti.png");
    yetiSprite = loadImage("images/GhostYeti.png");
    bestYetiSprite = loadImage("images/BestYeti.png");

    soldierSeeSprite = loadImage("images/soldierSee.png");
    soldierHeatSprite = loadImage("images/soldierHeat.png");
    soldierGhostSprite = loadImage("images/soldierGhost.png");

    caveSprite = loadImage("images/cave.png");
    campSprite = loadImage("images/camp.png");
    backgroundSprite = loadImage("images/IndianYetiBG.png");

}

function setup() {
  window.canvas = createCanvas(1635, 900); 
  player = new Yeti();
  pauseBecauseDead = false;


  population = new Population(1000);
  humanPlayer = new Yeti();
  //humanPlaying = true;
  if (humanPlaying){
    speed = 20;
  }
  frameRate(speed);

}

function draw() {

  dayCounter++; 
  if (dayCounter > 3600) {dayCounter = 0}

  drawToScreen(dayCounter);

  if (showBestEachGen) { //show the best of each gen
    showBestPlayersForEachGeneration();
  } else if (humanPlaying) { // if the user is controling the ship
    showHumanPlaying();
  } else if (runBest) { // if replaying the best ever game
    showBestEverPlayer();
  } else { //if just evolving normally
    if (!population.done()) { //if any players are alive then update them
      population.updateAlive();
    } else { //all dead
      //genetic algorithm
      population.naturalSelection();
    }
  }
  writeInfo();
  drawBrain();
  
}




//--------------------------------------
function showBestPlayersForEachGeneration() {
  if (!genPlayerTemp.dead) { //if current gen player is not dead then update it

    genPlayerTemp.look();
    genPlayerTemp.think();
    genPlayerTemp.update();
    genPlayerTemp.show();
  } else { //if dead move on to the next generation
    upToGen++;
    if (upToGen >= population.genPlayers.length) { //if at the end then return to the start and stop doing it
      upToGen = 0;
      showBestEachGen = false;
    } else { //if not at the end then get the next generation
      genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
    }
  }
}

//--------------------------------------
function showHumanPlaying() {
  if (!humanPlayer.dead) { //if the player isnt dead then move and show the player based on input
    humanPlayer.look();
    humanPlayer.update();
    humanPlayer.show();
  } else { 
    
    humanPlaying = false; //once done return to ai
  }
}

//--------------------------------------
function showBestEverPlayer() {
  if (!population.bestPlayer.dead) { //if best player is not dead
    population.bestPlayer.look();
    population.bestPlayer.think();
    population.bestPlayer.update();
    population.bestPlayer.show();
  } else { //once dead
    runBest = false; //stop replaying it
    population.bestPlayer = population.bestPlayer.cloneForReplay(); //reset the best player so it can play again
  }
}


//-------------------------------------
//draws the display screen
function drawToScreen(dCounter) {
  if (!showNothing) {
    //pretty stuff

    //fill(150,150,150);
    //rect(0, 0, canvas.width, canvas.height);
    image(backgroundSprite, 0, 0, 1180, 900);

    drawFilterPass(dCounter);

    // showAll();
    // updateAll();
    // drawBrain();


  }
}

function drawFilterPass (dCounter){

  var shape1 = [1,364, 1,1, 1177,1, 1177,491, 1167,499, 1156,504, 1152,507, 1147,510, 1142,515, 1133,521, 1128,529, 1121,537, 1112,542, 1108,546, 1098,551, 1088,552, 1071,555, 1056,563, 1051,563, 1041,563, 1033,568, 1024,573, 1017,577, 1011,581, 975,634, 960,649, 947,666, 937,674, 927,680, 915,684, 905,685, 901,685, 875,674, 864,671, 855,679, 829,714, 826,718, 819,730, 809,740, 802,742, 795,738, 790,729, 785,723, 774,737, 766,740, 760,734, 750,722, 726,701, 706,674, 703,671, 679,645, 658,616, 653,611, 647,609, 635,605, 625,598, 620,594, 616,589, 616,582, 598,581, 581,582, 562,587, 546,598, 541,600, 518,606, 512,604, 504,595, 476,571, 449,547, 415,520, 406,519, 388,528, 379,531, 371,528, 347,519, 337,517, 319,513, 301,507, 278,494, 259,476, 252,470, 243,469, 235,471, 227,474, 192,473, 183,470, 177,463, 148,410, 147,408, 139,410, 136,410, 125,401, 115,390, 105,380, 92,379, 89,379, 72,377, 57,368, 53,365, 40,363, 27,364, 17,364, 9,362, 1,364];
    
  var shape2 = [1177,448, 1177,565, 1177,900, 1,900, 1,550, 1,417, 1,284, 1,151, 1,19, 2,14, 5,16, 49,17, 56,17, 93,37, 125,63, 131,79, 125,94, 122,98, 116,115, 149,147, 166,170, 181,202, 186,209, 196,203, 198,205, 206,230, 207,233, 212,239, 217,250, 224,244, 234,234, 237,231, 243,213, 248,198, 251,198, 254,205, 255,216, 260,230, 267,243, 273,252, 282,258, 293,260, 294,255, 303,261, 310,270, 315,273, 320,270, 328,263, 338,263, 345,265, 348,272, 353,287, 358,289, 362,301, 368,315, 373,309, 379,308, 379,311, 382,318, 387,323, 396,327, 401,325, 405,315, 408,313, 420,317, 429,326, 443,334, 450,335, 456,331, 460,325, 463,328, 469,331, 475,332, 484,327, 491,318, 500,303, 512,290, 515,287, 521,286, 524,282, 528,279, 532,278, 542,283, 555,292, 564,299, 568,310, 570,318, 576,318, 580,332, 589,322, 594,320, 601,322, 607,317, 610,315, 611,320, 629,309, 637,319, 651,307, 657,304, 662,308, 676,323, 680,329, 688,334, 694,342, 699,345, 706,344, 719,338, 726,339, 737,354, 744,359, 752,356, 761,348, 768,338, 771,336, 774,335, 785,334, 792,325, 797,319, 805,320, 816,321, 826,314, 828,311, 856,282, 862,288, 870,287, 872,288, 881,292, 887,299, 898,314, 949,369, 994,430, 1005,442, 1014,455, 1032,481, 1049,500, 1055,504, 1063,503, 1067,499, 1067,493, 1069,483, 1075,477, 1093,466, 1113,457, 1118,455, 1122,451, 1126,448, 1131,450, 1135,454, 1141,454, 1147,451, 1155,453, 1159,456, 1166,455, 1177,448];
  
    push();

    beginShape();
    fill(220,134,79, 128*sin(dCounter/7 % 128));
    //alpha(dCounter % 255);

    for (var i=0; i<=shape1.length/2; i++){
      vertex(shape1[i*2], shape1[i*2+1]);
    }
    
    endShape(CLOSE);

    beginShape();
    fill(36,52,95, 128*sin(dCounter/8 % 128));
    //alpha(dCounter % 512);
    for (var i=0; i<=shape2.length/2; i++){
      vertex(shape2[i*2], shape2[i*2+1]);
    }
    
    endShape(CLOSE);


  pop();



  



}






//---------------------------------------
function drawBrain() { //show the brain of whatever genome is currently showing

  strokeWeight(0);
  fill(150,150,150);
  rect(1180, 0, canvas.width, canvas.height);

  var startX = 1170; 
  var startY = 10;
  var w = 450;
  var h = 475;

  if (runBest) {
    population.bestPlayer.brain.drawGenome(startX, startY, w, h);
  } else
  if (humanPlaying) {
    showBrain = false;
  } else if (showBestEachGen) {
    genPlayerTemp.brain.drawGenome(startX, startY, w, h);
  } else {
   
    population.players[0].brain.drawGenomeDetail(startX, startY, w, h, population.getCurrentBest());
 
  }
}
//--------------------------------------
//writes info about the current player
function writeInfo() {
  fill(255);
  stroke(255);
  textAlign(LEFT);
  textSize(30);
  textSize(50);
  //textAlign(CENTER);
  if (showBestEachGen) {
    text(genPlayerTemp.score, canvas.width / 2, 50); //<<<<<<<<<<<<<<replace
    textAlign(LEFT);
    textSize(30);

    text("Gen: " + (genPlayerTemp.gen + 1), 20, 50);
  } else if (humanPlaying) {

    textSize(28);
    strokeWeight(1);
    textFont('Century Gothic');

    text("CAVE: " + humanPlayer.cave.food, 65, 40);
    text("SCORE: " + humanPlayer.score.toFixed(0), 520, 40); 
    text("CAMP: " + humanPlayer.army.camp.food, 930, 40);


  } else if (runBest) {
    text(population.bestPlayer.score, canvas.width / 2, 50); //<<<<<<<<<<replace
    textSize(30);

    textAlign(LEFT);
    text("Gen: " + population.gen, 20, 50);
  } else if (showBest) {
    text(population.players[0].score, canvas.width / 2, 50); //<<<<<<<<<<<<replace
    textAlign(LEFT);
    textSize(30);
    text("Gen: " + population.gen, 20, 50);

  } else {
    var bestCurrentPlayer = population.getCurrentBest();

    textSize(28);
    strokeWeight(1);
    textFont('Century Gothic');

    text("CAVE " + bestCurrentPlayer.cave.food, 65, 40);
    text("SCORE " + bestCurrentPlayer.score.toFixed(0), 520, 40); 
    text("CAMP " + bestCurrentPlayer.army.camp.food, 930, 40);

    fill(255,200,0);
    stroke(255,200,0);
    textSize(26);
    textAlign(LEFT);
    textFont('Century Gothic');
    var frameRate = getFrameRate();
    text("GENERATION " + population.gen, 75, 865);
    text("TEMP " + bestCurrentPlayer.bodyTemp.toFixed(0), 380, 865);
    text("FITNESS " + bestCurrentPlayer.fitness.toFixed(0), 660, 865);
    text("ALIVE " + population.leftAlive, 950, 865);

  }


  
/*   for(var t=0; t<192; t++){
    
    textFont('Arial');
    text(t+155, 1100, 30 + t*24);
    textFont('devlys_020_italic');
    text(String.fromCharCode(t+155), 1150, 30 + t*24);

  } */





}



function keyPressed() {
  switch (key) {
    case 'W':
      if (humanPlaying) {
        humanPlayer.up();
      } 
      break;

    case 'S':
      if (humanPlaying) {
        humanPlayer.down();
      } 
      break; 

    case 'A':
      if (humanPlaying) {
        humanPlayer.left();
      } 
      break;

    case 'D':
      if (humanPlaying) {
        humanPlayer.right();
      } 
      break;

    case '=': //speed up frame rate
      speed += 10;
      frameRate(speed);
      print(speed);
      break;

    case '-': //slow down frame rate
      if (speed > 10) {
        speed -= 10;
        frameRate(speed);
        print(speed);
      }
      break;

    case 'B': //run the best
      runBest = !runBest;
      break;

    case 'G': //show generations
      showBestEachGen = !showBestEachGen;
      upToGen = 0;
      genPlayerTemp = population.genPlayers[upToGen].clone();
      break;

    case 'N': //show absolutely nothing in order to speed up computation
      showNothing = !showNothing;
      break;

    case 'P': //play
      humanPlaying = !humanPlaying;
      humanPlayer = new Player();
      break;
  }

  //any of the arrow keys
  switch (keyCode) {

    case RIGHT_ARROW: //right is used to move through the generations

      if (showBestEachGen) { //if showing the best player each generation then move on to the next generation
        upToGen++;
        if (upToGen >= population.genPlayers.length) { //if reached the current generation then exit out of the showing generations mode
          showBestEachGen = false;
        } else {
          genPlayerTemp = population.genPlayers[upToGen].cloneForReplay();
        }
      }
      break;
  }
}
