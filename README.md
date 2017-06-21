# CS-Engine
An engine for building 2D games

# Setup
The engine only requires the CSS and Javascript file. This is an example index.html on how I like to start.

    <!DOCTYPE html>
    <html>
        <head>
            <!-- Title/Meta Setup -->
            <title>cs-engine</title>
            <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">

            <!-- Game Engine -->
            <link rel="stylesheet" type="text/css" href="/engine/css.css" />
            <script src='/engine/scr_core.js'></script>

            <!-- Objects -->
            <script src='objects/obj_player.js'></script>

            <!-- Scripts -->
            <script src='scripts/scr_player.js'></script>
         </head>
         <body>
            <!--Game Area-->
            <div id="view"></div>
            <script>
               //Initialize the view
               cs.init('view');

               //Load Sprites
               cs.sprite.load('sprites/spr_player')

               //Camera Settings
               cs.camera.setup({
                  width:144,
                  height:256,
                  maxWidth:300,
                  maxHeight:200,
                  lock: true
               })
               //Room Setup
               cs.room.setup(800, 256);

               cs.room.start = function(){
                  //Create Objects
                  cs.obj.create('obj_player', 50, 50);
               }
            </script>
         </body>
      </html>

# Loading Sprites
Create a folder to hold your sprites or load them from the root directory! These

      cs.sprite.load([Object: options])

      //Example options none are required!
      options = {
         path: [Required String: path to file]
         name: [Optional String (File Name): Override the filename and set sprite name]
         frames: [Optional Number (1): How many frames in the sprite sheet],
         width: [Optional Number (IMG Width): The width of a frame],
         height: [Optional Number (IMG Height): The width of a frame],
         xoff: [Optional Number (0): The horizontal offset when drawing],
         yoff: [Optional Number (0): The vertical offset when drawing]
      }

Now you can call the draw function!

    cs.draw.sprite({
        spr: [Required String: The name of the sprite],
        x: [Required Number: The x position],
        y: [Required Number: the y position],
        width: [Optional Number (Frame Width): The width to draw the sprite],
        height: [Optional Number (Frame Height): The height to draw the sprite],
        scaleX: [Optional Number (1): Horizontal scaling],
        scaleY: [Optional Number (1): Vertical scaling]
    })

# Objects
Objects can be stored in an objects folder. To load a new object create a `.js` file and include it in your index.html

    <script src="cscript/_objects/obj_something.js"></script>

Inside the new JS file you can create the object by using:

    cs.objects['obj_name'] = {
        create: function(){
            this.spr = 'spr_player'
            this.width = 16
            this.height = 16
        },
        step: function(){
    	      cs.draw.sprite('spr', this.x, this.y)
        }
    }

To create the object add after the init() function to cs.obj.create('obj_name', x, y);

    <script type="text/javascript">
        cs.init('view');
        //Game code under here
        cs.obj.create('obj_name', 0, 0);
    </script>

# Drawing Functions
CS Engine has functions for drawing sprites and shapes. You can change settings of the current layer using the set functions.

Sprites:


    cs.draw.sprite(sprite, x, y, frame);
    cs.draw.spriteExt(spriteName, x, y, angle, scaleX=1, scaleY=1, frame=0)

Text:


    cs.draw.text(x, y, str);

Note: Limit text usage for better performance.
Shapes:


    //Rectangle
    cs.draw.rect(x, y, width, height, fill[true/false]);
    //Line
    cs.draw.line(x1, y1, x2, y2);

Set Functions:

    //Color
    cs.draw.setColor("hexvalue");

    //Alpha
    cs.draw.setAlpha(0-1);

    //Line Thickness
    cs.draw.setWidth(decimal);

    //Font
    cs.draw.setFont('Times New Roman 12px');

    //Text Align Horizontal
    cs.draw.setTextHort('center, left, right');

    //Text Align Vertical
    cs.draw.setTextVert('top, bottom, baseline, middle');

    //Text Center vertically and hortizontally
    cs.draw.setTextCenter();

Note: The set function are reset after any drawing event! They are layer specific and the layer resets after each draw event. You should use these right before your drawing event

    //Draw a white filled square
    cs.draw.setColor("#FFFFFF");
    cs.draw.rect(0, 0, 40, 40, true);

# The Game Camera
The game camera is the area the game and GUI is drawn to. The GUI and Game are drawn to hidden canvases separately then drawn to the view/camera canvas. There are a couple settings that can be tweeked to change the view.

The maxWidth and maxHeight set the maximum literal pixel size of the canvas. The engine will then try to get the closest aspect ratio to the size you set. Then it will be stretched with CSS to make fill the entire screen.


    maxWidth : 500
    maxHeight : 400

The scale variables allows scaling the camera. It is not very reliable because it will make drawing blurry. You should rely on the engine automatic scaling. If you would like to make the camera smaller/zoomed in set the maxHeight and maxWidth to lower values.


    //Scale the camera 2 times the size
    cs.camera.scale = 2;
