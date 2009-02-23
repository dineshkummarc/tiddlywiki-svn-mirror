<?php

$cct_base = "../";
include_once($cct_base."includes/header.php");
debug($_SERVER['PHP_SELF'], "handle");	

if(!user_session_validate())
{
	debug("failed to validate session.", "save");
	sendHeader("401");
	exit;	
}
$ntiddler = db_tiddlers_mainSelectTitle($_POST['title']);
$ntiddler['title'] = formatParametersPOST($_POST['title']);

$tiddlyCfg['workspace_name'] = formatParametersPOST($_POST['workspace']);
$ntiddler['modifier'] = formatParametersPOST($_POST['modifier']);
$ntiddler['modified'] = formatParametersPOST($_POST['modified']);
$ntiddler['created'] = formatParametersPOST($_POST['created']); 

$ntiddler['tags'] = formatParametersPOST($_POST['tags']);

$ntiddler['body'] =  formatParametersPOST($_POST['body']);
$ntiddler['revision'] = formatParametersPOST($_POST['revision']);

$ntiddler['fields'] = formatParametersPOST($_POST['fields']);
$tiddler['id'] = $_POST['id'];

if(@$pluginsLoader->events['preSave']) 
{
	foreach (@$pluginsLoader->events['preSave'] as $event)
	{
		if(is_file($event)) {
			include($event);
		}	
		
	}
}				

if($tiddler['id']!="undefined")
{
	if($tiddler['revision'] >= $_POST['revision'] ) {		//ask to reload if modified date differs
		debug($ccT_msg['debug']['reloadRequired'], "save");
		sendHeader(409);
		exit;
	}
		//require edit privilege on new and old tags			
	if(user_editPrivilege(user_tiddlerPrivilegeOfUser($user,$ntiddler['tags'])) && user_editPrivilege(user_tiddlerPrivilegeOfUser($user,$otiddler['tags'])))
	{
		$ntiddler['modified'] = $ntiddler['modified']; 
		$ntiddler['creator'] = $otiddler['creator'];
		$ntiddler['created'] = $otiddler['created'];
		debug("Attempting to update server...");
		unset($ntiddler['workspace_name']); 	// hack to remove the workspace being set twice. 
		if(tiddler_update_new($tiddler['id'], $ntiddler)) {
			sendHeader(201);
			echo $tiddler['id'];
		}
	}else{
		debug("Permissions denied to save.", "save");
		sendHeader(400);	
	}
}else{
	//This Tiddler does not exist in the database.
	if( user_insertPrivilege(user_tiddlerPrivilegeOfUser($user,$ntiddler['tags'])) ) 
	{
		debug("Inserting New Tiddler...", "save");
		$ntiddler['creator'] = $ntiddler['modifier'];
		$ntiddler['created'] = $ntiddler['modified'];
		$ntiddler['revision'] = 1;
		unset($ntiddler['workspace_name']); 	// hack to remove the workspace being set twice. 
		if($id = tiddler_insert_new($ntiddler))
		{
			sendHeader(201);
			echo $id;
		}
	}else{
		sendHeader(400);
	}
}

?>
