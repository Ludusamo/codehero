var Game = {};

var player;
var map;
var layer;

// Main Menu
Game.MainMenu = function(game) {};
Game.MainMenu.prototype = {
	preload:function() {
		game.load.spritesheet('playerSheet', 'res/spritesheets/player.png', 16, 16);
		game.load.tilemap('testMap', 'res/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('Tilesheet_A', 'res/spritesheets/Tilesheet_A.png');
	},
	create:function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 300;

		map = game.add.tilemap('testMap');
		map.addTilesetImage('Tilesheet_A', 'Tilesheet_A');
		map.setCollisionBetween(2, 3);
		layer = map.createLayer('layer');
		// layer.resizeWorld();

		player = game.add.sprite(0, 0, 'playerSheet');
		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;

		cursors = game.input.keyboard.createCursorKeys();
	},
	update:function() {
		// game.physics.arcade.collide(player, layer);

		player.body.velocity.x = 0;
		if (cursors.right.isDown) {
			player.body.velocity.x = 100;
		}
		if (cursors.left.isDown) {
			player.body.velocity.x = -100;
		}
		if (cursors.up.isDown && player.body.onFloor()) {
			player.body.velocity.y = -200;
		}
	}
};