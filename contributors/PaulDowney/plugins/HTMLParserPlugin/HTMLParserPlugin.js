/***
|''Name:''|HTMLParserPlugin|
|''Description:''|parse a HTML string into a DOM|
|''Author:''|PaulDowney (psd (at) osmosoft (dot) com)|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/PaulDowney/plugins/HTMLParserPlugin |
|''Version:''|0.1|
|''License:''|[[BSD open source license]]|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''~CoreVersion:''|2.2|

***/

//{{{
if(!version.extensions.HTMLParser){
version.extensions.HTMLParserPlugin = {installed:true};

HTMLParser = {};

HTMLParser.removeScripts = function (str) {
	if(str){
		str = str.replace(/<script(.*?)>.*?<\/script>/ig,"");
		str = str.replace(/(onload|onunload)(=.)/ig,"$1$2\/\/");
	}
        return str;
}

HTMLParser.iframeDocument = function (iframe)
{
	if(iframe.contentDocument)
		return iframe.contentDocument; 
	if(iframe.contentWindow)
		return iframe.contentWindow.document; // IE5.5 and IE6
	return iframe.document;
};

HTMLParser.parseText = function (text,handler,context)
{
	// create hidden iframe to hold HTML
        var iframe = document.createElement("iframe");
	var id = "parseHTML-iframe";
	iframe.setAttribute("id", id);
	iframe.setAttribute("name", id);
	iframe.setAttribute("type", "content");
        iframe.style.display = "none";
        document.body.appendChild(iframe);

	// callback fired when iframe HTML has been parsed
	var onload = function (event) {
		var iframe = arguments.callee.iframe;

		// poll for load complete
		if(iframe.readyState){
			if(iframe.readyState!=4 && iframe.readyState!="complete"){
				window.setTimeout(arguments.callee,10);
				return false;
			}
		}

		// call user handler
		var handler = arguments.callee.handler;
		var context = arguments.callee.context;
		if(handler){
			handler(HTMLParser.iframeDocument(iframe),context);
		}

		// delete iframe asynchronously 
		// - inline caused spinlock in FF3.1
		var collect = function() {
			var iframe = arguments.callee.iframe;
			iframe.parentNode.removeChild(iframe);
		};
		collect.iframe = iframe;
		window.setTimeout(collect,10);
		return false;
	};

	// call user supplied callback with context when HTML loaded
	onload.iframe = iframe;
	onload.handler = handler;
	onload.context = context;

	// IE6 and Opera don't support onload event for iframe ..
	window.window.setTimeout(onload,10);

	// write HTML text into the iframe
        var doc = HTMLParser.iframeDocument(iframe);
	text = HTMLParser.removeScripts(text);
        doc.open();
        doc.writeln(text);
        doc.close();
        return;
};

} //# end of 'install only once'
//}}}
