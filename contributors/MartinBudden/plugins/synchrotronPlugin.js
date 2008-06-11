/***
|''Name:''|synchrotronPlugin|
|''Description:''|incorporates Tony Garnock-Jones javascript diff code|
|''Author:''|MartinBudden|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/plugins/synchrotronPlugin.js |
|''Version:''|0.0.2|
|''Date:''|June 12, 2008|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]] |
|''~CoreVersion:''|2.4.0|

!!Description
//!!TODO write a brief description of the plugin here

!!Usage
//!!TODO describe how to use the plugin - how a user should include it in their TiddlyWiki, parameters to the plugin etc

***/

//{{{
// Ensure that the AsyncStartupPlugin is only installed once.
if(!version.extensions.synchrotronPlugin) {
version.extensions.synchrotronPlugin = {installed:true};

config.defaultCustomFields['server.type'] = 'synchrotron';

var synchrotron = {repo:null,checkout:null,repositoryTiddlerTitle:'_synchrotronRepository'};
function ensureCheckout()
{
	if(!synchrotron.repo) {
		// todo - extract from magic tiddler
		synchrotron.repo = new Dvcs.Repository();
	}
	if(!synchrotron.checkout) {
		synchrotron.checkout = synchrotron.repo.update(null);
	}
}

//# putTiddler command definition
config.commands.saveAndCommitTiddler = {};
merge(config.commands.saveAndCommitTiddler,{
	text: "saveAndCommit",
	tooltip: "Save and commit this tiddler",
	hideReadOnly: true,
	done: "Tiddler committed"
	});

config.commands.saveAndCommitTiddler.isEnabled = function(tiddler)
{
	return tiddler && tiddler.isTouched();
};

config.commands.saveAndCommitTiddler.handler = function(event,src,title)
{
console.log('config.commands.saveAndCommitTiddler.handler:'+title);
	var tiddler = store.fetchTiddler(title);
	if(!tiddler)
		return false;
	if(!tiddler.fields.uuid)
		tiddler.fields.uuid = synchrotron.checkout.createFile();
	var id = tiddler.fields.uuid;
	synchrotron.checkout.setProp(id, 'title', title);
	synchrotron.checkout.setProp(id, 'text', tiddler.text.split('\n'));
	// TODO: rest of fields & metadata
	/* var newRevId = */ synchrotron.repo.commit(synchrotron.checkout);
	var repoExt = synchrotron.repo.exportRevisions();
	var repoText = uneval(repoExt);
	console.log('repoExt:'+repoText);
};

config.commands.saveTiddler.handlerOld = config.commands.saveTiddler.handler;
config.commands.saveTiddler.handler = function(event,src,title)
{
console.log('saveTiddlerNew');
	config.commands.saveTiddler.handlerOld(event,src,title);
	config.commands.saveAndCommitTiddler.handler(event,src,title);
};

restartSynchrotron = restart;
function restart()
{
console.log('new restart');
	restartSynchrotron();
	ensureCheckout();
	var repoText = store.getTiddlerText(synchrotron.repositoryTiddlerTitle);
	console.log('repoExtOnLoad:'+repoText);
	if(repoText) {
		var repoExt = eval(repoText);
		synchrotron.repo.importRevisions(repoExt);
		synchrotron.checkout = synchrotron.repo.update(null);
	}
}

saveChangesSynchrotron = saveChanges;
function saveChanges(onlyIfDirty,tiddlers)
{
console.log('new saving');
	var repoExt = synchrotron.repo.exportRevisions();
	var repoText = uneval(repoExt);
	console.log('repoExtOnSave:'+repoText);

	var tiddler = new Tiddler(synchrotron.repositoryTiddlerTitle);
	tiddler.text = repoText;
	store.addTiddler(tiddler);
	saveChangesSynchrotron(onlyIfDirty,tiddlers);
}

Dvcs.Repository.prototype.fileRevisions = function(uuid)
{
	var result = [];
	for (var revId in this.revisions) {
		console.log('revid:',revId);
		//if (uuid in this.revisions[revId].changed) {
			result.push(this.revisions[revId]);
		//}
	}
	result.sort(function (r1, r2) { return r2.timestamp - r1.timestamp; });
	return result;
}

}//# end of 'install only once'
//}}}
