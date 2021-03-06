/***
|''Name:''|TiddlyCityPlugin|
|''Description:''|Code to run TiddlyCity|
|''Author''|JonathanLister|
|''CodeRepository:''|n/a |
|''Version:''|0.1|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License''|[[BSD License|http://www.opensource.org/licenses/bsd-license.php]] |
|''~CoreVersion:''|2.3|

***/

//{{{
if(!version.extensions.TiddlyCityPlugin) {
version.extensions.TiddlyCityPlugin = {installed:true};

var TiddlyCity = function() {};

TiddlyCity.TweetToTiddler = function(tweets) {
	var l_regexp = / [lL]:([^$]+)/;
	var count = 0;
	for(var i=0; i<tweets.length; i++) {
		var tweet = tweets[i];
		var match = l_regexp.exec(tweet.text);
		if(match) {
			displayMessage("found a tweet!: "+tweet.text);
			count++;
			var location = match[1];
			var context = {};
			context.fields = {};
			context.fields.iconurl = tweet.user.profile_image_url;
			var l = new GoogleLocalSearch(location,context);
			context.title = tweet.id.toString();
			context.text = tweet.text.slice(0,match.index);
			context.modifier = tweet.user.screen_name;
			context.modified = new Date(tweet.created_at);
			context.tags = ["tweet"];
			context.body = "tweet: "+context.text+"\nfrom: "+location+"\nby: ''"+context.modifier+"''\nat: "+context.modified;
			l.get(TiddlyCity.LocationToTiddler);
		} else {
			//displayMessage("no match: "+tweet.text);
		}
	}
	if(count === 0) {
		displayMessage('no useful tweets found!');
	}
};

TiddlyCity.saveTiddlerFromContext = function(context) {
	store.saveTiddler(context.title,context.title,context.body,context.modifier,context.modified,context.tags,context.fields);
};

TiddlyCity.LocationToTiddler = function(locations,context) {
	// just use the first result in the array assuming that it's the best match
	var location = locations[0];
	if(!context.fields) {
		context.fields = {};
	}
	context.fields.streetaddress = location.streetAddress;
	context.fields.city = location.city;
	context.fields.country = location.country;
	context.fields.geo_lat = location.lat;
	context.fields.geo_lng = location.lng;
	context.fields.url = location.url;
	TiddlyCity.saveTiddlerFromContext(context);
};

TiddlyCity.saveKML = function() {
	TiddlyTemplating.templateAndPublish('somekml.kml','KMLTemplate');
};

TiddlyCity.downloadTweets = function() {
	var username = config.options.txtTwitterUsername;
	if(username) {
		var twitter = new TwitterTimeline();
		twitter.getUpdates(username,TiddlyCity.TweetToTiddler);
	} else {
		displayMessage("please set your Twitter username!");
		return false;
	}
};

TiddlyCity.displayTweets = function() {
	var ylocal = new YahooMapsSimpleAPI();
	var tiddlers = store.getTaggedTiddlers('tweet');
	if(tiddlers.length!==0) {
		var place = this.parentNode;
		ylocal.displayMapUsingForm(place);
	} else {
		displayMessage("no tweets to display!");
		return false;
	}
};

config.macros.TiddlyCity = {};

config.macros.TiddlyCity.handler = function(place) {
	if(!config.options.txtTwitterUsername) {
		config.options.txtTwitterUsername = "enter your username";
	}
	var wrap = createTiddlyElement(place,"div",null,"TiddlyCityWrap");
	wikify("Twitter username: <<option txtTwitterUsername>>\n",wrap);
	createTiddlyButton(wrap,"Click to download your tweets","Click to download your tweets",TiddlyCity.downloadTweets);
	wikify("\n",wrap);
	createTiddlyButton(wrap,"Click to display tweets on a Yahoo! map in a new window","Click to display tweets on a Yahoo! map in a new window",TiddlyCity.displayTweets);
	wikify("\n",wrap);
	createTiddlyButton(wrap,"Click to save a KML file for use on Google maps...","Click to save a KML file for use on Google maps",TiddlyCity.saveKML);
};

} //# end of 'install only once'
//}}}