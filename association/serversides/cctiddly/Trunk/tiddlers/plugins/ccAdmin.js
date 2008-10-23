/***
|''Name''|ccAdmin|
|''Description''|Allows admin users to add and remove administrators from a ccTiddly workspace|
|''Author''|[[Simon McManus|http://simonmcmanus.com]] |
|''Version''|1.0.1|
|''Date''|12/05/2008|
|''Status''|@@alpha@@|
|''Source''|http://svn.tiddlywiki.org/Trunk/association/serversides/cctiddly/tiddlers/plugins/ccAdmin.js|
|''CodeRepository''|http://svn.tiddlywiki.org/Trunk/association/serversides/cctiddly/tiddlers/plugins/ccAdmin.js|
|''License''|BSD|
|''Feedback''|http://groups.google.com/group/ccTiddly|
|''Keywords''|ccTiddly ccAdmin|

!Description
Allows admin users to add and remove administrators from a ccTiddly workspace
!Usage

{{{
<<ccAdmin>>
}}}

!Code
***/
//{{{

config.macros.ccAdmin = {}
merge(config.macros.ccAdmin,{
	stepAddTitle:"Add a new Workspace Administrator",
	WizardTitleText:"Workspace Administration.",
	buttonDeleteText:"Delete Users",
	buttonDeleteTooltip:"Click to delete users.",
	buttonAddText:"Add User",
	buttonAddTooltip:"Click to add user.",
	buttonCancelText:"Cancel",
	buttonCalcelTooltip:"Calcel adding user.",
	buttonCreateText:"Make User Admin",
	buttonCreateTooltip:"Click to make user admin.",
	labelWorkspace:"Workspace: ",
	labelUsername:"Username  : ",
	stepErrorTitle:"You need to be an administrator of this workspace.",
	stepErrorText:"Permission Denied to edit workspace : ",
	stepNoAdminTitle:"There are no admins of this workspace.",
	stepManageWorkspaceTitle:"",
	listAdminTemplate: {
	columns: [	
		{name: 'Selected', field: 'Selected', rowName: 'name', type: 'Selector'},
		{name: 'Name', field: 'name', title: "Username", type: 'String'},	
		{name: 'Last Visit', field: 'lastVisit', title: "Last Login", type: 'String'}
	],
	rowClasses: [
		{className: 'lowlight', field: 'lowlight'}
	]}
	
});

config.macros.ccAdmin.handler = function(place,macroName,params,wikifier,paramString,tiddler, errorMsg){
	var w = new Wizard();
	w.createWizard(place,config.macros.ccAdmin.WizardTitleText);
	config.macros.ccAdmin.refresh(w);
};

config.macros.ccAdmin.refresh= function(w){
	params = {};
	params.w = w;
	params.e = this;
	me = config.macros.ccAdmin;
	doHttp('POST',url+'/handle/workspaceAdmin.php','action=LISTALL&workspace='+workspace,null,null,null,config.macros.ccAdmin.listAllCallback,params);
	w.setButtons([
		{caption: me.buttonDeleteText, tooltip: me.buttonDeleteTooltip, onClick: function(w){ 
			config.macros.ccAdmin.delAdminSubmit(null, params);
		 	return false;
		}}, 
		{caption: me.buttonAddText, tooltip: me.buttonAddTooltip, onClick: function(w){
			config.macros.ccAdmin.addAdminDisplay(null, params); return false } }]);
};

config.macros.ccAdmin.delAdminSubmit = function(e, params){
	var listView = params.w.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	var delUsers = "";
	for(var e=0; e < rowNames.length; e++) 
		delUsers += rowNames[e]+",";
	doHttp('POST',url+'/handle/workspaceAdmin.php','action=DELETEADMIN&username='+delUsers+'&workspace='+workspace,null,null,null,config.macros.ccAdmin.addAdminCallback,params);
	return false; 
};

config.macros.ccAdmin.addAdminDisplay = function(e, params){
	doHttp('POST',url+'/handle/workspaceAdmin.php','action=LISTWORKSPACES',null,null,null,config.macros.ccAdmin.listWorkspaces,params);
};

config.macros.ccAdmin.listWorkspaces = function(status,params,responseText,uri,xhr){
	var frm = createTiddlyElement(null,'form',null,null);
	var me = config.macros.ccAdmin;
	frm.onsubmit = config.macros.ccAdmin.addAdminSubmit;	
	params.w.addStep(me.stepAddTitle,"<input type='hidden' name='admin_placeholder'/>"+me.labelUsername+"<input name=adminUsername><br />"+me.labelWorkspace+"<select name=workspaceName />");
	var workspaces = eval('[ '+responseText+' ]');

	for(var t=0; t<workspaces.length; t++) {
		displayMessage(workspaces[t]);
		var o = createTiddlyElement(params.w.formElem.workspaceName, "option", null, null, workspaces[t]);
		o.value=workspaces[t];
		if(workspaces[t] == workspace)
			o.selected = true;
	}
	params.w.formElem.admin_placeholder.parentNode.appendChild(frm);
	params.w.setButtons([
		{caption: me.buttonCancelText, tooltip: me.buttonCancelTooltip, onClick: function(w){ config.macros.ccAdmin.refresh(params.w) } },
		{caption: me.buttonCreateText, tooltip: me.buttonCreateTooltip, onClick: function(){config.macros.ccAdmin.addAdminSubmit(null, params);  } }
	]);
};

config.macros.ccAdmin.addAdminSubmit = function(e, params){
	doHttp('POST',url+'/handle/workspaceAdmin.php','&add_username='+params.w.formElem.adminUsername.value+'&action=addNew&workspace='+params.w.formElem.workspaceName[params.w.formElem.workspaceName.selectedIndex].value,null,null,null,config.macros.ccAdmin.addAdminCallback,params);
	return false; 
};

config.macros.ccAdmin.listAllCallback = function(status,params,responseText,uri,xhr) {
	var me = config.macros.ccAdmin;
	var out = "";
	var adminUsers = [];
	if(xhr.status == 403){
		var html ='';
		params.w.addStep(me.stepErrorText+workspace, me.stepErrorTitle);
		params.w.setButtons([]);
		return false;
	}
	try{
		var a = eval(responseText);
		for(var e=0; e < a.length; e++){
			out += a[e].username;
			adminUsers.push({
			name: a[e].username,
			lastVisit:a[e].lastVisit});
		}
	}catch(ex){
			params.w.addStep(" "+workspace, me.stepNoAdminTitle);
			params.w.setButtons([
				{caption: me.buttonCreateText, tooltip: me.buttonCreateTooltip, onClick: function(){ config.macros.ccAdmin.addAdminDisplay(null, params)}}]);
			return false;
	}
	var html ='<input type="hidden" name="markList"></input>';
	params.w.addStep(me.stepManageWorkspaceTitle+workspace, html);
	var markList = params.w.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	var listView = ListView.create(listWrapper,adminUsers,config.macros.ccAdmin.listAdminTemplate);
	params.w.setValue("listView",listView);
};

config.macros.ccAdmin.addAdminCallback = function(status,params,responseText,uri,xhr) {
	config.macros.ccAdmin.refresh(params.w);
};

//}}}