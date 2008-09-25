<?php


//////////////////////////////////////////////////////// check base variable ////////////////////////////////////////////////////////

///// here we are setting a null value to avoid notices in the error logs when it is not used. ////
// cct_base is used to prefix calls to files, 


//////////////////////////////////////////////////////// include files  ////////////////////////////////////////////////////////
//include_once($cct_base."includes/db.".$tiddlyCfg['db']['type'].".php");	//include in config.php
include_once($cct_base."includes/functions.php");
include_once($cct_base."includes/config.php");

if(!isset($cct_base)) 
{
	$cct_base= "";
	debug("cct_base not exist", "params");
}
//include is used because language file is included once in config.php file
include_once($cct_base."includes/tiddler.php");
include_once($cct_base."includes/user.php");

if(!isset($ccT_msg)) 
{
	$ccT_msg= "";
}

if(!isset($workspace)) 
{
	$workspace= "";
	debug("workspace was not set", "fail");
}


//////////////////////////////////////////////////////// parameter check ////////////////////////////////////////////////////////
//?standalone=1, used for making the script standalone form like a regular tiddlywiki
$standalone = ((isset($_GET['standalone'])&&$_GET['standalone']==1)?1:0);		//if 1, will make it into standalone form

//?action=something, used for modulation
$cctAction = (isset($_GET['action'])?format4Name($_GET['action']):"");
debug("cct action is : ".$cctAction, "steps");

//?title="tiddly title", get all version of that tiddly
if( isset($_GET['title']) )
{
	$title = $_GET['title'];
	if( get_magic_quotes_gpc() )
	{
		$title = stripslashes($title);
	}
}
//?config="configfile", force the use of config file "configfile.php" [security check performed in including config file]
//?time=<number>, override the presetted cookie expiry time for PASSWORD ONLY, UNIT: minutes
if( isset($_GET['time']) )
{
	$tiddlyCfg['session_expire'] = (int)$_GET['time'];
}

//?developing=<number>, to enable/disable developing mode via URL
if( $tiddlyCfg['developing']!=1 && $tiddlyCfg['developing']!=0)
{
	if( isset($_GET['developing']) && (int)$_GET['developing']==1 )
	{
		$tiddlyCfg['developing'] = 1;
	}else{
		$tiddlyCfg['developing'] = 0;
	}
}

	
//?tags=+<tag1>-<tag2>, to only see or remove some tags
//	+ means to see tiddlers with this tag
//	- means to not see any tiddlers with this tag, if a tiddler have both + and - tag, it is not shown
if( isset($_GET['tags']) )
{
	//obtain query string
	$q = rawurldecode($_SERVER['QUERY_STRING'] );		//decode signs
	$start = strpos($q,"tags")+5;			//add 5 to remove "tags="
	$end = strpos($q,"&",$start);			//end position with "&"
	
	if( $end !== FALSE && $end>$start )		//truncate string to required value
	{
		$q = substr($q,$start,$end-$start);
	}else{
		$q = substr($q,$start);			//last to end of string if end not found
	}
	$yesTags = array();
	$noTags = array();
	
	//split tags by + and -
	$tags = preg_split('![+-]!', $q, -1, PREG_SPLIT_NO_EMPTY);

	//separate into arrays
	foreach( $tags as $t )
	{
		$signPos = strpos($q,$t)-1;
		if( strcmp($q[$signPos],"-") == 0 )
		{
			$noTags[] = trim($t);
		}else{
			$yesTags[] = trim($t);
		}
	}
}
	
$user = user_create();	
?>