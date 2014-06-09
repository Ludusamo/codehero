var Game = {};

var player;
var map;
var layer;
var font;
var displayText;

function setText(text) {
	font.text = text;
}

// Main Menu
Game.MainMenu = function(game) {};
Game.MainMenu.prototype = {
	preload:function() {
		game.load.image('title_screen', 'res/img/title_screen.png');
		game.load.image('Font_A', 'res/font/Font_A.png');
	},
	create:function() {
		var background = game.add.image(0, 0, 'title_screen');
		background.scale.set(10, 10);
		background.smoothed = false;

		font = game.add.retroFont('Font_A', 16, 16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.', 26, 0, 0);
		displayText = game.add.image(32, 32, font);
		setText('Physical Journeys');
		var spaceFont = game.add.retroFont('Font_A', 16, 16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.', 26, 0, 0);
		var spaceText = game.add.image(432, 32, spaceFont);
		spaceFont.text = 'Press Space to Begin';
		spaceText.alpha = 0;
		game.add.tween(spaceText).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
	},
	update:function() {
		if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('rowBoat');
		}
	}
};

var textGoing = false;
var textFinished = false;
var textPosition = 0;
var story = new Array();
story[0] = 'Nick: I’m scared, where are we going, Dad?';
story[1] = 'Father: Over to the Indian Camp.';
story[2] = 'Nick: Is dying hard?';
story[3] = 'Father: I think it’s pretty easy.';
function startText() {
	textGoing = true;
	setText(story[textPosition]);
	game.time.events.loop(5000, function() {textPosition++; if (textPosition < 4) setText(story[textPosition]);}, textPosition < 4);
}

Game.rowBoat = function(game) {};
Game.rowBoat.prototype = {
	preload:function(){
		game.load.spritesheet('boatSheet', 'res/spritesheets/boatSheet.png', 64, 32);
		game.load.tilemap('testMap', 'res/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('Tilesheet_A', 'res/spritesheets/Tilesheet_A.png');
	},
	create:function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);

		map = game.add.tilemap('testMap');
		map.addTilesetImage('Tilesheet_A', 'Tilesheet_A');
		layer = map.createLayer('layer');
		layer.debug = true;
		layer.resizeWorld();

		font = game.add.retroFont('Font_A', 16, 16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:?', 26, 0, 0);
		displayText = game.add.image(32, 32, font); 
		displayText.scale.set(.75, .75);
		displayText.fixedToCamera = true;
		setText('Move by alternating LEFT and RIGHT.');

		player = game.add.sprite(0, 16 * 32, 'boatSheet');

		// States for rowing
		player.state = 0; // LEFT

		game.physics.arcade.enable(player);
		player.body.maxVelocity.x = 150;
		player.body.collideWorldBounds = true;
		player.scale.set(2, 2);
		player.smoothed = false;

		cursors = game.input.keyboard.createCursorKeys();

		game.camera.follow(player);
	},
	update:function(){
		game.physics.arcade.collide(player, layer);

		player.body.acceleration.x = 0;
		if (cursors.right.isDown && player.state == 0) {
			player.state = 1;
			player.frame = 1;
		}
		if (cursors.left.isDown && player.state == 1) {
			player.body.acceleration.x = 5000;
			player.state = 0;
			player.frame = 0;
		}
		if (player.body.velocity.x > 0) {
			player.body.velocity.x -= 1;
		} else {
			player.body.velocity.x = 0;
		}
		if (player.x > 10 * 32 && !textGoing) startText();
		if (player.x > 75 * 32) game.state.start('rowBoat');
	}
};