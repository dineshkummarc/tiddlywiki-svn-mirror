/***
|TiddlyFileImporter|
|Version|0.3|
|Author|Ben Gillies|
|Type|plugin|
|Description|Upload a TiddlyWiki file to TiddlyWeb, and import the tiddlers.|
!Usage
Upload a TiddlyWiki file to TiddlyWeb, and import the tiddlers.
!Requires
tiddlyweb
tiddlywebplugins.reflector
!Code
***/
//{{{
(function($){
if(!version.extensions.TiddlyFileImporter)
{ //# ensure that the plugin is only installed once
	version.extensions.TiddlyFileImporter = { installed: true };
}

config.macros.fileImport = {
	reflectorURI: '/reflector',
	incorrectTypeError: 'Incorrect File Type. You must upload a TiddlyWiki',
	uploadLabel: 'Upload',
	uploadLabelPrompt: 'Import tiddlers from this TiddlyWiki',
	step1FileText: 'File:',
	step1URLText: 'URL:',
	step1PostText: 'In the next screen you will select the tiddlers to import.',
	step1Title: 'Step 1: Pick a TiddlyWiki to import',
	step1TypeChooser: 'Import From:',
	step3Html: '<input type="hidden" name="markList" />'
		+ '<input type="hidden" checked="true" name="chkSync" />'
		+ '<input type="hidden" name="chkSave" />'
		+ '<input type="hidden" name="txtSaveTiddler" />',

	handler: function(place, macroName, params, wikifier, paramString) {
		var wizard = new Wizard();
		wizard.createWizard(place, 'Import a TiddlyWiki');
		this.restart(wizard);
	},

	restart: function(wizard) {
		var me = config.macros.fileImport;
		wizard.addStep(me.step1Title, '<input type="hidden" '
			+ 'name="markList" />');
		var markList = wizard.getElement('markList');
		var uploadWrapper = document.createElement('div');
		markList.parentNode.insertBefore(uploadWrapper, markList);
		uploadWrapper.setAttribute('refresh', 'macro');
		uploadWrapper.getAttribute('macroName', 'fileImport');
		var iframeName = 'reflectorImporter' + Math.random().toString();
		me.createForm(uploadWrapper, wizard, iframeName);
		$(uploadWrapper).append('<p>' + me.step1PostText + '</p>');
		wizard.setValue('serverType', 'tiddlyweb');
		wizard.setValue('adaptor', new config.adaptors.file());
		wizard.setValue('host', config.defaultCustomFields['server.host']);
		wizard.setValue('context', {});
		wizard.setButtons([{
			caption: me.uploadLabel,
			tooltip: me.uploadLabelPrompt,
			onClick: function() {
				if (wizard.importType == "file") {
					var iframe = $('<iframe name="' + iframeName + '" '
						+ 'style="display: none" />').appendTo(uploadWrapper);
					// set an onload ready to hijack the form
					me.setOnLoad(uploadWrapper, wizard, iframe[0]);
					wizard.formElem.submit();
				} else {
					$.ajax({
						url: "%0/reflector".format([
							config.defaultCustomFields["server.host"]]),
						type: "POST",
						dataType: "text",
						data: {
							uri: $("input", ".importFrom", wizard.formElem).val()
						},
						success: function(data, txtStatus, xhr) {
							wizard.POSTResponse = data;
							me.importTiddlers(uploadWrapper, wizard);
						},
						error: function(xhr, txtStatus, error) {
							displayMessage("There was an error fetching the "
								+ 'url: ' + txtStatus);
							me.restart(wizard);
						}
					});
					return false;
				}
			}
		}]);
	},

	createForm: function(place, wizard, iframeName) {
		var form = wizard.formElem;
		var me = config.macros.fileImport;
		form.action = me.reflectorURI;
		form.enctype = 'multipart/form-data';
		form.method = 'POST';
		form.target = iframeName;
		onSelectChange = function(e) {
			var changeTo = $(this).val();
			if (changeTo == "file") {
				$(".importFrom").html('%0 <input type="file" name="file" />'.
					format([me.step1FileText]));
				wizard.importType = "file";
			} else {
				$(".importFrom").html('%0 <input type="text" name="uri" />'.
					format([me.step1URLText]));
				wizard.importType = "uri";
			}
		};
		$(place).append('<span>%0</span>'.format([me.step1TypeChooser])).
			append($('<select><option value="file" selected="selected">file'
				+ '<option value="uri">url</select>').change(onSelectChange)).
			append('<div class="importFrom">%0<input type="file" name="file" />'.
					format([me.step1FileText])
				+ '</div>');
		wizard.importType = "uri";
	},

	setOnLoad: function(place, wizard, iframe) {
		var me = config.macros.fileImport;
		var loadHandler = function() {
			me.importTiddlers.apply(this, [place, wizard, iframe]);
		};
		iframe.onload = loadHandler;
		completeReadyStateChanges = 0;
		iframe.onreadystatechange = function() {
			if (++(completeReadyStateChanges) == 3) {
				loadHandler();
			}
		}
	},

	importTiddlers: function(place, wizard, iframe) {
		var tmpStore = new TiddlyWiki();
		var POSTedWiki = "";
		if (wizard.importType == "file") {
			try {
				POSTedWiki= iframe.contentWindow
					.document.documentElement.innerHTML;
			} catch(e) {
				displayMessage(config.macros.fileImport.incorrectTypeError);
				config.macros.fileImport.restart(wizard);
				return;
			}
			// now we are done, so remove the iframe
			$(iframe).remove();
		} else {
			POSTedWiki = wizard.POSTResponse;
		}

		tmpStore.importTiddlyWiki(POSTedWiki);
		var newTiddlers = tmpStore.getTiddlers();
		var workspace = config.defaultCustomFields['server.workspace']
			.split(/^[^\/]*\//)[1];
		var context = {
			status: true,
			statusText: 'OK',
			httpStatus: 200,
			adaptor: wizard.getValue('adaptor'),
			tiddlers: newTiddlers
		};
		context.adaptor.store = tmpStore;
		wizard.setValue('context', context);
		wizard.setValue('workspace', workspace);
		wizard.setValue('inFileImport', true);
		config.macros.importTiddlers.onGetTiddlerList(context, wizard);
	}
};

var _onGetTiddler = config.macros.importTiddlers.onGetTiddler;
config.macros.importTiddlers.onGetTiddler = function(context, wizard) {
	if (wizard.getValue('inFileImport')) {
		var me = config.macros.importTiddlers;
		if(!context.status)
			displayMessage("Error in importTiddlers.onGetTiddler: " + context.statusText);
		var tiddler = context.tiddler;
		var fields = tiddler.fields;
		merge(fields, config.defaultCustomFields);
		delete fields['server.permissions'];
		delete fields['server.bag'];
		fields['server.page.revision'] = 'false';
		delete fields['server.recipe'];
		fields.changecount = 1;
		store.saveTiddler(tiddler.title, tiddler.title, tiddler.text,
			tiddler.modifier, tiddler.modified, tiddler.tags, tiddler.fields,
			false, tiddler.created);
		var remainingImports = wizard.getValue("remainingImports")-1;
		wizard.setValue("remainingImports",remainingImports);
		if(remainingImports === 0) {
			if(context.isSynchronous) {
				store.notifyAll();
				refreshDisplay();
			}
			wizard.setButtons([
					{caption: me.doneLabel, tooltip: me.donePrompt, onClick: me.onClose}
				],me.statusDoneImport);
			autoSaveChanges();
		}
	} else {
		_onGetTiddler.apply(this, arguments);
	}
};

var _onCancel = config.macros.importTiddlers.onCancel;
config.macros.importTiddlers.onCancel = function(e)
{
	var wizard = new Wizard(this);
	if (!wizard.getValue('inFileImport')) {
		return _onCancel.apply(this, arguments);
	}
	var place = wizard.clear();
	config.macros.fileImport.restart(wizard);
	return false;
};

var _step3Html = config.macros.importTiddlers.step3Html;
var _onGetTiddlerList = config.macros.importTiddlers.onGetTiddlerList;
config.macros.importTiddlers.onGetTiddlerList = function(context, wizard) {
	var fileImport = config.macros.fileImport;
	var importTiddlers = config.macros.importTiddlers;
	if (wizard.getValue('inFileImport')) {
		importTiddlers.step3Html = fileImport.step3Html;
	} else {
		importTiddlers.step3Html = _step3Html;
	}
	_onGetTiddlerList.apply(this, arguments);
}
})(jQuery);
//}}}
