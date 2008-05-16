<?php

echo 'loaded';


class ModulesLoader {
	public $events;
	public $plugins;
	public $tidddlers;
	public $msgHandlers;
	

	public function __construct(){
		$this->events = array();
		$this->plugins = array();
		$this->tidddlers = array();
		$this->msgHandlers = array();
	}	
	
	
	//  These functions populate arrays with module data
	// !! ccT needs to make sure these arrays are processed
	
	public function addPlugin($plugin){
		print_r($plugin);
		array_push($this->plugins,$plugin);
	}
	
	public function addEvent($event){
		print_r($event);
		array_push($this->event,$event);
	}
	
	public function addTiddler($tiddler){
		print_r($tiddler);
		array_push($this->tiddlers,$tiddler);
	}
	
	public function addHandler($msgHandler){
		print_r($msgHandler);
		array_push($this->msgHandlers,$msgHandler);
	}
	
	//
	
	public function readModules(){
		$dir = "modules/";
		include("modules.php");
		// Open a known directory, and proceed to read its contents
		if (is_dir($dir)) {
		    if ($dh = opendir($dir)) {
		       while (($file = readdir($dh)) !== false) {
					if( is_dir($dir.$file))
					{
						//echo $dir.$file."/index.php";
							// check for index.php and remove the ..
							$modulePath = $dir.$file."/index.php";
							if (is_file($modulePath) && $file!=='..')
							{
								include($modulePath);
								echo "module exists";

							}
					}
		    	}
		        closedir($dh);
		    }
		}
	}
	
	public function runModules(){
		global $Modules;
		foreach ($Modules as $module)
		{
			$module->run();
		}		
	}
	
	
}

global $modulesLoader;

$modulesLoader = new ModulesLoader();

$modulesLoader->readModules();

//this needs to make sure plugins and events are loaded by ccT
$modulesLoader->runModules();



?>
