/***
|''Name:''|creoleTracFormatterPlugin|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com)|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/formatters/creoleTracFormatterPlugin.js|
|''Version:''|0.0.1|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|''~CoreVersion:''|2.1.0|

Adds the following to Trac, to make it Creole compliant:

# {{{**}}} bold
# {{{//}}} italic
# {{{*}}} unordered and {{{#}}} ordered lists

***/

//{{{
if(!version.extensions.creoleTracFormatterPlugin) {
version.extensions.creoleTracFormatterPlugin = {installed:true};
if(version.major < 2 || (version.major == 2 && version.minor < 1)) {
	alertAndThrow("creoleTracFormatterPlugin requires TiddlyWiki 2.1 or later.");
}

// add new formatters
config.trac.formatters.push(creoleBaseFormatter.bold);
config.trac.formatters.push(creoleBaseFormatter.italic);
config.trac.formatters.push(creoleBaseFormatter.list);
config.trac.formatters.push(creoleBaseFormatter.explicitLink);


// set up parser to use added formatters
var format = config.parsers.tracFormatter.format;
var formatTag = config.parsers.tracFormatter.formatTag;
delete config.parsers.tracFormatter;
config.parsers.tracFormatter = new Formatter(config.trac.formatters);
config.parsers.tracFormatter.format = format;
config.parsers.tracFormatter.formatTag = formatTag;

}// end of 'install only once'
//}}}
