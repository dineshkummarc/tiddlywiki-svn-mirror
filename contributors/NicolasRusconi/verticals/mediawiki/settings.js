/***
|''Name:''|settings|
|''Description:''|set preferences|
|''~CoreVersion:''|2.2.0|
|''MediaWiki Host''|<<option txtServerHost>>|
|''MediaWiki sync interval (in minutes)''|<<option txtMediawikiSyncIterval>>|
***/

/*{{{*/
config.views.editor.defaultText = '';
config.options.chkAnimate = false;
config.options.chkSaveBackups = false;
config.options.chkAutoSave = false;
config.options.txtBackupFolder = "backup";
config.options.txtMaxEditRows = 20;
config.options.chkDisableWikiLinks = true;
config.maxTiddlerImportCount = 500;
config.options.chkSinglePageMode = false;
config.options.chkTopOfPageMode = false;

merge(config.defaultCustomFields,{
	wikiformat:'mediawiki'
});

//#config.displayStartupTime = true;
/*}}}*/
