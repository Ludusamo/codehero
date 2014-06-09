var WIDTH = 800, HEIGHT = 600;
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO,'');

game.state.add('mainMenu', Game.MainMenu, true);
game.state.add('rowBoat', Game.rowBoat);

function preload() {

}

function create() {

}

function update() {

}