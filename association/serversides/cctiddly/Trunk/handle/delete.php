<?php

$cct_base = "../";
include_once($cct_base."includes/header.php");

//return result/message
$title = formatParameters($_REQUEST['title']);

//check for markup
if( !tiddler_markupCheck($user,$title) )
{
	sendHeader(401,"","",1);
}
//get tiddler to check for privilege
$tiddler = db_tiddlers_mainSelectTitle($title);
if( $tiddler===FALSE ) {
	sendHeader(404,"","",1);
	//returnResult("014");
}
//delete current tiddler
if(user_deletePrivilege(user_tiddlerPrivilegeOfUser($user,$tiddler['tags']))) {
	tiddler_delete_new($tiddler['id']);		//delete current tiddler
	sendHeader(200,"","",1);
}else{
	sendHeader(401,"","",1);
}
sendHeader(400,"","",1);

?>