<?php

$workspace_settings_count=count($workspace_settings);
if($tiddlyCfg['on_the_fly_workspace_creation']==1)
{
	if(user_session_validate())	
	{
		include_once($cct_base."includes/workspace.php");
		if ($workspace_settings_count < 1)
		{
			if ($tiddlyCfg['extract_admin_from_url']==1)
			{
				$username = $tiddlyCfg['workspace_name'];
				// FOR uVoke
				// this code is uVoke specific and should be moved to a module in version 1.7
				// This if statement simply turn the setting off by default. 
				if (12 == 12)
				{
					$full_workspace_name = str_replace(str_replace("index.php", "", $_SERVER['PHP_SELF']), "", $_SERVER['REQUEST_URI']);
					$ws_name_array = explode("/", $full_workspace_name); 
		 			$username =  $ws_name_array[1]."@".$ws_name_array[0];	
				}
				// END OF FOR uVoke			
			}

			workspace_create($tiddlyCfg['workspace_name'], "ADDD", $username);
			$workspace_settings = db_workspace_selectSettings();
			$workspace_settings_count = count($workspace_settings);

		
		}
	}
}else
{	
	if ($workspace_settings_count < 1)
	{   
		// workspace does not exist\
		// this variable is later used in includes/ccVariables.php
	
		foreach ($modulesLoader->plugins as $plugin)
		{
			if(is_file($cct_base."modules/".$plugin))
				include_once($cct_base."modules/".$plugin);	
		}

		if($modulesLoader->events['returnNotFound'])
		{
			foreach ($modulesLoader->events['returnNotFound'] as $event)
			{
				if(is_file("modules/".$event))
					include_once("modules/".$event);	
			}
		}
				
			$error404 = true;		
			$theme = "simple";
		
	}
}

if (isset($_POST['logout']) || isset($_REQUEST['logout']))
{
	if($tiddlyCfg['pref']['base_folder']!="/")
		$base = "/";
	user_logout('You have logged out.');
	if($tiddlyCfg['use_mod_rewrite']==0)
		header('Location:'.getURL().$base.'?workspace='.$_REQUEST['workspace']);
	else
		header('Location:'.getURL().$base.$_REQUEST['workspace']);
}
///////////////////////////////CC: user variable defined in header and $user['verified'] can be used directly to check user validation
 // check to see if user is logged in or not and then assign permissions accordingly. 
//if ($user['verified'] = user_session_validate())
$user['verified'] = user_session_validate();
if ($user['verified']){
 	$workspace_permissions = user_tiddlerPrivilegeOfUser($user);
	if(in_array("admin", $user['group']))
		$workspace_permissions = "AAAA";
}else{
	$workspace_permissions = $tiddlyCfg['default_anonymous_perm'];
}

if($workspace_permissions == ""){
	$workspace_permissions = "DDDD";
}

//////////////
//  Can this use an existing function ?!?!?!

//  SET WORKSPACE CREATE PERMISSION FLAG
// DEBUG
echo $workspace_permissions;
if (substr($workspace_permissions, 1, 1) == "U")
{
	$workspace_create = $tiddlyCfg['privilege_misc']['undefined_privilege'];
}else{

	$workspace_create = substr($workspace_permissions, 1, 1);
}
//echo $workspace_create;

//  SET WORKSPACE READ PERMISSION FLAG
if (substr($workspace_permissions, 0, 1) == "U")
{
	$workspace_read = $tiddlyCfg['privilege_misc']['undefined_privilege'];
}else{
	$workspace_read = substr($workspace_permissions, 0, 1);
}

//  SET WORKSPACE UDATE PERMISSION FLAG
if (substr($workspace_permissions, 2, 1) == "U")
{
	$workspace_udate = $tiddlyCfg['privilege_misc']['undefined_privilege'];
}else{
	$workspace_udate = substr($workspace_permissions, 2, 1);
}


//  SET WORKSPACE DELETE PERMISSION FLAG
if (substr($workspace_permissions, 3, 1) == "U")
{
	$workspace_delete = $tiddlyCfg['privilege_misc']['undefined_privilege'];
}else{
	$workspace_delete = substr($workspace_permissions, 3, 1);
}

//
////////////////////////////////////////////

//echo $user['verified'];
//echo $workspace_permissions;

// display open id bits if it is enabled. 
if ($tiddlyCfg['pref']['openid_enabled'] ==1)
{
		require_once "includes/openid/common.php";	
}

?>