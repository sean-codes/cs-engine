/*
obj_console = new Object;

console.number_of_lines = 20;
console.begin_line = 0;
console.line = new Array();
console.string = "";
console.special_key = true;
for (var i=0; i<console.number_of_lines; i++)
{
    console.line[i] = "";
}

document.onkeypress = function(event)
{
	console.key = event.which;
	if (key[37] === true || key[38] === true || key[39] == true || key[40] === true)
	{
		console.special_key = true;
	}
	if(key[8] === true)
	{
		console.string = console.string.slice(0, console.string.length - 1);
        console.special_key = true;
	}
    if (key[13] === true)
    {
        if (console.string !== "")
        {
			if (console.string.charAt(0) == "/")
			{
				check_command(console.string);
			}
			
			send_message(2, console.string);
			
            console.string = "";
		    console.special_key = true;
			
        }
    }
    else if (console.special_key === false)
    {    
        console.ckey = console.key;
        console.string = console.string + String.fromCharCode(console.ckey);
    }
	console.special_key = false;
}

function add_line(message)
{
	for(var i=0; i<console.line.length; i++)
	{
		console.line[console.line.length - i] = console.line[console.line.length - (i+1)];
	}
	console.line[0] = message;
}
function draw_console(lines)
{
	var text_height = 16;
    var total_lines_height = text_height*lines;
    var cy = 16;
    for(var i=0; i<lines; i++)
    {
        draw_text(console.line[i], 0, (total_lines_height - (i*cy)));
    }
}
	
obj_console.create = function(){
    //ctx.drawImage(spr_block, x, y);
}

obj_console.step = function(id, x, y)
{   
    gui_draw_text("FPS: " + real_fps, 0, 8);
    gui_draw_text(console.string, 0, 96);
    draw_console(5);
}
*/