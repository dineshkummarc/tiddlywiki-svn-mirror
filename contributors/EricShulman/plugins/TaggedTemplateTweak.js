/***
|Name|TaggedTemplateTweak|
|Source|http://www.TiddlyTools.com/#TaggedTemplateTweak|
|Documentation|http://www.TiddlyTools.com/#TaggedTemplateTweakInfo|
|Version|1.5.1|
|Author|Eric Shulman - ELS Design Studios|
|License|http://www.TiddlyTools.com/#LegalStatements <br>and [[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]]|
|~CoreVersion|2.1|
|Type|plugin|
|Requires||
|Overrides|Story.prototype.chooseTemplateForTiddler()|
|Description|use alternative ViewTemplate/EditTemplate for tiddler's tagged with specific tag values|
This tweak extends story.chooseTemplateForTiddler() so that ''whenever a tiddler is marked with a specific tag value, it can be viewed and/or edited using alternatives to the standard tiddler templates.'' 
!!!!!Documentation
>see [[TaggedTemplateTweakInfo]]
!!!!!Revisions
<<<
2009.01.06 [1.5.1] reversed logic so that title-as-prefix takes precedence over tag-matched prefix
2008.12.18 [1.5.0] added handling for using tiddler //title// as prefix (e.g., {{{SomeTiddlerViewTemplate}}}) 
| please see [[TaggedTemplateTweakInfo]] for previous revision details |
2007.06.11 [1.0.0] initial release
<<<
!!!!!Code
***/
//{{{
version.extensions.TaggedTemplateTweak= {major: 1, minor: 5, revision: 1, date: new Date(2009,1,6)};

Story.prototype.taggedTemplate_chooseTemplateForTiddler = Story.prototype.chooseTemplateForTiddler
Story.prototype.chooseTemplateForTiddler = function(title,template)
{
	// get default template from core
	var coreTemplate=this.taggedTemplate_chooseTemplateForTiddler.apply(this,arguments);

	// if the tiddler doesn't exist yet, return core result
	var tiddler=store.getTiddler(title); if (!tiddler) return coreTemplate;

	// split core template into theme prefix and template name
	var theme="";
	var template=coreTemplate;
	var parts=template.split(config.textPrimitives.sectionSeparator);
	if (parts[1]) { theme=parts[0]; template=parts[1]; }
	else theme=config.options.txtTheme||""; // fallback if theme is not specified
	theme+=config.textPrimitives.sectionSeparator;

	// look for template whose prefix matches the *title* of this tiddler
	if (!store.getTaggedTiddlers(title).length) { // if tiddler is not a tag
		if (store.getTiddlerText(theme+title+template)) { return theme+title+template; } // theme##TitleTemplate
		if (store.getTiddlerText(title+template)) 	{ return title+template; }	 // TitleTemplate
	}

	// look for template whose prefix matches a *tag* on this tiddler (if any)
	for (i=0; i<tiddler.tags.length; i++) {
		var t=tiddler.tags[i]+template; // add tag prefix to template
		var c=t.substr(0,1).toUpperCase()+t.substr(1); // capitalized for WikiWord title
		if (store.getTiddlerText(theme+t))	{ return theme+t; } // theme##tagTemplate
		if (store.getTiddlerText(theme+c))	{ return theme+c; } // theme##TagTemplate
		if (store.getTiddlerText(t)) 		{ return t; }	    // tagTemplate
		if (store.getTiddlerText(c))		{ return c; }	    // TagTemplate
	}

	// no matching tag OR title prefix... return core result
	return coreTemplate;
}
//}}}