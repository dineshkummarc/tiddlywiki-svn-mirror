jw.search = {};
jw.search.name = 'jw.search';
jw.search.description = 'A simple search function for jigglywiki.';
jw.search.version = '0.0.1';
jw.search.author = 'PhilHawksworth';

jw.search.focus = function(input) {
	if(input.val() == 'search'){
		input.val('');
	}
};

jw.search.keypress = function(input) {
	var str = input.val();
	input.next().empty();
	if(input.val().length > 2) {
		jw.search.lookahead(input);	
	}
};

jw.search.lookahead = function(input) {
	var results = jw.getTiddlersByText(input.val(), 'store');
	if(results) {
		var list = input.next();
		var link, title;
		results.each(function(n,e){
		    title = jw.getTiddlerData(e,'store').title.text();
			link = jw.makeTiddlerLink(title);
		    list.append(link);
		});		
	}
};