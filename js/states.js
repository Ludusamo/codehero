var Game = {};

var player;
var map;
var layer;
var font;
var displayText;

// Main Menu
Game.MainMenu = function(game) {};
Game.MainMenu.prototype = {
	preload:function() {
		game.load.spritesheet('playerSheet', 'res/spritesheets/player.png', 32, 32);
		game.load.tilemap('testMap', 'res/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('Tilesheet_A', 'res/spritesheets/Tilesheet_A.png');
		game.load.image('Font_A', 'res/font/Font_A.png');
	},
	create:function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 1000;

		map = game.add.tilemap('testMap');
		map.addTilesetImage('Tilesheet_A', 'Tilesheet_A');
		map.setCollisionBetween(2, 3);
		layer = map.createLayer('layer');
		layer.debug = true;
		layer.resizeWorld();

		font = game.add.retroFont('Font_A', 16, 16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.', 26, 0, 0);
		game.add.image(32, 32, font).fixedToCamera = true;
		font.text = 'test';

		player = game.add.sprite(0, 0, 'playerSheet');
		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		player.scale.set(2, 2);
		player.smoothed = false;

		cursors = game.input.keyboard.createCursorKeys();

		game.camera.follow(player);
	},
	update:function() {
		game.physics.arcade.collide(player, layer);

		player.body.velocity.x = 0;
		if (cursors.right.isDown) {
			player.body.velocity.x = 100;
		}
		if (cursors.left.isDown) {
			player.body.velocity.x = -100;
		}
		if (cursors.up.isDown && player.body.onFloor()) {
			player.body.velocity.y = -500;
		}
	}
};