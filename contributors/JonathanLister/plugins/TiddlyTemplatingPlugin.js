/***

|''Name:''|TiddlyTemplatingMacro |
|''Description:''|Renders a template and saves the output to a local file |
|''Author:''|JonathanLister|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/JonathanLister/plugins/TiddlyTemplatingMacro.js |
|''Version:''|2 |
|''Date:''|25/3/08 |
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[BSD License|http://www.opensource.org/licenses/bsd-license.php]] |
|''~CoreVersion:''|2.3|

Usage:
{{{
<<TiddlyTemplating path template>>
}}}

***/

//{{{
//# Ensure that the plugin is only installed once.
if(!version.extensions.TiddlyTemplating) {
version.extensions.TiddlyTemplating = {installed:true};

config.macros.TiddlyTemplating = {};

config.macros.TiddlyTemplating.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	config.messages.fileSaved = "file successfully saved";
	config.messages.fileFailed = "file save failed";
	var saveName = params[0];
	var template = params[1];
	if (!template) {
		// Change to use a default template when one exists, maybe to backup the whole TW?
		displayMessage("TiddlyTemplating: usage <<TiddlyTemplating filename template>>");
		return;
	}
	var localPath = getLocalPath(document.location.toString());
	var savePath;
	if((p = localPath.lastIndexOf("/")) != -1)
		savePath = localPath.substr(0,p) + "/" + saveName;
	else if((p = localPath.lastIndexOf("\\")) != -1)
		savePath = localPath.substr(0,p) + "\\" + saveName;
	else
		savePath = localPath + "." + saveName;
	//var e = document.createElement("div");
	//var paramString = 'raw:"true" template:"'+template+'"';
	displayMessage("generating...");
	var content = expandTemplate("TiddlyWikiTemplate");
	// config.macros.ListTemplate.handler(e,"ListTemplate",null,null,paramString,tiddler);
	displayMessage("saving...");
	//displayMessage(e.innerText);
	//displayMessage(e.textContent);
	var fileSave = saveFile(savePath,convertUnicodeToUTF8(content));
	if(fileSave) {
		displayMessage("saved... click here to load","file://"+savePath);
		// would rather use displayMessage, but doesn't work when opening tiddler
		// displayMessage(config.messages.fileSaved,"file://" + savePath);
	}
	else
		alert(config.messages.fileFailed,"file://"+savePath);
};

} //# end of 'install only once'
//}}}

/***
Experimental override of saveRSS using templating
***/
/* var saveRssOld = saveRss;
function saveRss(localPath)
{
	if (!config.macros.ListTemplate) {
		saveRssOld(localPath);
		return;
	}
	//# Save Rss
	if(config.options.chkGenerateAnRssFeed) {
		var rssPath = localPath.substr(0,localPath.lastIndexOf(".")) + ".xml";
		// START hack
		var e = document.createElement("div");
		var paramString = 'template:"RssTemplate"';
		config.macros.ListTemplate.handler(e,"ListTemplate",null,null,paramString);
		var rssSave = saveFile(rssPath,convertUnicodeToUTF8(e.textContent));
		// END hack
		// OLD var rssSave = saveFile(rssPath,convertUnicodeToUTF8(generateRss()));
		if(rssSave)
			displayMessage(config.messages.rssSaved,"file://" + rssPath);
		else
			alert(config.messages.rssFailed);
	}
} */
//}}}