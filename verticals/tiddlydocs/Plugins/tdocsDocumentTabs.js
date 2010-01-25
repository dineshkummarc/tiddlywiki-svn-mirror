config.macros.docTabs = {};
config.macros.docTabs.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	var html = '<div id="tab_wrapper" style="background-color: rgb(128, 128, 128);"><ul class="tabs" id="tab_bar" style="visibility: visible;"><li class="tab spacer"/></li></ul></div>';
	var d = createTiddlyElement(null, 'div', '', '', '');
	d.innerHTML  = html;
	place.appendChild(d);
	config.macros.docTabs.refresh();
}


config.macros.docTabs.switchDoc = function (title) {
	window.activeDocument = title;
	refreshAll();
	var spec = jQuery.parseJSON(store.getTiddlerText(title));
	if(spec.content[0] != undefined){
		story.displayTiddler(null, spec.content[0].title);
	}
}

config.macros.docTabs.refresh = function() {
	var values = store.getTaggedTiddlers('document');
	var selectedHtml = '';
	for (var i=0; i < values.length; i++) {
		if(values[i].title == window.activeDocument){
			selectedHtml += '<li class="tab tab_l tab_l_selected"/><li class="tab selectedtab" id="tab_6801"><div class="tabsDiv"><span id="tab_name_6801">'+values[i].title+'</span></div></li><li class="tab tab_r tab_r_selected"/>';
		} else {
			selectedHtml +=  '<li class="tab tab_l tab_l_add" id="add_tab_l"></li><li class="tab tab_add tabalignment2 tabalignment2OP" id="add_tab"  onclick="config.macros.docTabs.switchDoc(\''+values[i].title.replace("'", "\\'")+'\');"><div><a class="thickbox mis" href="#">'+values[i].title+'</a></div></li><li class="tab tab_r tab_r_add"></li>';
	
		}
	selectedHtml += '<li class="tab spacer"/>';
	}
	var newdoc = '<li class="tab tabalignment3OP tabalignment3" id="add_gadget"><a  class="thickbox mis addFromCatalogue"  id="AddFromCatalogueDialogue" href="#"><img style="border: medium none ;" src="/doccollab/static/mydocs_images/new_document.jpg" class="addGadgetCatImg"/></a>';
	html = selectedHtml  + newdoc;
	jQuery('#tab_bar:first-child').html(html);
	var addClick = function() {
			story.displayTiddler(null, "Create New Document", config.options.txtTheme+'##wizardViewTemplate');
	}
	jQuery('#AddFromCatalogueDialogue').click(addClick);
}


// NEW 

config.macros.docTabsNew = {};
config.macros.docTabsNew.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
		var tagged = store.getTaggedTiddlers('document').reverse();
		var cookie = "documentTabs";
		var wrapper = createTiddlyElement(null,"div",null,"tabsetWrapper taggedTabset" + cookie);
		var tabset = createTiddlyElement(wrapper,"div",null,"tabset");
		var validTab = false;
		tabset.setAttribute("cookie",cookie);
		for(var t=0; t<tagged.length; t++) {
			if(tagged[t].title == window.activeDocument){
				console.log(tagged[t].title, "is selecyed");
				var tabSelected = "tab tabSelected";
			}else{
				var tabSelected = "tab tabUnselected";
			}
			var label = tagged[t].title;
				tabLabel = label;
			var prompt = tagged[t].title;
			var tab = createTiddlyButton(tabset,tabLabel,prompt,config.macros.docTabsNew.onTabClick,tabSelected);
			tab.setAttribute("tab",label);
			if(config.options[cookie] == label)
				validTab = true;
		}
		if(!validTab)
			config.options[cookie] = tagged[0].title;
		place.appendChild(wrapper);
		var newDoc = function() {
			story.displayTiddler(null, "Create New Document", config.options.txtTheme+'##wizardViewTemplate')
		}
		createTiddlyButton(wrapper,'Create New Document',prompt, newDoc,"newDocumentButton");
};

config.macros.docTabsNew.onTabClick = function() {
	config.macros.docTabsNew.switchDoc(this.title);
	refreshAll();
	
};


config.macros.docTabsNew.switchDoc = function (title) {
	window.activeDocument = title;
	refreshAll();
	var spec = jQuery.parseJSON(store.getTiddlerText(title));	
	if(spec.content[0] != undefined){
		story.displayTiddler(null, spec.content[0].title);
	}
}


