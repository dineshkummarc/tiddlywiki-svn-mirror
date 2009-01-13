/***
|''Name''|TiddlyWebConfig|
|''Description''|configuration settings for TiddlyWeb|
|''Author''|FND|
|''Version''|0.1.2|
|''Status''|@@experimental@@|
|''Source''|http://svn.tiddlywiki.org/Trunk/association/plugins/TiddlyWebConfig.js|
|''License''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''Requires''|[[TiddlyWebAdaptor]]|
|''Keywords''|serverSide TiddlyWeb|
!Notes
This plugin should reside in a tiddler called [[ServerConfig]].
!Revision History
!!v0.1 (2008-11-30)
* initial release
!Code
***/
//{{{
if(!version.extensions.TiddlyWebConfig) { //# ensure that the plugin is only installed once
version.extensions.TiddlyWebConfig = { installed: true };

config.options.chkAutoSave = true;

if(!config.extensions) { config.extensions = {}; } //# obsolete from v2.4.2
config.extensions.ServerSideSavingPlugin = {
	adaptor: config.adaptors.tiddlyweb
};

config.defaultCustomFields = {
	"server.type": "tiddlyweb",
	"server.host": store.getTiddler("ServerConfig").fields["server.host"],
	"server.workspace": "bags/common"
};

} //# end of "install only once"
//}}}
