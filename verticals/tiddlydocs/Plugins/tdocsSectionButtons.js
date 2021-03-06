/***
|''Name''|sectionsButtons|
|''Authors''|Simon McManus|
|''Version''|0.1|
|''Status''|stable|
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
|''Requires''||
!Description

Provides links to rss feeds of each section 

!Usage
{{{

<<docSectionButtons>>

}}}

!Code
***/

//{{{
	
config.macros.docSectionButtons = {};
config.macros.docSectionButtons.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
    if(typeof(tiddler.fields['server.host']) === "string") {
        var a = createTiddlyElement(place, "a", null, 'button');
        a.setAttribute('href', tiddler.fields['server.host']+tiddler.fields['server.workspace']+'/tiddlers/'+encodeURIComponent(tiddler.title)+'.wiki');
    	a.setAttribute('target', 'tiddlydocs_link');
        var img = document.createElement('img');
        img.src = '/doccollab/static/mydocs_images/icon_link.png';
    	img.height = '9';
    	img.width = '9';
        a.appendChild(img);
        createTiddlyText(a, ' Permalink');
        var a2 = createTiddlyElement(place, "a", null, 'button');
        a2.setAttribute('href',  tiddler.fields['server.host']+tiddler.fields['server.workspace']+'/tiddlers/'+encodeURIComponent(tiddler.title)+'.atom');
    	a2.setAttribute('target', 'tiddlydocs_link');
        var img = document.createElement('img');
        img.src = '/doccollab/static/mydocs_images/icon_rss.png';
    	img.height = '9';
    	img.width = '9';
        a2.appendChild(img);
        createTiddlyText(a2, ' RSS');
        var a3 = createTiddlyElement(place, "a", null, 'button');
        a3.setAttribute('href',  tiddler.fields['server.host']+tiddler.fields['server.workspace']+'/tiddlers.atom?select=root:'+encodeURIComponent(tiddler.title));
    	a3.setAttribute('target', 'tiddlydocs_link');
    	var img = document.createElement('img');
        img.src = '/doccollab/static/mydocs_images/icon_rss.png';
    	img.height = '9';
    	img.width = '9';
        a3.appendChild(img);
        createTiddlyText(a3, ' Comments RSS');
    }
};

//}}}