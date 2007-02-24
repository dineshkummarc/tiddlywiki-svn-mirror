/***
|''Name:''|settings|
|''Description:''|Set preferences|
|''~CoreVersion:''|2.1.0|
***/

/*{{{*/
config.views.editor.defaultText = '';
config.options.chkAnimate = false;
config.options.chkSaveBackups = false;
config.options.chkAutoSave = false;
config.options.txtBackupFolder = "backup";
config.options.txtMaxEditRows = 20;

config.options.chkDisableWikiLinks = true;

config.usePreForStorage = true;
config.maxTiddlerImportCount = 10;

config.defaultCustomFields = {
	'server.type':'socialtext',
	'server.host':'www.eu.socialtext.net',
	'server.workspace':'stoss',
	wikiformat:'socialtext'
};

config.options.chkSinglePageMode = false;
config.options.chkTopOfPageMode = false;

config.displayStartupTime = true;
/*}}}*/
