/***
|''Name:''| NiceTaggingPlugin|
|''Description:''| creates a nicer interface for adding and removing TiddlyWiki. Ideal for tiddly novices. |
|''Version:''|0.5|
|''Date:''|8 September 2009|
|''Source:''|http://www.jonrobson.me.uk/development/niceTagging|
|''Author:''|Jon Robson|
|''License:''|[[BSD open source license]]|
|''CoreVersion:''|2.3|
|''Dependencies:''|AdvancedEditTemplatePlugin|
***/

if(store){
  config.shadowTiddlers.NiceTaggingStyle = "/*{{{*/\n" +
  ".tip {font-style:italic;font-weight:bold;}\n"+
  ".dp-popup {position:absolute;background-color:white;} a.dp-choose-date {	float: left;	width: 16px;	height: 16px;	padding: 0;	margin: 5px 3px 0;	display: block;	text-indent: -2000px;	overflow: hidden;	background: url(calendar.png) no-repeat; }a.dp-choose-date.dp-disabled {	background-position: 0 -20px;	cursor: default;}input.dp-applied {	width: 140px;	float: left;}\n"+
  ".niceTagger input {width:200px; float:left;}\n"+
  ".deleter {color:red; font-weight:bold; padding:2px; cursor:pointer;}\n"+
  "/*}}}*/";
store.addNotification("NiceTaggingStyle", refreshStyles);
}


config.macros.niceTagger = {
	lingo:{
		add: "add"
	}
	,twtags: {}
	,initialised:{}
	,init: function(field){
	    if(this.initialised[field])return;
	    if(!field)field = 'tags';
	    
	    var tiddlers= store.getTiddlers();
	    config.macros.niceTagger.twtags[field] = [];
	    
        for(var i=0; i < tiddlers.length; i++){
            var dest = config.macros.niceTagger.twtags[field];
            var tid = tiddlers[i];
        	var values;
        	if(field=='tags')values = tid.tags;
        	else {
        	    values=tid.fields[field]
        	    if(!values)values="";
        	    values = values.readBracketedList();
        	;}
        	config.macros.niceTagger.twtags[field]= dest.concat(values);
        }
        this.initialised[field] =true;
	}
    ,save: function(title,field,list){
        console.log("save",title,field,list);
		var tiddler =  store.getTiddler(title);
		if(!tiddler) {
		    var tags = [];
		    var fields = merge(config.defaultCustomFields,{});
		    if(field=='tags'){
		        tags = list;
		    }
		    else{
		        fields[field]=list;
		    }
		
			store.saveTiddler(title,title,null,true,null,tags,fields,null);
			tiddler =  store.getTiddler(title);
		}
		
		var strVal;
		if(typeof(list) =='string'){
		    strVal = list;
		}
		else{
		    strVal= String.encodeTiddlyLinkList(list);
		} 
		console.log("saving to field",field,strVal);
		store.setValue(tiddler,field,strVal);
        console.log("finished save tags",tiddler.tags,"field",tiddler.fields[field]);
    }
    ,refreshFieldDisplay: function(place,tiddler,field){
        console.log("refresh tasgs",field,tiddler.fields[field]);
        jQuery(place).html("");
        var tags;
        if(!field ||field=='tags'){
            tags = tiddler.tags;
        }
        else{
            var val= tiddler.fields[field];
            if(!val)val="";
            tags = val.readBracketedList();
        }
        for(var t=0; t < tags.length; t++){
            var tag = tags[t];
            jQuery(place).append(" <span class='tag'>"+tag+"</span> <span class='deleter' deletes='"+escape(tag)+"'>x</span>");
        }
        
        jQuery(".deleter",place).click(function(e){
            var todelete = jQuery(this).attr("deletes");
            var newtags = [];
            for(var i=0; i < tags.length; i++){
                if(escape(tags[i]) != todelete){
                   newtags.push(tags[i]);
                }
            }
            /*
              if(!field ||field=='tags'){
                    tiddler.tags =newtags;
               }
               else{
                   tiddler.fields[field] = newtags;
               }
                */
            config.macros.niceTagger.save(tiddler.title,field,newtags);
            
            config.macros.niceTagger.refreshFieldDisplay(place,tiddler,field);
        });
    }
    ,handler: function(place,macroName,paramlist,wikifier,paramString,tiddler){
          var options = {};
            var namedprms = paramString.parseParams(null, null, true);
            for(var i=0; i < namedprms.length;i++){
                var nameval = namedprms[i];
                options[nameval.name] = nameval.value;
            }
        if(!options.field)options.field = "tags";
        
        this.init(options.field);
        var displayer = document.createElement("div");
        displayer.className = "niceTagger";
        place.appendChild(displayer);
        config.macros.niceTagger.refreshFieldDisplay(displayer,tiddler,options.field);
        var tagplace = document.createElement("div");

        place.appendChild(tagplace);
        var saveNewTag= function(value){
            var saveThis = [];
            if(options.field=='tags'){
                saveThis = tiddler.tags;
            }
            else{
                var val = tiddler.fields[options.field];
                if(!val)val= "";
                saveThis = val.readBracketedList();
            }
            
          if(value.replace(" ","").length == 0) return;
		  if(saveThis.indexOf(value) != -1) return;
	
            saveThis.push(value);
            
            config.macros.niceTagger.save(tiddler.title,options.field,saveThis);
            
            config.macros.niceTagger.refreshFieldDisplay(displayer,tiddler,options.field);
            adder.value = "";
       
            
        };
        var adder;
        if(config.macros.AdvancedEditTemplate){
            //config.macros.AdvancedEditTemplate.handler(tagplace,null,null,null,"aet type:search metaDataName:assignby valuesSource:Suggestions");
             var params = paramString.parseParams("anon",null,true,false,false);
			 var textcase = getParam(params,"case");
            var srcTiddler = getParam(params,"valuesSource");
            var suggestions = [];
            if(srcTiddler){
                var text = store.getTiddler(srcTiddler).text;
                var tempdiv = document.createElement("div");
                wikify(text,tempdiv);
                suggestions = jQuery(tempdiv).html().split("<br>");
            }
            if(textcase && textcase == "lower"){
              for(var i=0; i < suggestions.length;i++){
                suggestions[i] =suggestions[i].toLowerCase();
              }
            }
		var tagsoff = getParam(params,"nostoretags");
		if(!tagsoff) suggestions = suggestions.concat(config.macros.niceTagger.twtags[options.field]);
		
		
		var uniqueSuggestions = [];
		for(var i=0; i < suggestions.length; i++){
			var s =suggestions[i];
			if(s){
			//rtrim then ltrim
			s = s.replace(new RegExp("[\\s]+$", "g"), "").replace(new RegExp("^[\\s]+", "g"), "");
			//console.log(uniqueSuggestions.toString(),s,uniqueSuggestions.indexOf(s));
				if(uniqueSuggestions.indexOf(s) ==-1){
					uniqueSuggestions.push(s);
				}
			}
		}
		//console.log(uniqueSuggestions);
           config.macros.AdvancedEditTemplate.createSearchBox(tagplace,"tags",uniqueSuggestions,"",function(v){saveNewTag(v);jQuery("input",tagplace).val("");})
           adder = jQuery("input",tagplace)[0];
			
		
        }
        else{
            adder = document.createElement("input");

            tagplace.appendChild(adder);
            
        }
		jQuery(adder).keypress(function (e) {
			if(e.which == 13){
				var results = jQuery(".ac_over",".ac_results"); //is anything highlighted in autocomplete plugin
				if(results.length ==0)
		
					saveNewTag(adder.value);
			}
		});
        var addbutton = document.createElement("button");
        addbutton.innerHTML = config.macros.niceTagger.lingo.add;
		addbutton.className = "adder";
        tagplace.appendChild(addbutton);
        

        jQuery(addbutton).click(function(e){
            var val = adder.value;
            saveNewTag(val);
        });
        
        
        
    }
    
};
config.macros.niceTagger.init();
