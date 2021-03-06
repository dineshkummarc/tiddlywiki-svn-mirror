/***
|Name|ZonePlugin|
|Description|Partition a single-page-plugin-powered tiddlywiki into zones|
|Source|http://tiddlyguv.org/ZonePlugin.html#ZonePlugin|
|Documentation|http://tiddlyguv.org/ZonePlugin.html#ZonePluginInfo|
|Version|0.1|
|Author|Michael Mahemoff, Osmosoft|
|''License:''|[[BSD open source license]]|
|~CoreVersion|2.2|
***/

/*******************************************************************************
* Initialisation and hijacking
*******************************************************************************/

var latestTiddler = null;
var zonePlugin = {};
var zonesByTag = {};

zonePlugin.origRestart = restart;
window.restart = function() {
  zonePlugin.origRestart();
  buildZonesMap(); // TODO call on refresh
  startZone();
}

zonePlugin.origDisplayTiddler = Story.prototype.displayTiddler;
Story.prototype.displayTiddler = function(dontCare, tiddler, etc, etc) {
  zonePlugin.origDisplayTiddler.apply(this, arguments);
  startZone();
  // config.options.txtTheme = "MusicTheme";
  // refreshDisplay();
  // story.switchTheme("MusicTheme");
}

/*******************************************************************************
* Zone plugin functions
*******************************************************************************/

function startZone() {
  var tiddler = getFirstTiddlerInStory();
  if (!tiddler) return;
  var zone = findZone(tiddler);
  log("find zone for tiddler", tiddler, "was", zone, "from zones by tag", zonesByTag);
  window.eval(store.getRecursiveTiddlerText(zone+"ZoneInit", "", 10));
  setStylesheet(store.getRecursiveTiddlerText(zone+"ZoneStylesheet", "", 10));

  // subtitle = (store.getTiddler(zone+"ZoneSiteSubtitle")) ? store.getRecursiveTiddlerText(zone+"ZoneSiteSubtitle") : defaultSubtitle;
  // store.saveTiddler("SiteSubtitle" , "SiteSubtitle", subtitle,null,null,"",{});
}

function buildZonesMap() {
  var zonesTiddler = store.getTiddler("Zones");
  var zoneSlices = store.calcAllSlices("Zones");
  for (var zone in zoneSlices) {
    var tags = zoneSlices[zone].split(",");
    for (var i=0; i<tags.length; i++) {
      var tag = trim(tags[i]);
      zonesByTag[tag] = zone;
    }
  }
}

function findZone(tiddler) {
  for (var i=0; i<tiddler.tags.length; i++) {
    var tag = tiddler.tags[i];
    if (zonesByTag[tag]) return zonesByTag[tag];
  }
}

/*******************************************************************************
* TiddlyWiki Generic
*******************************************************************************/

function getFirstTiddlerInStory() {
  var currentTiddlerEl = story.getContainer().firstChild;
  if (currentTiddlerEl) {
    var currentTiddlerTitle = currentTiddlerEl.getAttribute("tiddler");
    return store.getTiddler(currentTiddlerTitle);
  }
}

/*******************************************************************************
* Generic
*******************************************************************************/

function trim(s) { return s.replace(/^\s+|\s+$/g,""); }
function log() { if (console) console.log.apply(null, arguments); }
