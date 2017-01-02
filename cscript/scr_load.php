<?php
	function list_files($dir, $extension = ''){
		$files = [];
		$readDir = opendir($dir);
		while(($file = readdir($readDir)) == true){
			if( $file !== ".." && $file !== "." ){
				if(is_dir($dir . '/' . $file)){
					$filesInDir = list_files($dir . '/' . $file, $extension);
					$files = array_merge($files, $filesInDir);
				} else {
					if($extension == '' || pathinfo($file, PATHINFO_EXTENSION) == $extension){
						$path = str_replace(dirname(__FILE__) . "/", "" , ($dir . '/' . $file));
						$files[count($files)] = $path;
					}
				}
			}
		}
		return $files;
	}
	//Auto Loading Going to hard code it a bit sorry younger Sean I promise you were more versitile than I am now.
	$core    = list_files(dirname(__FILE__) . '/_core', 'js');
	$events  = array_merge($core, list_files(dirname(__FILE__) . '/_events', 'js'));
	$scripts = array_merge($events, list_files(dirname(__FILE__) . '/_scripts', 'js'));
	$objects = array_merge($scripts, list_files(dirname(__FILE__) . '/_objects', 'js'));
	foreach($objects as $script){
		$rnd = rand();
		echo "<script src='cscript/{$script}?v={$rnd}'></script> \r\n\t\t";
	}

	$sprites = list_files(dirname(__FILE__) . '/_sprites', 'png');
	foreach($sprites as $sprite){
		$sprName = str_replace(".png", "", basename($sprite));
		echo "\r\n \t\t<script>cs.sprite.add('{$sprName}','cscript/{$sprite}')</script>";
	}
?>