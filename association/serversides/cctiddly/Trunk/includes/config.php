<?php

// YOU ARE ATTEMPTING TO USE BROKEN CODE. 

// PLEASE READ THE TOP OF INDEX.PHP


// Initial Database Setup 

$tiddlyCfg['db']['type'] = "mysql";		//sql type
$tiddlyCfg['db']['host'] = "127.0.0.1";		//sql host
$tiddlyCfg['db']['login'] = "root";		//login name
$tiddlyCfg['db']['pass'] = "";		//login password
$tiddlyCfg['db']['name'] = "alpha_upgrade";		//db name
$tiddlyCfg['db']['port'] = "3306"; // db port 


// THIS LATEST CODE VERSION IS BROKEN. 




$tiddlyCfg['adminPassword'] = "";

// User Managment Information 

$tiddlyCfg['pref']['delete_other_sessions_on_login'] = 0; // deletes all previous sessions for a user when they login, set to 0 to allow multiple logins.  
$tiddlyCfg['pref']['renew_session_on_each_request']  = 1; // if enabled will renew users session time on each save request
$tiddlyCfg['users_required_in_db']=0; // users must be in the ccTiddly user database to log in.  designed for LDAP and OpenID, if set to 0 users do not need to be in the db
$tiddlyCfg['can_create_account'] = 1; // users are allowed to register for an account 

// Workspaces

$tiddlyCfg['allow_workspace_creation'] = 1;		//0=disable, 1=allow by public, ( 2=allow by user - not implemented yet) 
$tiddlyCfg['create_workspace'] = 1;  // allow users to create a workspace 
$tiddlyCfg['extract_admin_from_url']=0;// The admin user for each workspace when create will be taken from the URL.  If turned on it means the user SimonMcManus owns the workspace /SimonMcManus/.
$tiddlyCfg['use_mod_rewrite'] = 1;  // 1=using mod_rewrite, 0=pass parameter via ?workspace=name

	
//LDAP

$tiddlyCfg['pref']['ldap_server'] = '127.0.0.1';	
$tiddlyCfg['pref']['ldap_enabled'] = 0;	
$tiddlyCfg['pref']['ldap_username']	= "CN=,OU=functional,OU=btplc,DC=iuser,DC=iroot,DC=adidom,DC=com";
$tiddlyCfg['pref']['ldap_password'] = "";
$tiddlyCfg['pref']['ldap_connection_string'] = "";
$tiddlyCfg['pref']['language'] = "en";

//Deligated Session Managment 
 
$tiddlyCfg['deligate_session_management'] = 0; 	
$tiddlyCfg['pref']['deligate_session_url'] = "http://server...";	

// OpenID

$tiddlyCfg['pref']['openid_enabled'] = 0;  // openid not fully implented yet. 

// Offline Mode 
// .tiddler and .js files to be loaded from the tiddlers directory when the user is takes ccTiddly in offline mode. 


$tiddlyCfg['pref']['offline']['tiddler'] = 
array(	"ccTheme", 
		"smmTheme", 
		"purpleTheme", 
		"taggedTemplateTweak", 
		"ValueSwitcherPlugin"
	);
	
$tiddlyCfg['pref']['offline']['js'] = 
array(	"ccAdaptor",
		"ccLogin"
);

//Proxy Allowed Servers

$tiddlyCfg['allowed_proxy_list'] = 
array(	'wikipedia.org', 
		'google.com', 
		'visualtw.ouvaton.org', 
		'en.wikipedia.org', 
		'wikiedia.org', 
		'martinswiki.com', 
		'tiddly-twab.com', 
		'tiddlywiki.com',
		'tiddlythemes.com', 
		'tiddlytools.com', 
		'tiddlywiki.org', 
		'osmosoft.com', 
		'wiki.osmosoft.com', 
		'tiddlytools.com', 
		'tiddlythemes.com', 
		'wikidev.osmosoft.com', 
		'itw.bidix.info', 
		'127.0.0.1', 
		'localhost', 
		'getteamtasks.com', 
		'mptw.tiddlyspot.com',
		'plugins.tiddlywiki.org',
		'tiddlywiki.abego-software.de'
);
	
// Allowed file upload types	

$tiddlyCfg['upload_allow_extensions'] = 
array(	"text/plain", 
	  	"text/xml", 
		"text/html", 
		"application/msword", 
		"application/mspowerpoint", 
		"application/excel", 
		"application/x-visio", 
		"application/pdf",
		"application/octet-stream"
);

$tiddlyCfg['max_file_size'] = 9933300000;
$tiddlyCfg['only_workspace_admin_can_upload'] = 0; //if enabled only the workspace owner will be able to upload files. If disabled (0) any logged in user can upload files. 

// Skins and Themes 

$tiddlyCfg['workspace_skin'] = 'none'; // allows a workspace to be included when viewing every other workspace on the instance. Set to ='none' if you do not want to use skins
$tiddlyCfg['txtTheme'] = 'purpleTheme';  // The default TiddlyWiki theme to use.

// Debugging Information 

$tiddlyCfg['developing'] =0;		//developing mode. If set to 2 will override debug setting below and output everything into the debug file. 
$tiddlyCfg['debug']['mysql'] = 1;	 // if set to x1 will output every sql query into the logfile 
$tiddlyCfg['debug']['login'] = 0;
$tiddlyCfg['debug']['handle'] = 0;
$tiddlyCfg['debug']['config'] = 0;
$tiddlyCfg['debug']['params'] = 0;
$tiddlyCfg['debug']['fail'] = 0;
$tiddlyCfg['debug']['steps'] = 0;
$tiddlyCfg['debug']['display_logs'] = 0;

// Database Tables

$tiddlyCfg['table']['prefix'] = "";					//	prefix of table name
$tiddlyCfg['table']['suffix'] = "";					//	suffix of table name
$tiddlyCfg['table']['main'] = "tiddler";			//	name of table for storing tiddlers
$tiddlyCfg['table']['backup'] = "tiddler_revisions";	//	backup/versioned tiddlers
$tiddlyCfg['table']['workspace'] = "workspace";		//	settings for cct					
$tiddlyCfg['table']['user'] = "user";				//	username and password
$tiddlyCfg['table']['group'] = "group_membership";	//	group name and membership
$tiddlyCfg['table']['privilege'] = "privileges";	//	privileges
$tiddlyCfg['table']['admin'] = "admin_of_workspace";	//	admin of a particular workspace
$tiddlyCfg['table']['session'] = "login_session";	// stores login session
$tiddlyCfg['table']['workspace_view'] = 'workspace_view'; // used to record each viewing of a workspace


// Other 

$tiddlyCfg['twLanguage'] = "en";	//predefine language
$tiddlyCfg['keep_revision'] = 1;

$tiddlyCfg['tag_tiddler_with_modifier'] = 0;
$tiddlyCfg['char_set'] = "utf8";
$tiddlyCfg['hashseed'] = "aigijgij";
$tiddlyCfg['default_anonymous_perm'] = "AUUU";
$tiddlyCfg['default_user_perm'] = "AADD";
$tiddlyCfg['on_the_fly_workspace_creation'] = 0;
$tiddlyCfg['pref']['utf8'] = 0;	

/*
	This specify whether utf8 is required [1 = enable, 0 =disable]
	If you got one of the following error message, that may mean your database do not support utf8
		during upgrade:
			Query: ALTER TABLE <table name> DEFAULT CHARACTER SET utf8 COLLATE
		during regular running:
			Error Query: SET NAMES 'utf8'
*/
$tiddlyCfg['pref']['forceAnonymous'] = 1;		//if enabled, anonymous users will take "anonymous" as username
$tiddlyCfg['pref']['hashSeed'] = "145tgwg45wg4";		//used to increase security for hashing passwords. Put in a random string withing the double quotes.
$tiddlyCfg['session_expire']=120;// in minutes - If set to 0 will not expire

// Nearly depreciated.

$tiddlyCfg['rss_group'] = "";
$tiddlyCfg['markup_group'] = "";
$tiddlyCfg['tiddlywiki_type'] = "tiddlywiki";
$tiddlyCfg['status'] = "";

	
//  DO NOT EDIT BEYOND THIS POINT .....UNLESS YOU KNOW WHAT YOUR DOING......OR DON'T MIND BREAKING STUFF!









$tiddlyCfg['workspace_name'] = getWorkspaceName($_SERVER, $_REQUEST);
if (isset($_REQUEST["standalone"]) && $_REQUEST["standalone"]==1)
	getOfflineFile();

$tiddlyCfg['pref']['base_folder'] = str_replace('/index.php', '', $_SERVER["SCRIPT_NAME"]);
$tiddlyCfg['pref']['upload_dir'] = $_SERVER['DOCUMENT_ROOT'].$tiddlyCfg['pref']['base_folder'].'/uploads/';  // location of the file upload directory - assumes is it under the root folder 

if(@file($file_location))
{
	readfile($file_location);
	exit;
}

include_once($cct_base."includes/db.".$tiddlyCfg['db']['type'].".php");

// lookup workspace in db. 
db_connect_new();
$workspace_settings = db_workspace_selectSettings();
// return 404 or create workspace
checkWorkspace($workspace_settings, $_POST, $cct_base);
$tiddlyCfg = array_merge($tiddlyCfg, $workspace_settings);
handleDebug($_SERVER);
checkAndAddSlash($_SERVER['REQUEST_URI']);


////////////////////////////////////////////////////users and privileges////////////////////////////////////////////////////


$tiddlyCfg['group']['admin'] = getAdminsOfWorkspace($tiddlyCfg['workspace_name']);


//user allow to upload rss, put in group names here like $tiddlyCfg['privilege_misc']['rss'] = array("<group1>", "<group2>");
$tiddlyCfg['privilege_misc']['rss'] = array("user");
$tiddlyCfg['privilege_misc']['upload'] = array("admin");			//user allow to upload the whole TW or import TW, put in group names here
$tiddlyCfg['privilege_misc']['markup'] = array("admin");			//user allow to change markup

/*	PRIVILEGE SYSTEM
		
The privilege system consist of four character, each represent a different action
	
privilege order
	read/insert/edit/delete

privilege value
	Allow (A)
	Deny (D)
	Undefine/Unchange (U)

Example : 

	for a privilege string "ADAU", the privilege for a particular tiddler to the user would be
	R	READ: allowed		the user is allowed to read
	C	INSERT: deny		the user is NOT allowed to insert a tiddler with a certain tag
	U	EDIT: allowed		the user is allow to edit the tiddler
	D	DELETE: undefined	undefined privilege. This would be replaced by either allowed or deny depending on the config "undefined_privilege"

Notes : 

	* UNDEFINED (normally treated as DENY, see settings below) can be overwrited by ALLOW
	* DENY has the highest priority and could not be overwrite by ALLOW/UNDEFINED
	* If a tiddler has several tag, of which one has deny in one of the privilege, it would be treated as deny on that privilege
	* Rename a tiddler requires EDIT privilege
	* Overwrite one tiddler with new tiddler requires EDIT privilege
	* Overwrite a tiddler(A) with another tiddler(B) require DELETE privilege for tiddler (A) , and EDIT for the overwritting tiddler (B)

*/

//default privileges
$tiddlyCfg['privilege_misc']['undefined_privilege'] = "D";		//defined what should undefined (U) be treated as
$tiddlyCfg['privilege_misc']['default_privilege'] = "UUUU";		//default privilege for all group and tags
//default privileges for certain groups, applied after default_privilege
//		it is in the form: $tiddlyCfg['privilege_misc']['group_default_privilege']['<group name>']
$tiddlyCfg['privilege_misc']['group_default_privilege']['anonymous'] = "ADDD";
$tiddlyCfg['privilege_misc']['group_default_privilege']['anonymous'] = $tiddlyCfg['default_anonymous_perm'];
$tiddlyCfg['privilege_misc']['group_default_privilege']['user'] = $tiddlyCfg['default_user_perm'];


////////////////////////////////////////////////////////ADVANCE PRIVILEGE for tags//////////////////////////////////////////////////////
/*
	assign privilege to specific tag using groups
	this is of the format
		$tiddlyCfg['privilege']['<put your group name here>']['<put your tag name here>'] = "<put your privilege here>";
	EXAMPLE: this would deny anonymous users to insert/edit/delete systemConfig tags but still allow it to run
		$tiddlyCfg['privilege']['anonymous']['systemConfig'] = "ADDD";
*/

$tiddlyCfg['privilege']['admin']['systemConfig'] = "AAAA";
$tiddlyCfg['privilege']['non_admin']['task'] = "AAAA";
$tiddlyCfg['privilege']['anonymous']['task'] = "DDDD";
$tiddlyCfg['privilege']['admin']['task'] = "AAAA";
//The following privilege are for blog

$tiddlyCfg['privilege']['anonymous']['private'] = "DDDD";
$tiddlyCfg['privilege']['anonymous']['comments'] = "AADD";		//allow comments to be post anonymously

// END OF PERMISSIONS 

$tiddlyCfg['version']="1.8";	//set ccTiddly Version number
$tiddlyCfg['session_expire'] = ($tiddlyCfg['session_expire']==0?9999999:$tiddlyCfg['session_expire']);
$tiddlyCfg['session_expire'] = $tiddlyCfg['session_expire'] * 60;  // Converts minutes to seconds to be added to an epoch value 

$tiddlyCfg['table']['main'] = $tiddlyCfg['table']['prefix'].$tiddlyCfg['table']['main'].$tiddlyCfg['table']['suffix'];
$tiddlyCfg['table']['backup'] = $tiddlyCfg['table']['prefix'].$tiddlyCfg['table']['backup'].$tiddlyCfg['table']['suffix'];
$tiddlyCfg['table']['user'] = $tiddlyCfg['table']['prefix'].$tiddlyCfg['table']['user'].$tiddlyCfg['table']['suffix'];
$tiddlyCfg['table']['group'] = $tiddlyCfg['table']['prefix'].$tiddlyCfg['table']['group'].$tiddlyCfg['table']['suffix'];
$tiddlyCfg['table']['privilege'] = $tiddlyCfg['table']['prefix'].$tiddlyCfg['table']['privilege'].$tiddlyCfg['table']['suffix'];
$tiddlyCfg['tiddlywiki_type'] = $cct_base."tiddlywiki/".$tiddlyCfg['tiddlywiki_type'].".js"; // plain TW file, $cct_base defined in config.php

if ($tiddlyCfg['debug']['params']==1 || $tiddlyCfg['developing'] == 2 )
{
	foreach ($_POST as $k => $v) {
		debug($ccT_msg['debug']['postVars'].$k." : ".$v, "params");
	}
	foreach ($_REQUEST as $k => $v) {
		debug($ccT_msg['debug']['requestVars'].$k." : ".$v, "params");
	}
}
?>
