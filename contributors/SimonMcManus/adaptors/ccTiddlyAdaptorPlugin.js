
function ccTiddlyAdaptor()
{
        this.host = null;
        this.workspace = null;
        return this;
}

// !!TODO set the variables below
ccTiddlyAdaptor.mimeType = 'application/json';
ccTiddlyAdaptor.serverType = 'ccTiddly'; // MUST BE LOWER CASE
ccTiddlyAdaptor.serverParsingErrorMessage = "Error parsing result from server";
ccTiddlyAdaptor.errorInFunctionMessage = "Error in function ccTiddlyAdaptor.%0";

ccTiddlyAdaptor.prototype.setContext = function(context,userParams,callback)
{
        if(!context) context = {};
        context.userParams = userParams;
        if(callback) context.callback = callback;
        context.adaptor = this;
        if(!context.host)
                context.host = this.host;
        context.host = ccTiddlyAdaptor.fullHostName(context.host);
        if(!context.workspace)
                context.workspace = this.workspace;
        return context;
};

ccTiddlyAdaptor.doHttpGET = function(uri,callback,params,headers,data,contentType,username,password)
{
        return doHttp('GET',uri,data,contentType,username,password,callback,params,headers,1);
};

ccTiddlyAdaptor.doHttpPOST = function(uri,callback,params,headers,data,contentType,username,password)
{
        return doHttp('POST',uri,data,contentType,username,password,callback,params,headers,1);
};

ccTiddlyAdaptor.doHttpPUT = function(uri,callback,params,headers,data,contentType,username,password)
{
        return doHttp('PUT',uri,data,contentType,username,password,callback,params,headers,1);
};

ccTiddlyAdaptor.fullHostName = function(host)
{
        if(!host)
                return '';
        if(!host.match(/:\/\//))
                host = 'http://' + host;
        if(host.substr(host.length-1) != '/')
                host = host + '/';
        return host;
};

ccTiddlyAdaptor.minHostName = function(host)
{
        return host ? host.replace(/^http:\/\//,'').replace(/\/$/,'') : '';
};

// Convert a page title to the normalized form used in uris
ccTiddlyAdaptor.normalizedTitle = function(title)
{
        return title;
};

// Convert a date in YYYY-MM-DD hh:mm format into a JavaScript Date object
ccTiddlyAdaptor.dateFromEditTime = function(editTime)
{
	var dt = editTime;
	return new Date(Date.UTC(dt.substr(0,4),dt.substr(5,2)-1,dt.substr(8,2),dt.substr(11,2),dt.substr(14,2)));
};

ccTiddlyAdaptor.prototype.openHost = function(host,context,userParams,callback)
{
	// displayMessage("openHost: " + host)
	this.host = ccTiddlyAdaptor.fullHostName(host);
	context = this.setContext(context,userParams,callback);
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

ccTiddlyAdaptor.prototype.openWorkspace = function(workspace,context,userParams,callback)
{
	// displayMessage("openWorkspace: " + workspace)
	this.workspace = workspace;
	context = this.setContext(context,userParams,callback);
	if(context.callback) {
		context.status = true;
		window.setTimeout(function() {callback(context,userParams);},0);
	}
	return true;
};

ccTiddlyAdaptor.prototype.getWorkspaceList = function(context,userParams,callback)
{
 	context = this.setContext(context,userParams,callback);
	var uriTemplate = '%0handle/listWorkspaces.php';
	var uri = uriTemplate.format([context.host]);
	var req = ccTiddlyAdaptor.doHttpGET(uri,ccTiddlyAdaptor.getWorkspaceListCallback,context, {'accept':'application/json'});
	return typeof req == 'string' ? req : true;
};

ccTiddlyAdaptor.getWorkspaceListCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	context.statusText = ccTiddlyAdaptor.errorInFunctionMessage.format(['getWorkspaceListCallback']);
	if(status) {
	try {
		eval('var workspaces=' + responseText);
	} catch (ex) {
		context.statusText = exceptionText(ex,ccTiddlyAdaptor.serverParsingErrorMessage);
		if(context.callback)
			context.callback(context,context.userParams);
			return;
		}
		var list = [];
		for (var i=0; i < workspaces.length; i++) {
			list.push({title:workspaces[i]})
		}
		context.workspaces = list;
		context.status = true;
	} else {
			context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

ccTiddlyAdaptor.prototype.getTiddlerList = function(context,userParams,callback)
{
	//	displayMessage("get Tiddler list");
	context = this.setContext(context,userParams,callback);
	var uriTemplate = '%0handle/listTiddlers.php?workspace=%1';
	var uri = uriTemplate.format([context.host,context.workspace]);
	var req = ccTiddlyAdaptor.doHttpGET(uri,ccTiddlyAdaptor.getTiddlerListCallback,context, {'accept':'application/json'});
	return typeof req == 'string' ? req : true;
};

ccTiddlyAdaptor.getTiddlerListCallback = function(status,context,responseText,uri,xhr)
{
	context.status = false;
	context.statusText = ccTiddlyAdaptor.errorInFunctionMessage.format(['getTiddlerListCallback']);
	if(status) {
		try {
			eval('var tiddlers=' + responseText);
		} catch (ex) {
			context.statusText = exceptionText(ex,ccTiddlyAdaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		var list = [];
		for(var i=0; i < tiddlers.length; i++) {
			var tiddler = new Tiddler(tiddlers[i]['title']);
			tiddler.fields['server.page.revision'] = tiddlers[i]['revision'];
			list.push(tiddler);
		}
		context.tiddlers = list;
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

ccTiddlyAdaptor.prototype.generateTiddlerInfo = function(tiddler)
{
	var info = {};
	var host = this && this.host ? this.host : ccTiddlyAdaptor.fullHostName(tiddler.fields['server.host']);
	var bag = tiddler.fields['server.bag']
	var workspace = tiddler.fields['server.workspace']
	var baguriTemplate = '%0bags/%1/tiddlers/%2';
	var recipeuriTemplate = '%0recipes/%1/tiddlers/%2';
	if (bag)
		info.uri = baguriTemplate.format([host,bag,tiddler.title]);
	else
		info.uri = recipeuriTemplate.format([host,workspace,tiddler.title]);
	return info;
};

ccTiddlyAdaptor.prototype.getTiddlerRevision = function(title,revision,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	if(revision)
		context.revision = revision;
	return this.getTiddler(title,context,userParams,callback);
};

ccTiddlyAdaptor.prototype.getTiddler = function(title,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	if(title)
		context.title = title;
	var uriTemplate = '%0handle/getTiddler.php?title=%2&workspace=%1';
	//   if(context.revision) {
	//           var uriTemplate = '%0recipes/%1/tiddlers/%2/revisions/%3';
	//  } else {
	//           uriTemplate = '%0recipes/%1/tiddlers/%2';
	//  }
	
	uri = uriTemplate.format([context.host,context.workspace,ccTiddlyAdaptor.normalizedTitle(title),context.revision]);
	context.tiddler = new Tiddler(title);
	context.tiddler.fields['server.type'] = ccTiddlyAdaptor.serverType;
	context.tiddler.fields['server.host'] = ccTiddlyAdaptor.minHostName(context.host);
	context.tiddler.fields['server.workspace'] = context.workspace;
	var req = ccTiddlyAdaptor.doHttpGET(uri,ccTiddlyAdaptor.getTiddlerCallback,context, {'accept':'application/json'});
	return typeof req == 'string' ? req : true;
};



ccTiddlyAdaptor.getTiddlerCallback = function(status,context,responseText,uri,xhr)
{
        context.status = false;
        context.statusText = ccTiddlyAdaptor.errorInFunctionMessage.format(['getTiddlerCallback']);
        if(status) {
                var info=[]
                try {
                    eval('info=' + responseText);
                } catch (ex) {
                        context.statusText = exceptionText(ex,ccTiddlyAdaptor.serverParsingErrorMessage);
                        if(context.callback)
                                context.callback(context,context.userParams);
                        return;
                }
                context.tiddler.text = info['text'];
                context.tiddler.tags = info['tags'];
                context.tiddler.fields['server.page.revision'] = info['revision'];

                context.tiddler.fields['omodified'] = info['modified'];

                context.tiddler.modifier = info['modifier'];
                context.tiddler.modified = Date.convertFromYYYYMMDDHHMM(info['modified']);
                context.tiddler.created = Date.convertFromYYYYMMDDHHMM(info['created']);
                context.status = true;
        } else {
                context.statusText = xhr.statusText;
                if(context.callback)
                        context.callback(context,context.userParams);
                return;
        }
        if(context.callback)
                context.callback(context,context.userParams);
};


ccTiddlyAdaptor.prototype.getTiddlerRevisionList = function(title,limit,context,userParams,callback)
// get a list of the revisions for a page
{
	context = this.setContext(context,userParams,callback);
	context.title = title;
	var tiddler = store.fetchTiddler(title);
	var encodedTitle = encodeURIComponent(title);
console.log('getTiddlerRevisionList:'+title);
//# http://cctiddly.sourceforge.net/msghandle.php?action=revisionList&title=About
//# http://wiki.osmosoft.com/alpha/handle/revisionlist.php?&workspace=martinstest&title=GettingStarted
	var uriTemplate = '%0handle/revisionList.php?workspace=%1&title=%2';
	var host = ccTiddlyAdaptor.fullHostName(this.host);
	var workspace = context.workspace ? context.workspace : tiddler.fields['server.workspace'];
	var uri = uriTemplate.format([host,workspace,encodedTitle]);
console.log('uri: '+uri);
	var req = ccTiddlyAdaptor.doHttpGET(uri,ccTiddlyAdaptor.getTiddlerRevisionListCallback,context);
//#console.log("req:"+req);
};

ccTiddlyAdaptor.getTiddlerRevisionListCallback = function(status,context,responseText,uri,xhr)
{
console.log('getTiddlerRevisionListCallback status:'+status);
console.log('rt:'+responseText.substr(0,100));
	if(responseText.indexOf('<!DOCTYPE html')==1)
		status = false;
//#fnLog('xhr:'+xhr);
	context.status = false;
	if(status) {
		list = [];
		var r =  responseText;
		if(r != '-' && r.trim() != 'revision not found') {
			var revs = r.split('\n');
			var list = [];
			for(var i=0; i<revs.length; i++) {
				var parts = revs[i].split(' ');
				if(parts.length>1) {
					var tiddler = new Tiddler(context.title);
					//tiddler.modified = Date.convertFromYYYYMMDDHHMM(parts[0]);
					tiddler.fields['server.page.revision'] = String(parts[1]);
					tiddler.modifier = String(parts[2]);
					tiddler.fields['server.host'] = ccTiddlyAdaptor.minHostName(context.host);
					tiddler.fields['server.type'] = ccTiddlyAdaptor.serverType;
					list.push(tiddler);
				}
			}
		}
		context.revisions = list;
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};



ccTiddlyAdaptor.prototype.putTiddler = function(tiddler,context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	context.title = tiddler.title;
//	var recipeuriTemplate = '%0handle/putTiddler.php';
	var recipeuriTemplate = '%0handle/save.php';
	var host = context.host ? context.host : ccTiddlyAdaptor.fullHostName(tiddler.fields['server.host']);
	var uri;
	uri = recipeuriTemplate.format([host,context.workspace,tiddler.title]);

		var d = new Date();
		d.setTime(Date.parse(tiddler['modified']));
		d = d.convertToYYYYMMDDHHMM();
		var newRevision = tiddler.fields['server.page.revision']+1;
		var payload="workspace="+tiddler.fields['server.workspace']+"&otitle="+encodeURIComponent(tiddler.title)+"&title="+encodeURIComponent(tiddler.title)+"&omodified="+d+"&modifier=username&tags=&revision="+encodeURIComponent(tiddler.fields['server.page.revision'])+"&fields= &body="+encodeURIComponent(tiddler.text)+"";
		var req = ccTiddlyAdaptor.doHttpPOST(uri,ccTiddlyAdaptor.putTiddlerCallback,context,{'Content-type':'application/x-www-form-urlencoded', "Content-length": payload.length},payload,"application/x-www-form-urlencoded");
	return typeof req == 'string' ? req : true;
};



ccTiddlyAdaptor.putTiddlerCallback = function(status,context,responseText,uri,xhr)
{
	displayMessage(responseText);
        if(status) {
                context.status = true;
        } else {
                displayMessage('putTiddler xhr status is' + xhr.status);
                displayMessage('putTiddler xhr status text is' + xhr.statusText);
                context.status = false;
                context.statusText = xhr.statusText;
        }
        if(context.callback)
                context.callback(context,context.userParams);
};

ccTiddlyAdaptor.prototype.deleteTiddler = function(title,context,userParams,callback)
{
	displayMessage('sasa');
	
	context = this.setContext(context,userParams,callback);
	context.title = title;
	title = encodeURIComponent(tiddler.title);
//#fnLog('deleteTiddler:'+title);
	var host = this && this.host ? this.host : ccTiddlyAdaptor.fullHostName(tiddler.fields['server.host']);
	var uriTemplate = '%0handle/delete.php?workspace=%1&title=%2';
	var uri = uriTemplate.format([host,context.workspace,title]);
//#fnLog('uri: '+uri);

	var req = ccTiddlyAdaptor.doHttpPOST(uri,ccTiddlyAdaptor.deleteTiddlerCallback,title);
//#fnLog("req:"+req);
	return typeof req == 'string' ? req : true;
};

ccTiddlyAdaptor.deleteTiddlerCallback = function(status,context,responseText,uri,xhr)
{
//#fnLog('deleteTiddlerCallback:'+status);
//#fnLog('rt:'+responseText.substr(0,50));
//#fnLog('xhr:'+xhr);
	if(status) {
		context.status = true;
	} else {
		context.status = false;
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};



ccTiddlyAdaptor.prototype.close = function()
{
        return true;
};


config.adaptors[ccTiddlyAdaptor.serverType] = ccTiddlyAdaptor;



/***
!JSON Code, used to serialize the data
***/
/*
Copyright (c) 2005 JSON.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The Software shall be used for Good, not Evil.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*
    The global object JSON contains two methods.

    JSON.stringify(value) takes a JavaScript value and produces a JSON text.
    The value must not be cyclical.

    JSON.parse(text) takes a JSON text and produces a JavaScript value. It will
    throw a 'JSONError' exception if there is an error.
*/
var JSON = {
    copyright: '(c)2005 JSON.org',
    license: 'http://www.crockford.com/JSON/license.html',
/*
    Stringify a JavaScript value, producing a JSON text.
*/
    stringify: function (v) {
        var a = [];

/*
    Emit a string.
*/
        function e(s) {
            a[a.length] = s;
        }

/*
    Convert a value.
*/
        function g(x) {
            var c, i, l, v;

            switch (typeof x) {
            case 'object':
                if (x) {
                    if (x instanceof Array) {
                        e('[');
                        l = a.length;
                        for (i = 0; i < x.length; i += 1) {
                            v = x[i];
                            if (typeof v != 'undefined' &&
                                    typeof v != 'function') {
                                if (l < a.length) {
                                    e(',');
                                }
                                g(v);
                            }
                        }
                        e(']');
                        return;
                    } else if (typeof x.toString != 'undefined') {
                        e('{');
                        l = a.length;
                        for (i in x) {
                            v = x[i];
                            if (x.hasOwnProperty(i) &&
                                    typeof v != 'undefined' &&
                                    typeof v != 'function') {
                                if (l < a.length) {
                                    e(',');
                                }
                                g(i);
                                e(':');
                                g(v);
                            }
                        }
                        return e('}');
                    }
                }
                e('null');
                return;
            case 'number':
                e(isFinite(x) ? +x : 'null');
                return;
            case 'string':
                l = x.length;
                e('"');
                for (i = 0; i < l; i += 1) {
                    c = x.charAt(i);
                    if (c >= ' ') {
                        if (c == '\\' || c == '"') {
                            e('\\');
                        }
                        e(c);
                    } else {
                        switch (c) {
                            case '\b':
                                e('\\b');
                                break;
                            case '\f':
                                e('\\f');
                                break;
                            case '\n':
                                e('\\n');
                                break;
                            case '\r':
                                e('\\r');
                                break;
                            case '\t':
                                e('\\t');
                                break;
                            default:
                                c = c.charCodeAt();
                                e('\\u00' + Math.floor(c / 16).toString(16) +
                                    (c % 16).toString(16));
                        }
                    }
                }
                e('"');
                return;
            case 'boolean':
                e(String(x));
                return;
            default:
                e('null');
                return;
            }
        }
        g(v);
        return a.join('');
    },
/*
    Parse a JSON text, producing a JavaScript value.
*/
    parse: function (text) {
        var p = /^\s*(([,:{}\[\]])|"(\\.|[^\x00-\x1f"\\])*"|-?\d+(\.\d*)?([eE][+-]?\d+)?|true|false|null)\s*/,
            token,
            operator;

        function error(m, t) {
            throw {
                name: 'JSONError',
                message: m,
                text: t || operator || token
            };
        }

        function next(b) {
            if (b && b != operator) {
                error("Expected '" + b + "'");
            }
            if (text) {
                var t = p.exec(text);
                if (t) {
                    if (t[2]) {
                        token = null;
                        operator = t[2];
                    } else {
                        operator = null;
                        try {
                            token = eval(t[1]);
                        } catch (e) {
                            error("Bad token", t[1]);
                        }
                    }
                    text = text.substring(t[0].length);
                } else {
                    error("Unrecognized token", text);
                }
            } else {
                token = operator = undefined;
            }
        }


        function val() {
            var k, o;
            switch (operator) {
            case '{':
                next('{');
                o = {};
                if (operator != '}') {
                    for (;;) {
                        if (operator || typeof token != 'string') {
                            error("Missing key");
                        }
                        k = token;
                        next();
                        next(':');
                        o[k] = val();
                        if (operator != ',') {
                            break;
                        }
                        next(',');
                    }
                }
                next('}');
                return o;
            case '[':
                next('[');
                o = [];
                if (operator != ']') {
                    for (;;) {
                        o.push(val());
                        if (operator != ',') {
                            break;
                        }
                        next(',');
                    }
                }
                next(']');
                return o;
            default:
                if (operator !== null) {
                    error("Missing value");
                }
                k = token;
                next();
                return k;
            }
        }
        next();
        return val();
    }
};





