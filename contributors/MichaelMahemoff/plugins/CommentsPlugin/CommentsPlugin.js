/***
|Name|CommentsPlugin|
|Description|Macro for nested comments, where each comment is a separate tiddler.|
|Source|http://tiddlyguv.org/CommentsPlugin.html#CommentsPlugin|
|Documentation|http://tiddlyguv.org/CommentsPlugin.html#CommentsPluginInfo|
|Version|0.1|
|Author|Michael Mahemoff, Osmosoft|
|''License:''|[[BSD open source license]]|
|~CoreVersion|2.2|
***/

//# TODO
//# Refactor:
//#    - consistent naming for *Tiddler, *El (element) etc.
//#    - send subject around less (and other params). just use parent.subject
//#  
//#  Enhance:
//#    - options - styling, date format, etc etc
//#    - edit comments in-place (may not be worth it?)
//#    - when you close an incomplete comment and re-open it, retain the comment

//##############################################################################
//# CONFIG
//##############################################################################

DATE_FORMAT = "DDD, MMM DDth, YYYY hh12:0mm:0ss am";

//##############################################################################
//# COLLECTION CLOSURES
//##############################################################################

function forEach(list, visitor) { for (var i=0; i<list.length; i++) visitor(list[i]); }
function select(list, selector) { 
  var selection = [];
  forEach(list, function(currentItem) {
    if (selector(currentItem)) { selection.push(currentItem); }
  });
  return selection;
}
function map(list, mapper) { 
  var mapped = [];
  forEach(list, function(currentItem) { mapped.push(mapper(currentItem)); });
  return mapped;
}

function remove(list, unwantedItem) {
  return select(list,
        function(currentItem) { return currentItem!=unwantedItem; });
}

//##############################################################################
//# TIDDLYWIKI UTILS
//##############################################################################

function copyFields(fromTiddler, toTiddler, field1, field2, fieldN) {
  for (var i=2; i<arguments.length; i++) {
    fieldKey = arguments[i];
    toTiddler.fields[fieldKey] = fromTiddler.fields[fieldKey];
  }
}

//################################################################################
//# RELATIONSHIP MANAGEMENT
//#
//# This establishes a tree model for a collection of tiddlers. Each tiddler in the
//# tree always has three properties: "daddy", "children", and "root"). ("daddy"
//# is used because "parent" is already overloaded in web-based Javascript to mean
//# the parent frame.) The relationships are persisted using the extended fields
//# model, but manipulated using direct pointers to other tiddlers (ie daddy
//# points to the daddy tiddler, children is an array of child tiddlers, and
//# root points to the root tiddler).
//# 
//# For daddy and root, the stored value
//# is the tiddler title. Or an empty string if there is none (only during
//# construction, as there should *always* be a daddy and a root - even the root
//# element has a daddy and a root - both of these point to itself, which is a
//# popular and convenient idiom in tree algorithms. For children, the value is 
//# a comma-separated list of zero or more tiddlers.
//# 
//# The functions are low-level and afford direct manipulation of the three
//# fields. No attempt is made to check integrity - the caller is responsible
//# for ensuring referenced tiddlers exist, and root, daddy, and chldren across
//# all tiddlers are consistent with each other, avoiding any circular references
//# 
//# The functions abstract away manipulation of tiddler fields. As a user of 
//# these functions, you work directly 
//# with relationship expandos -> tiddler.root, and tiddler.parent,
//# tiddler.children
//# To endow a tiddler with relationships:
//#   - load or create the tiddler from the store
//#   - call tiddler.initialiseRelationships()
//#     This will establish relationship expandos, or if it already contains
//#     that
//#       relationship data, the expandos will be populated.
//#     You can now manipulate the expandos directly.
//#   - call tiddler.serialiseRelationships() to set fields from the expandos,
//#   so the 
//#     tiddler is ready for saving. You will need to make your own arrangements 
//#     for the tiddler to be saved subsequently (e.g. call autoSaveChanges()).
//# 
//################################################################################

Tiddler.prototype.initialiseRelationships = function() {
  if (this.fields.daddy && this.fields.root && this.fields.children) {
    this._deserialiseRelationships();
    return false;
  } else {
    this.daddy = this.root = null;
    this.children = [];
    return true;
  }
}

Tiddler.prototype.serialiseRelationships = function() {
  var childrenString = "";
  forEach(this.children, function(child) { childrenString += child.title+","; });
  this.fields.children = childrenString.substr(0, childrenString.length-1); // drop ","

  this.fields.daddy = this.daddy ? this.daddy.title : "";
  this.fields.root = this.root ? this.root.title : "";
}

Tiddler.prototype._deserialiseRelationships = function() {
  this.daddy = store.getTiddler(this.fields.daddy);
  this.root = store.fetchTiddler(this.fields.root);
  var childrenTitles = this.fields.children.length > 0 ? this.fields.children.split(",") :[];
  this.children = map(childrenTitles,
                    function(childTitle) { return store.fetchTiddler(childTitle); });
  if (this.children.length)
    forEach(this.children, function(child) { child._deserialiseRelationships(); });
}

//################################################################################
//# MACRO INITIALISATION
//################################################################################

config.macros.comments = {

  handler: function(place,macroName,params,wikifier,paramstring,tiddler) {
    createOrThawRelationships(tiddler);
    buildCommentsArea(tiddler, place);
    refreshComments(tiddler);
  }

};

//################################################################################
//# MACRO VIEW - RENDERING COMMENTS
//################################################################################

function buildCommentsArea(rootTiddler, place) {
  var suffix = "_" + rootTiddler.title.trim();
  var commentsArea = createTiddlyElement(place, "div", null, "commentsArea");
  var heading = createTiddlyElement(commentsArea, "h2", null, "", "Comments");
  var comments = createTiddlyElement(commentsArea, "div", null, "");
  rootTiddler.commentsEl = comments;
  createTiddlyElement(commentsArea, "div");
  var newCommentArea = createTiddlyElement(commentsArea, "div", null, "newCommentArea", "New comment:");
  var newCommentEl = createTiddlyElement(newCommentArea, "textarea");
  newCommentEl.rows = 4;
  newCommentEl.cols = 80;
  var addComment = createTiddlyElement(newCommentArea, "button", null, null, "Add Comment");
  addComment.onclick = function() {
    createComment(newCommentEl.value, rootTiddler); 
    refreshComments(rootTiddler);
    newCommentEl.value = "";
  };
}

function refreshComments(rootTiddler) {
  removeChildren(rootTiddler.commentsEl);
  forEach(rootTiddler.children, function(comment) {
     refreshComment(rootTiddler, comment, 0);
  });
}

function refreshComment(rootTiddler, comment, offsetEms) {

  var commentEl = buildCommentEl(comment);
  commentEl.style.marginLeft = offsetEms + "em";
  offsetEms += 2;
  rootTiddler.commentsEl.appendChild(commentEl);

  forEach(comment.children, function(child) {
    refreshComment(rootTiddler, child, offsetEms);
  });

}

function buildCommentEl(comment) {

  // COMMENT ELEMENT
  var commentEl = document.createElement("div");
  commentEl.className = "comment";

  // HEADING <- METAINFO AND DELETE
  var headingEl = createTiddlyElement(commentEl, "div");

  var metaInfoEl = createTiddlyElement(headingEl, "div", null, "commentTitle",  comment.modifier + '@' + comment.modified.formatString(DATE_FORMAT));
  metaInfoEl.onclick = function() { 
    story.closeAllTiddlers();
    story.displayTiddler("bottom", comment.title, null, true);
    document.location.hash = "#" + comment.title;
  };

  var deleteEl = createTiddlyElement(headingEl, "div", null, "deleteComment", "X");
  deleteEl.onclick = function() {
    if (true || confirm("Delete this comment and all of its replies?")) {
      deleteTiddlerAndDescendents(comment);
      refreshComments(comment.root);
    }
  };

  // TEXT
  commentEl.text = createTiddlyElement(commentEl, "div", null, "commentText");
  wikify(comment.text, commentEl.text);

  // REPLY LINK
  var replyLink = createTiddlyElement(commentEl, "span", null, "replyLink", "reply to this comment");
  replyLink.onclick = function() { openReplyLink(comment, commentEl, replyLink); };

  // RETURN
  return commentEl;

}

function openReplyLink(commentTiddler, commentEl, replyLink) {
  if (commentEl.replyEl) {
    commentEl.replyEl.style.display = "block";
    return;
  }

  commentEl.replyEl = document.createElement("div");
  commentEl.replyEl.style.marginLeft = "2em";

  replyLink.style.display = "none";
  var newReplyHeading = createTiddlyElement(commentEl.replyEl, "div", null, "newReply");
  createTiddlyElement(newReplyHeading, "div", null, "newReplyLabel", "New Reply:");
  var closeNewReply = createTiddlyElement(newReplyHeading, "div", null, "closeNewReply", "close");
  closeNewReply.onclick = function() {
    commentEl.replyEl.style.display = "none";
    replyLink.style.display = "block";
  };

  var replyText =  createTiddlyElement(commentEl.replyEl, "textarea");
  replyText.cols = 80; replyText.rows = 4;
  var submitReply =  createTiddlyElement(commentEl.replyEl, "button", null, null, "Reply");
  submitReply.onclick = function() { 
    var newComment = createComment(replyText.value, commentTiddler);
    refreshComments(newComment.root);
  };

  commentEl.appendChild(commentEl.replyEl);
}

//################################################################################
//# MACRO MODEL - MANIPULATING TIDDLERS
//################################################################################

function createOrThawRelationships(rootTiddler) {
  if (rootTiddler.initialiseRelationships()) { // recursively thaws if already exists
    rootTiddler.root = rootTiddler; // make top point to self
    rootTiddler.daddy = rootTiddler;
    rootTiddler.serialiseRelationships();
    autoSaveChanges();
  }
}

function createComment(text, daddy) {
  var newComment =  store.saveTiddler(null, "comment"+((new Date()).getTime()));
  var now = new Date();
  newComment.set(null, text, config.options.txtUserName, now, ["comment"], now);
  newComment.initialiseRelationships();
  newComment.daddy = daddy;
  newComment.root = daddy.root;
  daddy.children.push(newComment);
  newComment.serialiseRelationships();
  daddy.serialiseRelationships();
  copyFields(daddy, newComment,
    "server.bag", "server.host", "server.page.revision", "server.type", "server.workspace");
  refreshComments(newComment.root);
  autoSaveChanges();
  return newComment;
}

function deleteTiddlerAndDescendents(tiddler) {
  var daddy = tiddler.daddy;
  if (daddy) daddy.children = remove(daddy.children, tiddler);
  daddy.serialiseRelationships();

  var children = tiddler.children;
  store.deleteTiddler(tiddler.title);
  forEach(children, function(tiddler) {
    deleteTiddlerAndDescendents(tiddler);
  });
  autoSaveChanges();
}

//################################################################################
//# CUSTOM STYLESHEET
//################################################################################

// inspired by http://svn.tiddlywiki.org/Trunk/contributors/SaqImtiaz/plugins/DropDownMenuPlugin/DropDownMenuPlugin.js, suggested by Saq Imtiaz
config.shadowTiddlers["StyleSheetCommentsPlugin"] = 

".commentsArea h1 { margin-bottom: 0; padding-bottom: 0; }\n" +
".comments { padding: 0; }\n" +

".comment { background: #fcf; border: 1px solid #f9f; padding: 0.3em 0.6em 0.3em 0.3em; margin: 0 0 0.5em; }\n" +
".comment .toolbar .button { border: 0; color: #9a4; }\n" +
".commentTitle { font-size: 1em; opacity: 0.6; filter: alpha(opacity=60); float: left; }\n" +
".commentTitle:hover { text-decoration: underline; cursor: pointer; }\n" +
".commentText { clear: both; }\n" +
".deleteComment { float: right; cursor: pointer; text-decoration:underline; color:[[ColorPalette::SecondaryDark]]; }\n" +

".comment .replyLink { color:[[ColorPalette::SecondaryDark]]; font-style: italic; \n" +
                      "cursor: pointer; text-decoration: underline; margin: 0 auto; }\n" +
".comment .created { }\n" +
".comment .newReply { color:[[ColorPalette::SecondaryDark]]; margin-top: 1em; }\n" +
".newReplyLabel { float: left; }\n" +
".closeNewReply { cursor: pointer; float: right; text-decoration: underline; }\n" +

".commentsArea textarea { width: 100%; }\n";
store.addNotification("StyleSheetCommentsPlugin", refreshStyles);
