/***
|''Name''|ServerCommandsPlugin|
|''Description''|provides access to server-specific commands|
|''Author''|FND|
|''Version''|0.1.3|
|''Status''|@@experimental@@|
|''Source''|http://devpad.tiddlyspot.com/#ServerCommandsPlugin|
|''CodeRepository''|http://svn.tiddlywiki.org/Trunk/contributors/FND/|
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
|''CoreVersion''|2.4.2|
|''Keywords''|serverSide|
!Description
<...>
!Notes
<...>
!Usage
{{{
<<...>>
}}}
!!Parameters
<...>
!!Examples
<<...>>
!Configuration Options
<...>
!Revision History
!!v0.1 (2009-02-26)
* initial release
!To Do
* strip server.* fields from revision tiddlers
* resolve naming conflicts
* i18n, l10n
* code sanitizing
* documentation
* rename?
!Code
***/
//{{{
(function() { //# set up local scope

if(!version.extensions.ServerCommandsPlugin) { //# ensure that the plugin is only installed once
version.extensions.ServerCommandsPlugin = { installed: true };

var cmd; //# alias
cmd = config.commands.revisions = {
	type: "popup",
	hideShadow: true,
	text: "revisions",
	tooltip: "display tiddler revisions",
	revLabel: "#%2 %1: %0 (%3)",
	revTooltip: "", // TODO: populate dynamically?
	loadLabel: "loading...",
	loadTooltip: "loading revision list",
	revSuffix: " [rev. #%0]",
	dateFormat: "YYYY-0MM-0DD 0hh:0mm",

	handlePopup: function(popup, title) {
		// remove revSuffix from title if it exists
		var i = cmd.revSuffix.indexOf("%0");
		i = title.indexOf(cmd.revSuffix.substr(0, i));
		if(i != -1) {
			title = title.substr(0, i);
		}
		var tiddler = store.getTiddler(title);
		var type = this._getField("server.type", tiddler);
		var adaptor = new config.adaptors[type]();
		var limit = null; // TODO: customizable
		var context = {
			host: this._getField("server.host", tiddler),
			workspace: this._getField("server.workspace", tiddler)
		};
		var loading = createTiddlyButton(popup, cmd.loadLabel, cmd.loadTooltip);
		var params = { popup: popup, loading: loading, origin: title }
		adaptor.getTiddlerRevisionList(title, limit, context, params, this.displayRevisions);
	},

	displayRevisions: function(context, userParams) {
		var list = userParams.popup;
		removeNode(userParams.loading);
		var callback = function(ev) {
			var e = ev || window.event;
			var revision = resolveTarget(e).getAttribute("revision");
			cmd.getTiddlerRevision(tiddler.title, revision, context, userParams);
		};
		for(var i = 0; i < context.revisions.length; i++) {
			var tiddler = context.revisions[i];
			var item = createTiddlyElement(list, "li");
			var timestamp = tiddler.modified.formatString(cmd.dateFormat);
			var revision = tiddler.fields["server.page.revision"];
			var label = cmd.revLabel.format([tiddler.title, tiddler.modifier, revision, timestamp]);
			createTiddlyButton(item, label, cmd.revTooltip, callback, null, null, null, { revision: revision });
		}
	},

	getTiddlerRevision: function(title, revision, context, userParams) {
		context.adaptor.getTiddlerRevision(title, revision, context, userParams, cmd.displayTiddlerRevision);
	},

	displayTiddlerRevision: function(context, userParams) {
		var tiddler = context.tiddler;
		var src = story.getTiddler(userParams.origin);
		tiddler.fields.doNotSave = "true"; // XXX: correct?
		tiddler.title += cmd.revSuffix.format([tiddler.fields["server.page.revision"]]);
		if(!store.getTiddler(tiddler.title)) {
			store.addTiddler(tiddler);
		}
		story.displayTiddler(src, tiddler);
	},

	_getField: function(name, tiddler) {
		return tiddler.fields[name] || config.defaultCustomFields[name];
	}
};

} //# end of "install only once"

})(); //# end of local scope
//}}}
