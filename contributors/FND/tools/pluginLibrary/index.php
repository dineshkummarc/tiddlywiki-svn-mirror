<?php

require_once "dbq.php";
require_once "utils.php";

// initialize debugging variables
$debugMode = true;
$t0 = time();

// establish database connection
$dbq = new dbq();
$dbq->connect();

// start processing
processRepositories();

// close database connection -- DEBUG: not required?
$dbq->disconnect();

// output debugging info
$t1 = time();
addLog("Runtime: " . ($t1 - $t0) . " seconds");
debug($log); // DEBUG: write to file?

/*
** repository handling
*/

/**
* process repositories
* @return null
*/
function processRepositories() {
	global $dbq;
	$repositories = getRepositories();
	foreach($repositories as $repo) {
		if($repo->disabled) {
			addLog("skipped disabled repository " . $repo->name);
		} else {
			addLog("processing repository " . $repo->name);
			// load repository contents
			$contents = getPageContents($repo->URI);
			if($contents === false) {
				// increase repository's skipped counter in database
				$dbq->query("UPDATE `repositories` SET `skipped` = skipped + 1 WHERE `ID` = '"
					. $repo->ID . "'"); // DEBUG: use of query() hacky; can't use updateRecords() due to automatic quoting
				// log event
				addLog("skipped repository " . $repo->name . ": unavailable");
			} else {
				// initialize plugins
				initPluginFlags($repo->ID);
				// document type handling
				if($repo->type == "TiddlyWiki") // TiddlyWiki document
					processTiddlyWiki($contents, $repo);
				elseif($repo->type == "SVN") // Subversion directory
					echo $repo->type . "\n"; // DEBUG: to be implemented
				elseif($repo->type == "file") // JavaScript file
					echo $repo->type . "\n"; // DEBUG: to be implemented
				else
					addLog("ERROR: failed to process repository " . $repo->url);
			}
		}
	}
}

/**
* retrieve repositories
* @return array results
*/
function getRepositories() {
	global $dbq;
	return $dbq->retrieveRecords("repositories", array("*"));
}

/**
* initialize a repository's plugins' availability flags
* @param integer $repoID ID of the respective repository
* @return null
*/
function initPluginFlags($repoID) { // DEBUG: rename?
	global $dbq;
	$selectors = array(
		repository_ID => $repoID
	);
	// flag plugins as unavailable
	$data = array(
		available => false
	);
	$dbq->updateRecords("plugins", $data, $selectors);
	// retrieve repository's plugins
	$plugins = $dbq->retrieveRecords("plugins", array("ID"), $selectors);
	// purge auxiliary tables
	foreach($plugins as $plugin) {
		$selectors = array(
			repository_ID => $repoID,
			plugin_ID => $plugin->ID
		);
		$dbq->removeRecords("tags", $selectors);
		$dbq->removeRecords("tiddlerFields", $selectors);
		$dbq->removeRecords("metaslices", $selectors);
		$dbq->removeRecords("keywords", $selectors);
	}
}

/*
** tiddler retrieval
*/

/**
* process TiddlyWiki document
* @param string $contents document contents
* @param object $repo current repository
* @return null
*/
function processTiddlyWiki($contents, $repo) {
	$contents = str_replace("xmlns=", "ns=", $contents); // workaround for default-namespace bug
	$xml = @new SimpleXMLElement($contents); // DEBUG: errors for HTML entities (CDATA issue!?); suppressing errors hacky?!
	$version = getVersion($xml);
	// extract plugins
	$filter = "//div[@id='storeArea']/div[contains(@tags, 'systemConfig')]";
	$tiddlers = $xml->xpath($filter);
	// process plugins
	foreach($tiddlers as $tiddler) {
		if(floatval($version[0] . "." . $version[1]) < 2.2) {
			processPlugin($tiddler, $repo, true);
		} else {
			processPlugin($tiddler, $repo, false);
		}
	}
}

/**
* get version number from a TiddlyWiki document
* @param object $xml document contents (SimpleXML object)
* @return object
*/
function getVersion($xml) {
	$version = $xml->xpath("/html/head/script");
	preg_match("/major: (\d), minor: (\d), revision: (\d)/s", $version[0], $matches);
	$major = intval($matches[1]);
	$minor = intval($matches[2]);
	$revision = intval($matches[3]);
	if($major + $minor + $revision > 0) { // DEBUG: dirty hack?
		return array($major, $minor, $revision);
	} else {
		return null;
	}
}

/**
* process plugin tiddler
* @param object $tiddler tiddler object (SimpleXML object)
* @param object $repo current repository
* @param boolean [$oldStoreFormat] use pre-v2.2 TiddlyWiki store format
* @return null
*/
function processPlugin($tiddler, $repo, $oldStoreFormat = false) { // DEBUG: split into separate functions
	// DEBUG: use of strval() for SimpleXML value retrieval hacky!?
	// initialize plugin object
	$p = new stdClass;
	/* tiddler object structure -- DEBUG: create tiddler class?
	tiddler
		->repository
		->title				// N.B.: corresponds to Name slice (if available)
		->tags				// array
		->created
		->modified
		->modifier
		->fields			// key-value pairs
		->text
		->slices			// key-value pairs
		->keywords			// array
		->documentation
		->code
	*/
	// set repository
	$p->repository = $repo->ID;
	// retrieve tiddler fields
	$p->fields = new stdClass;
	foreach($tiddler->attributes() as $field) {
		switch($field->getName()) {
			case "title":
				$p->title = strval($field);
				break;
			case "tags":
				$p->tags = readBracketedList(strval($field));
				break;
			case "created":
				$p->created = strval($field);
				break;
			case "modified":
				$p->modified = strval($field);
				break;
			case "modifier":
				$p->modifier = strval($field);
				break;
			default: // extended fields
				$p->fields->{$field->getName()} = strval($field);
				break;
		}
	}
	// retrieve tiddler text -- DEBUG: strip leading and trailing whitespaces (esp. line feeds)?
	if(!$oldStoreFormat) { // v2.2+
		$p->text = strval($tiddler->pre);
	} else {
		$p->text = strval($tiddler);
	}
	// retrieve metaslices
	$p->slices = getSlices($p->text);
	// set tiddler title to Name slice
	if(isset($p->slices->Name)) {
		$p->title = $p->slices->Name;
	}
	// set plugin source
	$source = $p->slices->Source;
	// retrieve plugins only from original source
	if(!$source || $source && !(strpos($source, $repo->URI) === false)) { // DEBUG: www handling (e.g. http://foo.bar = http://www.foo.bar)?
		// check blacklist
		if(pluginBlacklisted($p->title, $p->repository)) {
			addLog("skipped blacklisted plugin " . $p->title . " in repository " . $repo->name);
		} else {
			// retrieve keywords
			$p->keywords = readBracketedList($p->slices->Keywords);
			// retrieve documentation sections
			preg_match("/\/\*\*\*\n(.*)\n\*\*\*\//s", $p->text, $matches); // DEBUG: pattern too simplistic?
			$p->documentation = $matches[1]; // /*** metadata ***/
			// retrieve code
			preg_match("/\/\/\{\{\{\n(.*)\n\/\/\}\}\}|\/\/\/%\n(.*)\n\/\/%\//s", $p->text, $matches); // DEBUG: pattern too simplistic?
			if(isset($matches[2])) {
				$p->code = $matches[2]; // //{{{ code //}}}
			} else {
				$p->code = $matches[1]; // ///% code //%/
			}
			// store plugin
			storePlugin($p, $repo);
		}
	} else {
		addLog("skipped tiddler " . $p->title . " in repository " . $repo->name);
	}
}

/**
* retrieve plugin meta-slices
* @param string $text tiddler text
* @return object
*/
function getSlices($text) {
	$pattern = "/(?:(^[\'\/]{0,2})~?([\.\w]+)\:\\1\s*([^\|\n]+)\s*$)|(?:^\|([\'\/]{0,2})~?([\.\w]+)\:?\\4\|\s*([^\|\n]+)\s*\|$)/sm"; // RegEx origin: TiddlyWiki core, including ticket 672 (http://trac.tiddlywiki.org/ticket/672)
	$slices = new stdClass;
	preg_match_all($pattern, $text, $matches);
	if($matches[0]) {
		for($i = 0; $i < count($matches[0]); $i++) {
			if($matches[2][$i]) // colon notation
				$slices->{$matches[2][$i]} = $matches[3][$i];
			else // table notation
				$slices->{$matches[5][$i]} = $matches[6][$i];
		}
	}
	return $slices;
}

/*
** tiddler integration
*/

/**
* store a plugin in the database (insert or update)
* @param object $tiddler tiddler object
* @param object $repo current repository
* @return null
*/
function storePlugin($tiddler, $repo) {
	$pluginID = pluginExists($tiddler->title, $repo->ID);
	if($pluginID) {
		updatePlugin($tiddler, $pluginID, $repo);
	} else {
		addPlugin($tiddler, $repo);
	}
}

/**
* add a plugin to the database
* @param object $tiddler tiddler object
* @param object $repo current repository
* @return integer plugin ID
*/
function addPlugin($tiddler, $repo) {
	global $dbq;
	addLog("adding plugin " . $tiddler->title . " from repository " . $repo->name);
	// insert plugin
	$data = array(
		ID => null,
		repository_ID => $repo->ID,
		available => true,
		name => $tiddler->title,
		text => $tiddler->text,
		created => convertTiddlyTime($tiddler->created),
		modified => convertTiddlyTime($tiddler->modified),
		modifier => $tiddler->modifier,
		updated => date("Y-m-d H:i:s"),
		documentation => $tiddler->documentation,
		documentation => $tiddler->code,
		views => 0,
		annotation => null
	);
	$pluginID = $dbq->insertRecord("plugins", $data);
	// populate auxiliary tables
	populateAuxiliaryTables($tiddler, $pluginID);
	// return new plugin's ID
	return $pluginID;
}

/**
* update a plugin in the database
* @param object $tiddler tiddler object
* @param integer $pluginID ID of the respective plugin
* @param object $repo current repository
* @return null
*/
function updatePlugin($tiddler, $pluginID, $repo) {
	global $dbq;
	addLog("updating plugin " . $tiddler->title . " in repository " . $repo->name);
	// update plugin
	$selectors = array(
		ID => $pluginID
	);
	$data = array(
		repository_ID => $repo->ID,
		available => true,
		name => $tiddler->title,
		text => $tiddler->text,
		created => convertTiddlyTime($tiddler->created),
		modified => convertTiddlyTime($tiddler->modified),
		modifier => $tiddler->modifier,
		updated => date("Y-m-d H:i:s"),
		documentation => $tiddler->documentation,
		documentation => $tiddler->code
	);
	$dbq->updateRecords("plugins", $data, $selectors, 1);
	// re-populate auxiliary tables
	populateAuxiliaryTables($tiddler, $pluginID);
}

/**
* populate auxiliary tables (tiddler fields, tags, metaslices, keywords)
* @param object $tiddler tiddler object
* @param integer $pluginID ID of the respective plugin
* @return null
*/
function populateAuxiliaryTables($tiddler, $pluginID) {
	insertTiddlerFields($tiddler->fields, $pluginID);
	insertTags($tiddler->tags, $pluginID);
	insertMetaSlices($tiddler->slices, $pluginID);
	insertKeywords($tiddler->keywords, $pluginID);
}

/**
* add a plugin's tiddler fields to the database
* @param array $fields key-value pairs for field name and value
* @param integer $pluginID ID of the respective plugin
* @return null
*/
function insertTiddlerFields($fields, $pluginID) {
	global $dbq;
	while(list($k, $v) = each($fields)) { // DEBUG: why is this an associative array now - supposed to be an object!?
		$data = array(
			plugin_ID => $pluginID,
			name => $k,
			value => $v
		);
		$dbq->insertRecord("tiddlerFields", $data);
	}
}

/**
* add a plugin's slices to the database
* @param array $slices key-value pairs for slice name and value
* @param integer $pluginID ID of the respective plugin
* @return null
*/
function insertMetaSlices($slices, $pluginID) {
	global $dbq;
	while(list($k, $v) = each($slices)) { // DEBUG: why is this an associative array now - supposed to be an object!?
		$data = array(
			plugin_ID => $pluginID,
			name => $k,
			value => $v
		);
		$dbq->insertRecord("metaslices", $data);
	}
}

/**
* add a plugin's tags to the database
* @param array $tags tag names
* @param integer $pluginID ID of the respective plugin
* @return null
*/
function insertTags($tags, $pluginID) {
	global $dbq;
	foreach($tags as $tag) {
		$data = array(
			plugin_ID => $pluginID,
			name => $tag
		);
		$dbq->insertRecord("tags", $data);
	}
}

/**
* add a plugin's keywords to the database
* @param array $keywords keywords
* @param integer $pluginID ID of the respective plugin
* @return null
*/
function insertKeywords($keywords, $pluginID) {
	global $dbq;
	foreach($keywords as $keyword) {
		$data = array(
			plugin_ID => $pluginID,
			name => $keyword
		);
		$dbq->insertRecord("keywords", $data);
	}
}

/**
* check whether a plugin is blacklisted
* @param string $name name of the respective plugin
* @param integer $repoID ID of the respective repository
* @return boolean
*/
function pluginBlacklisted($name, $repoID) {
	global $dbq;
	return false; // DEBUG: to do
}

/**
* check whether a plugin exists in the database
* @param string $name name of the respective plugin
* @param integer $repoID ID of the respective repository
* @return mixed FALSE on failure; plugin ID on success
*/
function pluginExists($name, $repoID) {
	global $dbq;
	$selectors = array(
		repository_ID => $repoID,
		name => $name
	);
	$r = $dbq->retrieveRecords("plugins", array("*"), $selectors);
	if(sizeof($r) > 0) {
		return $r[0]->ID;
	} else {
		return false;
	}
}

?>
