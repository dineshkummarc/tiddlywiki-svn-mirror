/***
|''Name:''|ZiddlyWikiChannelPlugin|
|''Description:''|Channel for moving data to and from ZiddlyWikis|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com)|
|''Source:''|http://martinswiki.com/martinsprereleases.html#ZiddlyWikiChannelPlugin|
|''Subversion:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/plugins|
|''Version:''|0.0.5|
|''Date:''|Dec 30, 2006|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.2.0|

|''Default ZiddlyWiki Server''|<<option txtZiddlyWikiDefaultServer>>|
|''Default ZiddlyWiki Web(workspace)''|<<option txtZiddlyWikiDefaultWorkspace>>|
|''Default ZiddlyWiki username''|<<option txtZiddlyWikiUsername>>|
|''Default ZiddlyWiki password''|<<option txtZiddlyWikiPassword>>|

***/

//{{{
if(!config.options.txtZiddlyWikiDefaultServer)
	{config.options.txtZiddlyWikiDefaultServer = 'www.Ziddlywiki.org';}
if(!config.options.txtZiddlyWikiDefaultWorkspace)
	{config.options.txtZiddlyWikiDefaultWorkspace = '';}
if(!config.options.txtZiddlyWikiUsername)
	{config.options.txtZiddlyWikiUsername = '';}
if(!config.options.txtZiddlyWikiPassword)
	{config.options.txtZiddlyWikiPassword = '';}
//}}}

// Ensure that the plugin is only installed once.
if(!version.extensions.ZiddlyWikiChannelPlugin) {
version.extensions.ZiddlyWikiChannelPlugin = {installed:true};

ZiddlyWikiChannel = {}; // 'namespace' for local functions

// get
// http://www.ziddlywiki.com/ZiddlyWiki?action=get&id=News
/*
News
[[Version 2.0.11.4]] has been released.\n\n[[Version 2.0.11.3]] has been released.\n\n[[Version 2.0.11.2]] has been released.\n\nWith this version the maintainership has changed.  Tim Morgan has retired and development has merged with the main TiddlyWiki systems at http://trac.tiddlywiki.org.  We are thankful to retain hosting by [[Zettai|http://zettai.net]].\n
BobMcElrath
200609051750
200601051659
about protected

871.64174.18161.45875
*/
ZiddlyWikiChannel.getTiddler = function(title,params)
{
	title = encodeURIComponent(title);
//#displayMessage('Ziddly.getTiddler');
// http://www.ziddlywiki.com/ZiddlyWiki?action=get&id=News

	var urlTemplate = 'http://%0/ZiddlyWiki?action=get&id=%1';
	var url = urlTemplate.format([params.serverHost,title]);
//#displayMessage('getZiddlyWwiki url: '+url);
// http://www.ziddlywiki.org/ZiddlyWiki?action=get&id=ZiddlyWiki

	params.title = title;
	params.serverType = 'ziddlywiki';
	var req = doHttp('GET',url,null,null,null,null,ZiddlyWikiChannel.getTiddlerCallback,params,null);
//#displayMessage("req:"+req);
};

/*
News
[[Version 2.0.11.4]] has been released.\n\n[[Version 2.0.11.3]] has been released.\n\n[[Version 2.0.11.2]] has been released.\n\nWith this version the maintainership has changed.  Tim Morgan has retired and development has merged with the main TiddlyWiki systems at http://trac.tiddlywiki.org.  We are thankful to retain hosting by [[Zettai|http://zettai.net]].\n
BobMcElrath
200609051750
200601051659
about protected
*/
ZiddlyWikiChannel.getTiddlerCallback = function(status,params,responseText,xhr)
{
//#displayMessage('Ziddly.getTiddlerCallback status:'+status);
//#displayMessage('rt:'+responseText.substr(0,50));
//#displayMessage('xhr:'+xhr);
	if(status && responseText.substr(0,1)!='-') {
		var x = responseText.split('\n');
		var content = x[1];
		content = content.unescapeLineBreaks();
		var tiddler = store.createTiddler(params.title);
		tiddler.updateFieldsAndContent(params,content);
		try {
			tiddler.modifier = x[2];
			if(x[3])
				tiddler.created = Date.convertFromYYYYMMDDHHMM(x[3]);
			if(x[4])
				tiddler.modified = Date.convertFromYYYYMMDDHHMM(x[4]);
			tiddler.tags = x[5];
		} catch(ex) {
		}
		store.updateStory(tiddler);
	}
	//#else {
	//#	displayMessage('Error:'+responseText.substr(0,50));
	//#	displayMessage('putXh:'+xhr);
	//#}
};

ZiddlyWikiChannel.getTiddlerRevisionList = function(title,params)
// get a list of the revisions for a tiddler
{
	title = encodeURIComponent(title);
//#displayMessage('Ziddly.getTiddlerRevisionList');
// http://www.ziddlywiki.com/ZiddlyWiki?action=get_revisions&id=News
	//ajax.get('?action=get_revisions&id=' + encodeURIComponent(title) + '&' + zw.no_cache(), callback);

	var urlTemplate = 'http://%0/ZiddlyWiki?action=get_revisions&id=%1';
	var url = urlTemplate.format([params.serverHost,title]);
//#displayMessage('getZiddlyWwiki url: '+url);
// http://www.ziddlywiki.org/ZiddlyWiki?action=get_revisions&id=ZiddlyWiki

	params.title = title;
	params.workspace = null;
	params.serverType = 'ziddlywiki';
	var req = doHttp('GET',url,null,null,null,null,ZiddlyWikiChannel.getTiddlerRevisionListCallback,params,null);
//#displayMessage("req:"+req);
};

ZiddlyWikiChannel.getTiddlerRevisionListCallback = function(status,params,responseText,xhr)
{
//#displayMessage('Ziddly.getTiddlerRevisionListCallback status:'+status);
//#displayMessage('rt:'+responseText.substr(0,50));
//#displayMessage('xhr:'+xhr);
//#displayMessage('callback:'+params.callback);
	params.revisions = [];
	var r =  responseText;
	if(r != '-') {
		var revs = r.split('\n');
		for(var i=0; i<revs.length; i++) {
			var parts = revs[i].split(' ');
			if(parts.length>1) {
				params.revisions[i] = {};
				params.revisions[i].modified = Date.convertFromYYYYMMDDHHMM(parts[0]);
				params.revisions[i].key = parts[1];
			}
		}
	}
	params.callback(params);
};

ZiddlyWikiChannel.getTiddlerRevision = function(title,revision,src,updateTimeline)
{
	title = encodeURIComponent(title);
	var tiddler = store.fetchTiddler(title);
	if(tiddler.fields.serverPageRevision == revision)
		return;
	zw.status('loading...');
	revision = revision ? '&revision=' + revision : '';
	updateTimeline = updateTimeline ? '&updatetimeline=1' : '';
	//ajax.get('?action=get&id=' + encodeURIComponent(title) + revision + updateTimeline + '&' + zw.no_cache(),displayTiddlerRevisionCallback)
};

ZiddlyWikiChannel.getTiddlerRevisionCallback = function(status,params,responseText,xhr)
{
	//#displayMessage('getTiddlerRevisionCallback status:'+status);
	//#displayMessage('rt:'+responseText.substr(0,50));
	//#displayMessage('xhr:'+xhr);
	var encoded = responseText;
	if(encoded.indexOf('\n') > -1) {
		var parts = encoded.split('\n');
		var tiddler = new Tiddler();
		var title = parts[0];
		tiddler.set(title,Tiddler.unescapeLineBreaks(parts[1].htmlDecode()),parts[2],
				Date.convertFromYYYYMMDDHHMM(parts[3]),parts[5],
				Date.convertFromYYYYMMDDHHMM(parts[4]));
		tiddler.revisionKey = parts[7];
		store.addTiddler(tiddler);
		story.refreshTiddler(title,DEFAULT_VIEW_TEMPLATE,true);
		if(parts[6] == 'update timeline')
			store.notify('TabTimeline',true);
	} else if(encoded != '-') {
		alert(encoded); // error message
	}
	zw.status(false);
};

ZiddlyWikiChannel.putTiddler = function(title,params)
{
	var content = store.fetchTiddler(title).text;
	title = encodeURIComponent(title);
	var urlTemplate = 'http://%0/RPC2/';
	var url = urlTemplate.format([params.serverHost,params.workspace,encodeURIComponent(title)]);
//#displayMessage('putZiddlyWwiki url: '+url);

	params.title = title;
	params.serverHost = server;
	params.workspace = workspace;
	params.serverType = 'ziddlywiki';
	var req =doHttp('POST',url,payload,null,params.username,params.password,ZiddlyWikiChannel.putTiddlerCallback,params);
//#displayMessage("req:"+req);
};

ZiddlyWikiChannel.putTiddlerCallback = function(status,params,responseText,xhr)
{
	displayMessage('putTiddlerCallback status:'+status);
	displayMessage('rt:'+responseText.substr(0,50));
	//#displayMessage('xhr:'+xhr);
};


config.hostFunctions.getTiddler['ziddlywiki'] = ZiddlyWikiChannel.getTiddler;
config.hostFunctions.getTiddlerRevisionList['ziddlywiki'] = ZiddlyWikiChannel.getTiddlerRevisionList;
config.hostFunctions.getTiddlerRevision['ziddlywiki'] = ZiddlyWikiChannel.getTiddlerRevision;
//config.hostFunctions.putTiddler['ziddlywiki'] = ZiddlyWikiChannel.putTiddler;

} // end of 'install only once'
//}}}
