/* Update on 09/10/07: SIMPLIFICATION
 * No longer offering a choice of feeds by default
 * ID for feed tiddlers now supplied as a parameter */

config.macros.publishing = {};

config.macros.publishing.handler = function(place,macroName,params,wikifier,paramString,tiddler) {

	// publishing puts a box on a tiddler that shows:
	// if the tiddler is not 'published', a 'publish' button -
	//  - hitting 'publish' drops a menu of available streams to choose from;
	// if the tiddler is published, a 'published' label -
	//  - hitting 'published' drops a menu of streams the tiddler is published in
	//  - plus the list of streams that you can also publish it in
	// being published is defined as being tagged with a channel name
	var published = false;
	var publications = {};
	// collect a list of streams and label them as being streams this tiddler is published in or not
	params = paramString.parseParams("anon",null,true,false,false);
	// stream_id defines what a stream tiddler is tagged with
	// if we haven't supplied that parameter, we just look at whether this tiddler is tagged published or not
	var stream_id = getParam(params,"stream_id",null);
	if (stream_id) {
		var streams = store.getTaggedTiddlers(stream_id);
		publications = {'yes':[], 'no':[]};
		for (var i=0;i<streams.length;i++) {
			if (tiddler.isTagged(streams[i].title)) {
				publications.yes.push(streams[i]);
			} else {
				publications.no.push(streams[i]);
			}
		}
		if (publications.yes.length !== 0) {
			published = true;
		}
	} else {
		if (tiddler.isTagged("published")) {
			published = true;
		}
	}
	if (published) {
		// add a published box
		var thePublishedBox = createTiddlyButton(place,"Published","Click to unpublish");
		// is there is no stream_id, we are not working with streams, so clicking Published unpublishes the content, which means updates will no longer appear in the stream
		if (stream_id) {
			thePublishedBox.onclick = this.reveal;
			// create the published list
			var thePublishedList = createTiddlyElement(place,"ul");
			thePublishedList.style.display = "none";
			for (var i=0;i<publications.yes.length;i++) {
				// for the published list just present a simple list
				var streamItem = createTiddlyElement(thePublishedList,"li",null,null,publications.yes[i].title);
			}
		} else {
			thePublishedBox.onclick = function() {
				config.macros.publishing.unsubscribe.call(this,"published");
			};
		}
	} else {
		// add a publish box
		var thePublishBox = createTiddlyButton(place,"Publish","Click to publish");
		// if there is no stream_id, we are not working with streams, so clicking publish just adds "published" to the tiddler's tags
		if (stream_id) {
			thePublishBox.onclick = this.reveal;
			// create the publish list
			var thePublishListBox = createTiddlyElement(place,"div");
			thePublishListBox.style.display = "none";
			var thePublishList = createTiddlyElement(thePublishListBox,"ul");
			for (var i=0;i<publications.no.length;i++) {
				// for the publish list present a list of buttons
				var streamItem = createTiddlyElement(thePublishList,"li");
				createTiddlyButton(streamItem,publications.no[i].title,publications.no[i].title,this.subscribe);
			}
			// CROSS-PLUGIN DEPENDENCY!
			if (config.macros.tiddlyChatterSetup) {
				var newStream = createTiddlyButton(thePublishListBox,"new stream...","Create a new stream",this.reveal);
				var newStreamBox = createTiddlyElement(thePublishListBox,"div");
				newStreamBox.style.display = "none";
				// next line to give input box and go button same depth as list items above
				// so the subscribe function points to the parent tiddler properly in both cases
				var newStreamList = createTiddlyElement(newStreamBox,"div");
				var newStreamInput = createTiddlyElement(newStreamList,"input",null,null);
				newStreamInput.setAttribute("size","5");
				createTiddlyButton(newStreamList,"go","go",config.macros.publishing.onClickNewChannel);
			}
		} else {
			thePublishBox.onclick = function() {
				config.macros.publishing.subscribe.call(this,"published");
			};
		}
	}
};

config.macros.publishing.onClickNewChannel = function() {
	// call the onclick for the stream creator, setting 'this' to the current value of 'this'
	config.macros.tiddlyChatterSetup.onClickNewChannel.call(this);
	// now subscribe to this channel
	var created = false;
	if (store.fetchTiddler(this.previousSibling.value)) {
		created = true;
	}
	// subscribe, setting 'this' to be the input with the new stream name in
	this.previousSibling.textContent = this.previousSibling.value;
	config.macros.publishing.subscribe.call(this.previousSibling);
};

// onclick for channel names; 'this' refers to the link
config.macros.publishing.subscribe = function(tag) {

	var DOMTiddler = story.findContainingTiddler(this);
	var tiddler = store.fetchTiddler(DOMTiddler.attributes.tiddler.textContent);
	if (!tag) {
		tag = this.textContent;
	}
	tiddler.tags.push(tag);
	tiddler.set(tiddler.title,tiddler.text,tiddler.modifier,tiddler.modified,tiddler.tags,tiddler.created,tiddler.fields);
	story.refreshTiddler(DOMTiddler.getAttribute("tiddler"),DOMTiddler.getAttribute("template"),true);
};

// onclick for channel names when published; 'this' refers to the link
config.macros.publishing.unsubscribe = function(tag) {

	var DOMTiddler = story.findContainingTiddler(this);
	var tiddler = store.fetchTiddler(DOMTiddler.attributes.tiddler.textContent);
	if (!tag) {
		tag = this.textContent;
	}
	tiddler.tags.splice(tiddler.tags.indexOf(tag),1);
	tiddler.set(tiddler.title,tiddler.text,tiddler.modifier,tiddler.modified,tiddler.tags,tiddler.created,tiddler.fields);
	story.refreshTiddler(DOMTiddler.getAttribute("tiddler"),DOMTiddler.getAttribute("template"),true);
};

// onclick for "publish" buttons; 'this' refers to the span
config.macros.publishing.reveal = function() {
	// create an interface to give your channel an id
	var slideBox = this.nextSibling;
	var isOpen = slideBox.style.display != "none";
	if(anim && typeof Slider == "function")
		anim.startAnimating(new Slider(slideBox,!isOpen,null,"none"));
	else
		slideBox.style.display = isOpen ? "none" : "block";
};