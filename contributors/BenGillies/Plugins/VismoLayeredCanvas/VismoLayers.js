//*************************************************************
//*************************************************************
//** VismoLayers -- Adding layer support to the Vismo Canvas **
//*************************************************************
//*************************************************************


//USAGE --
//The VismoLayeredCanvas object replaces the standard VismoCanvas object
//
//to specify layers whilst creating the VismoLayeredCanvas, 
//pass in either the number of layers as "layers" in the 
//"options" argument or an array of layer names also as 
//"layers" in the options argument.
//
//functions supported are: 
//addLayer(layer)
//hideLayer(layer)
//showLayer(layer)
//raiseLayer(layer)
//lowerLayer(layer)
//
//to specify a layer for a particular shape, pass in the layer 
//number as "layer" in the properties argument of the shape 
//constructor. To modify, use setProperty("layer",x) where x is
//the layer number you want to set to.
//
//
//NB -- the layer stack is zero indexed. So if 3 layers are 
//specified, layers are 0, 1 and 2. These numbers only correspond
//to the initial position and are set whichever order they appear
//in later after calling raise or lower layer. This means that
//if layer 1 is raised, any shapes with layer 1 specified will 
//appear above layer 2. Any further actions on layer 1 will then
//affect the original layer 1 (aka the one now on top, not the one
//now at position 1).
//
//
//PS -- I have defined a VismoCanvas to be equal to VismoLayeredCanvas
//so all current applications should still work if you simply 
//replace VismoClicking.js with VismoLayers.js.


//**************************************
//**********VismoLayerStack*************
//**************************************
//this is the layer stack that appears within
//the VismoLayeredCanvas. Creates a set of 
//layers that are used to determine the 
//render order of shapes
var VismoLayerStack = function(layers)
//layers is the number of layers, or an array consisting of the names of each layer
{
	this.lookup = [];
	this.reverseLookup = [];
	if (typeof(layers) == "number"){
		for(var i=0; i<layers; i++){
			this.addLayer();
		}
	}
	else if ((layers[0])&&(typeof(layers[0]) == "string")){
		for (var i=0; i< layers.length; i++){
			this.addLayer(layers[i]);
		}
	}
};

VismoLayerStack.prototype = {
	addLayer: function(layerName)
	//Add a new layer to the stack. layerName is optional
	{
		var i = this.lookup.length;
		if (layerName){
			this.lookup[i] = {name: layerName, visible: true};
		} else {
			this.lookup[i] = {visible: true};
		}
		this.reverseLookup[i] = i;
	},
	getLayer: function(layer)
	//takes in a layer as string (layer name) or integer and returns the layer object
	{ 
		var myLayer = this.getLayerIndex(layer);
		return this.lookup[myLayer];
	},
	getLayerIndex:function(layer)
	//takes in the layer name or number and returns the index in the layer stack
	{
		if (typeof(layer) == "string"){
			for (var i=0; i<this.lookup.length; i++){
				if (this.lookup[i].name == layer){
					return i;
				} else {
					continue;
				}
			}
		} else {
			return layer;
		}
	},
	getLayerPosition: function(layer)
	//takes in the layer name or number and returns the position that layer will be rendered in
	{
		var layerIndex = this.getLayerIndex(layer);
		
		for (var i=0; i< this.reverseLookup.length; i++){
			if (layerIndex == this.reverseLookup[i]){
				return i;
			}
		}
		
		return 0;
	},
	hideLayer:function(layer)
	//hides the layer specified so that it will not show up next time renered
	{
		this.getLayer(layer).visible = false;
	},
	showLayer:function(layer)
	//show a previously hidden layer so that it shows up next time rendered
	{
		this.getLayer(layer).visible = true;
	},
	raiseLayer:function(layer)
	//pomote a layer so that it appears closer to the top
	{
		currIndexOfLayer = this.getLayerPosition(layer);
		if (currIndexOfLayer == this.reverseLookup.length-1){
			return; //layer is already on top
		} else {
			var switchB = this.reverseLookup[currIndexOfLayer];
			this.reverseLookup[currIndexOfLayer] = this.reverseLookup[currIndexOfLayer+1];
			this.reverseLookup[currIndexOfLayer+1] = switchB;
		}
	},
	lowerLayer:function(layer)
	//demote a layer so that it appears closer to the bottom
	{
		currIndexOfLayer = this.getLayerPosition(layer);
		if (currIndexOfLayer == 0){
			return; //layer is already on the bottom
		} else {
			var switchB = this.reverseLookup[currIndexOfLayer];
			this.reverseLookup[currIndexOfLayer] = this.reverseLookup[currIndexOfLayer-1];
			this.reverseLookup[currIndexOfLayer-1] = switchB;
		}
	},
};


//*************************************************
//***************VismoLayeredCanvas****************
//*************************************************
//This is a version of the standard VismoCanvas that
//supports layers as well. Pass in a "layers" option
//within "options" to use layers. Don't, and everything
//will work as if no layers were present (i.e. - there
//will only be one layer)
var VismoLayeredCanvas = function(element,options){
    this.className = "VismoCanvas";
    if(!options) options = {};
	if(typeof element == 'string') element= document.getElementById(element);
	if(!element) throw "Element doesn't exist!";
	if(element.vismoClicking) {
		var update = element.vismoClicking;
		return update;
	}
	var wrapper = element;
	var canvas = document.createElement('canvas');
	canvas.width = parseInt(wrapper.style.width);
	canvas.height = parseInt(wrapper.style.height);
	if(!element.className)element.className = "VismoCanvas";
	jQuery(canvas).css({width:wrapper.style.width, height:wrapper.style.height,'z-index':1,position:'absolute'});        
	element.appendChild(canvas);
	var labels =  document.createElement("div");
        jQuery(labels).css({position:"absolute","z-index":9});      
        labels.className = "VismoLabels";
        wrapper.appendChild(labels);
        this.labelHolder = labels;
        this.labels = [];
	this.canvas = canvas;
	this.settings = {};
	this.settings.browser = !VismoUtils.browser.isIE ? 'good' : 'ie'
	this.settings.globalAlpha = 1;
	this.memory = [];
	element.vismoClicking = this;

	if(options.shapes) {
		for(var i=0; i < options.shapes.length; i++){
			this.add(options.shapes[i]);
		}
	}
	this.wrapper = wrapper;

	this._setupMouse();
/*
	if(options.panzoom){
	    new VismoController(this,this.getDomElement());
	}*/
	this.setOnMouse(options.mousedown,options.mouseup,options.move,options.dblclick,options.keypress);
	
	if (!options.layers){
		options.layers = 1;
	}
	this.myLayers = new VismoLayerStack(options.layers);

};


VismoLayeredCanvas.prototype = {
	getDomElement: function(){
		return this.wrapper;
	}
	,addTooltip: function(addContent){
	        if(addContent) this.tooltipAddContent = addContent;
	        if(!this.tooltip){
	                var tooltip =  document.createElement("div");
                        jQuery(tooltip).css({position:"absolute","z-index":10,display:"none"});      
                        tooltip.className = "VismoTooltip";
                        this.wrapper.appendChild(tooltip);
                        this.tooltip = tooltip;
        		                       
                }
                if(!this.tooltipAdded){
                        var move= this.onmousemove;
                        var that = this;
                        var lastshape;
        		var newmove = function(e,shape){
        		        if(!e) e = window.event;
        		        if(!that.tooltip) return;     
                                jQuery(that.tooltip).html("");
                                if(shape && lastshape != shape){
                                       
                           	        var pos = VismoClickingUtils.getMouseFromEvent(e);
                		        jQuery(that.tooltip).css({top:pos.y, left:pos.x});             
                                }
        		        if(that.tooltipAddContent && shape){
        		                that.tooltipAddContent(that.tooltip,shape);
        		                lastshape = shape;
        		                jQuery(that.tooltip).css({display:""});
        		        }
        		        else{
     		                  jQuery(that.tooltip).css({display:"none"});
        		        }     
        		        if(move)move(e,shape);
        		        
        		};
        		this.onmousemove = newmove;
                        this.tooltipAdded = true;
                }
	}
	,getXYWindow: function(e){
	       var t = this.getTransformation();
	       var pos = this.getXY(e);
	       return  VismoTransformations.applyTransformation(pos.x,pos.y,t);
	}
	,getXY: function(e){
		return VismoTransformations.getXY(e,this.getTransformation());
	}
	,setOnMouse: function(down,up,move,dblclick,keypress){
		if(down)this.onmousedown = down;
		if(up)this.onmouseup = up;
		if(move)this.onmousemove=  move;
		if(dblclick) this.ondblclick = dblclick;
		if(keypress) this.onkeypress = keypress;
		
		if(this.madeMoveable) this.makeMoveable();
		if(this.tooltipAdded) this.addTooltip();
	}
	,_setupMouse: function(){
		var that = this;
		/*this.onmousedown = function(e,s,pos){};
		this.onmouseup = function(e,s,pos){};
		this.onmousemove = function(e,s,pos){};
		this.ondblclick = function(e,s,pos){};
		this.onkeypress = function(e){};
		*/

		this._applyMouseBehaviours(this.wrapper);
		for(var i =0; i < this.wrapper.childNodes.length; i++){
			var child = this.wrapper.childNodes[i];
			//this._applyMouseBehaviours(child);
		}
	
	}
	,_applyMouseBehaviours: function(el){
	        var that = this;
		var newbehaviour = function(e){
				var t = VismoClickingUtils.resolveTargetWithVismo(e);
                                
				if(t && t.getAttribute("class") == 'vismoControl') return false;
				var shape = that.getShapeAtClick(e);
				return shape;
			
		};
	
		
		var down = el.onmousedown;
		var up = el.onmouseup;
		var mv = el.onmousemove;
		var dblclick =el.ondblclick;
		this.initialKeyPress = window.onkeypress;
		el.oncontextmenu=function() {  return false}; 		
		el.onmouseover = function(e){
		        
				if(!that.keypressactive) {
				        
					that.keypressactive =  true;
					window.onkeypress = that.onkeypress;
					document.onkeypress = function(e){if(!e) e= window.event;if(that.initialKeyPress)that.initialKeyPress(e);if(!e) e= window.event;var s = newbehaviour(e); 
					        if(that.onkeypress)that.onkeypress(e,s)
					};
				}
		};
		el.onmouseout = function(e){if(!e) e= window.event;that.keypressactive = false;};

		el.onmousedown = function(e){
			if(!e) e= window.event;
			if(e.preventDefault)e.preventDefault(e);
			var s = newbehaviour(e); 
			if(s){
				if(s.getProperty("onmousedown")){
				        s.getProperty("onmousedown")(e,s);		
				}else { 
				        if(that.onmousedown)that.onmousedown(e,s);
			        }
			}
			else {
			        //if(that.onmousedown)that.onmousedown(e,s);
			        if(down)down(e,s);
			}
			

			return false;
		};

        	el.ondblclick = function(e){
			if(!e) e= window.event;
			var s = newbehaviour(e); 				
			if(s) {
		
				if(s.getProperty("ondblclick")){
				        s.getProperty("ondblclick")(e,s);
				}
				else if(that.ondblclick){
        			        that.ondblclick(e,s);
        			}
        			else{
        	       
        			
        			}
			}
			else {
				if(that.ondblclick){
        			        that.ondblclick(e,s);
        			}
				if(dblclick){
				        dblclick(e,s);
                                }
			}
		};
                	el.onmouseup = function(e){ if(!e) e= window.event;var s = newbehaviour(e); 
		        if(s){
		                if(s.getProperty("onmouseup")){
		                        s.getProperty("onmouseup")(e,s);
		                }
		                else {
		                        if(that.onmouseup)that.onmouseup(e,s);
		                }
		        }
		        else{
		                if(up)up(e,s);
		        }
		};
		var defaultCursor;
		el.onmousemove = function(e){ if(!e) e= window.event;var s = newbehaviour(e);

		        if(!VismoUtils.browser.isIE){
		                if(jQuery(el).hasClass("overVismoShape")) jQuery(el).removeClass("overVismoShape");
		        }
		        if(!VismoUtils.browser.isIE){
		                
		                if(jQuery(el).hasClass("overVismoPoint"))jQuery(el).removeClass("overVismoPoint");
		        }
		        
		        if(s && !s.getProperty("unclickable")){
		  

        		        if(that.ondblclick || that.onmousedown || that.onmouseup) {
        		                var sh;
                		        if(s){
                		               sh  = s.getShape();
                		               if(!VismoUtils.browser.isIE  &&sh == "point") jQuery(el).addClass("overVismoPoint");
                		        }
        		                if(!VismoUtils.browser.isIE)jQuery(el).addClass("overVismoShape");
        	                }
                                
		                if(s.getProperty("onmousemove"))s.getProperty("onmousemove")(e,s);
		        }
		        else{
		                //el.style.cursor = defaultCursor;
		        }
		        if(that.onmousemove)that.onmousemove(e,s); 
		        if(mv)mv(e,s);
		};       	

	}
	,getDimensions: function(){
		return {width: parseInt(this.canvas.style.width), height: parseInt(this.canvas.style.height)};
	}
	,resize: function(width,height){
		
		if(this.canvas.getAttribute("width")){
			this.canvas.width = width;
			this.canvas.height = height;
		}
		jQuery(this.wrapper).css({height:height,width:width});
		jQuery(this.canvas).css({height:height,width:width});
	}
	,setTransparency: function(alpha){	
		this.settings.globalAlpha = alpha
	}
	,_setupCanvasEnvironment: function(){
		if(VismoUtils.browser.isIE) return;
		var ctx = this.canvas.getContext('2d');
		var s =this.getTransformation().scale;
		if(s && s.x)ctx.lineWidth = (0.5 / s.x);
		ctx.globalAlpha = this.settings.globalAlpha;
		ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		ctx.lineJoin = 'round'; //miter or bevel or round	
	}
	,clear: function(deleteMemory){
		if(deleteMemory){
			this.clearMemory();
		}
		this._maxX = 0;
		this._maxY = 0;

		
		if(!this.canvas.getContext) {
			return;
		}
		var ctx = this.canvas.getContext('2d');
		ctx.clearRect(0,0,this.canvas.width,this.canvas.height);		
		
	}
	
	,render: function(projection){
		this._setupCanvasEnvironment();
		
		var that = this;
		var transformation = this.getTransformation();
	
		if(transformation.scale.x) sc = transformation.scale.x; else sc = 1;
		//determine point size
		var ps = 5 / parseFloat(sc);
		var smallest = 1 / this._iemultiplier;
		var largest = 2.5 * sc;
		if(ps < smallest) ps = smallest;
		if(ps > largest) ps = largest;	
			
			var newfragment = document.createDocumentFragment();
			var mem =that.getMemory();
			if(mem.length > 0){
				
				var tran;
				if(that.settings.browser == 'good'){
				
					var ctx = that.canvas.getContext('2d');
					ctx.save();
					tran = false;

					if(transformation){
						
						var o = transformation.origin;
						var tr = transformation.translate;
						var s = transformation.scale;
						var r = transformation.rotate;
						if(o && s && tr){
							ctx.translate(o.x,o.y);
							ctx.scale(s.x,s.y);
							ctx.translate(tr.x,tr.y);
						}
						if(r && r.x)ctx.rotate(r.x);
					}
					
				}
				else{
					tran = transformation;
				}
				
				//initialise the buffer
				var buf = [];
				for (var i=0;i<this.myLayers.lookup.length; i++){
					buf[i] = [];
				}

				//push each object into the correct layer ready for rendering
				for (var j=0; j<mem.length; j++){
					if (mem[j].getProperty("layer")) {
						if (mem[j].getProperty("layer") < this.myLayers.lookup.length){//if it's a valid layer
							if (this.myLayers.lookup[mem[j].getProperty("layer")].visible) {//if layer is on
								buf[this.myLayers.reverseLookup[mem[j].getProperty("layer")]].push(mem[j]);
							}
						}
					} else {
						buf[0].push(mem[j]);
					}
				}

				//render the buffer
				for (var k=0; k < buf.length; k++){
					for (var l=0; l < buf[k].length; l++){
						var st = buf[k][l].getShape();
					 	if(buf[k][l].optimise(that.canvas,transformation,projection)){
					 		if(st == 'domElement')
								tran = transformation;
							buf[k][l].render(that.canvas,tran,projection,true,that.settings.browser,ps);

							if(buf[k][l].vmlfill && that.settings.globalAlpha) {
								buf[k][l].vmlfill.opacity =that.settings.globalAlpha;
							}
						}
					}
				}
				
				/*var place =that.canvas; 
		 	        if(that.settings.browser == 'ie') {
		 	                place = document.createElement("div");
		 	                var c =jQuery(that.canvas);
		 	                jQuery(place).css({width:c.width(),height:c.height()});
		 	        }*/
				 /*for(var i=0; i < mem.length; i++){
				         var st = mem[i].getShape();
				 	if(mem[i].optimise(that.canvas,transformation,projection)){
				 	        if(st == 'domElement')tran = transformation;
						mem[i].render(place,tran,projection,true,that.settings.browser,ps);
					        
						if(mem[i].vmlfill && that.settings.globalAlpha) {
							mem[i].vmlfill.opacity =that.settings.globalAlpha;
						}
					}

				
				}*/
		 	        //if(that.settings.browser == 'ie') jQuery(that.canvas).append(jQuery(place).children());
				/*	
				if(!that.settings.browser == 'ie'){
					that._fragment= newfragment.cloneNode(true);
					that.canvas.appendChild(that._fragment);
				}*/
			}
			if(ctx)ctx.restore();
			
	//	};f();
	}
	,getTransformation: function(){
		if(!this.transformation) {
		var ox = parseInt(this.canvas.style.width);
		var oy = parseInt(this.canvas.style.height);
		this.transformation = {scale:{x:1,y:1},translate:{x:0,y:0},origin:{x: ox/2, y: oy/2}};
		//this.transformation = VismoTransformation.getBlankTransformation(this.canvas);
		}
		return this.transformation;
	}
	
	,setTransformation: function(transformation){
	        if(!transformation.origin){
	                transformation.origin = {};
	                transformation.origin.x = jQuery(this.wrapper).width() / 2;
	                transformation.origin.y = jQuery(this.wrapper).height() / 2;
	        }
	      
		if(transformation) this.transformation = transformation;	
	}

	,remove: function(vismoShape){
	       var shapes = this.getMemory();
	       
	     
	       for(var i=0; i < shapes.length; i++){
	            if(shapes[i] == vismoShape){
	                this.memory.splice(i,1);
	            }
	       }
	}
	,add: function(vismoShape){
		if(!this.memory) this.memory = [];
		if(!vismoShape.getProperty("id"))vismoShape.setProperty("id",this.memory.length);
		this.memory.push(vismoShape);
		vismoShape._vismoClickingID = this.memory.length;

		return vismoShape;
	}
	,addLabel:function(domElement,x,y){
	        
	        this.labelHolder.appendChild(domElement);
	        var properties = {element: domElement,shape:"domElement"};
	  
	        var coords = [];
	        coords.push(x);
	        coords.push(y);
	        var shape = new VismoShape(properties,coords);
	        this.add(shape);
	              //console.log(shape);
	        return {element: domElement ,vismoshape: shape};
	}
	,transform: function(t){
		this.setTransformation(t);
		this.render();
	}
	,clearMemory: function(){
		for(var i=0; i < this.memory.length; i++){
			if(this.memory[i].vml){
				this.memory[i].vml.parentNode.removeChild(this.memory[i].vml);
			}
		}
		this.memory = [];

	},
	getMemory: function(){
		return this.memory;
	}
	,getMemoryID: function(vismoShape){
		if(vismoShape && vismoShape._vismoClickingID)
			return vismoShape._vismoClickingID;
		else{
			return false;
		}
	}
	,getShapeWithID: function(id){
	    var mem = this.getMemory();
	    for(var i=0; i < mem.length; i++){
	        if(mem[i].getProperty("id") == id) {
	            return mem[i];
	        }
	    }
	    return false;
	}
	,getShapeAtClick: function(e){
		if(!e) {
			e = window.event;
		}
	
		var node = VismoClickingUtils.resolveTarget(e);
		//alert(node.tagName);
		if(node.tagName.toUpperCase() == 'SHAPE') { //vml vismoShape
			return node.vismoShape;
		}
		var target = VismoClickingUtils.resolveTargetWithVismo(e);
	
		if(!target) return;
		var offset = jQuery(target).offset();

                var xy= VismoClickingUtils.scrollXY();
		x = e.clientX + xy.x - offset.left;
		y = e.clientY + xy.y - offset.top;

		if(this.memory.length > 0){
			var shape = false;
			if(target.vismoClicking){
			shape = target.vismoClicking.getShapeAtPosition(x,y);
			}
			return shape;
		} else{
			return false;
		}
	},
	getShapeAtPosition: function(x,y) {
		var shapes = this.memory;
		if(this.transformation){
			var pos =  VismoClickingUtils.undotransformation(x,y,this.transformation);
			x = pos.x;
			y = pos.y;
		
		}
		var hitShapes = [];
		for(var i=0; i < shapes.length; i++){
			var shape = shapes[i];
			if(!shape.getProperty("unclickable"))
	                {		
	                        var st = shape.getShape();
				var g = shape.getBoundingBox();
				
				if(x >= g.x1 && x <= g.x2 && y >=  g.y1 && y <=g.y2){
					hitShapes.push(shapes[i]);
				}
			}

		}

		if(hitShapes.length > 1){
		        var res = this._findNeedleInHaystack(x,y,hitShapes);
			return res;
		
		}
	        else return hitShapes[0];
	
		// var shapesInsideBox = _findShapesInsideBoundingBox(shapes, ..) TODO RENAME
		// var points = _findPointsInsideShapes(..)
		

	},
	_findNeedleInHaystack: function(x,y,shapes){
		var hits = [];
		for(var i=0; i < shapes.length; i++){
			var st = shapes[i].getShape();
			var itsahit = false;
			if(st == 'polygon'){
				itsahit = this._inPoly(x,y,shapes[i]);
			}
			else if(st == 'path'){
			    itsahit = this._onPath(x,y,shapes[i]);
			}
			else if(st == 'image'){
				itsahit = true;
			}
			else if(st == 'point' || st == 'circle'){
				itsahit = this._inCircle(x,y,shapes[i]);
			}
			if(itsahit) {
				hits.push(shapes[i]);
			}
			
		}

		if(hits.length == 0){
			return null;
		}
		else if(hits.length == 1) 
			return hits[0];
		else {//the click is in a polygon which is inside another polygon
			var g = hits[0].getBoundingBox();
			var mindist = Math.min(g.x2 - x,x - g.x1,g.y2 - y,y - g.y1);
		
			var closerEdge = {id:0, closeness:mindist};
			for(var i=1; i < hits.length; i++){
				var g = hits[i].getBoundingBox();
				var mindist = Math.min(g.x2 - x,x - g.x1,g.y2 - y,y - g.y1);
			
				if(closerEdge.closeness > mindist) {
					closerEdge.id = i; closerEdge.closeness = mindist;
				}
				
			}
			return hits[closerEdge.id];
		
		}

	}
	,_inCircle: function(x,y,vismoShape){
		var bb = vismoShape.getBoundingBox();
                var transform =vismoShape.getTransformation();
                
		var a =((x - bb.center.x)*(x - bb.center.x)) + ((y - bb.center.y)*(y - bb.center.y));
		var b = vismoShape.getRadius();
		
		if(transform && transform.scale) b *= transform.scale.x;
		b *= b;
		if (a <= b) return true;
		else return false;
	
	}
	,_onPath: function(x,y,vismoShape){
	    var c = vismoShape.getCoordinates();
	    x = parseInt(x);
	    y = parseInt(y);
	    var tolerance =2;
	    for(var i=0; i < c.length; i++){
	        if(!VismoShapeUtils._isCoordinate(c[i])) i +=1;
	        var sx = parseInt(c[i]);
	        var sy = parseInt(c[i+1]);
	        
	        //check to see if sx and sy are on the line between 2 points
	        if(sx > x- tolerance && sx < x + tolerance){ //matches on the x
	            
	        }
	    }
	    return false;
	}
	,_inPoly: function(x,y,vismoShape) {
		/* _inPoly adapted from inpoly.c
		Copyright (c) 1995-1996 Galacticomm, Inc.  Freeware source code.
		http://www.visibone.com/inpoly/inpoly.c.txt */
		var coords;
		coords = vismoShape.getCoordinates();
		var transform = vismoShape.getTransformation();
		
		if(transform){
		        var newpos = VismoTransformations.applyTransformation(x,y,transform);
		        x = newpos.x;
		        y = newpos.y;
		}
		
		var npoints = coords.length;
		if (npoints/2 < 3) {
			//points don't describe a polygon
			return false;
		}
		var inside = false;
		var xold = coords[npoints-2];
		var yold = coords[npoints-1];
		var x1,x2,y1,y2,xnew,ynew;
		for (var i=0; i<npoints; i+=2) {
			xnew=coords[i];
			ynew=coords[i+1];
			if (xnew > xold) {
				x1=xold;
				x2=xnew;
				y1=yold;
				y2=ynew;
			} else {
				x1=xnew;
				x2=xold;
				y1=ynew;
				y2=yold;
			}
			if ((xnew < x) == (x <= xold)
				&& (y-y1)*(x2-x1) < (y2-y1)*(x-x1)) {
				   inside=!inside;
				}
			xold=xnew;
			yold=ynew;
		 }
		 return inside;
	}
    ,makeMoveable: function(oncompletemove,unmoveable){
               if(!unmoveable)unmoveable = [];
               if(this.madeMoveable) return;
               if(oncompletemove)this.oncompletemove = oncompletemove;
               this.madeMoveable = true;
	var down = this.onmousedown;
	var up = this.onmouseup;
	var move= this.onmousemove;

                
               var el = this.getDomElement();
               var clickablecanvas = this;
 		var selectedshape = false,beginmoving = false,curpos;
 		this.selectedShapes = [selectedshape];
	var beginmoving = false;
	var checkformouseup= function(){
		if(!selectedshape) return;
		if(selectedshape.getShape() != 'circle') return;
		beginmoving = true;
		el.style.cursor = 'move';

	};

	var cancel = function(){
		if(el.vismoController)el.vismoController.enable();
		//autoSaveChanges();
		if(clickablecanvas.oncompletemove){
		        clickablecanvas.oncompletemove(selectedshape);
		        beginmoving = false;selectedshape = false;
                       }
	};
	var oldclick = el.onclick;
	el.onclick = function(e){cancel();if(oldclick)oldclick(e);};
	var moveit = function(){
		var pos = curpos;
		if(selectedshape){
		        el.style.cursor = 'move';
			s = selectedshape;
			s.setCoordinates([pos.x,pos.y,s.getRadius()]); 
			clickablecanvas.render();
			/*
			var x = pos.x/ img.width;
				var y = pos.y / img.height;
			var tid = store.getTiddler(s.getProperty("id"));
			tid.fields.tagx = x+"";
			tid.fields.tagy = y+"";*/

		}
	};
	var movethoseshapes = function(e,s,pos){
		if(!beginmoving) {return true;}

		curpos = VismoTransformations.undoTransformation(pos.x,pos.y,clickablecanvas.getTransformation());
		window.setTimeout(moveit,10);
		return false;
	};


	var onmousemove = function(e,s){
		var pos = VismoClickingUtils.getMouseFromEvent(e);
		var cont = movethoseshapes(e,s,pos);
		if(!cont) return;
	};

	var onmousedown = function(e,s){			if(el.vismoController)el.vismoController.disable(); beginmoving = false;selectedshape = s; if(s.getShape() != 'circle') cancel(); window.setTimeout(checkformouseup,200); };
	var onmouseup = function(e,s){cancel(); window.setTimeout(cancel,200);};

               var result = {};
               this.onmouseup = function(e,s){onmouseup(e,s);if(up)up(e,s);};
               this.onmousedown = function(e,s){onmousedown(e,s);if(down)down(e,s);};
               this.onmousemove = function(e,s){
                       if(move)move(e,s);
                       if(unmoveable.contains(s)) return;
                       onmousemove(e,s);
                       var showitsmoveable = function(){
                               el.style.cursor = 'move';
                       };
                       window.setTimeout(showitsmoveable,1000);
               };
              
	}
	,hideLayer:function(layer){
		this.myLayers.hideLayer(layer);
		this.render();
	}
	,showLayer:function(layer){
		this.myLayer.showLayer(layer);
		this.render();
	}
	,raiseLayer:function(layer){
		this.myLayer.raiseLayer(layer);
		this.render();
	}
	,lowerLayer:function(layer){
		this.myLayer.lowerLayer(layer);
		this.render();
	}
	,addLayer:function(layer){
		this.myLayer.addLayer(layer);
	}
};

var VismoCanvas = VismoLayeredCanvas;
