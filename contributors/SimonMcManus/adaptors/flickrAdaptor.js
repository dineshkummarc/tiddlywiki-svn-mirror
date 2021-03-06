/***
|''Name''|flickrAdaptor|
|''Author''|[[Simon McManus|http://simonmcmanus.com]] |
|''Version''|0.1|

!Code

***/
//{{{

function flickrAdaptor(){}

flickrAdaptor.prototype = new AdaptorBase();
flickrAdaptor.mimeType = 'application/json';
flickrAdaptor.serverType = 'flickr';

// convert short-month string (mmm) to month number (zero-based)
function convertShortMonth(text){
	for(var i = 0; i < config.messages.dates.shortMonths.length; i++) { // XXX: inefficient!?
		if(text == config.messages.dates.shortMonths[i]) {
			return i;
		}
	}
}

flickrAdaptor.doHttpGET = function(uri,callback,params,headers,data,contentType,username,password){
    return doHttp('GET',uri,data,contentType,username,password,callback,params,headers);
};

flickrAdaptor.prototype.getWorkspaceList = function(context,userParams,callback){
	context = this.setContext(context,userParams,callback);
	var uriTemplate = '%0';
	var uri = uriTemplate.format([context.host]);
	console.log(uri);
	var req = flickrAdaptor.doHttpGET(uri,flickrAdaptor.getWorkspaceListCallback,context, null, "format=json");
	return typeof req == 'string' ? req : true;
};

function createTiddler(i){
	if(!context)
		var context = {};
	var date = convertISOTimestamp1(i.published);
	var tiddler = new Tiddler(i.title);
	fields = {};
	fields["link"] = i.link;
	fields["original_server.type"] = "flickr";
	fields["prettyDate"] = humane_date(date);
	tiddler.set(i.title, i.media.m,"modifier",date,"",date,fields);
	store.addTiddler(tiddler);
	if(context.save==true)
		store.saveTiddler(i.title, i.title, i.media.m, "ccTiddly", date, "lifestream", merge(fields, config.defaultCustomFields));					
}

function jsonFlickrFeed(o){
	return o; 
}

flickrAdaptor.getWorkspaceListCallback = function(status,context,responseText,uri,xhr){
	try {
		var pics = eval(" { " + responseText + " } ");
	} catch(ex) {
		displayMessage("Flickr could not be contacted.");
		return false;
	}
	var i=0;
  	while(pics.items[i]){
		createTiddler(pics.items[i]);
		i++;
	}
	
	if(context.callback)
		context.callback(context,context.userParams);
	window.callbackCount+1;
//	window.refreshDisplay();
};

config.adaptors[flickrAdaptor.serverType] = flickrAdaptor;
//}}}