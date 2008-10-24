config.macros.pluginBrowser = {};

merge(config.macros.pluginBrowser,{
       listTemplate: {
       columns: [
       {name: 'Selected', field: 'url', rowName: 'url', type: 'Selector'},
       {name: 'wiki text', field: 'installed', title: 'installed', type: 'WikiText'},
       {name: 'wiki text', field: 'saved', title: 'saved', type: 'WikiText'},
	   {name: 'wiki text', field: 'title', title: "Plugin", type: 'WikiText'},
	   {name: 'wiki text', field: 'description', title: "Description", type: 'WikiText'}
	   ],
       rowClasses: [
       {className: 'lowlight', field: 'lowlight'}
       ]}
});
merge(config.macros.pluginBrowser,{
	wizardTitleText:"Add Plugins",
	wizardStepText:" <input name='markList' style='display:none' />",
	wizardButtonInstallText:"Install",
	wizardButtonInstallTooltip:"Click to install plugins",
	plugins: [	
		{title: 'Twitter Adaptor', url: 'http://svn.tiddlywiki.org/Trunk/contributors/FND/plugins/TwitterAdaptorPlugin.js', description: 'Automatically turns the siteTitle into a link.'},
		{title: 'Power Title', url: 'http://svn.tiddlywiki.org/Trunk/contributors/MichaelMahemoff/plugins/ClickableSiteTitlePlugin/PowerTitlePlugin.js', description: 'Automatically turns the siteTitle into a link.'},
		{title: 'Comments Plugin', url: 'http://svn.tiddlywiki.org/Trunk/contributors/MichaelMahemoff/plugins/CommentsPlugin/CommentsPlugin.js', description: '{{{<<comments>>}}}'},
		{title: 'Theme Switcher Plugin', url: 'http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/plugins/ThemeSwitcherPlugin.js', description: '{{{<<selectTheme>>}}}'},
		{title: 'ToDo List Plugin', url: 'http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/plugins/TodoListPlugin.js', description: '{{{<<listTodos>>}}}'}
	]
	});

config.macros.pluginBrowser.handler=function(place,macroName,params,wikifier,paramString,tiddler,errorMsg){
	var me = config.macros.pluginBrowser;
	var w = new Wizard();
	w.createWizard(place,me.wizardTitleText);
	

	
	w.addStep(null, me.wizardStepText);
	var markList = w.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	for(t=0; t<me.plugins.length; t++){
		p = me.plugins[t];
		var tiddler = store.getTiddler(me.getFileName(p.url));
		if(tiddler){
			p.url = false;
			p.saved = " true ";
			if(tiddler.isTagged("systemConfig"))
				p.installed =" true";
		}
	}
	var listView = ListView.create(listWrapper,me.plugins,me.listTemplate);
	w.setValue("listView",listView);
	me.refresh(w);
};

config.macros.pluginBrowser.refresh=function(w){
	var me = config.macros.pluginBrowser;
	w.setButtons([
		{caption: me.wizardButtonInstallText, tooltip: me.wizardButtonInstallTooltip, onClick: function() {me.install(w);}
	}]);
};
	
config.macros.pluginBrowser.install = function(w){
	var listView = w.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	for(var e=0; e < rowNames.length; e++){
		var postUri = url+"handle/proxy.php?feed="+rowNames[e];
		doHttp('POST', postUri, null, null, null, null, config.macros.pluginBrowser.installCallback);
	}
};

config.macros.pluginBrowser.installCallback = function(status,params,responseText,uri,xhr){
	var title = config.macros.pluginBrowser.getFileName(uri);
	var now = new Date();
	if(!store.getTiddler(title)){
		store.saveTiddler(title,title,responseText,'ccTiddly',now,'systemConfig');
    }
	store.resumeNotifications();
	refreshDisplay();
};

config.macros.pluginBrowser.getFileName = function(str){
		str = str.substring(str.lastIndexOf('/'));
		return str.substring(1, str.indexOf('.js'));
};