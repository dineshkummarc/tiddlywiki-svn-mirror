/***
|''Name:''|SplashScreenPlugin|
|''Description:''|Provides a splash screen that consists of the rendered default tiddlers|
|''Author:''|Martin Budden|
|''~CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/plugins/SplashScreenPlugin.js |
|''Version:''|0.1.5|
|''Date:''|April 17, 2008|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]] |
|''~CoreVersion:''|2.4|

!!Description
Provides a splash screen that consists of the default tiddlers while TiddlyWiki is loading

!!Usage
!!TODO describe how to use the plugin - how a user should include it in their TiddlyWiki, parameters to the plugin etc

***/

//{{{
//# Ensure that the plugin is only installed once.
if(!version.extensions.SplashScreenPlugin) {
version.extensions.SplashScreenPlugin = {installed:true};

//config.macros.splashScreen = {};
//config.macros.splashScreen.init = function()
version.extensions.SplashScreenPlugin.setup = function()
{
	if(store.tiddlerExists("MarkupPostHead"))
		return;

	//# put the splash screen display and color styles in the MarkupPostHead tiddler
	var text = "<!--{{{-->\n";
	text += "<style type=\"text/css\">\n";
	text += "#contentWrapper {display:none;}\n";
	text += "#splashScreen {display:block;}\n";

	var sc = store.getTiddlerText("StyleSheetColors");
	sc += "\n" + store.getTiddlerText("StyleSheetLayout") + "\n";
	sc += "\n#splashScreen {display:block;}\n";
	sc += "\n" + store.getTiddlerText("StyleSheet") + "\n";
	sc = sc.replace(/#/mg,"#s_");

	var slices = ["Background","Foreground",
		"PrimaryPale","PrimaryLight","PrimaryMid","PrimaryDark",
		"SecondaryPale","SecondaryLight","SecondaryMid","SecondaryDark",
		"TertiaryPale","TertiaryLight","TertiaryMid","TertiaryDark",
		"Error"];
	for(var i in slices) {
		s = store.getTiddlerSlice("ColorPalette",i);
		sc = sc.replace("[[ColorPalette::"+i+"]]",s);
	}

	text += sc;
	text += "#s_messageArea {display:none;}\n";
	text += "\n</style>\n";
	text += "<!--}}}-->\n";
	var tiddler = store.createTiddler("MarkupPostHead");
	tiddler.set(tiddler.title,text,config.options.txtUserName,null,"excludeLists excludeSearch");

	//# convert the DefaultTiddlers into HTML and put them in the MarkupPreBody tiddler
	var sitetitle = store.getTiddlerText("SiteTitle");
	var sitesubtitle = store.getTiddlerText("SiteSubtitle");
	var pt = store.getTiddlerText("PageTemplate");
	pt = pt.replace(/<span class='siteTitle' refresh='content' tiddler='SiteTitle'><\/span>/mg,"<span class=\"siteTitle\">"+sitetitle+"</span>");
	pt = pt.replace(/<span class='siteSubtitle' refresh='content' tiddler='SiteSubtitle'><\/span>/mg,"<span class=\"siteSubtitle\">"+sitesubtitle+"</span>");
	pt = pt.replace(/<!--\{\{\{-->/mg,"").replace(/<!--\}\}\}-->/mg,"");
	pt = pt.replace(/<div id='/mg,"<div id='s_");

	text = "";
	var filter = store.getTiddlerText("SplashTiddlers") || store.getTiddlerText("DefaultTiddlers");
	tiddlers = store.filterTiddlers(filter);
	for(i=0;i<tiddlers.length;i++) {
		tiddler = tiddlers[i];
		var title = tiddler.title;
		var tiddlerElem = createTiddlyElement(null,"div","tempId"+tiddler.title,"tiddler");
		tiddlerElem.style.display = "none";
		tiddlerElem.setAttribute("refresh","tiddler");
		var template = story.chooseTemplateForTiddler(title);
		var t = story.getTemplateForTiddler(title,template,tiddler);
		t = t.replace(/<div class=['"]toolbar[^<]*<\/div>/mg,"<div class=\"toolbar\"><br /></div>");
		t = t.replace(/<div class=['"]tagging['"][^>]*><\/div>\n/mg,"");
		t = t.replace(/<div class=['"]tagged['"][^>]*><\/div>\n/mg,"");
		tiddlerElem.innerHTML = t;
		applyHtmlMacros(tiddlerElem,tiddler);
		text += '<div id="splashId_' + tiddler.title + '" class="tiddler">\n';
		t = tiddlerElem.innerHTML;
		// remove all tiddler links
		t = t.replace(/<a tiddlylink=[^>]*>([^<]*)<\/a>/mg,"$1");
		t = t.replace(/<a tiddlyfields=[^>]*>([^<]*)<\/a>/mg,"$1");
		text += t + '\n</div>\n';
	}
	text = text.replace(/<!--\{\{\{-->/mg,"").replace(/<!--\}\}\}-->/mg,"");

	var splash = "<!--{{{-->\n\n";
	splash += "<div id=\"splashScreen\">\n";
	pt = pt.replace(/<div id='s_tiddlerDisplay'><\/div>/mg,"<div id=\"s_tiddlerDisplay\">"+text+"</div>");
	splash += pt;

	splash += "</div>\n";
	splash += "<!--}}}-->\n\n";
	splash += '<script type="text/javascript">\ndocument.getElementById("splashScreen").style.display="none";\n</script>\n';

	tiddler = store.createTiddler("MarkupPreBody");
	tiddler.set(tiddler.title,splash,config.options.txtUserName,null,"excludeLists excludeSearch");

	store.setDirty(true);
};

version.extensions.SplashScreenPlugin.saveChanges = window.saveChanges;
window.saveChanges = function()
{
	version.extensions.SplashScreenPlugin.setup();
	version.extensions.SplashScreenPlugin.saveChanges();
}

} //# end of 'install only once'
//}}}
