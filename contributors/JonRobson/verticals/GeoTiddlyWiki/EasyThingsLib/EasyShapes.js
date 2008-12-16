


var EasyShape = function(properties,coordinates,geojson){
	this.grid = {};
	this.coords = [];
	if(geojson){
		this._constructFromGeoJSONObject(properties,coordinates);
	}
	else{
		this._constructBasicShape(properties,coordinates);
	}

	this._calculateBounds();

	this._iemultiplier = 100;
};
EasyShape.prototype={
	_calculateBounds: function(coords){
		if(this.properties.shape == 'path'){
			this.grid = {x1:0,x2:1,y1:0,y2:1};
			return;
		}
		if(!coords) coords = this.coords;
		this.grid.x1 = coords[0];
		this.grid.y1 = coords[1];
		this.grid.x2 = coords[0];
		this.grid.y2 = coords[1];
		
		this._deltas = []
		var d = this._deltas;

		var lastX, lastY;
		var index = 0;
	
		lastX = coords[0];
		lastY = coords[1];
		for(var i=0; i < coords.length-1; i+=2){
			var xPos = parseFloat(coords[i]); //long
			var yPos = parseFloat(coords[i+1]); //lat
			var deltax =xPos - lastX;
			var deltay= yPos - lastY;
			if(deltax < 0) deltax = - deltax;
			if(deltay < 0) deltay = -deltay;
			d.push(deltax);
			d.push(deltay);
			if(xPos < this.grid.x1) this.grid.x1 = xPos;
			if(yPos < this.grid.y1) this.grid.y1 = yPos;	
			if(xPos > this.grid.x2) this.grid.x2 = xPos;
			if(yPos > this.grid.y2) this.grid.y2 = yPos;
			
			lastX = xPos;
			lastY = yPos;
		}
	},
	
	_constructFromGeoJSONObject: function(properties,coordinates){
		if(properties.shape == 'polygon'){
			this._constructFromGeoJSONPolygon(properties,coordinates);	
		}
		else if(properties.shape == 'line'){
			console.log("coming soon..");
		}
		else if(properties.shape == 'point'){
			var x = coordinates[0]; var y = coordinates[1];
			this.pointcoords = [x,y];
			var ps = 0.5;
			var newcoords =[[x-ps,y-ps],[x+ps,y-ps],[x+ps,y+ps],[x-ps, y+ps]];
			newcoords = this._convertGeoJSONCoords(newcoords);
			this._constructBasicShape(properties,newcoords);
		}
		else
			console.log("don't know what to do with shape " + element.shape);
	},
	_constructBasicShape: function(properties, coordinates){
		this.coords = coordinates;
		if(!properties.stroke)properties.stroke = '#000000';		
		if(properties.colour){
			properties.fill =  properties.colour;
		}		
		this.properties = properties;
		this.grid = {}; //an enclosing grid
	},	
	_constructFromGeoJSONPolygon: function(properties,coordinates){		
		var newcoords = this._convertGeoJSONCoords(coordinates[0]);
		this._constructBasicShape(properties,newcoords);
				//we ignore any holes in the polygon (for time being.. coords[1][0..n], coords[2][0..n])
	},	
	_convertGeoJSONCoords: function(coords){
	//converts [[x1,y1], [x2,y2],...[xn,yn]] to [x1,y1,x2,y2..xn,yn]
		var res = [];
		if(!coords) return res;
		for(var i=0; i < coords.length; i++){
			// x is longitude, y is latitude
			// longitude goes from -180 (W) to 180 (E), latitude from -90 (S) to 90 (N)
			// in our data, lat goes from 90 (S) to -90 (N), so we negate
			var x = coords[i][0];
			var y = - coords[i][1];
			res.push(x);
			res.push(y);
		}

		return res;
	}	

	,_applyProjection: function(projection,transformation){
		var c = this.coords;
		if(!projection) return c;
		
		var newc = [];
		for(var i=0; i < c.length-1; i+=2){
			var x = parseFloat(c[i]);
			var y = parseFloat(c[i+1]);
			
			if(projection.xy){
				var t = projection.xy(c[i],c[i+1],transformation);
				newx= t.x;
				newy= t.y;
			}

			cok = true;
			//check we haven't wrapped around world (For flat projections sss)
			if(!projection.nowrap){
				var diff;
				if(newx > x) diff = newx - x;
				if(x > newx) diff = x - newx;
				if(diff > 100) cok = false; //too extreme change
			}
			
			if(cok){
				if(typeof newx == 'number' && typeof newy =='number'){
				newc.push(newx);
				newc.push(newy);
				}
	
			}
			
			
		}	

		this._tcoords = newc;
		this._calculateBounds(this._tcoords);
		return newc;
	}
	

	,_cssTransform: function(transformation,projection){
		if(this.properties.shape =='point' || projection) {
			this.vml.path =this._createvmlpathstring(transformation,projection);
		}
		var o = transformation.origin;
		var t = transformation.translate;
		var s = transformation.scale;
		if(!this.initialStyle) {
			var initTop = parseInt(this.vml.style.top);
			if(!initTop) initTop = 0;
			initTop += o.y;
			var initLeft = parseInt(this.vml.style.left);
			if(!initLeft) initLeft = 0;
			initLeft += o.x;
			var w =parseInt(this.vml.style.width);
			var h = parseInt(this.vml.style.height)
			this.initialStyle = {top: initTop, left: initLeft, width: w, height: h};
		}

		var initialStyle= this.initialStyle;

		var style = this.vml.style;			
		var newtop,newleft;
		newtop = initialStyle.top;
		newleft = initialStyle.left;

		//scale
		var newwidth = initialStyle.width * s.x;
		var newheight = initialStyle.height * s.y; 	

		//translate into right place

		var temp;
		temp = (t.x - o.x) * s.x;
		newleft += temp;

		temp = (t.y - o.y) * s.x;
		newtop += temp;						


		style.left = newleft;
		style.top = newtop;

		style.width = newwidth;
		style.height = newheight;
	}
	 
	,_canvasrender: function(canvas,transformation,projection,optimisations){
		var c;	
		var shapetype = this.properties.shape;	
		if(projection)
			c = this._applyProjection(projection,transformation);
		else
			c = this.coords;
			
		if(c.length == 0) return;
		
		var initialX = parseFloat(c[0]);
		var initialY = parseFloat(c[1]);

		var threshold = 2;

		var ctx = canvas.getContext('2d');

		if(this.properties.lineWidth) ctx.lineWidth = this.properties.lineWidth;
		
		var o = transformation.origin;
		var tr = transformation.translate;
		var s = transformation.scale;
		var r = transformation.rotate;
		ctx.save();

		ctx.translate(o.x,o.y);
		ctx.scale(s.x,s.y);
		ctx.translate(tr.x,tr.y);
		//if(r && r.x)ctx.rotate(r.x,o.x,o.y);

		ctx.beginPath();
		ctx.moveTo(initialX,initialY);

		var move;
		for(var i=2; i < c.length-1; i+=2){
			if(c[i]== "M") {
				i+= 1; 
				move=true;
			}
			var x = parseFloat(c[i]);
			var y = parseFloat(c[i+1]);
			if(move){
				ctx.moveTo(x,y);
				move = false;
			}
			else{
				ctx.lineTo(x,y);
			}
		}
		//connect last to first
		if(shapetype != 'path') ctx.lineTo(initialX,initialY);
		ctx.closePath();

		if(!this.properties.hidden) {
			ctx.strokeStyle = this.properties.stroke;
			if(typeof this.properties.fill == 'string') 
				fill = this.properties.fill;
			else
				fill = "#ffffff";

			
			ctx.stroke();
			if(shapetype != 'path') {
				ctx.fillStyle = fill;
				ctx.fill();
			}
		}
		ctx.restore();
	}
	,_createvmlpathstring: function(transformation,projection){
		var o = transformation.origin;
		var t = transformation.translate;
		var s = transformation.scale;
		var path = "M ";

		if(projection)
			c = this._applyProjection(projection,transformation);
		else
			c = this.coords;
			
		if(c.length < 2) return;
		

		
		var x =o.x  + c[0];
		var y =o.y+c[1];		
		x *=this._iemultiplier;
		y *= this._iemultiplier;
		x = parseInt(x);
		y = parseInt(y);

		path+= x + "," +y + " L";
		for(var i =2; i < c.length; i+=2){
			if(c[i] == 'M') {
			path += " M";
			i+=1;
			}
			else path += " L";
			
			var x =o.x+c[i];
			var y =o.y+c[i+1];
			x *= this._iemultiplier;
			y *= this._iemultiplier;
			x = parseInt(x);
			y = parseInt(y);
			path += x +"," + y;
			//if(i < c.length - 2) path += "";
		}
		path += " XE";	
		return path;	
	}
	
	,_ierender: function(canvas,transformation,projection,optimisations){
		if(this.vml){
			this._cssTransform(transformation,projection);
			return;
		}
		
		var o = transformation.origin;
		var t = transformation.translate;
		var s = transformation.scale;
		var shape = document.createElement("g_vml_:shape");
	
		//path ="M 0,0 L50,0, 50,50, 0,50 X";
		var nclass= "easyShape";
		var shapetype =this.properties.shape;
		if(shapetype == 'path') nclass= "easyShapePath";
		shape.setAttribute("class", nclass);
		shape.style.height = canvas.height;
		shape.style.width = canvas.width;
		shape.style.position = "absolute";
		shape.style['z-index'] = 1;
		shape.stroked = "t";
		shape.strokecolor = "#000000";
		
		if(this.properties.fill && shapetype != 'path'){
			shape.filled = "t";
			shape.fillcolor = this.properties.fill;			
		}
		shape.path = this._createvmlpathstring(transformation,projection);
		shape.strokeweight = ".75pt";
		
		var xspace = parseInt(canvas.width);
		xspace *=this._iemultiplier;
		var yspace =parseInt(canvas.height);
		yspace *= this._iemultiplier;
		coordsize = xspace +"," + yspace;
		
		shape.coordsize = coordsize;
		shape.easyShape = this;
		canvas.appendChild(shape);
		this.vml = shape;
		
		this._cssTransform(transformation);
	}
	/*
	render the shape using canvas ctx 
	using ctx and a given transformation in form {translate: {x:<num>, y:<num>}, scale:{translate: {x:<num>, y:<num>}}
	projection: a function that takes xy coordinates and spits out a new x and y
	in a given viewableArea 
	optimisations: boolean - apply optimisations if required
	*/
	,_calculateVisibleArea: function(canvas,transformation){
		var left = 0,top = 0;
		var right =  parseInt(canvas.width) + left; 
		var bottom = parseInt(canvas.height) + top;
		var topleft = EasyMapUtils.undotransformation(left,top,transformation);
		var bottomright = EasyMapUtils.undotransformation(right,bottom,transformation);				
		var frame = {};
		frame.top = topleft.y;
		frame.bottom = bottomright.y;
		frame.right = bottomright.x;
		frame.left = topleft.x;
		return frame;
	}
	
	,_calculatePointCoordinates: function(transformation){
		var x =this.pointcoords[0];
		var y =this.pointcoords[1];
		this.coords = [x,y];		
		var ps = 5 / transformation.scale.x;
		var smallest = 1 / this._iemultipler;
		if(ps < smallest) ps = smallest;
		var newcoords =[[x-ps,y-ps],[x+ps,y-ps],[x+ps,y+ps],[x-ps, y+ps]];
		var c = this._convertGeoJSONCoords(newcoords);
		this.coords = c;
	}
	,_shapeIsInVisibleArea: function(frame){
		var g = this.grid;
		if(g.x2 < frame.left) {
			return false;}
		if(g.y2 < frame.top) {
			return false;}
		if(g.x1 > frame.right){
			return false;
		}
		if(g.y1 > frame.bottom){
			return false;	
		}
		return true;
	}
	
	,_shapeIsTooSmall: function(transformation){
		var t1 = g.x2 -g.x1;
		var t2 =g.y2- g.y1;
		var delta = {x:t1,y:t2};
		delta.x *= s.x;
		delta.y *= s.y;

		if(delta.x < 5 || delta.y < 5) {return false;}//too small
		else
			return true;
	}
	,render: function(canvas,transformation,projection,optimisations){
		var frame = this._calculateVisibleArea(canvas,transformation);
		var shapetype = this.properties.shape;
		if(shapetype == 'point'){
			this._calculatePointCoordinates(transformation);
		} 
		else if(shapetype == 'path' || shapetype =='polygon'){
			
		}
		else{
			console.log("no idea how to draw" +this.properties.shape);
			return;
		}		
		
		if(optimisations){
			if(shapetype != 'point' && frame){ //check if worth drawing				
				if(!this._shapeIsTooSmall(transformation)) {
					if(this.vml) this.vml.style.display = "none";
					return;	
				}
				if(!this._shapeIsInVisibleArea(frame)){
					if(this.vml) this.vml.style.display = "none";
					return;	
				}	
			}
		}	

		if(this.vml) this.vml.style.display = '';
		
		if(canvas.browser == 'ie') {
			//this has been taken from Google ExplorerCanvas
			if (!document.namespaces['g_vml_']) {
			        document.namespaces.add('g_vml_', 'urn:schemas-microsoft-com:vml');
			}

			  // Setup default CSS.  Only add one style sheet per document
			 if (!document.styleSheets['ex_canvas_']) {
			        var ss = document.createStyleSheet();
			        ss.owningElement.id = 'ex_canvas_';
			        ss.cssText = 'canvas{display:inline-block;overflow:hidden;' +
			            // default size is 300x150 in Gecko and Opera
			            'text-align:left;width:300px;height:150px}' +
			            'g_vml_\\:*{behavior:url(#default#VML)}';
			}
			//G_vmlCanvasManager.init_(document);
			
			this._ierender(canvas,transformation,projection,optimisations); 

	
		}
		else{
			this._canvasrender(canvas,transformation,projection,optimisations);
		}
		
	}
};
