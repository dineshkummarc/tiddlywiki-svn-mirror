/***
|''Name:''|RevisionAdaptorPlugin|
|''Description:''|Adaptor for working with a tiddler revision store|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com)|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/adaptors/RevisionAdaptorPlugin.js |
|''Version:''|0.0.6|
|''Date:''|Jun 11, 2008|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]] |
|''~CoreVersion:''|2.4.0|

***/

//{{{
//# Ensure that the plugin is only installed once.
if(!version.extensions.RevisionAdaptorPlugin) {
version.extensions.RevisionAdaptorPlugin = {installed:true};

function RevisionAdaptor()
{
	this.host = null;
	this.workspace = null;
	return this;
}

RevisionAdaptor.serverType = 'revision';
RevisionAdaptor.isLocal = true;
RevisionAdaptor.errorInFunctionMessage = 'Error in function RevisionAdaptor.%0: %1';
RevisionAdaptor.revisionSavedMessage = 'Revision %0 saved';
RevisionAdaptor.baseRevision = 1000;

RevisionAdaptor.prototype.setContext = function(context,userParams,callback)
{
	if(!context) context = {};
	context.userParams = userParams;
	if(callback) context.callback = callback;
	context.adaptor = this;
	if(!context.host)
		context.host = this.host;
	if(!context.workspace)
		context.workspace = this.workspace;
	return context;
};

RevisionAdaptor.fullHostName = function(host)
{
	if(!host)
		return '';
	host = host.trim();
	if(!host.match(/:\/\//))
		host = 'file://' + host;
	if(host.substr(host.length-1) != '/')
		host = host + '/';
	return host;
};

RevisionAdaptor.minHostName = function(host)
{
	return host ? host.replace(/\\/,'/').host.replace(/^http:\/\//,'').replace(/\/$/,'') : ''; //'
};

RevisionAdaptor.prototype.openHost = function(host,context,userParams,callback)
{
//#displayMessage('openHost:'+host);
	this.host = RevisionAdaptor.fullHostName(host);
	context = this.setContext(context,userParams,callback);
//#displayMessage('host:'+this.host);
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

RevisionAdaptor.prototype.openWorkspace = function(workspace,context,userParams,callback)
{
//#displayMessage('openWorkspace:'+workspace);
	this.workspace = workspace;
	context = this.setContext(context,userParams,callback);
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

RevisionAdaptor.prototype.getWorkspaceList = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
//#displayMessage('getWorkspaceList');
	var list = [];
	list.push({title:'Main',name:'Main'});
	context.workspaces = list;
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

RevisionAdaptor.prototype.getTiddlerList = function(context,userParams,callback)
{
//#console.log('RevisionAdaptor.getTiddlerList');
	context = this.setContext(context,userParams,callback);
	var path = RevisionAdaptor.contentPath();
	var entries = null;//this.dirList(path);
	if(entries) {
		context.status = true;
		var list = [];
		var hash = {};
		for(var i=0; i<entries.length; i++) {
			var title = entries[i].name;
			if(title.match(/\.tiddler$/)) {
				title = title.replace(/\.tiddler$/,'');
				title = title.replace(/_/g,' ').replace(/%09/g,'\t').replace(/%23/g,'#').replace(/%2a/g,'*').replace(/%2c/g,',').replace(/%2f/g,'/').replace(/%3a/g,':').replace(/%3c/g,'<').replace(/%3e/g,'>').replace(/%3f/g,'?').replace(/%25/g,'%');
				var tiddler = new Tiddler(title);
				tiddler.modified = entries[i].modified;
				list.push(tiddler);
				hash[title] = tiddler;
			}
		}
		context.tiddlers = list;
		context.content = hash;
	} else {
		context.status = false;
		context.statusText = RevisionAdaptor.errorInFunctionMessage.format(['getTiddlerList']);
	}
	if(context.callback)
		window.setTimeout(function() {callback(context,userParams);},0);
	return context;
};

RevisionAdaptor.prototype.getTiddlerRevisionList = function(title,limit,context,userParams,callback)
// get a list of the revisions for a tiddler
{
//#console.log('RevisionAdaptor.getTiddlerRevisionList');
	context = this.setContext(context,userParams,callback);
	context.dateFormat = 'YYYY mmm 0DD 0hh:0mm:0ss';
//#console.log(tiddler);
	context.revisions = [];
	context.status = true;
	var t = store.getTiddler(title);
	var uuid = t.fields.uuid;
	var entries = revisionStore.fileRevisionsSorted(uuid);
	if(entries) {
//#console.log('ec:'+entries.length);
//#console.log('uuid:'+uuid);
		var list = [];
		for(var i=0; i<entries.length; i++) {
			var tiddler = revisionStore.getTiddler(entries,i,uuid);
			if(tiddler)
				list.push(tiddler);
		}
		context.revisions = list;
	} else {
		context.status = false;
		context.statusText = RevisionAdaptor.errorInFunctionMessage.format(['getTiddlerList']);
	}
	if(context.callback) {
		//# direct callback doesn't work, not sure why
		//#context.callback(context,context.userParams);
		window.setTimeout(function() {callback(context,userParams);},0);
	}
};

RevisionAdaptor.prototype.generateTiddlerInfo = function(tiddler)
{
	var info = {};
	var uriTemplate = '%0#%1';
	var host = RevisionAdaptor.fullHostName(this.host);
	info.uri = uriTemplate.format([host,tiddler.title]);
	return info;
};

RevisionAdaptor.prototype.getTiddlerRevision = function(title,revision,context,userParams,callback)
{
//#displayMessage('RevisionAdaptor.getTiddlerRev:' + context.modified);
	context = this.setContext(context,userParams,callback);
	if(revision)
		context.revision = revision;
	return this.getTiddler(title,context,userParams,callback);
};

RevisionAdaptor.prototype.getTiddler = function(title,context,userParams,callback)
{
//#console.log('RevisionAdaptor.getTiddler:',title,'rev:',context.revision);
	context = this.setContext(context,userParams,callback);
	if(title)
		context.title = title;
	var t = store.getTiddler(title);

	context.status = false;
	context.statusText = RevisionAdaptor.errorInFunctionMessage.format(['getTiddler',title]);

	if(context.revision) {
		var uuid = t.fields.uuid;
		var entries = revisionStore.fileRevisionsSorted(uuid);
		if(entries) {
			var revisionIndex = parseInt(context.revision,10);
			var tiddler = revisionStore.getTiddler(entries,revisionIndex,uuid);
			if(tiddler) {
				context.tiddler = tiddler;
				context.status = true;
				context.statusText = '';
			}
		}
	} else {
		context.tiddler = t;
		context.status = true;
		context.statusText = '';
	}
	if(context.callback)
		window.setTimeout(function() {callback(context,userParams);},0);
	return context.status;
};

RevisionAdaptor.prototype.close = function() {return true;};

config.adaptors[RevisionAdaptor.serverType] = RevisionAdaptor;
} //# end of 'install only once'
//}}}
