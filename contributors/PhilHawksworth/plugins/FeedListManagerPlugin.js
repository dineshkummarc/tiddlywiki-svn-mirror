/***
|''Name:''|FeedListManagerPlugin|
|''Description:''|Manage a list of uris to be called in a round-robin stlye|
|''Author:''|PhilHawksworth|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/PhilHawksworth/plugins/FeedListManagerPlugin.js |
|''Dependencies:''| [[TextToXMLDOMPlugin|http://svn.tiddlywiki.org/Trunk/contributors/PhilHawksworth/plugins/TextToXMLDOMPlugin.js ]]|
|''Version:''|0.2|
|''Date:''|April 08, 2008|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[BSD License|http://www.opensource.org/licenses/bsd-license.php]] |
|''~CoreVersion:''|2.3|


''Usage examples:''

Create a new feed list manager.
{{{
var feeds = new FeedListManager();
}}}

Add a uri to an existing feed list manager.
{{{
feeds.add(uri, [name], [type]);
}}}

Remove a uri from an existing feed list manager.
{{{
feeds.remove(uri);
}}}

Get a uri from an given position in an existing feed list manager.
{{{
uri = feeds.get(i);
}}}

Get the next uri in the queue of an existing feed list manager.
{{{
uri = feeds.next();
}}}

Discover the number of registered uris in an existing feed list manager.
{{{
i = feeds.count();
}}}

Discover if a given uri is registered in an existing feed list manager, and at what position.
{{{
i = feeds.registered(uri);
}}}

Repopulate the uri list in an existing feed list manager.
{{{
feeds.populate();
}}}

Clear out the list of registered uris.
{{{
feeds.purge();
}}}

Output some usage stats about the registered usage stats
{{{
feeds.stats([uri]);
}}}


***/

//{{{
if(!version.extensions.FeedListManagerPlugin) {
version.extensions.FeedListManagerPlugin = {installed:true};
		
function FeedListManager(){
	this.uris = [];
	this.currentPosition = 0;
	this.lastIncrement = null;
	this.busy = false;
	this.requests = [];
	this.flagCycle = false;
};


// logging function, for debug
// FeedListManager.log = function(x)
// {
// 	if(window.console) {
// 		console.log(x);	
// 	}
// 	else {
// 		displayMessage(x);		
// 	}
// };


// Add a uri to the list of those managed (no dupes).
// uri : the uri,
// [name] : friendly name. (defaults to 'anon')
// [type] : rss | opml (defaults to 'rss')
FeedListManager.prototype.add = function(uri, name, type) {

	var exists = this.registered(uri);
	if(exists != null) {
		//log(uri + " already exisit on the manager");
		return;		
	}
	if(!type)
		type = 'rss';
	if(!name)
		name = 'anon';
	var uriObj = {'name':name, 'uri':uri, 'type':type, 'callCount':0, 'lastCall':null};
	this.uris.push(uriObj);
	// if(type == 'opml'|'include') {
	// 	this.populate();
	// }
};


// Remove a uri from the list of those currently managed.
FeedListManager.prototype.remove = function(uri) {
	var pos = this.registered(uri);
	if(pos != null)
		this.uris.splice(pos,1);
};


// Add a uri to the list of those managed (no dupes).
FeedListManager.prototype.populate = function(callback,callbackParams) {
	for(var u=0; u<this.uris.length; u++) {
		resource = this.uris[u];

		//log("populating. trying: ", resource.uri);

		if(resource.type == 'opml') {
			this.busy = true;
			this.requests.push(resource.uri);
			var params = {};
			params.feedList = this;
			if(callback) params.callback = callback;
			if(callbackParams) params.callbackParams = callbackParams;
			var req = doHttp("GET",resource.uri,null,null,null,null,FeedListManager.examineopml,params,null,true);
		}	
	}
};


//examine an opml file to gather the feed links within.
FeedListManager.examineopml = function(status,params,responseText,url,xhr) {
	var feedList = params.feedList;
	
	// Remove the record of this request for tracking purposes.
	var pos = feedList.requests.indexOf(url);
	if(pos != -1)
		feedList.requests.splice(pos,1);

	// Stop if there is not a suitable response.
	if(xhr.status != 200) {
		log("Unable to get OPML");
		return;
	}

	// transform the response into XMLDOM for parsing.
	var xml = getXML(responseText);
	var outlines = xml.getElementsByTagName("outline");

	// Add any rss links found to the manager.
	var xmlUrl, type, attr, xmlUrl, title = null;
	for (var i=0; i < outlines.length; i++) {
		type = outlines[i].getAttribute("type") || null;
		xmlUrl = outlines[i].getAttribute("xmlUrl") || null;
		title = outlines[i].getAttribute("title") || null;	
		if(type && xmlUrl)
			feedList.add(xmlUrl, title, type);
	};

	//flag if all updates are complete.
	if(feedList.requests.length < 1)
		feedList.busy = false;
		
	if(params.callback && params.callbackParams) {
		window.setTimeout(function() { feedList[params.callback(params.callbackParams)]; }, 10);				
	}

};


// Return the number of uris currently managed.
FeedListManager.prototype.count = function() {
	return this.uris.length;
};


// Determine if this uri is currently managed.
// returns its postion in the array if found, or null if not.
FeedListManager.prototype.registered = function(uri) {
	for(var u=0; u<this.uris.length; u++) {
		if(this.uris[u].uri == uri)
			return u;
	}
	return null;
};


// Get the uri at a given postion in the list of those managed.
FeedListManager.prototype.getUriObj = function(i) {
	if(i>=this.uris.length)
		return null;
	var uri = this.uris[i];
	return uri;
};

FeedListManager.prototype.get = function(i) {
	if(i>=this.uris.length)
		return null;
	return this.getUriObj(i).uri;
};

// Get the uri at by it's name.
FeedListManager.prototype.getUriObjByName = function(name) {
	uriObjs = this.uris;
	for (var ob=0; ob < uriObjs.length; ob++) {
		if(uriObjs[ob].name == name)
			return uriObjs[ob];
	};
	return null;
};



// Get the next uri from the list of those managed.
FeedListManager.prototype.next = function() {	
			
	if(this.busy) {
		return null;
	}
	var feedlist = this;
	if(feedlist.uris.length==0)
		return null;
	var thisPosition = feedlist.currentPosition;
	var uri = feedlist.getUriObj(thisPosition);	
	while(uri && uri.type!='rss') {
		feedlist.currentPosition++;
		if(feedlist.currentPosition >= feedlist.uris.length)
			feedlist.currentPosition = 0;
		if(feedlist.currentPosition==thisPosition) {
			// there are no rss feeds
			return null;
		}
		uri = feedlist.getUriObj(feedlist.currentPosition);
	}
	feedlist.currentPosition++;
	if(feedlist.currentPosition >= feedlist.uris.length)
		feedlist.currentPosition = 0;
	feedlist.lastIncrement = new Date().convertToYYYYMMDDHHMMSSMMM();
	return uri.uri;
};


// Get the next uri from the list of those managed.
FeedListManager.prototype.nextUriObj = function() {	
			
	if(this.busy) {
		return null;
	}
	var feedlist = this;
	if(feedlist.uris.length==0)
		return null;
	var thisPosition = feedlist.currentPosition;
	var uri = feedlist.getUriObj(thisPosition);	
	while(uri && uri.type!='rss') {
		feedlist.currentPosition++;
		if(feedlist.currentPosition >= feedlist.uris.length)
			feedlist.currentPosition = 0;
		if(feedlist.currentPosition==thisPosition) {
			// there are no rss feeds
			return null;
		}
		uri = feedlist.getUriObj(feedlist.currentPosition);
	}
	feedlist.currentPosition++;
	if(feedlist.currentPosition >= feedlist.uris.length)
		feedlist.currentPosition = 0;
	feedlist.lastIncrement = new Date().convertToYYYYMMDDHHMMSSMMM();
	return uri;
};


// Make a note of a call to a given uri
FeedListManager.prototype.logCall = function(uri) {
	var p = this.registered(uri);
	if(p == null)
		return;
	var u = this.uris[p];
	var now = new Date();
	now = now.convertToYYYYMMDDHHMMSSMMM();
	this.lastIncrement = now;
	u.lastCall = now;
	u.callCount++;
};


// Promote all given items to the start of the array
FeedListManager.prototype.prioritise = function(name) {
	//feedList = this.feedList;
	feedList = this;
	var uriObj;
	for(var u=0; u<feedList.uris.length; u++) {
		if(feedList.uris[u].name.toLowerCase() == name.toLowerCase()) {
			uriObj = feedList.uris[u];
			feedList.uris.splice(u,1);
			feedList.uris.unshift(uriObj);
		}
	}
};


// Output usgae stats for the list of uris currently managed. (as wikitext)
FeedListManager.prototype.stats = function(uri) {
	if(uri) {
		var p = this.registered(uri);
		if(p == null)
			return;
		var uris = [this.uris[p]];
	}
	else
		var uris = this.uris;
	var stats = null;
	for(var u=0; u<uris.length; u++) {
		/*
			TODO Make the stats output to a tiddler rather than to the console.
		*/
		FeedListManager.log(uris[u].name + ", " + uris[u].uri + ", ("+ uris[u].type +"),  called "+ uris[u].callCount + " times, last called at " + uris[u].lastCall);
	}
};


// Purge the list of uris currently managed.
FeedListManager.prototype.purge = function() {
	this.uris = [];
	this.currentPosition = 0;
};


} //# end of 'install only once'
//}}}
