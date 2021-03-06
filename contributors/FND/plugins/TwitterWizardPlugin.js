/***
|''Name''|TwitterWizardPlugin|
|''Description''|interface for retrieving tweets and user data from Twitter|
|''Author''|FND, JonathanLister|
|''Version''|0.2.0|
|''Status''|@@experimental@@|
|''Requires''|TwitterAdaptorPlugin|
|''Source''|http://devpad.tiddlyspot.com/#TwitterArchivePlugin|
|''CodeRepository''|http://svn.tiddlywiki.org/Trunk/contributors/FND/|
|''License''|[[Creative Commons Attribution-ShareAlike 3.0 License|http://creativecommons.org/licenses/by-sa/3.0/]]|
|''CoreVersion''|2.5.0|
!Usage
{{{
<<TiddlyTweets [workspace] [pages]>>
}}}
{{{
<<TwitterWizard>>
}}}
!Revision History
!!v0.2 (2009-03-04)
* jsonp
* made it work
!!v0.1 (2008-11-14)
* initial release
!To Do
* documentation
* abort conditions: empty response or tweet already archived
* report when retrieval has been completed
* disable wiki markup for tweets
!Code
***/
//{{{
if(!version.extensions.TwitterWizardPlugin) { //# ensure that the plugin is only installed once
version.extensions.TwitterWizardPlugin = { installed: true };

if(!config.adaptors.twitter) {
	throw "Missing dependency: TwitterAdaptor";
}

config.macros.TiddlyTweets = {
	btnLabel: "TiddlyTweets",
	btnTooltip: "retrieve tweets",
	usernamePrompt: "enter Twitter username",

	host: "http://www.twitter.com",
	requestDelay: 1000, // delay between page requests
	adaptor: new config.adaptors.twitter(),

	handler: function(place, macroName, params, wikifier, paramString, tiddler) {
		this.pageCount = 0; // XXX: means there can only be a single instance!!
		createTiddlyButton(place, this.btnLabel, this.btnTooltip,
			function() { config.macros.TiddlyTweets.dispatcher(params); });
	},

	dispatcher: function(params) { // TODO: rename
		var self = config.macros.TiddlyTweets;
		var maxPages = params[1] || 1;
		self.maxPages = maxPages;
		var count = params[2];
		if(self.pageCount <= maxPages) {
			var username = params[0] || prompt(self.usernamePrompt);
			setTimeout(function() { self.dispatcher(params); },
				self.requestDelay);
			self.launcher(username, self.pageCount, count);
			self.pageCount++;
		} else {
			self.pageCount = 1;
		}
	},

	launcher: function(username, page, count) { // TODO: rename
		var self = config.macros.TiddlyTweets;
		var context = {
			host: self.host,
			workspace: "user_timeline",
			userID: username,
			page: page,
			count: count
		};
		var status = self.adaptor.getTiddlerList(context, null, self.processor);
		if(status !== true) {
			displayMessage("error retrieving page " + context.page); // TODO: i18n
		}
	},

	processor: function(context, userParams) { // TODO: rename
		var self = config.macros.TiddlyTweets;
		self.doneRequestCount++;
		self.totalReturnedTiddlers += context.tweets;
		if(self.doneRequestCount === self.maxPages) {
			displayMessage('all the page requests have returned and been processed!');
			if(self.totalReturnedTiddlers!==self.tweetCount) {
				var difference = self.tweetCount - self.totalReturnedTiddlers;
				displayMessage('total tweets doesn\'t match predicted number, there are '+difference+' missing tweets');
			} else {
				displayMessage('all expected tweets returned');
			}
		}
		for(var i = 0; i < context.tweets; i++) {
			context.tiddler = context.tiddlers[i];
			self.adaptor.getTiddler(context.tiddler.title, context, null, self.saver);
		}
	},

	saver: function(context, userParams) { // TODO: rename
		var self = config.macros.TiddlyTweets;
		var tiddler = context.tiddler;
		store.saveTiddler(tiddler.title, tiddler.title, tiddler.text,
			tiddler.modifier, tiddler.modified, tiddler.tags,
			tiddler.fields, false, tiddler.created);
		self.savedTweets++;
		self.progressBar.style.width = (self.savedTweets / self.tweetCount)*100 +'%';
		if(self.savedTweets === self.tweetCount) {
			displayMessage('saved all tweets! finished!');
		}
	},

	// this function could probably move out to the TwitterBackWizard macro
	// then TiddlyTweets macro should have some instantiation with params like pageCount and launchCount
	handleWizard: function(w) {
		var self = config.macros.TiddlyTweets;
		self.pageCount = 1;
		self.doneRequestCount = 0;
		self.totalReturnedTiddlers = 0;
		self.savedTweets = 0;
		self.tweetCount = w.tweetCount;
		var params = [
			w.username,
			w.maxPages,
			200
		];
		w.addStep("Downloading","<span class='progress'></span>");
		var stepElem = w.bodyElem.getElementsByTagName('div')[1];
		stepElem.style.padding = 0;
		stepElem.style.paddingBottom = "2em";
		w.setButtons([{
			caption: ""
		},
		{
			caption: "Save To CSV",
			tooltip: "Save to CSV",
			onClick: function() {
				TiddlyTemplating.templateAndPublish(w.username+'.csv','CsvTemplate');
				return false;
			}
		},
		{
			caption: "Do it again!",
			tooltip: "Start again",
			onClick: function() {
				var w = new Wizard(this);
				var place = w.clear();
				config.macros.TwitterBackupWizard.restart(w);
				return false;
			}
		}]);
		self.progressBar = w.bodyElem.getElementsByTagName('span')[0];
		self.dispatcher(params);
	}
};

jQuery.getJSONP = function(s) {
	console.log('getJSONP has been called in the Twitter Archiver wizard');
    s.dataType = 'jsonp';
    jQuery.ajax(s);

    var t = 0, cb = s.url.match(/callback=(\w+)/)[1], cbFn = window
[cb];
    var $script = jQuery('head script[src*='+cb+']');
    if (!$script.length)
        return; // same domain request

    $script[0].onerror = function(e) {
    	var text = $script;
        //$script.remove();
        jQuery.handleError(s, {}, "error", e);
        clearTimeout(t);
    };

    if (!s.timeout)
        return;

    window[cb] = function(json) {
        clearTimeout(t);
        cbFn(json);
        cbFn = null;
    };

    t = setTimeout(function() {
        $script.remove();
        jQuery.handleError(s, {}, "timeout");
        if (cbFn)
            window[cb] = function(){};
    }, s.timeout);
};

// like the more ambitious TwitterWizard below, but only for your tweets
// includes a step to check how many tweets you have and work out maxPages from that
config.macros.TwitterBackupWizard = {
	handler: function(place, macroName, params, wikifier, paramString, tiddler, errorMsg) {
		var w = new Wizard();
		w.createWizard(place, "Twitter Backup Wizard");
		this.restart(w);
	},
	
	restart: function(w) {
		var self = config.macros.TwitterBackupWizard;
		var onClick = function() {
			w.username = w.getValue('username').value;
			self.step2(w);
			return false;
		};
		w.addStep("Type in your Twitter username please", "<input name='username'>");
		w.formElem.onsubmit = onClick;
		w.setButtons([{
			caption: "Let's go",
			tooltip: "First thing, click to count your tweets",
			onClick: onClick
		}]);
	},

	handleProfilePageToCountUpdates: function(person, textStatus) {
		var tweetCount = person.statuses_count;
		var w = this.wizard;
		config.macros.TwitterBackupWizard.step3(w, tweetCount);
	},

	step2: function(w) {
		w.addStep("Hello " + w.username + ", counting your tweets", "<span>hold your horses!</span>");
		w.setButtons([]);
		var self = config.macros.TwitterBackupWizard;
		var host = "http://www.twitter.com";
		var url = host + "/users/show/" + w.username + ".json";
		var context = {
			wizard: w
		};
		//var req = httpReq("GET", url, self.handleProfilePageToCountUpdates, context);
		try {
		var opt = {
			url: url,
			//url: 'http://jquery.com/Test.php',
			dataType: 'jsonp',
			success: self.handleProfilePageToCountUpdates,
			error: self.errorFunc,
			wizard: w
		};
		jQuery.getJSONP(opt);
		} catch(e) {
			console.log(e,e.message);
		}
	},

	step3: function(w, tweetCount) {
		var step3html = "";
		if(tweetCount > 3200) {
			step3html += "we need the Power of Greyskull to get back further than that! Let's do what we can...<p /><img src='http://www.dvdplaza.fi/reviews/images/heman46_000.jpg' title='image from http://www.dvdplaza.fi/' />";
			w.addStep("oh noes "+w.username+"!, you've got "+tweetCount+" tweets and I can only get the first 3200 tweets", step3html);
			tweetCount = 3200;
		} else {
			step3html = "This might take a moment...";
			w.addStep(w.username+", you've got " + tweetCount + "tweets!", step3html);
		}
		w.tweetCount = tweetCount;
		w.maxPages = Math.ceil(parseInt(tweetCount, 10) / 200);
		w.setButtons([{
			caption: "Download tweets",
			tooltip: "Download " + tweetCount + " tweets",
			onClick: function() { config.macros.TiddlyTweets.handleWizard(w); }
		},
		{
			caption: "Go back",
			tooltip: "Oops! Wrong username, take me back",
			onClick: function() {
				var w = new Wizard(this);
				var place = w.clear();
				config.macros.TwitterBackupWizard.restart(w);
				return false;
			}
		}]);
	},
	
	errorFunc: function(XMLHttpRequest, textStatus, errorThrown) {
		var w = this.wizard;
		var addResetButton = function(wizard) {
			wizard.setButtons([{
				caption: "Start again!",
				tooltip: "Start again!",
				onClick: function() {
					var w = new Wizard(wizard.formElem);
					var place = w.clear();
					config.macros.TwitterBackupWizard.restart(w);
					return false;
				}
			}]);
		};
		if(!self.apiLimitChecked) {
			w.addStep("Ah. There has been a wee problem... maybe we're hammering Twitter too much", "checking your API rate limit...");
			var twitterAPICheckerCallback = function(limitObj) {
				self.apiLimitChecked = false; // ensure future errors trigger limit check again
				var limit = limitObj.hourly_limit;
				var remaining = limitObj.remaining_hits;
				var w = this.wizard;
				var errorHTML = "";
				if(remaining > 0) {
					errorHTML = "you have "+remaining+" calls left from an hourly limit of "+limit+"<p/>best check the twitter account exists: <a href='http://twitter.com/"+w.username+"' target='_blank'>"+w.username+"</a>";
				} else {
					var resetTime = limitObj.reset_time_in_seconds*1000 - new Date().getTime();
					resetTime = new Date().getTime() + resetTime;
					resetTime = new Date(resetTime);
					errorHTML = "you've run out of calls to the API; wait a while and try again<p/>your limit will reset in less than "+resetTime.getMinutes()+" minutes";
				}
				w.addStep("Checked your rate limit",errorHTML);
				addResetButton(w);
			};
			var opt = {
				url: "http://twitter.com/account/rate_limit_status.json",
				dataType: 'jsonp',
				success: twitterAPICheckerCallback,
				error: arguments.callee,
				wizard: w
			};
			self.apiLimitChecked = true;
			jQuery.getJSONP(opt);
		} else {
			self.apiLimitChecked = false; // ensure future errors trigger limit check again
						w.addStep("Error checking rate limit","maybe Twitter is down?<br/><a href='http://istwitterdown.com' target='_blank'>istwitterdown.com</a>");
			addResetButton(w);
		}
	}
};

/*** past here, code is not used in Twitter Archiver ***/

// Twitter archiving wizard -- XXX: experimental, incomplete -- TODO: i18n
config.macros.TwitterWizard = {
	handler: function(place, macroName, params, wikifier, paramString, tiddler, errorMsg) {
		var w = new Wizard();
		w.createWizard(place, "Twitter Wizard");
		w.addStep("Twitter username", "<input name='username'>");
		w.setButtons([{
			caption: "Import",
			tooltip: "click to import",
			onClick: function() { config.macros.twitter.step1(w); }
		}]);
	},

	step1: function(w) {
		var step1Html = "<input name='my_tweets' type='checkbox' /><label>My Tweets</label><br />" +
			"<input name='contacts' type='checkbox' /><label>My Contacts</label><br />" +
			"<input name='contacts_tweets' type='checkbox' /><label>My Contacts Tweets</label><br />";
		w.addStep("account :" + w.formElem.twitter_id.value, step1Html);
		w.setButtons([{
			caption: "Import 2",
			tooltip: "click to import",
			onClick: function() { config.macros.twitter.step2(w); }
		}]);
	},

	step2: function(w) {
		w.addStep("enter password for " + w.formElem.twitter_id.value,
			"<input name='twitter_password' type='password'/>");
		w.setButtons([{
			caption: "Import",
			tooltip: "click to import",
			onClick: function() { config.macros.TwitterWizard.step3(w); }
		}]);
	},

	step3: function(w) {
		var html = w.formElem.twitter_id.value + "<br />" +
			w.formElem.my_tweets + "<br />" +
			w.formElem.twitter_password.value + "<br />";
		w.addStep("All Done", html);
	}
};

} //# end of "install only once"
//}}}
