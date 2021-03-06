/***
|''Name''|taggedTabs|
|''Authors''|Simon McManus|
|''Version''|0.1|
|''Status''|stable|
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
|''Requires''||
!Description

Provides tabs containing all the tiddlers with the tag specified. 
!Usage
{{{

<<taggedTabs tag>>

}}}

!Code
***/

config.macros.taggedTabs={
	handler:function(place,macroName,params,wikifier,paramString,tiddler,errorMsg){
		this.refresh(place,macroName,params,wikifier,paramString,tiddler,errorMsg);
	},
	refresh:function(place,macroName,params,wikifier,paramString,tiddler,errorMsg){
		var params = paramString.parseParams("taggedTabset",null,true,false,false);
		var tagged = store.getTaggedTiddlers(params[1].value,"title").reverse();
		var cookie = "taggedTabs";
		var wrapper = createTiddlyElement(null,"div",null,"tabsetWrapper taggedTabset" + cookie);
		var tabset = createTiddlyElement(wrapper,"div",null,"tabset taggedTabs");
		var validTab = false;
		tabset.setAttribute("cookie",cookie);
		for(var t=0; t<tagged.length; t++) {
			var label = tagged[t].title;
			tabLabel = label;
			var prompt = tagged[t].title;
			var tab = createTiddlyButton(tabset,tabLabel,prompt,config.macros.tabs.onClickTab,"tab tabUnselected");
			tab.setAttribute("tab",label);
			tab.setAttribute("content",label);
			if(config.options[cookie] == label)
				validTab = true;
		}
		if(!validTab)
			config.options[cookie] = tagged[0].title;
		place.appendChild(wrapper);
		config.macros.tabs.switchTab(tabset, config.options[cookie]);
	}
};

//}}}