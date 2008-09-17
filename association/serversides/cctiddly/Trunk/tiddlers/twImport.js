config.macros.packageImporter = {
	
	handler: function(place,macroName,params,wikifier,paramString,tiddler){	
		var tagged = store.getTaggedTiddlers("systemPackage");
		
		var html = "<form>";
		for(var t=0; t<tagged.length; t++){
			html += "<input type=radio name='package' value='"+tagged[t].title+"' >"+tagged[t].title+"<br />";
			html +=  store.getTiddlerSlice(tagged[t].title,'Description')+"<br /><br /";
		}
		var w = new Wizard();
		w.createWizard(place,"Import Package");
		w.addStep("Import Package from :", html+"<input type=button value='add package'  onclick='config.macros.packageImporter.click(this)'/></form>");
	},
	
	fetchFile : function(location){
		loadRemoteFile(location,config.macros.packageImporter.callback);
	},
	
	callback: function(status,params,responseText,url,xhr){
		if(status && locateStoreArea(responseText))
			config.macros.packageImporter.doImport(responseText);	
	},
	
	doImport : function(content){
		var importStore = new TiddlyWiki();
		importStore.importTiddlyWiki(content);
		store.suspendNotifications();
		importStore.forEachTiddler(function(title,tiddler) {
			if(!store.getTiddler(title)) {
				store.saveTiddler(title,title,tiddler.text,tiddler.modifier,tiddler.modified,tiddler.tags,tiddler.fields,false,tiddler.created);
			}
		});
		store.resumeNotifications();
		refreshDisplay();
		window.location=window.location;
	}, 
	click : function(btn)
	{
		var tiddler = story.findContainingTiddler(btn);
		var radios = tiddler.getElementsByTagName('form')[0]['package'];
		var packageTiddler;
		for(var z=0;z<radios.length;z++){
			if (radios[z].checked){
				packageTiddler = radios[z].value;
				break;
			}
		}
		var url = store.getTiddlerSlice(packageTiddler,'URL');
		this.fetchFile(url);
		}
	
}


config.macros.stats={};

config.macros.stats.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	var params;
	params = { place: place, url: "https://127.0.0.1/Trunk/handle/instanceStats.php?graph=1",title:"Views By Hour.", desc:"this shows users who have viewed this workspace by hour."};
	// params.place = place;
	// params.url = "https://127.0.0.1/Trunk/handle/instanceStats.php?graph=1";
	doHttp('GET',params.url,null, null, null, null, config.macros.stats.imgCallback,params);
	params = { place: place, url: "https://127.0.0.1/Trunk/handle/instanceStats.php?graph=2",title:"Views By Day.", desc:"this shows users who have viewed this workspace by day."};
	doHttp('GET',params.url,null, null, null, null, config.macros.stats.imgCallback,params);
	params = { place: place, url: "https://127.0.0.1/Trunk/handle/instanceStats.php?graph=3",title:"Views by Month.", desc:"this shows users who have viewed this workspace by month."};
	doHttp('GET',params.url,null, null, null, null, config.macros.stats.imgCallback,params);

}


config.macros.stats.imgCallback = function(status,params,responseText,uri,xhr){	
	var div = createTiddlyElement(params.place, "div");
	params.div = div;
	div.onclick = function()
	{
		doHttp('GET',params.url+"&full=1",null, null, null, null, config.macros.stats.imgCallbackFull,params);
	}
	createTiddlyElement(div, "h2", null, null, params.title);

	var img = createTiddlyElement(div, "img");
	img.src = responseText;
	var span = createTiddlyElement(div, "div", null, "graph_label", params.desc);
	setStylesheet(".graph_label  {  position:relative; top:-60px; left:130px;}");

	createTiddlyElement(params.place, "br");
	console.log(responseText);
}


config.macros.stats.imgCallbackFull = function(status,params,responseText,uri,xhr){
console.log(responseText);
		setStylesheet(
		"#errorBox .button {padding:0.5em 1em; border:1px solid #222; background-color:#ccc; color:black; margin-right:1em;}\n"+
		"html > body > #backstageCloak {height:100%;}"+
		"#errorBox {border:1px solid #ccc;background-color: #eee; color:#111;padding:1em 2em; z-index:9999;}",'errorBoxStyles');
		var box = document.getElementById('errorBox') || createTiddlyElement(document.body,'div','errorBox');
		box.innerHTML =  "<a style='float:right' href='javascript:onclick=ccTiddlyAdaptor.hideError()'>"+ccTiddlyAdaptor.errorClose+"</a><br />";
			box.style.position = 'absolute';
			var img = createTiddlyElement(box, "img");
			img.src = responseText;
			console.log(img.src);
			ccTiddlyAdaptor.center(box);
			ccTiddlyAdaptor.showCloak();

}

