/*
http://www.wikicreole.org/templates/creole/jspwiki.css
*/

/* ----------------------------------------------------
   000 Page blocks and divs
   ---------------------------------------------------- */
   
/* +++ 030 LAYOUT of main ID blocks +++ */
#wikibody                { }
#header,
#page                    { margin-left: 20%; }
#header .pagename        { float: left; clear: both; }
#header .searchbox       { float: right; }
#header .breadcrumbs     { clear: both; }
#applicationlogo         { position: absolute; left: 7.5%; top: 4px; text-align: center; }
/* #applicationlogo      { display: block; } */
#companylogo             { display: none; }
#favorites               { position:absolute; left: 2.5%; width: 18%;
                           padding: 2px;
                           top: 80px; /* make place for the logo */ }
#actionsTop .quick2Top,
#actionsTop .pageInfo    { display: none; }
#actionsBottom .quick2Bottom
                         { display: none; }
#footer                  { margin-left: 20%; }
#footer .copyright       { clear: both; }

/* +++ 020 LOOK and FEEL of main blocks with IDs +++ */
#wikibody                { margin: 4px 2.5% 4px 2.5%; padding: 3px; }
#header                  {  }
#page                    { margin-top: 1.2em; margin-bottom: 1.4em; }
#favorites               { overflow: hidden; }
#favorites .pageactions  { display:none; }
#favorites ul            { margin-left: 0px; }

#actionsTop              { border-bottom: 2px solid #D9D9D9; }
#actionsBottom           { border-top: 2px solid #D9D9D9; }

.pageactions             { font-size: 90%; line-height: normal; text-align: right;
                           margin: 0; padding: 0.25em 0;}

.pageactions a           { background-color: #fff0ff;
                           border: 1px solid silver;
                           line-height: normal; padding: 0.25em 0.5em;
                         }
.pageactions .pageInfo a { background: transparent;
                           border: none;
                           margin: 0; padding: 0;
                         }

#actionsTop a            { border-bottom: none; }
#actionsBottom a         { border-top: none; }
#actionsBottom .quick2Top a,
#actionsTop .quick2Bottom a
                         { border: none; background-color: transparent; }

.pageactions  a:hover    { background-color: pink; }

#actionsBottom .quick2Top a:hover,
#actionsTop .quick2Bottom a:hover
                         { background-color: transparent; }

#footer                  { margin-top: 1ex; }

/* ----------------------------------------------------
   200 Text styles used by all pages
   ---------------------------------------------------- */

/* +++ 205 Base typefaces +++
   Set the default typeface and size for all text here.
   The default is a body font size of 76% per cross-browser hack at:
   http://www.thenoodleincident.com/tutorials/typography/index.html
*/
body                     { font-family: Helvetica, Arial, sans-serif; 
                           font-size: 80%;
                           color: #000; background-color: #fff; }
*                        { margin:0; padding: 0; }

/* +++ 210 Page titles, headings, and paragraphs +++ */
.pagename                { font-size: 200%; font-weight: bold; 
                           margin: 0.5em 0.5em 0.5em 0; }
h1                       { font-size: 2.0em; font-weight: normal;
	                         margin-top: 0em; margin-bottom: 0em; }
h2                       { font-size: 1.7em; font-weight: normal; 
                           margin: 1.2em 0em .8em 0em;
	                         border-bottom: 1px #D9D9D9 solid; }
h3                       { font-size: 1.4em; font-weight: normal;
                           margin: 1.2em 0em .8em 0em; }
h4                       { font-size: 1.2em; font-weight: bold;
                           margin: 1.2em 0em .8em 0em; }
h5                       { font-size: 1.0em; font-weight: bold;
	                         margin: 1.2em 0em .8em 0em; }
h6                       { font-size: 0.8em; font-weight: bold;
	                         margin: 1.2em 0em .8em 0em; }
p                        { margin: .75em 0 1em 0; }
strong, b                { font-weight: bold;	}

/* +++ 220 Lists and bullets +++ */
ol,ul                    { margin: 0.8em 0 0.8em 1.25em; }
ul                       { padding-left: 1.5em; }
li                       { margin: 0.6em 0.75em; }
li > p                   { margin-top: 0.2em; }

dl dt                    { font-weight: bold; font-size: 1.2em; }
dl dd                    { margin-left: 3em; }

/* +++ 230 Horizontal rules +++ */
hr                       { color: #D9D9D9; background: #D9D9D9;
                           height: 1px; border: 0 }

/* +++ 240 Pre-formatted text blocks and code +++ */
tt                       { font-size: 1.2em; margin: 0 .2em; }
pre                      { white-space: pre; margin: 1.5em 2em 1.8em 2em; 
	                         font-size: 1.2em;
                           background:  #f0f0f0;
                           padding: .5em .5em .6em .5em; overflow: auto; }
                           
/* +++ 250 Hyperlinks +++ */
a                        { color: blue; }
a:link                   { }
a:visited                { }
a:active                 { }
a:hover                  { }
a.editpage               { color: #FF0000; text-decoration: none;
 	                         border-bottom: 1px dashed red; }
a.external               { }                            /* External reference */
a.interwiki              { }                            /* Interwiki reference */
a.wikipage               { }                            /* Internal wiki reference */
                           
/* +++ 260 Image styles +++ */
img                      { border: 0; }
img.inline               { }

/* +++ 270 Footnotes and small text +++ */
a.footnoteref            { font-size: 85%; vertical-align: super; }
a.footnote               { color: #0044AA; }
.small                   { font-size: 85%; }
.strike                  { text-decoration: line-through; }
.sub                     { font-size: 85%; vertical-align: sub; }
.sup                     { font-size: 85%; vertical-align: super; }

/* +++ 280 Convenience styles and info/warning/error dialogs +++ */
.center                  { text-align: center; } 
.center table            { margin-left: auto; margin-right: auto; text-align: left; }
.information,
.warning,
.error                   { display: block;
                           padding: 1em 1em 1em 2.5em;
                           margin: 1em .5em;
                           background-position: .8em .9em;
                           background-repeat: no-repeat; }
.information             { background-image: url(images/information.png);
                           background-color: #e0e0ff; }
.warning                 { background-image: url(images/error.png);
                           background-color: #ffff80; }
.error                   { background-image: url(images/exclamation.png); 
                           background-color: #ffe0e0; }
.error * li              { margin-left: 0; padding-left: 0; }

.ltr                     { direction: ltr; }
.rtl                     { direction: rtl; }

/* +++ 290 Comment boxes (used on some pages) +++ */
.commentbox              { float:right;
                           width: 20%; 
                           background: #fff0ff;
                           border-style: solid;
                           border-width: 1px;
                           border-color: #A8A8A8;
                           padding: 4px; 
                           margin-left: 4px; }
                           
.commentbox ul, .commentbox ol
                         { padding-left: 1em; margin-left: 4px; }

/* +++ 300 Wiki tables and zebra tables +++ */
.wikitable               { border: 1px solid #666666; 
                           border-spacing: 0; 
                           margin: 1.5em 2em 1.8em 2em; }
.wikitable * tr th       { font-size: 100%; 
                           padding: .5em .7em .5em .7em;
	                       border-left: 1px solid #666666;
	                       background-color: #3d80df;
	                       vertical-align: bottom;
	                       color: black;
	                       empty-cells: show; }
.wikitable * tr td       { font-size: 95%; 
                           padding: .4em .7em .45em .7em;
	                       border-left: 1px solid #D9D9D9;
	                       vertical-align: top;
	                       empty-cells: show; }
.wikitable * tr.odd td   { background-color: #e3f0ee; }

.zebra-table th          { background:  #e0e0e0; }
.zebra-table tr.odd td   { background:  #e3f0ee; }

/* +++ 350 Attachments +++ */
#attachments             { }
#attachments .list       { float: left; min-width: 300px; }
#attachments .preview    { float: right; }
#attachments * table     { width: 40em; }
#attachments h3          { border-bottom: 1px solid grey; }

/* ----------------------------------------------------
   400 Styles for specific JSPs
   ---------------------------------------------------- */

/* +++ 405 AttachmentTab +++ */
#attachImg               { margin:0; vertical-align: middle; text-align: center;
                           height: 300px; width: 300px; 
                           border: 4px solid #e0e0e0; }
#attachSelect            { margin: 0.5em 0; }

/* +++ 410 CommentContent +++ */
#addcomment              { }

/* +++ 415 CommentContent and PageContent +++ */
#pagecontent             { }

/* +++ 420 DiffContent and Diff Providers: Traditional and External +++ */
#diffcontent             {  }
td.diffadd               { background: #99FF99; font-family: monospace; }
td.diffrem               { background: #FF9933; font-family: monospace; }
td.diff                  { background: #FFFFFF; font-family: monospace; }

/* +++ 425 Edit/EditContent and CommentContent +++ */
body.edit                { background-color: #D9E8FF; } /* Edit.jsp BODY element */
body.comment             { background-color: #EEEEEE; } /* Comment.jsp BODY element */
#edithelp                {  }

/* +++ 430 Edit/EditContent +++ */
textarea.editor          { }
#editcontent             {  }
#searchbar               { margin: 1em 0; }
#searchbarhelp           {  }
                           
/* +++ 440 Favorites +++ */
.boxtitle                { padding: 0.25em; text-align: center;
                           border-bottom: 1px solid black; }
.myfavorites             { margin-bottom: 1.5ex; 
                           border: 1px outset grey; 
                           padding: .5em;}
.myfavorites .boxtitle   { margin-bottom: 0.5ex;
                           margin-top: 0.5ex;
                           font-size: 100%; }
.username                { font-style: italic; text-align: center; }

/* +++ 445 Favorites and Footer +++ */
.wikiversion, .rssfeed   { padding: 1em 0; 
                           text-align: center; }

.wikiversion             { display: none; }

/* +++ 450 FindContent +++ */
.graphBars               { }
.graphBar                { background: #ff9933; color: #ff9933; }
.gBar                    { white-space: nowrap; }

/* +++ 455 Footer +++ */
.copyright               { }

/* +++ 460 Header +++ */
.breadcrumbs             { font-size: 85%;
                           padding: 0 1.5em 0.5em 0em; }

/* +++ 465 InfoContent +++ */
#infocontent             { overflow: auto; }
#infocontent tr          { vertical-align: top; }
#infocontent th          { text-align: left; white-space: nowrap;  }
#referingto,
#referencedby,
#versionhistory          {  }
#versionhistory td       { white-space: nowrap; }
#infocontent .changenote { font-style: italic; }

/* +++ 470 PageActions +++ */
.pageInfo                { font-style: italic; padding: .5em 0; }
.quick2Top a             { background-image:url(images/bulletUp.png);
                           background-repeat: no-repeat; background-position: 0 1px;
                           padding: 0 8px 12px 0; 
                           text-decoration: none; }
.quick2Bottom a          { background-image:url(images/bulletDown.png);
                           background-repeat: no-repeat; background-position: 0 0;
                           padding: 0 8px 12px 0;
                           text-decoration: none; }

/* +++ 475 PreviewContent - "This is a preview" comment +++ */
.previewcontent          { background: #E0E0E0; padding: 1em; }

/* +++ 480 PreferencesContent, LoginContent, GroupContent +++ */
div.formcontainer        { width: 440px; margin: 20px 0 0 0; }
div.formcontainer form   { border-bottom: 2px solid silver; }
div.formcontainer div.block
                         { vertical-align: top;
                           padding: 10px 0px;
                           border-top: 1px solid silver; }
div.formcontainer form label 
                         { width: 120px; float: left;
                           padding-top: .25em; margin: 0 10px; }
div.formcontainer input  { padding: 0.15em; }
div.formcontainer input[type='submit'] 
                         { width:auto; margin-right: 1em; float:right }
div.formcontainer textarea 
                         { padding: 0; width:65%; margin: 0 0 0 140px;  }
div.formcontainer .instructions
                         { margin: 0.5em 0; }
div.formcontainer .description
                         { margin: 0.5em 10px 0.5em 140px; font-style: italic; }
div.formcontainer .readonly
                         { margin: 0 10px 0.5em 140px; }

/* +++ 485 SearchBox +++ */
#searchboxMenu           { padding: 4px;
                           position: absolute; background: white;
                           border: 1px solid silver; }
#recentSearches          { margin: 0.5em 0 0 0.5em; color: silver; }
#recentSearches div      { color: black; cursor: pointer;}
.searchbox               { margin: 1em 0.5em 0.5em 0.5em; }

/* +++ 490 ViewTemplate +++ */
body.view                { background-color: white; }   /* Wiki.jsp BODY element */

/* +++ 495 EditorBar in Edit.jsp +++ */
#editorbar            { float:right; 
                        border-style: solid;
                        border-width: 1px;
                        border-color: #A8A8A8;
                        background: #f0f0f0; 
                        padding: 2px; }


/* ----------------------------------------------------
   600 JSPWiki plugins
   ---------------------------------------------------- */

/* +++ 610 Image plugin +++ */
.imageplugin             { margin: .5em; }
.imageplugin img         { border: 0; }
.imageplugin caption     { }

/* +++ 620 Index plugin +++ */
div.index                { }
div.index .header        { padding: 4px; background: #f0f0f0; }
div.index .body          { }
div.index .section a     { display: block; padding: 0 0.25em;   
                           color:black;
                           font-weight: bold; text-decoration: none; }

/* +++ 625 Table of contents plugin +++ */
.toc                     { background: #edf3fe; padding: .75em; }
.toc h4                  { margin-top: 0px; }
.toc ul                  { list-style: none; margin-left: 0; padding-left: 0; }
.toc li                  { padding-left: 0; display: block; }
.toc li.toclevel-1       { margin-left: 0.5em; }
.toc li.toclevel-2       { margin-left: 1.5em; }
.toc li.toclevel-3       { margin-left: 2.5em; }

/* +++ 630 Weblog and weblogarchive plugins +++ */
.weblog                  { }
.weblogentry             { margin: 1em 0 2em 0; }
.weblogentryheading      { color: #999999; margin-top: 2em; 
 	                         border-bottom: 1px #D9D9D9 solid;}
.weblogentrytitle        { font-size: 1.5em; font-weight: bold; 
                           margin: 0.5em 0 .8em 0; }
.weblogentrybody         { }
.weblogentryfooter       { font-style: italic; margin-top: 1em; clear: both; }
.weblogentryfooter a     { font-style: normal; margin-left: 0.5em; }
.weblogarchive           { }
.weblogarchive ul        { margin-top: 0px;
                           padding: 0px; }
.weblogarchive li        { display: block; list-style-type: none; margin-left: 1em; }
.archiveyear             { font-weight: bold; text-decoration: none;
                           margin-left: 0px !important; }
.archiveyear:after       { content: " AD" }

/* +++ 640 RecentChangesPlugin +++ */

.recentchanges           { }
.recentchanges .changenote { font-style: italic; }

/* ----------------------------------------------------
   800 JSPWiki JSP Taglibs
   ---------------------------------------------------- */
   
/* +++ 805 CalendarTag +++ */
div.calendar             { border: 1px solid black; }
table.calendar           { }
table.calendar td        { text-align: center; }
table.calendar td.othermonth
                         { color: #707070; }
table.calendar td.link   { background: #E0E0E0; }
table.calendar tr.month  { }
table.calendar tr.weekdays
                         { color: #FF0000; }

/* +++ 810 The CSS Styles for the Contextual diff provider +++ */
.diff-wikitext           { margin: 10px; padding: 5px; 
                           border-width: thin; border-style:inset; 
                           font-family: monospace;  }
.diff-insertion          { background: #ddffdd; 
                           text-decoration:  none; color: #8000ff; } 
.diff-deletion           { background: #ffdddd; 
                           text-decoration: line-through; color: red; } 
.diff-nextprev           { vertical-align: super; text-decoration: none; }

/* ----------------------------------------------------
   900 "Special-effects" JavaScript styles
   ---------------------------------------------------- */
   
/* +++ 905 Search highlights +++
   For the search_highlight.js.  This style defines the how the words that have
   been found look like.  If you look for "thingy", you will get these following
   in the results.
   <span class="searchword">thingy</span>
 */
.searchword              { background-color: #FFFF00; color: black; 
                           text-decoration: inherit; }

/*
 * For fragments in search results (from FindPage), and the search match
 * within a fragment. 
 */
.fragment                { margin-left: 1em; font-size: 90%; }
.fragment_ellipsis       { font-weight: bold; }
/* .searchmatch             { background-color: yellow; } Too strong ? */
.searchmatch             { font-weight: bold; }

/* +++ 910 Tabbed Pages +++ */
/* use absolute position trick to avoid page bump when inserting tabmenu */
.tabs                    { margin: 0; padding: 1em;
                           border: 1px solid gray; border-top: none; }
.tabmenu                 { margin: 0; padding: 0.25em 0 0.25em 1em;
                           border-bottom: 1px solid gray; }
.tabmenu span            { margin: 0; padding: 0; overflow: hidden; }
.tabmenu span a          { color: grey; background: #dddddd;
                           margin: 0 0 0 -1px; padding: 0.25em 0.5em;
                           text-decoration: none; cursor: pointer;
                           border: 1px solid gray; border-bottom:none; }
.tabmenu .activetab      { color: black; background: white;
                           font-weight: bold;
                           border-bottom: 1px solid white; cursor: default;  }
.edit .tabmenu a         { background: white; }
.edit .tabmenu .activetab
                         { background: #D9E8FF; border-bottom: 1px solid #d9e8ff;}
.tabmenu .alerttab a, .edit .tabmenu .alerttab a
                         { color: white; background: red; }
.tabmenu .alerttab .activetab, .edit .tabmenu .alerttab .activetab
                         { color: red; background: #D9E8FF;
                           border-bottom: 1px solid #d9e8ff; }

/* +++ 920 Collapsable lists +++ */
div.collapse ul,
div.collapse ol          { margin-left: 1.5em; padding:0; }
div.collapse * ul,
div.collapse * ol        { margin-left:0 ; padding-left: 1.5em; }
     
div.collapse li          { list-style: none; position: relative; }

/* relative to the containing LI */     
.collapseBullet,
.collapseOpen,
.collapseClose           { position: absolute; left: -1.5em;
                           font-weight: bold; color: blue;
                           font-family: Verdana, sans-serif; }
.collapseOpen,
.collapseClose           { cursor: pointer; }

.collapseOpen:hover,
.collapseClose:hover     { background: #FF9933; color: white; }

.collapse .collapseBullet,
.collapse .collapseOpen,
.collapse .collapseClose { left: -1.5em !important; right: auto !important; }

/* collapsebox */
.collapsebox             { border: 1px solid gray; position:relative; margin: 1em 0;}
.collapsebox h2,
.collapsebox h3,
.collapsebox h4          { margin: 0; padding: 0.25em 0.5em; }
.collapsebody            { margin: 0.5em 1em;  }

.toc .collapsebox        { border: 0; margin: 0; }

.collapsebox .collapseOpen,
.collapsebox .collapseClose
                         { top:0; left:auto; right:0.5em;
                           font-size: 13px; }
.collapsebox .quicklinks { display: none; }

/* +++ 930 Sortable tables +++ */
.sortable .sort,
.sortable .sortAscending,
.sortable .sortDescending
                         { cursor: pointer;
                           background-color: #f0f0f0;
                           background-repeat: no-repeat; 
                           background-position: 0.25em 50%; }
.sortable .sortAscending { background-image: url(images/bulletDown.png); }
.sortable .sortDescending
                         { background-image: url(images/bulletUp.png); }

/* ----------------------------------------------------
   1000 Miscellaneous Cross-Browser Hackery
   ---------------------------------------------------- */
   
/* Use as div 'block enclosure' to clear floats properly. This works across browsers
   (even IE). Also known as the Wyke-Smith/Alsett/Holly 'clearfix' hack */
.block:after             { content: "."; display: block; height: 0; 
                           clear: both; visibility: hidden; }
.block                   { display: inline-block; }
* html .block            { height: 1%;}
.block                   { display: block; }

