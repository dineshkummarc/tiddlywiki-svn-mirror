/***
|''Name''|TiddlyTagMindMap|
|''Description''|Bring your tiddlers to life in a radial graph which displays all your tiddlywiki tiddlers and the relationships between them. (A bit like The Brain)|
|''Author''|Jon Robson|
|''Contributors''|Nicolas Garcia Belmonte|
|''Version''|1.5 is the next release|
|''Date''|Nov 2008|
|''Status''|@@experimental@@;|
|''License''|BSD|
|''CoreVersion''|<...>|
|''Documentation''|<...>|
|''Keywords''|data visualisation, mindmap, The Brain, Mind Manager, FreeMind,tag relationships,graph|
!Description
Bring your TiddlyWiki to life!
!Notes
To install you will need to paste a line of text into your Theme {{{ <div id="tagmindmap"></div>}}} in the location where you would like to see the visualisation.

Currently we are unable to support this working in internet explorer.. we are working on it however.. sorry! :(
!Usage
{{{
The tagmindmap can be created from a macro call using <<tiddlytagmindmap //params//>>
alternatively paste <div id='tagmindmap'></div> into your page template.

The following macros may be useful however they can be included in the toolbar settings of the tiddlytagmindmap macro.
<<ToggleTagMindMap>> (toggle graph on/off)
<<LoadMindMap>> (load all nodes into mind map)
<<ZoomMindMapIn>> (zoom into the map (expand the structure as if it was a balloon))
<<ZoomMindMapOut>> (zoom out of the map (let air out of the structure as if it was a balloon))

There are a variety of configuration options in the backstage area under tweak. They all begin with TiddlyTagMindMapPlugin: 
}}}
!!Parameters
tiddlytagmindmap takes several (but all optional) parameters. Some examples can be seen below, note the order is irrelevant of these parameters.

!!!Nodes

!!!!Name Length
nodeNameLength:x where x is an integer will shorten the name of any node with a name longer than x. If x =0, the labels will disappear so you can rely on tooltips.

!!!!Variable node sizes (tagcloud)
notagcloud:true as a parameter will flatten the nodes to have the same size font

!!!Dimensions
{{{<<tiddlytagmindmap height:100 width:100>>}}} will set a tiddlytagmindmap with height and width 100.

!!!Zooming
A parameter zoom allows you to specify an integer representing the initial inflation of the mind map. The smaller it is - the closer the nodes will be together.
{{{<<tiddlytagmindmap zoom:1000>>}}} will give you a very inflated TagMindMap!

!!!The toolbar
A parameter toolbar is a string of 1s. These signify the buttons. The first digit sets whether the bar should appear vertically or horizontally.
The following digits turn off or on the other available buttons.
!!!!The buttons
The digits preceding the first digit represent these buttons in this order..
toggle, loadall,zoom+,zoom-,re-center (re-center after panning the map)

{{{<<tiddlytagmindmap toolbar:11010>>}}} would give you a vertical toolbar with toggle and load buttons but no zoom and no re-center buttons.

!!!The Start State
A parameter can be used to specify how the map looks on start up. 
Currently the options are empty OR all OR a custom executable javascript function.
The first two options are simple strings eg.
{{{<<tiddlytagmindmap startState:empty>>}}} loads a blank tag mind map however {{{<<tiddlytagmindmap startState:all>>}}} loads all nodes excluding those in the exclude List.
the latter is more interesting. Have a look at [[Example 2]]!
!Revision History
1.4 11/08 tag cloud integration/multiple tag mind maps/ability to call from macro
1.3 22/10/08 working with ie/packaged up code

!To Do
*Ability to add arrow heads to show direction
*Ability to define function for relative sizing
*Ability to set meta-data specific to nodes within a tiddler in optional fields see http://TiddlyWiki.abego-software.de/#PartTiddlerPlugin (eg. colouring of children/parents/images in node label)
*rss hooks - specify where tags and node names come from in feed
*ability to specify what click function is/ turn off click function
*allow resizing
*node repositioning and saving of state
*better css support
*performance issues
*deleting edges as tiddlers are deleted
*adapt to parabolic tree mode and other visualisation types
*update to new version of RGraph (JIT)
*Self-defined click functions
*Continued code cleanup
*define a colour of the breadcrumb trail - make it change colour each click (increment colour, so you can get an idea of path you took to get somewhere)
*add pins to locations in the mind map to jump back to (definable in meta data long term, also short term in tiddler edit menu)
!Code
***/
