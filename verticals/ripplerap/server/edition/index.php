<?php
/*
 *  produce an edition of RippleRap from a set of parameters:
 *
 *  http://ripplerap.com/edition?conferenceURI={conferenceURI}&type=confabb&conferenceName={conferenceName}
 *
 *  Where:
 *
 *  - conferenceURI is the confabb base URI for a conference, url encoded
 *    e.g. http%3A%2F%2Fconfabb.com%2Fconferences%2F16074-web-2-0-conference-2006
 *
 *  - type indicates the format of the data at the conferenceURI
 *    e.g. "confabb"
 *
 *  - conferenceName is the friendly dispayed title for the conference
 *    e.g. "The Big BackYard Seminar 2008"
 *
 *  requires a "blank" ripplerap.html file
 */

$conferenceURI = $_GET['conferenceURI'];
$type = $_GET['type'];
$conferenceName = $_GET['conferenceName'];
$username = $_GET['username'];
$source = 'ripplerap.html';

if ((0 != strlen($conferenceURI)) && (0 != strlen($type)) && (0 != strlen($conferenceName))) {
        // i18n unfriendly
        $filename = preg_replace("/[^A-Za-z0-9]+/", "", $conferenceName).'.html';

        // switch version if the conferenceURI is from a "staging" server
        $prefix = (strpos($conferenceURI,'staging.')>0)?"staging-":"";

        $conferenceName= $prefix.$conferenceName;
        $source= $prefix.$source;
        $filename= $prefix.$filename;

	header('Content-type: text/html;charset=UTF-8');
	header('Content-Disposition: attachment; filename='.$filename);

	$text = file_get_contents($source);        
	$text = preg_replace("/^(txtUserName\s*:\s*\&quot;)YourName(\&quot;;)/m", "$1".$username."$2", $text);
	$text = preg_replace("/^(config.options.txtSharedNotesUserName\s*=\s*\&quot;)YourName(\&quot;;)/m", "$1".$username."$2", $text);
	$text = preg_replace("/^(config.options.txtRippleRapConferenceName\s*=\s*\&quot;)(\&quot;;)/m", "$1".$conferenceName."$2", $text);
	$text = preg_replace("/^(config.options.txtRippleRapConferenceURI\s*=\s*\&quot;)(\&quot;;)/m", "$1".$conferenceURI."$2", $text);
	$text = preg_replace("/^(config.options.txtRippleRapType\s*=\s*\&quot;)(\&quot;;)/m", "$1".$type."$2", $text);

        header('Content-length: '.strlen($text));
        echo($text);
        exit(0);
}

?>
<html>
<head>
<title>RippleRap Bakery</title>
<style>
body { background-color: #eee; font: 16px/1.5em "Lucida Grande", Geneva, Arial, Verdana, sans-serif; text-align: center; }
form { width: 500px; text-align: left; margin: 5em auto; }
form * { display: block; }
input { margin: 3px 0px 20px 0px; font-size: 2em; width: 500px; }
#submit { border-top: 1px solid white; background-color: #444; color: #fff; display: block; padding: 0.5em; }
#submit:hover { background-color: #555; }
</style>
</head>
<body>
	<form method="GET" action="<? echo $_SERVER['REQUEST_URI']  ?>">
	    <label for="conferenceURI">conferenceURI:</label>
	    <input type="text" id="conferenceURI" name="conferenceURI" value="<? echo htmlentities($conferenceURI) ?>"/>

	    <label for="type">type:</label>
	    <input type="text" id="type" name="type" value="<? echo htmlentities($type) ?>"/>

	    <label for="conferenceName">conferenceName:</label>
	    <input type="text" id="conferenceName" name="conferenceName" value="<? echo htmlentities($conferenceName) ?>"/>

	    <label for="username">username:</label>
	    <input type="text" id="username" name="username" value="<? echo htmlentities($username) ?>"/>

	    <input id="submit" type="submit" value="Download ma RippleRap"/>
	</form>
    </body>
</html>
