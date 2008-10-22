/*
  Encapsulate it all in a single namespace object
*/

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

/* TODO 
  Don't autosavechanges on each delete recursion - create an outside wrapper fn
  Cascade comment delete when the top-level tiddler is deleted
*/

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
//# Children are held in a singly linked list structure.
//#
//# The root tiddler (containing comments macro) and all of its comments have
//# one or more of the following custom fields:
//#   - daddy: title of parent tiddler ("parent" is already used in DOM, hence "daddy")
//#   - firstchild: title of first child
//#   - nextchild: title of next child in the list (ie its sibling). New comments are always
//#     appended to the list of siblings at the end, if it exists.
//#
//# Iff daddy is undefined, this is the root in the hierarchy (ie what the comments are about,
//#   and not tagged "comment")
//# Iff firstchild is undefined, this tiddler has no children
//# Iff nextchild is undefined, this tiddler is the most 
//#
//# Incidentally, the only redundancy with this structure is with "daddy" field. This field exists only
//# to give the comment some context in isolation. It's redundant as it could be derived
//# from inspecting all tiddlers' firstchild and nextchild properties. However, 
//# that would be exceedingly slow, especially where the tiddlers live on a server.
//#
//################################################################################

//################################################################################
//# MACRO INITIALISATION
//################################################################################

// setStylesheet(store.getRecursiveTiddlerText(tiddler.title + "##StyleSheet"),"comments");
// var stylesheet = store.getRecursiveTiddlerText(tiddler.title + "##StyleSheet");
var stylesheet = store.getTiddlerText(tiddler.title + "##StyleSheet");
config.shadowTiddlers["StyleSheetCommentsPlugin"] = stylesheet;
store.addNotification("StyleSheetCommentsPlugin", refreshStyles);

config.macros.comments = {

  handler: function(place,macroName,params,wikifier,paramstring,tiddler) {
    // tiddler.initialiseRelationships();
    buildCommentsArea(tiddler, place);
    refreshCom(story.getTiddler(tiddler.title).commentsEl, tiddler);
  }

};

/*
function setupSequenceTiddler() {
  if (store.getTiddler("commentSequence")) return;
  log("new seq");
  // store.saveTiddler("commentSequence", "commentSequence", 1);
  var commentSeq =  store.createTiddler("commentSequence");
  // commmentSeq.modifier = config.options.txtUserName;
  commentSeq.text = "0"
  store.saveTiddler(commentSeq.title);
  saveChanges(false);
}
*/

//################################################################################
//# MACRO VIEW - RENDERING COMMENTS
//################################################################################

function buildCommentsArea(rootTiddler, place) {
  var suffix = "_" + rootTiddler.title.trim();
  var commentsArea = createTiddlyElement(place, "div", null, "comments");
  var heading = createTiddlyElement(commentsArea, "h2", null, "", "Comments");
  var comments = createTiddlyElement(commentsArea, "div", null, "");
  story.getTiddler(rootTiddler.title).commentsEl = comments;
  createTiddlyElement(commentsArea, "div");
  var newCommentArea = createTiddlyElement(commentsArea, "div", null, "newCommentArea", "New comment:");
  var newCommentEl = createTiddlyElement(newCommentArea, "textarea");
  newCommentEl.rows = 1;
  newCommentEl.cols = 80;
  var addComment = createTiddlyElement(newCommentArea, "button", null, null, "Add Comment");
  addComment.onclick = function() {
    var comment = createComment(newCommentEl.value, rootTiddler); 
    // refreshComments(comment);
    // appendComment(comment, rootTiddler.commentsEl, newCommentArea);
    newCommentEl.value = "";
  };
}

/*
function appendComment(comment, parentEl, nextEl) {
  var commentEl = buildCommentEl(comment);
  parentEl.insertBefore(commentEl, nextEl);
}
*/
var count = 0;
function refreshCom(daddyCommentsEl, tiddler) {

  var refreshedEl;
  if (tiddler.isTagged("comment")) {
    var commentEl = buildCommentEl(daddyCommentsEl, tiddler);
    // rootTiddler.commentsEl.appendChild(commentEl);
    // log("daddy element", story.getTiddler(tiddler.fields.daddy));
    // story.getTiddler(tiddler.fields.daddy).commentsEl.appendChild(commentEl);
    daddyCommentsEl.appendChild(commentEl);
    refreshedEl = commentEl;
  } else {
    // log("render non-comment");
    removeChildren(daddyCommentsEl);
    refreshedEl = story.getTiddler(tiddler.title);
  }

   // log("start child loop for ", tiddler, "first child:", tiddler.fields.firstchild);
  prev=null;
  for (var child = store.getTiddler(tiddler.fields.firstchild); child; child = store.getTiddler(child.fields.nextchild)) {
     if (prev==child) {
        console.log(prev, child, "breaking");
        break;
      }
     // log("tiddler and child", refreshedEl, tiddler, child);
     refreshCom(refreshedEl.commentsEl, child);
     prev = child;
  }
   // log("end child loop for " + tiddler.title);

}

/*
function refreshComment(rootTiddler, comment, offsetEms) {

  var commentEl = buildCommentEl(comment);
  commentEl.style.marginLeft = offsetEms + "em";
  offsetEms += 2;
  rootTiddler.commentsEl.appendChild(commentEl);

  for (var child = store.getTiddler(rootTiddler.fields.firstchild); child; child = store.getTiddler(child.nextchild)) {
    refreshComment(rootTiddler, child, offsetEms);
  }

}
*/

function buildCommentEl(daddyCommentsEl, comment) {

  // COMMENT ELEMENT
  var commentEl = document.createElement("div");
  commentEl.className = "comment";

  // HEADING <- METAINFO AND DELETE
  var headingEl = createTiddlyElement(commentEl, "div", null, "heading");

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
      log("refreshing inside", daddyCommentsEl);
      commentEl.parentNode.removeChild(commentEl);
    }
  };

  // TEXT
  commentEl.text = createTiddlyElement(commentEl, "div", null, "commentText");
  wikify(comment.text, commentEl.text);

  // REPLY LINK
  var replyLink = createTiddlyElement(commentEl, "span", null, "replyLink", "reply to this comment");
  replyLink.onclick = function() { openReplyLink(comment, commentEl, replyLink); };

  // COMMENTS AREA - MM NEW
  commentEl.commentsEl = createTiddlyElement(commentEl, "div", null, "comments");

  // RETURN
  return commentEl;

}

function openReplyLink(commentTiddler, commentEl, replyLink) {
  if (commentEl.replyEl) {
    commentEl.replyEl.style.display = "block";
    return;
  }

  commentEl.replyEl = document.createElement("div");
  commentEl.replyEl.className = "reply";

  replyLink.style.display = "none";
  var newReplyHeading = createTiddlyElement(commentEl.replyEl, "div", null, "newReply");
  createTiddlyElement(newReplyHeading, "div", null, "newReplyLabel", "New Reply:");
  var closeNewReply = createTiddlyElement(newReplyHeading, "div", null, "closeNewReply", "close");
  closeNewReply.onclick = function() {
    commentEl.replyEl.style.display = "none";
    replyLink.style.display = "block";
  };

  var replyText =  createTiddlyElement(commentEl.replyEl, "textarea");
  replyText.cols = 80; replyText.rows = 1;
  var submitReply =  createTiddlyElement(commentEl.replyEl, "button", null, null, "Reply");
  submitReply.onclick = function() { 
    var newComment = createComment(replyText.value, commentTiddler);
    replyText.value = "";
    closeNewReply.onclick();
    refreshCom(commentEl.commentsEl, newComment);
  };

  commentEl.insertBefore(commentEl.replyEl, commentEl.commentsEl);
}

//################################################################################
//# MACRO MODEL - MANIPULATING TIDDLERS
//################################################################################

// commentSeq = 0;
function createComment(text, daddy) {


  var newComment =  store.createTiddler("comment"+((new Date()).getTime()));

  /*
    doesn't work due to some persistence issue i don't grok!
  var commentSeq =  store.getTiddler("commentSequence");
  if (!commentSeq) {
    log("NEW SEQ");
    commentSeq =  store.createTiddler("commentSequence");
    commentSeq.text = "0"
  }
  commentSeq.text = parseInt(commentSeq.text) + 1;
  log("the seq", commentSeq);
  // commmentSeq.modifier = config.options.txtUserName;
  var newComment =  store.createTiddler("comment"+commentSeq.text);
  store.saveTiddler("commentSequence", "commentSequence");
  */

  // var newComment =  store.saveTiddler(null, "comment"+(++commentSeq));
  // log(store.getTiddler("commentSequence"));
  // log("COMMENT SEQ", commentSeq);
  // store.getTiddler("commentSequence").text = commentSeq + 1;
  // store.saveTiddler("commentSequence");
  // saveChanges(false);
  // log("sAved");

  // var newComment =  store.createTiddler("comment"+(++commentSeq));
  var now = new Date();
  newComment.set(null, text, config.options.txtUserName, now, ["comment"], now, {});

  newComment.fields.daddy = daddy.title;
  copyFields(daddy, newComment,
    "server.bag", "server.host", "server.page.revision", "server.type", "server.workspace");

  if (!daddy.fields.firstchild) {
    daddy.fields.firstchild = newComment.title;
    log("createComment - daddy has no child");
  } else {
    for (last = store.getTiddler(daddy.fields.firstchild); last.fields.nextchild; last = store.getTiddler(last.fields.nextchild)) {}
      last.fields.nextchild = newComment.title;
      store.saveTiddler(last.fields.nextchild);
  }
  // console.log(newComment.title, daddy.fields.firstchild, daddy, newComment);

  store.saveTiddler(newComment.title);
  store.saveTiddler(daddy.title);
  // saveChanges(false, [daddy, newComment, store.getTiddler("commentSequence")]); // TODO dont always save daddy
  saveChanges(false);
  return newComment;
}

function deleteTiddlerAndDescendents(tiddler) {
  var daddy = store.getTiddler(tiddler.fields.daddy);
  log("delete", tiddler, tiddler.fields.daddy);
  log("daddy", daddy);
  if (daddy.fields.firstchild==tiddler.title) {
    log("deleting firstChild", daddy, tiddler);
    log("tiddlr.nextchild?", tiddler.fields.nextchild);
    tiddler.fields.nextchild ? daddy.fields.firstchild = tiddler.fields.nextchild :
                        delete daddy.fields.firstchild;
    store.saveTiddler(daddy.title);
  } else {
    for (prev = store.getTiddler(daddy.fields.firstchild); prev.fields.nextchild!=tiddler.title; prev = store.getTiddler(prev.fields.nextchild))
      ;
    log("before - prev fields", prev.fields.nextchild);
    log("tiddler nxt", tiddler.fields.nextchild);
    log("deleting from prev", prev, tiddler.fields.nextchild);
    tiddler.fields.nextchild ? prev.fields.nextchild = tiddler.fields.nextchild :
                               delete prev.fields.nextchild;
    log("after - prev fields", prev.fields.nextchild);
    store.saveTiddler(prev.title);
  }

  // for (child = store.getTiddler(tiddler.fields.firstchild); child; child = store.getTiddler(child.fields.nextchild)) {
    // log("going to delete ", child);
    // deleteTiddlerAndDescendents(child);
  // }

  var child = store.getTiddler(tiddler.fields.firstchild);
  while (child) {
    var nextchild = store.getTiddler(child.fields.nextchild);
    deleteTiddlerAndDescendents(child);
    child = nextchild;
  }

  log("deleting from store", tiddler.title);
  store.deleteTiddler(tiddler.title);

  autoSaveChanges(false);
}

//################################################################################
//# CUSTOM STYLESHEET
//################################################################################

/***
!StyleSheet

.comments h1 { margin-bottom: 0; padding-bottom: 0; }
.comments { padding: 0;  overflow:hidden;}
.comment .comments { margin-left: 1em; }

.comment { padding: 0 0 1em 0; margin: 1em 0 0; }
.comment .toolbar .button { border: 0; color: #9a4; }
.comment .heading { background: [[ColorPalette::PrimaryPale]]; color: [[ColorPalette::PrimaryDark]]; border-bottom: 1px solid [[ColorPalette::PrimaryLight]]; border-right: 1px solid [[ColorPalette::PrimaryLight]]; padding: 0.15em; height: 1.3em; }
.commentTitle { float: left; }
.commentTitle:hover { text-decoration: underline; cursor: pointer; }
.commentText { clear: both; padding: 1em 0; }
.deleteComment { float: right; cursor: pointer; text-decoration:underline; color:[[ColorPalette::SecondaryDark]]; padding-right: 0.3em; }
.comment .reply { margin-left: 1em; }
.comment .replyLink { color:[[ColorPalette::SecondaryDark]]; font-style: italic; 
                     cursor: pointer; text-decoration: underline; margin: 0 0.0em; }
.comment .created { }
.comment .newReply { color:[[ColorPalette::SecondaryDark]]; margin-top: 1em; }
.newReplyLabel { float: left; }
.closeNewReply { cursor: pointer; float: right; text-decoration: underline; }
.comments textarea { width: 100%; }

!(end of StyleSheet)

***/

function log() { console.log.apply(null, arguments); }
