/***
|''Name''|BinaryTiddlersPlugin|
|''Description''|renders base64-encoded binary tiddlers as images or links|
|''Author''|FND|
|''Version''|0.3.0|
|''Status''|@@beta@@|
|''Source''|http://svn.tiddlywiki.org/Trunk/association/plugins/BinaryTiddlersPlugin.js|
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
|''CoreVersion''|2.5|
!Code
***/
//{{{
(function($) {

var plugin = config.extensions.BinaryTiddlersPlugin = {
	// NB: pseudo-binaries are considered non-binary here
	isBinary: function(tiddler) {
		var type = tiddler.fields["server.content-type"];
		return type ? !this.isTextual(type) : false;
	},
	isTextual: function(ctype) {
		return ctype.indexOf("text/") == 0 || this.endsWith(ctype, "+xml");
	},
	endsWith: function(str, suffix) {
		return str.length >= suffix.length &&
			str.substr(str.length - suffix.length) == suffix;
	}
};

// hijack text viewer to add special handling for binary tiddlers
var _view = config.macros.view.views.wikified;
config.macros.view.views.wikified = function(value, place, params, wikifier,
		paramString, tiddler) {
	var ctype = tiddler.fields["server.content-type"];
	if(params[0] == "text" && ctype && !tiddler.tags.contains("systemConfig")) {
		var el;
		if(plugin.isBinary(tiddler)) {
			var uri = "data:%0;base64,%1".format([ctype, tiddler.text]); // TODO: fallback for legacy browsers
			if(ctype.indexOf("image/") == 0) {
				el = $("<img />").attr("alt", tiddler.title).attr("src", uri);
			} else {
				el = $("<a />").attr("href", uri).text(tiddler.title);
			}
		} else {
			el = $("<pre />").text(tiddler.text);
		}
		el.appendTo(place);
	} else {
		_view.apply(this, arguments);
	}
};

})(jQuery);
//}}}
