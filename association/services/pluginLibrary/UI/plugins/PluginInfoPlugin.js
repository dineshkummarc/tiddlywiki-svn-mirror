/***
|''Name''|PluginInfoPlugin|
|''Description''|imports plugins from TiddlyWiki Plugin Library|
|''Author''|FND|
|''Version''|0.1.1|
|''Status''|@@experimental@@|
|''Source''|http://devpad.tiddlyspot.com/#PluginLibraryConnectorPlugin|
|''CodeRepository''|http://svn.tiddlywiki.org/Trunk/contributors/FND/|
|''License''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
!Usage
{{{
<<pluginInfo [name]>>
}}}
!Revision History
!!v0.1 (2008-07-25)
* initial release
!To Do
* rename
!Code
***/
//{{{
if(!version.extensions.PluginInfoPlugin) {
version.extensions.PluginInfoPlugin = { installed: true };

config.macros.pluginInfo = {
	tiddlerLabel: "More...",

	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		var title = params[0] || tiddler.title;
		var slices = store.calcAllSlices(title);
		var info = "";
		var name = slices.Name || title;
		info += "{{title{\n";
		if(slices.Source) {
			info += "[[" + name + "|" + slices.Source + "]]";
		} else {
			info += String.encodeTiddlyLink(name);
		}
		info += "}}}\n" +
			(slices.Description || "") + "\n" +
			"[[" + this.tiddlerLabel + "|" + tiddler.title + "]]";
		wikify(info, place);
	}
};

} //# end of "install only once"
//}}}
