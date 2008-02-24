<?php
/***
! User settings
Edit these lines according to your need
***/
//{{{
$AUTHENTICATE_USER = true;	// true | false
$USERS = array(
	'UserName1'=>'Password1', 
	'UserName2'=>'Password2', 
	'UserName3'=>'Password3'); // set usernames and strong passwords
$DEBUG = false;				// true | false
$CLEAN_BACKUP = true; 		// during backuping a file, remove overmuch backups
error_reporting(E_ERROR | E_WARNING | E_PARSE);
//}}}
/***
!Code
No change needed under
***/
//{{{

/***
 * storeTiddler.php - upload a tiddler to a TiddlyWiki file in this directory
 * version: 1.0.0 - 2008/02/24 - BidiX@BidiX.info
 * 
 * tiddler is POST as <FORM> with :
 *	FORM = 
 *		title=<the title of the tiddler>
 *		tiddler=<result of externalizeTiddler() : the div in StoreArea format>
 *		[fileName=<tiddlyWiki filename>] (default; index.html)
 *		[backupDir=<backupdir>] (default: .)
 *		[user=<user>] (no default)
 *		[password=<password>] (no default)
 *		[uploadir=<uploaddir>] (default: .)
 *		[debug=1]] (default: false)
 * see : 
 *	http://tiddlywiki.bidi.info/#UploadTiddlerPlugin for usage
 *  http://tiddlywiki.bidi.info/#UploadPlugin for parameter descriptions
 * usage : 
 *	POST FORM
 *		Update <tiddler> in <fileName> TiddlyWiki
 *	GET
 *		Display a form for 
 *
 * Revision history
 * V1.0.0 - 2008/02/24
 * First public Version
 * V0.3.0 - 2008/02/23
 * minor adjustments
 * V0.2.0 - 2008/02/23
 * Correction bug on large regex
 * V0.1.0 - 2008/02/09
 * Initial: First working version
 * V0.0.1 - 2008/02/02
 * Initial: Proof Of Concept
 *
 * Copyright (c) BidiX@BidiX.info 2005-2008
 ***/
//}}}

//{{{

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	/*
	 * GET Request
	 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
		<title>BidiX.info - TiddlyWiki UploadTiddlerPlugin - Store script</title>
	</head>
	<body>
		<p>
		<p>storeTiddler.php V 1.0.0
		<p>BidiX@BidiX.info
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<p align="center">This page is designed to upload a <a href="http://www.tiddlywiki.com/#Tiddler">Tiddler<a>.</p>
		<p align="center">for details see : <a href="http://TiddlyWiki.bidix.info/#HowToUpload">TiddlyWiki.bidix.info/#HowToUpload<a>.</p>
		<hr>
		<form action="storeTiddler.php" method=POST>
			<center>
				<table>
					<tr>
						<td align=RIGHT>Title:</td>
						<td><input type=TEXT name="title" size=80></td>
					</tr>
					<tr>
						<td align=RIGHT>Tiddler (in StoreArea format):</td>
						<td><TEXTAREA NAME="tiddler" COLS=80 ROWS=10>
&lt;div title=&quot;New Tiddler&quot; modifier=&quot;BidiX&quot; created=&quot;200802161401&quot; tags=&quot;test&quot; changecount=&quot;1&quot;&gt;
&lt;pre&gt;Type the text for &#x27;New Tiddler&#x27;&lt;/pre&gt;
&lt;/div&gt;
						</TEXTAREA></td>
					</tr>
					<tr>
						<td align=RIGHT>fileName:</td>
						<td><input type=TEXT name="fileName" size=80></td>
					</tr>
					<tr>
						<td align=RIGHT>backupDir:</td>
						<td><input type=TEXT name="backupDir" size=80></td>
					</tr>
					<tr>
						<td align=RIGHT>user:</td>
						<td><input type=TEXT name="user" size=80></td>
					</tr>
					<tr>
						<td align=RIGHT>password:</td>
						<td><input type=TEXT name="password" size=80></td>
					</tr>
					<tr>
						<td align=RIGHT>uploadir:</td>
						<td><input type=TEXT name="uploadir" size=80></td>
					</tr>
					<tr>
						<td align=RIGHT>debug:</td>
						<td><input type=TEXT name="debug" size=80 value=1></td>
					</tr>
				</table>
				<input type=SUBMIT align="CENTER" value="Upload tiddler">
			</center>
		</form>
	</body>
</html>
<?php
exit;
}

/*
 * POST Request
 */

/*
 * Functions included from store.php
 */

	// Recursive mkdir
	function mkdirs($dir) {
		if( is_null($dir) || $dir === "" ){
			return false;
		}
		if( is_dir($dir) || $dir === "/" ){
			return true;
		}
		if( mkdirs(dirname($dir)) ){
			return mkdir($dir);
		}
		return false;
	}

	function toExit() {
		global $DEBUG, $filename, $backupFilename, $options;
		if ($DEBUG) {
			echo ("\nHere is some debugging info : \n");
			echo("\$filename : $filename \n");
			echo("\$backupFilename : $backupFilename \n");
			print ("\$_FILES : \n");
			print_r($_FILES);
			print ("\$options : \n");
			print_r($options);
	}
	exit;
	}

	function ParseTWFileDate($s) {
		// parse date element
		preg_match ( '/^(\d\d\d\d)(\d\d)(\d\d)\.(\d\d)(\d\d)(\d\d)/', $s , $m );
		// make a date object
		$d = mktime($m[4], $m[5], $m[6], $m[2], $m[3], $m[1]);
		// get the week number
		$w = date("W",$d);

		return array(
			'year' => $m[1], 
			'mon' => $m[2], 
			'mday' => $m[3], 
			'hours' => $m[4], 
			'minutes' => $m[5], 
			'seconds' => $m[6], 
			'week' => $w);
	}

	function cleanFiles($dirname, $prefix) {
		$now = getdate();
		$now['week'] = date("W");

		$hours = Array();
		$mday = Array();
		$year = Array();

		$toDelete = Array();

		// need files recent first
		$files = Array();
		($dir = opendir($dirname)) || die ("can't open dir '$dirname'");
		while (false !== ($file = readdir($dir))) {
			if (preg_match("/^$prefix/", $file))
	        array_push($files, $file);
	    }
		$files = array_reverse($files);

		// decides for each file
		foreach ($files as $file) {
			$fileTime = ParseTWFileDate(substr($file,strpos($file, '.')+1,strrpos($file,'.') - strpos($file, '.') -1));
			if (($now['year'] == $fileTime['year']) &&
				($now['mon'] == $fileTime['mon']) &&
				($now['mday'] == $fileTime['mday']) &&
				($now['hours'] == $fileTime['hours']))
					continue;
			elseif (($now['year'] == $fileTime['year']) &&
				($now['mon'] == $fileTime['mon']) &&
				($now['mday'] == $fileTime['mday'])) {
					if (isset($hours[$fileTime['hours']]))
						array_push($toDelete, $file);
					else 
						$hours[$fileTime['hours']] = true;
				}
			elseif 	(($now['year'] == $fileTime['year']) &&
				($now['mon'] == $fileTime['mon'])) {
					if (isset($mday[$fileTime['mday']]))
						array_push($toDelete, $file);
					else
						$mday[$fileTime['mday']] = true;
				}
			else {
				if (isset($year[$fileTime['year']][$fileTime['mon']]))
					array_push($toDelete, $file);
				else
					$year[$fileTime['year']][$fileTime['mon']] = true;
			}
		}
		return $toDelete;
	}

/*
 * End Functions included from store.php
 */

/*
 * parse and print a TiddlyWiki file
 */

/*function replaceJSContentIn($content) {
	if (preg_match ("/(.*?)<!--DOWNLOAD-INSERT-FILE:\"(.*?)\"--><script\s+type=\"text\/javascript\">(.*)/ms", $content,$matches)) {
		$front = $matches[1];
		$js = $matches[2];
		$tail = $matches[3];
		if (preg_match ("/<\/script>(.*)/ms", $tail,$matches2)) {		
			$tail = $matches2[1];
		}
		$jsContent = "<script type=\"text/javascript\" src=\"$js\"></script>";
		$tail = replaceJSContentIn($tail);
		return($front.$jsContent.$tail);
	}
	else
		return $content;
}
*/
Function readTiddlyWiki($file) {
	
	if (file_exists($file)) {
		$tw = file_get_contents ($file);
		if (preg_match ("/(.*?<div id=\"storeArea\">.*?)(<div.*)/ms", $tw,$matches)) {
			$head = $matches[1];
			$h = $matches[2];
			$tiddlers = array();
			while (preg_match ("/(.*?)(<div title=\"(.*?)\".*?<\/div>)(.*)/ms", $h,$matches)) {
				$h=$matches[4];
				$tiddlers[$matches[3]] = $matches[2];
			}
			$tail = $h;
		}
		else {
			echo("The file '$file' isn't a valid TiddlyWiki");
			toExit();
		}
	}
	else {
		echo ("File '$file' doesn't exist");
		toExit();
	}
	return array($head, $tiddlers ,$tail);
}

Function writeTiddlyWiki($head,$tiddlers,$tail) {
	$content = $head;
	sort($tiddlers);
	foreach ($tiddlers as $t => $c) {
		$content .= $c . "\n";
	}
	$content .= $tail;
	return $content;
}

# $destfile = $uploadDir . $filename;
$destfile = "index.html";


// var definitions
$uploadDir = './';
$uploadDirError = false;
$backupError = false;
$backupFilename = '';
$filename = "index.html";
$destfile = $filename;

$options = $_POST; // for store.php name compatibility

// debug activated by client
if ($options['debug'] == 1) {
	$DEBUG = true;
}


// authenticate User
if (($AUTHENTICATE_USER)
	&& ((!$options['user']) || (!$options['password']) || ($USERS[$options['user']] != $options['password']))) {
	echo "Error : UserName or Password do not match \n";
	echo "UserName : [".$options['user']. "] Password : [". $options['password'] . "]\n";
	toExit();
}


if ($options['filename'])
	$filename = $options['filename'];


// make uploadDir
if ($options['uploaddir']) {
	$uploadDir = $options['uploaddir'];
	// path control for uploadDir   
    if (!(strpos($uploadDir, "../") === false)) {
        echo "Error: directory to upload specifies a parent folder";
        toExit();
	}
	if (! is_dir($uploadDir)) {
		mkdirs($uploadDir);
	}
	if (! is_dir($uploadDir)) {
		echo "UploadDirError : $uploadDirError - File NOT uploaded !\n";
		toExit();
	}
	if ($uploadDir{strlen($uploadDir)-1} != '/') {
		$uploadDir = $uploadDir . '/';
	}
}
$destfile = $uploadDir . $filename;

// backup existing file
if (file_exists($destfile) && ($options['backupDir'])) {
	if (! is_dir($options['backupDir'])) {
		mkdirs($options['backupDir']);
		if (! is_dir($options['backupDir'])) {
			$backupError = "backup mkdir error";
		}
	}
	$backupFilename = $options['backupDir'].'/'.substr($filename, 0, strrpos($filename, '.'))
				.date('.Ymd.His').substr($filename,strrpos($filename,'.'));
	copy($destfile, $backupFilename) or ($backupError = "rename error");
	// remove overmuch backup
	if ($CLEAN_BACKUP) {
		$toDelete = cleanFiles($options['backupDir'], substr($filename, 0, strrpos($filename, '.')));
		foreach ($toDelete as $file) {
			$f = $options['backupDir'].'/'.$file;
			if($DEBUG) {
				echo "delete : ".$options['backupDir'].'/'.$file."\n";
			}
			unlink($options['backupDir'].'/'.$file);
		}
	}
}


if (file_exists($destfile)) {
	list($head,$tiddlers,$tail) = readTiddlyWiki($destfile);
	$title = $_POST['title'];
	//print_r($tiddlers);
	$tiddlers[$title] = stripslashes($_POST['tiddler']);
	//ksort($tiddlers);
	$content = writeTiddlyWiki($head,$tiddlers,$tail);
	$f = fopen($destfile,'w');
	fwrite($f, $content );
	fclose($f);	
	
	if($DEBUG) {
		echo "Debug mode \n\n";
	}
	if (!$backupError) {
		echo "0 - Tiddler successfully updated in " .$destfile. "\n";
	} else {
		echo "BackupError : $backupError - Tiddler successfully updated in " .$destfile. "\n";
	}
	echo("destfile:$destfile \n");
	if (($backupFilename) && (!$backupError)) {
		echo "backupfile:$backupFilename\n";
	}
	$mtime = filemtime($destfile);
	echo("mtime:$mtime");
	
}
else {
	echo "Error : '" . $filename . "' doesn't exist - File NOT updated !\n";
}
toExit();

?>