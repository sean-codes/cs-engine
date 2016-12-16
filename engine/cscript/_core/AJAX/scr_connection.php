<?php  

$client_uid = $_GET["uid"];
$id = $_GET["id"];
$message = $_GET["message"];
$client_activity = dirname(__FILE__) . "/" . "Activity/" . $client_uid;

switch ( $id )
{
	//Initialize
	case 0:
	{
		$possible_keys = "1234567890qwertyuiopasdfghjklzxcvbnm";
		$key_length = 5;
		$key = "";
		for($i = 0; $i < $key_length; $i++)
		{
			$key = $key . substr($possible_keys, mt_rand(0, strlen($possible_keys)-1), 1); 
		}
		send_response(0, $key);
		break;
	}
	//long poll
	case 1:
	{
		//Rid of known messages
		if(file_exists($client_activity))
		{
			$known_activity = file($client_activity);
			$known_activity = array_slice($known_activity, $message + 1);
			$activity_file = fopen($client_activity, "w");
			if(count($known_activity) > 0)
			{
				fwrite($activity_file, time() . "\r\n");
				for($i = 0; $i < count($known_activity); $i++)
				{
					fwrite($activity_file, $known_activity[$i]);
				}
			}
			else
			{
				fwrite($activity_file, time());
			}
		}
		else
		{
			$activity_file = fopen($client_activity, "w");
			fwrite($activity_file, time());
		}
		fclose($activity_file);
		//Poll!
		$poll_time = time();
		do
		{
			$unknown_activity = file($client_activity);
		}
		while(count($unknown_activity) == 1 && abs($poll_time - time()) < 25);
		//Send messages!
		$response = '';
		for($i = 1; $i < count($unknown_activity); $i++)
		{
			$response = $response . rtrim($unknown_activity[$i], "\r\n") . "#";
		}
		send_response(1, $response);
		break;
	}
	//Incoming message!
	case 2:
	{
		send_broadcast($client_uid, 2, $message);
		break;
	}
	
	case 3:
	{
		$player_info = $client_activity;// . ".info";
		$file = fopen($player_info, "w");
		$info = explode("~", $message);
		for($i = 0; $i < count($info); $i++)
		{
			fwrite($file, $info[$i] . "\r\n");
		}
		fclose($file);
		
		send_multicast($client_uid, 3, $message);
		break;
	}
}

function send_response($id, $response)
{
	echo $id . "#" . $response;
} 

function send_broadcast($client_uid, $id, $goods)
{
	$activity_files = scandir( dirname(__FILE__) . "/" . "Activity" );
	for($i = 0; $i < count($activity_files); $i++)
	{
		$activity_file_path =  dirname(__FILE__) . "/" . "Activity/" . $activity_files[$i];
		if ($activity_files[$i] !== ".." && $activity_files[$i] !== ".")
		{
			$active = file($activity_file_path);
			//If old needs to get the KO
			if( abs($active[0] - time()) > 45 && stristr($activity_files[$i], ".info") == false )
			{
				unlink($activity_file_path);
				unlink($activity_file_path . ".info");
				$player = str_split($activity_files[$i]);
				$player = array_slice($player, (count($player) - 5));
				$player = implode($player);
				send_broadcast($client_uid, 4, $player);
			}
			else
			{
				if (stristr($activity_files[$i], ".info") == false)
				{
					$activity_file = fopen( $activity_file_path, "a");
					fwrite($activity_file, "\r\n" . $client_uid . ">" . $id . ">" . $goods);
					fclose($activity_file);
				}
			}
		}
	}
}
function send_multicast($client_uid, $id, $goods)
{
	global $client_activity;
	$activity_files = scandir( dirname(__FILE__) . "/" . "Activity" );
	for($i = 0; $i < count($activity_files); $i++)
	{
		$activity_file_path =  dirname(__FILE__) . "/" . "Activity/" . $activity_files[$i];
		if ($activity_files[$i] !== ".." && $activity_files[$i] !== "." && $activity_file_path !== $client_activity)
		{
			$active = file($activity_file_path);
			//If old needs to get the KO
			if( abs($active[0] - time()) > 45 && stristr($activity_file_path, ".info") == false)
			{
				unlink($activity_file_path);
				unlink($activity_file_path . ".info");
				$player = str_split($activity_files[$i]);
				$player = array_slice($player, (count($player) - 5));
				$player = implode($player);
				send_broadcast($client_uid, 4, $player);
			}
			else
			{
				if (stristr($activity_files[$i], ".info") == false)
				{
					$activity_file = fopen( $activity_file_path, "a");
					fwrite($activity_file, "\r\n" . $client_uid . ">" . $id . ">" . $goods);
					fclose($activity_file);
				}
			}
		}
	}	
}
?>