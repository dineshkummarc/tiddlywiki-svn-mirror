// ---------------------------------------------------------------------------------
// Formatter helpers
// ---------------------------------------------------------------------------------

function Formatter(formatters)
{
	this.formatters = [];
	var pattern = [];
	for(var n=0; n<formatters.length; n++)
		{
		pattern.push("(" + formatters[n].match + ")");
		this.formatters.push(formatters[n]);
		}
	this.formatterRegExp = new RegExp(pattern.join("|"),"mg");
}

config.formatterHelpers = {

	charFormatHelper: function(w)
	{
		var e = createTiddlyElement(w.output,this.element);
		w.subWikify(e,this.terminator);
	},

	createElementAndWikify: function(w)
	{
		var e = createTiddlyElement(w.output,this.element);
		w.subWikifyTerm(e,this.termRegExp);
	},

	inlineCssHelper: function(w)
	{
		var styles = [];
		config.textPrimitives.cssLookaheadRegExp.lastIndex = w.nextMatch;
		var lookaheadMatch = config.textPrimitives.cssLookaheadRegExp.exec(w.source);
		while(lookaheadMatch && lookaheadMatch.index == w.nextMatch)
			{
			var s,v;
			if(lookaheadMatch[1])
				{
				s = lookaheadMatch[1].unDash();
				v = lookaheadMatch[2];
				}
			else
				{
				s = lookaheadMatch[3].unDash();
				v = lookaheadMatch[4];
				}
			if (s=="bgcolor")
				s = "backgroundColor";
			styles.push({style: s, value: v});
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			config.textPrimitives.cssLookaheadRegExp.lastIndex = w.nextMatch;
			lookaheadMatch = config.textPrimitives.cssLookaheadRegExp.exec(w.source);
			}
		return styles;
	},

	applyCssHelper: function(e,styles)
	{
		for(var t=0; t< styles.length; t++)
			{
			try
				{
				e.style[styles[t].style] = styles[t].value;
				}
			catch (ex)
				{
				}
			}
	},

	monospacedByLineHelper: function(w)
	{
		var lookaheadRegExp = new RegExp(this.lookahead,"mg");
		lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var text = lookaheadMatch[1];
			if(config.browser.isIE)
				text = text.replace(/\n/g,"\r");
			var e = createTiddlyElement(w.output,"pre",null,null,text);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	},

	enclosedTextHelper: function(w)
	{
		this.lookaheadRegExp.lastIndex = w.matchStart;
		var lookaheadMatch = this.lookaheadRegExp.exec(w.source);
		if(lookaheadMatch && lookaheadMatch.index == w.matchStart)
			{
			var text = lookaheadMatch[1];
			if(config.browser.isIE)
				text = text.replace(/\n/g,"\r");
			var e = createTiddlyElement(w.output,this.element,null,null,text);
			w.nextMatch = lookaheadMatch.index + lookaheadMatch[0].length;
			}
	},

	isExternalLink: function(link)
	{
		if(store.tiddlerExists(link) || store.isShadowTiddler(link))
			{
			// definitely not an external link
			return false;
			}
		var urlRegExp = new RegExp(config.textPrimitives.urlPattern,"mg");
		if(urlRegExp.exec(link))
			{
			// definitely an external link
			return true;
			}
		if (link.indexOf(".")!=-1 || link.indexOf("\\")!=-1 || link.indexOf("/")!=-1)
			{
			// link contains . / or \ so is probably an external link
			return true;
			}
		// otherwise assume it is not an external link
		return false;
	}

};

