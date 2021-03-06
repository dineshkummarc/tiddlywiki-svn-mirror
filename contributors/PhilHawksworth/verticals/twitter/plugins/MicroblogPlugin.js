/***
|''Name:''|MicroblogPlugin|
|''Description:''|Add some simple Microblog functionality to a Tiddlywiki|
|''Author:''|PhilHawksworth|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/PhilHawksworth/plugins/MicroblogPlugin.js |
|''Version:''|0.0.1|
|''Date:''|Jan 23, 2008|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]] |
|''~CoreVersion:''|2.2|


Usage:

Display the login interface:
<identifier> corresponds to the name of the microblogging platfom and requires an associated MicroblogConfig_identifier tiddler
{{{
	<<microblog identifier signin>>
}}}


Display the interface to allow posting of an update.
{{{
	<<microblog identifier postform>>	
}}}


Display a stream of updates from the microblogging platform.
	count: INT : the number of updtes to display | 'all' displays all available from the feed.
	avatars: Boolean: display the avatar corresponding to the update.
	makeTiddler: Boolean: create and save a tiddler for each update or simply display the updates (transient).
{{{
	<<microblog identifier listen [count] [avatars] [makeTiddlers]>>	
}}}


***/

//{{{
if(!version.extensions.MicroblogPlugin) {
version.extensions.MicroblogPlugin = {installed:true};
	
	var log = function(str) {
		if(window.console) {
			console.log(str);
			return;
		}
	};
	

	config.macros.Microblog = {};
	var microblogs = config.macros.Microblog.microblogs = [];

	config.macros.Microblog.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
		if(params.length < 2) {
			log('Not enough arguments in the call to the Microblog plugin');
			return;
		}
		var platform = params[0]; 
		var action = params[1]; 
		
		//get the settings for this Microblog platform.
		if(!microblogs[platform])
			this.settings(platform);
		
		switch(action) {
			case 'signin':
				this.signin(place,platform);
				break;	  
			case 'postform':
				this.postform(place,platform);
				break;
			case 'listen':			
				var count = params[2] ? params[2] : false;
				var avatars = params[3] =='avatars' ? true : false;
				var makeTiddlers = params[4] =='makeTiddlers' ? true : false;
				microblogs[platform].poll = true;
				this.listen(place, platform, count, avatars, makeTiddlers);
				break;
			default:
				log('ERROR. '+ action+ ' is not a valid parameter for the Microblog plugin.');
				break;
		}
	};
	
	
	// gather the config data from the config tiddler for use when required.
	config.macros.Microblog.settings = function(platform){
		
		//Get the existing data object or create a new one.
		var mb = microblogs[platform] ? microblogs[platform] : {};
		
		//Gather the data from the tiddler.
		var configTiddlerTitle = "MicroblogConfig_" + platform;
		var slices = store.calcAllSlices(configTiddlerTitle);
		mb['authenticated'] = false;
		for(var s in slices) {
			mb[s] = store.getTiddlerSlice(configTiddlerTitle, s);
		}
		
		microblogs[platform] = mb;	
		
		/*
			TODO Remove debug logging.
		*/
		log("-----------------");
		var m = microblogs[platform];	
		for (var t in m) {
			log(t +" : "+ m[t]);
		};
		log("-----------------");
	};
	


	//create signin UI.
	config.macros.Microblog.signin = function(place, platform){

		// The user details to gather.
		var userDetails = [];
		userDetails.push(['username','Username']);
		userDetails.push(['password','Password']);
		
		//Build the UI for the conifg
		var f = createTiddlyElement(place,"form","user_form_"+platform);
		createTiddlyElement(f,"span",null,null,"Signin for " + platform + " microblog.");
		for(var d=0; d<userDetails.length; d++){
			createTiddlyElement(f,"span",null,null,userDetails[d][1]);
			if(userDetails[d][0] == "password") {
				var input = createTiddlyElement(f,'input',null,null,null,{'type':'password'});
			}
			else {
				var input = createTiddlyElement(f,"input",null);
			}
			input.setAttribute('name',userDetails[d][0]);
		}
		var btn = createTiddlyButton(f,"Start using " + platform,"Store these settings and start using the microblog",config.macros.Microblog.signinClick);
		btn.setAttribute("platform",platform);
		
		var loggedin = createTiddlyElement(place,"span",'microblog_loggedin_' + platform,'hidden',"Logged in to " + platform);
		var logoutbtn = createTiddlyButton(loggedin,"Signout of " + platform,"Signout of " + platform,config.macros.Microblog.logout);
		logoutbtn.setAttribute("platform",platform);
	};
	
	
	// update the config details for this micoroblog with the user details and then try to authenticate.
	config.macros.Microblog.signinClick = function(ev){
		
		var e = ev ? ev : window.event;
		var platform = this.getAttribute("platform");
		var mb = microblogs[platform];
		
		//record the details.
		var form = this.parentNode;
		var inputs = form.getElementsByTagName('input');
		var f;
		for (var i=0; i < inputs.length; i++) {
			f = inputs[i];
			mb[f.name] = f.value;
		};
		config.macros.Microblog.auth(platform); 
	};


	//Attempt to authenticate the user.
	config.macros.Microblog.auth = function(platform)
	{
		var uri = microblogs[platform].LoginURI;
		var usr = microblogs[platform].username;
		var pwd = microblogs[platform].password;
		
		if(uri && usr && pwd) {
			//get the update and post it.
			var params = {};
			params.platform = platform;
			doHttp("POST",uri,null,null,usr,pwd,config.macros.Microblog.authCalback,params);	
		}
		else {
			log("Ooops. We don't have all the details we need to post this comment.");
		}
	};
	config.macros.Microblog.authCalback = function(status,params,responseText,url,xhr){
		
		/*
			TODO remove logging.
		*/
		log(xhr);
		
		if(xhr.status == 200){
			microblogs[params.platform].authenticated = true;
			var p = document.getElementById('microblog_loggedin_'+params.platform);
			p.style.display = "block";
			
			/*
				TODO Decide what feedback mechanisim is best to signify a successful login.
			*/
		}
	};
	
	
	//Attempt to authenticate the user.
	config.macros.Microblog.logout = function(ev) {
		var e = ev ? ev : window.event;
		var platform = this.getAttribute("platform");	
		var uri = microblogs[platform].LogoutURI;
		
		if(uri) {
			var params = {};
			params.platform = platform;
			doHttp("POST",uri,null,null,null,null,config.macros.Microblog.logoutCalback,params);	
		}
		else {
			log("Ooops. We don't have the details we need logout from " + platform);
		}
	};
	config.macros.Microblog.logoutCalback = function(status,params,responseText,url,xhr){
		microblogs[params.platform].authenticated = false;			
		var p = document.getElementById('microblog_loggedin_'+params.platform);
		p.style.display = "none";
	};
	

	
	//create listener.
	config.macros.Microblog.listen = function(place, platform, count, avatars, makeTiddlers) {
		//display the signin form if user not authenticated.
		if(!microblogs[platform].authenticated) {
			createTiddlyElement(place,"span",null,null,"Please log in to " + platform );
			return;
		} 
		
		var uri = microblogs[platform].ListenURI;	
		var context = {
				host:uri, 
				place:place, 
				platform:platform, 
				count:count,
				avatars:avatars,
				makeTiddlers:makeTiddlers
				};
				
		log("Getting updates from " + platform);
		doHttp("GET",uri,null,null,null,null,config.macros.Microblog.listenHandler,context);
	};
	
	//parse incoming feed
	config.macros.Microblog.listenHandler = function(status,params,responseText,url,xhr){
		
		if(!status) {
			log("We couldn't get a response from " + params.platform + ". Please check your settings and ensure that all is well with " + params.platform);
			return;
		}
				
		var rootURI = microblogs[params.platform].RootURI;
		 
		/*
			TODO Replace this nasty JSON eval. Create a smart TW JSON parsing helper?
		*/
		var updates = eval(responseText);
		var count = params.count ? params.count : updates.length;
		if (count == 'all') 
			count = updates.length;

		store.suspendNotifications();
		
		/*
			TODO Cleaning out the display this way seems to kill future images. Fix me!
		*/
		removeChildren(params.place);
	
		var msg, m, a, i;
		var id, text, creator, timestamp;
		for(var u=0; u<count; u++) {
					
			msg = updates[u];
			id = msg.id;
			text = msg.text.htmlDecode();
			
			/*
				TODO Format date string nicely.
			*/
			timestamp = msg.created_at;
			
			creator = msg.user.name;
			screenname = msg.user.screen_name;
			image = msg.user.profile_image_url;
		
			/*
				TODO move this test to be somewhere more efficient?
			*/
			if(params.makeTiddlers) {
				//create a tiddler for each tweet.
				
				/*
					TODO Make a tiddler for this tweet.
				*/
						
			}
			
			else {
				//render the tweets inline.
				m = createTiddlyElement(params.place,"div",null,"microblog_update",null);
				if(params.avatars){
					a = createTiddlyElement(m,"a",null,null,null);
					a.href = rootURI + "/" + screenname + "/statuses/" + id;
					i = createTiddlyElement(a,"img",null,null,null);
					i.src = image;
				}
				createTiddlyElement(m,"span",null,'user',creator);		
				createTiddlyElement(m,"span",null,'date',timestamp);		
				createTiddlyElement(m,"span",null,'text',text); 
			}
		}
		
		refreshDisplay();
		store.resumeNotifications();
		
		/*
			TODO Make the polling period configurable.
		*/
		if(microblogs[params.platform].poll) {
			var period = config.macros.Microblog.getInterval(params.platform);
			microblogs[params.platform].timer = window.setTimeout(function() {config.macros.Microblog.listen(params.place, params.platform, params.count, params.avatars, params.makeTiddlers);}, period); 
		}
		else {
			microblogs[params.platform].timer = null;
		}
	};
	
	
	//create input UI.
	config.macros.Microblog.postform = function(place,platform){
		
		//display the signin form if user not authenticated.
		if(!microblogs[platform].authenticated) {
			log('authentication needed for ' + platform);
			createTiddlyElement(place,"span",null,null,"Please log in to " + platform + " before posting an update." );
		} 
		else {
			var f = createTiddlyElement(place,"form");
			createTiddlyElement(f,"span",null,null,"post an update");
			var input = createTiddlyElement(f,"input",null);
			input.setAttribute('name','update');
			var btn = createTiddlyButton(f,"Update " + platform,"post an update to" + platform,config.macros.Microblog.postUpdate);
			btn.setAttribute("platform",platform);
		}
	};
	
	//Post an upate to the microblog platform.
	config.macros.Microblog.postUpdate = function(ev){
		var e = ev ? ev : window.event;
		var platform = this.getAttribute("platform");
		var uri = microblogs[platform].PostURI;
		
		//not required if we let the browser session take care of the authentication.
		var usr = microblogs[platform].username;
		var pwd = microblogs[platform].password;
		
		if(uri) {
			//get the update and post it.
			var form = this.parentNode;
			var update = "status=" + form['update'].value;
			var params = {};
			params.platform = platform;
			params.field = form['update'];
			doHttp("POST",uri,update,null,null,null,config.macros.Microblog.postUpdateCalback,params);	
		}
		else {
			log("Ooops. We don't have all the details we need to post this comment.");
		}

	};
	config.macros.Microblog.postUpdateCalback = function(status,params,responseText,url,xhr){
		
		if(xhr.status == 200)
			log("posted");
			if(params.field)
				params.field.value="";
			/*
				TODO refresh any listings that would show this update.
			*/
		else
			log('There was a problem posting your update to ' + params.platform);

	};
	config.macros.Microblog.getInterval = function(platform) {
		var t = microblogs[platform].Period ? parseInt(microblogs[platform].Period) * 1000 : 60000;
		if(isNaN(t))
			t = 60000;
		return t;
	};


} //# end of 'install only once'
//}}}