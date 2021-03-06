/***
|''Name''|AdvancedFilterTiddlersPlugin|
|''Description''|Overrides the core filterTiddlers to provide a more complete syntax compatible with default tiddlers|
|''Author''|Jon Robson|
|''Version''|0.8.9|
|''Date''|April 2010|
|''Status''||
|''License''|BSD|
|''CoreVersion''|<...>|
|''Documentation''|<...>|
!Usage
*OR syntax [field[value]] 
eg. [tag[foo]] [tag[bar]]
gives you all tiddlers tagged with foo or bar
*AND syntax
[tag[foo]tag[bar]]
gives you all tiddlers tagged with foo and bar
* more powerful sorting
allows you to sort by an integer field
[tag[foo]sort(int)[priority]]
[tag[*]] gives you all tiddlers with a tag.
Great for improving usage of the list macro and defaultTiddlers|
***/
//{{{
//state transition function is a function that returns a new state.
config.extensions.finite_state_automata = function(transition_function,final_states){
	this.defineTransitionFunction(transition_function);
	this.final_states = final_states;
}	
config.extensions.finite_state_automata.prototype={
	reset: function(){
		this.final_states = [];
		this.transition_function= false;
	}
	,isFinalState: function(state){
		return this.final_states.indexOf(state) != -1;
	}
	,run: function(startState,input,time){
		if(!time){
			time = 0;
		}
		if(time > 100) throw "stuck!";
		if(this.isFinalState(startState)){
			return input;
		}
		if(!this.transition_function){
			throw "please define a transition function which takes two parameters - a state and token";
		}
		if(!input.charAt){
			throw "error in finite_state_automata input must be a string";
		}
		var state = this.transition_function(startState,input.charAt(0));

		var remaining_input = input.substr(1);
	
		return this.run(state,remaining_input,time+1);
		 
	}
	,defineFinalState: function(state){
		this.final_states.push(state);
	}
	,defineTransitionFunction: function(f){
		this.transition_function = f;
	}
}

Array.prototype.concatUnique = function(items,unique){
	for(var i=0; i < items.length;i++){
		var item = items[i];
		this.pushUnique(item);
	}
	return this;
}

TiddlyWiki.prototype.sortTiddlers = function(tiddlers,field,fieldType)
{
	var asc = 1;
	if(!fieldType) {
		fieldType ="";
	}
	var convert;
	switch(fieldType.toLowerCase()){
			case "int":
					convert = function(v){if(!v) return 0; else return parseInt(v);}
					break;
			case "float":
					convert = function(v){if(!v) return 0; else return parseFloat(v)};
					break;
			default:
					convert = function(v){
						if(typeof(v) == typeof("")) {
							return v.toLowerCase();
						} else {
							return v;
						}
					};
	}
	switch(field.substr(0,1)) {
	case "-":
		asc = -1;
		// Note: this fall-through is intentional
		/*jsl:fallthru*/
	case "+":
		field = field.substr(1);
		break;
	}
	if(TiddlyWiki.standardFieldAccess[field]) {
		tiddlers.sort(function(a,b) {return convert(a[field]) < convert(b[field]) ? -asc : (convert(a[field]) == convert(b[field]) ? 0 : asc);});
	} else {
		tiddlers.sort(function(a,b) {return convert(a.fields[field]) < convert(b.fields[field]) ? -asc : (convert(a.fields[field]) == convert(b.fields[field]) ? 0 : +asc);});
	}
	return tiddlers;
};

//bit like getTaggedTiddlers only works on fields too
TiddlyWiki.prototype.getValueTiddlers = function(fieldName, value, tiddlers) {
	var negationMode = false;
	var anyMode = false;
	if(value[0] == "!") {
		value = value.substr(1);
		negationMode = true;
	}
	if(value == "*") {
		anyMode = true;
	}
	var filterResult = [];
	tiddlers = tiddlers ? tiddlers : store.getTiddlers();
	if(fieldName == 'tag') {
		fieldName = "tags";
	}
	for(var i = 0; i < tiddlers.length; i++){
		var tiddler = tiddlers[i];
		var values;
		if(tiddler[fieldName]){
			values = tiddler[fieldName]
		}
		else if(tiddler.fields[fieldName]){
			values = tiddler.fields[fieldName];
		}
		else{
			values = false;
		}

		if(values){
			if(anyMode) {
				filterResult.pushUnique(tiddler);
			} else if(typeof(values)== 'string') {
				if(values == value && !negationMode) {
					filterResult.pushUnique(tiddler);
				} else if(negationMode && values !=value) {
					filterResult.pushUnique(tiddler);
				}
			}
			else {
				if(!negationMode && values.indexOf(value) >-1) {
					filterResult.pushUnique(tiddler);
				}
				else if(negationMode && values.indexOf(value) == -1) {
					filterResult.pushUnique(tiddler);
				}
			}
		}
	}
	return filterResult;
}
TiddlyWiki.prototype.filterTiddlers = function(filter, tiddlers) {
	tiddlers = tiddlers ? tiddlers : store.getTiddlers();
	var filterResult = [];
	var open = 0;
	var current_state = 'A';
	if(typeof(filter) == 'object'){
		var result = [];
		for(var i = 0; i < filter.length; i++){
			result = result.concat(this.filterTiddlers(filter[i], tiddlers));
		}
		return result;
	}

	var value = "",field = "", mem ="";
	var arg1 = "",arg2="";
	var andFilter = [];
	var write_to_arg1 = function(ch) {
		if(ch != ']' && ch != "[" && ch != "\n") {
			arg1 += ch;
		}
	}
	var write_to_arg2 = function(ch) {
		if(ch != ']' && ch != "[" && ch != "\n") {
			arg2 += ch;
		}
	}
	var restart = function(){
		arg1 = "";
		arg2 = "";
		andFilter = [];
	}
	var addTiddler = function(){
		arg1 = arg1.trim();
		var tid = store.getTiddler(arg1);
		if(tid) {
			filterResult.pushUnique(tid);
		}
		restart();
	}
	var tw = this;
	var sort = function(tiddlers, arg1, arg2) {
		var stype = false;
		var startType = arg1.indexOf("(") + 1;
		if(startType >0) {
			stype = arg1.substr(startType,arg1.length-startType-1);
		}
		tiddlers = tw.sortTiddlers(tiddlers, arg2, stype)
		return tiddlers;
	}
	var applyORFilter = function(ch) {
		//console.log("apply or filter",arg1,arg2);
		arg1 = arg1.trim();
		arg2 = arg2.trim();
		
		if(arg1.indexOf("limit") === 0) {
			filterResult = filterResult.splice(0,parseInt(arg2))
		} else if(arg1.indexOf("sort") === 0) {
			filterResult = sort(filterResult, arg1, arg2);
		} else {
			filterResult = filterResult.concatUnique(tw.getValueTiddlers(arg1, arg2, tiddlers));
		}
		restart();
	}
	var applyAndFilter = function(ch){
		saveAndFilterArg(ch);
		//console.log("applying and filter",andFilter);
		var andResult = false;
		for(var i=0; i < andFilter.length; i++) {
			var filter = andFilter[i];
			if(arg1.indexOf("limit") == 0) {
				filterResult= filterResult.splice(0,parseInt(arg2))
			} else if(andResult && filter[0].indexOf("sort") == 0) {
				andResult = sort(andResult, filter[0], filter[1])
			} else {
				andResult = tw.getValueTiddlers(filter[0], filter[1], andResult);
			}
		}
		filterResult = filterResult.concat(andResult);
		restart();
	}
	var saveAndFilterArg = function(ch){
		//console.log("saving filter",arg1,arg2)
		andFilter.push([arg1.trim(),arg2.trim()])
		arg1 = "";
		write_to_arg1(ch);
		arg2 = "";
		return "I";
	};

	var tf = function(state, token){
		switch(state){
			case 'A':
				write_to_arg1(token);
				if(token =='[') return 'B'
				else if(token == " " || token =="\n" || token == "\t") return "A";
				else return "Y";
			case 'Y':
				write_to_arg1(token);
				if(!token || token == " " || token =="\n" || token == "\t") {
					addTiddler();
					return 'Z'
				}
				else return "Y";
			case 'B':
				write_to_arg1(token);
				if(token =='[') return "C";
				else return "F";
			case 'C':
				write_to_arg1(token);
				if(token ==']') return "D";
				else return "C";
			case 'D':
				if(token ==']') {
					addTiddler();
					return "Z"
				}
			case 'F':
				write_to_arg1(token);
				if(token =='[') return "G";
				else return "F";
			case 'G':
				write_to_arg2(token);
				if(token ==']') return "H";
				else return "G";
			case 'H':
				if(token ==']'){
					applyORFilter(token);
					return "Z";
				}
				else {
					saveAndFilterArg(token)
					return "I"
				}
			case 'I':
				write_to_arg1(token);
				if(token =='[') return "J";
				else return "I";
			case 'J':
				write_to_arg2(token);
				if(token ==']') return "K";
				else return "J";
			case 'K':
				if(token ==']') {
					applyAndFilter(token);
					return "Z";
				}
				else {
					saveAndFilterArg(token);
					return 'I'
				}
		}
		throw "the finite state automata could not parse the input."
	}
	var fsa = new config.extensions.finite_state_automata(tf, ['Z']);
	var remaining = fsa.run("A", filter);
	var timeout = 100;
	while(timeout > 0 && remaining != ""){
		remaining = fsa.run("A", remaining);
		timeout -= 1;
		if(timeout === 0) {
			throw "timed out with remaining input at " + remaining;
		}
	}
	
	return filterResult;
};
//}}}