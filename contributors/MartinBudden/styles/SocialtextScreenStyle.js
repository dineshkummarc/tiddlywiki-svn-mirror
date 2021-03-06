/***
SocialtextScreenStyle
http://www.eu.socialtext.net/static/2.0.0.1/css/st/screen.css
***/

/*{{{*/
body {
	font-family: Arial, sans-serif;
	color: #000;
	background: #eee;
	margin: 0;
}

/* Wiki Navigation */

.st-wiki-nav {
	clear: both;
	margin-left: 10px;
	margin-right: 10px;
}
.st-wiki-nav-content {
	background: url('../../images/st/wiki-nav/solid.gif') repeat-x left bottom;
	margin-left: 24px;
	margin-right: 24px;
	padding-top: 3px;
	min-height: 24px;
}
* html .st-wiki-nav-content {
	padding-bottom: 3px;
	height: 24px;
}

.st-wiki-nav-right {
	background: url('../../images/st/wiki-nav/right-round.gif') no-repeat bottom right;
}

.st-wiki-nav-left {
	background: url('../../images/st/wiki-nav/left-round.gif') no-repeat bottom left;
}

#st-home {
	float: left;
	margin-right: 60px;
	padding-top: 2px;
}

#st-home-link {
	color: white;
	text-decoration: none;
	font-weight: bold;
	font-family: Helvetica, sans-serif;
	font-size: 90%;
}

#st-editing-prefix-container {
	border-collapse: collapse;
	width: 100%;
	padding: 0px;
	margin: 0px;
	margin-bottom: -20px;
}

#st-editing-prefix-container tr td {
	margin: 0px;
	padding: 0px;
}

#st-editing-title {
	color: black;
	background-color: white;
	text-decoration: none;
	font-weight: bold;
	font-family: Helvetica, sans-serif;
	font-size: 90%;
	margin-bottom: 0.4em;
}

#st-wiki-title-invite {
	font-size: 50%;
	font-family: Helvetica, sans-serif;
}

#st-wiki-title-central-page-link {
	font-size: 50%;
	font-family: Helvetica, sans-serif;
}

#st-wiki-title-invite a {
	color: #00f;
}

#st-wiki-logo {
	text-align: center;
	clear: both;
}

#st-wiki-logo-image {
}

.st-wiki-nav-actions {
	float: right;
	color: black;
	font-size: 75%;
	padding-top: 3px;
}

.st-wiki-nav-actions a {
	padding: 2px;
	color: white;
	text-decoration: none;
	font-family: Helvetica, sans-serif;
}

/* Wiki Subnav */

#st-wiki-subnav {
	margin-top: 2px;
	font-size: 70%;
	font-weight: bold;
	font-family: Helvetica, sans-serif;
	color: #888;
}

#st-wiki-subnav a {
	padding: 2px;
	color: #008;
	text-decoration: none;
}

#st-wiki-subnav-right {
	float: right;
	margin-right: 6em;
}

#st-wiki-subnav-left {
	float: left;
	margin-left: 6em;
}
* html #st-wiki-subnav-left {
	margin-left: 3em;
}

/* Wiki Navigation Search Bar */

#st-search-form {
	margin: 0;
	padding: 0;
	padding-top: 1px;
}

#st-search-form .button-table {
	float: left;
	font-size: 79%;
	font-weight: bold;
	margin-left: 5px;
	margin-top: 1px;
}

#st-search-form #st-search-term {
	float: left;
	font-size: 60%;
}

/* Content Outline */

#st-content-border, #st-edit-border {
	position: relative;
	clear: both;
	margin-left: 3px;
	margin-right: 2px;
	margin-bottom: 0px;
	margin-top: 0px;
	border-bottom: 1px solid #eee;
}

#st-content-border-left, #st-edit-border-left {
	background: url('../../images/st/page-shadow/left.gif') left top repeat-y;
	position: relative;
}

#st-content-border-right, #st-edit-border-right {
	background: url('../../images/st/page-shadow/right.gif') right top repeat-y;
	position: relative;
}

#st-content-border-top, #st-edit-border-top {
	position: relative;
	background: url('../../images/st/page-shadow/top.gif') left top repeat-x;
}

#st-content-border-bottom, #st-edit-border-bottom {
	background: url('../../images/st/page-shadow/bottom.gif') left bottom repeat-x;
	position: relative;
}

#st-content-border-left-top, #st-edit-border-left-top {
	background: url('../../images/st/page-shadow/left-top.gif') left top no-repeat;
	position: relative;
}
#st-content-border-right-top, #st-edit-border-right-top {
	background: url('../../images/st/page-shadow/right-top.gif') right top no-repeat;
	position: relative;
}

#st-content-border-left-bottom, #st-edit-border-left-bottom {
	background: url('../../images/st/page-shadow/left-bottom.gif') left bottom no-repeat;
	position: relative;
}

#st-content-border-right-bottom, #st-edit-border-right-bottom {
	background: url('../../images/st/page-shadow/right-bottom.gif') right bottom no-repeat;
	padding-top: 5px;
	padding-bottom: 9px;
	position: relative;
}

* html #st-content-border-right-bottom, * html #st-edit-border-right-bottom {
	padding-top: 4px;
	padding-left: 7px;
	padding-right: 8px;
	position: relative;
}

.st-content-width-controller {
	width: 100%;
	position: relative;
	border-collapse: collapse;
}
.st-content-width-controller td {
	vertical-align: top;
}
.st-content {
	position: relative;
	background-color: white;
	margin-top: 0px;
	margin-left: 7px;
	margin-right: 8px;
	margin-bottom: -1px;
	border-left: 1px dotted #80a9f3;
	border-right: 1px dotted #80a9f3;
	border: 1px solid #80a9f3;
	padding: 6px 12px 12px 12px;
}
* html .st-content {
	margin-top: 0px;
	margin-left: 0px;
	margin-right: 0px;
}

/* This textarea is only for Safari. However, if we use display:none; here Safari ignores the .value operation in JS */
#st-raw-wikitext-textarea {
	width:1px;
	height:1px;
	margin:0;
	padding:0;
}

/* Action Buttons */
.button-table, .button-table tr td {
	border-collapse: collapse;
	margin: 0;
	padding: 0;
}
.button-rounded {
	background: url('../../images/st/grey-button/left-top-rounded.png') top left no-repeat;
	margin: 0;
}
.button-rounded-right-top {
	background: url('../../images/st/grey-button/right-top-rounded.png') top right no-repeat;
	margin: 0;
}
.button-rounded-left-bottom {
	background: url('../../images/st/grey-button/left-bottom-rounded.png') bottom left no-repeat;
	margin: 0;
}
.button-rounded-right-bottom {
	background: url('../../images/st/grey-button/right-bottom-rounded.png') bottom right no-repeat;
	margin: 0;
}
.button-straight {
	background: url('../../images/st/grey-button/left-top-straight.png') top left no-repeat;
	margin: 0;
}
.button-straight-right-top {
	background: url('../../images/st/grey-button/right-top-straight.png') top right no-repeat;
	margin: 0;
}
.button-straight-left-bottom {
	background: url('../../images/st/grey-button/left-bottom-straight.png') bottom left no-repeat;
	margin: 0;
}
.button-straight-right-bottom {
	background: url('../../images/st/grey-button/right-bottom-straight.png') bottom right no-repeat;
	margin: 0;
}
.button-content {
	font-size: 90%;
}
.button-content a {
	display: block;
	padding: 2px;
	padding-left: 10px;
	padding-right: 10px;
	font-family: Helvetica, Verdana, sans-serif;
	font-weight: bold;
	text-decoration: none;
	color: black;
}

.button-content input.submit {
	border: 0px;
	padding: 2px;
	padding-left: 10px;
	padding-right: 10px;
	font-family: Helvetica, Verdana, sans-serif;
	font-weight: bold;
	text-decoration: none;
	color: black;
	background-color: transparent;
}

/* Personal Homepage */

#st-homepage {
	background: white url('../../images/st/homepage/blue-fade.gif') top left no-repeat;
}

#st-homepage-layout {
	margin-top: 15px;
	clear: both;
	width: 100%;
	border-collapse: collapse;
}

#st-homepage-layout tr td.st-homepage-layout-cell {
	padding: 5px;
	vertical-align: top;
}

#st-homepage-layout-dashboard {
	width: 50%
}

#st-homepage-layout-notes {
	width: 50%;
}

#st-homepage-notes, #st-homepage-dashboard {
	text-align: left;
	width: 95%;
}

#st-user-greeting, #st-wiki-title {
	font-family: Helvetica, Verdana, sans-serif;
	font-size: 150%;
}
#st-wiki-title {
	margin-left: 5px;
}

#st-user-greeting {
	position: relative;
	text-align: right;
	float: right;
}

#st-group-notes-content, #st-personal-notes-content {
}

.st-homepage-section {
	margin-bottom: 15px;
}

#st-homepage-notes .st-homepage-section {
	background-color: white;
	border: 1px solid #aaa;
	padding: 15px;
}

.st-homepage-section-title {
	font-size: 110%;
	font-family: Helvetica, Verdana, sans-serif;
}

#st-homepage-notes .st-homepage-section-title {
	color: #aaa;
	text-decoration: underline;
}

.st-homepage-notes-edit-link {
	background: url('../../images/st/homepage/edit-icon.gif') no-repeat left top;
	display: block;
	text-indent: -2000px;
	height: 13px;
	width: 36px;
	text-decoration: none;
	padding:0;
}
* html .st-homepage-notes-edit-link {
	border:1px solid white;
}

.st-homepage-notes-edit {
	font-family: Verdana, sans-serif;
	font-size: 65%;
	float: right;
}

.st-homepage-notes-content {
	font-size: 85%;
	margin-top: 10px;
	padding-top: 0px;
	padding-bottom: 0px;
	font-family: Verdana, Helvetica, sans-serif;
}

#st-dyk {
	border-color: #cca !important;
	background-color: #ffe !important;
}

#st-dyk-title {
	color: #e4a020 !important;
	text-decoration: none !important;
}


/* Homepage Simple List */

#st-whats-new-title-link {
	background: url('../../images/st/homepage/icon-28-pages.gif') no-repeat left top;
}
#st-watchlist-title-link {
	background: url('../../images/st/homepage/icon-28-star.gif') no-repeat left top;
}
#st-wikis-title-link {
	background: url('../../images/st/homepage/icon-28-group.gif') no-repeat left top;
}
.st-homepage-simplelist-title-link {
	display: block;
	padding-left: 32px;
	min-height: 32px;
}
* html .st-homepage-simplelist-title-link {
	height: 32px;
}

.st-homepage-simplelist-title {
}

.st-homepage-simplelist-table {
	margin-left: 25px;
	border: 1px dashed #ddd;
	border-collapse: collapse;
	font-family: Verdana, Helvetica, sans-serif;
	font-size: 80%;
	width: 95%;
}

.st-homepage-simplelist-table td {
	padding: 2px;
}

.st-homepage-simplelist-table tr.st-homepage-simplelist-row-odd {
	background-color: #f3f7f7;
}

.st-homepage-simplelist-table tr.st-homepage-simplelist-row-even {
	background-color: white;
}

.st-homepage-simplelist-table a {
	color: #4f55dd;
	text-decoration: none;
}

.st-homepage-simplelist-table a:visited {
	color: #551a8b;
}

.st-homepage-simplelist-subleft {
	font-size: 80%;
	margin-left: 1em;
	color: #666;
}

.st-homepage-simplelist-right {
	width: 20%;
}

.st-homepage-simplelist-subright {
	font-size: 80%;
	color: #666;
}

.st-homepage-simplelist {
}

.st-homepage-simplelist-header {
	min-height: 35px;
}

.st-homepage-simplelist-header .button-table {
	float: right;
	margin-right: 15px;
	font-size: 95%;
}

.st-homepage-simplelist-header .button-table .button-content {
	padding: 1px;
}

.st-homepage-whatsnew-author, .st-homepage-whatsnew-date {
	color: #555;
}
.st-homepage-whatsnew-attribution {
	padding-left: 1em;
	font-size: 80%;
	color: #aaa;
}

/* Homepage Wikis List */

#st-wikis-title {
}

/* Data and Templates */

.st-jst-template, .st-json {
	display: none;
}

/* Page Sidebox Common Styles */

#st-page-boxes-toggle {
	position: relative;
	float: right;
	text-align: right;
	font-family: Verdana, Arial, sans-serif;
	font-weight: bold;
	font-size: 80%;
	margin-bottom: 0.7em;
}

#st-page-boxes-toggle-link {
	text-decoration: none;
}

#st-page-boxes-underlay {
	float: right;
	margin-top: -10px;
	margin-right: 10px;
	background: white;
	z-index: 198;
	clear: both;
	margin-left: 15px;
}
* html #st-page-boxes-underlay {
	margin-right: 4px;
}
#st-page-boxes {
	background: inherit;
	position: absolute;
	right: 23px;
	z-index: 199;
	margin-top: 15px;
	margin-left: 20px;
}
#st-page-boxes, #st-page-boxes-underlay {
	width: 225px;
	/* padding-left: 15px; */ /* Gives the white border effect, cwest dislikes it. */
}

.st-page-box {
	border: 1px solid black;
	padding: 5px;
	font-family: Verdana, Helvetica, sans-serif;
	font-size: 80%;
	margin-top: 15px;
}

.st-page-box-title {
	font-family: Helvetica, Verdana, sans-serif;
	font-weight: bold;
	margin-bottom: 10px;
}

.st-page-box-listing {
	margin: 0;
	padding: 0;
}

.st-page-box-listing-entry {
	display: block;
}

.st-page-boxes-nobacklinks {
	font-family: Verdana, Helvetica, sans-serif;
	font-size: 90%;
	color: #888;
}

.st-page-box-first {
	margin-top: 0px;
}

/* Page Display */

#st-page-content {
	clear: left;
	margin-top: 6px;
	margin-bottom: 0;
	padding-bottom: 0;
}

#st-page-content, #st-page-content td {
	font-family: Verdana, Helvetica, sans-serif;
	font-size: 90%;
}

#st-page-wiki-title {
	font-family: Helvetica, Verdana, sans-serif;
	font-size: 65%;
	font-weight: bold;
	color: #aaa;
	margin-bottom: 0.2em;
	margin-top: 0.1em;
	padding-top: 0;
}

#wiki {
	margin: 0;
	padding: 0;
}

#st-page-title {
}

#st-page-titletext, .st-page-title {
	font-family: Helvetica, Verdana, sans-serif;
	font-size: 150%;
	font-weight: bold;
	color: #888;
	border-bottom: 1px solid #888;
}

#st-newpage-pagename-edit {
	font-family: inherit;
	font-size: inherit;
	font-weight: inherit;
	color: #000;
	border: 1px solid black;
	padding-left: 0.3em;
	background-color: #ffd;
}

#st-page-details {
	font-style: italic;
	font-size: 75%;
	font-family: Georgia, serif;
	margin: 6px 10px 0 10px;
}

#st-page-details-feed-icon {
	vertical-align: middle;
	border: none;
}

#st-page-stats {
	float: right;
	vertical-align: middle;
}

#st-attribution {
	float: left;
	margin-bottom: 10px;
}

#st-page-editing-wysiwyg {
	background: #ffd;
	border-style: solid;
	border-color: #888 #ccc #ccc #888;
	border-width: 2px;
	width: 100%;
}

#st-page-editing-toolbar {
	margin-left: -6px;
	overflow: hidden;
	float: left;
	height: 25px;
}

#wikiwyg_wikitext_textarea {
	margin-top: 4px;
	background: #ffd;
	border-style: solid;
	border-color: #888 #ccc #ccc #888;
	border-width: 2px;
	width: 100%;
	font-family: monospace;
}

#st-page-maincontent {
}

#st-page-editing, #wikiwyg_wikitext_textarea {
}

#st-page-editing-pagebody-decoy, #st-page-editing-wysiwyg {
	display: none;
}

#st-editing-tools-edit {
	display: none;
}

#st-mode-wysiwyg-button
{
	font-size: 70%;
	margin-left: 4em;
}

#st-mode-wikitext-button
{
	font-size: 70%;
}

#st-edit-tips
{
	font-size: 70%;
}

.wikiwyg_button {
	background: #FFFFFF;
	border: 1px solid #FFFFFF;
	cursor: pointer;
	width: 20px;
	height: 20px;
	vertical-align: bottom;
}

.wikiwyg_button:hover {
	border: 1px outset;
}

.wikiwyg_button:active {
	border: 1px inset;
}

#wikiwyg_toolbar {
	display: none;
}

/* Sidebox Pagetools: Revisions, Watchlist */
#st-side-box-pagetools {
	border-collapse: collapse;
}

#st-rewind-norevisions {
	font-family: Helvetica, Arial, sans-serif;
	font-size: 11px;
	color: #777;
	text-decoration: none;
}

#st-side-box-pagetools a {
	font-family: Helvetica, Arial, sans-serif;
	font-size: 11px;
	color: #555;
	text-decoration: none;
}

/* Page View Tags/Incoming Links Sidebox */

#st-tags {
	background: #f4fff4;
	border-color: #bbeebb;
	color: #999;
}

#st-tags-title {
	color: #595;
}

#st-tags-addlink, #st-tags-addbutton {
	font-weight: bold;
}

#st-tags-listing {
	margin-bottom: 5px;
}

#st-tags-addinput, #st-tags-message, #st-tags-suggestion {
	display: none;
}

#st-tags-deletemessage {
	font-size: 90%;
	color: #555;
	display: none;
	margin-top: 0.5em;
	margin-bottom: 0.5em;
}

#st-tags-suggestion {
	margin-top: 2px;
}

.st-tags-level1 {
	font-size: 90%;
}

.st-tags-level2 {
	font-size: 100%;
}

.st-tags-level3 {
	font-size: 110%;
}

.st-tags-level4 {
	font-size: 120%;
}

.st-tags-level5 {
	font-size: 130%;
}

.st-tags-tagline .st-tags-tagdelete {
	text-decoration: none;
	color: #ccc;
}

.st-tags-tagline a {
	text-decoration: none;
	color: #444;
}

#st-tags-field {
	width: 95%;
}

#st-incoming-links {
	border-color: #ebb;
	background-color: #fff4f4;
}

#st-incoming-links-title {
	color: #b78;
}

#st-attachments {
	border-color: #bbe;
	background-color: #f4f4ff;
}

#st-attachments-uploadbutton, #st-attachments-managebutton {

}
#st-attachments-buttons-uploadbutton {
	margin: 0px;
	padding: 0px;
	padding-left: 2px;
}
#st-attachments-buttons-managebutton {
	margin: 0px;
	padding: 0px;
	padding-right: 2px;
}

#st-attachments-buttons td {
	padding-right: 3px;
	font-size: 99%;
}

#st-attachments-buttons {
	border-collapse: collapse;
	margin: 0px;
	padding: 0px;
	margin-top: 5px;
}

#st-attachments-title {
	color: #77b;
}

.st-attachments-line {
	width:100%;
	overflow:hidden;
}

/* Actions Bar */

#st-actions-bar-spacer {
	clear:both;
	height:0.5em;
	overflow:hidden;
}

#st-actions-bar-spacer-clear {
	clear:both;
	height:1px;
	overflow:hidden;
}


#st-actions-bar, #st-editing-tools-bar {
	margin-left: 30px !important;
	margin-right: 30px !important;
}

/* Footer */
#st-footer {
	margin-top: -8px;
	margin-bottom: 5px;
	clear: both;
}

/* Socialtext Attribution */

#st-socialtext-attribution {
	clear: both;
	text-align: center;
	font-size: 80%;
	font-family: Helvetica, sans-serif;
}

#st-socialtext-attribution-link {
	text-decoration: none;
}

#st-socialtext-attribution-image {
	border: 0;
}


/* Page Actions */

#st-edit-button-border-left-middle, #st-login-to-edit-button-border-left-middle {
	background: url('../../images/st/button-blue/left-middle.gif') left top repeat-y;
}
#st-edit-button-border-right-middle, #st-login-to-edit-button-border-right-middle {
	background: url('../../images/st/button-blue/right-middle.gif') right top repeat-y;
}

#st-edit-button-border-left-top, #st-login-to-edit-button-border-left-top {
	background: url('../../images/st/button-blue/left-top.gif') left top no-repeat;
}
#st-edit-button-border-right-top, #st-login-to-edit-button-border-right-top {
	background: url('../../images/st/button-blue/right-top.gif') right top no-repeat;
}

#st-edit-button-border-left-bottom, #st-login-to-edit-button-border-left-bottom {
	background: url('../../images/st/button-blue/left-bottom.gif') left bottom no-repeat;
}

#st-edit-button-border-right-bottom, #st-login-to-edit-button-border-right-bottom {
	background: url('../../images/st/button-blue/right-bottom.gif') right bottom no-repeat;
}

#st-edit-button-link, #st-login-to-edit-button-link {
}

#st-comment-button-border-left-middle {
	background: url('../../images/st/button-purple/left-middle.gif') left top repeat-y;
}

#st-comment-button-border-right-middle {
	background: url('../../images/st/button-purple/right-middle.gif') right top repeat-y;
}

#st-comment-button-border-left-top {
	background: url('../../images/st/button-purple/left-top.gif') left top no-repeat;
}

#st-comment-button-border-right-top {
	background: url('../../images/st/button-purple/right-top.gif') right top no-repeat;
}

#st-comment-button-border-left-bottom {
	background: url('../../images/st/button-purple/left-bottom.gif') left bottom no-repeat;
}

#st-comment-button-border-right-bottom {
	background: url('../../images/st/button-purple/right-bottom.gif') right bottom no-repeat;
}

#st-comment-button-link {
}

#st-save-button-border-left-middle {
	background: url('../../images/st/button-green/left-middle.gif') left top repeat-y;
}
#st-save-button-border-right-middle {
	background: url('../../images/st/button-green/right-middle.gif') right top repeat-y;
}

#st-save-button-border-left-top {
	background: url('../../images/st/button-green/left-top.gif') left top no-repeat;
}
#st-save-button-border-right-top {
	background: url('../../images/st/button-green/right-top.gif') right top no-repeat;
}

#st-save-button-border-left-bottom {
	background: url('../../images/st/button-green/left-bottom.gif') left bottom no-repeat;
}

#st-save-button-border-right-bottom {
	background: url('../../images/st/button-green/right-bottom.gif') right bottom no-repeat;
}

#st-save-button-link {
}

#st-preview-button-border-left-middle {
	background: url('../../images/st/button-gold/left-middle.gif') left top repeat-y;
}
#st-preview-button-border-right-middle {
	background: url('../../images/st/button-gold/right-middle.gif') right top repeat-y;
}

#st-preview-button-border-left-top {
	background: url('../../images/st/button-gold/left-top.gif') left top no-repeat;
}
#st-preview-button-border-right-top {
	background: url('../../images/st/button-gold/right-top.gif') right top no-repeat;
}

#st-preview-button-border-left-bottom {
	background: url('../../images/st/button-gold/left-bottom.gif') left bottom no-repeat;
}

#st-preview-button-border-right-bottom {
	background: url('../../images/st/button-gold/right-bottom.gif') right bottom no-repeat;
}

#st-preview-button-link {
}

#st-cancel-button-border-left-middle {
	background: url('../../images/st/button-crimson/left-middle.gif') left top repeat-y;
}
#st-cancel-button-border-right-middle {
	background: url('../../images/st/button-crimson/right-middle.gif') right top repeat-y;
}

#st-cancel-button-border-left-top {
	background: url('../../images/st/button-crimson/left-top.gif') left top no-repeat;
}
#st-cancel-button-border-right-top {
	background: url('../../images/st/button-crimson/right-top.gif') right top no-repeat;
}

#st-cancel-button-border-left-bottom {
	background: url('../../images/st/button-crimson/left-bottom.gif') left bottom no-repeat;
}

#st-cancel-button-border-right-bottom {
	background: url('../../images/st/button-crimson/right-bottom.gif') right bottom no-repeat;
}

#st-cancel-button-link {
}

#st-edit-more-button-border-left-middle {
	background: url('../../images/st/button-blue/left-middle.gif') left top repeat-y;
}
#st-edit-more-button-border-right-middle {
	background: url('../../images/st/button-blue/right-middle.gif') right top repeat-y;
}

#st-edit-more-button-border-left-top {
	background: url('../../images/st/button-blue/left-top.gif') left top no-repeat;
}
#st-edit-more-button-border-right-top {
	background: url('../../images/st/button-blue/right-top.gif') right top no-repeat;
}

#st-edit-more-button-border-left-bottom {
	background: url('../../images/st/button-blue/left-bottom.gif') left bottom no-repeat;
}

#st-edit-more-button-border-right-bottom {
	background: url('../../images/st/button-blue/right-bottom.gif') right bottom no-repeat;
}

#st-edit-more-button-link {
}

.st-page-action-button-link {
	min-height: 24px;
	min-width: 100px;
	text-align: center;
	font-family: Helvetica, Verdana, sans-serif;
	font-size: 90%;
	text-decoration: none;
	color: #fff;
	font-weight: bold;
	display: block;
	padding-top: 8px;
	padding-bottom: 0px;
	margin-bottom: -3px;
	width: 100%;
	margin-left: -2px;
}
* html .st-page-action-button-link {
	padding-top: 5px;
	padding-bottom: 0px;
	height: 24px;
}

.st-page-action-button {
	float: left;
	margin: 0;
	padding: 0;
	margin-right: 10px;
	min-height: 20px;
	border-collapse: collapse;
	width: 100px;
}

/* Attach File Interface */

#st-attachments-attachinterface {
	font-family: Helvetica, sans-serif;
	font-size: 90%;
	display: none;
	position: fixed;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	z-index: 2000;
	background-image: url('../../images/st/popup/bg.png');
}
#st-attachments-manageinterface {
	font-family: Helvetica, sans-serif;
	font-size: 90%;
	display: none;
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	z-index: 2000;
	background-image: url('../../images/st/popup/bg.png');
}

* html #st-attachments-attachinterface {
	background-image: none;
}
* html #st-attachments-manageinterface {
	background-image: none;
}
* html .popup-overlay {
	background-image: url('../../images/st/popup/bg.png');
	background-color: #000;
	opacity: .70;
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	z-index: 2001;
}

#st-attachments-attach-interface {
	z-index: 2002;
	background-color: #fff;
	color: #000;
	border: 4px solid #ccc;
	padding: 1em;
	width: 520px;
	margin-left: auto;
	margin-right: auto;
	margin-top: 10%;
	position: absolute;
	top: 0px;
}

* html #st-attachments-attach-interface {
}

#st-attachments-attach-formtarget {
	width: 0px;
	height: 0px;
	border: 0;
	padding: 0;
	margin: 0;
}

#st-attachments-attach-message {
	font-size: 90%;
	font-family: Verdana, Arial, Helvetica, Sans-Serif;
}

#st-attachments-attach-title {
	font-weight: bold;
	font-size: 120%;
}

#st-attachments-attach-close {
	float: right;
	margin-top: 6px;
}

#st-attachments-attach-uploadbutton {
	float: right;
	margin-right: 6px;
	margin-top: 6px;
	padding-bottom: 0;
}

#st-attachments-attach-fileprompt {
	margin: 0.2em 0 0.4em 0;
	padding-bottom: 0px;
}

#st-attachments-attach-submit {
	font-size: 90%;
	font-weight: bold;
}

#st-attachments-attach-filename {
	font-size: 90%;
}

#st-attachments-attach-uploadmessage {
	font-weight: bold;
	margin-bottom: 1em;
	display: none;
}

#st-attachments-attach-error {
	font-weight: bold;
	color: #f00;
	margin-bottom: 1em;
	display: none;
}

#st-attachments-attach-list {
	display: none;
	color: #666;
	font-size: 90%;
	margin-top: 1em;
	margin-bottom: 1em;
	border-top: 1px solid #4949BA;
	border-bottom: 1px solid #4949BA;
	background-color: #F5F5F5;
	padding: 3px;
}

.st-attachments-attach-listlabel {
	font-size: 90%;
	color: #4949BA;
}

/* Queue File Dialog */

#st-attachmentsqueue-interface {
	font-family: Helvetica, sans-serif;
	font-size: 90%;
	display: none;
	position: fixed;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	background-image: url('../../images/st/popup/bg.png'); /* Don't forget IE hack for ship! */
	z-index: 2000;
}

* html #st-attachmentsqueue-interface {
	background-image: none;
}

#st-attachmentsqueue-dialog {
	z-index: 2002;
	background-color: #fff;
	color: #000;
	border: 4px solid #ccc;
	padding: 1em;
	width: 530px;
	margin-left: auto;
	margin-right: auto;
	margin-top: 10%;
	position: absolute;
	top: 0px;
}

* html #st-attachmentsqueue-dialog {
}

#st-attachmentsqueue-fileprompt {
	margin-bottom: 0.4em;
	margin-top: 0;
	padding-bottom: 0;
}

#st-attachmentsqueue-title {
	font-weight: bold;
	font-size: 120%;
}

#st-attachmentsqueue-close {
	float: right;
	margin-top: 6px;
}

#st-attachmentsqueue-uploadbutton {
	float: right;
	margin-right: 6px;
	margin-top: 6px;
	padding-bottom: 0;
}

#st-attachmentsqueue-submit {
	font-size: 90%;
}

#st-attachmentsqueue-filename {
	font-size: 90%;
}

#st-attachmentsqueue-message {
	font-size: 90%;
	font-family: Verdana, Arial, Helvetica, Sans-Serif;
}

#st-attachmentsqueue-uploadmessage {
	font-weight: bold;
	margin-bottom: 1em;
	display: none;
}

#st-attachmentsqueue-error {
	font-weight: bold;
	color: #f00;
	margin-bottom: 1em;
	display: none;
}

#st-attachmentsqueue-list {
	display: none;
	color: #666;
	font-size: 90%;
	margin-top: 1em;
	margin-bottom: 1em;
	border-top: 1px solid #4949BA;
	border-bottom: 1px solid #4949BA;
	background-color: #F5F5F5;
	padding: 3px;
}

.st-attachmentsqueue-listlabel {
	font-size: 90%;
	color: #4949BA;
}

/* Lists */

tr.st-trbg-even, tr.st-trbg-even td{
	background-color: #f3f7f7;
}

tr.w-st-even-row, tr.w-st-even-row td {
	background-color: #f3f7f7;
}

.query-results-header-title, .query-results-header-last-edit-by {
	text-align: left;
}


.query-results-row-revisions {
	text-align: right;
}

.query-results-content {
	font-size: 85%;
	border-collapse: collapse;
	border: 1px dashed #ddd;
	border-left: 1px solid #ddd;
	border-right: 1px solid #ddd;
}

.query-results-row {
	border-collapse: collapse;
	border: 1px dashed #ddd;
	border-left: 1px solid #ddd;
	border-right: 1px solid #ddd;
}

.query-results-row a {
	text-decoration: underline;
	color: #00f;
}

.query-results-row td {
	font-family: Verdana;
	padding: 0.3em;
	border-left: 1px dashed #ddd;
	border-right: 1px dashed #ddd;
	border-top: 1px solid #ddd;
	border-bottom: 1px solid #ddd;
}

.query-results-header-row {
	border-collapse: collapse;
	border: 1px dashed #ddd;
	border-left: 1px solid #ddd;
	border-right: 1px solid #ddd;
}

.query-results-header-row a {
	text-decoration: underline;
	color: #00f;
}

.query-results-header-row th {
	font-family: Helvetica;
	padding: 0.3em;
	border-left: 1px dashed #ddd;
	border-right: 1px dashed #ddd;
	border-top: 1px solid #ddd;
	border-bottom: 1px solid #ddd;
}

div.st-actionbutton {
	float: left;
}

div#deleteme-st-actions-bar {
	clear: both;
	margin: 0.8em 20px 0.2em auto;
	padding: 0;
}

/* Manage File Interface */



#st-attachments-manage-interface {
	z-index: 2002;
	background-color: #fff;
	color: #000;
	border: 4px solid #ccc;
	padding: 1em;
	width: 520px;
	margin-left: auto;
	margin-right: auto;
	margin-top: 10%;
	position: absolute;
	top: 0px;
}

#st-attachments-manage-filetable {
	height: 150px;
	margin: 0;
	padding: 0;
	width: 100%;
	overflow: auto;
	border: 1px solid #ccc;
}

#st-attachments-manage-filelisting tbody td {
	font-size: 90%;
}
#st-attachments-manage-filelisting {
	width: 100%;
	border-collapse: collapse;
	border: 0;
	margin: 0;
	padding: 0;
}

#st-attachments-manage-fileheader {
	background: #ccc;
	font-weight: bold;
	border-bottom: 1px black solid;
}

#st-attachments-manage-close {
	float: right;
	margin-top: 3px;
	margin-right: -2px;
	font-weight: bold;
}

#st-attachments-manage-delete {
	margin-top: 3px;
	float: left;
	font-weight: bold;
}

.st-attachments-manage-filerow {
	border-bottom: 1px solid #ccc;
}

.row-odd {
	background-color: #eee;
}

.row-even {
	background-color: #fff;
}

.row-on {
	background-color: #009 !important;
	color: white !important;
}

.row-on a {
	color: #fff !important;
}

#st-attachments-manage-deletemessage {
	color: red;
}

/* Page tools icons */

#st-pagetools-print {
	background: url('../../images/st/pagetools/print.gif')
	left center no-repeat;
}

#st-pagetools-email {
	background: url('../../images/st/pagetools/email.gif')
	left center no-repeat;
}

#st-pagetools-tools {
	background: url('../../images/st/pagetools/tools.gif')
	left center no-repeat;
}

/*
 #st-pagetools-watch {
	background: url('../../images/st/pagetools/watch-blue.gif')
	left center no-repeat;
}
*/


/* *********** Settings *********** */

#st-settings-pane {
}
* html #settings-pane { font-size: 85%;}

.settings-start-table {
}
* html .settings-start-table { font-size: 90%;}

#st-settings-select {
	padding: 0px 10px 10px 10px;
	vertical-align: top;
	width: 1px;

	background-color: #eff1ec;
	border: none;
}

#st-settings-section {
	padding: 0px 10px 10px 10px;
	vertical-align: top;
}

.settings-top-header {
	margin-top: 1em;
	font-weight: bold;
	width: 15em;
}

.settings-header {
	margin-top: 1em;
	font-weight: bold;
}

.settings-selections {
	padding: 0px 0px 0px 20px;
	line-height: 1.5em;
}

.settings-selections a:visited, .settings-selections a:active {
	color: #0000ff;
}

.settings-link {
	clear: both;
	display: block;
}

.settings-section-left {
	text-align: right;
}

.settings-label {
	font-weight: bold;
}

.settings-help {
	color: #888;
}

.settings-comment {
}

.users-invite-message {
	padding: 0.5em 0.5em 0.5em 2em;
	background-color: #eee;
	/* This seems necessary to fix an IE bug that sometimes
		causes the text in this div to be invisible */
	z-index: 1000;
}

.workspace-entry-header {
	margin-top: .5em;
	font-weight: bold;
}

.workspace-entry {
	margin-left: 3em;
}

.workspace-entry-p {
	margin-top: .5em;
	margin-bottom: .75em;
}

.workspace-subentry {
	font-style: italic;
	font-weight: bold;
	margin-left: 1.5em;
}

.preferences-td {
	padding:.5em 0 1.5em 0;
}

.preferences-query {
	text-align: left;
}

.preference-radio {
	background-color: #cec;
}
.user-settings-listall-headings td {
	background-color: #eff3ef;
}

#st-settings-save {
	padding-bottom: 0.5em;
}

.standard-button-cancel {
	font-weight: bold;
	background-color: #71004b;

	border-left: 1px solid #aaa;
	border-top: 1px solid #aaa;
	border-bottom: 2px solid #333;
	border-right: 2px solid #333;
	color: #f4f3b9;
	width: 8em;
}

.standard-button-submit {
	font-weight: bold;
	background-color: #656084;

	border-left: 1px solid #aaa;
	border-top: 1px solid #aaa;
	border-bottom: 2px solid #333;
	border-right: 2px solid #333;
	color: #f4f3b9;
	width: 8em;
}

#st-settings {
	font-family: Verdana, Arial, Helvetica, Sans-Serif;
	font-size: 90%;
}


/* Listview Tabs */


#st-listview a:visited {
	color: #551a8b;
}
#st-listview-tabs ul {
	display: block;
	list-style: none outside;
	margin: 0 0 0 4em;
	padding: 0;
	font-family: Helvetica, Arial, Sans-serif;
	font-size: 80%;
}

#st-listview-tabs li {
	display: block;
	float: left;
	margin: 0 0.8em 0 0;
	padding: 3px 0.6em 0 0.6em;
	border: 1px solid #d8d8d8;
	border-bottom: 1px solid rgb(128, 169, 243);
	background-color: #f4f4f4;
	position: relative;
	bottom: -2px;
}

#st-listview-tabs li.spacer {
	margin: 0 0.8em 0 2em;
}

#st-listview-tabs a {
	color: #bbb;
	text-decoration: none;
}

#st-listview-tabs li.selected {
	background-color: #fff !important;
	border: 1px solid rgb(128, 169, 243) !important;
	border-bottom: 1px solid #fff !important;
	font-weight: bold !important;
}

#st-listview-tabs li.selected a {
	color: #000 !important;
}

/* Category List Display */

#st-category-display-links {
	margin-bottom: 1em;
	font-size: 90%;
}

#st-tag-listbody {
	font-family: Helvetica, Verdana, sans-serif;
}

/* Attachments List Display */

#st-attachments-list-body table.button-table {
	margin-top: 0.1em;
	font-size: 80%;
}


/* ********** PageTools Menu ************** */

div#st-editing-tools {
	float: left;
}

div#st-pagetools {
	z-index: 300;
	font-family: Helvetica, Verdana, sans-serif;
	font-size: 10px;
	float: right;
	margin: 18px 0 0 0em;
	color: #000;
	vertical-align: bottom;
	position: relative;
}

#st-pagetools a {
	text-decoration: none;
	color: black;
	padding-left: 17px;
}

#st-pagetools span {
	color: inherit;
	padding-left: 17px;
	vertical-align: top;
}

#st-pagetools span.st-watchlist-link {
	color: inherit;
	vertical-align: top;
}

.st-watchlist-link {
	cursor: pointer;
}

div#st-pagetools ul.level2 {
	z-index: 300;
	margin: 0;
	padding: 0;
	background: white;
	border: 1px solid #CCC;
	border-width: 0 1px;
}

div#st-pagetools li {
	position: relative;
	list-style: none;
	margin: 0;
	float: left;
	width: 7em;
	line-height: 11px;
}

div#st-pagetools ul ul li:hover {
	background: #BFE2FF;
}

div#st-pagetools li a {
	display: block;
	text-decoration: none;
}

div#st-pagetools>ul a {
	width: auto;
}

div#st-pagetools ul ul {
	position: absolute;
	width: auto;
	display: none;
}

div#st-pagetools ul ul li {
	line-height: 1.5em;
/*	width: 100%; */
	width: 14em;
}

.first {
	border-top: 1px solid #CCC;
}

.separator {
	border-bottom: 1px solid #CCC;
}

div#st-pagetools ul ul li a {
	border-bottom: 1px solid #CCC;
	padding-left: 15px;
	padding-right: 3px;
	margin-right: 3px;
	border: 0px;
}

div#st-pagetools li.submenu li.submenu:hover {
	z-index: 300;
	background-color: #BFE2FF;
}

div#st-pagetools ul.level1 li.submenu:hover ul.level2 {
	display:block;
}

div#st-pagetools ul.level2 {
	top: 1.0em;
	left: -9.5em;
}

/*

=head2 Revision List Display

Change these styles to update the page revision list.

*/

#st-revision-list-table {
	border-collapse: collapse;
	font-size: 85%;
	color: #000;
}

.st-page-title-decorator {
	color: #C80000;
}

.st-revision-header-emphasis {
	color: #C80000;
}

.st-revision-list-compare-button-row {
}

.st-revision-list-compare-button-cell {
	padding-top: 0.3em;
	text-align: center;
}

.st-revision-list-compare-button {
}

#st-revision-list-header-row {
}

#st-revision-list-header-select {
	padding: 6px 2px 2px 2px;
	text-align: center;
}

#st-revision-list-header-revision {
	padding: 6px 2px 2px 2px;
	text-align: left;
}

#st-revision-list-header-edited-by {
	padding: 6px 2px 2px 2px;
	text-align: center;
}

#st-revision-list-header-date {
	padding: 6px 2px 2px 2px;
	text-align: center;
}

.st-revision-list-row {
	border-collapse: collapse;
	border: 1px dashed #ddd;
	border-left: 1px solid #ddd;
	border-right: 1px solid #ddd;
}

.st-revision-list-row td {
	font-family: Verdana;
	padding: 0.3em;
	border-left: 1px dashed #ddd;
	border-right: 1px dashed #ddd;
	border-top: 1px solid #ddd;
	border-bottom: 1px solid #ddd;
}

.st-revision-list-row-select {
	padding: 3px 0 2px 0;
	text-align: center;
}

.st-revision-list-row-select-old {
}

.st-revision-list-row-select-new {
}

.st-revision-list-row-revision {
}

.st-revision-list-row-revision-link {
}

.st-revision-list-row-edited-by {
}

.st-revision-list-row-date {
}

/* Revision Menu */

#st-pagetools.st-revision-view-bar {
	float: left;
}

ul.st-revision-menu {
	list-style: none;
	margin: 0;
	padding: 0.2em;
	font-size: 80%;
}

ul.st-revision-menu li {
	float: left;
	padding: 0 0.4em 0 0.4em;
	border-right: thin solid #000000;
}

ul.st-revision-menu li.st-last {
	border-right: none;
}

#st-restore-revision-button {
	font-size: 80%;
}

/*

=head2 Revision Compare Display

When comparing two revisions of a page, these styles apply.

*/

#st-revision-compare-table {
	background-color: #f0f0f0;
}

#st-revision-compare-table td {
	background-color: white;
}

.st-revision-compare-old {
	background-color: #fdd;
	text-decoration: line-through;
}
.st-revision-compare-new {
	background-color: #dfd;
	font-weight: bold;
}

/* Weblog View */

#st-weblog {
	padding: 0;
}

#st-content-weblog-display-width-controller {
}
#st-content-weblog-display-width-controller-nav {
	width: 230px;
	margin-left: 15px;
	border-left: 5px solid #ddd;
	margin-top: -1px;
}

#st-weblog-content {
	font-family: Verdana, Helvetica, sans-serif;
	margin-top: -1px;
	margin-bottom: -1px;
	border-top: 1px solid #80a9f3;
	border-bottom: 1px solid #80a9f3;
}

#st-weblog-title {
	font-family: 'Trebuchet MS', Verdana, Helvetica, sans-serif;
	font-family: 'Times New Roman', serif;
	background-color: #80a9f3;
	color: #fff;
	font-size: 150%;
	font-weight: bold;
	padding: 0.2em;
	padding-left: 1em;
}

#st-weblog-wikititle {
	font-family: Helvetica, Verdana, sans-serif;
	font-style: italic;
	font-size: 40%;
	color: #fff;
	margin-bottom: 0.2em;
	margin-top: 0.1em;
	padding-top: 0;
}

#st-weblog-titletext {
	font-family: Helvetica, Verdana, sans-serif;
	font-weight: bold;
	color: #fff;
}

div.st-weblog-entry {
	margin-top: 0.2em;
	margin-bottom: 4.8em;
	padding: 0 1.5em 0 1.5em;
}

.st-page-title {
	clear: both;
}

div.st-weblog-entrytitle span.text {
	font-family: Helvetica, Verdana, sans-serif;
	font-size: 150%;
	font-weight: bold;
	color: #000;
}

.st-weblog-entrycontent {
	font-family: Verdana, Helvetica, sans-serif;
	font-size: 90%;
	border-bottom: 1px solid #888;
}

.st-weblog-byline {
	float: left;
	text-align: left;
	font-style: italic;
	font-size: 70%;
	font-family: Verdana, Helvetica, sans-serif;
}

.st-weblog-post-links {
	float: right;
	text-align: right;
	font-size: 70%;
	font-family: Verdana, Helvetica, sans-serif;
}

#st-weblog-archives, #st-weblog-navigation {
	position: relative;
	float: right;
	width: 230px;
}

#st-weblog-archives {
	margin-top: 15px;
	clear: right;
}

#st-weblog-archives-title, #st-weblog-navigation-title {
	margin-left: 15px;
	font-family: Helvetica, sans-serif;
	font-size: 95%;
	font-weight: bold;
	color: #999;
	border-bottom: 2px solid #f99;
	padding-bottom: 5px;
	padding-top: 5px;
	margin-bottom: 5px;
}

#st-weblog-navigation-content {
	margin-left: 15px;
	font-size: 80%;
}

#st-weblog-archives ul {
	margin: 0;
	padding: 0;
}

#st-weblog-archives ul li {
	/* list-type: none; */
	display: block;
	font-size: 80%;
	font-family: Helvetica, sans-serif;
	padding-left: 15px;
}

#st-weblog-newpost {
	padding: 0.5em 0.7em 0.3em 0.3em;
}

#st-weblog-newpost-button {
}

#st-weblog-actionbar-chooseweblog {
	float: right;
}

#st-weblog-postbyemail {
	font-size: 70%;
	font-family: Verdana, Helvetica, sans-serif;
	color: #def;
	padding-top: 0.4em;
}

#st-weblog-postbyemail-link {
	color: #00c;
}

.st-weblog-chooseprompt {
	font-size: 90%;
	font-family: Verdana, Helvetica, sans-serif;
	padding-right: 0.2em;
	color: #000;
}

.st-spacer {
	padding-right: 0.1em;
	padding-left: 0.1em;
}

.st-weblog-preventries {
	padding-bottom: 20px;
	clear: both;
}
.st-weblog-nextentries {
	clear: both;
}

div.st-weblog-entrynav {
	margin-top: 0.2em;
	margin-bottom: 1.8em;
	padding: 0;
}

span.st-weblog-previousentries, span.st-weblog-nextentries {
	font-size: 90%;
	font-family: Verdana, Helvetica, sans-serif;
	padding-left: 1em;
}

/* ******* Page Stats ******** */

#st-usagereport-navbar {
	font-size: 80%;
	padding: 0;
	margin: 0;
}

#st-usagereport-date {
	font-weight: bold;
	margin-top: 1em;
}

#st-page-usagereport h1 {
	font-size: 1.3em;
	font-weight: bold;
	margin-top: 1.2em;
	margin-bottom: 0.3em;
}

#st-page-usagereport h2 {
	font-size: 1.1em;
	font-weight: bold;
	margin-top: 0.8em;
	margin-bottom: 0.3em;
}

/* New Page */
#st-newpage-save, #st-newpage-duplicate {
	display: none;
	position: fixed;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	background: url('../../images/st/popup/bg.png'); /* Don't forget IE hack for ship! */
	z-index: 2000;
}

#st-newpage-save-interface {
	background-color: #fff;
	color: #000;
	border: 4px solid #ccc;
	padding: 0.5em;
	width: 450px;
	margin-left: auto;
	margin-right: auto;
	margin-top: 10%;
	position:absolute;
	top:0px;
	z-index:2003;
}

#st-newpage-duplicate-interface {
	background-color: #fff;
	color: #000;
	border: 4px solid #ccc;
	padding: 0.5em;
	width: 530px;
	margin-left: auto;
	margin-right: auto;
	margin-top: 10%;
	position:absolute;
	top:0px;
	z-index:2003;
}

#st-newpage-save-title, #st-newpage-duplicate-title {
	margin: 0;
	padding: 0;
	font-weight: bold;
	font-family: Helvetica, sans-serif;
	font-size: 100%;
}

#st-newpage-save-prompt, #st-newpage-duplicate-prompt {
	font-family: Helvetica, sans-serif;
	font-size: 90%;
	margin-bottom: 0.4em;
}

#st-newpage-save-buttons, #st-newpage-duplicate-buttons {
	margin-top: 0.8em;
	text-align: right;
}

.st-newpage-duplicate-option {
	font-family: Helvetica, sans-serif;
	font-size: 90%;
	margin: 0;
	padding: 0;
}

#st-newpage-duplicate-pagename {
	font-size: 90%;
}

.st-newpage-duplicate-emphasis {
	background-color: #FFFF00;
	font-weight: bold;
}

#st-newpage-save-field-pagename {
	margin-bottom: 0;
	margin-top: 0.2em;
	padding-bottom: 0;
	font-size: 90%;
}

#st-newpage-save-tip {
	margin-bottom: 0;
	margin-top: 1.2em;
	padding-bottom: 0;
	font-size: 75%;
	color: #888;
}

/* Wikitext Styling */

.wiki {
}

.wiki hr {
	margin-top: .4em;
	margin-bottom: .4em;
}

.wiki .short-rule {
	width: 25%;
}

.wiki .medium-rule {
	width: 50%
}

.wiki ul,
.wiki ol,
.wiki blockquote {
	margin-left: 2em;
	padding-left: 0em;
}

.wiki table {
	border-collapse: collapse;
}

.wiki td {
	border: 1px;
	border-style: solid;
	padding: .2em;
	vertical-align: top;
}

.wiki h1,
.wiki h2,
.wiki h3,
.wiki h4,
.wiki h5,
.wiki h6 {
	font-weight: bold;
	font-style: normal;
	margin-top: 0.1em;
	margin-bottom: 8px;
}

.wiki h1 {font-size: 200%;}
.wiki h2 {font-size: 170%;}
.wiki h3 {font-size: 145%;}
.wiki h4 {font-size: 125%;}
.wiki h5 {font-size: 110%;}
.wiki h6 {font-size: 100%;}

.wiki pre {
	background-color: #eee; /* XXX */
	margin-left: 1em;
	margin-right: 1em;
	padding: .2em;
}

.wiki .incipient {
	text-decoration: none;
	border-bottom: 1px dashed;
}

.wiki-include-title {
	background-color: #ccccff;
}

.wiki .wiki {
	position: relative;
	background-color: #ddddff;
	border: 1px solid #ccccff;
	padding: 3px;
}

.wafl_existence_error {
	color: rgb(200,0,0);
	border-bottom: 0.2em dashed rgb(200,0,0);
}

#st-edit-mode-container {
}

#st-edit-mode-view {
}

#st-page-editing-uploadbutton {
	z-index: 1500;
	float: left;
}

/* Comment UI */


body#st-commentui {
	background: #ffffff;
}

#st-commentui-container {
}

#st-commentui-container a:visited,
#st-commentui-container a:active {
	color: #00f;
}

#st-commentui-notetop {
}

#st-commentui-controls {
}

#st-commentui-savelink {
	background-color: #fffebd;
}

#st-commentui-cancellink {
}

#st-commentui-customfield {
}

#st-commentui-customfield .customfield-label {
}

#st-commentui-customfield .customfield-input {
}

#st-commentui-textarea {
	padding: 0;
	border-style: inset;
	border-width: thin;
	background-color: #ffd;
	color: black;
	width: 99%;
	height: 150px;
}

/*

=head2 Send Page by Email

Styles for the 'Send Page by Email' popup, accessed from the 'Email' dropdown
menu on the page bar.

*/

#email-page {
	background: #ffffff;
	font-size: 80%;
}

.email-page-row {
	clear: both;
}

.email-page-row-label {
	font-weight: bold;
	float: left;
	width: 5em;
	margin-left: 1.2em;
	margin-right: 1.2em;
	text-align: right;
}

.email-page-row-content {
	float: left;
	padding-bottom: 1.2em;
}

.email-page-user-select-column {
	float: left;
	padding-right: 1.2em;
	width: 14em;
}

#email-page-user-select-column-center {
	width: 10em;
}

.email-page-user-select-label {
	text-align: center;
}

#email-page-user-select-add-label {
	padding-top: 1em;
}

.email-page-user-select-button-group {
	padding-bottom: 2em;
}

.email-page-input {
	width: 120px;
	clear: both;
	display: block;
}


.email-page-select {
	width: 175px;
	font-size: x-small;
}

#email-page-error-message {
	text-align: center;
}

#email-page-buttons-container {
	clear: both;
}

#email-page-buttons {
	text-align: center;
}

.email-page-input-new {
	width: 175px;
}

/* System Status, Red with icon */

#st-system-status-alert {
	clear: both;
	width: 50%;
	margin-left: 25%;
	margin-top: 10px;
	padding: 5px;
	color: #c00;
	font-weight: bold;
	font-size: 80%;
	background: transparent url('../../images/st/system-message/important-note.gif') no-repeat 5px center;
	padding-left: 60px;
	min-height: 38px;
}
* html #st-system-status-alert {
	height: 38px;
}

/* System Status, Green */

#st-system-status {
	clear: both;
	text-align:center;
	width: 80%;
	margin-left: 10%;
	padding: 8px 0 3px 0;
	color: #0a0;
	font-family: Arial, Helvetica, sans-serif;
	font-size: 80%;
}

.socialtextLogo {
	text-align: center;
}
/*}}}*/
