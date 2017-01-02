#CS-Engine
An engine for building 2D games

#Setup
The engine is three main parts. The Style Sheet, the loader/compiler PHP script, and the JavaScript init function.

    <html>
       <head>
           <link rel="stylesheet" type="text/css" href="css.css">
       </head>
       <body>
           <div id='view'></div>
           <script>
               cs.init();
           </script>
       </body>
    <html>

After the init function is where we will create objects or load maps.

#Loading Sprites
Sprites are stored in the _sprites folder and automatically loaded by the load.php.

The file name is used to define properties of the sprite

    [spr_name]-[frames]-[width]-[height]-[x-origin]-[y-origin].png

This will be loaded:

     cs.sprite.add('spr-1-32-48-0-0','path/spre-1-32-48-0-0.png')

This image will now be usable: 

     cs.draw.sprite('spr', frame, x, y);

Use -1 as the frame argument to animate the sprite.

#Objects
Objects are stored in the _objects folder. To create a new object create a new js file in the _objects folder. The files in this folders will be loaded by the load.php at runtime.

    <script src="cscript/_objects/obj_something.js?"></script>

Inside the new js file you will need to create the object by using:


    cs.obj.create(name, createFunction, stepFunction)

Copy this into your new js file and change the 'obj_name' string to the name of your object.


    cs.obj.load('obj_name', function(){
        //-------------------------------------------------------------------------------------------//
        //-------------------------------------| Create |--------------------------------------------//
        //-------------------------------------------------------------------------------------------//
        this.width = 16;
        this.height = 16;
    }, function(){
        //-------------------------------------------------------------------------------------------//
        //--------------------------------------| Step |---------------------------------------------//
        //-------------------------------------------------------------------------------------------//
    	cs.draw.sprite('spr', 0, this.x, this.y);
    });

To create the object add after the init() function to cs.obj.create('obj_name', x, y);

    <script type="text/javascript">
        cs.init('view');
        //Game code under here
        cs.obj.create('obj_name', 0, 0);
    </script>

#Drawing Functions
CS Engine has functions for drawing sprites and shapes. You can change settings of the current layer using the set functions.

Sprites:


    cs.draw.sprite(sprite, frame, x, y);
    cs.draw.spriteExt(img, frame, x, y, angle);

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

#The Game Camera
The game camera is the area the game and GUI is drawn to. The GUI and Game are drawn to hidden canvases separately then drawn to the view/camera canvas. There are a couple settings that can be tweeked to change the view.

The maxWidth and maxHeight set the maximum literal pixel size of the canvas. The engine will then try to get the closest aspect ratio to the size you set. Then it will be stretched with CSS to make fill the entire screen.


    maxWidth : 500
    maxHeight : 400

The scale variables allows scaling the camera. It is not very reliable because it will make drawing blurry. You should rely on the engine automatic scaling. If you would like to make the camera smaller/zoomed in set the maxHeight and maxWidth to lower values.


    //Scale the camera 2 times the size
    cs.camera.scale = 2;

