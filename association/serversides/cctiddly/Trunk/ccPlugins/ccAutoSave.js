/***
|''Name:''|ccTiddlyAutoSavePlugin|
|''Description:''|Auto Save using the ccTiddlyAdaptorPlugin|
|''Author:''|Chris Dent (cdent (at) peermore (dot) com)|
|''Source:''|n/a|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/ChrisDent/....|
|''Version:''|0.0.1|
|''Status:''|Under Development|
|''Date:''|Mar 25, 2008|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev|
|''License:''||
|''~CoreVersion:''||
***/

//{{{
//# Ensure that the plugin is only installed once.
if(!version.extensions.ccTiddlyAutoSavePlugin) {
version.extensions.ccTiddlyAutoSavePlugin = {installed:true};


function ccTiddlyAutoSave()
{
    return this;
}


ccTiddlyAutoSave.putCallback = function(context, userParams)
{
    tiddler = context.tiddler;
    if (context.status) {
        displayMessage('Saved ' + tiddler.title);
        tiddler.clearChangeCount();
		tiddler.fields['server.omodified'] = tiddler.modified.convertToYYYYMMDDHHMM();
    } else {
        displayMessage('Error Saving ' + tiddler.title + ' ' + context.statusText);
        tiddler.incChangeCount();
    }
};

// override save and write content to net immediately when done
// based on ccTiddly serverside.js
TiddlyWiki.prototype.orig_saveTiddler = TiddlyWiki.prototype.saveTiddler;         //hijack
TiddlyWiki.prototype.saveTiddler = function(title,newTitle,newBody,modifier,modified,tags,fields,clearChangeCount,created)
{
    var tiddler = this.fetchTiddler(title);
console.log("savetidder:"+title);
    tiddler = store.orig_saveTiddler(title,newTitle,newBody,modifier,modified,tags,fields,false,created);

    var adaptor = new config.adaptors['cctiddly'];

    // put the tiddler and deal with callback
    tiddler.fields = fields;
	tiddler.fields['server.host'] = window.url;
	tiddler.fields['server.type'] = 'cctiddly';
	tiddler.fields['server.workspace'] = window.workspace;
    context = {};
    context.tiddler = tiddler;
    //context.workspace = fields['server.workspace'];
    context.workspace = window.workspace;
	context.host = window.url;
    req = adaptor.putTiddler(tiddler, context, {}, ccTiddlyAutoSave.putCallback);
    return req ? tiddler : false;
};

} //# end of 'install only once'
//}}}
