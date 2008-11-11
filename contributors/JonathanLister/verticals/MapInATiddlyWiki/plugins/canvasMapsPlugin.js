/***
|''Name:''|canvasMapsPlugin |
|''Description:''|A psd-patented "Quick Win" to hack JDLR's canvasMaps.js into TiddlyWiki |
|''Author:''|JonathanLister |
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/JonathanLister/plugins/canvasMapsPlugin.js |
|''Version:''|0.0.1 |
|''Date:''|4/11/08 |
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[BSD License|http://www.opensource.org/licenses/bsd-license.php]] |
|''~CoreVersion:''|2.4|

NB: This assumes canvasMaps.js has been included in the postjs!

***/

//{{{
if(!version.extensions.canvasMapsPlugin) {
version.extensions.canvasMapsPlugin = {installed:true};

var head = document.getElementsByTagName("head")[0];
var s1 = document.createElement("script");
var s2 = document.createElement("script");
var s3 = document.createElement("script");
s1.src = "http://www.osmosoft.com/ILGA/demos/canvasMaps3D.js";
s2.src = "http://www.osmosoft.com/ILGA/demos/excanvas.js";
s3.src = "http://jqueryjs.googlecode.com/files/jquery-1.2.6.min.js";
head.appendChild(s1);
head.appendChild(s2);
head.appendChild(s3);
config.macros.canvasMaps = {};

config.macros.canvasMaps.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	// horrible hacked method to make sure excanvas has loaded - this should not be in this plugin
	var loaded = window.EasyMap;
	if(loaded && !window.CanvasRenderingContext2D) {
		loaded = window.G_vmlCanvasManager;
	}
	if(!loaded) {
		var that = this;
		var args = arguments;
		var func = function() {
			config.macros.canvasMaps.handler.apply(that,args);
		};
		return window.setTimeout(func,300);
	} else {
		var wrapper = createTiddlyElement(place,"div","wrapper","wrapper");
		var statustext = createTiddlyElement(wrapper,"div","wrapper_statustext");
		createTiddlyText(statustext,"loading... please wait a little while!");
		var caption = createTiddlyElement(place,"div","caption","caption");
		var eMap = new EasyMap('wrapper');
		eMap.addControl('pan');
		eMap.addControl('zoom');
		eMap.scale.x = 1.8;
		eMap.scale.y = 1.8;
		eMap.translate.x = 1;
		
		var that = eMap;
		var myElement = document.getElementById('caption');
		
	
		eMap.clickHandler = function(e){
			var shape = eMap.getShapeAtClick(e);
			var country = shape.tooltip;
			if(!store.tiddlerExists(country)) {
				var tags = "country";
				var text = "We don't have any information about this country yet! Please edit to add some or leave a comment.";
				var userName = config.options.txtUserName ? config.options.txtUserName : "guest";
				store.saveTiddler(country,country,text,userName,new Date(),tags);
			}
			var tiddlerElem = story.findContainingTiddler(e.target);
			story.displayTiddler(tiddlerElem,country);
		};
		
		eMap.drawFromGeojsonFile('http://plugins.tiddlywiki.org/ILGA.json');
	}
};

} //# end of 'install only once'
//}}}
