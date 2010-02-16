config.macros.droppableSection = {};
config.macros.droppableSection.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	
	var tiddlerElem = story.findContainingTiddler(place);
 	var containingTiddlerTitle = tiddlerElem.getAttribute("tiddler"); 
	var strippedTidTitle = config.macros.droppableSection.strip(containingTiddlerTitle);
	var ul = createTiddlyElement(place, "ul", strippedTidTitle+"DroppableSectionList", "toc");
	   	var li = createTiddlyElement(ul, "li", containingTiddlerTitle, "clear-element toc-item left");

	var sectionDiv = createTiddlyElement(li, "div", containingTiddlerTitle+'_div', " toc-sort-handle ");
	
	
	jQuery(sectionDiv).toggle(function() {
		var t = "."+config.macros.droppableSection.strip(this.id);
		jQuery(t).addClass('highlight');
	}, function() {
		var t = "."+config.macros.droppableSection.strip(this.id);
	  	jQuery(t).removeClass('highlight');
	});

	createTiddlyText(sectionDiv, containingTiddlerTitle);
	jQuery("#"+strippedTidTitle+"DroppableSectionList").NestedSortable({
		accept: 'toc-item',
		autoScroll: true,
		onStop: function() {
				story.refreshTiddler(this.id,1,true);
		},
		handle: '.toc-sort-handle'
	});
};

config.macros.droppableSection.strip=function(s) {
	return s.replace(/ /g,'');
}