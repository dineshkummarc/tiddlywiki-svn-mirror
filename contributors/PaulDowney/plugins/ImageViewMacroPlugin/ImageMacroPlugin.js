/***
|''Name''|ImageMacroPlugin|
|''Description''|Allows the rendering of svg images in a TiddlyWiki|
|''Author''|Osmosoft|
|''License''|[[BSD|http://www.opensource.org/licenses/bsd-license.php]]|
|''Notes''|Currently only works in modern browsers (not IE)|
!Code
***/
/*{{{*/
config.macros.image = {
    _fixPrefix: 1
    ,generateIdPrefix: function(){
        return "$tw_svgfix_" + (this._fixPrefix++).toString() + "_";
    }
    ,fixSVG: function(childNodes,idPrefix) {
        if(!idPrefix)idPrefix = this.generateIdPrefix();
        var urlPattern = /^\s*url\(\#([^\)]*)\)\s*$/ig;
        var fixes = [
        {attr: "id", namespace: "", pattern: /^(.*)$/ig},
        {attr: "fill", namespace: "", pattern: urlPattern},
        {attr: "stroke", namespace: "", pattern: urlPattern},
        {attr: "href", namespace: "http://www.w3.org/1999/xlink", pattern: /^#(.*)$/ig}
        ];
        for(var t=0; t<childNodes.length; t++) {
          var node = childNodes[t];
          for(var a=0; a<fixes.length; a++) {
            var fix = fixes[a];
            if(node.hasAttributeNS && node.hasAttributeNS(fix.namespace,fix.attr)) {
              var v = node.getAttributeNS(fix.namespace,fix.attr);
              fix.pattern.lastIndex = 0;
              var match = fix.pattern.exec(v);
              if(match) {
                var replacement = (idPrefix + match[1]).replace("$","$$$$"); // Make sure replacement string doesn't contain any single dollar signs
                v = v.replace(match[1],replacement);
                node.setAttributeNS(fix.namespace,fix.attr,v);
              }
            }
          }
          var children = node.childNodes;
          if(children.length > 0)
             this.fixSVG(children,idPrefix);
        }
    }
    ,importSVG: function(place,options){
      if(!options)options = {};
      var tiddlerText =options.tiddler.text;
      var svgDoc;
      if (window.DOMParser){
        svgDoc = new DOMParser().parseFromString(tiddlerText, "application/xml").documentElement;
        if(options.fix){
            this.fixSVG(svgDoc.childNodes);
        }
        var el;
        el = jQuery(document.importNode(svgDoc, true))[0];
        if(options.width)el.setAttribute("width",options.width);
        if(options.height)el.setAttribute("height",options.height);
        if(options.transform)el.setAttribute("viewbox",options.transform);
        jQuery(place).append(el);
      }
      else{ //IE
        //do some ie magic
        var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async="false";
        xmlDoc.loadXML(tiddlerText);
        svgDoc = xmlDoc.documentElement;
      }
    }
    ,handler: function(place, macroName, params){
        var img;
        var tiddler = store.getTiddler(params[0]);
        var width = params[1];
        var height = params[2];
        var transform = params[3];
        if(!tiddler)return;
        //do some type checking
        var options = {tiddler:tiddler,fix:true,width:width,height:height,transform:transform};
        this.importSVG(place,options);
    }
}

/*}}}*/
