/***
|''Name:''|WikispacesFormatterPlugin|
|''Description:''|Allows Tiddlers to use [[wikispaces|http://www.wikispaces.com/wikitext]] text formatting|
|''Description:''|Wikispaces Formatter|
|''Author:''|Martin Budden (mjbudden (at) gmail (dot) com)|
|''CodeRepository:''|http://svn.tiddlywiki.org/Trunk/contributors/MartinBudden/formatters/WikispacesFormatterPlugin.js |
|''Version:''|0.0.1|
|''Date:''|Nov 23, 2007|
|''Comments:''|Please make comments at http://groups.google.co.uk/group/TiddlyWikiDev |
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]] |
|''~CoreVersion:''|2.1.0|

***/

//{{{
// Ensure that the WikispacesFormatterPlugin is only installed once.
if(!version.extensions.WikispacesFormatterPlugin) {
version.extensions.WikispacesFormatterPlugin = {installed:true};

if(version.major < 2 || (version.major == 2 && version.minor < 1))
	{alertAndThrow('WikispacesFormatterPlugin requires TiddlyWiki 2.1 or later.');}

wikispacesFormatter = {}; // 'namespace' for local functions

wikispacesDebug = function(out,str)
{
	createTiddlyText(out,str.replace(/\n/mg,'\\n').replace(/\r/mg,'RR'));
	createTiddlyElement(out,'br');
};

config.wikispacesFormatters = [
{
	name: 'wikispacesTable',
	match: '^\\|\\|(?:[^\\n]*)\\|\\|$',
	lookaheadRegExp: /^\|\|([^\n]*)\|\|$/mg,
	rowTermRegExp: /(\|\|$\n?)/mg,
	cellRegExp: /(?:\|\|([^\n]*)\|\|)|(\|\|$\n?)/mg,
	cellTermRegExp: /((?:\x20*)\|\|)/mg,

	handler: function(w)
	{
		var table = createTiddlyElement(w.output,'table');
		var rowContainer = createTiddlyElement(table,'tbody');
		var rowCount = 0;
		w.nextMatch = w.matchStart;
		this.lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
			this.rowHandler(w,createTiddlyElement(rowContainer,'tr',null,(rowCount&1)?'oddRow':'evenRow'));
			rowCount++;
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		}
	},//# end handler
	rowHandler: function(w,e)
	{
		var col = 0;
		var colSpanCount = 1;
		var prevCell = null;
		this.cellRegExp.lastIndex = w.nextMatch;
		var cellMatch = this.cellRegExp.exec(w.source);
		while(cellMatch && cellMatch.index == w.nextMatch) {
			if(w.source.substr(w.nextMatch,4) == '||||') {
				// Colspan
				colSpanCount++;
				w.nextMatch += 2;
			} else if(cellMatch[2]) {
				// End of row
				if(colSpanCount > 1) {
					prevCell.setAttribute('colspan',colSpanCount);
					prevCell.setAttribute('colSpan',colSpanCount); // Needed for IE
				}
				w.nextMatch = this.cellRegExp.lastIndex;
				break;
			} else {
				// Cell
				w.nextMatch += 2; //skip over ||
				var chr = w.source.substr(w.nextMatch,1);
				var cell;
				if(chr == '!') {
					cell = createTiddlyElement(e,'th');
					w.nextMatch++;
					chr = w.source.substr(w.nextMatch,1);
				} else {
					cell = createTiddlyElement(e,'td');
				}
				var spaceLeft = false;
				while(chr == ' ') {
					spaceLeft = true;
					w.nextMatch++;
					chr = w.source.substr(w.nextMatch,1);
				}
				if(colSpanCount > 1) {
					cell.setAttribute('colspan',colSpanCount);
					cell.setAttribute('colSpan',colSpanCount); // Needed for IE
					colSpanCount = 1;
				}
				w.subWikifyTerm(cell,this.cellTermRegExp);
				if(w.matchText.substr(w.matchText.length-3,1) == ' ') {
					// SpaceRight
					cell.align = spaceLeft ? 'center' : 'left';
				} else if(spaceLeft) {
					cell.align = 'right';
				}
				prevCell = cell;
				w.nextMatch -= 2;
			}
			col++;
			this.cellRegExp.lastIndex = w.nextMatch;
			cellMatch = this.cellRegExp.exec(w.source);
		}
	}//# end rowHandler
},

{
	name: 'wikispacesHeading',
	match: '^={1,6}(?!=)',
	termRegExp: /(={0,6}\n+)/mg,
	handler: function(w)
	{
		w.subWikifyTerm(createTiddlyElement(w.output,'h'+w.matchLength),this.termRegExp);
	}
},

{
	name: "wikispaceslist",
	match: '^[\\*#]+ ',
	lookaheadRegExp: /^([\*#])+ /mg,
	termRegExp: /(\n)/mg,
	handler: function(w)
	{
		var stack = [w.output];
		var currLevel = 0, currType = null;
		var listLevel, listType, itemType, baseType;
		w.nextMatch = w.matchStart;
		this.lookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch) {
			itemType = 'li';
			listType = lookaheadMatch[1] == '*' ? 'ul' : 'ol';
			if(!baseType)
				baseType = listType;
			listLevel = lookaheadMatch[0].length;
			w.nextMatch += lookaheadMatch[0].length;
			var t;
			if(listLevel > currLevel) {
				for(t=currLevel; t<listLevel; t++) {
					var target = (currLevel == 0) ? stack[stack.length-1] : stack[stack.length-1].lastChild;
					stack.push(createTiddlyElement(target,listType));
				}
			} else if(listType!=baseType && listLevel==1) {
				w.nextMatch -= lookaheadMatch[0].length;
				return;
			} else if(listLevel < currLevel) {
				for(t=currLevel; t>listLevel; t--)
					stack.pop();
			} else if(listLevel == currLevel && listType != currType) {
				stack.pop();
				stack.push(createTiddlyElement(stack[stack.length-1].lastChild,listType));
			}
			currLevel = listLevel;
			currType = listType;
			var e = createTiddlyElement(stack[stack.length-1],itemType);
			w.subWikifyTerm(e,this.termRegExp);
			this.lookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		}
	}
},

{
	name: 'wikispacesRule',
	match: '^---+$\\n?',
	handler: function(w)
	{
		createTiddlyElement(w.output,'hr');
	}
},

{
	name: 'macro',
	match: '<<',
	lookaheadRegExp: /<<([^>\s]+)(?:\s*)((?:[^>]|(?:>(?!>)))*)>>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart && lookaheadMatch[1]) {
			w.nextMatch = this.lookaheadRegExp.lastIndex;
			invokeMacro(w.output,lookaheadMatch[1],lookaheadMatch[2],w,w.tiddler);
		}
	}
},

{
	name: 'wikispacesExplicitLink',
	match: '\\[\\[',
	lookaheadRegExp: /\[\[(.*?)(?:\|(.*?))?\]\]/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			var link = lookaheadMatch[1];
			var text = lookaheadMatch[2] ? lookaheadMatch[2] : link;
			var e = config.formatterHelpers.isExternalLink(link) ? createExternalLink(w.output,link) : createTiddlyLink(w.output,link,false,null,w.isStatic);
			createTiddlyText(e,text);
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'wikispacesUrlLink',
	match: config.textPrimitives.urlPattern,
	handler: function(w)
	{
		w.outputText(createExternalLink(w.output,w.matchText),w.matchStart,w.nextMatch);
	}
},

{
	name: 'wikispacesBold',
	match: '\\*\\*',
	termRegExp: /(\*\*|(?=\n\n))/mg,
	element: 'strong',
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: 'wikispacesItalic',
	match: '//',
	termRegExp: /(\/\/|(?=\n\n))/mg,
	element: 'em',
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: 'wikispacesUnderline',
	match: '__',
	termRegExp: /(__|(?=\n\n))/mg,
	element: 'u',
	handler: config.formatterHelpers.createElementAndWikify
},

{
	name: 'wikispacesMonospaced',
	match: '\\{\\{',
	lookaheadRegExp: /\{\{((?:.|\n)*?)\}\}/mg,
	element: 'code',
	handler: config.formatterHelpers.enclosedTextHelper
},

{
	name: 'wikispacesParagraph',
	match: '\\n{2,}',
	handler: function(w)
	{
		w.output = createTiddlyElement(w.output,'p');
	}
},

{
	name: 'wikispacesLineBreak',
	match: '\\n|<br ?/?>',
	handler: function(w)
	{
		createTiddlyElement(w.output,'br');
	}
},

{
	name: 'wikispacesComment',
	match: '<!\\-\\-',
	lookaheadRegExp: /<!\-\-((?:.|\n)*?)\-\-!>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
},

{
	name: 'wikispacesHtmlEntitiesEncoding',
	match: '&#?[a-zA-Z0-9]{2,8};',
	handler: function(w)
	{
		createTiddlyElement(w.output,'span').innerHTML = w.matchText;
	}
},

{
	name: "html",
	match: "<[Hh][Tt][Mm][Ll]>",
	lookaheadRegExp: /<[Hh][Tt][Mm][Ll]>((?:.|\n)*?)<\/[Hh][Tt][Mm][Ll]>/mg,
	handler: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart) {
			createTiddlyElement(w.output,"span").innerHTML = lookaheadMatch[1];
			w.nextMatch = this.lookaheadRegExp.lastIndex;
		}
	}
}
];

config.parsers.wikispacesFormatter = new Formatter(config.wikispacesFormatters);
config.parsers.wikispacesFormatter.format = 'wikispaces';
config.parsers.wikispacesFormatter.formatTag = 'wikispacesFormat';
} // end of 'install only once'
//}}}
