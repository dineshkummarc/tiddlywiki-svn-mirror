/***
|''Name''|PluginLibraryConnectorPlugin|
|''Description''|imports plugins from TiddlyWiki Plugin Library|
|''Author''|FND|
|''Version''|0.1|
|''Status''|@@experimental@@|
|''Source''|http://devpad.tiddlyspot.com/#PluginLibraryConnectorPlugin|
|''CodeRepository''|http://svn.tiddlywiki.org/Trunk/contributors/FND/|
|''License''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
!Usage
{{{
<<ImportPlugins>>
}}}
!!Examples
<<ImportPlugins>>
!Revision History
!!v0.1 (2008-07-25)
* initial release
!To Do
* rename
!Code
***/
//{{{
if(!version.extensions.PluginLibraryConnectorPlugin) {
version.extensions.PluginLibraryConnectorPlugin = { installed: true };

config.macros.ImportPlugins = {
	btnLabel: "ImportPlugins",
	btnTooltip: "connect to TiddlyWiki Plugin Library",
	btnClass: null,
	prompt: "Enter search query:",
	host: "http://burningchrome.com:8090",
	pluginTemplate: "PluginInfoTemplate",

	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		createTiddlyButton(place, this.btnLabel,
			this.btnTooltip || params[0] + " - " + params[1],
			this.onclick, this.btnClass);
	},

	onclick: function() {
		var query = prompt(config.macros.ImportPlugins.prompt);
		config.macros.ImportPlugins.findPlugins(query);
	},

	findPlugins: function(query) { // XXX: rename?
		var adaptor = new TiddlyWebAdaptor();
		var context = {
			host: this.host,
			query: query 
		};
		return adaptor.getSearchResults(context, null, this.getPlugins);
	},

	getPlugins: function(context, userParams) { // XXX: rename?
		var plugins = context.tiddlers;
		if(plugins) {
			for(var i = 0; i < plugins.length; i++) {
				var subContext = {
					host: context.host,
					workspace: plugins[i].fields['server.workspace']
				};
				context.adaptor.getTiddler(plugins[i].title, subContext,
					userParams, config.macros.ImportPlugins.displayPlugin);
			}
		}
	},

	displayPlugin: function(context, userParams) { // XXX: rename?
		plugin = context.tiddler;
		plugin.fields.doNotSave = true;
		plugin = store.saveTiddler(plugin.title, plugin.title, plugin.text,
			plugin.modifier, plugin.modified, plugin.tags, plugin.fields, true,
			plugin.created);
		story.displayTiddler(null, plugin, config.macros.ImportPlugins.pluginTemplate);
	}
};

config.shadowTiddlers.PluginInfoTemplate = "<!--{{{-->\n"
	+ "<div class='toolbar' macro='toolbar [[ToolbarCommands::ViewToolbar]]'></div>\n"
	+ "<div class='title' macro='view title'></div>\n"
	+ "<div class='viewer' macro='pluginInfo'></div>\n"
	+ "<!--}}}-->";

// override search macro
config.macros.search.doSearch = function(txt)
{
	if(txt.value.length > 0) {
		config.macros.ImportPlugins.findPlugins(txt.value);
		txt.setAttribute("lastSearchText", txt.value);
	}
};

} //# end of "install only once"
//}}}
