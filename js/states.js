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
			game.state.start('roadTwo');
		}
	}
};

var textGoing = false;
var textFinished = false;
var textPosition = 0;
var story = new Array();

function startText(storyLength) {
	textGoing = true;
	setText(story[textPosition]);
	game.time.events.loop(5000, function() {textPosition++; if (textPosition < storyLength) setText(story[textPosition]);}, textPosition < 4);
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

		story[0] = 'Nick: I’m scared, where are we going, Dad?';
		story[1] = 'Father: Over to the Indian Camp.';
		story[2] = 'Nick: Is dying hard?';
		story[3] = 'Father: I think it’s pretty easy.';
		story[4] = 'Continue right.'	

		textPosition = 0;
		textGoing = false;

		map = game.add.tilemap('testMap');
		map.addTilesetImage('Tilesheet_A', 'Tilesheet_A');
		layer = map.createLayer('layer');
		layer.debug = true;
		layer.resizeWorld();

		font = game.add.retroFont('Font_A', 16, 16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:?\'', 26, 0, 0);
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
		if (player.x > 10 * 32 && !textGoing) startText(5);
		if (player.x > 90 * 32) game.state.start('roadOne');
	}
};

var cart;

Game.roadOne = function(game) {};
Game.roadOne.prototype = {
	preload:function(){
		game.load.spritesheet('cartSheet', 'res/spritesheets/cartSheet.png', 32, 32);
		game.load.spritesheet('playerSheet', 'res/spritesheets/player.png', 16, 32);
		game.load.tilemap('road', 'res/maps/road.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('Tilesheet_A', 'res/spritesheets/Tilesheet_A.png');
	},
	create:function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);

		story[0] = 'Son: Can I ask you something?';
		story[1] = 'Father: Yes. Of course.';
		story[2] = 'Son: Are we going to die?';
		story[3] = 'Father: Sometime. Not now.';
		story[4] = 'Son: And we’re still going south.';
		story[5] = 'Father: Yes.';
		story[6] = 'Son: So we’ll be warm.';
		story[7] = 'Father: Yes.';
		story[8] = 'Son: Okay.';
		story[9] = 'Father: Okay what?';
		story[10] = 'Son: Nothing. Just okay. ';
		story[11] = 'Keep walking.'

		textPosition = 0;
		textGoing = false;

		map = game.add.tilemap('road');
		map.addTilesetImage('Tilesheet_A', 'Tilesheet_A');
		layer = map.createLayer('layer');
		layer.resizeWorld();

		font = game.add.retroFont('Font_A', 16, 16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:?\'', 26, 0, 0);
		displayText = game.add.image(32, 32, font); 
		displayText.scale.set(.75, .75);
		displayText.fixedToCamera = true;
		setText('Move right.');

		player = game.add.sprite(0, (18 * 32) - 16, 'playerSheet');
		player.animations.add('walkRight', [1, 2, 3, 4, 5, 6, 7], 15, true);

		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		player.scale.set(2, 2);
		player.smoothed = false;

		cart = game.add.sprite(32, (18 * 32) - 16, 'cartSheet');
		game.physics.arcade.enable(cart);
		cart.body.collideWorldBounds = true;
		cart.scale.set(2, 2);
		cart.smoothed = false;

		cursors = game.input.keyboard.createCursorKeys();

		game.camera.follow(player);
	},
	update:function(){
		player.body.velocity.x = 0;
		cart.body.velocity.x = 0;
		if (cursors.right.isDown) {
			player.body.velocity.x = 75;
			cart.body.velocity.x = 75;
			player.animations.play('walkRight');
		} else {
			player.animations.stop();
			player.frame = 0;
		}
		if (player.x > 10 * 32 && !textGoing) startText(12);
		if (player.x > 90 * 32) game.state.start('rowBoatTwo');
	}
};

Game.rowBoatTwo = function(game) {};
Game.rowBoatTwo.prototype = {
	preload:function(){

	},
	create:function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);

		story[0] = 'Girlfriend: There’s the old ruin. Remember when it used to be a mill?';
		story[1] = 'Nick: Yeah. I can just remember.';
		story[2] = 'Girlfriend: There’s going to be a moon tonight. ';
		story[3] = 'Nick: You know everything.';
		story[4] = 'Nick: I’ve taught you everything. Love just isn’t fun anymore.';
		story[5] = 'Girlfriend: What?';
		story[6] = 'Nick: The relationship just isn’t fun any more.';
		story[7] = 'Nick: I think we should part ways.';
		story[8] = 'Nick: Where is everyone?';
		story[9] = 'Continue to the Right.';	

		textPosition = 0;
		textGoing = false;

		map = game.add.tilemap('testMap');
		map.addTilesetImage('Tilesheet_A', 'Tilesheet_A');
		layer = map.createLayer('layer');
		layer.debug = true;
		layer.resizeWorld();

		font = game.add.retroFont('Font_A', 16, 16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:?\'', 26, 0, 0);
		displayText = game.add.image(32, 32, font); 
		displayText.scale.set(.75, .75);
		displayText.fixedToCamera = true;
		setText('Move by alternating LEFT and RIGHT.');

		player = game.add.sprite(0, 16 * 32, 'boatSheet');
		player.frame = 3;

		// States for rowing
		player.state = 0; // LEFT
		player.modifier = 1;

		game.physics.arcade.enable(player);
		player.body.maxVelocity.x = 150;
		player.body.collideWorldBounds = true;
		player.scale.set(2, 2);
		player.smoothed = false;

		cursors = game.input.keyboard.createCursorKeys();

		game.camera.follow(player);
	},
	update:function(){
		player.body.acceleration.x = 0;
		if (cursors.right.isDown && player.state == 0) {
			player.state = 1;
			player.frame = 4 + player.modifier;
		}
		if (cursors.left.isDown && player.state == 1) {
			player.body.acceleration.x = 5000;
			player.state = 0;
			player.frame = 2 + player.modifier;
		}
		if (player.body.velocity.x > 0) {
			player.body.velocity.x -= 1;
		} else {
			player.body.velocity.x = 0;
		}
		if (player.x > 10 * 32 && !textGoing) startText(10);
		if (textPosition == 7) player.modifier = 0;
		if (player.x > 175 * 32) game.state.start('roadTwo');
	}
};

var cannibal;

Game.roadTwo = function(game) {};
Game.roadTwo.prototype = {
	preload:function(){
		game.load.image('Tilesheet_A', 'res/spritesheets/Tilesheet_A.png');
		game.load.tilemap('woods', 'res/maps/woods.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.spritesheet('cannibalSheet', 'res/spritesheets/cannibal.png', 16, 32);
	},
	create:function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);

		story[0] = 'Son: Can’t we help him? Papa?';
		story[1] = 'Father: No. We can’t help him.';
		story[2] = 'Father: There’s nothing to be done for him.';
		story[3] = 'Father: It’s alright. We have to run.';
		story[4] = 'Father: Don’t look back. Come on.';
		story[5] = 'Father: You wanted to know what the bad guys looked like.';
		story[6] = 'Father: Now you know. It may happen again.';
		story[7] = 'Father: My job is to take care of you.';
		story[8] = 'Father: i was appointed to do that by God. ';
		story[9] = 'Father: I will kill anyone who touches you. Do you understand?';
		story[10] = 'Son: Yes.';
		story[11] = 'Son: Are we still the good guys?';
		story[12] = 'Father: Yes. We’re still the good guys.';
		story[13] = 'Son: And we always will be.';
		story[14] = 'Father: Yes. We always will be.';
		story[15] = 'Son: Okay.';
		story[16] = 'Keep walking.'

		textPosition = 0;
		textGoing = false;

		map = game.add.tilemap('woods');
		map.addTilesetImage('Tilesheet_A', 'Tilesheet_A');
		layer = map.createLayer('layer');
		layer.resizeWorld();

		font = game.add.retroFont('Font_A', 16, 16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:?\'', 26, 0, 0);
		displayText = game.add.image(32, 32, font); 
		displayText.scale.set(.75, .75);
		displayText.fixedToCamera = true;
		setText('Move right.');

		player = game.add.sprite(64, (35 * 32), 'playerSheet');
		player.animations.add('walkRight', [1, 2, 3, 4, 5, 6, 7], 15, true);

		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		player.scale.set(2, 2);
		player.smoothed = false;

		cart = game.add.sprite(96, (35 * 32), 'cartSheet');
		game.physics.arcade.enable(cart);
		cart.body.collideWorldBounds = true;
		cart.scale.set(2, 2);
		cart.smoothed = false;

		cannibal = game.add.sprite(0, (35 * 32), 'cannibalSheet');
		cannibal.animations.add('walkRight', [1, 2, 3, 4, 5, 6, 7], 15, true);
		game.physics.arcade.enable(cannibal);
		cannibal.body.collideWorldBounds = true;
		cannibal.scale.set(2, 2);
		cannibal.smoothed = false;

		cursors = game.input.keyboard.createCursorKeys();

		game.camera.follow(player);
	},
	update:function(){
		player.body.velocity.x = 0;
		cart.body.velocity.x = 0;
		if (cursors.right.isDown) {
			player.body.velocity.x = 75;
			cart.body.velocity.x = 75;
			cannibal.body.velocity.x = 75;
			player.animations.play('walkRight');
			cannibal.animations.play('walkRight');
		} else {
			player.animations.stop();
			player.frame = 0;
			cannibal.animations.stop();
			cannibal.frame = 0;
		}
		if (player.x > 10 * 32 && !textGoing) startText(17);
		if (textPosition == 5) cannibal.destroy();
		if (player.x > 190 * 32) game.state.start('rowBoatTwo');
	}
};