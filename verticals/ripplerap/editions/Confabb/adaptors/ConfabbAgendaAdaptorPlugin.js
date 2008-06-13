/***
|''Name:''|ConfabbAgendaAdaptorPlugin|
|''Description:''|Load RippleRap Agenda from a Confabb.com URI|
|''Author:''|Paul Downey (psd (at) osmosoft (dot) com)|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/PaulDowney/adaptors/ConfabbAgendaAdaptorPlugin.js|
|''Version:''|0.1|
|''Date:''|May 11, 2008|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.4.0|
***/

//{{{
//# Ensure that the plugin is only installed once.
if(!version.extensions.ConfabbAgendaAdaptorPlugin) {
version.extensions.ConfabbAgendaAdaptorPlugin = {installed:true};

function ConfabbAgendaAdaptor()
{
	this.host = null;
	this.store = null;
	return this;
}

ConfabbAgendaAdaptor.serverType = 'confabbagenda';
ConfabbAgendaAdaptor.serverParsingErrorMessage = "Error parsing result from server";
ConfabbAgendaAdaptor.errorInFunctionMessage = "Error in function ConfabbAgendaAdaptor.%0";
ConfabbAgendaAdaptor.emptyFeed = "No Confabb Agenda Items Found";

String.prototype.makeId = function() {
	return this.replace(/[^A-Za-z0-9]+/g, "");
};


/*
 *  takes a Confabb Agenda, returns list of tiddlers
 */
ConfabbAgendaAdaptor.parseAgenda = function(responseText)
{
	var tiddlers = [];
	speakers = {};
	log("parsing the Confabb Agenda");

	if (responseText.match('/<!DOCTTYPE +HTML/')) {
		log("is HTML");
		return [];
	}

	var r =  getXML(responseText);

	if (!r){
		log("no Agenda responseXML");
		return tiddlers;
	}

	/* 
	 *  build Agenda column title tiddlers
	 */
	var days = {};
	var t = r.getElementsByTagName('day');
	for(var i=0;i<t.length;i++) {
		var name = t[i].textContent || t[i].text;
		if (name && name != undefined){
			days["Day"+name.makeId()] = name;
		}
	}

	for(var d in days) {
		var tiddler = new Tiddler();
		tiddler.assign(d,'<<AgendaTrackSessions>>',undefined,undefined,['track'],undefined,{rr_session_tag: d});
		tiddlers.push(tiddler);
	}

	if(!tiddlers){
		log("no Agenda Days");
		return tiddlers;
	}

	/* 
	 *  build session tiddlers
	 */
	t = r.getElementsByTagName('session');
	for(i=0;i<t.length;i++) {
		var node = t[i];
		tiddler = new Tiddler();

		var id = node.getAttribute('id');
		var day = "Day" + getFirstElementByTagNameValue(node, "day","ly");
		var track = getFirstElementByTagNameValue(node, "track","Global Track");
		var location = getFirstElementByTagNameValue(node, "location","Global Location");
		var content = getFirstElementByTagNameValue(node, "description","");

		var tags = ['session'];
		tags.push(track.makeId());
		tags.push(location.makeId());
		tags.push(day.makeId());

		/* list of speakers */
		var sessionSpeakers = [];
		var s = node.getElementsByTagName("speaker");
		for(var j=0;j<s.length;j++) {
			var name = getFirstElementByTagNameValue(s[j],"title");
			if(name){
				name = name.trim();
				speakers[name] = {name: name};
				sessionSpeakers.push(name);
				tags.push(name.makeId());
			}
		}

		tiddler.assign(id,content,undefined,undefined,tags,undefined,{
			rr_session_title: getFirstElementByTagNameValue(node,"title",""),
			rr_session_id: id,
			rr_session_starttime: getFirstElementByTagNameValue(node,"starttime",""),
			rr_session_endtime: getFirstElementByTagNameValue(node,"endtime",""),
			rr_session_link: getFirstElementByTagNameValue(node,"link",""),
			rr_session_day: day,
			rr_session_location: location,
			rr_session_track: track,
			rr_session_speakers: sessionSpeakers.join(", ")
		});
		tiddlers.push(tiddler);
	}

	/*
	 *  speaker tiddlers for vcards
	 */
	t = r.getElementsByTagName('vcard');
	for(i=0;i<t.length;i++) {
		var node = t[i];
		var name = getFirstElementByTagNameValue(node,"fn","vcard");
		name = name.trim();
		speakers[name] = {
			bio: getFirstElementByTagNameValue(node,"bio",""),
			text: ''
		};
	}

	/*
	 *  create speaker tiddlers
	 */
	for(var name in speakers) {
		var tiddler = new Tiddler();
		speaker = speakers[name];
		tiddler.assign(name,speaker.text,undefined,undefined,['speaker'],undefined,{});
		tiddlers.push(tiddler);
	}

	log("Agenda tiddlers:", tiddlers.lenghth);
	return tiddlers;
};

ConfabbAgendaAdaptor.notLoggedIn = function()
{
	displayMessage("not logged into Confabb");
	story.displayTiddler("top","LoginToConfabb");
};

ConfabbAgendaAdaptor.isLoggedIn = function()
{
	displayMessage("logged into Confabb");
	story.closeTiddler("LoginToConfabb");
};

ConfabbAgendaAdaptor.prototype.setContext = function(context,userParams,callback)
{
	if(!context) context = {};
	context.userParams = userParams;
	if(callback) context.callback = callback;
	context.adaptor = this;
	if(!context.host)
		context.host = this.host;
	context.host = ConfabbAgendaAdaptor.fullHostName(context.host);
	if(!context.workspace)
		context.workspace = this.workspace;
	return context;
};

ConfabbAgendaAdaptor.fullHostName = function(host)
{
	if(!host)
		return '';
	if(!host.match(/:\/\//))
		host = 'http://' + host;
	return host;
};

ConfabbAgendaAdaptor.minHostName = function(host)
{
	return host ? host.replace(/^http:\/\//,'').replace(/\/$/,'') : '';
};

ConfabbAgendaAdaptor.prototype.openHost = function(host,context,userParams,callback)
{
	this.host = host;
	context = this.setContext(context,userParams,callback);
	context.status = true;
	if(callback)
		window.setTimeout(function() {context.callback(context,userParams);},10);
	return true;
};

ConfabbAgendaAdaptor.loadTiddlyWikiCallback = function(status,context,responseText,url,xhr)
{
	context.status = status;
	context.count = 0;
	if(!status) {
		context.statusText = "Error reading agenda file";
	} else {
		var tiddlers = ConfabbAgendaAdaptor.parseAgenda(responseText);
		if(tiddlers.length){
			context.adaptor.store = new TiddlyWiki();
			for(var i=0;i<tiddlers.length;i++) {
				context.adaptor.store.addTiddler(tiddlers[i]);		
			}
			ConfabbAgendaAdaptor.isLoggedIn();
		} else {
			context.status = false;
			context.statusText = "Not logged in to Confabb";
			ConfabbAgendaAdaptor.notLoggedIn();
		}
	}
	if (context.complete)
	    context.complete(context,context.userParams);
};

ConfabbAgendaAdaptor.prototype.getWorkspaceList = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.workspaces = [{title:"(default)"}];
	context.status = true;
	if(callback)
		window.setTimeout(function() {callback(context,userParams);},10);
	return true;
};

ConfabbAgendaAdaptor.prototype.openWorkspace = function(workspace,context,userParams,callback)
{
	this.workspace = workspace;
	context = this.setContext(context,userParams,callback);
	context.status = true;
	if(callback)
		window.setTimeout(function() {callback(context,userParams);},10);
	return true;
};

ConfabbAgendaAdaptor.prototype.getTiddlerList = function(context,userParams,callback,filter)
{
	context = this.setContext(context,userParams,callback);
	if(!context.filter)
		context.filter = filter;
	context.complete = ConfabbAgendaAdaptor.getTiddlerListComplete;
	if(this.store) {
		var ret = context.complete(context,context.userParams);
	} else {
		var header = {'Cookie':config.options.txtConfabbSessionCookie};
		ret = doHttp('GET',context.host,null,null,null,null,ConfabbAgendaAdaptor.loadTiddlyWikiCallback,context,header,true);
		if(typeof ret != "string")
			ret = true;
	}
	return ret;
};

ConfabbAgendaAdaptor.getTiddlerListComplete = function(context,userParams)
{
	if(context.status) {
		if(context.filter) {
			context.tiddlers = context.adaptor.store.filterTiddlers(context.filter);
		} else {
			context.tiddlers = [];
			context.adaptor.store.forEachTiddler(function(title,tiddler) {context.tiddlers.push(tiddler);});
		}
		for(var i=0; i<context.tiddlers.length; i++) {
			context.tiddlers[i].fields['server.type'] = ConfabbAgendaAdaptor.serverType;
			context.tiddlers[i].fields['server.host'] = ConfabbAgendaAdaptor.minHostName(context.host);
			context.tiddlers[i].fields['server.page.revision'] = context.tiddlers[i].modified.convertToYYYYMMDDHHMM();
		}
		context.status = true;
	}
	if(context.callback) {
		window.setTimeout(function() {context.callback(context,userParams);},10);
	}
	return true;
};

ConfabbAgendaAdaptor.prototype.generateTiddlerInfo = function(tiddler)
{
	var info = {};
	info.uri = tiddler.fields['server.host'] + "#" + tiddler.title;
	return info;
};

ConfabbAgendaAdaptor.prototype.getTiddler = function(title,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.title = title;
	context.complete = ConfabbAgendaAdaptor.getTiddlerComplete;
	return context.adaptor.store ?
		context.complete(context,context.userParams) :
		alert(context.host); //loadRemoteFile(context.host,ConfabbAgendaAdaptor.loadTiddlyWikiCallback,context);
};

ConfabbAgendaAdaptor.getTiddlerComplete = function(context,userParams)
{
	var t = context.adaptor.store.fetchTiddler(context.title);
	t.fields['server.type'] = ConfabbAgendaAdaptor.serverType;
	t.fields['server.host'] = ConfabbAgendaAdaptor.minHostName(context.host);
	t.fields['server.page.revision'] = t.modified.convertToYYYYMMDDHHMM();
	context.tiddler = t;
	context.status = true;
	if(context.allowSynchronous) {
		context.isSynchronous = true;
		context.callback(context,userParams);
	} else {
		window.setTimeout(function() {context.callback(context,userParams);},10);
	}
	return true;
};

ConfabbAgendaAdaptor.prototype.close = function()
{
	delete this.store;
	this.store = null;
};

config.adaptors[ConfabbAgendaAdaptor.serverType] = ConfabbAgendaAdaptor;

} //# end of 'install only once'
//}}}
