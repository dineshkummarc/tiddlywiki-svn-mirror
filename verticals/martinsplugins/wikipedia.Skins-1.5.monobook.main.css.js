/***

http://en.wikipedia.org/skins-1.5/monobook/main.css

** MediaWiki 'monobook' style sheet for CSS2-capable browsers.
** Copyright Gabriel Wicke - http://wikidev.net/
** License: GPL (http://www.gnu.org/copyleft/gpl.html)
**
** Loosely based on http://www.positioniseverything.net/ordered-floats.html by Big John
** and the Plone 2.0 styles, see http://plone.org/ (Alexander Limi,Joe Geldart & Tom Croucher,
** Michael Zeltner and Geir Bækholt)
** All you guys rock :)

***/

/*{{{*/
#column-content {
	width: 100%;
	float: right;
	margin: 0 0 .6em -12.2em;
	padding: 0;
}
#content {
	margin: 2.8em 0 0 12.2em;
	padding: 0 1em 1.5em 1em;
	background: white;
	color: black;
	border: 1px solid #aaa;
	border-right: none;
	line-height: 1.5em;
	position: relative;
	z-index: 2;
}
#column-one {
	padding-top: 160px;
}
/* the left column width is specified in class .portlet */

/* Font size:
** We take advantage of keyword scaling- browsers won't go below 9px
** More at http://www.w3.org/2003/07/30-font-size
** http://style.cleverchimp.com/font_size_intervals/altintervals.html
*/

body {
	font: x-small sans-serif;
	background: #f9f9f9 url(headbg.jpg) 0 0 no-repeat;
	color: black;
	margin: 0;
	padding: 0;
}

/* scale back up to a sane default */
#globalWrapper {
	font-size: 127%;
	width: 100%;
	margin: 0;
	padding: 0;
}
.visualClear {
	clear: both;
}

/* general styles */

table {
	font-size: 100%;
	color: black;
}
a {
	text-decoration: none;
	color: #002bb8;
	background: none;
}
a:visited {
	color: #5a3696;
}
a:active {
	color: #faa700;
}
a:hover {
	text-decoration: underline;
}
a.stub {
	color: #772233;
}
a.new, #p-personal a.new {
	color: #ba0000;
}
a.new:visited, #p-personal a.new:visited {
	color: #a55858;
}

img {
	border: none;
	vertical-align: middle;
}
p {
	margin: .4em 0 .5em 0;
	line-height: 1.5em;
}
p img {
	margin: 0;
}

hr {
	height: 1px;
	color: #aaa;
	background-color: #aaa;
	border: 0;
	margin: .2em 0 .2em 0;
}

h1, h2, h3, h4, h5, h6 {
	color: black;
	background: none;
	font-weight: normal;
	margin: 0;
	padding-top: .5em;
	padding-bottom: .17em;
	border-bottom: 1px solid #aaa;
}
h1 { font-size: 188%; }
h2 { font-size: 150%; }
h3, h4, h5, h6 {
	border-bottom: none;
	font-weight: bold;
}
h3 { font-size: 132%; }
h4 { font-size: 116%; }
h5 { font-size: 100%; }
h6 { font-size: 80%;  }

ul {
	line-height: 1.5em;
	list-style-type: square;
	margin: .3em 0 0 1.5em;
	padding: 0;
	list-style-image: url(bullet.gif);
}
ol {
	line-height: 1.5em;
	margin: .3em 0 0 3.2em;
	padding: 0;
	list-style-image: none;
}
li {
	margin-bottom: .1em;
}
dt {
	font-weight: bold;
	margin-bottom: .1em;
}
dl {
	margin-top: .2em;
	margin-bottom: .5em;
}
dd {
	line-height: 1.5em;
	margin-left: 2em;
	margin-bottom: .1em;
}

fieldset {
	border: 1px solid #2f6fab;
	margin: 1em 0 1em 0;
	padding: 0 1em 1em;
	line-height: 1.5em;
}
legend {
	padding: .5em;
	font-size: 95%;
}
form {
	border: none;
	margin: 0;
}

textarea {
	width: 100%;
	padding: .1em;
}

input.historysubmit {
	padding: 0 .3em .3em .3em !important;
	font-size: 94%;
	cursor: pointer;
	height: 1.7em !important;
	margin-left: 1.6em;
}
select {
	vertical-align: top;
}
abbr, acronym, .explain {
	border-bottom: 1px dotted black;
	color: black;
	background: none;
	cursor: help;
}
q {
	font-family: Times, "Times New Roman", serif;
	font-style: italic;
}
/* disabled for now
blockquote {
	font-family: Times, "Times New Roman", serif;
	font-style: italic;
}*/
code {
	background-color: #f9f9f9;
}
pre {
	padding: 1em;
	border: 1px dashed #2f6fab;
	color: black;
	background-color: #f9f9f9;
	line-height: 1.1em;
}

/*
** the main content area
*/

#siteSub {
	display: none;
}

#jump-to-nav {
	display: none;
}

#contentSub, #contentSub2 {
	font-size: 84%;
	line-height: 1.2em;
	margin: 0 0 1.4em 1em;
	color: #7d7d7d;
	width: auto;
}
span.subpages {
	display: block;
}

/* Some space under the headers in the content area */
#bodyContent h1, #bodyContent h2 {
	margin-bottom: .6em;
}
#bodyContent h3, #bodyContent h4, #bodyContent h5 {
	margin-bottom: .3em;
}
.firstHeading {
	margin-bottom: .1em;
}

/* user notification thing */
.usermessage {
	background-color: #ffce7b;
	border: 1px solid #ffa500;
	color: black;
	font-weight: bold;
	margin: 2em 0 1em;
	padding: .5em 1em;
	vertical-align: middle;
}
#siteNotice {
	text-align: center;
	font-size: 95%;
	padding: 0 .9em;
}
#siteNotice p {
	margin: 0;
	padding: 0;
}
.error {
	color: red;
	font-size: larger;
}
.errorbox, .successbox {
	font-size: larger;
	border: 2px solid;
	padding: .5em 1em;
	float: left;
	margin-bottom: 2em;
	color: #000;
}
.errorbox {
	border-color: red;
	background-color: #fff2f2;
}
.successbox {
	border-color: green;
	background-color: #dfd;
}
.errorbox h2, .successbox h2 {
	font-size: 1em;
	font-weight: bold;
	display: inline;
	margin: 0 .5em 0 0;
	border: none;
}

#catlinks {
	border: 1px solid #aaa;
	background-color: #f9f9f9;
	padding: 5px;
	margin-top: 1em;
	clear: both;
}
/* currently unused, intended to be used by a metadata box
in the bottom-right corner of the content area */
.documentDescription {
	/* The summary text describing the document */
	font-weight: bold;
	display: block;
	margin: 1em 0;
	line-height: 1.5em;
}
.documentByLine {
	text-align: right;
	font-size: 90%;
	clear: both;
	font-weight: normal;
	color: #76797c;
}

/* emulate center */
.center {
	width: 100%;
	text-align: center;
}
*.center * {
	margin-left: auto;
	margin-right: auto;
}
/* small for tables and similar */
.small, .small * {
	font-size: 94%;
}
table.small {
	font-size: 100%;
}

/*
** content styles
*/

#toc,
.toc,
.mw-warning {
	border: 1px solid #aaa;
	background-color: #f9f9f9;
	padding: 5px;
	font-size: 95%;
}
#toc h2,
.toc h2 {
	display: inline;
	border: none;
	padding: 0;
	font-size: 100%;
	font-weight: bold;
}
#toc #toctitle,
.toc #toctitle,
#toc .toctitle,
.toc .toctitle {
	text-align: center;
}
#toc ul,
.toc ul {
	list-style-type: none;
	list-style-image: none;
	margin-left: 0;
	padding-left: 0;
	text-align: left;
}
#toc ul ul,
.toc ul ul {
	margin: 0 0 0 2em;
}
#toc .toctoggle,
.toc .toctoggle {
	font-size: 94%;
}

.mw-warning {
	margin-left: 50px;
	margin-right: 50px;
	text-align: center;
}

/* images */
div.floatright, table.floatright {
	clear: right;
	float: right;
	position: relative;
	margin: 0 0 .5em .5em;
	border: 0;
/*
	border: .5em solid white;
	border-width: .5em 0 .8em 1.4em;
*/
}
div.floatright p { font-style: italic; }
div.floatleft, table.floatleft {
	float: left;
	position: relative;
	margin: 0 .5em .5em 0;
	border: 0;
/*
	margin: .3em .5em .5em 0;
	border: .5em solid white;
	border-width: .5em 1.4em .8em 0;
*/
}
div.floatleft p { font-style: italic; }
/* thumbnails */
div.thumb {
	margin-bottom: .5em;
	border-style: solid;
	border-color: white;
	width: auto;
}
div.thumb div {
	border: 1px solid #ccc;
	padding: 3px !important;
	background-color: #f9f9f9;
	font-size: 94%;
	text-align: center;
	overflow: hidden;
}
div.thumb div a img {
	border: 1px solid #ccc;
}
div.thumb div div.thumbcaption {
	border: none;
	text-align: left;
	line-height: 1.4em;
	padding: .3em 0 .1em 0;
}
div.magnify {
	float: right;
	border: none !important;
	background: none !important;
}
div.magnify a, div.magnify img {
	display: block;
	border: none !important;
	background: none !important;
}
div.tright {
	clear: right;
	float: right;
	border-width: .5em 0 .8em 1.4em;
}
div.tleft {
	float: left;
	margin-right: .5em;
	border-width: .5em 1.4em .8em 0;
}

.hiddenStructure {
	display: none;
	speak: none;
}
img.tex {
	vertical-align: middle;
}
span.texhtml {
	font-family: serif;
}

/*
** classes for special content elements like town boxes
** intended to be referenced directly from the wiki src
*/

/*
** User styles
*/
/* table standards */
table.rimage {
	float: right;
	position: relative;
	margin-left: 1em;
	margin-bottom: 1em;
	text-align: center;
}
.toccolours {
	border: 1px solid #aaa;
	background-color: #f9f9f9;
	padding: 5px;
	font-size: 95%;
}
div.townBox {
	position: relative;
	float: right;
	background: white;
	margin-left: 1em;
	border: 1px solid gray;
	padding: .3em;
	width: 200px;
	overflow: hidden;
	clear: right;
}
div.townBox dl {
	padding: 0;
	margin: 0 0 .3em;
	font-size: 96%;
}
div.townBox dl dt {
	background: none;
	margin: .4em 0 0;
}
div.townBox dl dd {
	margin: .1em 0 0 1.1em;
	background-color: #f3f3f3;
}

/*
** edit views etc
*/
.special li {
	line-height: 1.4em;
	margin: 0;
	padding: 0;
}

/* Page history styling */
/* the auto-generated edit comments */
.autocomment {
	color: gray;
}
#pagehistory span.user {
	margin-left: 1.4em;
	margin-right: .4em;
}
#pagehistory span.minor {
	font-weight: bold;
}
#pagehistory li {
	border: 1px solid white;
}
#pagehistory li.selected {
	background-color: #f9f9f9;
	border: 1px dashed #aaa;
}

/*
** Diff rendering
*/
table.diff, td.diff-otitle, td.diff-ntitle {
	background-color: white;
}
td.diff-addedline {
	background: #cfc;
	font-size: smaller;
}
td.diff-deletedline {
	background: #ffa;
	font-size: smaller;
}
td.diff-context {
	background: #eee;
	font-size: smaller;
}
span.diffchange {
	color: red;
	font-weight: bold;
}

/*
** keep the whitespace in front of the ^=, hides rule from konqueror
** this is css3, the validator doesn't like it when validating as css2
*/
#bodyContent a.external,
#bodyContent a[href ^="gopher://"] {
	background: url(external.png) center right no-repeat;
	padding-right: 13px;
}
#bodyContent a[href ^="https://"],
.link-https {
	background: url(lock_icon.gif) center right no-repeat;
	padding-right: 16px;
}
#bodyContent a[href ^="mailto:"],
.link-mailto {
	background: url(mail_icon.gif) center right no-repeat;
	padding-right: 18px;
}
#bodyContent a[href ^="news://"] {
	background: url(news_icon.png) center right no-repeat;
	padding-right: 18px;
}
#bodyContent a[href ^="ftp://"],
.link-ftp {
	background: url(file_icon.gif) center right no-repeat;
	padding-right: 18px;
}
#bodyContent a[href ^="irc://"],
.link-irc {
	background: url(discussionitem_icon.gif) center right no-repeat;
	padding-right: 18px;
}
/* disable interwiki styling */
#bodyContent a.extiw,
#bodyContent a.extiw:active {
	color: #36b;
	background: none;
	padding: 0;
}
#bodyContent a.external {
	color: #36b;
}
/* this can be used in the content area to switch off
special external link styling */
#bodyContent .plainlinks a {
	background: none !important;
	padding: 0 !important;
}
/*
** Structural Elements
*/

/*
** general portlet styles (elements in the quickbar)
*/
.portlet {
	border: none;
	margin: 0 0 .5em;
	padding: 0;
	float: none;
	width: 11.6em;
	overflow: hidden;
}
.portlet h4 {
	font-size: 95%;
	font-weight: normal;
	white-space: nowrap;
}
.portlet h5 {
	background: transparent;
	padding: 0 1em 0 .5em;
	display: inline;
	height: 1em;
	text-transform: lowercase;
	font-size: 91%;
	font-weight: normal;
	white-space: nowrap;
}
.portlet h6 {
	background: #ffae2e;
	border: 1px solid #2f6fab;
	border-style: solid solid none solid;
	padding: 0 1em 0 1em;
	text-transform: lowercase;
	display: block;
	font-size: 1em;
	height: 1.2em;
	font-weight: normal;
	white-space: nowrap;
}
.pBody {
	font-size: 95%;
	background-color: white;
	color: black;
	border-collapse: collapse;
	border: 1px solid #aaa;
	padding: 0 .8em .3em .5em;
}
.portlet h1,
.portlet h2,
.portlet h3,
.portlet h4 {
	margin: 0;
	padding: 0;
}
.portlet ul {
	line-height: 1.5em;
	list-style-type: square;
	list-style-image: url(bullet.gif);
	font-size: 95%;
}
.portlet li {
	padding: 0;
	margin: 0;
}

/*
** Logo properties
*/

#p-logo {
	z-index: 3;
	position: absolute; /*needed to use z-index */
	top: 0;
	left: 0;
	height: 155px;
	width: 12em;
	overflow: visible;
}
#p-logo h5 {
	display: none;
}
#p-logo a,
#p-logo a:hover {
	display: block;
	height: 155px;
	width: 12.2em;
	background-repeat: no-repeat;
	background-position: 35% 50% !important;
	text-decoration: none;
}

/*
** the navigation portlet
*/

#p-navigation {
	position: relative;
	z-index: 3;
}

#p-navigation .pBody {
	padding-right: 0;
}

#p-navigation a {
	display: block;
}

#p-navigation li.active a, #p-navigation li.active a:hover {
	text-decoration: none;
	display: inline;
	font-weight: bold;
}


/*
** Search portlet
*/
#p-search {
	position: relative;
	z-index: 3;
}
input.searchButton {
	margin-top: 1px;
	font-size: 95%;
}
#searchGoButton {
	padding-left: .5em;
	padding-right: .5em;
	font-weight: bold;
}
#searchInput {
	width: 10.9em;
	margin: 0;
	font-size: 95%;
}
#p-search .pBody {
	padding: .5em .4em .4em .4em;
	text-align: center;
}

/*
** the personal toolbar
*/

#p-personal {
	width: 100%;
	white-space: nowrap;
	padding: 0;
	margin: 0;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 0;
	border: none;
	background: none;
	overflow: visible;
	line-height: 1.2em;
}

#p-personal h5 {
	display: none;
}
#p-personal .portlet,
#p-personal .pBody {
	padding: 0;
	margin: 0;
	border: none;
	z-index: 0;
	overflow: visible;
	background: none;
}
/* this is the ul contained in the portlet */
#p-personal ul {
	border: none;
	line-height: 1.4em;
	color: #2f6fab;
	padding: 0 2em 0 3em;
	margin: 0;
	text-align: right;
	text-transform: lowercase;
	list-style: none;
	z-index: 0;
	background: none;
	cursor: default;
}
#p-personal li {
	z-index: 0;
	border: none;
	padding: 0;
	display: inline;
	color: #2f6fab;
	margin-left: 1em;
	line-height: 1.2em;
	background: none;
}
#p-personal li.active {
	font-weight: bold;
}
#p-personal li a {
	text-decoration: none;
	color: #005896;
	padding-bottom: .2em;
	background: none;
}
#p-personal li a:hover {
	background-color: white;
	padding-bottom: .2em;
	text-decoration: none;
}
#p-personal li.active a:hover {
	background-color: transparent;
}
/* the icon in front of the user name, single quotes
in bg url to hide it from iemac */
li#pt-userpage,
li#pt-anonuserpage,
li#pt-login {
	background: url(user.gif) top left no-repeat;
	padding-left: 20px;
	text-transform: none;
}

/*
** the page-related actions- page/talk, edit etc
*/
#p-cactions {
	position: absolute;
	top: 1.3em;
	left: 11.5em;
	margin: 0;
	white-space: nowrap;
	width: 76%;
	line-height: 1.1em;
	overflow: visible;
	background: none;
	border-collapse: collapse;
	padding-left: 1em;
	list-style: none;
	font-size: 95%;
}
#p-cactions .hiddenStructure {
	display: none;
}
#p-cactions ul {
	list-style: none;
}
#p-cactions li {
	display: inline;
	border: 1px solid #aaa;
	border-bottom: none;
	padding: 0 0 .1em 0;
	margin: 0 .3em 0 0;
	overflow: visible;
	background: white;
}
#p-cactions li.selected {
	border-color: #fabd23;
	padding: 0 0 .2em 0;
	font-weight: bold;
}
#p-cactions li a {
	background-color: #fbfbfb;
	color: #002bb8;
	border: none;
	padding: 0 .8em .3em;
	text-decoration: none;
	text-transform: lowercase;
	position: relative;
	z-index: 0;
	margin: 0;
}
#p-cactions li.selected a {
	z-index: 3;
		background-color: #fff;
	padding: 0 1em .2em!important;
}
#p-cactions .new a {
	color: #ba0000;
}
#p-cactions li a:hover {
	z-index: 3;
	text-decoration: none;
		background-color: #fff;
}
#p-cactions h5 {
	display: none;
}
#p-cactions li.istalk {
	margin-right: 0;
}
#p-cactions li.istalk a {
	padding-right: .5em;
}
#p-cactions #ca-addsection a {
	padding-left: .4em;
	padding-right: .4em;
}
/* offsets to distinguish the tab groups */
li#ca-talk {
	margin-right: 1.6em;
}
li#ca-watch, li#ca-unwatch, li#ca-varlang-0, li#ca-print {
	margin-left: 1.6em;
}

/*
** the remaining portlets
*/
#p-tbx,
#p-lang {
	position: relative;
	z-index: 3;
}

/* TODO: #t-iscite is only used by the Cite extension, come up with some
 * system which allows extensions to add to this file on the fly
 */
#t-ispermalink, #t-iscite {
	color: #999;
}
/*
** footer
*/
#footer {
	background-color: white;
	border-top: 1px solid #fabd23;
	border-bottom: 1px solid #fabd23;
	margin: .6em 0 1em 0;
	padding: .4em 0 1.2em 0;
	text-align: center;
	font-size: 90%;
}
#footer li {
	display: inline;
	margin: 0 1.3em;
}
/* hide from incapable browsers */
head:first-child+body #footer li { white-space: nowrap; }
#f-poweredbyico, #f-copyrightico {
	margin: 0 8px;
	position: relative;
	top: -2px; /* Bump it up just a tad */
}
#f-poweredbyico {
	float: right;
	height: 1%;
}
#f-copyrightico {
	float: left;
	height: 1%;
}

/* js pref toc */
#preftoc {
	margin: 0;
	padding: 0;
	width: 100%;
	clear: both;
}
#preftoc li {
	margin: 1px -2px 1px 2px;
	float: left;
	padding: 2px 0 3px 0;
	background-color: #f0f0f0;
	color: #000;
	border: 1px solid #fff;
	border-right-color: #716f64;
	border-bottom: 0;
	position: relative;
	white-space: nowrap;
	list-style-type: none;
	list-style-image: none;
	z-index: 3;
}
#preftoc li.selected {
	font-weight: bold;
	background-color: #f9f9f9;
	border: 1px solid #aaa;
	border-bottom: none;
	cursor: default;
	top: 1px;
	padding-top: 2px;
	margin-right: -3px;
}
#preftoc > li.selected {
	top: 2px;
}
#preftoc a,
#preftoc a:active {
	display: block;
	color: #000;
	padding: 0 .7em;
	position: relative;
	text-decoration: none;
}
#preftoc li.selected a {
	cursor: default;
	text-decoration: none;
}
#prefcontrol {
	padding-top: 2em;
	clear: both;
}
#preferences {
	margin: 0;
	border: 1px solid #aaa;
	clear: both;
	padding: 1.5em;
	background-color: #F9F9F9;
}
.prefsection {
	border: none;
	padding: 0;
	margin: 0;
}
.prefsection fieldset {
	border: 1px solid #aaa;
	float: left;
	margin-right: 2em;
}
.prefsection legend {
	font-weight: bold;   
}
.prefsection table, .prefsection legend {
	background-color: #F9F9F9;
}
.mainLegend {
	display: none;
}
div.prefsectiontip {
	font-size: 95%;
	margin-top: 0;
	background-color: #FFC1C1;
	padding: .2em .7em;
	clear: both;
}
.btnSavePrefs {
	font-weight: bold;
	padding-left: .3em;
	padding-right: .3em;
}

.preferences-login {
	clear: both;
	margin-bottom: 1.5em;
}

.prefcache {
	font-size: 90%;
	margin-top: 2em;
}

div#userloginForm form,
div#userlogin form#userlogin2 {
	margin: 0 3em 1em 0;
	border: 1px solid #aaa;
	clear: both;
	padding: 1.5em 2em;
	background-color: #f9f9f9;
	float: left;
}

div#userloginForm table,
div#userlogin form#userlogin2 table {
	background-color: #f9f9f9;
}

div#userloginForm h2,
div#userlogin form#userlogin2 h2 {
	padding-top: 0;
}

div#userlogin .captcha {
	border: 1px solid #bbb;
	padding: 1.5em 2em;
	width: 400px;
	background-color: white;
}


#userloginprompt, #languagelinks {
	font-size: 85%;
}

#login-sectiontip {
	font-size: 85%;
	line-height: 1.2;
	padding-top: 2em;
}

#userlogin .loginText, #userlogin .loginPassword {
	width: 12em;
}

#userloginlink a, #wpLoginattempt, #wpCreateaccount {
	font-weight: bold;
}

/*
** IE/Mac fixes, hope to find a validating way to move this
** to a separate stylesheet. This would work but doesn't validate:
** @import("IEMacFixes.css");
*/
/* tabs: border on the a, not the div */
* > html #p-cactions li { border: none; }
* > html #p-cactions li a {
	border: 1px solid #aaa;
	border-bottom: none;
}
* > html #p-cactions li.selected a { border-color: #fabd23; }
/* footer icons need a fixed width */
* > html #f-poweredbyico,
* > html #f-copyrightico { width: 88px; }
* > html #bodyContent,
* > html #bodyContent pre {
	overflow-x: auto;
	width: 100%;
	padding-bottom: 25px;
}

/* more IE fixes */
/* float/negative margin brokenness */
* html #footer {margin-top: 0;}
* html #column-content {
	display: inline;
	margin-bottom: 0;
}
* html div.editsection { font-size: smaller; }
#pagehistory li.selected { position: relative; }

/* Mac IE 5.0 fix; floated content turns invisible */
* > html #column-content {
	float: none;
}
* > html #column-one {
	position: absolute;
	left: 0;
	top: 0;
}
* > html #footer {
	margin-left: 13.2em;
}
.redirectText {
	font-size: 150%;
	margin: 5px;
}

.printfooter {
	display: none;
}

.not-patrolled {
	background-color: #ffa;
}
div.patrollink {
	font-size: 75%;
	text-align: right;
}
span.newpage, span.minor, span.searchmatch, span.bot {
	font-weight: bold;
}
span.unpatrolled {
	font-weight: bold;
	color: red;
}

span.searchmatch {
	color: red;
}
.sharedUploadNotice {
	font-style: italic;
}

span.updatedmarker {
	color: black;
	background-color: #0f0;
}
span.newpageletter {
	font-weight: bold;
	color: black;
	background-color: yellow;
}
span.minoreditletter {
	color: black;
	background-color: #c5ffe6;
}

table.gallery {
	border: 1px solid #ccc;
	margin: 2px;
	padding: 2px;
	background-color: white;
}

table.gallery tr {
	vertical-align: top;
}

table.gallery td {
	vertical-align: top;
	background-color: #f9f9f9;
	border: solid 2px white;
}

table.gallery td.galleryheader {
	text-align: center;
	font-weight: bold;
}

div.gallerybox {
	margin: 2px;
	width:  150px;
}

div.gallerybox div.thumb {
	text-align: center;
	border: 1px solid #ccc;
	margin: 2px;
}

div.gallerytext {
	font-size: 94%;
	padding: 2px 4px;
}

span.comment {
	font-style: italic;
}

span.changedby {
	font-size: 95%;
}

.previewnote {
	text-indent: 3em;
	color: #c00;
	border-bottom: 1px solid #aaa;
	padding-bottom: 1em;
	margin-bottom: 1em;
}

.previewnote p {
	margin: 0;
	padding: 0;
}

.editExternally {
	border: 1px solid gray;
	background-color: #ffffff;
	padding: 3px;
	margin-top: 0.5em;
	float: left;
	font-size: small;
	text-align: center;
}
.editExternallyHelp {
	font-style: italic;
	color: gray;
}

li span.deleted, span.history-deleted {
	text-decoration: line-through;
	color: #888;
	font-style: italic;
}

.toggle {
	margin-left: 2em;
	text-indent: -2em;
}

/* Classes for EXIF data display */
table.mw_metadata {
	font-size: 0.8em;
	margin-left: 0.5em;
	margin-bottom: 0.5em;
	width: 300px;
}

table.mw_metadata caption {
	font-weight: bold;
}

table.mw_metadata th {
	font-weight: normal;
}

table.mw_metadata td {
	padding: 0.1em;
}

table.mw_metadata {
	border: none;
	border-collapse: collapse;
}

table.mw_metadata td, table.mw_metadata th {
	text-align: center;
	border: 1px solid #aaaaaa;
	padding-left: 0.1em;
	padding-right: 0.1em;
}

table.mw_metadata th {
	background-color: #f9f9f9;
}

table.mw_metadata td {
	background-color: #fcfcfc;
}

table.collapsed tr.collapsable {
	display: none;
}


/* filetoc */
ul#filetoc {
	text-align: center;
	border: 1px solid #aaaaaa;
	background-color: #f9f9f9;
	padding: 5px;
	font-size: 95%;
	margin-bottom: 0.5em;
	margin-left: 0;
	margin-right: 0;
}

#filetoc li {
	display: inline;
	list-style-type: none;
	padding-right: 2em;
}

/* @bug 1714 */
input#wpSave, input#wpDiff {
	margin-right: 0.33em;
}

#editform .editOptions {
	display: inline;
}

#wpSave {
	font-weight: bold;
}

/* Classes for article validation */

table.revisionform_default {
	border: 1px solid #000000;
}

table.revisionform_focus {
	border: 1px solid #000000;
	background-color:#00BBFF;
}

tr.revision_tr_default {
	background-color:#EEEEEE;
}

tr.revision_tr_first {
	background-color:#DDDDDD;
}

p.revision_saved {
	color: green;
	font-weight:bold;
}

#mw_trackbacks {
	border: solid 1px #bbbbff;
	background-color: #eeeeff;
	padding: 0.2em;
}


/* Allmessages table */

#allmessagestable th {
	background-color: #b2b2ff;
}

#allmessagestable tr.orig {
	background-color: #ffe2e2;
}

#allmessagestable tr.new {
	background-color: #e2ffe2;
}

#allmessagestable tr.def {
	background-color: #f0f0ff;
}


/* noarticletext */
div.noarticletext {
	border: 1px solid #ccc;
	background: #fff;
	padding: .2em 1em;
	color: #000;
}

div#searchTargetContainer {
	left:       10px;
	top:        10px;
	width:      90%;
	background: white;
}

div#searchTarget {
	padding:    3px;
	margin:     5px;
	background: #F0F0F0;
	border:     solid 1px blue;
}

div#searchTarget ul li {
	list-style: none;
}

div#searchTarget ul li:before {
	color: orange;
	content: "\00BB \0020";
}

div.multipageimagenavbox {
   border: solid 1px silver;
   padding: 4px;
   margin: 1em;
   -moz-border-radius: 6px;
   background: #f0f0f0;
}

div.multipageimagenavbox div.thumb {
   border: none;
   margin-left: 2em;
   margin-right: 2em;
}

div.multipageimagenavbox hr {
   margin: 6px;
}

table.multipageimage td {
   text-align: center;
}

/*
  Table pager (e.g. Special:Imagelist)
  - remove underlines from the navigation link
  - collapse borders
  - set the borders to outsets (similar to Special:Allmessages)
  - remove line wrapping for all td and th, set background color
  - restore line wrapping for the last two table cells (description and size)
*/
.TablePager_nav a { text-decoration: none; }
.TablePager { border-collapse: collapse; }
.TablePager, .TablePager td, .TablePager th { border: 2px outset #666666; }
.TablePager td, .TablePager th { background-color: #eeeeff }

.imagelist td, .imagelist th { white-space: nowrap }
.imagelist td + td { background-color: #ffffff }
.imagelist td + td + td + td + td { white-space: normal }
.imagelist th.TablePager_sort { background-color: #ccccff }
/*}}}*/