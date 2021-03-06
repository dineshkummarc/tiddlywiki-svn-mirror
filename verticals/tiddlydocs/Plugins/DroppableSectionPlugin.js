/***
|''Name''|droppableSectionsPlugin|
|''Description''|allows tiddler titles to be dropped into the tiddlydocs table of content. |
|''Authors''|Simon McManus|
|''Version''|0.1|
|''Status''|stable|
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
|''Requires''||

!Usage
{{{

add <<droppableSection>> to the tiddler view template. 

}}}

!Code
***/

//{{{
	
config.macros.droppableSection = {};
config.macros.droppableSection.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	config.macros.droppableSection.refresh(place);
};

config.macros.droppableSection.refresh = function(place) {
	var tiddlerElem = story.findContainingTiddler(place);
	var containingTiddlerTitle = tiddlerElem.getAttribute("tiddler"); 
	var strippedTidTitle = config.macros.droppableSection.strip(containingTiddlerTitle);
	var ul = createTiddlyElement(place, "ul", strippedTidTitle+"DroppableSectionList", 'sortable-title');
	var li = createTiddlyElement(ul, "li", containingTiddlerTitle);
	var sectionDiv = createTiddlyElement(li, "div", containingTiddlerTitle+'_div');
	createTiddlyText(sectionDiv, containingTiddlerTitle);
	jQuery(ul).sortable({
		items: "li",
		connectWith: ['.nestedSortable'],
		remove: function() {
			story.refreshTiddler(containingTiddlerTitle,1,true);
		},
		stop: function() {
			console.log('pies');
			config.macros.smmNestedSortable.specChanged();
			
		}
	});
}
	

config.macros.droppableSection.strip=function(s) {
	return s.replace(/ /g,'');
}

config.shadowTiddlers["DroppableSectionPluginStyles"] = store.getTiddlerText("DroppableSectionPlugin##StyleSheet");
store.addNotification("DroppableSectionPluginStyles", refreshStyles);


/***
!StyleSheet


.ul-toc-droppable-heading {
	border:2px solid transparent;
}

.toc-droppable-heading {
	border:2px solid transparent;
	cursor:move;
}

.toc-droppable-heading:hover {
	color:[[ColorPalette::PrimaryLight]]; 
	background:[[ColorPalette::SecondaryLight]]; 
	border-color:[[ColorPalette::SecondaryMid]];
	cursor:move;
}

html body div.title ul.toc {
    padding:0;
}

div.title  ul.toc {
	padding:0em;
	margin:0em;
}

!(end of StyleSheet)

***/

//}}}