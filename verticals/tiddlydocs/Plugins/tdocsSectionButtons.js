config.macros.docSectionButtons = {};
config.macros.docSectionButtons.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
console.log('args', tiddler.fields);
	if(tiddler.fields.server.host != undefined) {
		var a = createTiddlyElement(place, "a", null, null);
		a.href = tiddler.fields.server['host']+tiddler.fields.server['workspace']+'/'+tiddler.title;
		var img = createTiddlyElement(a, 'img', '', '', '', {'height':'12px'});	
		img.src = 'http://www.sheffieldhealthyschools.co.uk/images/icons/link_icon.png';	
		createTiddlyText(a, 'Permalink');
	}
	if(tiddler.fields.server.host != undefined) {
		var a = createTiddlyElement(place, "a", null, null);
		a.href = tiddler.fields.server['host']+tiddler.fields.server['workspace']+'/'+tiddler.title+'.atom';
		var img = createTiddlyElement(a, 'img', '', '', '', {'height':'12px'});	
		img.src = 'http://www.acdivoca.org/852571DC00681414/Lookup/RSS-feed-small-PNG/$file/RSS-feed-small-PNG.png';
		createTiddlyText(a, 'RSS');
	} 
}
