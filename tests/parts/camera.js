testUtility.test({
	title: 'cs.camera',
	tests: [
		{
			name: 'setup',
			should: 'initial camera setup width/height/etc',
			pass: function() {
				var checks = [
					{ width: 100, height: 200 }
				]

				for(var check of checks) {
					cs.camera.setup(check)

					if(
						// .width/.height will be changed by the resize
						cs.camera.maxWidth != (check.maxWidth || check.width) ||
						cs.camera.maxHeight != (check.maxHeight || check.height) ||
						cs.camera.smoothing != (check.smoothing || 1)
					) return false
				}

				return true
			}
		},
		{
			name: 'resize',
			should: 'resize the camera not greater than max with/height',
			pass: function() {
				var checks = [
					{ width: 100, height: 200 }
				]

				for(var check of checks) {
					cs.camera.setup(check)
					cs.camera.resize()

					if(
						// .width/.height will be changed by the resize
						cs.camera.width > cs.camera.maxWidth ||
						cs.camera.height > cs.camera.maxHeight
					) return false
				}

				return true
			}
		},
		{
			name: 'follow',
			should: 'set the follow position',
			pass: function() {
				var checks = [
					{ x: 1, y: 1 }
				]

				for(var check of checks) {
					cs.camera.follow(check)

					if(
						cs.camera.followPos.x != check.x ||
						cs.camera.followPos.y != check.y
					) return false
				}

				return true
			}
		},
		{
			name: 'update',
			should: 'attempt to center the camera to follow position',
			pass: function() {
				cs.room.setup({ width:100, height: 100 })
				cs.camera.setup({ width:50, height:100 })
				cs.camera.follow({ x: 50, y: 10 })
				cs.camera.update()

				if(cs.camera.x != 25 || cs.camera.y != 0) return false
				return true
			}
		},
		{
			name: 'outside',
			should: 'return if a rectangle is outside camera',
			pass: function() {
				cs.camera.setup({ width: 50, height: 50 })
				if(
					cs.camera.outside({ x: 0, y: 0, width: 50, height: 50 }) ||
					!cs.camera.outside({ x: -10, y: -10, width: 5, height: 5 })
				) return false

				return true
			}
		}
	]
})
