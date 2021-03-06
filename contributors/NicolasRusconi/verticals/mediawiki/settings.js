/***
|''Name:''|settings|
|''Description:''|set preferences|
|''~CoreVersion:''|2.2.0|
|''MediaWiki Host''|<<option txtServerHost>>|
|''MediaWiki sync interval (in minutes)''|<<option txtMediawikiSyncIterval>>|
|''Elements to display per page''|<<option txtElementsPerPage>>|
|''Max Amount of imports''|<<option txtMaxTiddlerImport>>|
***/

/*{{{*/
config.views.editor.defaultText = '';
config.options.chkAnimate = false;
config.options.chkSaveBackups = false;
config.options.chkAutoSave = false;
config.options.txtBackupFolder = "backup";
config.options.txtMaxEditRows = 20;
config.options.chkDisableWikiLinks = true;
config.txtMaxTiddlerImport = 100;
config.options.chkSinglePageMode = false;
config.options.chkTopOfPageMode = false;

merge(config.defaultCustomFields,{
	wikiformat:'mediawiki'
});

//#config.displayStartupTime = true;
/*}}}*/
