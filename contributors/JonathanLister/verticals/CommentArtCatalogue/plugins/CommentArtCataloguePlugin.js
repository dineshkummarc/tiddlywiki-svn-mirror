/***
|''Name:''|CommentArtCataloguePlugin |
|''Description:''| |
|''Author:''|JonathanLister |
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/JonathanLister/verticals/CommentArtCatalogue/plugins/CommentArtCataloguePlugin.js |
|''Version:''|0.1 |
|''Date:''|31/7/08 |
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[BSD License|http://www.opensource.org/licenses/bsd-license.php]] |
|''~CoreVersion:''|2.4|

Usage:
{{{

}}}
***/

//{{{
if(!version.extensions.CommentArtCataloguePlugin) {
version.extensions.CommentArtCataloguePlugin = {installed:true};

config.macros.CommentArtCatalogueDownload = {

	messages: {
		noUrl:'no url set',
		noGallery:'no gallery found',
		createTiddler:'added %0 tiddlers'
	},
	omitFilters: [
		/^id="gallery-list"/,
		'noimage.gif'
	],
	tags: [
		"catalogueItem"
	],
	context: {},
	handler: function(place,macroName,params) {
		if(!config.options.txtCommentArtCatalogueUrl) {
			displayMessage(this.messages.noUrl);
			return false;
		} else {
			this.context.place = place;
			this.context.macro = this;
			this.go(config.options.txtCommentArtCatalogueUrl);
		}
	},
	
	go: function(url) {
		httpReq("GET",url,this.getCatalogueCallback,this.context,null,null,null,null,null,true);
	},
	
	getCatalogueCallback: function(status,context,responseText,url,xhr) {
		if(!status) {
			return false;
		} else {
			var macro = context.macro;
			var start = responseText.indexOf('id="gallery-list"');
			var end = responseText.indexOf('<!-- #exhibitions-list -->');
			var s = "";
			var pieces = [];
			if(start===-1||end===-1) {
				displayMessage(this.messages.noGallery);
			} else {
				s = responseText.substring(start,end);
				pieces = s.split('<img ');
				pieces = macro.omitFilter(pieces,context);
				pieces = macro.createFieldsFromSource(pieces);
				macro.createTiddlers(pieces,context);
			}
		}
	},

	omitFilter: function(strings,context) {
		var macro = context.macro;
		var results = [];
		var omitFilters = macro.omitFilters;
		var testFilters = function(s) {
			var omitFilter;
			var matched = false;
			for(var j=0;j<omitFilters.length;j++) {
				omitFilter = omitFilters[j];
				if(typeof omitFilter === 'string') {
					if(s.indexOf(omitFilter)!==-1) {
						matched = true;
					}
				} else { // assume regex
					if(omitFilter.test(s)) {
						matched = true;
					}
				}
			}
			return matched;
		};
		for(var i=0;i<strings.length;i++) {
			if(!testFilters(strings[i])) {
				results.push(strings[i]);
			} else {
				//# debug
				//console.log('omitting '+strings[i]);
			}
		}
		return results;
	},
	
	createFieldsFromSource: function(pieces) {
		var description,title,s;
		var links,result;
		var results = [];
		for(var i=0;i<pieces.length;i++) {
			s = pieces[i];
			result = {};
			links = {};
			links.icon = s.replace(/src="([^"]*)"(.|\n)*/,"$1");
			links.icon = links.icon.replace(/ /g,"%20");
			links.normal = links.icon.replace(/icon(_.*\.[jJ][pP][gG])/,"normal$1");
			links.large = links.icon.replace(/icon(_.*\.[jJ][pP][gG])/,"large$1");
			result.links = links;
			description = s.replace(/^(.|\n)*?<h3 class="pthtrei">/,'<h3 class="pthtrei">');
			result.description = description;
			title = description;
			title = title.renderHtmlText();
			title = title.replace(/<.*?>/g,"");
			title = title.replace(/\s\s+/g,",");
			title = title.replace(/,\s*$/,"");
			result.title = title;
			results.push(result);
		}
		return results;
	},
	
	createTiddlers: function(pieces,context) {
		var macro = context.macro;
		var title,body,fields,piece;
		var modifier = config.options.txtUserName;
		var tags = macro.tags;
		var created = new Date();
		store.suspendNotifications();
		for(var i=0;i<pieces.length;i++) {
			piece = pieces[i];
			title = piece.title;
			if(store.getTiddler(title)) {
				title = title.makeUniqueTiddlerName();
			}
			// BUG: tiddler titles can be the same and therefore get overwritten e.g.
			// creating tiddler number  349 Yuki Snow,a girl,oil and acrylic,2007
			// creating tiddler number 350 Yuki Snow,a girl,oil and acrylic,2007
			body = "";
			for(var j in piece.links) {
				body+=j+": "+piece.links[j]+"\n";
			}
			console.log('creating tiddler number ',i+1,title);
			store.saveTiddler(title,title,body,modifier,null,tags,fields,false,created);
		}
		store.resumeNotifications();
		clearMessage();
		displayMessage(macro.messages.createTiddler.format([pieces.length]));
		this.complete();
	},
	
	complete: function() {
		wikify('[[Then download and save the images!|CommentArtCatalogueSaveFiles]]',this.context.place);
		HttpManager.showStats();
	}
};

String.prototype.makeUniqueTiddlerName = function() {
	console.log(this.toString());
	var str = this.toString();
	var i = 0;
	while(store.getTiddler(str+i)) {
		i++;
	}
	str += i;
	return str;
};

config.macros.CommentArtCatalogueSaveFiles = {

	context: {},
	imageSizes: [
		'icon',
		'normal'
		//'large'
	],
	imageFolder: "images",

	handler: function(place,macroName,params) {
		var ss = store.getTaggedTiddlers('catalogueItem');
		var icon,normal,large,s,context;
		this.context.place = place;
		this.context.count = ss.length;
		var getHost = function(url) {
			var i=0;
			if(!url)
				return '';
			if(!url.match(/:\/\//))
				url = 'http://' + url;
			i = url.indexOf('/',url.indexOf('http://')+7);
			if(i!==-1) {
				url = url.substring(0,i);
			}
			return url;
		};
		var host = getHost(config.options.txtCommentArtCatalogueUrl);
		HttpManager.setHttpReq(httpReqBin);
		Http.intercept(window,'httpReq',function(type,url,callback,params,headers,data,contentType,username,password,allowCache) {
			HttpManager.addRequest(type,url,callback,params,headers,data,contentType,username,password,allowCache);
		});
		var me = this;
		var getImagesBySize = function(size) {
			var s;
			console.log('going to download '+ss.length+' '+size+' '+'pictures');
			for(var i=0;i<ss.length;i++) {
				s = ss[i];
				imageURL = store.getTiddlerSlice(s.title,size);
				params = {
					macro:me,
					title:s.title,
					size:size,
					tiddler:s
				};
				console.log('passing icon request number in handler: ',i+1);
				httpReq("GET",host+imageURL,me.getImageCallback,params,null,null,null,null,null,true);
				//# debug
				//break;
			}
		};
		var size = "";
		for(var i=0;i<this.imageSizes.length;i++) {
			size = this.imageSizes[i];
			getImagesBySize(size);
		}		
	},

	getImageCallback: function(status,params,responseText,url,xhr) {
		var fileName, title, tiddler, newBody;
		if(!status) {
			return false;
		} else {
			if(params.macro.context) {
				params.macro.context.count--;
			} else {
				console.log('no count in the context! ',url,status,params.macro.context,params);
			}
			tiddler = params.tiddler;
			title = params.title;
			size = params.size;
			fileName = title.replace(/\//g,"_")+size+".jpg";
			params.macro.save(fileName,responseText);
		}
	},
	
	save: function(filename,content) {
		config.messages.fileSaved = "file successfully saved";
		config.messages.fileFailed = "file save failed";
		var localPath = getLocalPath(document.location.toString());
		var savePath;
		if((p = localPath.lastIndexOf("/")) != -1) {
			savePath = localPath.substr(0,p) + "/" + this.imageFolder + "/" + filename;
		} else {
			if((p = localPath.lastIndexOf("\\")) != -1) {
				savePath = localPath.substr(0,p) + "\\" + this.imageFolder + "\\" + filename;
			} else {
				savePath = localPath + "." + filename;
			}
		}
		displayMessage("saving...");
		//var fileSave = saveFile(savePath,convertUnicodeToUTF8(content));
		var fileSave = saveFile(savePath,content);
		if(fileSave) {
			displayMessage("saved... click here to load","file://"+savePath);
			//console.log("saved... click here to load","file://"+savePath);
		} else {
			displayMessage(config.messages.fileFailed,"file://"+savePath);
			//console.log(config.messages.fileFailed,"file://"+savePath);
		}
		if(!this.context.count) {
			this.complete();
		} else {
			console.log('not finished counting: ',this.context.count);
		}
	},
	
	complete: function(place) {
		wikify('[[Now compile your catalogue!|CommentArtCatalogueCompile]]',this.context.place);
		HttpManager.showStats();
	}

};

config.macros.CommentArtCatalogueCompile = {

	context: {},
	imageSizes: [
		'icon',
		'normal'
		//'large'
	],
	imageFolder: "images",

	handler: function(place,macroName,params) {
		var s, newBody, fileName, title, size;
		var ss = store.getTaggedTiddlers('catalogueItem');
		this.context.place = place;
		store.suspendNotifications();
		for(var i=0;i<ss.length;i++) {
			s = ss[i];
			title = s.title;
			newBody = "";
			for(var j=0;j<this.imageSizes.length;j++) {
				size = this.imageSizes[j];
				fileName = this.imageFolder+"/";
				fileName += title.replace(/\//g,"_")+size+".jpg";
				newBody += "\n[img["+fileName+"]]";
			}
			newBody = s.text + newBody;
			store.saveTiddler(title,title,newBody,s.modifier,s.modified,s.tags,s.fields,false,s.created);
		}
		store.resumeNotifications();
		this.createNavigationIndex(ss);
	},
	
	createNavigationIndex: function(tiddlers) {
		var title = "NavigationIndex";
		var text = "";
		for(var i=0;i<tiddlers.length;i++) {
			text += String.encodeTiddlyLink(tiddlers[i].title) + "\n";
		}
		store.saveTiddler(title,title,text,config.options.txtUserName,null,null,null,true,new Date());
		this.complete();
	},
	
	complete: function() {
		wikify('Finished!\n\nView the catalogue:\n<<fullscreen>>',this.context.place);
	}
};

window.httpReqBin = function(type,url,callback,params,headers,data,contentType,username,password,allowCache) {
	//# Get an xhr object
	var x = null;
	try {
		x = new XMLHttpRequest(); //# Modern
	} catch(ex) {
		try {
			x = new ActiveXObject("Msxml2.XMLHTTP"); //# IE 6
		} catch(ex2) {
		}
	}
	if(!x)
		return "Can't create XMLHttpRequest object";
	//# Install callback
	x.onreadystatechange = function() {
		try {
			var status = x.status;
		} catch(ex) {
			status = false;
		}
		if(x.readyState == 4 && callback && (status !== undefined)) {
			if([0, 200, 201, 204, 207].contains(status))
				callback(true,params,x.responseText,url,x);
			else
				callback(false,params,null,url,x);
			x.onreadystatechange = function(){};
			x = null;
		}
	};
	var ext = window.httpReq.extensions;
	if(ext) {
		for(var n in ext) {
			x[n] = eval(ext[n].toString());
		}
	}
	//# Send request
	if(window.Components && window.netscape && window.netscape.security && document.location.protocol.indexOf("http") == -1)
		window.netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	try {
		if(!allowCache)
			url = url + (url.indexOf("?") < 0 ? "?" : "&") + "nocache=" + Math.random();
		x.open(type,url,true,username,password);
		if(data)
			x.setRequestHeader("Content-Type", contentType || "application/x-www-form-urlencoded");
		if(x.overrideMimeType)
			x.setRequestHeader("Connection", "close");
		if(headers) {
			for(n in headers)
				x.setRequestHeader(n,headers[n]);
		}
		x.setRequestHeader("X-Requested-With", "TiddlyWiki " + formatVersion());
		x.overrideMimeType('text/plain; charset=x-user-defined');
		x.send(data);
	} catch(ex) {
		return exceptionText(ex);
	}
	return x;	
};

// taken from RSSAdaptor.js
// renderHtmlText puts a string through the browser render process and then extracts the text
// useful to turn HTML entities into literals such as &apos; to '
// this method has two passes at the string - the first to convert it to html and the second
// to selectively catch the ASCII-encoded characters without losing the rest of the html
String.prototype.renderHtmlText = function() {
	//displayMessage("in renderHtmlText");
	var text = this.stripCData().toString();
	var e = createTiddlyElement(document.body,"div");
	e.innerHTML = text;
	text = getPlainText(e);
	text = text.replace(/&#[\w]+?;/g,function(word) {
		var ee = createTiddlyElement(e,"div");
		ee.innerHTML = word;
		return getPlainText(ee);
	});
	removeNode(e);
	//displayMessage("leaving renderHtmlText");
	return text;
};

} //# end of 'install only once'
//}}}
