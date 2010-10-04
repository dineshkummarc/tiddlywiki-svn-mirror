/***
|''Name:''|NiceTaggingPlugin|
|''Description:''| creates a nicer interface for adding and removing TiddlyWiki. Ideal for tiddly novices. |
|''Version:''|0.6.0|
|''Date:''|April 2010|
|''Source:''|http://www.jonrobson.me.uk/development/niceTagging|
|''Author:''|Jon Robson|
|''License:''|[[BSD open source license]]|
|''CoreVersion:''|2.3|
|''Dependencies:''||
!StyleSheet
.tip {font-style:italic;font-weight:bold;}
.dp-popup {position:absolute;background-color:white;}
a.dp-choose-date {	float: left;	width: 16px;	height: 16px;	padding: 0;	margin: 5px 3px 0;	display: block;	text-indent: -2000px;	overflow: hidden;	background: url(calendar.png) no-repeat; }
a.dp-choose-date.dp-disabled {	background-position: 0 -20px;	cursor: default;}
input.dp-applied {	width: 140px;	float: left;}
.niceTagger input {width:200px; float:left;}
.deleter {color:red; font-weight:bold; padding:2px; cursor:pointer;}
.ac_results {padding: 0px;border: 1px solid black;background-color: white;overflow: hidden;z-index: 99999;}
.ac_results ul {width: 100%;list-style-position: outside;list-style: none;padding: 0;margin: 0;}
.ac_results li {margin: 0px;padding: 2px 5px;cursor: default;display: block;font: menu;font-size: 12px;line-height: 16px;overflow: hidden;}
.ac_loading {background: white url('indicator.gif') right center no-repeat;}
.niceTaggerAdder input {width:auto; display: inline;}
.ac_odd {background-color: #eee;}
.ac_over {background-color: #0A246A;color: white;}
***/
//{{{
(function($) {

config.shadowTiddlers.NiceTaggingStyle = store.getTiddlerText(tiddler.title + "##StyleSheet");
store.addNotification("NiceTaggingStyle", refreshStyles);

String.prototype.toJSON = function(){
	var namedprms = this.parseParams(null, null, true);
	var options ={};
	for(var i=0; i < namedprms.length;i++){ 
		var nameval = namedprms[i];
		if(nameval.name) {
			options[nameval.name] = nameval.value;
		}
	}
	return options;
};

var macro = config.macros.niceTagger = {
	lingo:{
		add: "add"
	},
	twtags: {},
	initialised:{},
	init: function(field){
		if(!field) {
			field = 'tags';
		}
		if(this.initialised[field]){
			if(field =='tags'){
				var numTags= store.getTags();
				if(numTags.length == this.twtags[field].length) return;
			}
			else{
				return;
			}
		}
		var tiddlers= store.getTiddlers();
		macro.twtags[field] = [];
		var uniqueSuggestions = [];
		for(var i=0; i < tiddlers.length; i++){
			
			var tid = tiddlers[i];
			var values;
			if(field=='tags')values = tid.tags;
			else {
				values=tid.fields[field]
				if(!values)values="";
				values = values.readBracketedList();
			}
			for(var j=0; j < values.length; j++){
				uniqueSuggestions.pushUnique(values[j]);
			}
			
		}
		macro.twtags[field] = uniqueSuggestions;
		this.initialised[field] =true;
	},
	save: function(title, field, listvalues, place, autosavechanges){
		var tiddler = store.getTiddler(title);
		var valueToSave;
		if(story.isDirty(title)) { //in edit mode.
			valueToSave = String.encodeTiddlyLinkList(listvalues);
			var tiddlerEl = story.getTiddler(title);
			var el = $("[edit=%0]".format([field]), tiddlerEl);
			if(el.length === 0) {
				$("<input />").attr("type", "hidden").attr("edit", field).
					val(valueToSave).appendTo(place);
			} else {
				el.val(valueToSave);
			}
			var dummy = new Tiddler(title);
			if(field == "tags") {
				dummy.tags = listvalues;
			} else {
				dummy.fields[field] = valueToSave;
			}
			return dummy;
		} else { // in view mode
			if(field == "tags") {
				tiddler[field] = listvalues;
			} else {
				tiddler.fields[field] = String.encodeTiddlyLinkList(listvalues);
			}
			store.saveTiddler(tiddler);
			window.clearTimeout(macro.saveTimeout);
			macro.saveTimeout = window.setTimeout(function() {
				autoSaveChanges(null, [tiddler]);
			}, 500);
			return tiddler;
		}
	},
	refreshFieldDisplay: function(place, tiddler, field) {
		var container = $(".niceTagger", place);
		container.empty();
		var values;
		if(!field || field == 'tags') {
			values = tiddler.tags;
		} else {
			values = tiddler.fields[field] ? tiddler.fields[field].readBracketedList() : [];
		}
		for(var t = 0; t < values.length; t++){
			var tag = values[t];
			$("<span />").addClass("tag").text(tag).appendTo(container);
			$("<span />").addClass("deleter").text("x").attr("deletes", escape(tag)).appendTo(container);
		}

		$(".deleter", place).click(function(ev){
			var todelete = $(ev.target).attr("deletes");
			var newValues = [];
			for(var i = 0; i < values.length; i++){
				var value = values[i];
				if(escape(value) != todelete) {
					newValues.push(value);
				}
			}
			tiddler = macro.save(tiddler.title, field, newValues, place, tiddler.autosavechanges);
			macro.refreshFieldDisplay(place, tiddler, field);
		});
	},
	saveNewValue: function(tiddler, field, value, container, splitChar) {
		var tiddlerEl = story.getTiddler(tiddler.title);
		var editEl = $("[edit=%0]".format([field]), tiddlerEl);
		var adder = $(".niceTaggerAdder input[type=text]", container);
		
		if(editEl.length > 0) {
			saveThis = editEl.val().readBracketedList();
		} else {
			if(field == 'tags') {
				saveThis = tiddler.tags;
			} else {
				var val = tiddler.fields[field];
				val = val ? val : "";
				saveThis = val.readBracketedList();
			}
		}
		if(typeof(value) == 'string') {
			value = value.trim();
		}
		if(value.length === 0) {
			return;
		}
		var newValues;
		if(splitChar && value.indexOf(splitChar) != -1){
			newValues = value.split(splitChar);
		} else {
			newValues = [value];
		}
		for(var i = 0; i < newValues.length;i++){
			var svalue = newValues[i];
			saveThis.pushUnique(svalue);
		}
		tiddler = macro.save(tiddler.title, field, saveThis, container, tiddler.autosavechanges);

		macro.refreshFieldDisplay(container, tiddler, field);
		$(adder).val("");
	},
	getSuggestionsFromTiddler: function(srcTiddler,textcase){
		var suggestions = [];
		if(srcTiddler){
			var src = store.getTiddler(srcTiddler);
			var text = src.text;
			var tempdiv = document.createElement("div");
			wikify(text,tempdiv,null,src);
			var html = $(tempdiv).html();
			suggestions = html.split(/<br\/?>/gi);
		}
		var finalSuggestions = [];
		for(var i=0; i < suggestions.length; i++){
			var val = suggestions[i].trim();
			if(textcase && textcase == "lower") {
				val = val.toLowerCase();
			}
			finalSuggestions.pushUnique(val);
		}
		return finalSuggestions;
	},
	removeFromList: function(list,removeList){
		var uniqueSuggestions = [];
		for(var i=0; i < list.length; i++){
			var s =list[i];
			if(s && typeof(s) == 'string'){
				if(uniqueSuggestions.indexOf(s) ==-1 && removeList.indexOf(s) ==-1){
					uniqueSuggestions.push(s);
				}
			}
		}
		return uniqueSuggestions;
	},
	handler: function(place,macroName,params,wikifier,paramString,tiddler){
		var options = paramString.toJSON();
		if(options.autoSaveChanges) {
			tiddler.autosavechanges = true;
		}
		if(!options.field) {
			options.field = params[0] || "tags";
		}
		this.init(options.field);
		var container = $("<div />").addClass("niceTaggerContainer").appendTo(place)[0];
		var displayer = $("<div />").addClass("niceTagger").appendTo(container)[0];
		macro.refreshFieldDisplay(container, tiddler, options.field);
		var tagplace = $("<div />").addClass("niceTaggerAdder").appendTo(container)[0];

		var splitChar = options.splitOn;
		var saveNewValue = macro.saveNewValue;
		var adder;

		if($().autocomplete){
			var params = paramString.parseParams("anon", null, true, false, false);
			var textcase = getParam(params, "case");
			var srcTiddler = getParam(params, "valuesSource");
			var suggestions;
			if(srcTiddler)suggestions = macro.getSuggestionsFromTiddler(srcTiddler,textcase);
			else suggestions = [];
			var tagsoff = getParam(params,"nostoretags");
			if(!tagsoff) suggestions = suggestions.concat(macro.twtags[options.field]);

			var ignoreList = paramString.parseParams("exclude",null,true,false,true);
			if(ignoreList && ignoreList[0] && ignoreList[0]["exclude"]) {
				ignoreList = ignoreList[0]["exclude"];
			} else {
				ignoreList = ["excludeList"];
			}
			suggestions = macro.removeFromList(suggestions,ignoreList);

			var addtaghandler = function(v){
				saveNewValue(tiddler, options.field, v, container, splitChar);
				$("input",tagplace).val("");
			}
			$("<input type='text' name=\""+options.field+"\" value=\"\"/>").autocomplete(suggestions,{matchContains: true,selectFirst:false}).result(addtaghandler).appendTo(tagplace);
			adder = $("input", tagplace)[0];
			
		} else {
			adder = document.createElement("input");
			tagplace.appendChild(adder);
		}
		$(adder).keypress(function (e) {
			if(e.which == 13){
				var results = $(".ac_over",".ac_results"); //is anything highlighted in autocomplete plugin
				if(results.length == 0) {
					saveNewValue(tiddler, options.field, adder.value, container, splitChar);
				}
			}
		});
		var addbutton = document.createElement("input");
		addbutton.type = "button";
		addbutton.value = macro.lingo.add;
		addbutton.className = "adder";
		tagplace.appendChild(addbutton);
		$(addbutton).click(function(e){
			var val = adder.value;
			saveNewValue(tiddler, options.field, val, container, splitChar);
		}); 
		$(place).attr("dirty","true");
	}	
};

// start optional code - The following code is optional and adds search suggestions

/*
 * Autocomplete - jQuery plugin 1.0.2
 *
 * Copyright (c) 2007 Dylan Verheul, Dan G. Switzer, Anjesh Tuladhar, JÃ¶rn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *	 http://www.opensource.org/licenses/mit-license.php
 *	 http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.autocomplete.js 5747 2008-06-25 18:30:55Z joern.zaefferer $
 *
 */
 /* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
	* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
	* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
	*
	* $LastChangedDate: 2007-07-22 01:45:56 +0200 (Son, 22 Jul 2007) $
	* $Rev: 2447 $
	*
	* Version 2.1.1
	*/
 (function($){$.fn.bgIframe=$.fn.bgiframe=function(s){if($.browser.msie&&/6.0/.test(navigator.userAgent)){s=$.extend({top:'auto',left:'auto',width:'auto',height:'auto',opacity:true,src:'javascript:false;'},s||{});var prop=function(n){return n&&n.constructor==Number?n+'px':n;},html='<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+'style="display:block;position:absolute;z-index:-1;'+(s.opacity!==false?'filter:Alpha(Opacity=\'0\');':'')+'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+'"/>';return this.each(function(){if($('> iframe.bgiframe',this).length==0)this.insertBefore(document.createElement(html),this.firstChild);});}return this;};})(jQuery);
	
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}(';(3($){$.31.1o({12:3(b,d){5 c=Y b=="1w";d=$.1o({},$.D.1L,{11:c?b:14,w:c?14:b,1D:c?$.D.1L.1D:10,Z:d&&!d.1x?10:3U},d);d.1t=d.1t||3(a){6 a};d.1q=d.1q||d.1K;6 I.K(3(){1E $.D(I,d)})},M:3(a){6 I.X("M",a)},1y:3(a){6 I.15("1y",[a])},20:3(){6 I.15("20")},1Y:3(a){6 I.15("1Y",[a])},1X:3(){6 I.15("1X")}});$.D=3(o,r){5 t={2N:38,2I:40,2D:46,2x:9,2v:13,2q:27,2d:3x,2j:33,2o:34,2e:8};5 u=$(o).3f("12","3c").P(r.24);5 p;5 m="";5 n=$.D.2W(r);5 s=0;5 k;5 h={1z:B};5 l=$.D.2Q(r,o,1U,h);5 j;$.1T.2L&&$(o.2K).X("3S.12",3(){4(j){j=B;6 B}});u.X(($.1T.2L?"3Q":"3N")+".12",3(a){k=a.2F;3L(a.2F){Q t.2N:a.1d();4(l.L()){l.2y()}A{W(0,C)}N;Q t.2I:a.1d();4(l.L()){l.2u()}A{W(0,C)}N;Q t.2j:a.1d();4(l.L()){l.2t()}A{W(0,C)}N;Q t.2o:a.1d();4(l.L()){l.2s()}A{W(0,C)}N;Q r.19&&$.1p(r.R)==","&&t.2d:Q t.2x:Q t.2v:4(1U()){a.1d();j=C;6 B}N;Q t.2q:l.U();N;3A:1I(p);p=1H(W,r.1D);N}}).1G(3(){s++}).3v(3(){s=0;4(!h.1z){2k()}}).2i(3(){4(s++>1&&!l.L()){W(0,C)}}).X("1y",3(){5 c=(1n.7>1)?1n[1]:14;3 23(q,a){5 b;4(a&&a.7){16(5 i=0;i<a.7;i++){4(a[i].M.O()==q.O()){b=a[i];N}}}4(Y c=="3")c(b);A u.15("M",b&&[b.w,b.H])}$.K(1g(u.J()),3(i,a){1R(a,23,23)})}).X("20",3(){n.18()}).X("1Y",3(){$.1o(r,1n[1]);4("w"2G 1n[1])n.1f()}).X("1X",3(){l.1u();u.1u();$(o.2K).1u(".12")});3 1U(){5 b=l.26();4(!b)6 B;5 v=b.M;m=v;4(r.19){5 a=1g(u.J());4(a.7>1){v=a.17(0,a.7-1).2Z(r.R)+r.R+v}v+=r.R}u.J(v);1l();u.15("M",[b.w,b.H]);6 C}3 W(b,c){4(k==t.2D){l.U();6}5 a=u.J();4(!c&&a==m)6;m=a;a=1k(a);4(a.7>=r.22){u.P(r.21);4(!r.1C)a=a.O();1R(a,2V,1l)}A{1B();l.U()}};3 1g(b){4(!b){6[""]}5 d=b.1Z(r.R);5 c=[];$.K(d,3(i,a){4($.1p(a))c[i]=$.1p(a)});6 c}3 1k(a){4(!r.19)6 a;5 b=1g(a);6 b[b.7-1]}3 1A(q,a){4(r.1A&&(1k(u.J()).O()==q.O())&&k!=t.2e){u.J(u.J()+a.48(1k(m).7));$.D.1N(o,m.7,m.7+a.7)}};3 2k(){1I(p);p=1H(1l,47)};3 1l(){5 c=l.L();l.U();1I(p);1B();4(r.2U){u.1y(3(a){4(!a){4(r.19){5 b=1g(u.J()).17(0,-1);u.J(b.2Z(r.R)+(b.7?r.R:""))}A u.J("")}})}4(c)$.D.1N(o,o.H.7,o.H.7)};3 2V(q,a){4(a&&a.7&&s){1B();l.2T(a,q);1A(q,a[0].H);l.1W()}A{1l()}};3 1R(f,d,g){4(!r.1C)f=f.O();5 e=n.2S(f);4(e&&e.7){d(f,e)}A 4((Y r.11=="1w")&&(r.11.7>0)){5 c={45:+1E 44()};$.K(r.2R,3(a,b){c[a]=Y b=="3"?b():b});$.43({42:"41",3Z:"12"+o.3Y,2M:r.2M,11:r.11,w:$.1o({q:1k(f),3X:r.Z},c),3W:3(a){5 b=r.1r&&r.1r(a)||1r(a);n.1h(f,b);d(f,b)}})}A{l.2J();g(f)}};3 1r(c){5 d=[];5 b=c.1Z("\\n");16(5 i=0;i<b.7;i++){5 a=$.1p(b[i]);4(a){a=a.1Z("|");d[d.7]={w:a,H:a[0],M:r.1v&&r.1v(a,a[0])||a[0]}}}6 d};3 1B(){u.1e(r.21)}};$.D.1L={24:"3R",2H:"3P",21:"3O",22:1,1D:3M,1C:B,1a:C,1V:B,1j:10,Z:3K,2U:B,2R:{},1S:C,1K:3(a){6 a[0]},1q:14,1A:B,E:0,19:B,R:", ",1t:3(b,a){6 b.2C(1E 3J("(?![^&;]+;)(?!<[^<>]*)("+a.2C(/([\\^\\$\\(\\)\\[\\]\\{\\}\\*\\.\\+\\?\\|\\\\])/2A,"\\\\$1")+")(?![^<>]*>)(?![^&;]+;)","2A"),"<2z>$1</2z>")},1x:C,1s:3I};$.D.2W=3(g){5 h={};5 j=0;3 1a(s,a){4(!g.1C)s=s.O();5 i=s.3H(a);4(i==-1)6 B;6 i==0||g.1V};3 1h(q,a){4(j>g.1j){18()}4(!h[q]){j++}h[q]=a}3 1f(){4(!g.w)6 B;5 f={},2w=0;4(!g.11)g.1j=1;f[""]=[];16(5 i=0,30=g.w.7;i<30;i++){5 c=g.w[i];c=(Y c=="1w")?[c]:c;5 d=g.1q(c,i+1,g.w.7);4(d===B)1P;5 e=d.3G(0).O();4(!f[e])f[e]=[];5 b={H:d,w:c,M:g.1v&&g.1v(c)||d};f[e].1O(b);4(2w++<g.Z){f[""].1O(b)}};$.K(f,3(i,a){g.1j++;1h(i,a)})}1H(1f,25);3 18(){h={};j=0}6{18:18,1h:1h,1f:1f,2S:3(q){4(!g.1j||!j)6 14;4(!g.11&&g.1V){5 a=[];16(5 k 2G h){4(k.7>0){5 c=h[k];$.K(c,3(i,x){4(1a(x.H,q)){a.1O(x)}})}}6 a}A 4(h[q]){6 h[q]}A 4(g.1a){16(5 i=q.7-1;i>=g.22;i--){5 c=h[q.3F(0,i)];4(c){5 a=[];$.K(c,3(i,x){4(1a(x.H,q)){a[a.7]=x}});6 a}}}6 14}}};$.D.2Q=3(e,g,f,k){5 h={G:"3E"};5 j,y=-1,w,1m="",1M=C,F,z;3 2r(){4(!1M)6;F=$("<3D/>").U().P(e.2H).T("3C","3B").1J(2p.2n);z=$("<3z/>").1J(F).3y(3(a){4(V(a).2m&&V(a).2m.3w()==\'2l\'){y=$("1F",z).1e(h.G).3u(V(a));$(V(a)).P(h.G)}}).2i(3(a){$(V(a)).P(h.G);f();g.1G();6 B}).3t(3(){k.1z=C}).3s(3(){k.1z=B});4(e.E>0)F.T("E",e.E);1M=B}3 V(a){5 b=a.V;3r(b&&b.3q!="2l")b=b.3p;4(!b)6[];6 b}3 S(b){j.17(y,y+1).1e(h.G);2h(b);5 a=j.17(y,y+1).P(h.G);4(e.1x){5 c=0;j.17(0,y).K(3(){c+=I.1i});4((c+a[0].1i-z.1c())>z[0].3o){z.1c(c+a[0].1i-z.3n())}A 4(c<z.1c()){z.1c(c)}}};3 2h(a){y+=a;4(y<0){y=j.1b()-1}A 4(y>=j.1b()){y=0}}3 2g(a){6 e.Z&&e.Z<a?e.Z:a}3 2f(){z.2B();5 b=2g(w.7);16(5 i=0;i<b;i++){4(!w[i])1P;5 a=e.1K(w[i].w,i+1,b,w[i].H,1m);4(a===B)1P;5 c=$("<1F/>").3m(e.1t(a,1m)).P(i%2==0?"3l":"3k").1J(z)[0];$.w(c,"2c",w[i])}j=z.3j("1F");4(e.1S){j.17(0,1).P(h.G);y=0}4($.31.2b)z.2b()}6{2T:3(d,q){2r();w=d;1m=q;2f()},2u:3(){S(1)},2y:3(){S(-1)},2t:3(){4(y!=0&&y-8<0){S(-y)}A{S(-8)}},2s:3(){4(y!=j.1b()-1&&y+8>j.1b()){S(j.1b()-1-y)}A{S(8)}},U:3(){F&&F.U();j&&j.1e(h.G);y=-1},L:3(){6 F&&F.3i(":L")},3h:3(){6 I.L()&&(j.2a("."+h.G)[0]||e.1S&&j[0])},1W:3(){5 a=$(g).3g();F.T({E:Y e.E=="1w"||e.E>0?e.E:$(g).E(),2E:a.2E+g.1i,1Q:a.1Q}).1W();4(e.1x){z.1c(0);z.T({29:e.1s,3e:\'3d\'});4($.1T.3b&&Y 2p.2n.3T.29==="3a"){5 c=0;j.K(3(){c+=I.1i});5 b=c>e.1s;z.T(\'3V\',b?e.1s:c);4(!b){j.E(z.E()-28(j.T("32-1Q"))-28(j.T("32-39")))}}}},26:3(){5 a=j&&j.2a("."+h.G).1e(h.G);6 a&&a.7&&$.w(a[0],"2c")},2J:3(){z&&z.2B()},1u:3(){F&&F.37()}}};$.D.1N=3(b,a,c){4(b.2O){5 d=b.2O();d.36(C);d.35("2P",a);d.4c("2P",c);d.4b()}A 4(b.2Y){b.2Y(a,c)}A{4(b.2X){b.2X=a;b.4a=c}}b.1G()}})(49);',62,261,'|||function|if|var|return|length|||||||||||||||||||||||||data||active|list|else|false|true|Autocompleter|width|element|ACTIVE|value|this|val|each|visible|result|break|toLowerCase|addClass|case|multipleSeparator|moveSelect|css|hide|target|onChange|bind|typeof|max||url|autocomplete||null|trigger|for|slice|flush|multiple|matchSubset|size|scrollTop|preventDefault|removeClass|populate|trimWords|add|offsetHeight|cacheLength|lastWord|hideResultsNow|term|arguments|extend|trim|formatMatch|parse|scrollHeight|highlight|unbind|formatResult|string|scroll|search|mouseDownOnSelect|autoFill|stopLoading|matchCase|delay|new|li|focus|setTimeout|clearTimeout|appendTo|formatItem|defaults|needsInit|Selection|push|continue|left|request|selectFirst|browser|selectCurrent|matchContains|show|unautocomplete|setOptions|split|flushCache|loadingClass|minChars|findValueCallback|inputClass||selected||parseInt|maxHeight|filter|bgiframe|ac_data|COMMA|BACKSPACE|fillList|limitNumberOfItems|movePosition|click|PAGEUP|hideResults|LI|nodeName|body|PAGEDOWN|document|ESC|init|pageDown|pageUp|next|RETURN|nullData|TAB|prev|strong|gi|empty|replace|DEL|top|keyCode|in|resultsClass|DOWN|emptyList|form|opera|dataType|UP|createTextRange|character|Select|extraParams|load|display|mustMatch|receiveData|Cache|selectionStart|setSelectionRange|join|ol|fn|padding|||moveStart|collapse|remove||right|undefined|msie|off|auto|overflow|attr|offset|current|is|find|ac_odd|ac_even|html|innerHeight|clientHeight|parentNode|tagName|while|mouseup|mousedown|index|blur|toUpperCase|188|mouseover|ul|default|absolute|position|div|ac_over|substr|charAt|indexOf|180|RegExp|100|switch|400|keydown|ac_loading|ac_results|keypress|ac_input|submit|style|150|height|success|limit|name|port||abort|mode|ajax|Date|timestamp||200|substring|jQuery|selectionEnd|select|moveEnd'.split('|'),0,{}))

// end optional code
})(jQuery); //end alias
//}}}