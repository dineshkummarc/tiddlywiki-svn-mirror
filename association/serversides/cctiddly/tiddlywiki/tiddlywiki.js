//
// Please note:
// 
// * This code is designed to be readable but for compactness it only includes brief comments. You can see fuller comments
//   in the project Subversion repository at http://svn.tiddlywiki.org/Trunk/core/
//
// * You should never need to modify this source code directly. TiddlyWiki is carefully designed to allow deep customisation
//   without changing the core code. Please consult the development group at http://groups.google.com/group/TiddlyWikiDev
// 

//--
//-- Configuration repository
//--

// Miscellaneous options
var config = {
	numRssItems: 20, // Number of items in the RSS feed
	animDuration: 400, // Duration of UI animations in milliseconds
	cascadeFast: 20, // Speed for cascade animations (higher == slower)
	cascadeSlow: 60, // Speed for EasterEgg cascade animations
	cascadeDepth: 5 // Depth of cascade animation
};

// Adaptors
config.adaptors = {};

// Backstage tasks
config.tasks = {};

// Annotations
config.annotations = {};

// Custom fields to be automatically added to new tiddlers
config.defaultCustomFields = {};

// Messages
config.messages = {
	messageClose: {},
	dates: {},
	tiddlerPopup: {}
};

// Options that can be set in the options panel and/or cookies
config.options = {
	chkRegExpSearch: false,
	chkCaseSensitiveSearch: false,
	chkAnimate: true,
	chkSaveBackups: true,
	chkAutoSave: false,
	chkGenerateAnRssFeed: false,
	chkSaveEmptyTemplate: false,
	chkOpenInNewWindow: true,
	chkToggleLinks: false,
	chkHttpReadOnly: true,
	chkForceMinorUpdate: false,
	chkConfirmDelete: true,
	chkInsertTabs: false,
	chkUsePreForStorage: true, // Whether to use <pre> format for storage
	chkDisplayStartupTime: false,
	txtBackupFolder: "",
	txtMainTab: "tabTimeline",
	txtMoreTab: "moreTabAll",
	txtMaxEditRows: "30",
	txtFileSystemCharSet: "UTF-8"
	};
config.optionsDesc = {};

// List of notification functions to be called when certain tiddlers are changed or deleted
config.notifyTiddlers = [
	{name: "StyleSheetLayout", notify: refreshStyles},
	{name: "StyleSheetColors", notify: refreshStyles},
	{name: "StyleSheet", notify: refreshStyles},
	{name: "StyleSheetPrint", notify: refreshStyles},
	{name: "PageTemplate", notify: refreshPageTemplate},
	{name: "SiteTitle", notify: refreshPageTitle},
	{name: "SiteSubtitle", notify: refreshPageTitle},
	{name: "ColorPalette", notify: refreshColorPalette},
	{name: null, notify: refreshDisplay}
];

// Default tiddler templates
var DEFAULT_VIEW_TEMPLATE = 1;
var DEFAULT_EDIT_TEMPLATE = 2;
config.tiddlerTemplates = {
	1: "ViewTemplate",
	2: "EditTemplate"
};

// More messages (rather a legacy layout that shouldn't really be like this)
config.views = {
	wikified: {
		tag: {}
	},
	editor: {
		tagChooser: {}
	}
};

// Backstage tasks


// SIMONMCMANUS WAS HERE ADDING LOGIN LINKS

config.backstageTasks = ["save","sync","importTask", "Login", "tweak","plugins"];

// Macros; each has a 'handler' member that is inserted later
config.macros = {
	today: {},
	version: {},
	search: {sizeTextbox: 15},
	tiddler: {},
	tag: {},
	tags: {},
	tagging: {},
	timeline: {},
	allTags: {},
	list: {
		all: {},
		missing: {},
		orphans: {},
		shadowed: {},
		touched: {}
	},
	closeAll: {},
	permaview: {},
	saveChanges: {},
	slider: {},
	option: {},
	options: {},
	newTiddler: {},
	newJournal: {},
	sparkline: {},
	tabs: {},
	gradient: {},
	message: {},
	view: {},
	edit: {},
	tagChooser: {},
	toolbar: {},
	br: {},
	plugins: {},
	refreshDisplay: {},
	importTiddlers: {},
	sync: {},
	annotations: {}
};

// Commands supported by the toolbar macro
config.commands = {
	closeTiddler: {},
	closeOthers: {},
	editTiddler: {},
	saveTiddler: {hideReadOnly: true},
	cancelTiddler: {},
	deleteTiddler: {hideReadOnly: true},
	permalink: {},
	references: {type: "popup"},
	jump: {type: "popup"},
	syncing: {type: "popup"},
	fields: {type: "popup"}
};

// Browser detection... In a very few places, there's nothing else for it but to know what browser we're using.
config.userAgent = navigator.userAgent.toLowerCase();
config.browser = {
	isIE: config.userAgent.indexOf("msie") != -1 && config.userAgent.indexOf("opera") == -1,
	isGecko: config.userAgent.indexOf("gecko") != -1,
	ieVersion: /MSIE (\d.\d)/i.exec(config.userAgent), // config.browser.ieVersion[1], if it exists, will be the IE version string, eg "6.0"
	isSafari: config.userAgent.indexOf("applewebkit") != -1,
	isBadSafari: !((new RegExp("[\u0150\u0170]","g")).test("\u0150")),
	firefoxDate: /gecko\/(\d{8})/i.exec(config.userAgent), // config.browser.firefoxDate[1], if it exists, will be Firefox release date as "YYYYMMDD"
	isOpera: config.userAgent.indexOf("opera") != -1,
	isLinux: config.userAgent.indexOf("linux") != -1,
	isUnix: config.userAgent.indexOf("x11") != -1,
	isMac: config.userAgent.indexOf("mac") != -1,
	isWindows: config.userAgent.indexOf("win") != -1
};

// Basic regular expressions
config.textPrimitives = {
	upperLetter: "[A-Z\u00c0-\u00de\u0150\u0170]",
	lowerLetter: "[a-z0-9_\\-\u00df-\u00ff\u0151\u0171]",
	anyLetter:   "[A-Za-z0-9_\\-\u00c0-\u00de\u00df-\u00ff\u0150\u0170\u0151\u0171]",
	anyLetterStrict: "[A-Za-z0-9\u00c0-\u00de\u00df-\u00ff\u0150\u0170\u0151\u0171]"
};
if(config.browser.isBadSafari) {
	config.textPrimitives = {
		upperLetter: "[A-Z\u00c0-\u00de]",
		lowerLetter: "[a-z0-9_\\-\u00df-\u00ff]",
		anyLetter:   "[A-Za-z0-9_\\-\u00c0-\u00de\u00df-\u00ff]",
		anyLetterStrict: "[A-Za-z0-9\u00c0-\u00de\u00df-\u00ff]"
	};
}
config.textPrimitives.sliceSeparator = "::";
config.textPrimitives.urlPattern = "[a-z]{3,8}:[^\\s:'\"][^\\s'\"]*(?:/|\\b)";
config.textPrimitives.unWikiLink = "~";
config.textPrimitives.wikiLink = "(?:(?:" + config.textPrimitives.upperLetter + "+" +
	config.textPrimitives.lowerLetter + "+" +
	config.textPrimitives.upperLetter +
	config.textPrimitives.anyLetter + "*)|(?:" +
	config.textPrimitives.upperLetter + "{2,}" +
	config.textPrimitives.lowerLetter + "+))";

config.textPrimitives.cssLookahead = "(?:(" + config.textPrimitives.anyLetter + "+)\\(([^\\)\\|\\n]+)(?:\\):))|(?:(" + config.textPrimitives.anyLetter + "+):([^;\\|\\n]+);)";
config.textPrimitives.cssLookaheadRegExp = new RegExp(config.textPrimitives.cssLookahead,"mg");

config.textPrimitives.brackettedLink = "\\[\\[([^\\]]+)\\]\\]";
config.textPrimitives.titledBrackettedLink = "\\[\\[([^\\[\\]\\|]+)\\|([^\\[\\]\\|]+)\\]\\]";
config.textPrimitives.tiddlerForcedLinkRegExp = new RegExp("(?:" + config.textPrimitives.titledBrackettedLink + ")|(?:" +
	config.textPrimitives.brackettedLink + ")|(?:" +
	config.textPrimitives.urlPattern + ")","mg");
config.textPrimitives.tiddlerAnyLinkRegExp = new RegExp("("+ config.textPrimitives.wikiLink + ")|(?:" +
	config.textPrimitives.titledBrackettedLink + ")|(?:" +
	config.textPrimitives.brackettedLink + ")|(?:" +
	config.textPrimitives.urlPattern + ")","mg");

config.glyphs = {
	browsers: [
		function() {return config.browser.isIE;},
		function() {return true;}
	],
	currBrowser: null,
	codes: {
		downTriangle: ["\u25BC","\u25BE"],
		downArrow: ["\u2193","\u2193"],
		bentArrowLeft: ["\u2190","\u21A9"],
		bentArrowRight: ["\u2192","\u21AA"]
	}
};

//--
//-- Shadow tiddlers
//--

config.shadowTiddlers = {
	StyleSheet: "",
	MarkupPreHead: "<!--{{{-->\n<link rel='alternate' type='application/rss+xml' title='RSS' href='index.xml'/>\n<!--}}}-->",
	MarkupPostHead: "",
	MarkupPreBody: "",
	MarkupPostBody: "",
	TabTimeline: '<<timeline>>',
	TabAll: '<<list all>>',
	TabTags: '<<allTags excludeLists>>',
	TabMoreMissing: '<<list missing>>',
	TabMoreOrphans: '<<list orphans>>',
	TabMoreShadowed: '<<list shadowed>>',
	AdvancedOptions: '<<options>>',
	PluginManager: '<<plugins>>',
	ImportTiddlers: '<<importTiddlers>>'
};

//--
//-- Translateable strings
//--

// Strings in "double quotes" should be translated; strings in 'single quotes' should be left alone

merge(config.options,{
	txtUserName: "YourName"});

merge(config.tasks,{
	save: {text: "save", tooltip: "Save your changes to this TiddlyWiki", action: saveChanges},
	sync: {text: "sync", tooltip: "Synchronise changes with other TiddlyWiki files and servers", content: '<<sync>>'},
	importTask: {text: "import", tooltip: "Import tiddlers and plugins from other TiddlyWiki files and servers", content: '<<importTiddlers>>'},
	tweak: {text: "tweak", tooltip: "Tweak the appearance and behaviour of TiddlyWiki", content: '<<options>>'},
	Login: {text: "Login", tooltip: "Login to your TiddlyWiki", content: '<<ccLogin>>'},
	plugins: {text: "plugins", tooltip: "Manage installed plugins", content: '<<plugins>>'}
});


//  SIMONMCMANUS WAS HERE 


// Options that can be set in the options panel and/or cookies
merge(config.optionsDesc,{
	txtUserName: "Username for signing your edits",
	chkRegExpSearch: "Enable regular expressions for searches",
	chkCaseSensitiveSearch: "Case-sensitive searching",
	chkAnimate: "Enable animations",
	chkSaveBackups: "Keep backup file when saving changes",
	chkAutoSave: "Automatically save changes",
	chkGenerateAnRssFeed: "Generate an RSS feed when saving changes",
	chkSaveEmptyTemplate: "Generate an empty template when saving changes",
	chkOpenInNewWindow: "Open external links in a new window",
	chkToggleLinks: "Clicking on links to open tiddlers causes them to close",
	chkHttpReadOnly: "Hide editing features when viewed over HTTP",
	chkForceMinorUpdate: "Don't update modifier username and date when editing tiddlers",
	chkConfirmDelete: "Require confirmation before deleting tiddlers",
	chkInsertTabs: "Use the tab key to insert tab characters instead of moving between fields",
	txtBackupFolder: "Name of folder to use for backups",
	txtMaxEditRows: "Maximum number of rows in edit boxes",
	txtFileSystemCharSet: "Default character set for saving changes (Firefox/Mozilla only)"});

merge(config.messages,{
	customConfigError: "Problems were encountered loading plugins. See PluginManager for details",
	pluginError: "Error: %0",
	pluginDisabled: "Not executed because disabled via 'systemConfigDisable' tag",
	pluginForced: "Executed because forced via 'systemConfigForce' tag",
	pluginVersionError: "Not executed because this plugin needs a newer version of TiddlyWiki",
	nothingSelected: "Nothing is selected. You must select one or more items first",
	savedSnapshotError: "It appears that this TiddlyWiki has been incorrectly saved. Please see http://www.tiddlywiki.com/#DownloadSoftware for details",
	subtitleUnknown: "(unknown)",
	undefinedTiddlerToolTip: "The tiddler '%0' doesn't yet exist",
	shadowedTiddlerToolTip: "The tiddler '%0' doesn't yet exist, but has a pre-defined shadow value",
	tiddlerLinkTooltip: "%0 - %1, %2",
	externalLinkTooltip: "External link to %0",
	noTags: "There are no tagged tiddlers",
	notFileUrlError: "You need to save this TiddlyWiki to a file before you can save changes",
	cantSaveError: "It's not possible to save changes. Possible reasons include:\n- your browser doesn't support saving (Firefox, Internet Explorer, Safari and Opera all work if properly configured)\n- the pathname to your TiddlyWiki file contains illegal characters\n- the TiddlyWiki HTML file has been moved or renamed",
	invalidFileError: "The original file '%0' does not appear to be a valid TiddlyWiki",
	backupSaved: "Backup saved",
	backupFailed: "Failed to save backup file",
	rssSaved: "RSS feed saved",
	rssFailed: "Failed to save RSS feed file",
	emptySaved: "Empty template saved",
	emptyFailed: "Failed to save empty template file",
	mainSaved: "Main TiddlyWiki file saved",
	mainFailed: "Failed to save main TiddlyWiki file. Your changes have not been saved",
	macroError: "Error in macro <<\%0>>",
	macroErrorDetails: "Error while executing macro <<\%0>>:\n%1",
	missingMacro: "No such macro",
	overwriteWarning: "A tiddler named '%0' already exists. Choose OK to overwrite it",
	unsavedChangesWarning: "WARNING! There are unsaved changes in TiddlyWiki\n\nChoose OK to save\nChoose CANCEL to discard",
	confirmExit: "--------------------------------\n\nThere are unsaved changes in TiddlyWiki. If you continue you will lose those changes\n\n--------------------------------",
	saveInstructions: "SaveChanges",
	unsupportedTWFormat: "Unsupported TiddlyWiki format '%0'",
	tiddlerSaveError: "Error when saving tiddler '%0'",
	tiddlerLoadError: "Error when loading tiddler '%0'",
	wrongSaveFormat: "Cannot save with storage format '%0'. Using standard format for save.",
	invalidFieldName: "Invalid field name %0",
	fieldCannotBeChanged: "Field '%0' cannot be changed",
	loadingMissingTiddler: "Attempting to retrieve the tiddler '%0' from the '%1' server at:\n\n'%2' in the workspace '%3'"});

merge(config.messages.messageClose,{
	text: "close",
	tooltip: "close this message area"});

config.messages.backstage = {
	open: {text: "backstage", tooltip: "Open the backstage area to perform authoring and editing tasks"},
	close: {text: "close", tooltip: "Close the backstage area"},
	prompt: "backstage: ",
	decal: {
		edit: {text: "edit", tooltip: "Edit the tiddler '%0'"}
	}
};

config.messages.listView = {
	tiddlerTooltip: "Click for the full text of this tiddler",
	previewUnavailable: "(preview not available)"
};

config.messages.dates.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"];
config.messages.dates.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
config.messages.dates.shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
config.messages.dates.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// suffixes for dates, eg "1st","2nd","3rd"..."30th","31st"
config.messages.dates.daySuffixes = ["st","nd","rd","th","th","th","th","th","th","th",
		"th","th","th","th","th","th","th","th","th","th",
		"st","nd","rd","th","th","th","th","th","th","th",
		"st"];
config.messages.dates.am = "am";
config.messages.dates.pm = "pm";

merge(config.messages.tiddlerPopup,{
	});

merge(config.views.wikified.tag,{
	labelNoTags: "no tags",
	labelTags: "tags: ",
	openTag: "Open tag '%0'",
	tooltip: "Show tiddlers tagged with '%0'",
	openAllText: "Open all",
	openAllTooltip: "Open all of these tiddlers",
	popupNone: "No other tiddlers tagged with '%0'"});

merge(config.views.wikified,{
	defaultText: "The tiddler '%0' doesn't yet exist. Double-click to create it",
	defaultModifier: "(missing)",
	shadowModifier: "(built-in shadow tiddler)",
	dateFormat: "DD MMM YYYY",
	createdPrompt: "created"});

merge(config.views.editor,{
	tagPrompt: "Type tags separated with spaces, [[use double square brackets]] if necessary, or add existing",
	defaultText: "Type the text for '%0'"});

merge(config.views.editor.tagChooser,{
	text: "tags",
	tooltip: "Choose existing tags to add to this tiddler",
	popupNone: "There are no tags defined",
	tagTooltip: "Add the tag '%0'"});

merge(config.messages,{
	sizeTemplates:
		[
		{unit: 1024*1024*1024, template: "%0\u00a0GB"},
		{unit: 1024*1024, template: "%0\u00a0MB"},
		{unit: 1024, template: "%0\u00a0KB"},
		{unit: 1, template: "%0\u00a0B"}
		]});

merge(config.macros.search,{
	label: "search",
	prompt: "Search this TiddlyWiki",
	accessKey: "F",
	successMsg: "%0 tiddlers found matching %1",
	failureMsg: "No tiddlers found matching %0"});

merge(config.macros.tagging,{
	label: "tagging: ",
	labelNotTag: "not tagging",
	tooltip: "List of tiddlers tagged with '%0'"});

merge(config.macros.timeline,{
	dateFormat: "DD MMM YYYY"});

merge(config.macros.allTags,{
	tooltip: "Show tiddlers tagged with '%0'",
	noTags: "There are no tagged tiddlers"});

config.macros.list.all.prompt = "All tiddlers in alphabetical order";
config.macros.list.missing.prompt = "Tiddlers that have links to them but are not defined";
config.macros.list.orphans.prompt = "Tiddlers that are not linked to from any other tiddlers";
config.macros.list.shadowed.prompt = "Tiddlers shadowed with default contents";
config.macros.list.touched.prompt = "Tiddlers that have been modified locally";

merge(config.macros.closeAll,{
	label: "close all",
	prompt: "Close all displayed tiddlers (except any that are being edited)"});

merge(config.macros.permaview,{
	label: "permaview",
	prompt: "Link to an URL that retrieves all the currently displayed tiddlers"});

merge(config.macros.saveChanges,{
	label: "save changes",
	prompt: "Save all tiddlers to create a new TiddlyWiki",
	accessKey: "S"});

merge(config.macros.newTiddler,{
	label: "new tiddler",
	prompt: "Create a new tiddler",
	title: "New Tiddler",
	accessKey: "N"});

merge(config.macros.newJournal,{
	label: "new journal",
	prompt: "Create a new tiddler from the current date and time",
	accessKey: "J"});

merge(config.macros.options,{
	wizardTitle: "Tweak advanced options",
	step1Title: "These options are saved in cookies in your browser",
	step1Html: "<input type='hidden' name='markList'></input><br><input type='checkbox' checked='false' name='chkUnknown'>Show unknown options</input>",
	unknownDescription: "//(unknown)//",
	listViewTemplate: {
		columns: [
			{name: 'Option', field: 'option', title: "Option", type: 'String'},
			{name: 'Description', field: 'description', title: "Description", type: 'WikiText'},
			{name: 'Name', field: 'name', title: "Name", type: 'String'}
			],
		rowClasses: [
			{className: 'lowlight', field: 'lowlight'}
			]}
	});

merge(config.macros.plugins,{
	wizardTitle: "Manage plugins",
	step1Title: "Currently loaded plugins",
	step1Html: "<input type='hidden' name='markList'></input>", // DO NOT TRANSLATE
	skippedText: "(This plugin has not been executed because it was added since startup)",
	noPluginText: "There are no plugins installed",
	confirmDeleteText: "Are you sure you want to delete these plugins:\n\n%0",
	removeLabel: "remove systemConfig tag",
	removePrompt: "Remove systemConfig tag",
	deleteLabel: "delete",
	deletePrompt: "Delete these tiddlers forever",
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
			{name: 'Tiddler', field: 'tiddler', title: "Tiddler", type: 'Tiddler'},
			{name: 'Size', field: 'size', tiddlerLink: 'size', title: "Size", type: 'Size'},
			{name: 'Forced', field: 'forced', title: "Forced", tag: 'systemConfigForce', type: 'TagCheckbox'},
			{name: 'Disabled', field: 'disabled', title: "Disabled", tag: 'systemConfigDisable', type: 'TagCheckbox'},
			{name: 'Executed', field: 'executed', title: "Loaded", type: 'Boolean', trueText: "Yes", falseText: "No"},
			{name: 'Startup Time', field: 'startupTime', title: "Startup Time", type: 'String'},
			{name: 'Error', field: 'error', title: "Status", type: 'Boolean', trueText: "Error", falseText: "OK"},
			{name: 'Log', field: 'log', title: "Log", type: 'StringList'}
			],
		rowClasses: [
			{className: 'error', field: 'error'},
			{className: 'warning', field: 'warning'}
			]}
	});

merge(config.macros.toolbar,{
	moreLabel: "more",
	morePrompt: "Reveal further commands"
	});

merge(config.macros.refreshDisplay,{
	label: "refresh",
	prompt: "Redraw the entire TiddlyWiki display"
	});

merge(config.macros.importTiddlers,{
	readOnlyWarning: "You cannot import into a read-only TiddlyWiki file. Try opening it from a file:// URL",
	wizardTitle: "Import tiddlers from another file or server",
	step1Title: "Step 1: Locate the server or TiddlyWiki file",
	step1Html: "Specify the type of the server: <select name='selTypes'><option value=''>Choose...</option></select><br>Enter the URL or pathname here: <input type='text' size=50 name='txtPath'><br>...or browse for a file: <input type='file' size=50 name='txtBrowse'><br><hr>...or select a pre-defined feed: <select name='selFeeds'><option value=''>Choose...</option></select>",
	openLabel: "open",
	openPrompt: "Open the connection to this file or server",
	openError: "There were problems fetching the tiddlywiki file",
	statusOpenHost: "Opening the host",
	statusGetWorkspaceList: "Getting the list of available workspaces",
	step2Title: "Step 2: Choose the workspace",
	step2Html: "Enter a workspace name: <input type='text' size=50 name='txtWorkspace'><br>...or select a workspace: <select name='selWorkspace'><option value=''>Choose...</option></select>",
	cancelLabel: "cancel",
	cancelPrompt: "Cancel this import",
	statusOpenWorkspace: "Opening the workspace",
	statusGetTiddlerList: "Getting the list of available tiddlers",
	step3Title: "Step 3: Choose the tiddlers to import",
	step3Html: "<input type='hidden' name='markList'></input><br><input type='checkbox' checked='true' name='chkSync'>Keep these tiddlers linked to this server so that you can synchronise subsequent changes</input><br><input type='checkbox' name='chkSave'>Save the details of this server in a 'systemServer' tiddler called:</input> <input type='text' size=25 name='txtSaveTiddler'>",
	importLabel: "import",
	importPrompt: "Import these tiddlers",
	confirmOverwriteText: "Are you sure you want to overwrite these tiddlers:\n\n%0",
	step4Title: "Step 4: Importing %0 tiddler(s)",
	step4Html: "<input type='hidden' name='markReport'></input>", // DO NOT TRANSLATE
	doneLabel: "done",
	donePrompt: "Close this wizard",
	statusDoingImport: "Importing tiddlers",
	statusDoneImport: "All tiddlers imported",
	systemServerNamePattern: "%2 on %1",
	systemServerNamePatternNoWorkspace: "%1",
	confirmOverwriteSaveTiddler: "The tiddler '%0' already exists. Click 'OK' to overwrite it with the details of this server, or 'Cancel' to leave it unchanged",
	serverSaveTemplate: "|''Type:''|%0|\n|''URL:''|%1|\n|''Workspace:''|%2|\n\nThis tiddler was automatically created to record the details of this server",
	serverSaveModifier: "(System)",
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'Selected', rowName: 'title', type: 'Selector'},
			{name: 'Tiddler', field: 'tiddler', title: "Tiddler", type: 'Tiddler'},
			{name: 'Size', field: 'size', tiddlerLink: 'size', title: "Size", type: 'Size'},
			{name: 'Tags', field: 'tags', title: "Tags", type: 'Tags'}
			],
		rowClasses: [
			]}
	});

merge(config.macros.sync,{
	listViewTemplate: {
		columns: [
			{name: 'Selected', field: 'selected', rowName: 'title', type: 'Selector'},
			{name: 'Tiddler', field: 'tiddler', title: "Tiddler", type: 'Tiddler'},
			{name: 'Server Type', field: 'serverType', title: "Server type", type: 'String'},
			{name: 'Server Host', field: 'serverHost', title: "Server host", type: 'String'},
			{name: 'Server Workspace', field: 'serverWorkspace', title: "Server workspace", type: 'String'},
			{name: 'Status', field: 'status', title: "Synchronisation status", type: 'String'},
			{name: 'Server URL', field: 'serverUrl', title: "Server URL", text: "View", type: 'Link'}
			],
		rowClasses: [
			],
		buttons: [
			{caption: "Sync these tiddlers", name: 'sync'}
			]},
	wizardTitle: "Synchronize with external servers and files",
	step1Title: "Choose the tiddlers you want to synchronize",
	step1Html: "<input type='hidden' name='markList'></input>", // DO NOT TRANSLATE
	syncLabel: "sync",
	syncPrompt: "Sync these tiddlers",
	hasChanged: "Changed while unplugged",
	hasNotChanged: "Unchanged while unplugged",
	syncStatusList: {
		none: {text: "...", color: "none"},
		changedServer: {text: "Changed on server", color: '#80ff80'},
		changedLocally: {text: "Changed while unplugged", color: '#80ff80'},
		changedBoth: {text: "Changed while unplugged and on server", color: '#ff8080'},
		notFound: {text: "Not found on server", color: '#ffff80'},
		putToServer: {text: "Saved update on server", color: '#ff80ff'},
		gotFromServer: {text: "Retrieved update from server", color: '#80ffff'}
		}
	});

merge(config.macros.annotations,{
	});

merge(config.commands.closeTiddler,{
	text: "close",
	tooltip: "Close this tiddler"});

merge(config.commands.closeOthers,{
	text: "close others",
	tooltip: "Close all other tiddlers"});

merge(config.commands.editTiddler,{
	text: "edit",
	tooltip: "Edit this tiddler",
	readOnlyText: "view",
	readOnlyTooltip: "View the source of this tiddler"});

merge(config.commands.saveTiddler,{
	text: "done",
	tooltip: "Save changes to this tiddler"});

merge(config.commands.cancelTiddler,{
	text: "cancel",
	tooltip: "Undo changes to this tiddler",
	warning: "Are you sure you want to abandon your changes to '%0'?",
	readOnlyText: "done",
	readOnlyTooltip: "View this tiddler normally"});

merge(config.commands.deleteTiddler,{
	text: "delete",
	tooltip: "Delete this tiddler",
	warning: "Are you sure you want to delete '%0'?"});

merge(config.commands.permalink,{
	text: "permalink",
	tooltip: "Permalink for this tiddler"});

merge(config.commands.references,{
	text: "references",
	tooltip: "Show tiddlers that link to this one",
	popupNone: "No references"});

merge(config.commands.jump,{
	text: "jump",
	tooltip: "Jump to another open tiddler"});

merge(config.commands.syncing,{
	text: "syncing",
	tooltip: "Control synchronisation of this tiddler with a server or external file",
	currentlySyncing: "<div>Currently syncing via <span class='popupHighlight'>'%0'</span> to:</"+"div><div>host: <span class='popupHighlight'>%1</span></"+"div><div>workspace: <span class='popupHighlight'>%2</span></"+"div>", // Note escaping of closing <div> tag
	notCurrentlySyncing: "Not currently syncing",
	captionUnSync: "Stop synchronising this tiddler",
	chooseServer: "Synchronise this tiddler with another server:",
	currServerMarker: "\u25cf ",
	notCurrServerMarker: "  "});

merge(config.commands.fields,{
	text: "fields",
	tooltip: "Show the extended fields of this tiddler",
	emptyText: "There are no extended fields for this tiddler",
	listViewTemplate: {
		columns: [
			{name: 'Field', field: 'field', title: "Field", type: 'String'},
			{name: 'Value', field: 'value', title: "Value", type: 'String'}
			],
		rowClasses: [
			],
		buttons: [
			]}});

merge(config.shadowTiddlers,{
	DefaultTiddlers: "GettingStarted",
	MainMenu: "GettingStarted",
	SiteTitle: "My TiddlyWiki",
	SiteSubtitle: "a reusable non-linear personal web notebook",
	SiteUrl: "http://www.tiddlywiki.com/",
	SideBarOptions: '<<search>><<closeAll>><<permaview>><<newTiddler>><<newJournal "DD MMM YYYY">><<saveChanges>><<slider chkSliderOptionsPanel OptionsPanel "options »" "Change TiddlyWiki advanced options">>',
	SideBarTabs: '<<tabs txtMainTab "Timeline" "Timeline" TabTimeline "All" "All tiddlers" TabAll "Tags" "All tags" TabTags "More" "More lists" TabMore>>',
	TabMore: '<<tabs txtMoreTab "Missing" "Missing tiddlers" TabMoreMissing "Orphans" "Orphaned tiddlers" TabMoreOrphans "Shadowed" "Shadowed tiddlers" TabMoreShadowed>>'});

merge(config.annotations,{
	AdvancedOptions: "This shadow tiddler provides access to several advanced options",
	ColorPalette: "These values in this shadow tiddler determine the colour scheme of the ~TiddlyWiki user interface",
	DefaultTiddlers: "The tiddlers listed in this shadow tiddler will be automatically displayed when ~TiddlyWiki starts up",
	EditTemplate: "The HTML template in this shadow tiddler determines how tiddlers look while they are being edited",
	GettingStarted: "This shadow tiddler provides basic usage instructions",
	ImportTiddlers: "This shadow tiddler provides access to importing tiddlers",
	MainMenu: "This shadow tiddler is used as the contents of the main menu in the left-hand column of the screen",
	MarkupPreHead: "This tiddler is inserted at the top of the <head> section of the TiddlyWiki HTML file",
	MarkupPostHead: "This tiddler is inserted at the bottom of the <head> section of the TiddlyWiki HTML file",
	MarkupPreBody: "This tiddler is inserted at the top of the <body> section of the TiddlyWiki HTML file",
	MarkupPostBody: "This tiddler is inserted at the end of the <body> section of the TiddlyWiki HTML file immediately before the script block",
	OptionsPanel: "This shadow tiddler is used as the contents of the options panel slider in the right-hand sidebar",
	PageTemplate: "The HTML template in this shadow tiddler determines the overall ~TiddlyWiki layout",
	PluginManager: "This shadow tiddler provides access to the plugin manager",
	SideBarOptions: "This shadow tiddler is used as the contents of the option panel in the right-hand sidebar",
	SideBarTabs: "This shadow tiddler is used as the contents of the tabs panel in the right-hand sidebar",
	SiteSubtitle: "This shadow tiddler is used as the second part of the page title",
	SiteTitle: "This shadow tiddler is used as the first part of the page title",
	SiteUrl: "This shadow tiddler should be set to the full target URL for publication",
	StyleSheetColours: "This shadow tiddler contains CSS definitions related to the color of page elements",
	StyleSheet: "This tiddler can contain custom CSS definitions",
	StyleSheetLayout: "This shadow tiddler contains CSS definitions related to the layout of page elements",
	StyleSheetLocale: "This shadow tiddler contains CSS definitions related to the translation locale",
	StyleSheetPrint: "This shadow tiddler contains CSS definitions for printing",
	TabAll: "This shadow tiddler contains the contents of the 'All' tab in the right-hand sidebar",
	TabMore: "This shadow tiddler contains the contents of the 'More' tab in the right-hand sidebar",
	TabMoreMissing: "This shadow tiddler contains the contents of the 'Missing' tab in the right-hand sidebar",
	TabMoreOrphans: "This shadow tiddler contains the contents of the 'Orphans' tab in the right-hand sidebar",
	TabMoreShadowed: "This shadow tiddler contains the contents of the 'Shadowed' tab in the right-hand sidebar",
	TabTags: "This shadow tiddler contains the contents of the 'Tags' tab in the right-hand sidebar",
	TabTimeline: "This shadow tiddler contains the contents of the 'Timeline' tab in the right-hand sidebar",
	ViewTemplate: "The HTML template in this shadow tiddler determines how tiddlers look"
	});

//--
//-- Main
//--

var params = null; // Command line parameters
var shadow = null; // TiddlyWiki storage
var store = null; // TiddlyWiki storage
var story = null; // Main story
var formatter = null; // Default formatters for the wikifier
config.parsers = {}; // Hashmap of alternative parsers for the wikifier
var anim = new Animator(); // Animation engine
var readOnly = false; // Whether we're in readonly mode
var highlightHack = null; // Embarrassing hack department...
var hadConfirmExit = false; // Don't warn more than once
var safeMode = false; // Disable all plugins and cookies
var installedPlugins = []; // Information filled in when plugins are executed
var startingUp = false; // Whether we're in the process of starting up
var pluginInfo,tiddler; // Used to pass information to plugins in loadPlugins()

// Whether to use the JavaSaver applet
var useJavaSaver = config.browser.isSafari || config.browser.isOpera;

// Starting up
function main()
{
	var t10,t9,t8,t7,t6,t5,t4,t3,t2,t1,t0 = new Date();
	startingUp = true;
	window.onbeforeunload = function(e) {if(window.confirmExit) return confirmExit();};
	params = getParameters();
	if(params)
		params = params.parseParams("open",null,false);
	store = new TiddlyWiki();
	shadows = new TiddlyWiki();
	invokeParamifier(params,"oninit");
	story = new Story("tiddlerDisplay","tiddler");
	addEvent(document,"click",Popup.onDocumentClick);
	saveTest();
	loadOptionsCookie();
	for(var s=0; s<config.notifyTiddlers.length; s++)
		store.addNotification(config.notifyTiddlers[s].name,config.notifyTiddlers[s].notify);
	t1 = new Date();
	store.loadFromDiv("storeArea","store",true);
	t2 = new Date();
	loadShadowTiddlers();
	t3 = new Date();
	invokeParamifier(params,"onload");
	t4 = new Date();
	readOnly = (window.location.protocol == "file:") ? false : config.options.chkHttpReadOnly;
	var pluginProblem = loadPlugins();
	t5 = new Date();
	formatter = new Formatter(config.formatters);
	invokeParamifier(params,"onconfig");
	t6 = new Date();
	store.notifyAll();
	t7 = new Date();
	restart();
	t8 = new Date();
	if(pluginProblem) {
		story.displayTiddler(null,"PluginManager");
		displayMessage(config.messages.customConfigError);
	}
	for(var m in config.macros) {
		if(config.macros[m].init)
			config.macros[m].init();
	}
	t9 = new Date();
	if(!readOnly)
		backstage.init();
	t10 = new Date();
	if(config.options.chkDisplayStartupTime) { 
		displayMessage("LoadFromDiv " + (t2-t1) + " ms");
		displayMessage("LoadShadows " + (t3-t2) + " ms");
		displayMessage("LoadPlugins " + (t5-t4) + " ms");
		displayMessage("Notify " + (t7-t6) + " ms");
		displayMessage("Restart " + (t8-t7) + " ms");
		displayMessage("Macro init " + (t9-t8) + " ms");
		displayMessage("Total: " + (t10-t0) + " ms");
	}
	startingUp = false;
}

// Restarting
function restart()
{
	invokeParamifier(params,"onstart");
	if(story.isEmpty()) {
		var defaultParams = store.getTiddlerText("DefaultTiddlers").parseParams("open",null,false);
		invokeParamifier(defaultParams,"onstart");
	}
	window.scrollTo(0,0);
}

function saveTest()
{
	var s = document.getElementById("saveTest");
	if(s.hasChildNodes())
		alert(config.messages.savedSnapshotError);
	s.appendChild(document.createTextNode("savetest"));
}

function loadShadowTiddlers()
{
	shadows.loadFromDiv("shadowArea","shadows",true);
	shadows.forEachTiddler(function(title,tiddler){config.shadowTiddlers[title] = tiddler.text;});
}

function loadPlugins()
{
	if(safeMode)
		return false;
	var tiddlers = store.getTaggedTiddlers("systemConfig");
	var toLoad = [];
	var nLoaded = 0;
	var map = {};
	var nPlugins = tiddlers.length;
	installedPlugins = [];
	for(var i=0; i<nPlugins; i++) {
		var p = getPluginInfo(tiddlers[i]);
		installedPlugins[i] = p;
		var n = p.Name;
		if(n) 
			map[n] = p;
		n = p.Source;
		if(n)
			map[n] = p;
	}
	var visit = function(p) {
		if(!p || p.done)
			return;
		p.done = 1;
		var reqs = p.Requires;
		if(reqs) {
			reqs = reqs.readBracketedList();
			for(var i=0; i<reqs.length; i++)
				visit(map[reqs[i]]);
		}
		toLoad.push(p);
	};
	for(i=0; i<nPlugins; i++) 
		visit(installedPlugins[i]);		
	for(i=0; i<toLoad.length; i++) {
		p = toLoad[i];
		pluginInfo = p;
		tiddler = p.tiddler;
		if(isPluginExecutable(p)) {
			if(isPluginEnabled(p)) {
				p.executed = true;
				var startTime = new Date();
				try {
					if(tiddler.text)
						window.eval(tiddler.text);
					nLoaded++;
				} catch(ex) {
					p.log.push(config.messages.pluginError.format([exceptionText(ex)]));
					p.error = true;
				}
				pluginInfo.startupTime = String((new Date()) - startTime) + "ms"; 
			} else {
				nPlugins--;
			}
		} else {
			p.warning = true;
		}
	}
	return nLoaded != nPlugins;
}

function getPluginInfo(tiddler)
{
	var p = store.getTiddlerSlices(tiddler.title,["Name","Description","Version","Requires","CoreVersion","Date","Source","Author","License","Browsers"]);
	p.tiddler = tiddler;
	p.title = tiddler.title;
	p.log = [];
	return p;
}

// Check that a particular plugin is valid for execution
function isPluginExecutable(plugin)
{
	if(plugin.tiddler.isTagged("systemConfigForce"))
		return verifyTail(plugin,true,config.messages.pluginForced);
	if(plugin["CoreVersion"]) {
		var coreVersion = plugin["CoreVersion"].split(".");
		var w = parseInt(coreVersion[0]) - version.major;
		if(w == 0 && coreVersion[1])
			w = parseInt(coreVersion[1]) - version.minor;
		if(w == 0 && coreVersion[2])
		 	w = parseInt(coreVersion[2]) - version.revision;
		if(w > 0)
			return verifyTail(plugin,false,config.messages.pluginVersionError);
		}
	return true;
}

function isPluginEnabled(plugin)
{
	if(plugin.tiddler.isTagged("systemConfigDisable"))
		return verifyTail(plugin,false,config.messages.pluginDisabled);
	return true;
}

function verifyTail(plugin,result,message)
{
	plugin.log.push(message);
	return result;
}

function invokeMacro(place,macro,params,wikifier,tiddler)
{
	try {
		var m = config.macros[macro];
		if(m && m.handler)
			m.handler(place,macro,params.readMacroParams(),wikifier,params,tiddler);
		else
			createTiddlyError(place,config.messages.macroError.format([macro]),config.messages.macroErrorDetails.format([macro,config.messages.missingMacro]));
	} catch(ex) {
		createTiddlyError(place,config.messages.macroError.format([macro]),config.messages.macroErrorDetails.format([macro,ex.toString()]));
	}
}

//--
//-- Paramifiers
//--

function getParameters()
{
	var p = null;
	if(window.location.hash) {
		p = decodeURI(window.location.hash.substr(1));
		if(config.browser.firefoxDate != null && config.browser.firefoxDate[1] < "20051111")
			p = convertUTF8ToUnicode(p);
	}
	return p;
}

function invokeParamifier(params,handler)
{
	if(!params || params.length == undefined || params.length <= 1)
		return;
	for(var t=1; t<params.length; t++) {
		var p = config.paramifiers[params[t].name];
		if(p && p[handler] instanceof Function)
			p[handler](params[t].value);
	}
}

config.paramifiers = {};

config.paramifiers.start = {
	oninit: function(v) {
		safeMode = v.toLowerCase() == "safe";
	}
};

config.paramifiers.open = {
	onstart: function(v) {
		story.displayTiddler("bottom",v,null,false,null);
	}
};

config.paramifiers.story = {
	onstart: function(v) {
		var list = store.getTiddlerText(v,"").parseParams("open",null,false);
		invokeParamifier(list,"onstart");
	}
};

config.paramifiers.search = {
	onstart: function(v) {
		story.search(v,false,false);
	}
};

config.paramifiers.searchRegExp = {
	onstart: function(v) {
		story.prototype.search(v,false,true);
	}
};

config.paramifiers.tag = {
	onstart: function(v) {
		var tagged = store.getTaggedTiddlers(v,"title");
		for(var t=0; t<tagged.length; t++)
			story.displayTiddler("bottom",tagged[t].title,null,false,null);
	}
};

config.paramifiers.newTiddler = {
	onstart: function(v) {
		if(!readOnly) {
			story.displayTiddler(null,v,DEFAULT_EDIT_TEMPLATE);
			story.focusTiddler(v,"text");
		}
	}
};

config.paramifiers.newJournal = {
	onstart: function(v) {
		if(!readOnly) {
			var now = new Date();
			var title = now.formatString(v.trim());
			story.displayTiddler(null,title,DEFAULT_EDIT_TEMPLATE);
			story.focusTiddler(title,"text");
		}
	}
};

config.paramifiers.readOnly = {
	onconfig: function(v) {
		var p = v.toLowerCase();
		readOnly = p == "yes" ? true : (p == "no" ? false : readOnly);
	}
};

//--
//-- Formatter helpers
//--

function Formatter(formatters)
{
	this.formatters = [];
	var pattern = [];
	for(var n=0; n<formatters.length; n++) {
		pattern.push("(" + formatters[n].match + ")");
		this.formatters.push(formatters[n]);
	}
	this.formatterRegExp = new RegExp(pattern.join("|"),"mg");
}

config.formatterHelpers = {

	createElementAndWikify: function(w)
	{
		w.subWikifyTerm(createTiddlyElement(w.output,this.element),this.termRegExp);
	},

	inlineCssHelper: function(w)
	{
		var styles = [];
		config.textPrimitives.cssLookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = config.textPrimitives.cssLookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
			var s,v;
			if(lookaheadMatch[1]) {
				s = lookaheadMatch[1].unDash();
				v = lookaheadMatch[2];
			} else {
				s = lookaheadMatch[3].unDash();
				v = lookaheadMatch[4];
			}
			if (s=="bgcolor")
				s = "backgroundColor";
			styles.push({style: s, value: v});
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			config.textPrimitives.cssLookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = config.textPrimitives.cssLookaheadRegExp.exec(w.source);
		}
		return styles;
	},

	applyCssHelper: function(e,styles)
	{
		for(var t=0; t< styles.length; t++) {
			try {
				e.style[styles[t].style] = styles[t].value;
			} catch (ex) {
			}
		}
	},

	enclosedTextHelper: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var text = lookaheadMatch[1];
			if(config.browser.isIE)
				text = text.replace(/\n/g,"\r");
			createTiddlyElement(w.output,this.element,null,null,text);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
		}
	},

	isExternalLink: function(link)
	{
		if(store.tiddlerExists(link) || store.isShadowTiddler(link)) {
			return false;
		}
		var urlRegExp = new RegExp(config.textPrimitives.urlPattern,"mg");
		if(urlRegExp.exec(link)) {
			return true;
		}
		if (link.indexOf(".")!=-1 || link.indexOf("\\")!=-1 || link.indexOf("/")!=-1 || link.indexOf("#")!=-1) {
			return true;
		}
		return false;
	}

};

//--
//-- Standard formatters
//--

config.formatters = [
{
	name: "table",
	match: "^\\|(?:[^\\n]*)\\|(?:[fhck]?)$",
	lookaheadRegExp: /^\|([^\n]*)\|([fhck]?)$/mg,
	rowTermRegExp: /(\|(?:[fhck]?)$\n?)/mg,
	cellRegExp: /(?:\|([^\n\|]*)\|)|(\|[fhck]?$\n?)/mg,
	cellTermRegExp: /((?:\x20*)\|)/mg,
	rowTypes: {"c":"caption", "h":"thead", "":"tbody", "f":"tfoot"},

	handler: function(w)
	{
		var table = createTiddlyElement(w.output,"table",null,"twtable");
		var prevColumns = [];
		var currRowType = null;
		var rowContainer;
		var rowCount = 0;
		w.nextMatch = w.matchStart;
		this.lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
			var nextRowType = lookaheadMatch[2];
			if(nextRowType == "k") {
				table.className = lookaheadMatch[1];
				w.nextMatch += lookaheadMatch[0].length+1;
			} else {
				if(nextRowType != currRowType) {
					rowContainer = createTiddlyElement(table,this.rowTypes[nextRowType]);
					currRowType = nextRowType;
				}
				if(currRowType == "c") {
					// Caption
					w.nextMatch++;
					if(rowContainer != table.firstChild)
						table.insertBefore(rowContainer,table.firstChild);
					rowContainer.setAttribute("align",rowCount == 0?"top":"bottom");
					w.subWikifyTerm(rowContainer,this.rowTermRegExp);
				} else {
					this.rowHandler(w,createTiddlyElement(rowContainer,"tr",null,(rowCount&1)?"oddRow":"evenRow"),prevColumns);
					rowCount++;
				}
			}
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		}
	},
	rowHandler: function(w,e,prevColumns)
	{
		var col = 0;
		var colSpanCount = 1;
		var prevCell = null;
		this.cellRegExp.lastIndex = w.nextMatch;
		var cellMatch = this.cellRegExp.exec(w.source);
		while(cellMatch && cellMatch.index == w.nextMatch) {
			if(cellMatch[1] == "~") {
				// Rowspan
				var last = prevColumns[col];
				if(last) {
					last.rowSpanCount++;
					last.element.setAttribute("rowspan",last.rowSpanCount);
					last.element.setAttribute("rowSpan",last.rowSpanCount); // Needed for IE
					last.element.valign = "center";
				}
				w.nextMatch = this.cellRegExp.lastIndex-1;
			} else if(cellMatch[1] == ">") {
				// Colspan
				colSpanCount++;
				w.nextMatch = this.cellRegExp.lastIndex-1;
			} else if(cellMatch[2]) {
				// End of row
				if(prevCell && colSpanCount > 1) {
					prevCell.setAttribute("colspan",colSpanCount);
					prevCell.setAttribute("colSpan",colSpanCount); // Needed for IE
				}
				w.nextMatch = this.cellRegExp.lastIndex;
				break;
			} else {
				// Cell
				w.nextMatch++;
				var styles = config.formatterHelpers.inlineCssHelper(w);
				var spaceLeft = false;
				var chr = w.source.substr(w.nextMatch,1);
				while(chr == " ") {
					spaceLeft = true;
					w.nextMatch++;
					chr = w.source.substr(w.nextMatch,1);
				}
				var cell;
				if(chr == "!") {
					cell = createTiddlyElement(e,"th");
					w.nextMatch++;
				} else {
					cell = createTiddlyElement(e,"td");
				}
				prevCell = cell;
				prevColumns[col] = {rowSpanCount:1,element:cell};
				if(colSpanCount > 1) {
					cell.setAttribute("colspan",colSpanCount);
					cell.setAttribute("colSpan",colSpanCount); // Needed for IE
					colSpanCount = 1;
				}
				config.formatterHelpers.applyCssHelper(cell,styles);
				w.subWikifyTerm(cell,this.cellTermRegExp);
				if(w.matchText.substr(w.matchText.length-2,1) == " ") // spaceRight
					cell.align = spaceLeft ? "center" : "left";
				else if(spaceLeft)
					cell.align = "right";
				w.nextMatch--;
			}
			col++;
			this.cellRegExp.lastIndex = w.nextMatch;
			cellMatch = this.cellRegExp.exec(w.source);
		}
	}
},

{
	name: "heading",
	match: "^!{1,6}",
	termRegExp: /(\n)/mg,
	handler: function(w)
	{
		w.subWikifyTerm(createTiddlyElement(w.output,"h" + w.matchLength),this.termRegExp);
	}
},

{
	name: "list",
	match: "^(?:[\\*#;:]+)",
	lookaheadRegExp: /^(?:(?:(\*)|(#)|(;)|(:))+)/mg,
	termRegExp: /(\n)/mg,
	handler: function(w)
	{
		var stack = [w.output];
		var currLevel = 0, currType = null;
		var listLevel, listType, itemType, baseType;
		w.nextMatch = w.matchStart;
		this.lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
			if(lookaheadMatch[1]) {
				listType = "ul";
				itemType = "li";
			} else if(lookaheadMatch[2]) {
				listType = "ol";
				itemType = "li";
			} else if(lookaheadMatch[3]) {
				listType = "dl";
				itemType = "dt";
			} else if(lookaheadMatch[4]) {
				listType = "dl";
				itemType = "dd";
			}
			if (!baseType)
			   baseType = listType;
			listLevel = lookaheadMatch[0].length;
			w.nextMatch += lookaheadMatch[0].length;
			var t;
			if(listLevel > currLevel) {
				for(t=currLevel; t<listLevel; t++) {
					var target = (currLevel == 0) ? stack[stack.length-1] : stack[stack.length-1].lastChild;
					stack.push(createTiddlyElement(target,listType));
				}
			} else if (listType!=baseType && listLevel==1) {
				w.nextMatch -= lookaheadMatch[0].length;
				return;
			} else if(listLevel < currLevel) {
				for(t=currLevel; t>listLevel; t--)
					stack.pop();
			} else if(listLevel == currLevel && listType != currType) {
				stack.pop();
				stack.push(createTiddlyElement(stack[stack.length-1].lastChild,listType));
			}
			currLevel = listLevel;
			currType = listType;
			var e = createTiddlyElement(stack[stack.length-1],itemType);
			w.subWikifyTerm(e,this.termRegExp);
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		}
	}
},

{
	name: "quoteByBlock",
	match: "^<<<\\n",
	termRegExp: /(^<<<(\n|$))/mg,
	element: "blockquote",
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: "quoteByLine",
	match: "^>+",
	lookaheadRegExp: /^>+/mg,
	termRegExp: /(\n)/mg,
	element: "blockquote",
	handler: function(w)
	{
		var stack = [w.output];
		var currLevel = 0;
		var newLevel = w.matchLength;
		var t;
		do {
			if(newLevel > currLevel) {
				for(t=currLevel; t<newLevel; t++)
					stack.push(createTiddlyElement(stack[stack.length-1],this.element));
			} else if(newLevel < currLevel) {
				for(t=currLevel; t>newLevel; t--)
					stack.pop();
			}
			currLevel = newLevel;
			w.subWikifyTerm(stack[stack.length-1],this.termRegExp);
			createTiddlyElement(stack[stack.length-1],"br");
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
			var matched = lookaheadMatch && lookaheadMatch.index == w.nextMatch;
			if(matched) {
				newLevel = lookaheadMatch[0].length;
				w.nextMatch += lookaheadMatch[0].length;
			}
		} while(matched);
	}
},

{
	name: "rule",
	match: "^----+$\\n?",
	handler: function(w)
	{
		createTiddlyElement(w.output,"hr");
	}
},

{
	name: "monospacedByLine",
	match: "^\\{\\{\\{\\n",
	lookaheadRegExp: /^\{\{\{\n((?:^[^\n]*\n)+?)(^\}\}\}$\n?)/mg,
	element: "pre",
	handler: config.formatterHelpers.enclosedTextHelper
},

{
	name: "monospacedByLineForCSS",
	match: "^/\\*\\{\\{\\{\\*/\\n",
	lookaheadRegExp: /\/\*\{\{\{\*\/\n*((?:^[^\n]*\n)+?)(\n*^\/\*\}\}\}\*\/$\n?)/mg,
	element: "pre",
	handler: config.formatterHelpers.enclosedTextHelper
},

{
	name: "monospacedByLineForPlugin",
	match: "^//\\{\\{\\{\\n",
	lookaheadRegExp: /^\/\/\{\{\{\n\n*((?:^[^\n]*\n)+?)(\n*^\/\/\}\}\}$\n?)/mg,
	element: "pre",
	handler: config.formatterHelpers.enclosedTextHelper
},

{
	name: "monospacedByLineForTemplate",
	match: "^<!--\\{\\{\\{-->\\n",
	lookaheadRegExp: /<!--\{\{\{-->\n*((?:^[^\n]*\n)+?)(\n*^<!--\}\}\}-->$\n?)/mg,
	element: "pre",
	handler: config.formatterHelpers.enclosedTextHelper
},

{
	name: "wikifyCommentForPlugin",
	match: "^/\\*\\*\\*\\n",
	termRegExp: /(^\*\*\*\/\n)/mg,
	handler: function(w)
	{
		w.subWikifyTerm(w.output,this.termRegExp);
	}
},

{
	name: "wikifyCommentForTemplate",
	match: "^<!---\\n",
	termRegExp: /(^--->\n)/mg,
	handler: function(w)
	{
		w.subWikifyTerm(w.output,this.termRegExp);
	}
},

{
	name: "macro",
	match: "<<",
	lookaheadRegExp: /<<([^>\s]+)(?:\s*)((?:[^>]|(?:>(?!>)))*)>>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[1]) {
			w.nextMatch = this.lookaheadRegExp.lastIndex;
			invokeMacro(w.output,lookaheadMatch[1],lookaheadMatch[2],w,w.tiddler);
		}
	}
},

{
	name: "prettyLink",
	match: "\\[\\[",
	lookaheadRegExp: /\[\[(.*?)(?:\|(~)?(.*?))?\]\]/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var e;
			var text = lookaheadMatch[1];
			if(lookaheadMatch[3]) {
				// Pretty bracketted link
				var link = lookaheadMatch[3];
				e = (!lookaheadMatch[2] && config.formatterHelpers.isExternalLink(link)) ?
						createExternalLink(w.output,link) : createTiddlyLink(w.output,link,false,null,w.isStatic,w.tiddler);
			} else {
				// Simple bracketted link
				e = createTiddlyLink(w.output,text,false,null,w.isStatic,w.tiddler);
			}
			createTiddlyText(e,text);
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: "unWikiLink",
	match: config.textPrimitives.unWikiLink+config.textPrimitives.wikiLink,
	handler: function(w)
	{
		w.outputText(w.output,w.matchStart+1,w.nextMatch);
	}
},

{
	name: "wikiLink",
	match: config.textPrimitives.wikiLink,
	handler: function(w)
	{
		if(w.matchStart > 0) {
			var preRegExp = new RegExp(config.textPrimitives.anyLetterStrict,"mg");
			preRegExp.lastIndex = w.matchStart-1;
			var preMatch = preRegExp.exec(w.source);
			if(preMatch.index == w.matchStart-1) {
				w.outputText(w.output,w.matchStart,w.nextMatch);
				return;
			}
		}
		if(w.autoLinkWikiWords == true || store.isShadowTiddler(w.matchText)) {
			var link = createTiddlyLink(w.output,w.matchText,false,null,w.isStatic,w.tiddler);
			w.outputText(link,w.matchStart,w.nextMatch);
		} else {
			w.outputText(w.output,w.matchStart,w.nextMatch);
		}
	}
},

{
	name: "urlLink",
	match: config.textPrimitives.urlPattern,
	handler: function(w)
	{
		w.outputText(createExternalLink(w.output,w.matchText),w.matchStart,w.nextMatch);
	}
},

{
	name: "image",
	match: "\\[[<>]?[Ii][Mm][Gg]\\[",
	lookaheadRegExp: /\[([<]?)(>?)[Ii][Mm][Gg]\[(?:([^\|\]]+)\|)?([^\[\]\|]+)\](?:\[([^\]]*)\])?\]/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var e = w.output;
			if(lookaheadMatch[5]) {
				var link = lookaheadMatch[5];
				e = config.formatterHelpers.isExternalLink(link) ? createExternalLink(w.output,link) : createTiddlyLink(w.output,link,false,null,w.isStatic,w.tiddler);
				addClass(e,"imageLink");
			}
			var img = createTiddlyElement(e,"img");
			if(lookaheadMatch[1])
				img.align = "left";
			else if(lookaheadMatch[2])
				img.align = "right";
			if(lookaheadMatch[3])
				img.title = lookaheadMatch[3];
			img.src = lookaheadMatch[4];
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: "html",
	match: "<[Hh][Tt][Mm][Ll]>",
	lookaheadRegExp: /<[Hh][Tt][Mm][Ll]>((?:.|\n)*?)<\/[Hh][Tt][Mm][Ll]>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			createTiddlyElement(w.output,"span").innerHTML = lookaheadMatch[1];
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: "commentByBlock",
	match: "/%",
	lookaheadRegExp: /\/%((?:.|\n)*?)%\//mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			w.nextMatch = this.lookaheadRegExp.lastIndex;
	}
},

{
	name: "boldByChar",
	match: "''",
	termRegExp: /('')/mg,
	element: "strong",
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: "italicByChar",
	match: "//",
	termRegExp: /(\/\/)/mg,
	element: "em",
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: "underlineByChar",
	match: "__",
	termRegExp: /(__)/mg,
	element: "u",
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: "strikeByChar",
	match: "--(?!\\s|$)",
	termRegExp: /((?!\s)--|(?=\n\n))/mg,
	element: "strike",
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: "superscriptByChar",
	match: "\\^\\^",
	termRegExp: /(\^\^)/mg,
	element: "sup",
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: "subscriptByChar",
	match: "~~",
	termRegExp: /(~~)/mg,
	element: "sub",
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: "monospacedByChar",
	match: "\\{\\{\\{",
	lookaheadRegExp: /\{\{\{((?:.|\n)*?)\}\}\}/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			createTiddlyElement(w.output,"code",null,null,lookaheadMatch[1]);
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: "styleByChar",
	match: "@@",
	termRegExp: /(@@)/mg,
	handler: function(w)
	{
		var e = createTiddlyElement(w.output,"span");
		var styles = config.formatterHelpers.inlineCssHelper(w);
		if(styles.length == 0)
			e.className = "marked";
		else
			config.formatterHelpers.applyCssHelper(e,styles);
		w.subWikifyTerm(e,this.termRegExp);
	}
},

{
	name: "lineBreak",
	match: "\\n|<br ?/?>",
	handler: function(w)
	{
		createTiddlyElement(w.output,"br");
	}
},

{
	name: "rawText",
	match: "\\\"{3}|<nowiki>",
	lookaheadRegExp: /(?:\"{3}|<nowiki>)((?:.|\n)*?)(?:\"{3}|<\/nowiki>)/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			createTiddlyElement(w.output,"span",null,null,lookaheadMatch[1]);
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: "mdash",
	match: "--",
	handler: function(w)
	{
		createTiddlyElement(w.output,"span").innerHTML = "&mdash;";
	}
},

{
	name: "htmlEntitiesEncoding",
	match: "(?:(?:&#?[a-zA-Z0-9]{2,8};|.)(?:&#?(?:x0*(?:3[0-6][0-9a-fA-F]|1D[c-fC-F][0-9a-fA-F]|20[d-fD-F][0-9a-fA-F]|FE2[0-9a-fA-F])|0*(?:76[89]|7[7-9][0-9]|8[0-7][0-9]|761[6-9]|76[2-7][0-9]|84[0-3][0-9]|844[0-7]|6505[6-9]|6506[0-9]|6507[0-1]));)+|&#?[a-zA-Z0-9]{2,8};)",
	handler: function(w)
	{
		createTiddlyElement(w.output,"span").innerHTML = w.matchText;
	}
},

{
	name: "customClasses",
	match: "\\{\\{",
	termRegExp: /(\}\}\})/mg,
	lookaheadRegExp: /\{\{[\s]*([\w]+[\s\w]*)[\s]*\{(\n?)/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch) {
			var e = createTiddlyElement(w.output,lookaheadMatch[2] == "\n" ? "div" : "span",null,lookaheadMatch[1]);
			w.nextMatch = this.lookaheadRegExp.lastIndex;
			w.subWikifyTerm(e,this.termRegExp);
		}
	}
}

];

//--
//-- Wikifier
//--

function getParser(tiddler,format)
{
	if(tiddler) {
		if(!format)
			format = tiddler.fields["wikiformat"];
		var i;
		if(format) {
			for(i in config.parsers) {
				if(format == config.parsers[i].format)
					return config.parsers[i];
			}
		} else {
			for(i in config.parsers) {
				if(tiddler.isTagged(config.parsers[i].formatTag))
					return config.parsers[i];
			}
		}
	}
	return formatter;
}

function wikify(source,output,highlightRegExp,tiddler)
{
	if(source && source != "") {
		var wikifier = new Wikifier(source,getParser(tiddler),highlightRegExp,tiddler);
		wikifier.subWikifyUnterm(output);
	}
}

function wikifyStatic(source,highlightRegExp,tiddler,format)
{
	var e = createTiddlyElement(document.body,"div");
	e.style.display = "none";
	var html = "";
	if(source && source != "") {
		var wikifier = new Wikifier(source,getParser(tiddler,format),highlightRegExp,tiddler);
		wikifier.isStatic = true;
		wikifier.subWikifyUnterm(e);
		html = e.innerHTML;
		removeNode(e);
	}
	return html;
}

function wikifyPlain(title,theStore,limit)
{
	if(!theStore)
		theStore = store;
	if(theStore.tiddlerExists(title) || theStore.isShadowTiddler(title)) {
		return wikifyPlainText(theStore.getTiddlerText(title),limit,tiddler);
	} else {
		return "";
	}
}

function wikifyPlainText(text,limit,tiddler)
{
	if(limit > 0)
		text = text.substr(0,limit);
	var wikifier = new Wikifier(text,formatter,null,tiddler);
	return wikifier.wikifyPlain();
}

function highlightify(source,output,highlightRegExp,tiddler)
{
	if(source && source != "") {
		var wikifier = new Wikifier(source,formatter,highlightRegExp,tiddler);
		wikifier.outputText(output,0,source.length);
	}
}

function Wikifier(source,formatter,highlightRegExp,tiddler)
{
	this.source = source;
	this.output = null;
	this.formatter = formatter;
	this.nextMatch = 0;
	this.autoLinkWikiWords = tiddler && tiddler.autoLinkWikiWords() == false ? false : true;
	this.highlightRegExp = highlightRegExp;
	this.highlightMatch = null;
	this.isStatic = false;
	if(highlightRegExp) {
		highlightRegExp.lastIndex = 0;
		this.highlightMatch = highlightRegExp.exec(source);
	}
	this.tiddler = tiddler;
}

Wikifier.prototype.wikifyPlain = function()
{
	var e = createTiddlyElement(document.body,"div");
	this.subWikify(e);
	var text = getPlainText(e);
	removeNode(e);
	return text;
};

Wikifier.prototype.subWikify = function(output,terminator)
{
	if(terminator)
		this.subWikifyTerm(output,new RegExp("(" + terminator + ")","mg"));
	else
		this.subWikifyUnterm(output);
};

Wikifier.prototype.subWikifyUnterm = function(output)
{
	// subWikify() can be indirectly recursive, so we need to save the old output pointer
	var oldOutput = this.output;
	this.output = output;
	this.formatter.formatterRegExp.lastIndex = this.nextMatch;
	var formatterMatch = this.formatter.formatterRegExp.exec(this.source);
	while(formatterMatch) {
		// Output any text before the match
		if(formatterMatch.index > this.nextMatch)
			this.outputText(this.output,this.nextMatch,formatterMatch.index);
		// Set the match parameters for the handler
		this.matchStart = formatterMatch.index;
		this.matchLength = formatterMatch[0].length;
		this.matchText = formatterMatch[0];
		this.nextMatch = this.formatter.formatterRegExp.lastIndex;
		for(var t=1; t<formatterMatch.length; t++) {
			if(formatterMatch[t]) {
				this.formatter.formatters[t-1].handler(this);
				this.formatter.formatterRegExp.lastIndex = this.nextMatch;
				break;
			}
		}
		formatterMatch = this.formatter.formatterRegExp.exec(this.source);
	}
	if(this.nextMatch < this.source.length) {
		this.outputText(this.output,this.nextMatch,this.source.length);
		this.nextMatch = this.source.length;
	}
	this.output = oldOutput;
};

Wikifier.prototype.subWikifyTerm = function(output,terminatorRegExp)
{
	// subWikify() can be indirectly recursive, so we need to save the old output pointer
	var oldOutput = this.output;
	this.output = output;
	// Get the first matches for the formatter and terminator RegExps
	terminatorRegExp.lastIndex = this.nextMatch;
	var terminatorMatch = terminatorRegExp.exec(this.source);
	this.formatter.formatterRegExp.lastIndex = this.nextMatch;
	var formatterMatch = this.formatter.formatterRegExp.exec(terminatorMatch ? this.source.substr(0,terminatorMatch.index) : this.source);
	while(terminatorMatch || formatterMatch) {
		if(terminatorMatch && (!formatterMatch || terminatorMatch.index <= formatterMatch.index)) {
			if(terminatorMatch.index > this.nextMatch)
				this.outputText(this.output,this.nextMatch,terminatorMatch.index);
			this.matchText = terminatorMatch[1];
			this.matchLength = terminatorMatch[1].length;
			this.matchStart = terminatorMatch.index;
			this.nextMatch = this.matchStart + this.matchLength;
			this.output = oldOutput;
			return;
		}
		if(formatterMatch.index > this.nextMatch)
			this.outputText(this.output,this.nextMatch,formatterMatch.index);
		this.matchStart = formatterMatch.index;
		this.matchLength = formatterMatch[0].length;
		this.matchText = formatterMatch[0];
		this.nextMatch = this.formatter.formatterRegExp.lastIndex;
		for(var t=1; t<formatterMatch.length; t++) {
			if(formatterMatch[t]) {
				this.formatter.formatters[t-1].handler(this);
				this.formatter.formatterRegExp.lastIndex = this.nextMatch;
				break;
			}
		}
		terminatorRegExp.lastIndex = this.nextMatch;
		terminatorMatch = terminatorRegExp.exec(this.source);
		formatterMatch = this.formatter.formatterRegExp.exec(terminatorMatch ? this.source.substr(0,terminatorMatch.index) : this.source);
	}
	if(this.nextMatch < this.source.length) {
		this.outputText(this.output,this.nextMatch,this.source.length);
		this.nextMatch = this.source.length;
	}
	this.output = oldOutput;
};

Wikifier.prototype.outputText = function(place,startPos,endPos)
{
	while(this.highlightMatch && (this.highlightRegExp.lastIndex > startPos) && (this.highlightMatch.index < endPos) && (startPos < endPos)) {
		if(this.highlightMatch.index > startPos) {
			createTiddlyText(place,this.source.substring(startPos,this.highlightMatch.index));
			startPos = this.highlightMatch.index;
		}
		var highlightEnd = Math.min(this.highlightRegExp.lastIndex,endPos);
		var theHighlight = createTiddlyElement(place,"span",null,"highlight",this.source.substring(startPos,highlightEnd));
		startPos = highlightEnd;
		if(startPos >= this.highlightRegExp.lastIndex)
			this.highlightMatch = this.highlightRegExp.exec(this.source);
	}
	if(startPos < endPos) {
		createTiddlyText(place,this.source.substring(startPos,endPos));
	}
};

//--
//-- Macro definitions
//--

config.macros.today.handler = function(place,macroName,params)
{
	var now = new Date();
	var text;
	if(params[0])
		text = now.formatString(params[0].trim());
	else
		text = now.toLocaleString();
	createTiddlyElement(place,"span",null,null,text);
};

config.macros.version.handler = function(place)
{
	createTiddlyElement(place,"span",null,null,version.major + "." + version.minor + "." + version.revision + (version.beta ? " (beta " + version.beta + ")" : ""));
};

config.macros.list.handler = function(place,macroName,params)
{
	var type = params[0] ? params[0] : "all";
	var list = document.createElement("ul");
	place.appendChild(list);
	if(this[type].prompt)
		createTiddlyElement(list,"li",null,"listTitle",this[type].prompt);
	var results;
	if(this[type].handler)
		results = this[type].handler(params);
	for(var t = 0; t < results.length; t++) {
		var li = document.createElement("li");
		list.appendChild(li);
		createTiddlyLink(li,typeof results[t] == "string" ? results[t] : results[t].title,true);
	}
};

config.macros.list.all.handler = function(params)
{
	return store.reverseLookup("tags","excludeLists",false,"title");
};

config.macros.list.missing.handler = function(params)
{
	return store.getMissingLinks();
};

config.macros.list.orphans.handler = function(params)
{
	return store.getOrphans();
};

config.macros.list.shadowed.handler = function(params)
{
	return store.getShadowed();
};

config.macros.list.touched.handler = function(params)
{
	return store.getTouched();
};

config.macros.allTags.handler = function(place,macroName,params)
{
	var tags = store.getTags(params[0]);
	var ul = createTiddlyElement(place,"ul");
	if(tags.length == 0)
		createTiddlyElement(ul,"li",null,"listTitle",this.noTags);
	for(var t=0; t<tags.length; t++) {
		var title = tags[t][0];
		var info = getTiddlyLinkInfo(title);
		var li =createTiddlyElement(ul,"li");
		var btn = createTiddlyButton(li,title + " (" + tags[t][1] + ")",this.tooltip.format([title]),onClickTag,info.classes);
		btn.setAttribute("tag",title);
		btn.setAttribute("refresh","link");
		btn.setAttribute("tiddlyLink",title);
	}
};

config.macros.timeline.handler = function(place,macroName,params)
{
	var field = params[0] ? params[0] : "modified";
	var tiddlers = store.reverseLookup("tags","excludeLists",false,field);
	var lastDay = "";
	var last = params[1] ? tiddlers.length-Math.min(tiddlers.length,parseInt(params[1])) : 0;
	var dateFormat = params[2] ? params[2] : this.dateFormat;
	for(var t=tiddlers.length-1; t>=last; t--) {
		var tiddler = tiddlers[t];
		var theDay = tiddler[field].convertToLocalYYYYMMDDHHMM().substr(0,8);
		if(theDay != lastDay) {
			var theDateList = document.createElement("ul");
			place.appendChild(theDateList);
			createTiddlyElement(theDateList,"li",null,"listTitle",tiddler[field].formatString(dateFormat));
			lastDay = theDay;
		}
		var theDateListItem = createTiddlyElement(theDateList,"li",null,"listLink");
		theDateListItem.appendChild(createTiddlyLink(place,tiddler.title,true));
	}
};

config.macros.tiddler.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	params = paramString.parseParams("name",null,true,false,true);
	var names = params[0]["name"];
	var tiddlerName = names[0];
	var className = names[1] ? names[1] : null;
	var args = params[0]["with"];
	var wrapper = createTiddlyElement(place,"span",null,className);
	if(!args) {
		wrapper.setAttribute("refresh","content");
		wrapper.setAttribute("tiddler",tiddlerName);
	}
	var text = store.getTiddlerText(tiddlerName);
	if(text) {
		var stack = config.macros.tiddler.tiddlerStack;
		if(stack.indexOf(tiddlerName) !== -1)
			return;
		stack.push(tiddlerName);
		try {
			var n = args ? Math.min(args.length,9) : 0;
			for(var i=0; i<n; i++) {
				var placeholderRE = new RegExp("\\$" + (i + 1),"mg");
				text = text.replace(placeholderRE,args[i]);
			}
			config.macros.tiddler.renderText(wrapper,text,tiddlerName,params);
		} finally {
			stack.pop();
		}
	}
};

config.macros.tiddler.renderText = function(place,text,tiddlerName,params)
{
	wikify(text,place,null,store.getTiddler(tiddlerName));
};

config.macros.tiddler.tiddlerStack = [];

config.macros.tag.handler = function(place,macroName,params)
{
	createTagButton(place,params[0]);
};

config.macros.tags.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	params = paramString.parseParams("anon",null,true,false,false);
	var theList = createTiddlyElement(place,"ul");
	var title = getParam(params,"anon","");
	if(title && store.tiddlerExists(title))
		tiddler = store.getTiddler(title);
	var sep = getParam(params,"sep"," ");
	var lingo = config.views.wikified.tag;
	var prompt = tiddler.tags.length == 0 ? lingo.labelNoTags : lingo.labelTags;
	createTiddlyElement(theList,"li",null,"listTitle",prompt.format([tiddler.title]));
	for(var t=0; t<tiddler.tags.length; t++) {
		createTagButton(createTiddlyElement(theList,"li"),tiddler.tags[t],tiddler.title);
		if(t<tiddler.tags.length-1)
			createTiddlyText(theList,sep);
	}
};

config.macros.tagging.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	params = paramString.parseParams("anon",null,true,false,false);
	var theList = createTiddlyElement(place,"ul");
	var title = getParam(params,"anon","");
	if(title == "" && tiddler instanceof Tiddler)
		title = tiddler.title;
	var sep = getParam(params,"sep"," ");
	theList.setAttribute("title",this.tooltip.format([title]));
	var tagged = store.getTaggedTiddlers(title);
	var prompt = tagged.length == 0 ? this.labelNotTag : this.label;
	createTiddlyElement(theList,"li",null,"listTitle",prompt.format([title,tagged.length]));
	for(var t=0; t<tagged.length; t++) {
		createTiddlyLink(createTiddlyElement(theList,"li"),tagged[t].title,true);
		if(t<tagged.length-1)
			createTiddlyText(theList,sep);
	}
};

config.macros.closeAll.handler = function(place)
{
	createTiddlyButton(place,this.label,this.prompt,this.onClick);
};

config.macros.closeAll.onClick = function(e)
{
	story.closeAllTiddlers();
	return false;
};

config.macros.permaview.handler = function(place)
{
	createTiddlyButton(place,this.label,this.prompt,this.onClick);
};

config.macros.permaview.onClick = function(e)
{
	story.permaView();
	return false;
};

config.macros.saveChanges.handler = function(place)
{
	if(!readOnly)
		createTiddlyButton(place,this.label,this.prompt,this.onClick,null,null,this.accessKey);
};

config.macros.saveChanges.onClick = function(e)
{
	saveChanges();
	return false;
};

config.macros.slider.onClickSlider = function(ev)
{
	var e = ev ? ev : window.event;
	var n = this.nextSibling;
	var cookie = n.getAttribute("cookie");
	var isOpen = n.style.display != "none";
	if(config.options.chkAnimate && anim && typeof Slider == "function")
		anim.startAnimating(new Slider(n,!isOpen,null,"none"));
	else
		n.style.display = isOpen ? "none" : "block";
	config.options[cookie] = !isOpen;
	saveOptionCookie(cookie);
	return false;
};

config.macros.slider.createSlider = function(place,cookie,title,tooltip)
{
	var c = cookie ? cookie : "";
	var btn = createTiddlyButton(place,title,tooltip,this.onClickSlider);
	var panel = createTiddlyElement(null,"div",null,"sliderPanel");
	panel.setAttribute("cookie",c);
	panel.style.display = config.options[c] ? "block" : "none";
	place.appendChild(panel);
	return panel;
};

config.macros.slider.handler = function(place,macroName,params)
{
	var panel = this.createSlider(place,params[0],params[2],params[3]);
	var text = store.getTiddlerText(params[1]);
	panel.setAttribute("refresh","content");
	panel.setAttribute("tiddler",params[1]);
	if(text)
		wikify(text,panel,null,store.getTiddler(params[1]));
};

// <<gradient [[tiddler name]] vert|horiz rgb rgb rgb rgb... >>
config.macros.gradient.handler = function(place,macroName,params,wikifier)
{
	var terminator = ">>";
	var panel;
	if(wikifier)
		panel = createTiddlyElement(place,"div",null,"gradient");
	else
		panel = place;
	panel.style.position = "relative";
	panel.style.overflow = "hidden";
	panel.style.zIndex = "0";
	var t;
	if(wikifier) {
		var styles = config.formatterHelpers.inlineCssHelper(wikifier);
		config.formatterHelpers.applyCssHelper(panel,styles);
	}
	var colours = [];
	for(t=1; t<params.length; t++) {
		var c = new RGB(params[t]);
		if(c)
			colours.push(c);
	}
	drawGradient(panel,params[0] != "vert",colours);
	if(wikifier)
		wikifier.subWikify(panel,terminator);
	if(document.all) {
		panel.style.height = "100%";
		panel.style.width = "100%";
	}
};

config.macros.message.handler = function(place,macroName,params)
{
	if(params[0]) {
		var m = config;
		var p = params[0].split(".");
		for(var t=0; t<p.length; t++) {
			if(p[t] in m)
				m = m[p[t]];
			else
				break;
		}
		createTiddlyText(place,m.toString().format(params.splice(1)));
	}
};

config.macros.view.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if((tiddler instanceof Tiddler) && params[0]) {
		var value = store.getValue(tiddler,params[0]);
		if(value != undefined) {
			switch(params[1]) {
				case undefined:
					highlightify(value,place,highlightHack,tiddler);
					break;
				case "link":
					createTiddlyLink(place,value,true);
					break;
				case "wikified":
					wikify(value,place,highlightHack,tiddler);
					break;
				case "date":
					value = Date.convertFromYYYYMMDDHHMM(value);
					createTiddlyText(place,value.formatString(params[2] ? params[2] : config.views.wikified.dateFormat));
					break;
			}
		}
	}
};

config.macros.edit.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var field = params[0];
	var rows = params[1];
	if((tiddler instanceof Tiddler) && field) {
		story.setDirty(tiddler.title,true);
		var e,v;
		if(field != "text" && !rows) {
			e = createTiddlyElement(null,"input");
			if(tiddler.isReadOnly())
				e.setAttribute("readOnly","readOnly");
			e.setAttribute("edit",field);
			e.setAttribute("type","text");
			v = store.getValue(tiddler,field);
			if(!v)
				v = "";
			e.value = v;
			e.setAttribute("size","40");
			e.setAttribute("autocomplete","off");
			place.appendChild(e);
		} else {
			var wrapper1 = createTiddlyElement(null,"fieldset",null,"fieldsetFix");
			var wrapper2 = createTiddlyElement(wrapper1,"div");
			e = createTiddlyElement(wrapper2,"textarea");
			if(tiddler.isReadOnly())
				e.setAttribute("readOnly","readOnly");
			v = store.getValue(tiddler,field);
			if(!v)
				v = "";
			e.value = v;
			rows = rows ? rows : 10;
			var lines = v.match(/\n/mg);
			var maxLines = Math.max(parseInt(config.options.txtMaxEditRows),5);
			if(lines != null && lines.length > rows)
				rows = lines.length + 5;
			rows = Math.min(rows,maxLines);
			e.setAttribute("rows",rows);
			e.setAttribute("edit",field);
			place.appendChild(wrapper1);
		}
	}
};

config.macros.tagChooser.onClick = function(ev)
{
	var e = ev ? ev : window.event;
	var lingo = config.views.editor.tagChooser;
	var popup = Popup.create(this);
	var tags = store.getTags();
	if(tags.length == 0)
		createTiddlyText(createTiddlyElement(popup,"li"),lingo.popupNone);
	for(var t=0; t<tags.length; t++) {
		var theTag = createTiddlyButton(createTiddlyElement(popup,"li"),tags[t][0],lingo.tagTooltip.format([tags[t][0]]),config.macros.tagChooser.onTagClick);
		theTag.setAttribute("tag",tags[t][0]);
		theTag.setAttribute("tiddler",this.getAttribute("tiddler"));
	}
	Popup.show();
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	return false;
};

config.macros.tagChooser.onTagClick = function(ev)
{
	var e = ev ? ev : window.event;
	var tag = this.getAttribute("tag");
	var title = this.getAttribute("tiddler");
	if(!readOnly)
		story.setTiddlerTag(title,tag,0);
	return false;
};

config.macros.tagChooser.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(tiddler instanceof Tiddler) {
		var title = tiddler.title;
		var lingo = config.views.editor.tagChooser;
		var btn = createTiddlyButton(place,lingo.text,lingo.tooltip,this.onClick);
		btn.setAttribute("tiddler",title);
	}
};

config.macros.refreshDisplay.handler = function(place)
{
	createTiddlyButton(place,this.label,this.prompt,this.onClick);
};

config.macros.refreshDisplay.onClick = function(e)
{
	refreshAll();
	return false;
};

config.macros.annotations.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var title = tiddler ? tiddler.title : null;
	var a = title ? config.annotations[title] : null;
	if(!tiddler || !title || !a)
		return;
	var text = a.format([title]);
	wikify(text,createTiddlyElement(place,"div",null,"annotation"),null,tiddler);
};

//--
//-- NewTiddler and NewJournal macros
//--

config.macros.newTiddler.createNewTiddlerButton = function(place,title,params,label,prompt,accessKey,newFocus,isJournal)
{
	var tags = [];
	for(var t=1; t<params.length; t++) {
		if((params[t].name == "anon" && t != 1) || (params[t].name == "tag"))
			tags.push(params[t].value);
	}
	label = getParam(params,"label",label);
	prompt = getParam(params,"prompt",prompt);
	accessKey = getParam(params,"accessKey",accessKey);
	newFocus = getParam(params,"focus",newFocus);
	var customFields = getParam(params,"fields","");
	if(!customFields && !store.isShadowTiddler(title))
		customFields = String.encodeHashMap(config.defaultCustomFields);
	var btn = createTiddlyButton(place,label,prompt,this.onClickNewTiddler,null,null,accessKey);
	btn.setAttribute("newTitle",title);
	btn.setAttribute("isJournal",isJournal ? "true" : "false");
	if(tags.length > 0)
		btn.setAttribute("params",tags.join("|"));
	btn.setAttribute("newFocus",newFocus);
	btn.setAttribute("newTemplate",getParam(params,"template",DEFAULT_EDIT_TEMPLATE));
	if(customFields !== "")
		btn.setAttribute("customFields",customFields);
	var text = getParam(params,"text");
	if(text !== undefined)
		btn.setAttribute("newText",text);
	return btn;
};

config.macros.newTiddler.onClickNewTiddler = function()
{
	var title = this.getAttribute("newTitle");
	if(this.getAttribute("isJournal") == "true") {
		var now = new Date();
		title = now.formatString(title.trim());
	}
	var params = this.getAttribute("params");
	var tags = params ? params.split("|") : [];
	var focus = this.getAttribute("newFocus");
	var template = this.getAttribute("newTemplate");
	var customFields = this.getAttribute("customFields");
	story.displayTiddler(null,title,template,false,null,null);
	var tiddlerElem = document.getElementById(story.idPrefix + title);
	if(customFields)
		story.addCustomFields(tiddlerElem,customFields);
	var text = this.getAttribute("newText");
	if(typeof text == "string")
		story.getTiddlerField(title,"text").value = text.format([title]);
	for(var t=0;t<tags.length;t++)
		story.setTiddlerTag(title,tags[t],+1);
	story.focusTiddler(title,focus);
	return false;
};

config.macros.newTiddler.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(!readOnly) {
		params = paramString.parseParams("anon",null,true,false,false);
		var title = params[1] && params[1].name == "anon" ? params[1].value : this.title;
		title = getParam(params,"title",title);
		this.createNewTiddlerButton(place,title,params,this.label,this.prompt,this.accessKey,"title",false);
	}
};

config.macros.newJournal.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(!readOnly) {
		params = paramString.parseParams("anon",null,true,false,false);
		var title = params[1] && params[1].name == "anon" ? params[1].value : "";
		title = getParam(params,"title",title);
		config.macros.newTiddler.createNewTiddlerButton(place,title,params,this.label,this.prompt,this.accessKey,"text",true);
	}
};

//--
//-- Search macro
//--

config.macros.search.handler = function(place,macroName,params)
{
	var searchTimeout = null;
	var btn = createTiddlyButton(place,this.label,this.prompt,this.onClick);
	var txt = createTiddlyElement(place,"input",null,"txtOptionInput");
	if(params[0])
		txt.value = params[0];
	txt.onkeyup = this.onKeyPress;
	txt.onfocus = this.onFocus;
	txt.setAttribute("size",this.sizeTextbox);
	txt.setAttribute("accessKey",this.accessKey);
	txt.setAttribute("autocomplete","off");
	txt.setAttribute("lastSearchText","");
	if(config.browser.isSafari) {
		txt.setAttribute("type","search");
		txt.setAttribute("results","5");
	} else {
		txt.setAttribute("type","text");
	}
};

// Global because there's only ever one outstanding incremental search timer
config.macros.search.timeout = null;

config.macros.search.doSearch = function(txt)
{
	if(txt.value.length > 0) {
		story.search(txt.value,config.options.chkCaseSensitiveSearch,config.options.chkRegExpSearch);
		txt.setAttribute("lastSearchText",txt.value);
	}
};

config.macros.search.onClick = function(e)
{
	config.macros.search.doSearch(this.nextSibling);
	return false;
};

config.macros.search.onKeyPress = function(ev)
{
	var e = ev ? ev : window.event;
	switch(e.keyCode) {
		case 13: // Ctrl-Enter
		case 10: // Ctrl-Enter on IE PC
			config.macros.search.doSearch(this);
			break;
		case 27: // Escape
			this.value = "";
			clearMessage();
			break;
	}
	if(this.value.length > 2) {
		if(this.value != this.getAttribute("lastSearchText")) {
			if(config.macros.search.timeout)
				clearTimeout(config.macros.search.timeout);
			var txt = this;
			config.macros.search.timeout = setTimeout(function() {config.macros.search.doSearch(txt);},500);
		}
	} else {
		if(config.macros.search.timeout)
			clearTimeout(config.macros.search.timeout);
	}
};

config.macros.search.onFocus = function(e)
{
	this.select();
};

//--
//-- Tabs macro
//--

config.macros.tabs.handler = function(place,macroName,params)
{
	var cookie = params[0];
	var numTabs = (params.length-1)/3;
	var wrapper = createTiddlyElement(null,"div",null,cookie);
	var tabset = createTiddlyElement(wrapper,"div",null,"tabset");
	tabset.setAttribute("cookie",cookie);
	var validTab = false;
	for(var t=0; t<numTabs; t++) {
		var label = params[t*3+1];
		var prompt = params[t*3+2];
		var content = params[t*3+3];
		var tab = createTiddlyButton(tabset,label,prompt,this.onClickTab,"tab tabUnselected");
		tab.setAttribute("tab",label);
		tab.setAttribute("content",content);
		tab.title = prompt;
		if(config.options[cookie] == label)
			validTab = true;
	}
	if(!validTab)
		config.options[cookie] = params[1];
	place.appendChild(wrapper);
	this.switchTab(tabset,config.options[cookie]);
};

config.macros.tabs.onClickTab = function(e)
{
	config.macros.tabs.switchTab(this.parentNode,this.getAttribute("tab"));
	return false;
};

config.macros.tabs.switchTab = function(tabset,tab)
{
	var cookie = tabset.getAttribute("cookie");
	var theTab = null;
	var nodes = tabset.childNodes;
	for(var t=0; t<nodes.length; t++) {
		if(nodes[t].getAttribute && nodes[t].getAttribute("tab") == tab) {
			theTab = nodes[t];
			theTab.className = "tab tabSelected";
		} else {
			nodes[t].className = "tab tabUnselected";
		}
	}
	if(theTab) {
		if(tabset.nextSibling && tabset.nextSibling.className == "tabContents")
			removeNode(tabset.nextSibling);
		var tabContent = createTiddlyElement(null,"div",null,"tabContents");
		tabset.parentNode.insertBefore(tabContent,tabset.nextSibling);
		var contentTitle = theTab.getAttribute("content");
		wikify(store.getTiddlerText(contentTitle),tabContent,null,store.getTiddler(contentTitle));
		if(cookie) {
			config.options[cookie] = tab;
			saveOptionCookie(cookie);
		}
	}
};

//--
//-- Sparklines
//--

config.macros.sparkline.handler = function(place,macroName,params)
{
	var data = [];
	var min = 0;
	var max = 0;
	var v;
	for(var t=0; t<params.length; t++) {
		v = parseInt(params[t]);
		if(v < min)
			min = v;
		if(v > max)
			max = v;
		data.push(v);
	}
	if(data.length < 1)
		return;
	var box = createTiddlyElement(place,"span",null,"sparkline",String.fromCharCode(160));
	box.title = data.join(",");
	var w = box.offsetWidth;
	var h = box.offsetHeight;
	box.style.paddingRight = (data.length * 2 - w) + "px";
	box.style.position = "relative";
	for(var d=0; d<data.length; d++) {
		var tick = document.createElement("img");
		tick.border = 0;
		tick.className = "sparktick";
		tick.style.position = "absolute";
		tick.src = "data:image/gif,GIF89a%01%00%01%00%91%FF%00%FF%FF%FF%00%00%00%C0%C0%C0%00%00%00!%F9%04%01%00%00%02%00%2C%00%00%00%00%01%00%01%00%40%02%02T%01%00%3B";
		tick.style.left = d*2 + "px";
		tick.style.width = "2px";
		v = Math.floor(((data[d] - min)/(max-min)) * h);
		tick.style.top = (h-v) + "px";
		tick.style.height = v + "px";
		box.appendChild(tick);
	}
};//--
//-- Tiddler toolbar
//--

// Create a toolbar command button
config.macros.toolbar.createCommand = function(place,commandName,tiddler,theClass)
{
	if(typeof commandName != "string") {
		var c = null;
		for(var t in config.commands) {
			if(config.commands[t] == commandName)
				c = t;
		}
		commandName = c;
	}
	if((tiddler instanceof Tiddler) && (typeof commandName == "string")) {
		var command = config.commands[commandName];
		if(command.isEnabled ? command.isEnabled(tiddler) : this.isCommandEnabled(command,tiddler)) {
			var text = command.getText ? command.getText(tiddler) : this.getCommandText(command,tiddler);
			var tooltip = command.getTooltip ? command.getTooltip(tiddler) : this.getCommandTooltip(command,tiddler);
			var cmd;
			switch(command.type) {
				case "popup":
					cmd = this.onClickPopup;
					break;
				case "command":
				default:
					cmd = this.onClickCommand;
					break;
			}
			var btn = createTiddlyButton(null,text,tooltip,cmd);
			btn.setAttribute("commandName",commandName);
			btn.setAttribute("tiddler",tiddler.title);
			if(theClass)
				addClass(btn,theClass);
			place.appendChild(btn);
		}
	}
};

config.macros.toolbar.isCommandEnabled = function(command,tiddler)
{
	var title = tiddler.title;
	var ro = tiddler.isReadOnly();
	var shadow = store.isShadowTiddler(title) && !store.tiddlerExists(title);
	return (!ro || (ro && !command.hideReadOnly)) && !(shadow && command.hideShadow);
};

config.macros.toolbar.getCommandText = function(command,tiddler)
{
	return tiddler.isReadOnly() && command.readOnlyText ? command.readOnlyText : command.text;
};

config.macros.toolbar.getCommandTooltip = function(command,tiddler)
{
	return tiddler.isReadOnly() && command.readOnlyTooltip ? command.readOnlyTooltip : command.tooltip;
};

config.macros.toolbar.onClickCommand = function(ev)
{
	var e = ev ? ev : window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	var command = config.commands[this.getAttribute("commandName")];
	return command.handler(e,this,this.getAttribute("tiddler"));
};

config.macros.toolbar.onClickPopup = function(ev)
{
	var e = ev ? ev : window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	var popup = Popup.create(this);
	var command = config.commands[this.getAttribute("commandName")];
	var title = this.getAttribute("tiddler");
	var tiddler = store.fetchTiddler(title);
	popup.setAttribute("tiddler",title);
	command.handlePopup(popup,title);
	Popup.show();
	return false;
};

// Invoke the first command encountered from a given place that is tagged with a specified class
config.macros.toolbar.invokeCommand = function(place,theClass,event)
{
	var children = place.getElementsByTagName("a");
	for(var t=0; t<children.length; t++) {
		var c = children[t];
		if(hasClass(c,theClass) && c.getAttribute && c.getAttribute("commandName")) {
			if(c.onclick instanceof Function)
				c.onclick.call(c,event);
			break;
		}
	}
};

config.macros.toolbar.onClickMore = function(ev)
{
	var e = this.nextSibling;
	e.style.display = "inline";
	removeNode(this);
	return false;
};

config.macros.toolbar.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	for(var t=0; t<params.length; t++) {
		var c = params[t];
		switch(c) {
			case '>':
				var btn = createTiddlyButton(place,this.moreLabel,this.morePrompt,config.macros.toolbar.onClickMore);
				addClass(btn,"moreCommand");
				var e = createTiddlyElement(place,"span",null,"moreCommand");
				e.style.display = "none";
				place = e;
				break;
			default:
				var theClass = "";
				switch(c.substr(0,1)) {
					case "+":
						theClass = "defaultCommand";
						c = c.substr(1);
						break;
					case "-":
						theClass = "cancelCommand";
						c = c.substr(1);
						break;
				}
				if(c in config.commands)
					this.createCommand(place,c,tiddler,theClass);
				break;
		}
	}
};

//--
//-- Menu and toolbar commands
//--

config.commands.closeTiddler.handler = function(event,src,title)
{
	story.closeTiddler(title,true);
	return false;
};

config.commands.closeOthers.handler = function(event,src,title)
{
	story.closeAllTiddlers(title);
	return false;
};

config.commands.editTiddler.handler = function(event,src,title)
{
	clearMessage();
	var tiddlerElem = document.getElementById(story.idPrefix + title);
	var fields = tiddlerElem.getAttribute("tiddlyFields");
	story.displayTiddler(null,title,DEFAULT_EDIT_TEMPLATE,false,null,fields);
	story.focusTiddler(title,"text");
	return false;
};

config.commands.saveTiddler.handler = function(event,src,title)
{
	var newTitle = story.saveTiddler(title,event.shiftKey);
	if(newTitle)
		story.displayTiddler(null,newTitle);
	return false;
};

config.commands.cancelTiddler.handler = function(event,src,title)
{
	if(story.hasChanges(title) && !readOnly) {
		if(!confirm(this.warning.format([title])))
			return false;
	}
	story.setDirty(title,false);
	story.displayTiddler(null,title);
	return false;
};

config.commands.deleteTiddler.handler = function(event,src,title)
{
	var deleteIt = true;
	if (config.options.chkConfirmDelete)
		deleteIt = confirm(this.warning.format([title]));
	if (deleteIt) {
		store.removeTiddler(title);
		story.closeTiddler(title,true);
		autoSaveChanges();
	}
	return false;
};

config.commands.permalink.handler = function(event,src,title)
{
	var t = encodeURIComponent(String.encodeTiddlyLink(title));
	if(window.location.hash != t)
		window.location.hash = t;
	return false;
};

config.commands.references.handlePopup = function(popup,title)
{
	var references = store.getReferringTiddlers(title);
	var c = false;
	for(var r=0; r<references.length; r++) {
		if(references[r].title != title && !references[r].isTagged("excludeLists")) {
			createTiddlyLink(createTiddlyElement(popup,"li"),references[r].title,true);
			c = true;
		}
	}
	if(!c)
		createTiddlyText(createTiddlyElement(popup,"li",null,"disabled"),this.popupNone);
};

config.commands.jump.handlePopup = function(popup,title)
{
	story.forEachTiddler(function(title,element) {
		createTiddlyLink(createTiddlyElement(popup,"li"),title,true,null,false,null,true);
		});
};

config.commands.syncing.handlePopup = function(popup,title)
{
	var tiddler = store.fetchTiddler(title);
	if(!tiddler)
		return;
	var serverType = tiddler.getServerType();
	var serverHost = tiddler.fields['server.host'];
	var serverWorkspace = tiddler.fields['server.workspace'];
	if(!serverWorkspace)
		serverWorkspace = "";
	if(serverType) {
		var e = createTiddlyElement(popup,"li",null,"popupMessage");
		e.innerHTML = config.commands.syncing.currentlySyncing.format([serverType,serverHost,serverWorkspace]);
	} else {
		createTiddlyElement(popup,"li",null,"popupMessage",config.commands.syncing.notCurrentlySyncing);
	}
	if(serverType) {
		createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
		var btn = createTiddlyButton(createTiddlyElement(popup,"li"),this.captionUnSync,null,config.commands.syncing.onChooseServer);
		btn.setAttribute("tiddler",title);
		btn.setAttribute("server.type","");
	}
	createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
	createTiddlyElement(popup,"li",null,"popupMessage",config.commands.syncing.chooseServer);
	var feeds = store.getTaggedTiddlers("systemServer","title");
	for(var t=0; t<feeds.length; t++) {
		var f = feeds[t];
		var feedServerType = store.getTiddlerSlice(f.title,"Type");
		if(!feedServerType)
			feedServerType = "file";
		var feedServerHost = store.getTiddlerSlice(f.title,"URL");
		if(!feedServerHost)
			feedServerHost = "";
		var feedServerWorkspace = store.getTiddlerSlice(f.title,"Workspace");
		if(!feedServerWorkspace)
			feedServerWorkspace = "";
		var caption = f.title;
		if(serverType == feedServerType && serverHost == feedServerHost && serverWorkspace == feedServerWorkspace) {
			caption = config.commands.syncing.currServerMarker + caption;
		} else {
			caption = config.commands.syncing.notCurrServerMarker + caption;
		}
		btn = createTiddlyButton(createTiddlyElement(popup,"li"),caption,null,config.commands.syncing.onChooseServer);
		btn.setAttribute("tiddler",title);
		btn.setAttribute("server.type",feedServerType);
		btn.setAttribute("server.host",feedServerHost);
		btn.setAttribute("server.workspace",feedServerWorkspace);
	}
};

config.commands.syncing.onChooseServer = function(e)
{
	var tiddler = this.getAttribute("tiddler");
	var serverType = this.getAttribute("server.type");
	if(serverType) {
		store.addTiddlerFields(tiddler,{
			'server.type': serverType,
			'server.host': this.getAttribute("server.host"),
			'server.workspace': this.getAttribute("server.workspace")
			});
	} else {
		store.setValue(tiddler,'server',null);
	}
	return false;
};

config.commands.fields.handlePopup = function(popup,title)
{
	var tiddler = store.fetchTiddler(title);
	if(!tiddler)
		return;
	var fields = {};
	store.forEachField(tiddler,function(tiddler,fieldName,value) {fields[fieldName] = value;},true);
	var items = [];
	for(var t in fields) {
		items.push({field: t,value: fields[t]});
	}
	items.sort(function(a,b) {return a.field < b.field ? -1 : (a.field == b.field ? 0 : +1);});
	if(items.length > 0)
		ListView.create(popup,items,this.listViewTemplate);
	else
		createTiddlyElement(popup,"div",null,null,this.emptyText);
};

//--
//-- Tiddler() object
//--

function Tiddler(title)
{
	this.title = title;
	this.text = null;
	this.modifier = null;
	this.modified = new Date();
	this.created = new Date();
	this.links = [];
	this.linksUpdated = false;
	this.tags = [];
	this.fields = {};
	return this;
}

Tiddler.prototype.getLinks = function()
{
	if(this.linksUpdated==false)
		this.changed();
	return this.links;
};

// Returns the fields that are inherited in string field:"value" field2:"value2" format
Tiddler.prototype.getInheritedFields = function()
{
	var f = {};
	for(i in this.fields) {
		if(i=="server.host" || i=="server.workspace" || i=="wikiformat"|| i=="server.type") {
			f[i] = this.fields[i];
		}
	}
	return String.encodeHashMap(f);
};

// Increment the changeCount of a tiddler
Tiddler.prototype.incChangeCount = function()
{
	var c = this.fields['changecount'];
	c = c ? parseInt(c) : 0;
	this.fields['changecount'] = String(c+1);
};

// Clear the changeCount of a tiddler
Tiddler.prototype.clearChangeCount = function()
{
	if(this.fields['changecount']) {
		delete this.fields['changecount'];
	}
};

// Returns true if the tiddler has been updated since the tiddler was created or downloaded
Tiddler.prototype.isTouched = function()
{
	var changeCount = this.fields['changecount'];
	if(changeCount === undefined)
		changeCount = 0;
	return changeCount > 0;
};

// Format the text for storage in an RSS item
Tiddler.prototype.saveToRss = function(url)
{
	var s = [];
	s.push("<item>");
	s.push("<title" + ">" + this.title.htmlEncode() + "</title" + ">");
	s.push("<description>" + wikifyStatic(this.text,null,this).htmlEncode() + "</description>");
	for(var t=0; t<this.tags.length; t++)
		s.push("<category>" + this.tags[t] + "</category>");
	s.push("<link>" + url + "#" + encodeURIComponent(String.encodeTiddlyLink(this.title)) + "</link>");
	s.push("<pubDate>" + this.modified.toGMTString() + "</pubDate>");
	s.push("</item>");
	return s.join("\n");
};

// Change the text and other attributes of a tiddler
Tiddler.prototype.set = function(title,text,modifier,modified,tags,created,fields)
{
	this.assign(title,text,modifier,modified,tags,created,fields);
	this.changed();
	return this;
};

// Change the text and other attributes of a tiddler without triggered a tiddler.changed() call
Tiddler.prototype.assign = function(title,text,modifier,modified,tags,created,fields)
{
	if(title != undefined)
		this.title = title;
	if(text != undefined)
		this.text = text;
	if(modifier != undefined)
		this.modifier = modifier;
	if(modified != undefined)
		this.modified = modified;
	if(created != undefined)
		this.created = created;
	if(fields != undefined)
		this.fields = fields;
	if(tags != undefined)
		this.tags = (typeof tags == "string") ? tags.readBracketedList() : tags;
	else if(this.tags == undefined)
		this.tags = [];
	return this;
};

// Get the tags for a tiddler as a string (space delimited, using [[brackets]] for tags containing spaces)
Tiddler.prototype.getTags = function()
{
	return String.encodeTiddlyLinkList(this.tags);
};

// Test if a tiddler carries a tag
Tiddler.prototype.isTagged = function(tag)
{
	return this.tags.indexOf(tag) != -1;
};

// Static method to convert "\n" to newlines, "\s" to "\"
Tiddler.unescapeLineBreaks = function(text)
{
	return text ? text.unescapeLineBreaks() : "";
};

// Convert newlines to "\n", "\" to "\s"
Tiddler.prototype.escapeLineBreaks = function()
{
	return this.text.escapeLineBreaks();
};

// Updates the secondary information (like links[] array) after a change to a tiddler
Tiddler.prototype.changed = function()
{
	this.links = [];
	var t = this.autoLinkWikiWords() ? 0 : 1;
	var tiddlerLinkRegExp = t==0 ? config.textPrimitives.tiddlerAnyLinkRegExp : config.textPrimitives.tiddlerForcedLinkRegExp;
	tiddlerLinkRegExp.lastIndex = 0;
	var formatMatch = tiddlerLinkRegExp.exec(this.text);
	while(formatMatch) {
		var lastIndex = tiddlerLinkRegExp.lastIndex;
		if(t==0 && formatMatch[1] && formatMatch[1] != this.title) {
			// wikiWordLink
			if(formatMatch.index > 0) {
				var preRegExp = new RegExp(config.textPrimitives.unWikiLink+"|"+config.textPrimitives.anyLetter,"mg");
				preRegExp.lastIndex = formatMatch.index-1;
				var preMatch = preRegExp.exec(this.text);
				if(preMatch.index != formatMatch.index-1)
					this.links.pushUnique(formatMatch[1]);
			} else {
				this.links.pushUnique(formatMatch[1]);
			}
		}
		else if(formatMatch[2-t] && !config.formatterHelpers.isExternalLink(formatMatch[3-t])) // titledBrackettedLink
			this.links.pushUnique(formatMatch[3-t]);
		else if(formatMatch[4-t] && formatMatch[4-t] != this.title) // brackettedLink
			this.links.pushUnique(formatMatch[4-t]);
		tiddlerLinkRegExp.lastIndex = lastIndex;
		formatMatch = tiddlerLinkRegExp.exec(this.text);
	}
	this.linksUpdated = true;
};

Tiddler.prototype.getSubtitle = function()
{
	var modifier = this.modifier;
	if(!modifier)
		modifier = config.messages.subtitleUnknown;
	var modified = this.modified;
	if(modified)
		modified = modified.toLocaleString();
	else
		modified = config.messages.subtitleUnknown;
	return config.messages.tiddlerLinkTooltip.format([this.title,modifier,modified]);
};

Tiddler.prototype.isReadOnly = function()
{
	return readOnly;
};

Tiddler.prototype.autoLinkWikiWords = function()
{
	return !(this.isTagged("systemConfig") || this.isTagged("excludeMissing"));
};

Tiddler.prototype.generateFingerprint = function()
{
	return "0x" + Crypto.hexSha1Str(this.text);
};

Tiddler.prototype.getServerType = function()
{
	var serverType = null;
	if(this.fields && this.fields['server.type'])
		serverType = this.fields['server.type'];
	if(!serverType)
		serverType = this.fields['wikiformat'];
	if(serverType && !config.adaptors[serverType])
		serverType = null;
	return serverType;
};

Tiddler.prototype.getAdaptor = function()
{
	var serverType = this.getServerType();
	return serverType ? new config.adaptors[serverType] : null;
};

//--
//-- TiddlyWiki() object contains Tiddler()s
//--

function TiddlyWiki()
{
	var tiddlers = {}; // Hashmap by name of tiddlers
	this.tiddlersUpdated = false;
	this.namedNotifications = []; // Array of {name:,notify:} of notification functions
	this.notificationLevel = 0;
	this.slices = {}; // map tiddlerName->(map sliceName->sliceValue). Lazy.
	this.clear = function() {
		tiddlers = {};
		this.setDirty(false);
	};
	this.fetchTiddler = function(title) {
		return tiddlers[title];
	};
	this.deleteTiddler = function(title) {
		delete this.slices[title];
		delete tiddlers[title];
	};
	this.addTiddler = function(tiddler) {
		delete this.slices[tiddler.title];
		tiddlers[tiddler.title] = tiddler;
	};
	this.forEachTiddler = function(callback) {
		for(var t in tiddlers) {
			var tiddler = tiddlers[t];
			if(tiddler instanceof Tiddler)
				callback.call(this,t,tiddler);
		}
	};
}

TiddlyWiki.prototype.setDirty = function(dirty)
{
	this.dirty = dirty;
};

TiddlyWiki.prototype.isDirty = function()
{
	return this.dirty;
};

TiddlyWiki.prototype.suspendNotifications = function()
{
	this.notificationLevel--;
};

TiddlyWiki.prototype.resumeNotifications = function()
{
	this.notificationLevel++;
};

// Invoke the notification handlers for a particular tiddler
TiddlyWiki.prototype.notify = function(title,doBlanket)
{
	if(!this.notificationLevel) {
		for(var t=0; t<this.namedNotifications.length; t++) {
			var n = this.namedNotifications[t];
			if((n.name == null && doBlanket) || (n.name == title))
				n.notify(title);
		}
	}
};

// Invoke the notification handlers for all tiddlers
TiddlyWiki.prototype.notifyAll = function()
{
	if(!this.notificationLevel) {
		for(var t=0; t<this.namedNotifications.length; t++) {
			var n = this.namedNotifications[t];
			if(n.name)
				n.notify(n.name);
		}
	}
};

// Add a notification handler to a tiddler
TiddlyWiki.prototype.addNotification = function(title,fn)
{
	for(var i=0; i<this.namedNotifications.length; i++) {
		if((this.namedNotifications[i].name == title) && (this.namedNotifications[i].notify == fn))
			return this;
	}
	this.namedNotifications.push({name: title, notify: fn});
	return this;
};

TiddlyWiki.prototype.removeTiddler = function(title)
{
	var tiddler = this.fetchTiddler(title);
	if(tiddler) {
		this.deleteTiddler(title);
		this.notify(title,true);
		this.setDirty(true);
	}
};

TiddlyWiki.prototype.tiddlerExists = function(title)
{
	var t = this.fetchTiddler(title);
	return t != undefined;
};

TiddlyWiki.prototype.isShadowTiddler = function(title)
{
	return typeof config.shadowTiddlers[title] == "string";
};

TiddlyWiki.prototype.getTiddler = function(title)
{
	var t = this.fetchTiddler(title);
	if(t != undefined)
		return t;
	else
		return null;
};

TiddlyWiki.prototype.getTiddlerText = function(title,defaultText)
{
	var tiddler = this.fetchTiddler(title);
	if(tiddler)
		return tiddler.text;
	if(!title)
		return defaultText;
	var pos = title.indexOf(config.textPrimitives.sliceSeparator);
	if(pos != -1) {
		var slice = this.getTiddlerSlice(title.substr(0,pos),title.substr(pos + config.textPrimitives.sliceSeparator.length));
		if(slice)
			return slice;
	}
	if(this.isShadowTiddler(title))
		return config.shadowTiddlers[title];
	if(defaultText != undefined)
		return defaultText;
	return null;
};

TiddlyWiki.prototype.slicesRE = /(?:[\'\/]*~?([\.\w]+)[\'\/]*\:[\'\/]*\s*(.*?)\s*$)|(?:\|[\'\/]*~?([\.\w]+)\:?[\'\/]*\|\s*(.*?)\s*\|)/gm;

// @internal
TiddlyWiki.prototype.calcAllSlices = function(title)
{
	var slices = {};
	var text = this.getTiddlerText(title,"");
	this.slicesRE.lastIndex = 0;
	do {
		var m = this.slicesRE.exec(text);
		if(m) {
			if(m[1])
				slices[m[1]] = m[2];
			else
				slices[m[3]] = m[4];
		}
	} while(m);
	return slices;
};

// Returns the slice of text of the given name
TiddlyWiki.prototype.getTiddlerSlice = function(title,sliceName)
{
	var slices = this.slices[title];
	if(!slices) {
		slices = this.calcAllSlices(title);
		this.slices[title] = slices;
	}
	return slices[sliceName];
};

// Build an hashmap of the specified named slices of a tiddler
TiddlyWiki.prototype.getTiddlerSlices = function(title,sliceNames)
{
	var r = {};
	for(var t=0; t<sliceNames.length; t++) {
		var slice = this.getTiddlerSlice(title,sliceNames[t]);
		if(slice)
			r[sliceNames[t]] = slice;
	}
	return r;
};

TiddlyWiki.prototype.getRecursiveTiddlerText = function(title,defaultText,depth)
{
	var bracketRegExp = new RegExp("(?:\\[\\[([^\\]]+)\\]\\])","mg");
	var text = this.getTiddlerText(title,null);
	if(text == null)
		return defaultText;
	var textOut = [];
	var lastPos = 0;
	do {
		var match = bracketRegExp.exec(text);
		if(match) {
			textOut.push(text.substr(lastPos,match.index-lastPos));
			if(match[1]) {
				if(depth <= 0)
					textOut.push(match[1]);
				else
					textOut.push(this.getRecursiveTiddlerText(match[1],"[[" + match[1] + "]]",depth-1));
			}
			lastPos = match.index + match[0].length;
		} else {
			textOut.push(text.substr(lastPos));
		}
	} while(match);
	return textOut.join("");
};

TiddlyWiki.prototype.setTiddlerTag = function(title,status,tag)
{
	var tiddler = this.fetchTiddler(title);
	if(tiddler) {
		var t = tiddler.tags.indexOf(tag);
		if(t != -1)
			tiddler.tags.splice(t,1);
		if(status)
			tiddler.tags.push(tag);
		tiddler.changed();
		this.incChangeCount(title);
		this.notify(title,true);
		this.setDirty(true);
	}
};

TiddlyWiki.prototype.addTiddlerFields = function(title,fields)
{
	var tiddler = this.fetchTiddler(title);
	if(!tiddler)
		return;
	merge(tiddler.fields,fields);
	tiddler.changed();
	this.incChangeCount(title);
	this.notify(title,true);
	this.setDirty(true);
};

TiddlyWiki.prototype.saveTiddler = function(title,newTitle,newBody,modifier,modified,tags,fields,clearChangeCount,created)
{
	var tiddler = this.fetchTiddler(title);
	if(tiddler) {
		created = created ? created : tiddler.created; // Preserve created date
		this.deleteTiddler(title);
	} else {
		created = created ? created : modified;
		tiddler = new Tiddler();
	}
	tiddler.set(newTitle,newBody,modifier,modified,tags,created,fields);
	this.addTiddler(tiddler);
	if(clearChangeCount)
		tiddler.clearChangeCount();
	else
		tiddler.incChangeCount();
	if(title != newTitle)
		this.notify(title,true);
	this.notify(newTitle,true);
	this.setDirty(true);
	return tiddler;
};

// Reset the sync status of a freshly synced tiddler
TiddlyWiki.prototype.resetTiddler = function(title)
{
	var tiddler = this.fetchTiddler(title);
	if(tiddler) {
		tiddler.clearChangeCount();
		this.notify(title,true);
		this.setDirty(true);
	}
};

TiddlyWiki.prototype.incChangeCount = function(title)
{
	var tiddler = this.fetchTiddler(title);
	if(tiddler)
		tiddler.incChangeCount();
};

TiddlyWiki.prototype.createTiddler = function(title)
{
	var tiddler = this.fetchTiddler(title);
	if(!tiddler) {
		tiddler = new Tiddler();
		tiddler.title = title;
		this.addTiddler(tiddler);
		this.setDirty(true);
	}
	return tiddler;
};

// Load contents of a TiddlyWiki from an HTML DIV
TiddlyWiki.prototype.loadFromDiv = function(src,idPrefix,noUpdate)
{
	this.idPrefix = idPrefix;
	var storeElem = (typeof src == "string") ? document.getElementById(src) : src;
	if(!storeElem)
		return;
	var tiddlers = this.getLoader().loadTiddlers(this,storeElem.childNodes);
	this.setDirty(false);
	if(!noUpdate) {
		for(var i = 0;i<tiddlers.length; i++)
			tiddlers[i].changed();
	}
};

// Load contents of a TiddlyWiki from a string
// Returns null if there's an error
TiddlyWiki.prototype.importTiddlyWiki = function(text)
{
	var posDiv = locateStoreArea(text);
	if(!posDiv)
		return null;
	var content = "<" + "html><" + "body>" + text.substring(posDiv[0],posDiv[1] + endSaveArea.length) + "<" + "/body><" + "/html>";
	// Create the iframe
	var iframe = document.createElement("iframe");
	iframe.style.display = "none";
	document.body.appendChild(iframe);
	var doc = iframe.document;
	if(iframe.contentDocument)
		doc = iframe.contentDocument; // For NS6
	else if(iframe.contentWindow)
		doc = iframe.contentWindow.document; // For IE5.5 and IE6
	// Put the content in the iframe
	doc.open();
	doc.writeln(content);
	doc.close();
	// Load the content into a TiddlyWiki() object
	var storeArea = doc.getElementById("storeArea");
	this.loadFromDiv(storeArea,"store");
	// Get rid of the iframe
	iframe.parentNode.removeChild(iframe);
	return this;
};

TiddlyWiki.prototype.updateTiddlers = function()
{
	this.tiddlersUpdated = true;
	this.forEachTiddler(function(title,tiddler) {
		tiddler.changed();
	});
};

// Return all tiddlers formatted as an HTML string
TiddlyWiki.prototype.allTiddlersAsHtml = function()
{
	return store.getSaver().externalize(store);
};

// Return an array of tiddlers matching a search regular expression
TiddlyWiki.prototype.search = function(searchRegExp,sortField,excludeTag)
{
	var candidates = this.reverseLookup("tags",excludeTag,false);
	var results = [];
	for(var t=0; t<candidates.length; t++) {
		if((candidates[t].title.search(searchRegExp) != -1) || (candidates[t].text.search(searchRegExp) != -1))
			results.push(candidates[t]);
	}
	if(!sortField)
		sortField = "title";
	results.sort(function(a,b) {return a[sortField] < b[sortField] ? -1 : (a[sortField] == b[sortField] ? 0 : +1);});
	return results;
};

// Returns a list of all tags in use
//   excludeTag - if present, excludes tags that are themselves tagged with excludeTag
// Returns an array of arrays where [tag][0] is the name of the tag and [tag][1] is the number of occurances
TiddlyWiki.prototype.getTags = function(excludeTag)
{
	var results = [];
	this.forEachTiddler(function(title,tiddler) {
		for(var g=0; g<tiddler.tags.length; g++) {
			var tag = tiddler.tags[g];
			var n = true;
			for(var c=0; c<results.length; c++) {
				if(results[c][0] == tag) {
					n = false;
					results[c][1]++;
				}
			}
			if(n && excludeTag) {
				var t = store.fetchTiddler(tag);
				if(t && t.isTagged(excludeTag))
					n = false;
			}
			if(n)
				results.push([tag,1]);
		}
	});
	results.sort(function(a,b) {return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : (a[0].toLowerCase() == b[0].toLowerCase() ? 0 : +1);});
	return results;
};

// Return an array of the tiddlers that are tagged with a given tag
TiddlyWiki.prototype.getTaggedTiddlers = function(tag,sortField)
{
	return this.reverseLookup("tags",tag,true,sortField);
};

// Return an array of the tiddlers that link to a given tiddler
TiddlyWiki.prototype.getReferringTiddlers = function(title,unusedParameter,sortField)
{
	if(!this.tiddlersUpdated)
		this.updateTiddlers();
	return this.reverseLookup("links",title,true,sortField);
};

// Return an array of the tiddlers that do or do not have a specified entry in the specified storage array (ie, "links" or "tags")
// lookupMatch == true to match tiddlers, false to exclude tiddlers
TiddlyWiki.prototype.reverseLookup = function(lookupField,lookupValue,lookupMatch,sortField)
{
	var results = [];
	this.forEachTiddler(function(title,tiddler) {
		var f = !lookupMatch;
		for(var lookup=0; lookup<tiddler[lookupField].length; lookup++) {
			if(tiddler[lookupField][lookup] == lookupValue)
				f = lookupMatch;
		}
		if(f)
			results.push(tiddler);
	});
	if(!sortField)
		sortField = "title";
	results.sort(function(a,b) {return a[sortField] < b[sortField] ? -1 : (a[sortField] == b[sortField] ? 0 : +1);});
	return results;
};

// Return the tiddlers as a sorted array
TiddlyWiki.prototype.getTiddlers = function(field,excludeTag)
{
	var results = [];
	this.forEachTiddler(function(title,tiddler) {
		if(excludeTag == undefined || !tiddler.isTagged(excludeTag))
			results.push(tiddler);
	});
	if(field)
		results.sort(function(a,b) {return a[field] < b[field] ? -1 : (a[field] == b[field] ? 0 : +1);});
	return results;
};

// Return array of names of tiddlers that are referred to but not defined
TiddlyWiki.prototype.getMissingLinks = function(sortField)
{
	if(!this.tiddlersUpdated)
		this.updateTiddlers();
	var results = [];
	this.forEachTiddler(function (title,tiddler) {
		if(tiddler.isTagged("excludeMissing") || tiddler.isTagged("systemConfig"))
			return;
		for(var n=0; n<tiddler.links.length;n++) {
			var link = tiddler.links[n];
			if(this.fetchTiddler(link) == null && !this.isShadowTiddler(link))
				results.pushUnique(link);
		}
	});
	results.sort();
	return results;
};

// Return an array of names of tiddlers that are defined but not referred to
TiddlyWiki.prototype.getOrphans = function()
{
	var results = [];
	this.forEachTiddler(function (title,tiddler) {
		if(this.getReferringTiddlers(title).length == 0 && !tiddler.isTagged("excludeLists"))
			results.push(title);
	});
	results.sort();
	return results;
};

// Return an array of names of all the shadow tiddlers
TiddlyWiki.prototype.getShadowed = function()
{
	var results = [];
	for(var t in config.shadowTiddlers) {
		if(typeof config.shadowTiddlers[t] == "string")
			results.push(t);
	}
	results.sort();
	return results;
};

// Return an array of tiddlers that have been touched since they were downloaded or created
TiddlyWiki.prototype.getTouched = function()
{
	var results = [];
	this.forEachTiddler(function(title,tiddler) {
		if(tiddler.isTouched())
			results.push(tiddler);
		});
	results.sort();
	return results;
};

// Resolves a Tiddler reference or tiddler title into a Tiddler object, or null if it doesn't exist
TiddlyWiki.prototype.resolveTiddler = function(tiddler)
{
	var t = (typeof tiddler == 'string') ? this.getTiddler(tiddler) : tiddler;
	return t instanceof Tiddler ? t : null;
};

TiddlyWiki.prototype.getLoader = function()
{
	if(!this.loader)
		this.loader = new TW21Loader();
	return this.loader;
};

TiddlyWiki.prototype.getSaver = function()
{
	if(!this.saver)
		this.saver = new TW21Saver();
	return this.saver;
};

// Returns true if path is a valid field name (path),
// i.e. a sequence of identifiers, separated by '.'
TiddlyWiki.isValidFieldName = function(name)
{
	var match = /[a-zA-Z_]\w*(\.[a-zA-Z_]\w*)*/.exec(name);
	return match && (match[0] == name);
};

// Throws an exception when name is not a valid field name.
TiddlyWiki.checkFieldName = function(name)
{
	if(!TiddlyWiki.isValidFieldName(name))
		throw config.messages.invalidFieldName.format([name]);
};

function StringFieldAccess(n,readOnly)
{
	this.set = readOnly ?
			function(t,v) {if(v != t[n]) throw config.messages.fieldCannotBeChanged.format([n]);} :
			function(t,v) {if(v != t[n]) {t[n] = v; return true;}};
	this.get = function(t) {return t[n];};
}

function DateFieldAccess(n)
{
	this.set = function(t,v) {
		var d = v instanceof Date ? v : Date.convertFromYYYYMMDDHHMM(v);
		if(d != t[n]) {
			t[n] = d; return true;
		}
	};
	this.get = function(t) {return t[n].convertToYYYYMMDDHHMM();};
}

function LinksFieldAccess(n)
{
	this.set = function(t,v) {
		var s = (typeof v == "string") ? v.readBracketedList() : v;
		if(s.toString() != t[n].toString()) {
			t[n] = s; return true;
		}
	};
	this.get = function(t) {return String.encodeTiddlyLinkList(t[n]);};
}

TiddlyWiki.standardFieldAccess = {
	// The set functions return true when setting the data has changed the value.
	"title":    new StringFieldAccess("title",true),
	// Handle the "tiddler" field name as the title
	"tiddler":  new StringFieldAccess("title",true),
	"text":     new StringFieldAccess("text"),
	"modifier": new StringFieldAccess("modifier"),
	"modified": new DateFieldAccess("modified"),
	"created":  new DateFieldAccess("created"),
	"tags":     new LinksFieldAccess("tags")
};

TiddlyWiki.isStandardField = function(name)
{
	return TiddlyWiki.standardFieldAccess[name] != undefined;
};

// Sets the value of the given field of the tiddler to the value.
// Setting an ExtendedField's value to null or undefined removes the field.
// Setting a namespace to undefined removes all fields of that namespace.
// The fieldName is case-insensitive.
// All values will be converted to a string value.
TiddlyWiki.prototype.setValue = function(tiddler,fieldName,value)
{
	TiddlyWiki.checkFieldName(fieldName);
	var t = this.resolveTiddler(tiddler);
	if(!t)
		return;
	fieldName = fieldName.toLowerCase();
	var isRemove = (value === undefined) || (value === null);
	var accessor = TiddlyWiki.standardFieldAccess[fieldName];
	if(accessor) {
		if(isRemove)
			// don't remove StandardFields
			return;
		var h = TiddlyWiki.standardFieldAccess[fieldName];
		if(!h.set(t,value))
			return;
	} else {
		var oldValue = t.fields[fieldName];
		if(isRemove) {
			if(oldValue !== undefined) {
				// deletes a single field
				delete t.fields[fieldName];
			} else {
				// no concrete value is defined for the fieldName
				// so we guess this is a namespace path.
				// delete all fields in a namespace
				var re = new RegExp('^'+fieldName+'\\.');
				var dirty = false;
				for(var n in t.fields) {
					if(n.match(re)) {
						delete t.fields[n];
						dirty = true;
					}
				}
				if(!dirty)
					return;
			}
		} else {
			// the "normal" set case. value is defined (not null/undefined)
			// For convenience provide a nicer conversion Date->String
			value = value instanceof Date ? value.convertToYYYYMMDDHHMMSSMMM() : String(value);
			if(oldValue == value)
				return;
			t.fields[fieldName] = value;
		}
	}
	// When we are here the tiddler/store really was changed.
	this.notify(t.title,true);
	if(!fieldName.match(/^temp\./))
		this.setDirty(true);
};

// Returns the value of the given field of the tiddler.
// The fieldName is case-insensitive.
// Will only return String values (or undefined).
TiddlyWiki.prototype.getValue = function(tiddler,fieldName)
{
	var t = this.resolveTiddler(tiddler);
	if(!t)
		return undefined;
	fieldName = fieldName.toLowerCase();
	var accessor = TiddlyWiki.standardFieldAccess[fieldName];
	if(accessor) {
		return accessor.get(t);
	}
	return t.fields[fieldName];
};

// Calls the callback function for every field in the tiddler.
// When callback function returns a non-false value the iteration stops
// and that value is returned.
// The order of the fields is not defined.
// @param callback a function(tiddler,fieldName,value).
TiddlyWiki.prototype.forEachField = function(tiddler,callback,onlyExtendedFields)
{
	var t = this.resolveTiddler(tiddler);
	if(!t)
		return undefined;
	var n,result;
	for(n in t.fields) {
		result = callback(t,n,t.fields[n]);
		if(result)
			return result;
		}
	if(onlyExtendedFields)
		return undefined;
	for(n in TiddlyWiki.standardFieldAccess) {
		if(n == "tiddler")
			// even though the "title" field can also be referenced through the name "tiddler"
			// we only visit this field once.
			continue;
		result = callback(t,n,TiddlyWiki.standardFieldAccess[n].get(t));
		if(result)
			return result;
	}
	return undefined;
};

//--
//-- Story functions
//--

function Story(container,idPrefix)
{
	this.container = container;
	this.idPrefix = idPrefix;
	this.highlightRegExp = null;
}

Story.prototype.forEachTiddler = function(fn)
{
	var place = document.getElementById(this.container);
	if(!place)
		return;
	var e = place.firstChild;
	while(e) {
		var n = e.nextSibling;
		var title = e.getAttribute("tiddler");
		fn.call(this,title,e);
		e = n;
	}
};

Story.prototype.displayTiddlers = function(srcElement,titles,template,animate,unused,customFields,toggle)
{
	for(var t = titles.length-1;t>=0;t--)
		this.displayTiddler(srcElement,titles[t],template,animate,unused,customFields);
};

Story.prototype.displayTiddler = function(srcElement,title,template,animate,unused,customFields,toggle)
{
	var place = document.getElementById(this.container);
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem) {
		if(toggle)
			this.closeTiddler(title,true);
		else
			this.refreshTiddler(title,template,false,customFields);
	} else {
		var before = this.positionTiddler(srcElement);
		tiddlerElem = this.createTiddler(place,before,title,template,customFields);
	}
	if(srcElement && typeof srcElement !== "string") {
		if(config.options.chkAnimate && (animate == undefined || animate == true) && anim && typeof Zoomer == "function" && typeof Scroller == "function")
			anim.startAnimating(new Zoomer(title,srcElement,tiddlerElem),new Scroller(tiddlerElem));
		else
			window.scrollTo(0,ensureVisible(tiddlerElem));
	}
};

Story.prototype.positionTiddler = function(srcElement)
{
	var place = document.getElementById(this.container);
	var before = null;
	if(typeof srcElement == "string") {
		switch(srcElement) {
			case "top":
				before = place.firstChild;
				break;
			case "bottom":
				before = null;
				break;
		}
	} else {
		var after = this.findContainingTiddler(srcElement);
		if(after == null) {
			before = place.firstChild;
		} else if(after.nextSibling) {
			before = after.nextSibling;
			if(before.nodeType != 1)
				before = null;
		}
	}
	return before;
};

Story.prototype.createTiddler = function(place,before,title,template,customFields)
{
	var tiddlerElem = createTiddlyElement(null,"div",this.idPrefix + title,"tiddler");
	tiddlerElem.setAttribute("refresh","tiddler");
	if(customFields)
		tiddlerElem.setAttribute("tiddlyFields",customFields);
	place.insertBefore(tiddlerElem,before);
	var defaultText = null;
	if(!store.tiddlerExists(title) && !store.isShadowTiddler(title))
		defaultText = this.loadMissingTiddler(title,customFields,tiddlerElem);
	this.refreshTiddler(title,template,false,customFields,defaultText);
	return tiddlerElem;
};

Story.prototype.loadMissingTiddler = function(title,fields,tiddlerElem)
{
	var tiddler = new Tiddler(title);
	tiddler.fields = typeof fields == "string" ?  fields.decodeHashMap() : (fields ? fields : {});
	var serverType = tiddler.getServerType();
	var host = tiddler.fields['server.host'];
	var workspace = tiddler.fields['server.workspace'];
	if(!serverType | !host)
		return null;
	var sm = new SyncMachine(serverType,{
			start: function() {
				return this.openHost(host,"openWorkspace");
			},
			openWorkspace: function() {
				return this.openWorkspace(workspace,"getTiddler");
			},
			getTiddler: function() {
				return this.getTiddler(title,"gotTiddler");
			},
			gotTiddler: function(tiddler) {
				if(tiddler && tiddler.text) {
					var downloaded = new Date();
					if(!tiddler.created)
						tiddler.created = downloaded;
					if(!tiddler.modified)
						tiddler.modified = tiddler.created;
					store.saveTiddler(tiddler.title,tiddler.title,tiddler.text,tiddler.modifier,tiddler.modified,tiddler.tags,tiddler.fields,true,tiddler.created);
					autoSaveChanges();
				}
				delete this;
				return true;
			},
			error: function(message) {
				displayMessage("Error loading missing tiddler from %0: %1".format([host,message]));
			}
		});
	sm.go();
	return config.messages.loadingMissingTiddler.format([title,serverType,host,workspace]);
};

Story.prototype.chooseTemplateForTiddler = function(title,template)
{
	if(!template)
		template = DEFAULT_VIEW_TEMPLATE;
	if(template == DEFAULT_VIEW_TEMPLATE || template == DEFAULT_EDIT_TEMPLATE)
		template = config.tiddlerTemplates[template];
	return template;
};

Story.prototype.getTemplateForTiddler = function(title,template,tiddler)
{
	return store.getRecursiveTiddlerText(template,null,10);
};

Story.prototype.refreshTiddler = function(title,template,force,customFields,defaultText)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem) {
		if(tiddlerElem.getAttribute("dirty") == "true" && !force)
			return tiddlerElem;
		template = this.chooseTemplateForTiddler(title,template);
		var currTemplate = tiddlerElem.getAttribute("template");
		if((template != currTemplate) || force) {
			var tiddler = store.getTiddler(title);
			if(tiddler) {
				var f = tiddler.fields;
				if(customFields)
					f = merge(customFields.decodeHashMap(),f);
				customFields = String.encodeHashMap(f);
			} else {
				tiddler = new Tiddler();
				if(store.isShadowTiddler(title)) {
					tiddler.set(title,store.getTiddlerText(title),config.views.wikified.shadowModifier,version.date,[],version.date);
				} else {
					var text = template=="EditTemplate" ?
								config.views.editor.defaultText.format([title]) :
								config.views.wikified.defaultText.format([title]);
					text = defaultText ? defaultText : text;
					var fields = customFields ? customFields.decodeHashMap() : null;
					tiddler.set(title,text,config.views.wikified.defaultModifier,version.date,[],version.date,fields);
				}
			}
			tiddlerElem.setAttribute("tags",tiddler.tags.join(" "));
			tiddlerElem.setAttribute("tiddler",title);
			tiddlerElem.setAttribute("template",template);
			var me = this;
			tiddlerElem.onmouseover = this.onTiddlerMouseOver;
			tiddlerElem.onmouseout = this.onTiddlerMouseOut;
			tiddlerElem.ondblclick = this.onTiddlerDblClick;
			tiddlerElem[window.event?"onkeydown":"onkeypress"] = this.onTiddlerKeyPress;
			var html = this.getTemplateForTiddler(title,template,tiddler);
			tiddlerElem.innerHTML = html;
			applyHtmlMacros(tiddlerElem,tiddler);
			if(store.getTaggedTiddlers(title).length > 0)
				addClass(tiddlerElem,"isTag");
			else
				removeClass(tiddlerElem,"isTag");
			if(!store.tiddlerExists(title)) {
				if(store.isShadowTiddler(title))
					addClass(tiddlerElem,"shadow");
				else
					addClass(tiddlerElem,"missing");
			} else {
				removeClass(tiddlerElem,"shadow");
				removeClass(tiddlerElem,"missing");
			}
			if(customFields)
				this.addCustomFields(tiddlerElem,customFields);
			forceReflow();
		}
	}
	return tiddlerElem;
};

Story.prototype.addCustomFields = function(place,customFields)
{
	var fields = customFields.decodeHashMap();
	var w = document.createElement("div");
	w.style.display = "none";
	place.appendChild(w);
	for(var t in fields) {
		var e = document.createElement("input");
		e.setAttribute("type","text");
		e.setAttribute("value",fields[t]);
		w.appendChild(e);
		e.setAttribute("edit",t);
	}
};

Story.prototype.refreshAllTiddlers = function()
{
	var place = document.getElementById(this.container);
	var e = place.firstChild;
	if(!e)
		return;
	this.refreshTiddler(e.getAttribute("tiddler"),e.getAttribute("template"),true);
	while((e = e.nextSibling) != null)
		this.refreshTiddler(e.getAttribute("tiddler"),e.getAttribute("template"),true);
};

Story.prototype.onTiddlerMouseOver = function(e)
{
	if(window.addClass instanceof Function)
		addClass(this,"selected");
};

Story.prototype.onTiddlerMouseOut = function(e)
{
	if(window.removeClass instanceof Function)
		removeClass(this,"selected");
};

Story.prototype.onTiddlerDblClick = function(ev)
{
	var e = ev ? ev : window.event;
	var theTarget = resolveTarget(e);
	if(theTarget && theTarget.nodeName.toLowerCase() != "input" && theTarget.nodeName.toLowerCase() != "textarea") {
		if(document.selection && document.selection.empty)
			document.selection.empty();
		config.macros.toolbar.invokeCommand(this,"defaultCommand",e);
		e.cancelBubble = true;
		if(e.stopPropagation) e.stopPropagation();
		return true;
	} else {
		return false;
	}
};

Story.prototype.onTiddlerKeyPress = function(ev)
{
	var e = ev ? ev : window.event;
	clearMessage();
	var consume = false;
	var title = this.getAttribute("tiddler");
	var target = resolveTarget(e);
	switch(e.keyCode) {
		case 9: // Tab
			if(config.options.chkInsertTabs && target.tagName.toLowerCase() == "textarea") {
				replaceSelection(target,String.fromCharCode(9));
				consume = true;
			}
			if(config.isOpera) {
				target.onblur = function() {
					this.focus();
					this.onblur = null;
				};
			}
			break;
		case 13: // Ctrl-Enter
		case 10: // Ctrl-Enter on IE PC
		case 77: // Ctrl-Enter is "M" on some platforms
			if(e.ctrlKey) {
				blurElement(this);
				config.macros.toolbar.invokeCommand(this,"defaultCommand",e);
				consume = true;
			}
			break;
		case 27: // Escape
			blurElement(this);
			config.macros.toolbar.invokeCommand(this,"cancelCommand",e);
			consume = true;
			break;
	}
	e.cancelBubble = consume;
	if(consume) {
		if(e.stopPropagation) e.stopPropagation(); // Stop Propagation
		e.returnValue = true; // Cancel The Event in IE
		if(e.preventDefault ) e.preventDefault(); // Cancel The Event in Moz
	}
	return !consume;
};

Story.prototype.getTiddlerField = function(title,field)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	var e = null;
	if(tiddlerElem != null) {
		var children = tiddlerElem.getElementsByTagName("*");
		for(var t=0; t<children.length; t++) {
			var c = children[t];
			if(c.tagName.toLowerCase() == "input" || c.tagName.toLowerCase() == "textarea") {
				if(!e)
					e = c;
				if(c.getAttribute("edit") == field)
					e = c;
			}
		}
	}
	return e;
};

Story.prototype.focusTiddler = function(title,field)
{
	var e = this.getTiddlerField(title,field);
	if(e) {
		e.focus();
		e.select();
	}
};

Story.prototype.blurTiddler = function(title)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem != null && tiddlerElem.focus && tiddlerElem.blur) {
		tiddlerElem.focus();
		tiddlerElem.blur();
	}
};

Story.prototype.setTiddlerField = function(title,tag,mode,field)
{
	var c = story.getTiddlerField(title,field);

	var tags = c.value.readBracketedList();
	tags.setItem(tag,mode);
	c.value = String.encodeTiddlyLinkList(tags);
};

Story.prototype.setTiddlerTag = function(title,tag,mode)
{
	Story.prototype.setTiddlerField(title,tag,mode,"tags");
};

Story.prototype.closeTiddler = function(title,animate,unused)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem != null) {
		clearMessage();
		this.scrubTiddler(tiddlerElem);
		if(config.options.chkAnimate && animate && anim && typeof Slider == "function")
			anim.startAnimating(new Slider(tiddlerElem,false,null,"all"));
		else {
			removeNode(tiddlerElem);
			forceReflow();
		}
	}
};

Story.prototype.scrubTiddler = function(tiddlerElem)
{
	tiddlerElem.id = null;
};

Story.prototype.setDirty = function(title,dirty)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem != null)
		tiddlerElem.setAttribute("dirty",dirty ? "true" : "false");
};

Story.prototype.isDirty = function(title)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem != null)
		return tiddlerElem.getAttribute("dirty") == "true";
	return null;
};

Story.prototype.areAnyDirty = function()
{
	var r = false;
	this.forEachTiddler(function(title,element) {
		if(this.isDirty(title))
			r = true;
	});
	return r;
};

Story.prototype.closeAllTiddlers = function(exclude)
{
	clearMessage();
	this.forEachTiddler(function(title,element) {
		if((title != exclude) && element.getAttribute("dirty") != "true")
			this.closeTiddler(title);
	});
	window.scrollTo(0,ensureVisible(this.container));
};

Story.prototype.isEmpty = function()
{
	var place = document.getElementById(this.container);
	return place && place.firstChild == null;
};

Story.prototype.search = function(text,useCaseSensitive,useRegExp)
{
	this.closeAllTiddlers();
	highlightHack = new RegExp(useRegExp ?	 text : text.escapeRegExp(),useCaseSensitive ? "mg" : "img");
	var matches = store.search(highlightHack,"title","excludeSearch");
	var titles = [];
	for(var t=0;t<matches.length;t++)
		titles.push(matches[t].title);
	this.displayTiddlers(null,titles);
	highlightHack = null;
	var q = useRegExp ? "/" : "'";
	if(matches.length > 0)
		displayMessage(config.macros.search.successMsg.format([titles.length.toString(),q + text + q]));
	else
		displayMessage(config.macros.search.failureMsg.format([q + text + q]));
};

Story.prototype.findContainingTiddler = function(e)
{
	while(e && !hasClass(e,"tiddler"))
		e = e.parentNode;
	return e;
};

Story.prototype.gatherSaveFields = function(e,fields)
{
	if(e && e.getAttribute) {
		var f = e.getAttribute("edit");
		if(f)
			fields[f] = e.value.replace(/\r/mg,"");
		if(e.hasChildNodes()) {
			var c = e.childNodes;
			for(var t=0; t<c.length; t++)
				this.gatherSaveFields(c[t],fields);
		}
	}
};

Story.prototype.hasChanges = function(title)
{
	var e = document.getElementById(this.idPrefix + title);
	if(e != null) {
		var fields = {};
		this.gatherSaveFields(e,fields);
		var tiddler = store.fetchTiddler(title);
		if(!tiddler)
			return false;
		for(var n in fields) {
			if(store.getValue(title,n) != fields[n])
				return true;
		}
	}
	return false;
};

Story.prototype.saveTiddler = function(title,minorUpdate)
{
	var tiddlerElem = document.getElementById(this.idPrefix + title);
	if(tiddlerElem != null) {
		var fields = {};
		this.gatherSaveFields(tiddlerElem,fields);
		var newTitle = fields.title ? fields.title : title;
		if(store.tiddlerExists(newTitle) && newTitle != title) {
			if(!confirm(config.messages.overwriteWarning.format([newTitle.toString()])))
				return null;
		}
		if(newTitle != title)
			this.closeTiddler(newTitle,false);
		tiddlerElem.id = this.idPrefix + newTitle;
		tiddlerElem.setAttribute("tiddler",newTitle);
		tiddlerElem.setAttribute("template",DEFAULT_VIEW_TEMPLATE);
		tiddlerElem.setAttribute("dirty","false");
		if(config.options.chkForceMinorUpdate)
			minorUpdate = !minorUpdate;
		if(!store.tiddlerExists(newTitle))
			minorUpdate = false;
		var newDate = new Date();
		var extendedFields = store.tiddlerExists(newTitle) ? store.fetchTiddler(newTitle).fields : (newTitle!=title && store.tiddlerExists(title) ? store.fetchTiddler(title).fields : {});
		for(var n in fields) {
			if(!TiddlyWiki.isStandardField(n))
				extendedFields[n] = fields[n];
		}
		var tiddler = store.saveTiddler(title,newTitle,fields.text,minorUpdate ? undefined : config.options.txtUserName,minorUpdate ? undefined : newDate,fields.tags,extendedFields);
		autoSaveChanges(null,[tiddler]);
		return newTitle;
	}
	return null;
};

Story.prototype.permaView = function()
{
	var links = [];
	this.forEachTiddler(function(title,element) {
		links.push(String.encodeTiddlyLink(title));
	});
	var t = encodeURIComponent(links.join(" "));
	if(t == "")
		t = "#";
	if(window.location.hash != t)
		window.location.hash = t;
};

//--
//-- Backstage
//--

var backstage = {
	area: null,
	toolbar: null,
	button: null,
	showButton: null,
	hideButton: null,
	cloak: null,
	panel: null,
	panelBody: null,
	panelFooter: null,
	currTabName: null,
	currTabElem: null,
	content: null,

	init: function() {
		var cmb = config.messages.backstage;
		this.area = document.getElementById("backstageArea");
		this.toolbar = document.getElementById("backstageToolbar");
		this.button = document.getElementById("backstageButton");
		this.button.style.display = "block";
		var t = cmb.open.text + " " + glyph("bentArrowLeft");
		this.showButton = createTiddlyButton(this.button,t,cmb.open.tooltip,
						function (e) {backstage.show(); return false;},null,"backstageShow");
		t = glyph("bentArrowRight") + " " + cmb.close.text;
		this.hideButton = createTiddlyButton(this.button,t,cmb.close.tooltip,
						function (e) {backstage.hide(); return false;},null,"backstageHide");
		this.cloak = document.getElementById("backstageCloak");
		this.panel = document.getElementById("backstagePanel");
		this.panelFooter = createTiddlyElement(this.panel,"div",null,"backstagePanelFooter");
		this.panelBody = createTiddlyElement(this.panel,"div",null,"backstagePanelBody");
		this.cloak.onmousedown = function(e) {
			backstage.switchTab(null);
		};
		createTiddlyText(this.toolbar,cmb.prompt);
		for(t=0; t<config.backstageTasks.length; t++) {
			var taskName = config.backstageTasks[t];
			var task = config.tasks[taskName];
			var handler = task.action ? this.onClickCommand : this.onClickTab;
			var text = task.text + (task.action ? "" : glyph("downTriangle"));
			var btn = createTiddlyButton(this.toolbar,text,task.tooltip,handler,"backstageTab");
			btn.setAttribute("task",taskName);
			addClass(btn,task.action ? "backstageAction" : "backstageTask");
			}
		this.content = document.getElementById("contentWrapper");
		if(config.options.chkBackstage)
			this.show();
		else
			this.hide();
	},

	isVisible: function () {
		return this.area ? this.area.style.display == "block" : false;
	},

	show: function() {
		this.area.style.display = "block";
		if(anim && config.options.chkAnimate) {
			backstage.toolbar.style.left = findWindowWidth() + "px";
			var p = [
				{style: "left", start: findWindowWidth(), end: 0, template: "%0px"}
			];
			anim.startAnimating(new Morpher(backstage.toolbar,config.animDuration,p));
		} else {
			backstage.area.style.left = "0px";
		}
		this.showButton.style.display = "none";
		this.hideButton.style.display = "block";
		config.options.chkBackstage = true;
		saveOptionCookie("chkBackstage");
		addClass(this.content,"backstageVisible");
	},

	hide: function() {
		if(this.currTabElem) {
			this.switchTab(null);
		} else {
			backstage.toolbar.style.left = "0px";
			if(anim && config.options.chkAnimate) {
				var p = [
					{style: "left", start: 0, end: findWindowWidth(), template: "%0px"}
				];
				var c = function(element,properties) {backstage.area.style.display = "none";};
				anim.startAnimating(new Morpher(backstage.toolbar,config.animDuration,p,c));
			} else {
				this.area.style.display = "none";
			}
			this.showButton.style.display = "block";
			this.hideButton.style.display = "none";
			config.options.chkBackstage = false;
			saveOptionCookie("chkBackstage");
			removeClass(this.content,"backstageVisible");
		}
	},

	onClickCommand: function(e) {
		var task = config.tasks[this.getAttribute("task")];
		displayMessage(task);
		if(task.action) {
			backstage.switchTab(null);
			task.action();
		}
		return false;
	},

	onClickTab: function(e) {
		backstage.switchTab(this.getAttribute("task"));
		return false;
	},

	// Switch to a given tab, or none if null is passed
	switchTab: function(tabName) {
		var tabElem = null;
		var e = this.toolbar.firstChild;
		while(e)
			{
			if(e.getAttribute && e.getAttribute("task") == tabName)
				tabElem = e;
			e = e.nextSibling;
			}
		if(tabName == backstage.currTabName)
			return;
		if(backstage.currTabElem) {
			removeClass(this.currTabElem,"backstageSelTab");
		}
		if(tabElem && tabName) {
			backstage.preparePanel();
			addClass(tabElem,"backstageSelTab");
			var task = config.tasks[tabName];
			wikify(task.content,backstage.panelBody,null,null);
			backstage.showPanel();
		} else if(backstage.currTabElem) {
			backstage.hidePanel();
		}
		backstage.currTabName = tabName;
		backstage.currTabElem = tabElem;
	},

	isPanelVisible: function() {
		return backstage.panel ? backstage.panel.style.display == "block" : false;
	},

	preparePanel: function() {
		backstage.cloak.style.height = findWindowHeight() + "px";
		backstage.cloak.style.display = "block";
		removeChildren(backstage.panelBody);
		return backstage.panelBody;
	},

	showPanel: function() {
		backstage.panel.style.display = "block";
		if(anim && config.options.chkAnimate) {
			backstage.panel.style.top = (-backstage.panel.offsetHeight) + "px";
			var p = [
				{style: "top", start: -backstage.panel.offsetHeight, end: 0, template: "%0px"}
			];
			anim.startAnimating(new Morpher(backstage.panel,config.animDuration,p),new Scroller(backstage.panel,false));
		} else {
			backstage.panel.style.top = "0px";
		}
		return backstage.panelBody;
	},

	hidePanel: function() {
		backstage.currTabName = null;
		backstage.currTabElem = null;
		if(anim && config.options.chkAnimate) {
			var p = [
				{style: "top", start: 0, end: -(backstage.panel.offsetHeight), template: "%0px"},
				{style: "display", atEnd: "none"}
			];
			var c = function(element,properties) {backstage.cloak.style.display = "none";};
			anim.startAnimating(new Morpher(backstage.panel,config.animDuration,p,c));
		 } else {
			backstage.panel.style.display = "none";
			backstage.cloak.style.display = "none";
		}
	}
};

config.macros.backstage = {};

config.macros.backstage.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var backstageTask = config.tasks[params[0]];
	if(backstageTask)
		createTiddlyButton(place,backstageTask.text,backstageTask.tooltip,function(e) {backstage.switchTab(params[0]); return false;});
};

//--
//-- ImportTiddlers macro
//--

config.macros.importTiddlers.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(readOnly) {
		createTiddlyElement(place,"div",null,"marked",this.readOnlyWarning);
		return;
	}
	var w = new Wizard();
	w.createWizard(place,this.wizardTitle);
	this.restart(w);
};

config.macros.importTiddlers.onCancel = function(e)
{
	var wizard = new Wizard(this);
	var place = wizard.clear();
	config.macros.importTiddlers.restart(wizard);
	return false;
};

config.macros.importTiddlers.restart = function(wizard)
{
	wizard.addStep(this.step1Title,this.step1Html);
	var s = wizard.getElement("selTypes");
	for(var t in config.adaptors) {
		var e = createTiddlyElement(s,"option",null,null,t);
		e.value = t;
	}
	s = wizard.getElement("selFeeds");
	var feeds = this.getFeeds();
	for(t in feeds) {
		e = createTiddlyElement(s,"option",null,null,t);
		e.value = t;
	}
	wizard.setValue("feeds",feeds);
	s.onchange = config.macros.importTiddlers.onFeedChange;
	var fileInput = wizard.getElement("txtBrowse");
	fileInput.onchange = config.macros.importTiddlers.onBrowseChange;
	fileInput.onkeyup = config.macros.importTiddlers.onBrowseChange;
	wizard.setButtons([{caption: this.openLabel, tooltip: this.openPrompt, onClick: config.macros.importTiddlers.onOpen}]);
};

config.macros.importTiddlers.getFeeds = function()
{
	var feeds = {};
	var tagged = store.getTaggedTiddlers("systemServer","title");
	for(var t=0; t<tagged.length; t++) {
		var title = tagged[t].title;
		var serverType = store.getTiddlerSlice(title,"Type");
		if(!serverType)
			serverType = "file";
		feeds[title] = {title: title,
						url: store.getTiddlerSlice(title,"URL"),
						workspace: store.getTiddlerSlice(title,"Workspace"),
						workspaceList: store.getTiddlerSlice(title,"WorkspaceList"),
						tiddlerFilter: store.getTiddlerSlice(title,"TiddlerFilter"),
						serverType: serverType,
						description: store.getTiddlerSlice(title,"Description")};
	}
	return feeds;
};

config.macros.importTiddlers.onFeedChange = function(e)
{
	var wizard = new Wizard(this);
	var selTypes = wizard.getElement("selTypes");
	var fileInput = wizard.getElement("txtPath");
	var feeds = wizard.getValue("feeds");
	var f = feeds[this.value];
	if(f) {
		selTypes.value = f.serverType;
		fileInput.value = f.url;
		this.selectedIndex = 0;
		wizard.setValue("feedName",f.serverType);
		wizard.setValue("feedHost",f.url);
		wizard.setValue("feedWorkspace",f.workspace);
		wizard.setValue("feedWorkspaceList",f.workspaceList);
		wizard.setValue("feedTiddlerFilter",f.tiddlerFilter);
	}
	return false;
};

config.macros.importTiddlers.onBrowseChange = function(e)
{
	var wizard = new Wizard(this);
	var fileInput = wizard.getElement("txtPath");
	fileInput.value = "file://" + this.value;
	var serverType = wizard.getElement("selTypes");
	serverType.value = "file";
	return false;
};

config.macros.importTiddlers.onOpen = function(e)
{
	var wizard = new Wizard(this);
	var fileInput = wizard.getElement("txtPath");
	var url = fileInput.value;
	var serverType = wizard.getElement("selTypes").value;
	var adaptor = new config.adaptors[serverType];
	wizard.setValue("adaptor",adaptor);
	wizard.setValue("serverType",serverType);
	wizard.setValue("host",url);
	var ret = adaptor.openHost(url,null,wizard,config.macros.importTiddlers.onOpenHost);
	if(ret !== true)
		displayMessage(ret);
	wizard.setButtons([{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel}],config.macros.importTiddlers.statusOpenHost);
	return false;
};

config.macros.importTiddlers.onOpenHost = function(context,wizard)
{
	var adaptor = wizard.getValue("adaptor");
	if(context.status !== true)
		displayMessage("Error in importTiddlers.onOpenHost: " + context.statusText);
	var ret = adaptor.getWorkspaceList(context,wizard,config.macros.importTiddlers.onGetWorkspaceList);
	if(ret !== true)
		displayMessage(ret);
	wizard.setButtons([{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel}],config.macros.importTiddlers.statusGetWorkspaceList);
};

config.macros.importTiddlers.onGetWorkspaceList = function(context,wizard)
{
	if(context.status !== true)
		displayMessage("Error in importTiddlers.onGetWorkspaceList: " + context.statusText);
	wizard.addStep(config.macros.importTiddlers.step2Title,config.macros.importTiddlers.step2Html);
	var s = wizard.getElement("selWorkspace");
	s.onchange = config.macros.importTiddlers.onWorkspaceChange;
	for(var t=0; t<context.workspaces.length; t++) {
		var e = createTiddlyElement(s,"option",null,null,context.workspaces[t].title);
		e.value = context.workspaces[t].title;
	}
	var workspaceList = wizard.getValue("feedWorkspaceList");
	if(workspaceList) {
		var list = workspaceList.parseParams("workspace",null,false,true);
		for(var n=1; n<list.length; n++) {
			if(context.workspaces.findByField("title",list[n].value) == null) {
				e = createTiddlyElement(s,"option",null,null,list[n].value);
				e.value = list[n].value;
			}
		}
	}
	var workspace = wizard.getValue("feedWorkspace");
	if(workspace) {
		t = wizard.getElement("txtWorkspace");
		t.value = workspace;
	}
	wizard.setValue("context",context);
	wizard.setButtons([{caption: config.macros.importTiddlers.openLabel, tooltip: config.macros.importTiddlers.openPrompt, onClick: config.macros.importTiddlers.onChooseWorkspace}]);
};

config.macros.importTiddlers.onWorkspaceChange = function(e)
{
	var wizard = new Wizard(this);
	var t = wizard.getElement("txtWorkspace");
	t.value  = this.value;
	this.selectedIndex = 0;
	return false;
};

config.macros.importTiddlers.onChooseWorkspace = function(e)
{
	var wizard = new Wizard(this);
	var adaptor = wizard.getValue("adaptor");
	var workspace = wizard.getElement("txtWorkspace").value;
	wizard.setValue("workspace",workspace);
	var context = wizard.getValue("context");
	var ret = adaptor.openWorkspace(workspace,context,wizard,config.macros.importTiddlers.onOpenWorkspace);
	if(ret !== true)
		displayMessage(ret);
	wizard.setButtons([{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel}],config.macros.importTiddlers.statusOpenWorkspace);
	return false;
};

config.macros.importTiddlers.onOpenWorkspace = function(context,wizard)
{
	if(context.status !== true)
		displayMessage("Error in importTiddlers.onOpenWorkspace: " + context.statusText);
	var adaptor = wizard.getValue("adaptor");
	var ret = adaptor.getTiddlerList(context,wizard,config.macros.importTiddlers.onGetTiddlerList,wizard.getValue("feedTiddlerFilter"));
	if(ret !== true)
		displayMessage(ret);
	wizard.setButtons([{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel}],config.macros.importTiddlers.statusGetTiddlerList);
};

config.macros.importTiddlers.onGetTiddlerList = function(context,wizard)
{
	if(context.status !== true)
		displayMessage("Error in importTiddlers.onGetTiddlerList: " + context.statusText);
	// Extract data for the listview
	var listedTiddlers = [];
	if(context.tiddlers) {
		for(var n=0; n<context.tiddlers.length; n++) {
			var tiddler = context.tiddlers[n];
			listedTiddlers.push({
				title: tiddler.title,
				modified: tiddler.modified,
				modifier: tiddler.modifier,
				text: tiddler.text ? wikifyPlainText(tiddler.text,100) : "",
				tags: tiddler.tags,
				size: tiddler.text ? tiddler.text.length : 0,
				tiddler: tiddler
			});
		}
	}
	listedTiddlers.sort(function(a,b) {return a.title < b.title ? -1 : (a.title == b.title ? 0 : +1);});
	// Display the listview
	wizard.addStep(config.macros.importTiddlers.step3Title,config.macros.importTiddlers.step3Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	var listView = ListView.create(listWrapper,listedTiddlers,config.macros.importTiddlers.listViewTemplate);
	wizard.setValue("listView",listView);
	var txtSaveTiddler = wizard.getElement("txtSaveTiddler");
	txtSaveTiddler.value = config.macros.importTiddlers.generateSystemServerName(wizard);
	wizard.setButtons([
			{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel},
			{caption: config.macros.importTiddlers.importLabel, tooltip: config.macros.importTiddlers.importPrompt, onClick:  config.macros.importTiddlers.doImport}
		]);
};

config.macros.importTiddlers.generateSystemServerName = function(wizard)
{
	var serverType = wizard.getValue("serverType");
	var host = wizard.getValue("host");
	var workspace = wizard.getValue("workspace");
	var pattern = config.macros.importTiddlers[workspace ? "systemServerNamePattern" : "systemServerNamePatternNoWorkspace"];
	return pattern.format([serverType,host,workspace]);
};

config.macros.importTiddlers.saveServerTiddler = function(wizard)
{
	var txtSaveTiddler = wizard.getElement("txtSaveTiddler").value;
	if(store.tiddlerExists(txtSaveTiddler)) {
		if(!confirm(config.macros.importTiddlers.confirmOverwriteSaveTiddler.format([txtSaveTiddler])))
			return;
		store.suspendNotifications();
		store.removeTiddler(txtSaveTiddler);
		store.resumeNotifications();
	}
	var serverType = wizard.getValue("serverType");
	var host = wizard.getValue("host");
	var workspace = wizard.getValue("workspace");
	var text = config.macros.importTiddlers.serverSaveTemplate.format([serverType,host,workspace]);
	store.saveTiddler(txtSaveTiddler,txtSaveTiddler,text,config.macros.importTiddlers.serverSaveModifier,new Date(),["systemServer"]);
};

config.macros.importTiddlers.doImport = function(e)
{
	var wizard = new Wizard(this);
	if(wizard.getElement("chkSave").checked)
		config.macros.importTiddlers.saveServerTiddler(wizard);
	var chkSync = wizard.getElement("chkSync").checked;
	wizard.setValue("sync",chkSync);
	var listView = wizard.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	var adaptor = wizard.getValue("adaptor");
	var overwrite = new Array();
	var t;
	for(t=0; t<rowNames.length; t++) {
		if(store.tiddlerExists(rowNames[t]))
			overwrite.push(rowNames[t]);
	}
	if(overwrite.length > 0) {
		if(!confirm(config.macros.importTiddlers.confirmOverwriteText.format([overwrite.join(", ")])))
			return false;
	}
	wizard.addStep(config.macros.importTiddlers.step4Title.format([rowNames.length]),config.macros.importTiddlers.step4Html);
	for(t=0; t<rowNames.length; t++) {
		var link = document.createElement("div");
		createTiddlyLink(link,rowNames[t],true);
		var place = wizard.getElement("markReport");
		place.parentNode.insertBefore(link,place);
	}
	wizard.setValue("remainingImports",rowNames.length);
	wizard.setButtons([
			{caption: config.macros.importTiddlers.cancelLabel, tooltip: config.macros.importTiddlers.cancelPrompt, onClick: config.macros.importTiddlers.onCancel}
		],config.macros.importTiddlers.statusDoingImport);
	for(t=0; t<rowNames.length; t++) {
		var context = {};
		context.allowSynchronous = true;
		var inbound = adaptor.getTiddler(rowNames[t],context,wizard,config.macros.importTiddlers.onGetTiddler);
	}
	return false;
};

config.macros.importTiddlers.onGetTiddler = function(context,wizard)
{
	if(!context.status)
		displayMessage("Error in importTiddlers.onGetTiddler: " + context.statusText);
	var tiddler = context.tiddler;
	store.suspendNotifications();
	store.saveTiddler(tiddler.title, tiddler.title, tiddler.text, tiddler.modifier, tiddler.modified, tiddler.tags, tiddler.fields, true, tiddler.created);
	if(!wizard.getValue("sync")) {
		store.setValue(tiddler.title,'server',null);
	}
	store.resumeNotifications();
	if(!context.isSynchronous)
		store.notify(tiddler.title,true);
	var remainingImports = wizard.getValue("remainingImports")-1;
	wizard.setValue("remainingImports",remainingImports);
	if(remainingImports == 0) {
		if(context.isSynchronous) {
			store.notifyAll();
			refreshDisplay();
		}
		wizard.setButtons([
				{caption: config.macros.importTiddlers.doneLabel, tooltip: config.macros.importTiddlers.donePrompt, onClick: config.macros.importTiddlers.onCancel}
			],config.macros.importTiddlers.statusDoneImport);
		autoSaveChanges();
	}
};

//--
//-- Sync macro
//--

// Synchronisation handlers
config.syncers = {};

// Sync state.
var currSync = null;

// sync macro
config.macros.sync.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	if(!wikifier.isStatic)
		this.startSync(place);
};

config.macros.sync.startSync = function(place)
{
	if(currSync)
		config.macros.sync.cancelSync();
	currSync = {};
	currSync.syncList = this.getSyncableTiddlers();
	this.createSyncTasks();
	this.preProcessSyncableTiddlers();
	var wizard = new Wizard();
	currSync.wizard = wizard;
	wizard.createWizard(place,this.wizardTitle);
	wizard.addStep(this.step1Title,this.step1Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	currSync.listView = ListView.create(listWrapper,currSync.syncList,this.listViewTemplate);
	this.processSyncableTiddlers();
	wizard.setButtons([
			{caption: this.syncLabel, tooltip: this.syncPrompt, onClick: this.doSync}
		]);
};

config.macros.sync.getSyncableTiddlers = function()
{
	var list = [];
	store.forEachTiddler(function(title,tiddler) {
		var syncItem = {};
		syncItem.serverType = tiddler.getServerType();
		syncItem.serverHost = tiddler.fields['server.host'];
		syncItem.serverWorkspace = tiddler.fields['server.workspace'];
		syncItem.tiddler = tiddler;
		syncItem.title = tiddler.title;
		syncItem.isTouched = tiddler.isTouched();
		syncItem.selected = syncItem.isTouched;
		syncItem.syncStatus = config.macros.sync.syncStatusList[syncItem.isTouched ? "changedLocally" : "none"];
		syncItem.status = syncItem.syncStatus.text;
		if(syncItem.serverType && syncItem.serverHost)
			list.push(syncItem);
		});
	list.sort(function(a,b) {return a.title < b.title ? -1 : (a.title == b.title ? 0 : +1);});
	return list;
};

config.macros.sync.preProcessSyncableTiddlers = function()
{
	for(var t=0; t<currSync.syncList.length; t++) {
		si = currSync.syncList[t];
		var ti = si.syncTask.syncMachine.generateTiddlerInfo(si.tiddler);
		si.serverUrl = ti.uri;
	}
};

config.macros.sync.processSyncableTiddlers = function()
{
	for(var t=0; t<currSync.syncList.length; t++) {
		si = currSync.syncList[t];
		si.rowElement.style.backgroundColor = si.syncStatus.color;
	}
};

config.macros.sync.createSyncTasks = function()
{
	currSync.syncTasks = [];
	for(var t=0; t<currSync.syncList.length; t++) {
		var si = currSync.syncList[t];
		var r = null;
		for(var st=0; st<currSync.syncTasks.length; st++) {
			var cst = currSync.syncTasks[st];
			if(si.serverType == cst.serverType && si.serverHost == cst.serverHost && si.serverWorkspace == cst.serverWorkspace)
				r = cst;
		}
		if(r == null) {
			si.syncTask = this.createSyncTask(si);
			currSync.syncTasks.push(si.syncTask);
		} else {
			si.syncTask = r;
			r.syncItems.push(si);
		}
	}
};

config.macros.sync.createSyncTask = function(syncItem)
{
	var st = {};
	st.serverType = syncItem.serverType;
	st.serverHost = syncItem.serverHost;
	st.serverWorkspace = syncItem.serverWorkspace;
	st.syncItems = [syncItem];
	st.syncMachine = new SyncMachine(st.serverType,{
		start: function() {
			return this.openHost(st.serverHost,"openWorkspace");
		},
		openWorkspace: function() {
			return this.openWorkspace(st.serverWorkspace,"getTiddlerList");
		},
		getTiddlerList: function() {
			return this.getTiddlerList("gotTiddlerList");
		},
		gotTiddlerList: function(tiddlers) {
			for(var t=0; t<st.syncItems.length; t++) {
				var si = st.syncItems[t];
				var f = tiddlers.findByField("title",si.title);
				if(f !== null) {
					if(tiddlers[f].fields['server.page.revision'] > si.tiddler.fields['server.page.revision']) {
						si.syncStatus = config.macros.sync.syncStatusList[si.isTouched ? 'changedBoth' : 'changedServer'];
					}
				} else {
					si.syncStatus = config.macros.sync.syncStatusList.notFound;
				}
				config.macros.sync.updateSyncStatus(si);
			}
		},
		getTiddler: function(title) {
			return this.getTiddler(title,"onGetTiddler");
		},
		onGetTiddler: function(tiddler) {
			var syncItem = st.syncItems.findByField("title",tiddler.title);
			if(syncItem !== null) {
				syncItem = st.syncItems[syncItem];
				store.saveTiddler(tiddler.title, tiddler.title, tiddler.text, tiddler.modifier, tiddler.modified, tiddler.tags, tiddler.fields, true, tiddler.created);
				syncItem.syncStatus = config.macros.sync.syncStatusList.gotFromServer;
				config.macros.sync.updateSyncStatus(syncItem);
			}
		},
		putTiddler: function(tiddler) {
			return this.putTiddler(tiddler,"onPutTiddler");
		},
		onPutTiddler: function(tiddler) {
			var syncItem = st.syncItems.findByField("title",tiddler.title);
			if(syncItem !== null) {
				syncItem = st.syncItems[syncItem];
				store.resetTiddler(tiddler.title);
				syncItem.syncStatus = config.macros.sync.syncStatusList.putToServer;
				config.macros.sync.updateSyncStatus(syncItem);
			}
		}
	});
	st.syncMachine.go();
	return st;
};

config.macros.sync.updateSyncStatus = function(syncItem)
{
	var e = syncItem.colElements["status"];
	removeChildren(e);
	createTiddlyText(e,syncItem.syncStatus.text);
	syncItem.rowElement.style.backgroundColor = syncItem.syncStatus.color;
};

config.macros.sync.doSync = function(e)
{
	var rowNames = ListView.getSelectedRows(currSync.listView);
	for(var t=0; t<currSync.syncList.length; t++) {
		var si = currSync.syncList[t];
		if(rowNames.indexOf(si.title) != -1) {
			config.macros.sync.doSyncItem(si);
		}
	}
	return false;
};

config.macros.sync.doSyncItem = function(syncItem)
{
	var r = true;
	var sl = config.macros.sync.syncStatusList;
	switch(syncItem.syncStatus) {
		case sl.changedServer:
			r = syncItem.syncTask.syncMachine.go("getTiddler",syncItem.title);
			break;
		case sl.notFound:
		case sl.changedLocally:
		case sl.changedBoth:
			r = syncItem.syncTask.syncMachine.go("putTiddler",syncItem.tiddler);
			break;
		default:
			break;
	}
	if(r !== true)
		displayMessage("Error in doSyncItem: " + r);
};

config.macros.sync.cancelSync = function()
{
	currSync = null;
};

function SyncMachine(serverType,steps)
{
	this.serverType = serverType;
	this.adaptor = new config.adaptors[serverType];
	this.steps = steps;
}

SyncMachine.prototype.go = function(step,varargs)
{
	if(!step)
		step = "start";
	var h = this.steps[step];
	if(!h)
		return null;
	var a = [];
	for(var t=1; t<arguments.length; t++)
		a.push(arguments[t]);
	var r = h.apply(this,a);
	if(typeof r == "string")
		this.invokeError(r);
	return r;
};

SyncMachine.prototype.invokeError = function(message)
{
	if(this.steps.error)
		this.steps.error(message);
};

SyncMachine.prototype.openHost = function(host,nextStep)
{
	var me = this;
	return me.adaptor.openHost(host,null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep);
	});
};

SyncMachine.prototype.getWorkspaceList = function(nextStep)
{
	var me = this;
	return me.adaptor.getWorkspaceList(null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep,context.workspaces);
	});
};

SyncMachine.prototype.openWorkspace = function(workspace,nextStep)
{
	var me = this;
	return me.adaptor.openWorkspace(workspace,null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep);
	});
};

SyncMachine.prototype.getTiddlerList = function(nextStep)
{
	var me = this;
	return me.adaptor.getTiddlerList(null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep,context.tiddlers);
	});
};

SyncMachine.prototype.generateTiddlerInfo = function(tiddler)
{
	return this.adaptor.generateTiddlerInfo(tiddler);
};

SyncMachine.prototype.getTiddler = function(title,nextStep)
{
	var me = this;
	return me.adaptor.getTiddler(title,null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep,context.tiddler);
	});
};

SyncMachine.prototype.putTiddler = function(tiddler,nextStep)
{
	var me = this;
	return me.adaptor.putTiddler(tiddler,null,null,function(context) {
		if(typeof context.status == "string")
			me.invokeError(context.status);
		else
			me.go(nextStep,tiddler);
	});
};

//--
//-- Manager UI for groups of tiddlers
//--

config.macros.plugins.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	var wizard = new Wizard();
	wizard.createWizard(place,this.wizardTitle);
	wizard.addStep(this.step1Title,this.step1Html);
	var markList = wizard.getElement("markList");
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	listWrapper.setAttribute("refresh","macro");
	listWrapper.setAttribute("macroName","plugins");
	listWrapper.setAttribute("params",paramString);
	this.refresh(listWrapper,paramString);
};

config.macros.plugins.refresh = function(listWrapper,params)
{
	var wizard = new Wizard(listWrapper);
	var selectedRows = [];
	ListView.forEachSelector(listWrapper,function(e,rowName) {
			if(e.checked)
				selectedRows.push(e.getAttribute("rowName"));
		});
	removeChildren(listWrapper);
	params = params.parseParams("anon");
	var plugins = installedPlugins.slice(0);
	var t,tiddler,p;
	var configTiddlers = store.getTaggedTiddlers("systemConfig");
	for(t=0; t<configTiddlers.length; t++) {
		tiddler = configTiddlers[t];
		if(plugins.findByField("title",tiddler.title) == null) {
			p = getPluginInfo(tiddler);
			p.executed = false;
			p.log.splice(0,0,this.skippedText);
			plugins.push(p);
		}
	}
	for(t=0; t<plugins.length; t++) {
		p = plugins[t];
		p.size = p.tiddler.text ? p.tiddler.text.length : 0;
		p.forced = p.tiddler.isTagged("systemConfigForce");
		p.disabled = p.tiddler.isTagged("systemConfigDisable");
		p.Selected = selectedRows.indexOf(plugins[t].title) != -1;
	}
	if(plugins.length == 0) {
		createTiddlyElement(listWrapper,"em",null,null,this.noPluginText);
		wizard.setButtons([]);
	} else {
		var listView = ListView.create(listWrapper,plugins,this.listViewTemplate,this.onSelectCommand);
		wizard.setValue("listView",listView);
		wizard.setButtons([
				{caption: config.macros.plugins.removeLabel, tooltip: config.macros.plugins.removePrompt, onClick:  config.macros.plugins.doRemoveTag},
				{caption: config.macros.plugins.deleteLabel, tooltip: config.macros.plugins.deletePrompt, onClick:  config.macros.plugins.doDelete}
			]);
	}
};

config.macros.plugins.doRemoveTag = function(e)
{
	var wizard = new Wizard(this);
	var listView = wizard.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	if(rowNames.length == 0) {
		alert(config.messages.nothingSelected);
	} else {
		for(var t=0; t<rowNames.length; t++)
			store.setTiddlerTag(rowNames[t],false,"systemConfig");
	}
};

config.macros.plugins.doDelete = function(e)
{
	var wizard = new Wizard(this);
	var listView = wizard.getValue("listView");
	var rowNames = ListView.getSelectedRows(listView);
	if(rowNames.length == 0) {
		alert(config.messages.nothingSelected);
	} else {
		if(confirm(config.macros.plugins.confirmDeleteText.format([rowNames.join(", ")]))) {
			for(t=0; t<rowNames.length; t++) {
				store.removeTiddler(rowNames[t]);
				story.closeTiddler(rowNames[t],true);
			}
		}
	}
};

//--
//-- Message area
//--

function getMessageDiv()
{
	var msgArea = document.getElementById("messageArea");
	if(!msgArea)
		return null;
	if(!msgArea.hasChildNodes())
		createTiddlyButton(createTiddlyElement(msgArea,"div",null,"messageToolbar"),
			config.messages.messageClose.text,
			config.messages.messageClose.tooltip,
			clearMessage);
	msgArea.style.display = "block";
	return createTiddlyElement(msgArea,"div");
}

function displayMessage(text,linkText)
{
	var e = getMessageDiv();
	if(!e) {
		alert(text);
		return;
	}
	if(linkText) {
		var link = createTiddlyElement(e,"a",null,null,text);
		link.href = linkText;
		link.target = "_blank";
	} else {
		e.appendChild(document.createTextNode(text));
	}
}

function clearMessage()
{
	var msgArea = document.getElementById("messageArea");
	if(msgArea) {
		removeChildren(msgArea);
		msgArea.style.display = "none";
	}
	return false;
}

//--
//-- Refresh mechanism
//--

config.refreshers = {
	link: function(e,changeList)
		{
		var title = e.getAttribute("tiddlyLink");
		refreshTiddlyLink(e,title);
		return true;
		},

	tiddler: function(e,changeList)
		{
		var title = e.getAttribute("tiddler");
		var template = e.getAttribute("template");
		if(changeList && changeList.indexOf(title) != -1 && !story.isDirty(title))
			story.refreshTiddler(title,template,true);
		else
			refreshElements(e,changeList);
		return true;
		},

	content: function(e,changeList)
		{
		var title = e.getAttribute("tiddler");
		var force = e.getAttribute("force");
		if(force != null || changeList == null || changeList.indexOf(title) != -1) {
			removeChildren(e);
			wikify(store.getTiddlerText(title,title),e,null);
			return true;
		} else
			return false;
		},

	macro: function(e,changeList)
		{
		var macro = e.getAttribute("macroName");
		var params = e.getAttribute("params");
		if(macro)
			macro = config.macros[macro];
		if(macro && macro.refresh)
			macro.refresh(e,params);
		return true;
		}
};

function refreshElements(root,changeList)
{
	var nodes = root.childNodes;
	for(var c=0; c<nodes.length; c++) {
		var e = nodes[c], type = null;
		if(e.getAttribute  && (e.tagName ? e.tagName != "IFRAME" : true))
			type = e.getAttribute("refresh");
		var refresher = config.refreshers[type];
		var refreshed = false;
		if(refresher != undefined)
			refreshed = refresher(e,changeList);
		if(e.hasChildNodes() && !refreshed)
			refreshElements(e,changeList);
	}
}

function applyHtmlMacros(root,tiddler)
{
	var e = root.firstChild;
	while(e) {
		var nextChild = e.nextSibling;
		if(e.getAttribute) {
			var macro = e.getAttribute("macro");
			if(macro) {
				var params = "";
				var p = macro.indexOf(" ");
				if(p != -1) {
					params = macro.substr(p+1);
					macro = macro.substr(0,p);
				}
				invokeMacro(e,macro,params,null,tiddler);
			}
		}
		if(e.hasChildNodes())
			applyHtmlMacros(e,tiddler);
		e = nextChild;
	}
}

function refreshPageTemplate(title)
{
	var stash = createTiddlyElement(document.body,"div");
	stash.style.display = "none";
	var display = document.getElementById("tiddlerDisplay");
	var nodes,t;
	if(display) {
		nodes = display.childNodes;
		for(t=nodes.length-1; t>=0; t--)
			stash.appendChild(nodes[t]);
	}
	var wrapper = document.getElementById("contentWrapper");
	if(!title)
		title = "PageTemplate";
	var html = store.getRecursiveTiddlerText(title,null,10);
	wrapper.innerHTML = html;
	applyHtmlMacros(wrapper);
	refreshElements(wrapper);
	display = document.getElementById("tiddlerDisplay");
	removeChildren(display);
	if(!display)
		display = createTiddlyElement(wrapper,"div","tiddlerDisplay");
	nodes = stash.childNodes;
	for(t=nodes.length-1; t>=0; t--)
		display.appendChild(nodes[t]);
	removeNode(stash);
}

function refreshDisplay(hint)
{
	if(typeof hint == "string")
		hint = [hint];
	var e = document.getElementById("contentWrapper");
	refreshElements(e,hint);
	if(backstage.isPanelVisible()) {
		e = document.getElementById("backstage");
		refreshElements(e,hint);
	}
}

function refreshPageTitle()
{
	document.title = getPageTitle();
}

function getPageTitle()
{
	var st = wikifyPlain("SiteTitle");
	var ss = wikifyPlain("SiteSubtitle");
	return st + ((st == "" || ss == "") ? "" : " - ") + ss;
}

function refreshStyles(title,doc)
{
	if(!doc)
		doc = document;
	setStylesheet(title == null ? "" : store.getRecursiveTiddlerText(title,"",10),title,doc);
}

function refreshColorPalette(title)
{
	if(!startingUp)
		refreshAll();
}

function refreshAll()
{
	refreshPageTemplate();
	refreshDisplay();
	refreshStyles("StyleSheetLayout");
	refreshStyles("StyleSheetColors");
	refreshStyles("StyleSheet");
	refreshStyles("StyleSheetPrint");
}

//--
//-- Options stuff
//--

config.optionHandlers = {
	'txt': {
		get: function(name) {return encodeCookie(config.options[name].toString());},
		set: function(name,value) {config.options[name] = decodeCookie(value);}
	},
	'chk': {
		get: function(name) {return config.options[name] ? "true" : "false";},
		set: function(name,value) {config.options[name] = value == "true";}
	}
};

function loadOptionsCookie()
{
	if(safeMode)
		return;
	var cookies = document.cookie.split(";");
	for(var c=0; c<cookies.length; c++) {
		var p = cookies[c].indexOf("=");
		if(p != -1) {
			var name = cookies[c].substr(0,p).trim();
			var value = cookies[c].substr(p+1).trim();
			var optType = name.substr(0,3);
			if(config.optionHandlers[optType] && config.optionHandlers[optType].set)
				config.optionHandlers[optType].set(name,value);
		}
	}
}

function saveOptionCookie(name)
{
	if(safeMode)
		return;
	var c = name + "=";
	var optType = name.substr(0,3);
	if(config.optionHandlers[optType] && config.optionHandlers[optType].get)
		c += config.optionHandlers[optType].get(name);
	c += "; expires=Fri, 1 Jan 2038 12:00:00 UTC; path=/";
	document.cookie = c;
}

function encodeCookie(s)
{
	return escape(manualConvertUnicodeToUTF8(s));
}

function decodeCookie(s)
{
	s = unescape(s);
	var re = /&#[0-9]{1,5};/g;
	return s.replace(re,function($0) {return String.fromCharCode(eval($0.replace(/[&#;]/g,"")));});
}


config.macros.option.genericCreate = function(place,type,opt,className,desc)
{
	var typeInfo = config.macros.option.types[type];
	var c = document.createElement(typeInfo.elementType);
	if(typeInfo.typeValue)
		c.setAttribute("type",typeInfo.typeValue);
	c[typeInfo.eventName] = typeInfo.onChange;
	c.setAttribute("option",opt);
	if(className)
		c.className = className;
	else
		c.className = typeInfo.className;
	if(config.optionsDesc[opt])
		c.setAttribute("title",config.optionsDesc[opt]);
	place.appendChild(c);
	if(desc != "no")
		createTiddlyText(place,config.optionsDesc[opt] ? config.optionsDesc[opt] : opt);
	c[typeInfo.valueField] = config.options[opt];
	return c;
};

config.macros.option.genericOnChange = function(e)
{
	var opt = this.getAttribute("option");
	if(opt) {
		var optType = opt.substr(0,3);
		var handler = config.macros.option.types[optType];
		if (handler.elementType && handler.valueField)
			config.macros.option.propagateOption(opt,handler.valueField,this[handler.valueField],handler.elementType);
		}
	return true;
};

config.macros.option.types = {
	'txt': {
		elementType: "input",
		valueField: "value",
		eventName: "onkeyup",
		className: "txtOptionInput",
		create: config.macros.option.genericCreate,
		onChange: config.macros.option.genericOnChange
	},
	'chk': {
		elementType: "input",
		valueField: "checked",
		eventName: "onclick",
		className: "chkOptionInput",
		typeValue: "checkbox",
		create: config.macros.option.genericCreate,
		onChange: config.macros.option.genericOnChange
	}
};

config.macros.option.propagateOption = function(opt,valueField,value,elementType)
{
	config.options[opt] = value;
	saveOptionCookie(opt);
	var nodes = document.getElementsByTagName(elementType);
	for(var t=0; t<nodes.length; t++) {
		var optNode = nodes[t].getAttribute("option");
		if(opt == optNode)
			nodes[t][valueField] = value;
		}
};

config.macros.option.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	params = paramString.parseParams("anon",null,true,false,false);
	var opt = (params[1] && params[1].name == "anon") ? params[1].value : getParam(params,"name",null);
	var className = (params[2] && params[2].name == "anon") ? params[2].value : getParam(params,"class",null);
	var desc = getParam(params,"desc","no");
	var type = opt.substr(0,3);
	var h = config.macros.option.types[type];
	if (h && h.create)
		h.create(place,type,opt,className,desc);
};

config.macros.options.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	params = paramString.parseParams("anon",null,true,false,false);
	var showUnknown = getParam(params,"showUnknown","no");
	var wizard = new Wizard();
	wizard.createWizard(place,this.wizardTitle);
	wizard.addStep(this.step1Title,this.step1Html);
	var markList = wizard.getElement("markList");
	var chkUnknown = wizard.getElement("chkUnknown");
	chkUnknown.checked = showUnknown == "yes";
	chkUnknown.onchange = this.onChangeUnknown;
	var listWrapper = document.createElement("div");
	markList.parentNode.insertBefore(listWrapper,markList);
	wizard.setValue("listWrapper",listWrapper);
	this.refreshOptions(listWrapper,showUnknown == "yes");
};

config.macros.options.refreshOptions = function(listWrapper,showUnknown)
{
	var opts = [];
	for(var n in config.options) {
		var opt = {};
		opt.option = "";
		opt.name = n;
		opt.lowlight = !config.optionsDesc[n];
		opt.description = opt.lowlight ? this.unknownDescription : config.optionsDesc[n];
		if(!opt.lowlight || showUnknown)
			opts.push(opt);
	}
	opts.sort(function(a,b) {return a.name.substr(3) < b.name.substr(3) ? -1 : (a.name.substr(3) == b.name.substr(3) ? 0 : +1);});
	var listview = ListView.create(listWrapper,opts,this.listViewTemplate);
	for(n=0; n<opts.length; n++) {
		var type = opts[n].name.substr(0,3);
		var h = config.macros.option.types[type];
		if (h && h.create) {
			h.create(opts[n].colElements['option'],type,opts[n].name,null,"no");
		}
	}
};

config.macros.options.onChangeUnknown = function(e)
{
	var wizard = new Wizard(this);
	var listWrapper = wizard.getValue("listWrapper");
	removeChildren(listWrapper);
	config.macros.options.refreshOptions(listWrapper,this.checked);
	return false;
};
TiddlyWiki.prototype.allShadowsAsHtml = function()
{
	return shadows.getSaver().externalize(shadows, true);
}
//--
//-- Saving
//--
var saveUsingSafari = false;

var startSaveArea = '<div id="' + 'storeArea">'; // Split up into two so that indexOf() of this source doesn't find it
var endSaveArea = '</d' + 'iv>';
var startShadowArea = '<div id="' + 'shadowArea">'; // Split up into two so that indexOf() of this source doesn't find it
var endShadowArea = '</d' + 'iv>';

// If there are unsaved changes, force the user to confirm before exitting
function confirmExit()
{
	hadConfirmExit = true;
	if((store && store.isDirty && store.isDirty()) || (story && story.areAnyDirty && story.areAnyDirty()))
		return config.messages.confirmExit;
}

// Give the user a chance to save changes before exitting
function checkUnsavedChanges()
{
	if(store && store.isDirty && store.isDirty() && window.hadConfirmExit === false) {
		if(confirm(config.messages.unsavedChangesWarning))
			saveChanges();
	}
}

function updateLanguageAttribute(s)
{
	if(config.locale) {
		var mRE = /(<html(?:.*?)?)(?: xml:lang\="([a-z]+)")?(?: lang\="([a-z]+)")?>/;
		var m = mRE.exec(s);
		if(m) {
			var t = m[1];
			if(m[2])
				t += ' xml:lang="' + config.locale + '"';
			if(m[3])
				t += ' lang="' + config.locale + '"';
			t += ">";
			s = s.substr(0,m.index) + t + s.substr(m.index+m[0].length);
		}
	}
	return s;
}

function updateMarkupBlock(s,blockName,tiddlerName)
{
	return s.replaceChunk(
			"<!--%0-START-->".format([blockName]),
			"<!--%0-END-->".format([blockName]),
			"\n" + convertUnicodeToUTF8(store.getRecursiveTiddlerText(tiddlerName,"")) + "\n");
}

function updateOriginal(original,posDiv)
{
	if(!posDiv)
		posDiv = locateStoreArea(original);
	if(!posDiv) {
		alert(config.messages.invalidFileError.format([localPath]));
		return null;
	}
	var	posShadowDiv = locateShadowArea(original);
	if(!posShadowDiv) {
		alert(config.messages.invalidFileError.format([localPath]));
		return null;
	}
	var posPostShadow = original.indexOf("<"+"!--POST-SHADOWAREA--"+">");
	var revised = original.substr(0,posShadowDiv[0]) + startShadowArea + "\n" +
				convertUnicodeToUTF8(shadows.allShadowsAsHtml()) + "\n" +
				endShadowArea + "\n" + original.substring(posPostShadow,posDiv[0]) + startSaveArea + "\n" + 
				convertUnicodeToUTF8(store.allTiddlersAsHtml()) + "\n" +
				original.substr(posDiv[1]);
	var newSiteTitle = convertUnicodeToUTF8(getPageTitle()).htmlEncode();
	revised = revised.replaceChunk("<title"+">","</title"+">"," " + newSiteTitle + " ");
	revised = updateLanguageAttribute(revised);
	revised = updateMarkupBlock(revised,"PRE-HEAD","MarkupPreHead");
	revised = updateMarkupBlock(revised,"POST-HEAD","MarkupPostHead");
	revised = updateMarkupBlock(revised,"PRE-BODY","MarkupPreBody");
	revised = updateMarkupBlock(revised,"POST-SCRIPT","MarkupPostBody");
	return revised;
}

function locateStoreArea(original)
{
	// Locate the storeArea div's
	var posOpeningDiv = original.indexOf(startSaveArea);
	var limitClosingDiv = original.indexOf("<"+"!--POST-STOREAREA--"+">");
	if(limitClosingDiv == -1)
		limitClosingDiv = original.indexOf("<"+"!--POST-BODY-START--"+">");
	var posClosingDiv = original.lastIndexOf(endSaveArea, limitClosingDiv == -1 ? original.length : limitClosingDiv);
	return (posOpeningDiv != -1 && posClosingDiv != -1) ? [posOpeningDiv,posClosingDiv] : null;
}
function locateShadowArea(original)
{
	// Locate the ShadowArea
	var posDiv = locateStoreArea(original);
	if (!posDiv) return null;
	var posOpeningShadowDiv = original.indexOf(startShadowArea);
	var limitClosingShadowDiv = original.indexOf(startSaveArea);
//	var posClosingShadowDiv = posDiv[0]-endShadowArea.length;
	var posClosingShadowDiv = original.lastIndexOf(endShadowArea,limitClosingShadowDiv == -1 ? original.length : limitClosingShadowDiv);
	return (posOpeningShadowDiv != -1 && posClosingShadowDiv != -1) ? [posOpeningShadowDiv,posClosingShadowDiv] : null;
}
function autoSaveChanges(onlyIfDirty,tiddlers)
{
	if(config.options.chkAutoSave)
		saveChanges(onlyIfDirty,tiddlers);
}

// Save this tiddlywiki with the pending changes
function saveChanges(onlyIfDirty,tiddlers)
{
	if(onlyIfDirty && !store.isDirty())
		return;
	clearMessage();
	// Get the URL of the document
	var originalPath = document.location.toString();
	// Check we were loaded from a file URL
	if(originalPath.substr(0,5) != "file:") {
		alert(config.messages.notFileUrlError);
		if(store.tiddlerExists(config.messages.saveInstructions))
			story.displayTiddler(null,config.messages.saveInstructions);
		return;
	}
	var localPath = getLocalPath(originalPath);
	// Load the original file
	var original = loadFile(localPath);
	if(original == null) {
		alert(config.messages.cantSaveError);
		if(store.tiddlerExists(config.messages.saveInstructions))
			story.displayTiddler(null,config.messages.saveInstructions);
		return;
	}
	// Locate the storeArea div's
	var posDiv = locateStoreArea(original);
	if(!posDiv) {
		alert(config.messages.invalidFileError.format([localPath]));
		return;
	}
	// Locate the shadowArea div's
	var	posShadowDiv = locateShadowArea(original);
	if(!posShadowDiv){
		alert(config.messages.invalidFileError.format([localPath]));
		return;
	}
	saveBackup(localPath,original);
	saveRss(localPath);
	saveEmpty(localPath,original,posDiv);
	saveMain(localPath,original,posDiv);
}

function saveBackup(localPath,original)
{
	// Save the backup
	if(config.options.chkSaveBackups) {
		var backupPath = getBackupPath(localPath);
		var backup = config.browser.isIE ? ieCopyFile(backupPath,localPath) : saveFile(backupPath,original);
		if(backup)
			displayMessage(config.messages.backupSaved,"file://" + backupPath);
		else
			alert(config.messages.backupFailed);
	}
}

function saveRss(localPath)
{
	if(config.options.chkGenerateAnRssFeed) {
		var rssPath = localPath.substr(0,localPath.lastIndexOf(".")) + ".xml";
		var rssSave = saveFile(rssPath,convertUnicodeToUTF8(generateRss()));
		if(rssSave)
			displayMessage(config.messages.rssSaved,"file://" + rssPath);
		else
			alert(config.messages.rssFailed);
	}
}

function saveEmpty(localPath,original,posDiv)
{
	if(config.options.chkSaveEmptyTemplate) {
		var emptyPath,p;
		if((p = localPath.lastIndexOf("/")) != -1)
			emptyPath = localPath.substr(0,p) + "/empty.html";
		else if((p = localPath.lastIndexOf("\\")) != -1)
			emptyPath = localPath.substr(0,p) + "\\empty.html";
		else
			emptyPath = localPath + ".empty.html";
		var	posShadowDiv = locateShadowArea(original);
		if(!posShadowDiv) {
			alert(config.messages.invalidFileError.format([localPath]));
			return;
		}
		var posPostShadow = original.indexOf("<"+"!--POST-SHADOWAREA--"+">");
		var empty = original.substr(0,posShadowDiv[0]) + startShadowArea+ "\n" +
					convertUnicodeToUTF8(shadows.allShadowsAsHtml()) + "\n" +
					endShadowArea + "\n" + original.substring(posPostShadow,posDiv[0]) + startSaveArea + "\n" + 
					original.substr(posDiv[1]);
		var emptySave = saveFile(emptyPath,empty);
		if(emptySave)
			displayMessage(config.messages.emptySaved,"file://" + emptyPath);
		else
			alert(config.messages.emptyFailed);
	}
}

function saveMain(localPath,original,posDiv)
{
	var save;
	try {
		var revised = updateOriginal(original,posDiv);
		save = saveFile(localPath,revised);
	} catch (ex) {
		showException(ex);
	}
	if(save) {
		displayMessage(config.messages.mainSaved,"file://" + localPath);
		store.setDirty(false);
	} else {
		alert(config.messages.mainFailed);
	}
}

function getLocalPath(origPath)
{
	var originalPath = convertUriToUTF8(origPath,config.options.txtFileSystemCharSet);
	// Remove any location or query part of the URL
	var argPos = originalPath.indexOf("?");
	if(argPos != -1)
		originalPath = originalPath.substr(0,argPos);
	var hashPos = originalPath.indexOf("#");
	if(hashPos != -1)
		originalPath = originalPath.substr(0,hashPos);
	// Convert file://localhost/ to file:///
	if(originalPath.indexOf("file://localhost/") == 0)
		originalPath = "file://" + originalPath.substr(16);
	// Convert to a native file format
	var localPath;
	if(originalPath.charAt(9) == ":") // pc local file
		localPath = unescape(originalPath.substr(8)).replace(new RegExp("/","g"),"\\");
	else if(originalPath.indexOf("file://///") == 0) // FireFox pc network file
		localPath = "\\\\" + unescape(originalPath.substr(10)).replace(new RegExp("/","g"),"\\");
	else if(originalPath.indexOf("file:///") == 0) // mac/unix local file
		localPath = unescape(originalPath.substr(7));
	else if(originalPath.indexOf("file:/") == 0) // mac/unix local file
		localPath = unescape(originalPath.substr(5));
	else // pc network file
		localPath = "\\\\" + unescape(originalPath.substr(7)).replace(new RegExp("/","g"),"\\");
	return localPath;
}

function getBackupPath(localPath)
{
	var backSlash = true;
	var dirPathPos = localPath.lastIndexOf("\\");
	if(dirPathPos == -1) {
		dirPathPos = localPath.lastIndexOf("/");
		backSlash = false;
	}
	var backupFolder = config.options.txtBackupFolder;
	if(!backupFolder || backupFolder == "")
		backupFolder = ".";
	var backupPath = localPath.substr(0,dirPathPos) + (backSlash ? "\\" : "/") + backupFolder + localPath.substr(dirPathPos);
	backupPath = backupPath.substr(0,backupPath.lastIndexOf(".")) + "." + (new Date()).convertToYYYYMMDDHHMMSSMMM() + ".html";
	return backupPath;
}

function generateRss()
{
	var s = [];
	var d = new Date();
	var u = store.getTiddlerText("SiteUrl");
	// Assemble the header
	s.push("<" + "?xml version=\"1.0\"?" + ">");
	s.push("<rss version=\"2.0\">");
	s.push("<channel>");
	s.push("<title" + ">" + wikifyPlain("SiteTitle").htmlEncode() + "</title" + ">");
	if(u)
		s.push("<link>" + u.htmlEncode() + "</link>");
	s.push("<description>" + wikifyPlain("SiteSubtitle").htmlEncode() + "</description>");
	s.push("<language>en-us</language>");
	s.push("<copyright>Copyright " + d.getFullYear() + " " + config.options.txtUserName.htmlEncode() + "</copyright>");
	s.push("<pubDate>" + d.toGMTString() + "</pubDate>");
	s.push("<lastBuildDate>" + d.toGMTString() + "</lastBuildDate>");
	s.push("<docs>http://blogs.law.harvard.edu/tech/rss</docs>");
	s.push("<generator>TiddlyWiki " + version.major + "." + version.minor + "." + version.revision + "</generator>");
	// The body
	var tiddlers = store.getTiddlers("modified","excludeLists");
	var n = config.numRssItems > tiddlers.length ? 0 : tiddlers.length-config.numRssItems;
	for (var t=tiddlers.length-1; t>=n; t--)
		s.push(tiddlers[t].saveToRss(u));
	// And footer
	s.push("</channel>");
	s.push("</rss>");
	// Save it all
	return s.join("\n");
}

//--
//-- Filesystem code
//--

function convertUTF8ToUnicode(u)
{
	return window.netscape == undefined ? manualConvertUTF8ToUnicode(u) : mozConvertUTF8ToUnicode(u);
}

function manualConvertUTF8ToUnicode(utf)
{
	var uni = utf;
	var src = 0;
	var dst = 0;
	var b1, b2, b3;
	var c;
	while(src < utf.length) {
		b1 = utf.charCodeAt(src++);
		if(b1 < 0x80) {
			dst++;
		} else if(b1 < 0xE0) {
			b2 = utf.charCodeAt(src++);
			c = String.fromCharCode(((b1 & 0x1F) << 6) | (b2 & 0x3F));
			uni = uni.substring(0,dst++).concat(c,utf.substr(src));
		} else {
			b2 = utf.charCodeAt(src++);
			b3 = utf.charCodeAt(src++);
			c = String.fromCharCode(((b1 & 0xF) << 12) | ((b2 & 0x3F) << 6) | (b3 & 0x3F));
			uni = uni.substring(0,dst++).concat(c,utf.substr(src));
		}
	}
	return uni;
}

function mozConvertUTF8ToUnicode(u)
{
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		converter.charset = "UTF-8";
	} catch(ex) {
		return manualConvertUTF8ToUnicode(u);
	} // fallback
	var s = converter.ConvertToUnicode(u);
	var fin = converter.Finish();
	return (fin.length > 0) ? s+fin : s;
}

function convertUnicodeToUTF8(s)
{
	if(window.netscape == undefined)
		return manualConvertUnicodeToUTF8(s);
	else
		return mozConvertUnicodeToUTF8(s);
}

function manualConvertUnicodeToUTF8(s)
{
	var re = /[^\u0000-\u007F]/g ;
	return s.replace(re,function($0) {return "&#" + $0.charCodeAt(0).toString() + ";";});
}

function mozConvertUnicodeToUTF8(s)
{
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		converter.charset = "UTF-8";
	} catch(ex) {
		return manualConvertUnicodeToUTF8(s);
	} // fallback
	var u = converter.ConvertFromUnicode(s);
	var fin = converter.Finish();
	return fin.length > 0 ? u + fin : u;
}

function convertUriToUTF8(uri,charSet)
{
	if(window.netscape == undefined || charSet == undefined || charSet == "")
		return uri;
	try {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		var converter = Components.classes["@mozilla.org/intl/utf8converterservice;1"].getService(Components.interfaces.nsIUTF8ConverterService);
	} catch(ex) {
		return uri;
	}
	return converter.convertURISpecToUTF8(uri,charSet);
}

function saveFile(fileUrl,content)
{
	var r = mozillaSaveFile(fileUrl,content);
	if(!r)
		r = ieSaveFile(fileUrl,content);
	if(!r)
		r = javaSaveFile(fileUrl,content);
	return r;
}

function loadFile(fileUrl)
{
	var r = mozillaLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = ieLoadFile(fileUrl);
	if((r == null) || (r == false))
		r = javaLoadFile(fileUrl);
	return r;
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function ieSaveFile(filePath,content)
{
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch(ex) {
		return null;
	}
	var file = fso.OpenTextFile(filePath,2,-1,0);
	file.Write(content);
	file.Close();
	return true;
}

// Returns null if it can't do it, false if there's an error, or a string of the content if successful
function ieLoadFile(filePath)
{
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var file = fso.OpenTextFile(filePath,1);
		var content = file.ReadAll();
		file.Close();
	} catch(ex) {
		return null;
	}
	return content;
}

function ieCopyFile(dest,source)
{
	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		fso.GetFile(source).Copy(dest);
	} catch(ex) {
		return false;
	}
	return true;
}

// Returns null if it can't do it, false if there's an error, true if it saved OK
function mozillaSaveFile(filePath,content)
{
	if(window.Components) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if(!file.exists())
				file.create(0,0664);
			var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			out.init(file,0x20|0x02,00004,null);
			out.write(content,content.length);
			out.flush();
			out.close();
			return true;
		} catch(ex) {
			return false;
		}
	}
	return null;
}

// Returns null if it can't do it, false if there's an error, or a string of the content if successful
function mozillaLoadFile(filePath)
{
	if(window.Components) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if(!file.exists())
				return null;
			var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			inputStream.init(file,0x01,00004,null);
			var sInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
			sInputStream.init(inputStream);
			return sInputStream.read(sInputStream.available());
		} catch(ex) {
			return false;
		}
	}
	return null;
}

function javaUrlToFilename(url)
{
	var f = "//localhost";
	if(url.indexOf(f) == 0)
		return url.substring(f.length);
	var i = url.indexOf(":");
	if(i > 0)
		return url.substring(i-1);
	return url;
}

function javaSaveFile(filePath,content)
{
	try {
		if(document.applets["TiddlySaver"])
			return document.applets["TiddlySaver"].saveFile(javaUrlToFilename(filePath),"UTF-8",content);
	} catch(ex) {
	}
	try {
		var s = new java.io.PrintStream(new java.io.FileOutputStream(javaUrlToFilename(filePath)));
		s.print(content);
		s.close();
	} catch(ex) {
		return null;
	}
	return true;
}

function javaLoadFile(filePath)
{
	try {
		if(document.applets["TiddlySaver"])
			return String(document.applets["TiddlySaver"].loadFile(javaUrlToFilename(filePath),"UTF-8"));
	} catch(ex) {
	}
	var content = [];
	try {
		var r = new java.io.BufferedReader(new java.io.FileReader(javaUrlToFilename(filePath)));
		var line;
		while((line = r.readLine()) != null)
			content.push(new String(line));
		r.close();
	} catch(ex) {
		return null;
	}
	return content.join("\n");
}

//--
//-- Server adaptor for talking to static files
//--

function FileAdaptor()
{
	this.host = null;
	this.store = null;
	return this;
}

FileAdaptor.NotLoadedError = "TiddlyWiki file has not been loaded";
FileAdaptor.serverType = 'file';

// Open the specified host/server
FileAdaptor.prototype.openHost = function(host,context,userParams,callback)
{
	this.host = host;
	if(!context)
		context = {};
	context.adaptor = this;
	context.callback = callback;
	context.userParams = userParams;
	var ret = loadRemoteFile(host,FileAdaptor.openHostCallback,context);
	return typeof(ret) == "string" ? ret : true;
};

FileAdaptor.openHostCallback = function(status,context,responseText,url,xhr)
{
	var adaptor = context.adaptor;
	context.status = status;
	if(!status) {
		context.statusText = "Error reading file: " + xhr.statusText;
	} else {
		// Load the content into a TiddlyWiki() object
		adaptor.store = new TiddlyWiki();
		if(!adaptor.store.importTiddlyWiki(responseText))
			context.statusText = config.messages.invalidFileError.format([url]);
	}
	context.callback(context,context.userParams);
};

// Gets the list of workspaces on a given server
FileAdaptor.prototype.getWorkspaceList = function(context,userParams,callback)
{
	if(!context)
		context = {};
	context.workspaces = [{title:"(default)"}];
	context.status = true;
	window.setTimeout(function() {callback(context,userParams);},10);
	return true;
};

// Open the specified workspace
FileAdaptor.prototype.openWorkspace = function(workspace,context,userParams,callback)
{
	if(!context)
		context = {};
	context.status = true;
	window.setTimeout(function() {callback(context,userParams);},10);
	return true;
};

// Gets the list of tiddlers within a given workspace
FileAdaptor.prototype.getTiddlerList = function(context,userParams,callback)
{
	if(!this.store)
		return FileAdaptor.NotLoadedError;
	if(!context)
		context = {};
	context.tiddlers = [];
	this.store.forEachTiddler(function(title,tiddler)
		{
		var t = new Tiddler(title);
		t.text = tiddler.text;
		t.modified = tiddler.modified;
		t.modifier = tiddler.modifier;
		t.fields['server.page.revision'] = tiddler.modified.convertToYYYYMMDDHHMM();
		t.tags = tiddler.tags;
		context.tiddlers.push(t);
		});
	context.status = true;
	window.setTimeout(function() {callback(context,userParams);},10);
	return true;
};

FileAdaptor.prototype.generateTiddlerInfo = function(tiddler)
{
	var info = {};
	info.uri = tiddler.fields['server.host'] + "#" + tiddler.title;
	return info;
};

// Retrieves a tiddler from a given workspace on a given server
FileAdaptor.prototype.getTiddler = function(title,context,userParams,callback)
{
	if(!this.store)
		return FileAdaptor.NotLoadedError;
	if(!context)
		context = {};
	context.tiddler = this.store.fetchTiddler(title);
	if(context.tiddler) {
		context.tiddler.fields['server.type'] = FileAdaptor.serverType;
		context.tiddler.fields['server.host'] = this.host;
		context.tiddler.fields['server.page.revision'] = context.tiddler.modified.convertToYYYYMMDDHHMM();
	}
	context.status = true;
	if(context.allowSynchronous) {
		context.isSynchronous = true;
		callback(context,userParams);
	} else {
		window.setTimeout(function() {callback(context,userParams);},10);
	}
	return true;
};

FileAdaptor.prototype.close = function()
{
	delete this.store;
	this.store = null;
};

config.adaptors[FileAdaptor.serverType] = FileAdaptor;

//--
//-- Remote HTTP requests
//--

function loadRemoteFile(url,callback,params)
{
	return doHttp("GET",url,null,null,null,null,callback,params,null);
}

// HTTP status codes
var httpStatus = {
	OK: 200,
	ContentCreated: 201,
	NoContent: 204,
	Unauthorized: 401,
	Forbidden: 403,
	NotFound: 404,
	MethodNotAllowed: 405
};

function doHttp(type,url,data,contentType,username,password,callback,params,headers)
{
	// Get an xhr object
	var x = getXMLHttpRequest();
	if(!x)
		return "Can't create XMLHttpRequest object";
	// Install callback
	x.onreadystatechange = function() {
		if (x.readyState == 4 && callback && (x.status !== undefined)) {
			if([0, httpStatus.OK, httpStatus.ContentCreated, httpStatus.NoContent].contains(x.status))
				callback(true,params,x.responseText,url,x);
			else
				callback(false,params,null,url,x);
			x.onreadystatechange = function(){};
			x = null;
		}
	};
	// Send request
	if(window.Components && window.netscape && window.netscape.security && document.location.protocol.indexOf("http") == -1)
		window.netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	try {
		url = url + (url.indexOf("?") < 0 ? "?" : "&") + "nocache=" + Math.random();
		x.open(type,url,true,username,password);
		if (data)
			x.setRequestHeader("Content-Type", contentType ? contentType : "application/x-www-form-urlencoded");
		if (x.overrideMimeType)
			x.setRequestHeader("Connection", "close");
		if(headers) {
			for(n in headers)
				x.setRequestHeader(n,headers[n]);
		}
		x.setRequestHeader("X-Requested-With", "TiddlyWiki " + version.major + "." + version.minor + "." + version.revision + (version.beta ? " (beta " + version.beta + ")" : ""));
		x.send(data);
	} catch (ex) {
		return exceptionText(ex);
	}
	return x;
}

function getXMLHttpRequest()
{
	try {
		var x = new XMLHttpRequest(); // Modern
	} catch(ex) {
		try {
			x = new ActiveXObject("Msxml2.XMLHTTP"); // IE 6
		} catch (ex2) {
			return null;
		}
	}
	return x;
}

//--
//-- TiddlyWiki-specific utility functions
//--

function createTiddlyButton(parent,text,tooltip,action,className,id,accessKey)
{
	var btn = document.createElement("a");
	if(action) {
		btn.onclick = action;
		btn.setAttribute("href","javascript:;");
	}
	if(tooltip)
		btn.setAttribute("title",tooltip);
	if(text)
		btn.appendChild(document.createTextNode(text));
	btn.className = className ? className : "button";
	if(id)
		btn.id = id;
	if(parent)
		parent.appendChild(btn);
	if(accessKey)
		btn.setAttribute("accessKey",accessKey);
	return btn;
}

function createTiddlyLink(place,title,includeText,className,isStatic,linkedFromTiddler,noToggle)
{
	var text = includeText ? title : null;
	var i = getTiddlyLinkInfo(title,className);
	var btn = isStatic ? createExternalLink(place,store.getTiddlerText("SiteUrl",null) + "#" + title) : createTiddlyButton(place,text,i.subTitle,onClickTiddlerLink,i.classes);
	btn.setAttribute("refresh","link");
	btn.setAttribute("tiddlyLink",title);
	if(noToggle)
		btn.setAttribute("noToggle","true");
	if(linkedFromTiddler) {
		var fields = linkedFromTiddler.getInheritedFields();
		if(fields)
			btn.setAttribute("tiddlyFields",fields);
	}
	return btn;
}

function refreshTiddlyLink(e,title)
{
	var i = getTiddlyLinkInfo(title,e.className);
	e.className = i.classes;
	e.title = i.subTitle;
}

function getTiddlyLinkInfo(title,currClasses)
{
	var classes = currClasses ? currClasses.split(" ") : [];
	classes.pushUnique("tiddlyLink");
	var tiddler = store.fetchTiddler(title);
	var subTitle;
	if(tiddler) {
		subTitle = tiddler.getSubtitle();
		classes.pushUnique("tiddlyLinkExisting");
		classes.remove("tiddlyLinkNonExisting");
		classes.remove("shadow");
	} else {
		classes.remove("tiddlyLinkExisting");
		classes.pushUnique("tiddlyLinkNonExisting");
		if(store.isShadowTiddler(title)) {
			subTitle = config.messages.shadowedTiddlerToolTip.format([title]);
			classes.pushUnique("shadow");
		} else {
			subTitle = config.messages.undefinedTiddlerToolTip.format([title]);
			classes.remove("shadow");
		}
	}
	if(config.annotations[title])
		subTitle = config.annotations[title];
	return {classes: classes.join(" "),subTitle: subTitle};
}

function createExternalLink(place,url)
{
	var link = document.createElement("a");
	link.className = "externalLink";
	link.href = url;
	link.title = config.messages.externalLinkTooltip.format([url]);
	if(config.options.chkOpenInNewWindow)
		link.target = "_blank";
	place.appendChild(link);
	return link;
}

// Event handler for clicking on a tiddly link
function onClickTiddlerLink(ev)
{
	var e = ev ? ev : window.event;
	var target = resolveTarget(e);
	var link = target;
	var title = null;
	var fields = null;
	var noToggle = null;
	do {
		title = link.getAttribute("tiddlyLink");
		fields = link.getAttribute("tiddlyFields");
		noToggle = link.getAttribute("noToggle");
		link = link.parentNode;
	} while(title == null && link != null);
	if(!store.isShadowTiddler(title)) {
		var f = fields ? fields.decodeHashMap() : {};
		fields = String.encodeHashMap(merge(f,config.defaultCustomFields,true));
	}
	if(title) {
		var toggling = e.metaKey || e.ctrlKey;
		if(config.options.chkToggleLinks)
			toggling = !toggling;
		if(noToggle)
			toggling = false;
		story.displayTiddler(target,title,null,true,null,fields,toggling);
	}
	clearMessage();
	return false;
}

// Create a button for a tag with a popup listing all the tiddlers that it tags
function createTagButton(place,tag,excludeTiddler)
{
	var btn = createTiddlyButton(place,tag,config.views.wikified.tag.tooltip.format([tag]),onClickTag);
	btn.setAttribute("tag",tag);
	if(excludeTiddler)
		btn.setAttribute("tiddler",excludeTiddler);
	return btn;
}

// Event handler for clicking on a tiddler tag
function onClickTag(ev)
{
	var e = ev ? ev : window.event;
	var popup = Popup.create(this);
	var tag = this.getAttribute("tag");
	var title = this.getAttribute("tiddler");
	if(popup && tag) {
		var tagged = store.getTaggedTiddlers(tag);
		var titles = [];
		var li,r;
		for(r=0;r<tagged.length;r++) {
			if(tagged[r].title != title)
				titles.push(tagged[r].title);
		}
		var lingo = config.views.wikified.tag;
		if(titles.length > 0) {
			var openAll = createTiddlyButton(createTiddlyElement(popup,"li"),lingo.openAllText.format([tag]),lingo.openAllTooltip,onClickTagOpenAll);
			openAll.setAttribute("tag",tag);
			createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
			for(r=0; r<titles.length; r++) {
				createTiddlyLink(createTiddlyElement(popup,"li"),titles[r],true);
			}
		} else {
			createTiddlyText(createTiddlyElement(popup,"li",null,"disabled"),lingo.popupNone.format([tag]));
		}
		createTiddlyElement(createTiddlyElement(popup,"li",null,"listBreak"),"div");
		var h = createTiddlyLink(createTiddlyElement(popup,"li"),tag,false);
		createTiddlyText(h,lingo.openTag.format([tag]));
	}
	Popup.show();
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	return false;
}

// Event handler for 'open all' on a tiddler popup
function onClickTagOpenAll(ev)
{
	var e = ev ? ev : window.event;
	var tag = this.getAttribute("tag");
	var tagged = store.getTaggedTiddlers(tag);
	var titles = [];
	for(var t=0; t<tagged.length; t++)
		titles.push(tagged[t].title);
	story.displayTiddlers(this,titles);
	return false;
}

function onClickError(ev)
{
	var e = ev ? ev : window.event;
	var popup = Popup.create(this);
	var lines = this.getAttribute("errorText").split("\n");
	for(var t=0; t<lines.length; t++)
		createTiddlyElement(popup,"li",null,null,lines[t]);
	Popup.show();
	e.cancelBubble = true;
	if(e.stopPropagation) e.stopPropagation();
	return false;
}

function createTiddlyDropDown(place,onchange,options,defaultValue)
{
	var sel = createTiddlyElement(place,"select");
	sel.onchange = onchange;
	for(var t=0; t<options.length; t++) {
		var e = createTiddlyElement(sel,"option",null,null,options[t].caption);
		e.value = options[t].name;
		if(options[t].name == defaultValue)
			e.selected = true;
	}
	return sel;
}

function createTiddlyPopup(place,caption,tooltip,tiddler)
{
	if(tiddler.text) {
		createTiddlyLink(place,caption,true);
		var btn = createTiddlyButton(place,glyph("downArrow"),tooltip,onClickTiddlyPopup,"tiddlerPopupButton");
		btn.tiddler = tiddler;
	} else {
		createTiddlyText(place,caption);
	}
}

function onClickTiddlyPopup(ev)
{
	var e = ev ? ev : window.event;
	var tiddler = this.tiddler;
	if(tiddler.text) {
		var popup = Popup.create(this,"div","popupTiddler");
		wikify(tiddler.text,popup,null,tiddler);
		Popup.show();
	}
	if(e) e.cancelBubble = true;
	if(e && e.stopPropagation) e.stopPropagation();
	return false;
}

function createTiddlyError(place,title,text)
{
	var btn = createTiddlyButton(place,title,null,onClickError,"errorButton");
	if(text) btn.setAttribute("errorText",text);
}

function merge(dst,src,preserveExisting)
{
	for(p in src) {
		if(!preserveExisting || dst[p] === undefined)
			dst[p] = src[p];
	}
	return dst;
}

// Returns a string containing the description of an exception, optionally prepended by a message
function exceptionText(e,message)
{
	var s = e.description ? e.description : e.toString();
	return message ? "%0:\n%1".format([message,s]) : s;
}

// Displays an alert of an exception description with optional message
function showException(e,message)
{
	alert(exceptionText(e,message));
}

function alertAndThrow(m)
{
	alert(m);
	throw(m);
}

function glyph(name)
{
	var g = config.glyphs;
	var b = g.currBrowser;
	if(b == null) {
		b = 0;
		while(!g.browsers[b]() && b < g.browsers.length-1)
			b++;
		g.currBrowser = b;
	}
	if(!g.codes[name])
		return "";
	return g.codes[name][b];
}

//-
//- Animation engine
//-

function Animator()
{
	this.running = 0; // Incremented at start of each animation, decremented afterwards. If zero, the interval timer is disabled
	this.timerID = 0; // ID of the timer used for animating
	this.animations = []; // List of animations in progress
	return this;
}

// Start animation engine
Animator.prototype.startAnimating = function() // Variable number of arguments
{
	for(var t=0; t<arguments.length; t++)
		this.animations.push(arguments[t]);
	if(this.running == 0) {
		var me = this;
		this.timerID = window.setInterval(function() {me.doAnimate(me);},10);
	}
	this.running += arguments.length;
};

// Perform an animation engine tick, calling each of the known animation modules
Animator.prototype.doAnimate = function(me)
{
	var a = 0;
	while(a < me.animations.length) {
		var animation = me.animations[a];
		if(animation.tick()) {
			a++;
		} else {
			me.animations.splice(a,1);
			if(--me.running == 0)
				window.clearInterval(me.timerID);
		}
	}
};

// Map a 0..1 value to 0..1, but slow down at the start and end
Animator.slowInSlowOut = function(progress)
{
	return(1-((Math.cos(progress * Math.PI)+1)/2));
};

//--
//-- Morpher animation
//--

// Animate a set of properties of an element
function Morpher(element,duration,properties,callback)
{
	this.element = element;
	this.duration = duration;
	this.properties = properties;
	this.startTime = new Date();
	this.endTime = Number(this.startTime) + duration;
	this.callback = callback;
	this.tick();
	return this;
}

Morpher.prototype.assignStyle = function(element,style,value)
{
	switch(style) {
		case "-tw-vertScroll":
			window.scrollTo(findScrollX(),value);
			break;
		case "-tw-horizScroll":
			window.scrollTo(value,findScrollY());
			break;
		default:
			element.style[style] = value;
			break;
	}
};

Morpher.prototype.stop = function()
{
	for(var t=0; t<this.properties.length; t++) {
		var p = this.properties[t];
		if(p.atEnd !== undefined) {
			this.assignStyle(this.element,p.style,p.atEnd);
		}
	}
	if(this.callback)
		this.callback(this.element,this.properties);
};

Morpher.prototype.tick = function()
{
	var currTime = Number(new Date());
	progress = Animator.slowInSlowOut(Math.min(1,(currTime-this.startTime)/this.duration));
	for(var t=0; t<this.properties.length; t++) {
		var p = this.properties[t];
		if(p.start !== undefined && p.end !== undefined) {
			var template = p.template ? p.template : "%0";
			switch(p.format) {
				case undefined:
				case "style":
					var v = p.start + (p.end-p.start) * progress;
					this.assignStyle(this.element,p.style,template.format([v]));
					break;
				case "color":
					break;
			}
		}
	}
	if(currTime >= this.endTime) {
		this.stop();
		return false;
	}
	return true;
};

//--
//-- Zoomer animation
//--

function Zoomer(text,startElement,targetElement,unused)
{
	var e = createTiddlyElement(document.body,"div",null,"zoomer");
	createTiddlyElement(e,"div",null,null,text);
	var winWidth = findWindowWidth();
	var winHeight = findWindowHeight();
	var p = [
		{style: 'left', start: findPosX(startElement), end: findPosX(targetElement), template: '%0px'},
		{style: 'top', start: findPosY(startElement), end: findPosY(targetElement), template: '%0px'},
		{style: 'width', start: Math.min(startElement.scrollWidth,winWidth), end: Math.min(targetElement.scrollWidth,winWidth), template: '%0px', atEnd: 'auto'},
		{style: 'height', start: Math.min(startElement.scrollHeight,winHeight), end: Math.min(targetElement.scrollHeight,winHeight), template: '%0px', atEnd: 'auto'},
		{style: 'fontSize', start: 8, end: 24, template: '%0pt'}
	];
	var c = function(element,properties) {removeNode(element);};
	return new Morpher(e,config.animDuration,p,c);
}

//--
//-- Scroller animation
//--

function Scroller(targetElement,unused)
{
	var p = [
		{style: '-tw-vertScroll', start: findScrollY(), end: ensureVisible(targetElement)}
	];
	return new Morpher(targetElement,config.animDuration,p);
}

//--
//-- Slider animation
//--

// deleteMode - "none", "all" [delete target element and it's children], [only] "children" [but not the target element]
function Slider(element,opening,unused,deleteMode)
{
	element.style.overflow = 'hidden';
	if(opening)
		element.style.height = '0px'; // Resolves a Firefox flashing bug
	element.style.display = 'block';
	var left = findPosX(element);
	var width = element.scrollWidth;
	var height = element.scrollHeight;
	var winWidth = findWindowWidth();
	var p = [];
	var c = null;
	if(opening) {
		p.push({style: 'height', start: 0, end: height, template: '%0px', atEnd: 'auto'});
		p.push({style: 'opacity', start: 0, end: 1, template: '%0'});
		p.push({style: 'filter', start: 0, end: 100, template: 'alpha(opacity:%0)'});
	} else {
		p.push({style: 'height', start: height, end: 0, template: '%0px'});
		p.push({style: 'display', atEnd: 'none'});
		p.push({style: 'opacity', start: 1, end: 0, template: '%0'});
		p.push({style: 'filter', start: 100, end: 0, template: 'alpha(opacity:%0)'});
		switch(deleteMode) {
			case "all":
				c = function(element,properties) {removeNode(element);};
				break;
			case "children":
				c = function(element,properties) {removeChildren(element);};
				break;
		}
	}
	return new Morpher(element,config.animDuration,p,c);
}

//--
//-- Popup menu
//--

var Popup = {
	stack: [] // Array of objects with members root: and popup:
	};

Popup.create = function(root,elem,theClass)
{
	Popup.remove();
	var popup = createTiddlyElement(document.body,elem ? elem : "ol","popup",theClass ? theClass : "popup");
	Popup.stack.push({root: root, popup: popup});
	return popup;
};

Popup.onDocumentClick = function(ev)
{
	var e = ev ? ev : window.event;
	if(e.eventPhase == undefined)
		Popup.remove();
	else if(e.eventPhase == Event.BUBBLING_PHASE || e.eventPhase == Event.AT_TARGET)
		Popup.remove();
	return true;
};

Popup.show = function(unused1,unused2)
{
	var curr = Popup.stack[Popup.stack.length-1];
	this.place(curr.root,curr.popup);
	addClass(curr.root,"highlight");
	if(config.options.chkAnimate && anim && typeof Scroller == "function")
		anim.startAnimating(new Scroller(curr.popup));
	else
		window.scrollTo(0,ensureVisible(curr.popup));
};

Popup.place = function(root,popup,offset)
{
	if(!offset) var offset = {x:0, y:0};
	var rootLeft = findPosX(root);
	var rootTop = findPosY(root);
	var rootHeight = root.offsetHeight;
	var popupLeft = rootLeft + offset.x;
	var popupTop = rootTop + rootHeight + offset.y;
	var winWidth = findWindowWidth();
	if(popup.offsetWidth > winWidth*0.75)
		popup.style.width = winWidth*0.75 + "px";
	var popupWidth = popup.offsetWidth;
	if(popupLeft + popupWidth > winWidth)
		popupLeft = winWidth - popupWidth;
	popup.style.left = popupLeft + "px";
	popup.style.top = popupTop + "px";
	popup.style.display = "block";
};

Popup.remove = function()
{
	if(Popup.stack.length > 0) {
		Popup.removeFrom(0);
	}
};

Popup.removeFrom = function(from)
{
	for(var t=Popup.stack.length-1; t>=from; t--) {
		var p = Popup.stack[t];
		removeClass(p.root,"highlight");
		removeNode(p.popup);
	}
	Popup.stack = Popup.stack.slice(0,from);
};

//--
//-- Wizard support
//--

function Wizard(elem)
{
	if(elem) {
		this.formElem = findRelated(elem,"wizard","className");
		this.bodyElem = findRelated(this.formElem.firstChild,"wizardBody","className","nextSibling");
		this.footElem = findRelated(this.formElem.firstChild,"wizardFooter","className","nextSibling");
	} else {
		this.formElem = null;
		this.bodyElem = null;
		this.footElem = null;
	}
}

Wizard.prototype.setValue = function(name,value)
{
	if(this.formElem)
		this.formElem[name] = value;
};

Wizard.prototype.getValue = function(name)
{
	return this.formElem ? this.formElem[name] : null;
};

Wizard.prototype.createWizard = function(place,title)
{
	this.formElem = createTiddlyElement(place,"form",null,"wizard");
	createTiddlyElement(this.formElem,"h1",null,null,title);
	this.bodyElem = createTiddlyElement(this.formElem,"div",null,"wizardBody");
	this.footElem = createTiddlyElement(this.formElem,"div",null,"wizardFooter");
};

Wizard.prototype.clear = function()
{
	removeChildren(this.bodyElem);
};

Wizard.prototype.setButtons = function(buttonInfo,status)
{
	removeChildren(this.footElem);
	for(var t=0; t<buttonInfo.length; t++) {
		createTiddlyButton(this.footElem,buttonInfo[t].caption,buttonInfo[t].tooltip,buttonInfo[t].onClick);
		insertSpacer(this.footElem);
		}
	if(typeof status == "string") {
		createTiddlyElement(this.footElem,"span",null,"status",status);
	}
};

Wizard.prototype.addStep = function(stepTitle,html)
{
	removeChildren(this.bodyElem);
	var w = createTiddlyElement(this.bodyElem,"div");
	createTiddlyElement(w,"h2",null,null,stepTitle);
	var step = createTiddlyElement(w,"div",null,"wizardStep");
	step.innerHTML = html;
	applyHtmlMacros(step,tiddler);
};

Wizard.prototype.getElement = function(name)
{
	return this.formElem.elements[name];
};

//--
//-- ListView gadget
//--

var ListView = {};

// Create a listview
ListView.create = function(place,listObject,listTemplate,callback,className)
{
	var table = createTiddlyElement(place,"table",null,className ? className : "listView twtable");
	var thead = createTiddlyElement(table,"thead");
	var r = createTiddlyElement(thead,"tr");
	for(var t=0; t<listTemplate.columns.length; t++) {
		var columnTemplate = listTemplate.columns[t];
		var c = createTiddlyElement(r,"th");
		var colType = ListView.columnTypes[columnTemplate.type];
		if(colType && colType.createHeader)
			colType.createHeader(c,columnTemplate,t);
	}
	var tbody = createTiddlyElement(table,"tbody");
	for(var rc=0; rc<listObject.length; rc++) {
		rowObject = listObject[rc];
		r = createTiddlyElement(tbody,"tr");
		for(c=0; c<listTemplate.rowClasses.length; c++) {
			if(rowObject[listTemplate.rowClasses[c].field])
				addClass(r,listTemplate.rowClasses[c].className);
		}
		rowObject.rowElement = r;
		rowObject.colElements = {};
		for(var cc=0; cc<listTemplate.columns.length; cc++) {
			c = createTiddlyElement(r,"td");
			columnTemplate = listTemplate.columns[cc];
			var field = columnTemplate.field;
			colType = ListView.columnTypes[columnTemplate.type];
			if(colType && colType.createItem)
				colType.createItem(c,rowObject,field,columnTemplate,cc,rc);
			rowObject.colElements[field] = c;
		}
	}
	if(callback && listTemplate.actions)
		createTiddlyDropDown(place,ListView.getCommandHandler(callback),listTemplate.actions);
	if(callback && listTemplate.buttons) {
		for(t=0; t<listTemplate.buttons.length; t++) {
			var a = listTemplate.buttons[t];
			if(a && a.name != "")
				createTiddlyButton(place,a.caption,null,ListView.getCommandHandler(callback,a.name,a.allowEmptySelection));
		}
	}
	return table;
};

ListView.getCommandHandler = function(callback,name,allowEmptySelection)
{
	return function(e) {
		var view = findRelated(this,"TABLE",null,"previousSibling");
		var tiddlers = [];
		ListView.forEachSelector(view,function(e,rowName) {
					if(e.checked)
						tiddlers.push(rowName);
					});
		if(tiddlers.length == 0 && !allowEmptySelection) {
			alert(config.messages.nothingSelected);
		} else {
			if(this.nodeName.toLowerCase() == "select") {
				callback(view,this.value,tiddlers);
				this.selectedIndex = 0;
			} else {
				callback(view,name,tiddlers);
			}
		}
	};
};

// Invoke a callback for each selector checkbox in the listview
ListView.forEachSelector = function(view,callback)
{
	var checkboxes = view.getElementsByTagName("input");
	var hadOne = false;
	for(var t=0; t<checkboxes.length; t++) {
		var cb = checkboxes[t];
		if(cb.getAttribute("type") == "checkbox") {
			var rn = cb.getAttribute("rowName");
			if(rn) {
				callback(cb,rn);
				hadOne = true;
			}
		}
	}
	return hadOne;
};

ListView.getSelectedRows = function(view)
{
	var rowNames = [];
	ListView.forEachSelector(view,function(e,rowName) {
				if(e.checked)
					rowNames.push(rowName);
				});
	return rowNames;
};

ListView.columnTypes = {};

ListView.columnTypes.String = {
	createHeader: function(place,columnTemplate,col)
		{
			createTiddlyText(place,columnTemplate.title);
		},
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined)
				createTiddlyText(place,v);
		}
};

ListView.columnTypes.WikiText = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined)
				wikify(v,place,null,null);
		}
};

ListView.columnTypes.Tiddler = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined && v.title)
				createTiddlyPopup(place,v.title,config.messages.listView.tiddlerTooltip,v);
		}
};

ListView.columnTypes.Size = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined) {
				var t = 0;
				while(t<config.messages.sizeTemplates.length-1 && v<config.messages.sizeTemplates[t].unit)
					t++;
				createTiddlyText(place,config.messages.sizeTemplates[t].template.format([Math.round(v/config.messages.sizeTemplates[t].unit)]));
			}
		}
};

ListView.columnTypes.Link = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			var c = columnTemplate.text;
			if(v != undefined)
				createTiddlyText(createExternalLink(place,v),c ? c : v);
		}
};

ListView.columnTypes.Date = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined)
				createTiddlyText(place,v.formatString(columnTemplate.dateFormat));
		}
};

ListView.columnTypes.StringList = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined) {
				for(var t=0; t<v.length; t++) {
					createTiddlyText(place,v[t]);
					createTiddlyElement(place,"br");
				}
			}
		}
};

ListView.columnTypes.Selector = {
	createHeader: function(place,columnTemplate,col)
		{
			createTiddlyCheckbox(place,null,false,this.onHeaderChange);
		},
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var e = createTiddlyCheckbox(place,null,listObject[field],null);
			e.setAttribute("rowName",listObject[columnTemplate.rowName]);
		},
	onHeaderChange: function(e)
		{
			var state = this.checked;
			var view = findRelated(this,"TABLE");
			if(!view)
				return;
			ListView.forEachSelector(view,function(e,rowName) {
								e.checked = state;
							});
		}
};

ListView.columnTypes.Tags = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var tags = listObject[field];
			createTiddlyText(place,String.encodeTiddlyLinkList(tags));
		}
};

ListView.columnTypes.Boolean = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			if(listObject[field] == true)
				createTiddlyText(place,columnTemplate.trueText);
			if(listObject[field] == false)
				createTiddlyText(place,columnTemplate.falseText);
		}
};

ListView.columnTypes.TagCheckbox = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var e = createTiddlyCheckbox(place,null,listObject[field],this.onChange);
			e.setAttribute("tiddler",listObject.title);
			e.setAttribute("tag",columnTemplate.tag);
		},
	onChange : function(e)
		{
			var tag = this.getAttribute("tag");
			var tiddler = this.getAttribute("tiddler");
			store.setTiddlerTag(tiddler,this.checked,tag);
		}
};

ListView.columnTypes.TiddlerLink = {
	createHeader: ListView.columnTypes.String.createHeader,
	createItem: function(place,listObject,field,columnTemplate,col,row)
		{
			var v = listObject[field];
			if(v != undefined) {
				var link = createTiddlyLink(place,listObject[columnTemplate.tiddlerLink],false,null);
				createTiddlyText(link,listObject[field]);
			}
		}
};

//--
//-- Augmented methods for the JavaScript Number(), Array(), String() and Date() objects
//--

// Clamp a number to a range
Number.prototype.clamp = function(min,max)
{
	var c = this;
	if(c < min)
		c = min;
	if(c > max)
		c = max;
	return c;
};

// Add indexOf function if browser does not support it
if(!Array.indexOf) {
Array.prototype.indexOf = function(item,from)
{
	if(!from)
		from = 0;
	for(var i=from; i<this.length; i++) {
		if(this[i] === item)
			return i;
	}
	return -1;
};}

// Find an entry in a given field of the members of an array
Array.prototype.findByField = function(field,value)
{
	for(var t=0; t<this.length; t++) {
		if(this[t][field] == value)
			return t;
	}
	return null;
};

// Return whether an entry exists in an array
Array.prototype.contains = function(item)
{
	return this.indexOf(item) != -1;
};

// Adds, removes or toggles a particular value within an array
//  value - value to add
//  mode - +1 to add value, -1 to remove value, 0 to toggle it
Array.prototype.setItem = function(value,mode)
{
	var p = this.indexOf(value);
	if(mode == 0)
		mode = (p == -1) ? +1 : -1;
	if(mode == +1) {
		if(p == -1)
			this.push(value);
	} else if(mode == -1) {
		if(p != -1)
			this.splice(p,1);
	}
};

// Return whether one of a list of values exists in an array
Array.prototype.containsAny = function(items)
{
	for(var i=0; i<items.length; i++) {
		if (this.indexOf(items[i]) != -1)
			return true;
	}
	return false;
};

// Return whether all of a list of values exists in an array
Array.prototype.containsAll = function(items)
{
	for (var i = 0; i<items.length; i++) {
		if (this.indexOf(items[i]) == -1)
			return false;
	}
	return true;
};

// Push a new value into an array only if it is not already present in the array. If the optional unique parameter is false, it reverts to a normal push
Array.prototype.pushUnique = function(item,unique)
{
	if(unique === false) {
		this.push(item);
	} else {
		if(this.indexOf(item) == -1)
			this.push(item);
	}
};

Array.prototype.remove = function(item)
{
	var p = this.indexOf(item);
	if(p != -1)
		this.splice(p,1);
};

// Get characters from the right end of a string
String.prototype.right = function(n)
{
	return n < this.length ? this.slice(this.length-n) : this;
};

// Trim whitespace from both ends of a string
String.prototype.trim = function()
{
	return this.replace(/^\s*|\s*$/g,"");
};

// Convert a string from a CSS style property name to a JavaScript style name ("background-color" -> "backgroundColor")
String.prototype.unDash = function()
{
	var s = this.split("-");
	if(s.length > 1) {
		for(var t=1; t<s.length; t++)
			s[t] = s[t].substr(0,1).toUpperCase() + s[t].substr(1);
	}
	return s.join("");
};

// Substitute substrings from an array into a format string that includes '%1'-type specifiers
String.prototype.format = function(substrings)
{
	var subRegExp = /(?:%(\d+))/mg;
	var currPos = 0;
	var r = [];
	do {
		var match = subRegExp.exec(this);
		if(match && match[1]) {
			if(match.index > currPos)
				r.push(this.substring(currPos,match.index));
			r.push(substrings[parseInt(match[1])]);
			currPos = subRegExp.lastIndex;
		}
	} while(match);
	if(currPos < this.length)
		r.push(this.substring(currPos,this.length));
	return r.join("");
};

// Escape any special RegExp characters with that character preceded by a backslash
String.prototype.escapeRegExp = function()
{
	var s = "\\^$*+?()=!|,{}[].";
	var c = this;
	for(var t=0; t<s.length; t++)
		c = c.replace(new RegExp("\\" + s.substr(t,1),"g"),"\\" + s.substr(t,1));
	return c;
};

// Convert "\" to "\s", newlines to "\n" (and remove carriage returns)
String.prototype.escapeLineBreaks = function()
{
	return this.replace(/\\/mg,"\\s").replace(/\n/mg,"\\n").replace(/\r/mg,"");
};

// Convert "\n" to newlines, "\b" to " ", "\s" to "\" (and remove carriage returns)
String.prototype.unescapeLineBreaks = function()
{
	return this.replace(/\\n/mg,"\n").replace(/\\b/mg," ").replace(/\\s/mg,"\\").replace(/\r/mg,"");
};

// Convert & to "&amp;", < to "&lt;", > to "&gt;" and " to "&quot;"
String.prototype.htmlEncode = function()
{
	return this.replace(/&/mg,"&amp;").replace(/</mg,"&lt;").replace(/>/mg,"&gt;").replace(/\"/mg,"&quot;");
};

// Convert "&amp;" to &, "&lt;" to <, "&gt;" to > and "&quot;" to "
String.prototype.htmlDecode = function()
{
	return this.replace(/&lt;/mg,"<").replace(/&gt;/mg,">").replace(/&quot;/mg,"\"").replace(/&amp;/mg,"&");
};

// Convert a string to it's JSON representation by encoding control characters, double quotes and backslash. See json.org
String.prototype.toJSONString = function()
{
	var m = {
		'\b': '\\b',
		'\f': '\\f',
		'\n': '\\n',
		'\r': '\\r',
		'\t': '\\t',
		'"' : '\\"',
		'\\': '\\\\'
		};
	var replaceFn = function(a,b) {
		var c = m[b];
		if(c)
			return c;
		c = b.charCodeAt();
		return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
		};
	if(/["\\\x00-\x1f]/.test(this))
		return '"' + this.replace(/([\x00-\x1f\\"])/g,replaceFn) + '"';
	return '"' + this + '"';
};

// Parse a space-separated string of name:value parameters
// The result is an array of objects:
//   result[0] = object with a member for each parameter name, value of that member being an array of values
//   result[1..n] = one object for each parameter, with 'name' and 'value' members
String.prototype.parseParams = function(defaultName,defaultValue,allowEval,noNames,cascadeDefaults)
{
	var parseToken = function(match,p) {
		var n;
		if(match[p]) // Double quoted
			n = match[p];
		else if(match[p+1]) // Single quoted
			n = match[p+1];
		else if(match[p+2]) // Double-square-bracket quoted
			n = match[p+2];
		else if(match[p+3]) // Double-brace quoted
			try {
				n = match[p+3];
				if(allowEval)
					n = window.eval(n);
			} catch(ex) {
				throw "Unable to evaluate {{" + match[p+3] + "}}: " + exceptionText(ex);
			}
		else if(match[p+4]) // Unquoted
			n = match[p+4];
		else if(match[p+5]) // empty quote
			n = "";
		return n;
	};
	var r = [{}];
	var dblQuote = "(?:\"((?:(?:\\\\\")|[^\"])+)\")";
	var sngQuote = "(?:'((?:(?:\\\\\')|[^'])+)')";
	var dblSquare = "(?:\\[\\[((?:\\s|\\S)*?)\\]\\])";
	var dblBrace = "(?:\\{\\{((?:\\s|\\S)*?)\\}\\})";
	var unQuoted = noNames ? "([^\"'\\s]\\S*)" : "([^\"':\\s][^\\s:]*)";
	var emptyQuote = "((?:\"\")|(?:''))";
	var skipSpace = "(?:\\s*)";
	var token = "(?:" + dblQuote + "|" + sngQuote + "|" + dblSquare + "|" + dblBrace + "|" + unQuoted + "|" + emptyQuote + ")";
	var re = noNames ? new RegExp(token,"mg") : new RegExp(skipSpace + token + skipSpace + "(?:(\\:)" + skipSpace + token + ")?","mg");
	var params = [];
	do {
		var match = re.exec(this);
		if(match) {
			var n = parseToken(match,1);
			if(noNames) {
				r.push({name:"",value:n});
			} else {
				var v = parseToken(match,8);
				if(v == null && defaultName) {
					v = n;
					n = defaultName;
				} else if(v == null && defaultValue) {
					v = defaultValue;
				}
				r.push({name:n,value:v});
				if(cascadeDefaults) {
					defaultName = n;
					defaultValue = v;
				}
			}
		}
	} while(match);
	// Summarise parameters into first element
	for(var t=1; t<r.length; t++) {
		if(r[0][r[t].name])
			r[0][r[t].name].push(r[t].value);
		else
			r[0][r[t].name] = [r[t].value];
	}
	return r;
};

// Process a string list of macro parameters into an array. Parameters can be quoted with "", '',
// [[]], {{ }} or left unquoted (and therefore space-separated). Double-braces {{}} results in
// an *evaluated* parameter: e.g. {{config.options.txtUserName}} results in the current user's name.
String.prototype.readMacroParams = function()
{
	var p = this.parseParams("list",null,true,true);
	var n = [];
	for(var t=1; t<p.length; t++)
		n.push(p[t].value);
	return n;
};

// Process a string list of unique tiddler names into an array. Tiddler names that have spaces in them must be [[bracketed]]
String.prototype.readBracketedList = function(unique)
{
	var p = this.parseParams("list",null,false,true);
	var n = [];
	for(var t=1; t<p.length; t++)
		n.pushUnique(p[t].value,unique);
	return n;
};

// Returns array with start and end index of chunk between given start and end marker, or undefined.
String.prototype.getChunkRange = function(start,end)
{
	var s = this.indexOf(start);
	if(s != -1) {
		s += start.length;
		var e = this.indexOf(end,s);
		if(e != -1)
			return [s,e];
	}
};

// Replace a chunk of a string given start and end markers
String.prototype.replaceChunk = function(start,end,sub)
{
	var r = this.getChunkRange(start,end);
	return r ? this.substring(0,r[0]) + sub + this.substring(r[1]) : this;
};

// Returns a chunk of a string between start and end markers, or undefined
String.prototype.getChunk = function(start,end)
{
	var r = this.getChunkRange(start,end);
	if(r)
		return this.substring(r[0],r[1]);
};


// Static method to bracket a string with double square brackets if it contains a space
String.encodeTiddlyLink = function(title)
{
	return title.indexOf(" ") == -1 ? title : "[[" + title + "]]";
};

// Static method to encodeTiddlyLink for every item in an array and join them with spaces
String.encodeTiddlyLinkList = function(list)
{
	if(list) {
		var results = [];
		for(var t=0; t<list.length; t++)
			results.push(String.encodeTiddlyLink(list[t]));
		return results.join(" ");
	} else {
		return "";
	}
};

// Convert a string as a sequence of name:"value" pairs into a hashmap
String.prototype.decodeHashMap = function()
{
	var fields = this.parseParams("anon","",false);
	var r = {};
	for(var t=1; t<fields.length; t++)
		r[fields[t].name] = fields[t].value;
	return r;
};

// Static method to encode a hashmap into a name:"value"... string
String.encodeHashMap = function(hashmap)
{
	var r = [];
	for(var t in hashmap)
		r.push(t + ':"' + hashmap[t] + '"');
	return r.join(" ");
};

// Static method to left-pad a string with 0s to a certain width
String.zeroPad = function(n,d)
{
	var s = n.toString();
	if(s.length < d)
		s = "000000000000000000000000000".substr(0,d-s.length) + s;
	return s;
};

String.prototype.startsWith = function(prefix)
{
	return !prefix || this.substring(0,prefix.length) == prefix;
};

// Returns the first value of the given named parameter.
function getParam(params,name,defaultValue)
{
	if(!params)
		return defaultValue;
	var p = params[0][name];
	return p ? p[0] : defaultValue;
}

// Returns the first value of the given boolean named parameter.
function getFlag(params,name,defaultValue)
{
	return !!getParam(params,name,defaultValue);
}

// Substitute date components into a string
Date.prototype.formatString = function(template)
{
	var t = template.replace(/0hh12/g,String.zeroPad(this.getHours12(),2));
	t = t.replace(/hh12/g,this.getHours12());
	t = t.replace(/0hh/g,String.zeroPad(this.getHours(),2));
	t = t.replace(/hh/g,this.getHours());
	t = t.replace(/mmm/g,config.messages.dates.shortMonths[this.getMonth()]);
	t = t.replace(/0mm/g,String.zeroPad(this.getMinutes(),2));
	t = t.replace(/mm/g,this.getMinutes());
	t = t.replace(/0ss/g,String.zeroPad(this.getSeconds(),2));
	t = t.replace(/ss/g,this.getSeconds());
	t = t.replace(/[ap]m/g,this.getAmPm().toLowerCase());
	t = t.replace(/[AP]M/g,this.getAmPm().toUpperCase());
	t = t.replace(/wYYYY/g,this.getYearForWeekNo());
	t = t.replace(/wYY/g,String.zeroPad(this.getYearForWeekNo()-2000,2));
	t = t.replace(/YYYY/g,this.getFullYear());
	t = t.replace(/YY/g,String.zeroPad(this.getFullYear()-2000,2));
	t = t.replace(/MMM/g,config.messages.dates.months[this.getMonth()]);
	t = t.replace(/0MM/g,String.zeroPad(this.getMonth()+1,2));
	t = t.replace(/MM/g,this.getMonth()+1);
	t = t.replace(/0WW/g,String.zeroPad(this.getWeek(),2));
	t = t.replace(/WW/g,this.getWeek());
	t = t.replace(/DDD/g,config.messages.dates.days[this.getDay()]);
	t = t.replace(/ddd/g,config.messages.dates.shortDays[this.getDay()]);
	t = t.replace(/0DD/g,String.zeroPad(this.getDate(),2));
	t = t.replace(/DDth/g,this.getDate()+this.daySuffix());
	t = t.replace(/DD/g,this.getDate());
	return t;
};

Date.prototype.getWeek = function()
{
	var dt = new Date(this.getTime());
	var d = dt.getDay();
	if (d==0) d=7;// JavaScript Sun=0, ISO Sun=7
	dt.setTime(dt.getTime()+(4-d)*86400000);// shift day to Thurs of same week to calculate weekNo
	var n = Math.floor((dt.getTime()-new Date(dt.getFullYear(),0,1)+3600000)/86400000);
	return Math.floor(n/7)+1;
};

Date.prototype.getYearForWeekNo = function()
{
	var dt = new Date(this.getTime());
	var d = dt.getDay();
	if (d==0) d=7;// JavaScript Sun=0, ISO Sun=7
	dt.setTime(dt.getTime()+(4-d)*86400000);// shift day to Thurs of same week
	return dt.getFullYear();
};

Date.prototype.getHours12 = function()
{
	var h = this.getHours();
	return h > 12 ? h-12 : ( h > 0 ? h : 12 );
};

Date.prototype.getAmPm = function()
{
	return this.getHours() >= 12 ? config.messages.dates.pm : config.messages.dates.am;
};

Date.prototype.daySuffix = function()
{
	return config.messages.dates.daySuffixes[this.getDate()-1];
};

// Convert a date to local YYYYMMDDHHMM string format
Date.prototype.convertToLocalYYYYMMDDHHMM = function()
{
	return String.zeroPad(this.getFullYear(),4) + String.zeroPad(this.getMonth()+1,2) + String.zeroPad(this.getDate(),2) + String.zeroPad(this.getHours(),2) + String.zeroPad(this.getMinutes(),2);
};

// Convert a date to UTC YYYYMMDDHHMM string format
Date.prototype.convertToYYYYMMDDHHMM = function()
{
	return String.zeroPad(this.getUTCFullYear(),4) + String.zeroPad(this.getUTCMonth()+1,2) + String.zeroPad(this.getUTCDate(),2) + String.zeroPad(this.getUTCHours(),2) + String.zeroPad(this.getUTCMinutes(),2);
};

// Convert a date to UTC YYYYMMDD.HHMMSSMMM string format
Date.prototype.convertToYYYYMMDDHHMMSSMMM = function()
{
	return String.zeroPad(this.getUTCFullYear(),4) + String.zeroPad(this.getUTCMonth()+1,2) + String.zeroPad(this.getUTCDate(),2) + "." + String.zeroPad(this.getUTCHours(),2) + String.zeroPad(this.getUTCMinutes(),2) + String.zeroPad(this.getUTCSeconds(),2) + String.zeroPad(this.getUTCMilliseconds(),4);
};

// Static method to create a date from a UTC YYYYMMDDHHMM format string
Date.convertFromYYYYMMDDHHMM = function(d)
{
	return new Date(Date.UTC(parseInt(d.substr(0,4),10),
			parseInt(d.substr(4,2),10)-1,
			parseInt(d.substr(6,2),10),
			parseInt(d.substr(8,2),10),
			parseInt(d.substr(10,2),10),0,0));
};

//--
//-- Crypto functions and associated conversion routines
//--

// Crypto "namespace"
function Crypto() {}

// Convert a string to an array of big-endian 32-bit words
Crypto.strToBe32s = function(str)
{
	var be = Array();
	var len = Math.floor(str.length/4);
	var i, j;
	for(i=0, j=0; i<len; i++, j+=4) {
		be[i] = ((str.charCodeAt(j)&0xff) << 24)|((str.charCodeAt(j+1)&0xff) << 16)|((str.charCodeAt(j+2)&0xff) << 8)|(str.charCodeAt(j+3)&0xff);
	}
	while (j<str.length) {
		be[j>>2] |= (str.charCodeAt(j)&0xff)<<(24-(j*8)%32);
		j++;
	}
	return be;
};

// Convert an array of big-endian 32-bit words to a string
Crypto.be32sToStr = function(be)
{
	var str = "";
	for(var i=0;i<be.length*32;i+=8)
		str += String.fromCharCode((be[i>>5]>>>(24-i%32)) & 0xff);
	return str;
};

// Convert an array of big-endian 32-bit words to a hex string
Crypto.be32sToHex = function(be)
{
	var hex = "0123456789ABCDEF";
	var str = "";
	for(var i=0;i<be.length*4;i++)
		str += hex.charAt((be[i>>2]>>((3-i%4)*8+4))&0xF) + hex.charAt((be[i>>2]>>((3-i%4)*8))&0xF);
	return str;
};

// Return, in hex, the SHA-1 hash of a string
Crypto.hexSha1Str = function(str)
{
	return Crypto.be32sToHex(Crypto.sha1Str(str));
};

// Return the SHA-1 hash of a string
Crypto.sha1Str = function(str)
{
	return Crypto.sha1(Crypto.strToBe32s(str),str.length);
};

// Calculate the SHA-1 hash of an array of blen bytes of big-endian 32-bit words
Crypto.sha1 = function(x,blen)
{
	// Add 32-bit integers, wrapping at 32 bits
	add32 = function(a,b)
	{
		var lsw = (a&0xFFFF)+(b&0xFFFF);
		var msw = (a>>16)+(b>>16)+(lsw>>16);
		return (msw<<16)|(lsw&0xFFFF);
	};
	// Add five 32-bit integers, wrapping at 32 bits
	add32x5 = function(a,b,c,d,e)
	{
		var lsw = (a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF)+(e&0xFFFF);
		var msw = (a>>16)+(b>>16)+(c>>16)+(d>>16)+(e>>16)+(lsw>>16);
		return (msw<<16)|(lsw&0xFFFF);
	};
	// Bitwise rotate left a 32-bit integer by 1 bit
	rol32 = function(n)
	{
		return (n>>>31)|(n<<1);
	};

	var len = blen*8;
	// Append padding so length in bits is 448 mod 512
	x[len>>5] |= 0x80 << (24-len%32);
	// Append length
	x[((len+64>>9)<<4)+15] = len;
	var w = Array(80);

	var k1 = 0x5A827999;
	var k2 = 0x6ED9EBA1;
	var k3 = 0x8F1BBCDC;
	var k4 = 0xCA62C1D6;

	var h0 = 0x67452301;
	var h1 = 0xEFCDAB89;
	var h2 = 0x98BADCFE;
	var h3 = 0x10325476;
	var h4 = 0xC3D2E1F0;

	for(var i=0;i<x.length;i+=16) {
		var j,t;
		var a = h0;
		var b = h1;
		var c = h2;
		var d = h3;
		var e = h4;
		for(j = 0;j<16;j++) {
			w[j] = x[i+j];
			t = add32x5(e,(a>>>27)|(a<<5),d^(b&(c^d)),w[j],k1);
			e=d; d=c; c=(b>>>2)|(b<<30); b=a; a = t;
		}
		for(j=16;j<20;j++) {
			w[j] = rol32(w[j-3]^w[j-8]^w[j-14]^w[j-16]);
			t = add32x5(e,(a>>>27)|(a<<5),d^(b&(c^d)),w[j],k1);
			e=d; d=c; c=(b>>>2)|(b<<30); b=a; a = t;
		}
		for(j=20;j<40;j++) {
			w[j] = rol32(w[j-3]^w[j-8]^w[j-14]^w[j-16]);
			t = add32x5(e,(a>>>27)|(a<<5),b^c^d,w[j],k2);
			e=d; d=c; c=(b>>>2)|(b<<30); b=a; a = t;
		}
		for(j=40;j<60;j++) {
			w[j] = rol32(w[j-3]^w[j-8]^w[j-14]^w[j-16]);
			t = add32x5(e,(a>>>27)|(a<<5),(b&c)|(d&(b|c)),w[j],k3);
			e=d; d=c; c=(b>>>2)|(b<<30); b=a; a = t;
		}
		for(j=60;j<80;j++) {
			w[j] = rol32(w[j-3]^w[j-8]^w[j-14]^w[j-16]);
			t = add32x5(e,(a>>>27)|(a<<5),b^c^d,w[j],k4);
			e=d; d=c; c=(b>>>2)|(b<<30); b=a; a = t;
		}

		h0 = add32(h0,a);
		h1 = add32(h1,b);
		h2 = add32(h2,c);
		h3 = add32(h3,d);
		h4 = add32(h4,e);
	}
	return Array(h0,h1,h2,h3,h4);
};

//--
//-- RGB colour object
//--

// Construct an RGB colour object from a '#rrggbb', '#rgb' or 'rgb(n,n,n)' string or from separate r,g,b values
function RGB(r,g,b)
{
	this.r = 0;
	this.g = 0;
	this.b = 0;
	if(typeof r == "string") {
		if(r.substr(0,1) == "#") {
			if(r.length == 7) {
				this.r = parseInt(r.substr(1,2),16)/255;
				this.g = parseInt(r.substr(3,2),16)/255;
				this.b = parseInt(r.substr(5,2),16)/255;
			} else {
				this.r = parseInt(r.substr(1,1),16)/15;
				this.g = parseInt(r.substr(2,1),16)/15;
				this.b = parseInt(r.substr(3,1),16)/15;
			}
		} else {
			var rgbPattern = /rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/;
			var c = r.match(rgbPattern);
			if(c) {
				this.r = parseInt(c[1],10)/255;
				this.g = parseInt(c[2],10)/255;
				this.b = parseInt(c[3],10)/255;
			}
		}
	} else {
		this.r = r;
		this.g = g;
		this.b = b;
	}
	return this;
}

// Mixes this colour with another in a specified proportion
// c = other colour to mix
// f = 0..1 where 0 is this colour and 1 is the new colour
// Returns an RGB object
RGB.prototype.mix = function(c,f)
{
	return new RGB(this.r + (c.r-this.r) * f,this.g + (c.g-this.g) * f,this.b + (c.b-this.b) * f);
};

// Return an rgb colour as a #rrggbb format hex string
RGB.prototype.toString = function()
{
	return "#" + ("0" + Math.floor(this.r.clamp(0,1) * 255).toString(16)).right(2) +
				 ("0" + Math.floor(this.g.clamp(0,1) * 255).toString(16)).right(2) +
				 ("0" + Math.floor(this.b.clamp(0,1) * 255).toString(16)).right(2);
};

//--
//-- DOM utilities - many derived from www.quirksmode.org
//--

function drawGradient(place,horiz,colours)
{
	for(var t=0; t<= 100; t+=2) {
		var bar = document.createElement("div");
		place.appendChild(bar);
		bar.style.position = "absolute";
		bar.style.left = horiz ? t + "%" : 0;
		bar.style.top = horiz ? 0 : t + "%";
		bar.style.width = horiz ? (101-t) + "%" : "100%";
		bar.style.height = horiz ? "100%" : (101-t) + "%";
		bar.style.zIndex = -1;
		var f = t/100;
		var p = f*(colours.length-1);
		bar.style.backgroundColor = colours[Math.floor(p)].mix(colours[Math.ceil(p)],p-Math.floor(p)).toString();
	}
}

function createTiddlyText(theParent,theText)
{
	return theParent.appendChild(document.createTextNode(theText));
}

function createTiddlyCheckbox(theParent,caption,checked,onChange)
{
	var cb = document.createElement("input");
	cb.setAttribute("type","checkbox");
	cb.onclick = onChange;
	theParent.appendChild(cb);
	cb.checked = checked;
	cb.className = "chkOptionInput";
	if(caption)
		wikify(caption,theParent);
	return cb;
}

function createTiddlyElement(theParent,theElement,theID,theClass,theText)
{
	var e = document.createElement(theElement);
	if(theClass != null)
		e.className = theClass;
	if(theID != null)
		e.setAttribute("id",theID);
	if(theText != null)
		e.appendChild(document.createTextNode(theText));
	if(theParent != null)
		theParent.appendChild(e);
	return e;
}

function addEvent(obj,type,fn)
{
	if(obj.attachEvent) {
		obj['e'+type+fn] = fn;
		obj[type+fn] = function(){obj['e'+type+fn](window.event);};
		obj.attachEvent('on'+type,obj[type+fn]);
	} else {
		obj.addEventListener(type,fn,false);
	}
}

function removeEvent(obj,type,fn)
{
	if(obj.detachEvent) {
		obj.detachEvent('on'+type,obj[type+fn]);
		obj[type+fn] = null;
	} else {
		obj.removeEventListener(type,fn,false);
	}
}

function addClass(e,theClass)
{
	var currClass = e.className.split(" ");
	if(currClass.indexOf(theClass) == -1)
		e.className += " " + theClass;
}

function removeClass(e,theClass)
{
	var currClass = e.className.split(" ");
	var i = currClass.indexOf(theClass);
	while(i != -1) {
		currClass.splice(i,1);
		i = currClass.indexOf(theClass);
	}
	e.className = currClass.join(" ");
}

function hasClass(e,theClass)
{
	if(e.className) {
		if(e.className.split(" ").indexOf(theClass) != -1)
			return true;
	}
	return false;
}

// Find the closest relative with a given property value (property defaults to tagName, relative defaults to parentNode)
function findRelated(e,value,name,relative)
{
	name = name ? name : "tagName";
	relative = relative ? relative : "parentNode";
	if(name == "className") {
		while(e && !hasClass(e,value)) {
			e = e[relative];
		}
	} else {
		while(e && e[name] != value) {
			e = e[relative];
		}
	}
	return e;
}

// Resolve the target object of an event
function resolveTarget(e)
{
	var obj;
	if(e.target)
		obj = e.target;
	else if(e.srcElement)
		obj = e.srcElement;
	if(obj.nodeType == 3) // defeat Safari bug
		obj = obj.parentNode;
	return obj;
}

// Return the content of an element as plain text with no formatting
function getPlainText(e)
{
	var text = "";
	if(e.innerText)
		text = e.innerText;
	else if(e.textContent)
		text = e.textContent;
	return text;
}

// Get the scroll position for window.scrollTo necessary to scroll a given element into view
function ensureVisible(e)
{
	var posTop = findPosY(e);
	var posBot = posTop + e.offsetHeight;
	var winTop = findScrollY();
	var winHeight = findWindowHeight();
	var winBot = winTop + winHeight;
	if(posTop < winTop) {
		return posTop;
	} else if(posBot > winBot) {
		if(e.offsetHeight < winHeight)
			return posTop - (winHeight - e.offsetHeight);
		else
			return posTop;
	} else {
		return winTop;
	}
}

// Get the current width of the display window
function findWindowWidth()
{
	return window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
}

// Get the current height of the display window
function findWindowHeight()
{
	return window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
}

// Get the current horizontal page scroll position
function findScrollX()
{
	return window.scrollX ? window.scrollX : document.documentElement.scrollLeft;
}

// Get the current vertical page scroll position
function findScrollY()
{
	return window.scrollY ? window.scrollY : document.documentElement.scrollTop;
}

function findPosX(obj)
{
	var curleft = 0;
	while(obj.offsetParent) {
		curleft += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	return curleft;
}

function findPosY(obj)
{
	var curtop = 0;
	while(obj.offsetParent) {
		curtop += obj.offsetTop;
		obj = obj.offsetParent;
	}
	return curtop;
}

// Blur a particular element
function blurElement(e)
{
	if(e != null && e.focus && e.blur) {
		e.focus();
		e.blur();
	}
}

// Create a non-breaking space
function insertSpacer(place)
{
	var e = document.createTextNode(String.fromCharCode(160));
	if(place)
		place.appendChild(e);
	return e;
}

// Remove all children of a node
function removeChildren(e)
{
	while(e && e.hasChildNodes())
		removeNode(e.firstChild);
}

// Remove a node and all it's children
function removeNode(e)
{
	scrubNode(e);
	e.parentNode.removeChild(e);
}

// Remove any event handlers or non-primitve custom attributes
function scrubNode(e)
{
	if(!config.browser.isIE)
		return;
	var att = e.attributes;
	if(att) {
		for(var t=0; t<att.length; t++) {
			var n = att[t].name;
			if(n !== 'style' && (typeof e[n] === 'function' || (typeof e[n] === 'object' && e[n] != null))) {
				try {
					e[n] = null;
				} catch(ex) {
				}
			}
		}
	}
	var c = e.firstChild;
	while(c) {
		scrubNode(c);
		c = c.nextSibling;
	}
}

// Add a stylesheet, replacing any previous custom stylesheet
function setStylesheet(s,id,doc)
{
	if(!id)
		id = "customStyleSheet";
	if(!doc)
		doc = document;
	var n = doc.getElementById(id);
	if(doc.createStyleSheet) {
		// Test for IE's non-standard createStyleSheet method
		if(n)
			n.parentNode.removeChild(n);
		// This failed without the &nbsp;
		doc.getElementsByTagName("head")[0].insertAdjacentHTML("beforeEnd","&nbsp;<style id='" + id + "'>" + s + "</style>");
	} else {
		if(n) {
			n.replaceChild(doc.createTextNode(s),n.firstChild);
		} else {
			n = doc.createElement("style");
			n.type = "text/css";
			n.id = id;
			n.appendChild(doc.createTextNode(s));
			doc.getElementsByTagName("head")[0].appendChild(n);
		}
	}
}

// Force the browser to do a document reflow when needed to workaround browser bugs
function forceReflow()
{
	if(config.browser.isGecko) {
		setStylesheet("body {top:-1em;margin-top:1em;}");
		setStylesheet("");
	}
}

// Replace the current selection of a textarea or text input and scroll it into view
function replaceSelection(e,text)
{
	if(e.setSelectionRange) {
		var oldpos = e.selectionStart;
		var isRange = e.selectionEnd > e.selectionStart;
		e.value = e.value.substr(0,e.selectionStart) + text + e.value.substr(e.selectionEnd);
		e.setSelectionRange(isRange ? oldpos : oldpos + text.length,oldpos + text.length);
		var linecount = e.value.split('\n').length;
		var thisline = e.value.substr(0,e.selectionStart).split('\n').length-1;
		e.scrollTop = Math.floor((thisline - e.rows / 2) * e.scrollHeight / linecount);
	} else if(document.selection) {
		var range = document.selection.createRange();
		if(range.parentElement() == e) {
			var isCollapsed = range.text == "";
			range.text = text;
			if(!isCollapsed) {
				range.moveStart('character', -text.length);
				range.select();
			}
		}
	}
}

// Returns the text of the given (text) node, possibly merging subsequent text nodes
function getNodeText(e)
{
	var t = "";
	while(e && e.nodeName == "#text") {
		t += e.nodeValue;
		e = e.nextSibling;
	}
	return t;
}

//--
//-- LoaderBase and SaverBase
//--

function LoaderBase() {}

LoaderBase.prototype.loadTiddler = function(store,node,tiddlers)
{
	var title = this.getTitle(store,node);
	if(title) {
		var tiddler = store.createTiddler(title);
		this.internalizeTiddler(store,tiddler,title,node);
		tiddlers.push(tiddler);
	}
};

LoaderBase.prototype.loadTiddlers = function(store,nodes)
{
	var tiddlers = [];
	for(var t = 0; t < nodes.length; t++) {
		try {
			this.loadTiddler(store,nodes[t],tiddlers);
		} catch(ex) {
			showException(ex,config.messages.tiddlerLoadError.format([this.getTitle(store,nodes[t])]));
		}
	}
	return tiddlers;
};


function SaverBase() {}

SaverBase.prototype.externalize = function(store,isShadowed)
{
	var isShadowed = (typeof isShadowed != 'undefined');
	var results = [];
	var tiddlers = store.getTiddlers("title");
	for(var t = 0; t < tiddlers.length; t++)
		results.push(isShadowed?this.externalizeShadow(store,tiddlers[t]):this.externalizeTiddler(store,tiddlers[t]));
	return results.join("\n");
};
//--
//-- TW21Loader (inherits from LoaderBase)
//--

function TW21Loader() {}

TW21Loader.prototype = new LoaderBase();

TW21Loader.prototype.getTitle = function(store,node)
{
	var title = null;
	if(node.getAttribute) {
		title = node.getAttribute("title");
		if(!title)
			title = node.getAttribute("tiddler");
	}
	if(!title && node.id) {
		var lenPrefix = store.idPrefix.length;
		if (node.id.substr(0,lenPrefix) == store.idPrefix)
			title = node.id.substr(lenPrefix);
	}
	return title;
};

TW21Loader.prototype.internalizeTiddler = function(store,tiddler,title,node)
{
	var e = node.firstChild;
	var text = null;
	if(node.getAttribute("tiddler")) {
		text = getNodeText(e).unescapeLineBreaks();
	} else {
		while(e.nodeName!="PRE" && e.nodeName!="pre") {
			e = e.nextSibling;
		}
		text = e.innerHTML.replace(/\r/mg,"").htmlDecode();
	}
	var modifier = node.getAttribute("modifier");
	var c = node.getAttribute("created");
	var m = node.getAttribute("modified");
	var created = c ? Date.convertFromYYYYMMDDHHMM(c) : version.date;
	var modified = m ? Date.convertFromYYYYMMDDHHMM(m) : created;
	var tags = node.getAttribute("tags");
	var fields = {};
	var attrs = node.attributes;
	for(var i = attrs.length-1; i >= 0; i--) {
		var name = attrs[i].name;
		if (attrs[i].specified && !TiddlyWiki.isStandardField(name)) {
			fields[name] = attrs[i].value.unescapeLineBreaks();
		}
	}
	tiddler.assign(title,text,modifier,modified,tags,created,fields);
	return tiddler;
};

//--
//-- TW21Saver (inherits from SaverBase)
//--

function TW21Saver() {}

TW21Saver.prototype = new SaverBase();

TW21Saver.prototype.externalizeTiddler = function(store,tiddler)
{
	try {
		var extendedAttributes = "";
		var usePre = config.options.chkUsePreForStorage;
		store.forEachField(tiddler,
			function(tiddler,fieldName,value) {
				// don't store stuff from the temp namespace
				if(typeof value != "string")
					value = "";
				if (!fieldName.match(/^temp\./))
					extendedAttributes += ' %0="%1"'.format([fieldName,value.escapeLineBreaks().htmlEncode()]);
			},true);
		var created = tiddler.created.convertToYYYYMMDDHHMM();
		var modified = tiddler.modified.convertToYYYYMMDDHHMM();
		var vdate = version.date.convertToYYYYMMDDHHMM();
		var attributes = tiddler.modifier ? ' modifier="' + tiddler.modifier.htmlEncode() + '"' : "";
		attributes += (usePre && modified == created) ? "" : ' modified="' + modified +'"';
		attributes += (usePre && created == vdate) ? "" :' created="' + created + '"';
		var tags = tiddler.getTags();
		if(!usePre || tags)
			attributes += ' tags="' + tags.htmlEncode() + '"';
		return ('<div %0="%1"%2%3>%4</'+'div>').format([
				usePre ? "title" : "tiddler",
				tiddler.title.htmlEncode(),
				attributes,
				extendedAttributes,
				usePre ? "\n<pre>" + tiddler.text.htmlEncode() + "</pre>\n" : tiddler.text.escapeLineBreaks().htmlEncode()
			]);
	} catch (ex) {
		throw exceptionText(ex,config.messages.tiddlerSaveError.format([tiddler.title]));
	}
};

TW21Saver.prototype.externalizeShadow = function(store,tiddler)
{
	try {
		var extendedAttributes = "";
		var usePre = config.options.chkUsePreForStorage;
		store.forEachField(tiddler,
			function(tiddler,fieldName,value) {
				// don't store stuff from the temp namespace
				if(typeof value != "string")
					value = "";
				if (!fieldName.match(/^temp\./))
					extendedAttributes += ' %0="%1"'.format([fieldName,value.escapeLineBreaks().htmlEncode()]);
			},true);
		var attributes = tiddler.modifier ? ' modifier="' + tiddler.modifier.htmlEncode() + '"' : "";
		var tags = tiddler.getTags();
		if(!usePre || tags)
			attributes += ' tags="' + tags.htmlEncode() + '"';
		return ('<div %0="%1"%2%3>%4</'+'div>').format([
				usePre ? "title" : "tiddler",
				tiddler.title.htmlEncode(),
				attributes,
				extendedAttributes,
				usePre ? "\n<pre>" + tiddler.text.htmlEncode() + "</pre>\n" : tiddler.text.escapeLineBreaks().htmlEncode()
			]);
	} catch (ex) {
		throw exceptionText(ex,config.messages.tiddlerSaveError.format([tiddler.title]));
	}
};//--
//-- Deprecated code
//--

// @Deprecated: Use createElementAndWikify and this.termRegExp instead
config.formatterHelpers.charFormatHelper = function(w)
{
	w.subWikify(createTiddlyElement(w.output,this.element),this.terminator);
};

// @Deprecated: Use enclosedTextHelper and this.lookaheadRegExp instead
config.formatterHelpers.monospacedByLineHelper = function(w)
{
	var lookaheadRegExp = new RegExp(this.lookahead,"mg");
	lookaheadRegExp.lastIndex = w.matchStart;
	var lookaheadMatch = lookaheadRegExp.exec(w.source);
	if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
		var text = lookaheadMatch[1];
		if(config.browser.isIE)
			text = text.replace(/\n/g,"\r");
		createTiddlyElement(w.output,"pre",null,null,text);
		w.nextMatch = lookaheadRegExp.lastIndex;
	}
};

// @Deprecated: Use <br> or <br /> instead of <<br>>
config.macros.br.handler = function(place)
{
	createTiddlyElement(place,"br");
};

// Find an entry in an array. Returns the array index or null
// @Deprecated: Use indexOf instead
Array.prototype.find = function(item)
{
	var i = this.indexOf(item);
	return i == -1 ? null : i;
};

// Load a tiddler from an HTML DIV. The caller should make sure to later call Tiddler.changed()
// @Deprecated: Use store.getLoader().internalizeTiddler instead
Tiddler.prototype.loadFromDiv = function(divRef,title)
{
	return store.getLoader().internalizeTiddler(store,this,title,divRef);
};

// Format the text for storage in an HTML DIV
// @Deprecated Use store.getSaver().externalizeTiddler instead.
Tiddler.prototype.saveToDiv = function()
{
	return store.getSaver().externalizeTiddler(store,this);
};

// @Deprecated: Use store.allTiddlersAsHtml() instead
function allTiddlersAsHtml()
{
	return store.allTiddlersAsHtml();
}

// @Deprecated: Use refreshPageTemplate instead
function applyPageTemplate(title)
{
	refreshPageTemplate(title);
}

// @Deprecated: Use story.displayTiddlers instead
function displayTiddlers(srcElement,titles,template,unused1,unused2,animate,unused3)
{
	story.displayTiddlers(srcElement,titles,template,animate);
}

// @Deprecated: Use story.displayTiddler instead
function displayTiddler(srcElement,title,template,unused1,unused2,animate,unused3)
{
	story.displayTiddler(srcElement,title,template,animate);
}

// @Deprecated: Use functions on right hand side directly instead
var createTiddlerPopup = Popup.create;
var scrollToTiddlerPopup = Popup.show;
var hideTiddlerPopup = Popup.remove;

// @Deprecated: Use right hand side directly instead
var regexpBackSlashEn = new RegExp("\\\\n","mg");
var regexpBackSlash = new RegExp("\\\\","mg");
var regexpBackSlashEss = new RegExp("\\\\s","mg");
var regexpNewLine = new RegExp("\n","mg");
var regexpCarriageReturn = new RegExp("\r","mg");
//--
//-- End of scripts
//--
