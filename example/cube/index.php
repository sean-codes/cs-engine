<!DOCTYPE html>
<html>
	<head>
		<title>Cube-Script</title>
		<!-- View Setup -->
		<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
		<link rel="stylesheet" type="text/css" href="../../engine/css.css?v=1" />

		<!-- Game Engine -->
		<script src='../../engine/scr_core.js'></script>
		<!-- Events -->
		<script src='_events/network.js'></script>
		<!-- Objects -->
		<script src='_objects/obj_block.js'></script>
		<script src='_objects/obj_build.js'></script>
		<script src='_objects/obj_buttons.js'></script>
		<script src='_objects/obj_crate.js'></script>
		<script src='_objects/obj_fire.js'></script>
		<script src='_objects/obj_inventory.js'></script>
		<script src='_objects/obj_joystick.js'></script>
		<script src='_objects/obj_light.js'></script>
		<script src='_objects/obj_otherplayer.js'></script>
		<script src='_objects/obj_player.js'></script>
		<!-- Scripts -->
		<script src='_scripts/compareObj.js'></script>
		<script src='_scripts/lightAdd.js'></script>
		<script src='_scripts/networkRecievedMessage.js'></script>
		<script src='_scripts/networkSendMovement.js'></script>
	</head> 
	<body>
		<!--Game Area-->
		<div id="view"></div>
		<script>
			cs.init('view');

			//Load Sprites
			cs.sprite.load('_sprites/spr_block');
			cs.sprite.load('_sprites/spr_crate');
			cs.sprite.load('_sprites/spr_inventory');
			cs.sprite.load('_sprites/spr_item_rupee');
			cs.sprite.load('_sprites/spr_player', {frames: 2, width:16, height:16});

			cs.global.networkControl = { id: -1, list: {} }
			cs.network.connect({ port:9999, ssl: false });

			cs.obj.create('obj_light', 0, 0);
			cs.obj.create('obj_buttons', 100, 100);
			cs.obj.create('obj_crate', 300, 336);
			cs.obj.create('obj_player', 40, 40);
			
			var tx = 0;
			while(tx < cs.room.width){
				cs.obj.create('obj_block', tx, cs.room.height-16);
				tx += 16;
			}
			
			cs.obj.create('obj_joystick', 100, 100);
			cs.obj.create('obj_inventory', 100, 100);
			cs.obj.create('obj_fire', 150, 375);
		</script>
	</body>
</html>
