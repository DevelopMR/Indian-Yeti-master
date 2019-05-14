var player;

var army;

var pauseBecauseDead;
var yetiSprite;
var bestYetiSprite;
var soldierSprite;
var caveSprite;
var campSprite;


var dieOff = false;

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

    yetiSprite = loadImage("images/yeti.png");
    bestYetiSprite = loadImage("images/yeti.png");

    soldierSeeSprite = loadImage("images/soldierSee.png");
    soldierHeatSprite = loadImage("images/soldierHeat.png");
    soldierGhostSprite = loadImage("images/soldierGhost.png");

    caveSprite = loadImage("images/cave.png");
    campSprite = loadImage("images/camp.png");
    backgroundSprite = loadImage("images/background.png");

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

    drawToScreen();

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
function drawToScreen() {
  if (!showNothing) {
    //pretty stuff

    //fill(150,150,150);
    //rect(0, 0, canvas.width, canvas.height);
    image(backgroundSprite, 0, 0, 1180, 900);


    // showAll();
    // updateAll();
    // drawBrain();


  }
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
