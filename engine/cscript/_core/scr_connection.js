request_long = new XMLHttpRequest();
request_short = new XMLHttpRequest();

//initialize();

function initialize()
{
	request_long.open("GET", "Cube_Script/Scripts/AJAX/scr_connection.php?uid=none&id=" + 0 + "&message=getuid", true);
	request_long.send();
}

function new_message(response)
{
	response_array = response.split("#");
	switch ( Number(response_array[0]) )
	{
		//Initialize
		case 0:
		{
			uid = response_array[1];
			long_poll(2);
			break;
		}
		//new message
		case 1:
		{
			response_length = parse_message(response);
			long_poll(response_length);
		}
	}
}

function send_message(id, message)
{
	request_short.open("GET", "Cube_Script/Scripts/AJAX/scr_connection.php?uid=" + uid + "&id=" + id + "&message=" + message, true);
	request_short.send();
}

function long_poll(recieved)
{
	request_long.open("GET", "Cube_Script/Scripts/AJAX/scr_connection.php?uid=" + uid + "&id=" + 1 + "&message=" + recieved, true);
	request_long.send();
}

request_long.onreadystatechange = function()
{
	if ( request_long.readyState == 4)
	{
		//No empty responses!
		if (request_long.responseText.length !== 0)
		{
			document.getElementById("test").innerHTML=request_long.responseText;
			new_message(request_long.responseText);
		}
	}
}

function parse_message(response)
{
	message_length = 0;
	response_array = response.split("#");
	for (i = 0; i < response_array.length; i++)
	{
		get_response = response_array[i].split(">");
		if (get_response.length == 3)
		{
			message_length++;
			switch(Number(get_response[1]))
			{
				//add new typed message
				case 2:
				{
					add_line(get_response[0] + " : " + get_response[2]);
					break;
				}	
				//movement
				case 3:
				{
					split_message = get_response[2].split("~");
					if ( typeof(other_players[get_response[0]]) == "undefined")
					{
						identifier = create(obj_ghost, split_message[1], split_message[2]);
						other_players[get_response[0]] = new Array();
						other_players[get_response[0]].oid = identifier;
						objects[identifier].uid = get_response[0];
					}
					
					var other = objects[other_players[get_response[0]].oid]
					other.direction = split_message[0];
					other.x = Number(split_message[1]);
					other.y = Number(split_message[2]);
					other.up = split_message[4];
					other.down = split_message[6];
					other.left = split_message[3];
					other.right = split_message[5];	
					other.gravity = Number(split_message[7]);
					break;
				}
				//disconnection
				case 4:
				{
					add_line(get_response[2]);
					if (typeof (other_players[get_response[2]]) !== "undefined")
					{
						destroy(other_players[get_response[2]].oid);
					}
					break;
				}
			}
		}
	}
	return message_length;
}
