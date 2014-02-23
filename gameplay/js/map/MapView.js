/**
	This this contains interfaces used by the map and robber views
	@module catan.map
	@namespace map
*/

var catan = catan || {};
catan.map = catan.map || {};

catan.map.View = (function makeMapView(){

	var Definitions = catan.definitions;
	var ColorDefs = catan.definitions.ColorDefs;
	
	//Private - common for vertex and hexagon factories
	function Colors(playerColor){
		this.color = ColorDefs[playerColor];
		this.outline = ColorDefs[playerColor+"Outline"];
	}
    
	// These stores the paths to the images
	var config = {
		imagesFolder:"../images/misc/",
		hexImagesFolder:"../images/land/",
		numberImagesFolder:"../images/numbers/small_prob/",
		portImagesPrefix:"../images/ports/port_",
	}
	
	// The full paths to the hex images
	var hexImages = {
		water:config.hexImagesFolder+"water.png",
		desert:config.hexImagesFolder+"desert.gif",
		wood:config.hexImagesFolder+"forest.gif",
		brick:config.hexImagesFolder+"brick.gif",
		sheep:config.hexImagesFolder+"pasture.gif",
		wheat:config.hexImagesFolder+"wheat.gif",
		ore:config.hexImagesFolder+"ore.gif",
	}
	
	// The full paths to the number images
	var numberImages = {
		"2":config.numberImagesFolder+"2.png",
		"3":config.numberImagesFolder+"3.png",
		"4":config.numberImagesFolder+"4.png",
		"5":config.numberImagesFolder+"5.png",
		"6":config.numberImagesFolder+"6.png",
		"8":config.numberImagesFolder+"8.png",
		"9":config.numberImagesFolder+"9.png",
		"10":config.numberImagesFolder+"10.png",
		"11":config.numberImagesFolder+"11.png",
		"12":config.numberImagesFolder+"12.png",
	}
	
	// The full paths to the port images
	var portImages = {
		wood:config.portImagesPrefix+"wood.png",
		brick:config.portImagesPrefix+"brick.png",
		sheep:config.portImagesPrefix+"sheep.png",
		wheat:config.portImagesPrefix+"wheat.png",
		ore:config.portImagesPrefix+"ore.png",
		three:config.portImagesPrefix+"three.png",
	}
	
	// Full paths to the robber and illegal placement images
	var miscImages = {
		robber:config.imagesFolder+"robber.gif",
		nogo:config.imagesFolder+"noIcon.png"
	}

	// A 'unit' outline of a settlement
	var settlementShape = (function makeSettlementShapeDef(){
		var w = 1;
		var h = 0.9;
		return new ShapeDef(
			[0,h/3,w/2,0,w,h/3,w,h,0,h],
			{x:w/2,y:2*h/3}
			);
	}())
	
	// A 'unit' outline of a city 
	var cityShape = (function makeSettlementShapeDef(){
		var w = 1;
		var h = 1;
		return new ShapeDef(
			[0,h/2,w/2,h/2,w/2,h/4,3*w/4,0,w,h/4,w,h,0,h],
			{x:w/2,y:2*h/3}
			);
	}())
	// A 'unit' outline for a hex
	var hexShape = (function makeSettlementShapeDef(){
		var w = 1;
		var h = Math.sqrt(3)/2;
		return new ShapeDef(
			[w/2,0,3/2*w,0,2*w,h,3/2*w,2*h,w/2,2*h,0,h],
			{x:w,y:h}
			);
	}())
	
	// This contains a list of points and a center to define a shape
	function ShapeDef(points,center){
		this.points = points;
		this.center = center;
	}
	// Returns an object for extension to pass into kineticjs for shape creation (polygon)
	ShapeDef.prototype.scale = function(scale){
		return {
			points:this.points.map(function(point){
				return scale * point;
			}),
			offsetX: scale * this.center.x,
			offsetY: scale * this.center.y,
		}
	}
    
    
    var ImageLookup = {}
	
	//http://www.html5canvastutorials.com/kineticjs/html5-canvas-kineticjs-image-tutorial/
	// calls the callback when all images (two deep) are loaded	
	function loadAllImages(allSources, callback) {
		var allImages = {};
		var loadedImages = 0;
		var numImages = 0;
		
		// get num of sources
		for (var sources in allSources){
			for(var src in allSources[sources]) {
				numImages++;
			}
		}
		s = ""
		for (var sources in allSources){
			var images = {}
			allImages[sources] = images;
			for(var src in allSources[sources]) {
        /*  This is the old code for loading from the server
                images[src] = new Image(); 
				images[src].src = allSources[sources][src];
				images[src].onload = function(data) {
                    console.log(data);
					if(++loadedImages >= numImages) {
						callback(allImages);
					}
				};
                
			}
        }
        */ // This is the new code to load from the elements on the webpage
                // code to print all the html elements neccessary
                //s = s+'<img src="'+allSources[sources][src]+'">\n';
                images[src] = $('[src="'+allSources[sources][src]+'"]').get(0);
            }
		}
        return allImages;
	}
	
	// mouse normalization
	function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }
      
      
    /**
	An (x,y) point
	@Constructor
	@Param {integer} x The x location
	@Param {Integer} y The y location
	@Class Point
	*/
	function Point(x,y){
		this.setX(x);
		this.setY(y);
	}
    /**
     * @property x
     * @type integer
     */
	core.defineProperty(Point.prototype,"x");
    /**
     * @property y
     * @type integer
     */
	core.defineProperty(Point.prototype,"y");
	Point.prototype.equals = function(point){
		return this.x == point.x && point.y == point.y;
	}
	
    
	/**
	This class defines a vertex location as used by view. It uses a unique representation for each vertex
	@Constructor
	@Param {integer} x The x location of the hex the vertex is on
	@Param {Integer} y The y location of the hex the vertex is on
	@Param {String} dir The location of the vertex on the hex (allowed values:"E", "W")
	@Class VertexLoc
	*/
    function VertexLoc(x,y,dir){
		core.assert(dir === "W" || dir === "E");
		this.setX(x);
		this.setY(y);
		this.setDir(dir);
	}
	core.defineProperty(VertexLoc.prototype,"x");
	core.defineProperty(VertexLoc.prototype,"y");
    /**
     * The location of the vertex on the hex (allowed values:"E" , "W")
     * @property dir
     * @type string
     */
	core.defineProperty(VertexLoc.prototype,"dir");	
	VertexLoc.prototype.equals = function(vl){
		if (!vl) return false;
		try {
			return this.x == vl.x && this.y == vl.y && this.dir == vl.dir;
		} catch (err) {
			console.assert(false);
			console.log(this,vl);
			return false
		}
	}
    
    
	/**
	This class defines an edge location as used by view. It uses a unique representation for each edge
	@Constructor
	@Param {integer} x The x location of the hex the edge is on
	@Param {Integer} y The y location of the hex the edge is on
	@Param {String} dir The location of the edge on the hex (allowed values:"SW", "S", "SE")
	@Class EdgeLoc
	*/
	function EdgeLoc(x,y,dir){
		core.assert(dir === "SW" || dir === "S" ||dir === "SE");
		this.setX(x);
		this.setY(y);
		this.setDir(dir);
	}
	core.defineProperty(EdgeLoc.prototype,"x");
	core.defineProperty(EdgeLoc.prototype,"y");    
    /**
     * The location of the edge on the hex (allowed values:"SW", "S", "SE")
     * @property dir
     * @type string
     */
	core.defineProperty(EdgeLoc.prototype,"dir");
	EdgeLoc.prototype.equals = function(el){
		//if (!el) return false;
		return this.x == el.x && this.y == el.y && this.dir == el.dir;
	}
    
    
    
	/**
	This class defines a port location as used by view. It uses a unique representation for each port location/orientation.
	@Constructor
	@Param {integer} x The x location of the hex the port is on
	@Param {Integer} y The y location of the hex the port is on
	@Param {Integer} rotation The rotation of the port
 	@Class PortLoc
	*/
	function PortLoc(x,y,rotation){
		core.assert(((rotation % 1 ) + 1) % 1== 0);
		this.setX(x);
		this.setY(y);
		this.setRotation(rotation);
	}	
	core.defineProperty(PortLoc.prototype,"x");
	core.defineProperty(PortLoc.prototype,"y");
    /**
     * The amount of rotation on the port - specifically, which side it faces:
     *  0 - NW
     *  1 - N
     *  2 - NE
     *  3 - SE
     *  4 - S
     *  5 - SW
     * 
     * @Property rotation
     * @Type integer
     */
	core.defineProperty(PortLoc.prototype,"rotation");
	
    // used to add to shapes - thus it's called a mixin
	var MapLoc_Mixin = {};
	core.defineProperty(MapLoc_Mixin,"mapLoc");
	core.defineProperty(MapLoc_Mixin,"pieceType");
	
	
	//Private - common for vertex and hexagon factories
	function makeShape(scaledShapeDef,loc,color, outlineColor){
		var center = this.getCenter(loc);
		var image = image;
		if(outlineColor == undefined){
			//console.log(outlineColor)
			outlineColor = "#c6c6c6";
		}
		var commonInfo = {
		  x: center.x,
		  y: center.y,
		  fill:color,
		  strokeWidth:3,
		  stroke:outlineColor,
		}
		var shape = new Kinetic.Polygon($.extend(commonInfo,scaledShapeDef));
		return $.extend(shape,MapLoc_Mixin, {mapLoc:loc});
	}
	
	// This is the basis for the magic of this class	
	var LocFactory = (function Make_LocFactory_Class(){
		core.defineProperty(LocFactory.prototype,"narrowHexWidth");
		core.defineProperty(LocFactory.prototype,"hexHeight");
		core.defineProperty(LocFactory.prototype,"radius");
		core.defineProperty(LocFactory.prototype,"offsets");
		
		function LocFactory(narrowWidth,height,radius,offsets){
			this.setNarrowHexWidth(narrowWidth);
			this.setHexHeight(height);			
			this.setRadius(radius);
			this.setOffsets(offsets);
		}
		
		LocFactory.prototype.getHexCenter = function getHexCenter(loc){
			var x = loc.x;
			var y = loc.y;
			var center =  {
				x: this.getNarrowHexWidth() * x ,
				y: this.getHexHeight() * (x*0.5 + y),
			}
			return center;
		}
		
		LocFactory.prototype.getVertexCenter = function getVertexCenter(vertexLoc){
			var hexCenter = this.getHexCenter(vertexLoc);
			var diff = this.getRadius()
			var diff = diff * ((vertexLoc.getDir() === "W") ? -1 : 1);
			hexCenter.x = hexCenter.x + diff;
			return hexCenter;
		}
		
		LocFactory.prototype.getEdgeCenter = function getEdgeCenter(edgeLoc){
			var hexCenter = this.getHexCenter(edgeLoc);
			var diff;
			switch (edgeLoc.dir){
				case "SW":
					hexCenter.x = hexCenter.x - this.getRadius()*0.75;
					hexCenter.y = hexCenter.y + this.getHexHeight()/4;
					break;
				case "S":
					hexCenter.y = hexCenter.y + this.getHexHeight()/2;
					break;
				case "SE":
					hexCenter.x = hexCenter.x + this.getRadius()*0.75
					hexCenter.y = hexCenter.y + this.getHexHeight()/4;
					break;
			}
			return hexCenter;
		}
		
		LocFactory.prototype.getHexLocation = function(mouseX,mouseY){
			var floor = Math.floor;
			var sqrt = Math.sqrt;
			
			var size = this.getRadius() * sqrt(3);
			var center = this.getOffsets();
			
			var x = mouseX - center.x;
			var y = mouseY - center.y;
			var x = x / size;
			var y = y / size;
			
			var temp = floor(y + sqrt(3) * x + 1)
			var q = floor((floor(2*y+1) + temp) / 3);
			var r = floor((temp + floor(-y + sqrt(3) * x + 1))/3);
			
			x = r;
			var zneg = q;
			z = 0-zneg;
			y = 0-x-z;
			return {x:x,y:y};
		}
		
		function distanceBetween(point1,point2){
			return (Math.sqrt(Math.pow(point1.x-point2.x,2)+
								Math.pow(point1.y-point2.y,2)));
		}
		
		function pickClosest(target,points){
			var smallest = 0;
			var distance = distanceBetween(target,points[0])
			for (var index = 1; index < points.length; index++){
				var newDistance = distanceBetween(target,points[index]);
				if ( newDistance < distance){
					distance = newDistance;
					smallest = index;
				}
			}
			return smallest;
		}
		
		LocFactory.prototype.getVertexLocation = function(mouseX,mouseY){
			var mousePoint = {x:mouseX,y:mouseY};
			var hexLoc = this.getHexLocation(mouseX,mouseY);
			var hexCenter = this.getHexCenter(hexLoc);
			var center = this.getOffsets();
			 hexCenter.x = hexCenter.x + center.x;
			 hexCenter.y = hexCenter.y + center.y;
			var radius = this.getRadius();
			var hOffset = this.getHexHeight() / 2;
			var wOffset = radius/2;
			var points = 
				[{x:hexCenter.x - radius,	y:hexCenter.y},
				 {x:hexCenter.x - wOffset,	y:hexCenter.y-hOffset},
				 {x:hexCenter.x + wOffset,	y:hexCenter.y-hOffset},
				 {x:hexCenter.x + radius,	y:hexCenter.y},
				 {x:hexCenter.x + wOffset,	y:hexCenter.y+hOffset},
				 {x:hexCenter.x - wOffset,	y:hexCenter.y+hOffset}				 
				 ]
			var index = pickClosest(mousePoint,points);
			switch (index){
				case 0:
					return new VertexLoc(hexLoc.x,hexLoc.y,"W");
				case 1:
					return new VertexLoc(hexLoc.x-1,hexLoc.y,"E");
				case 2:
					return new VertexLoc(hexLoc.x+1,hexLoc.y-1,"W");
				case 3:
					return new VertexLoc(hexLoc.x,hexLoc.y,"E");
				case 4:
					return new VertexLoc(hexLoc.x+1,hexLoc.y,"W");
				case 5:
					return new VertexLoc(hexLoc.x-1,hexLoc.y+1,"E");
				default:
					throw Error("Illegal vertex chosen - that should've been impossible");
			}
		}
			
		LocFactory.prototype.getEdgeLocation = function(mouseX,mouseY){
			var mousePoint = {x:mouseX,y:mouseY};
			var hexLoc = this.getHexLocation(mouseX,mouseY);
			var hexCenter = this.getHexCenter(hexLoc);
			var center = this.getOffsets();
			 hexCenter.x = hexCenter.x + center.x;
			 hexCenter.y = hexCenter.y + center.y;
			var radius = this.getRadius();
			var height = this.getHexHeight();
			var hOffset = this.getHexHeight() / 4;
			var wOffset = 0.75*radius;
			var points = [
				 {x:hexCenter.x - wOffset,	y:hexCenter.y-hOffset},
				 {x:hexCenter.x,			y:hexCenter.y-height/2},
				 {x:hexCenter.x + wOffset,	y:hexCenter.y-hOffset},
				 {x:hexCenter.x + wOffset,	y:hexCenter.y+hOffset},
				 {x:hexCenter.x,			y:hexCenter.y+height/2},
				 {x:hexCenter.x - wOffset,	y:hexCenter.y+hOffset}]
			var index = pickClosest(mousePoint,points);
			switch (index){
				case 0:
					return new EdgeLoc(hexLoc.x-1,hexLoc.y,"SE");
				case 1:
					return new EdgeLoc(hexLoc.x,hexLoc.y-1,"S");
				case 2:
					return new EdgeLoc(hexLoc.x+1,hexLoc.y-1,"SW");
				case 3:
					return new EdgeLoc(hexLoc.x,hexLoc.y,"SE");
				case 4:
					return new EdgeLoc(hexLoc.x,hexLoc.y,"S");
				case 5:
					return new EdgeLoc(hexLoc.x,hexLoc.y,"SW");
				default:
					throw Error("Illegal vertex chosen - that should've been impossible");
			}
		}
		
		return LocFactory;
	}());
	
	var LocationDefinition = (function Make_LocationDefinition_Class(){
		core.defineProperty(LocationDefinition.prototype,"locFactory");
		core.defineProperty(LocationDefinition.prototype,"noGoRadius");
		function LocationDefinition (locFactory){
			this.setLocFactory(locFactory);			
		}

		// gives you the center of the bounding spot;
		LocationDefinition.prototype.getCenter = core.abstractFunction;
		// gives type location of the mouse
		LocationDefinition.prototype.getTypeLocation = core.abstractFunction;
		// gets the nogo symbol radius for this typedef:
		LocationDefinition.prototype.makeNoGo = function(loc,image){
			var radius = this.getNoGoRadius();
			var image = image;
			var nogo = new Kinetic.Image({
			  x: 0,
			  y: 0,
			  offsetX: radius,
			  offsetY: radius,
			  image: image,
			  width: radius*2,
			  height: radius*2,
			});
			return $.extend(nogo,MapLoc_Mixin);
		}
		
		
		return LocationDefinition;
	}());
	
	var HexDefinition = (function Make_HexDefinition_Class(){
		
		core.forceClassInherit(HexDefinition,LocationDefinition);
		
		core.defineProperty(HexDefinition.prototype,"locFactory");
		core.defineProperty(HexDefinition.prototype,"hexImages");
		core.defineProperty(HexDefinition.prototype,"numberImages");
		core.defineProperty(HexDefinition.prototype,"portImages");
		
		function HexDefinition(locFactory,hexImages,numberImages,portImages){
			this.setLocFactory(locFactory);
			this.setHexImages(hexImages);
			this.setNumberImages(numberImages);
			this.setPortImages(portImages);
			this.setNoGoRadius(this.getNumberRadius());
		}
		
		HexDefinition.prototype.getTypeLocation = function(x,y){
			return this.getLocFactory().getHexLocation(x,y);
		}

		HexDefinition.prototype.getCenter = function(loc){
			return this.getLocFactory().getHexCenter(loc);
		}
		
		// Public factory utility methods;
		HexDefinition.prototype.getHexRadius = function(){
			return this.getLocFactory().getRadius();
		}
		
		HexDefinition.prototype.getNumberRadius = function(){
			return this.getLocFactory().getRadius()/2.5;
		}
		
		function makeHexLike(loc,type,imageLookup,rotation){
			var image = imageLookup[type];
			var shape = makeShape.call(this,hexShape.scale(this.getHexRadius()),loc,"black");
			var scale = (this.getLocFactory().getHexHeight()) / image.height;
			shape.setFillPatternImage(image);
			shape.setFillPriority("pattern");
			
			if (rotation == undefined){
				rotation = 0;
			} else {
                rotation = (rotation + 2) % 6
            }
			
			shape.setRotation(rotation*Math.PI/3);
			//shape.setStrokeWidth(0);
			shape.setFillPatternScale({x:scale,y:scale});
			//shape.setFillPatternRepeat('no-repeat');
			shape.setFillPatternOffsetX(0-this.getHexRadius()+image.width/2*scale);
			shape.setFillPatternOffsetY(0 - shape.getOffsetY() + image.height/2*scale);
			return shape;
		}

		// Factory functions;
		HexDefinition.prototype.makeHex = function(loc,type){
		    return makeHexLike.call(this,loc,type,this.getHexImages());
		}
		
		// Factory functions;
		HexDefinition.prototype.makePort = function(loc,type){
		    return makeHexLike.call(this,loc,type,this.getPortImages(),loc.rotation);
		}
		
		//Factory functions;
		HexDefinition.prototype.makeRobber = function(loc,image){
			var center = this.getCenter(loc);
			var height = this.getHexRadius()*1.3;
			var width = this.getHexRadius()*1.3/2;
			var image = image;
			var robber = new Kinetic.Image({
			  x: center.x,
			  y: center.y,
			  offsetX: width/2,
			  offsetY: height/2,
			  image: image,
			  width: width,
			  height: height,
			});
			return $.extend(robber,MapLoc_Mixin);
		}
		
		//Factory functions;
		HexDefinition.prototype.makeNumber = function(loc,number){
			var center = this.getCenter(loc);
			var radius = this.getNumberRadius();
			var image = this.getNumberImages()[number];
			var scale = 122/(radius*2)
			var number = new Kinetic.Image({
			  x: center.x,
			  y: center.y,
			  offsetX: radius,
			  offsetY: radius,
			  image: image,
			  width: radius*2,
			  height: radius*2,
			});
			return $.extend(number,MapLoc_Mixin);
		}
		
		return HexDefinition;
	}());
	
	var VertexDefinition = (function Make_VertexDefinition_Class(){
		
		core.forceClassInherit(VertexDefinition,LocationDefinition);
		
		core.defineProperty(VertexDefinition.prototype,"locFactory");
		
		function VertexDefinition(locFactory){
			this.setLocFactory(locFactory);
			this.setNoGoRadius(locFactory.getRadius()*0.5);
		}
		
		VertexDefinition.prototype.getTypeLocation = function(x,y){
			return this.getLocFactory().getVertexLocation(x,y);
		}

		VertexDefinition.prototype.getCenter = function(vertLoc){
			return this.getLocFactory().getVertexCenter(vertLoc);
		}
		
		VertexDefinition.prototype.getBigRadius = function(){
			return this.getLocFactory().getRadius()*0.6;
		}
		
		VertexDefinition.prototype.getSmallRadius = function(){
			return this.getLocFactory().getRadius()*0.4;
		}
		var VertexLoc_Mixin = {
			setMapLoc:function(loc){
//				console.log("HERE",loc);
				var _this = this;
				this.mapLoc = undefined;
				var shapes = this.getParent().getChildren();
				shapes.map(function removeDups(shape){
					if (shape){
						var newloc = shape.mapLoc;
						if (newloc){
							if (newloc.x == loc.x && newloc.y == loc.y && newloc.dir == loc.dir){
								shape.remove();
							}
						}
					}
				});
			}
		}
		//Factory functions;
		function makeVertexShape(scaledShapeDef,loc,color,outline){
			return $.extend(
				makeShape.call(this,scaledShapeDef,loc,color,outline), 
				VertexLoc_Mixin,
				{pieceType:scaledShapeDef.constructor.name.toLowerCase()}
			);
		}
		
		VertexDefinition.prototype.makeSettlement = function(loc,color,outline){
			return makeVertexShape.call(this,settlementShape.scale(this.getSmallRadius()),loc,color,outline);
		}
		
		VertexDefinition.prototype.makeCity = function(loc,color,outline){
			return makeVertexShape.call(this,cityShape.scale(this.getBigRadius()),loc,color,outline);
		}
		
		return VertexDefinition;
	}());
	
	var EdgeDefinition = (function Make_EdgeDefinition_Class(){
		
		core.forceClassInherit(EdgeDefinition,LocationDefinition);
		
		core.defineProperty(EdgeDefinition.prototype,"locFactory");
		
		function EdgeDefinition(locFactory){
			this.setLocFactory(locFactory);
			this.setNoGoRadius(locFactory.getRadius()/2);
		}
		
		EdgeDefinition.prototype.getTypeLocation = function(x,y){
			return this.getLocFactory().getEdgeLocation(x,y);
		}

		EdgeDefinition.prototype.getCenter = function(edgeLoc){
			return this.getLocFactory().getEdgeCenter(edgeLoc);
		}
		
		var Road_Mixin = {
			setMapLoc:function(loc){
				this.mapLoc = loc;
				if (loc.getDir() === "S"){
					this.setRotation(0);
				} else if (loc.getDir() === "SW"){
					this.setRotation(Math.PI/3);
				} else if (loc.getDir() === "SE"){
					this.setRotation(2*Math.PI/3);
				}
			}
		}
		
		//Factory functions;
		EdgeDefinition.prototype.makeRoad = function(loc,color,outline){
			var center = this.getCenter(loc);
			var image = image;
			var w = this.getLocFactory().getRadius()*0.9;
			var h = this.getLocFactory().getRadius()*0.18;
			if(outline == undefined)
				outline = "#dfdfdf";
			var shape = new Kinetic.Rect({
				width: w,
				height: h,
				x: center.x,
				y: center.y,
				offsetX:w/2,
				offsetY:h/2,
				fill:color,
				strokeWidth:3,
				stroke:outline,
			})
			var shape =  $.extend(shape,MapLoc_Mixin,Road_Mixin);
			shape.setMapLoc(loc);
			return shape;
		}
		
		return EdgeDefinition;
	}());
	
	var DragController = (function Make_DragLayer_Class(){
		function DragController(typeDefinition,newLayer,dragLayer,type){
			this.setTypeDefinition(typeDefinition);
			this.setTargetLayer(newLayer);
			this.setDragLayer(dragLayer);
			this.setType(type);
//			console.log(type);
		}
		
		DragController.prototype.startPlacement = function(goodShape,badShape,dragFunction,dropFunction){
			
			this.setOnDrag(dragFunction);
			this.setOnDrop(dropFunction);
			this.setGoodShape(goodShape);
			this.setBadShape(badShape);
			
			goodShape.remove();
			badShape.remove();
			var dragLayer = this.getDragLayer();
			var width = dragLayer.getParent().getWidth();
			var height = dragLayer.getParent().getHeight();
			
			
			dragLayer.add(new Kinetic.Rect({
				x:0-width/2,
				y:0-height/2,
				width:width,
				height:height,
				fill:"black",
				opacity:0.0
			}));
			dragLayer.add(goodShape);
			dragLayer.add(badShape);
			
			badShape.setOpacity(0);
			goodShape.setOpacity(0);
			
			this.getDragLayer().getChildren().map(function(child){
//				console.log("Child :--",child);
			});
			if (!(dragLayer.getParent())){
				this.getTargetLayer().getParent().add(dragLayer);
			} else {
				dragLayer.draw();
			}
			dragLayer.on('mousemove', this.makeDragHandler(dragFunction));
			dragLayer.on('mousedown',this.makeDropHandler(dragFunction,dropFunction));
		}
		
		DragController.prototype.makeDragHandler = function makeDragHandler(callback){
			var _this = this;
			return function(mousePos){
				mousePos = _this.getDragLayer().getParent().getMousePosition();
				var loc = _this.getTypeDefinition().getTypeLocation(mousePos.x,mousePos.y);
				
				var center = _this.getTypeDefinition().getCenter(loc);
				var shapeToShow;
				var shapeToHide;
				var toReturn;
				if (callback(loc,_this.getType())){
					shapeToShow = _this.getGoodShape();
					shapeToHide = _this.getBadShape();
					toReturn = true;
				} else {
					shapeToShow = _this.getBadShape();
					shapeToHide = _this.getGoodShape();
					toReturn = false;
				}
				shapeToHide.setOpacity(0);
				shapeToShow.setMapLoc(loc);
				shapeToShow.setPosition(center.x,center.y);
				shapeToShow.setOpacity(0.60);
				_this.getDragLayer().draw();
				return toReturn;
			}		
		}
		
		DragController.prototype.makeDropHandler = function makeDropHandler(placeableCallback,placementCallback){
			var _this = this;
			return function(mousePos){
				mousePos = _this.getDragLayer().getParent().getMousePosition();
				if (_this.makeDragHandler(placeableCallback)(mousePos,_this.getType())){
					var loc = _this.getTypeDefinition().getTypeLocation(mousePos.x,mousePos.y);
					placementCallback(loc,_this.getType());
					_this.finishPlacement(true,loc);
				}
			}		
		}
		
		DragController.prototype.finishPlacement = function(success,loc){
//			console.log(success);			
			
			this.getGoodShape().remove();
			this.getBadShape().remove();
			
			if (success){
				this.getGoodShape().setOpacity(1);
				this.getTargetLayer().add(this.getGoodShape());
				this.getGoodShape().setMapLoc(loc);
				this.getTargetLayer().getParent().draw();			
			}

			this.getDragLayer().off('mousemove mousedown');

		}
		
		core.defineProperty(DragController.prototype,"dragLayer");
		core.defineProperty(DragController.prototype,"typeDefinition");
		core.defineProperty(DragController.prototype,"goodShape");
		core.defineProperty(DragController.prototype,"badShape");
		core.defineProperty(DragController.prototype,"targetLayer");
		core.defineProperty(DragController.prototype,"onDrag");
		core.defineProperty(DragController.prototype,"onDrop");
		core.defineProperty(DragController.prototype,"type");
		
		return DragController;
	}());
	
	var MapView = (function Make_MapView_Class(){	


		/**
         * You need to pass in how many pixels tall/wide the map is 
         * and how many hexes tall/wide the map is 
         * (the hex dim can be calculated from the client model)
         * 
		 * @param {int} pixelDim the height of the map measured in pixels
		 * @param {int} hexDim the height of the map measured in hexes
         * @class MapView
         * @constructor
		 */
		function MapView(pixelDim,hexDim){
			var containerID = Definitions.PageViewIDs.mapArea;
			
			makeStage.call(this,containerID,pixelDim,pixelDim);
			defineImages.call(this);
			calculateSizes.call(this,pixelDim,pixelDim,hexDim,hexDim);
            loadImages.call(this);
		}
        
		core.defineProperty(MapView.prototype,"stage");
		core.defineProperty(MapView.prototype,"hexLayer");		
		core.defineProperty(MapView.prototype,"portLayer");
		core.defineProperty(MapView.prototype,"numberLayer");
		core.defineProperty(MapView.prototype,"robberLayer");
		core.defineProperty(MapView.prototype,"edgeLayer");
		core.defineProperty(MapView.prototype,"vertexLayer");
		core.defineProperty(MapView.prototype,"dragLayer");
		
		core.defineProperty(MapView.prototype,"robber");
		
		core.defineProperty(MapView.prototype,"dragController");
		
		core.defineProperty(MapView.prototype,"offsets");
		core.defineProperty(MapView.prototype,"locFactory");
		
		core.defineProperty(MapView.prototype,"hexDefinition");
		core.defineProperty(MapView.prototype,"edgeDefinition");
		core.defineProperty(MapView.prototype,"vertexDefinition");
		
		core.defineProperty(MapView.prototype,"images");
		/**
		@Property controller
		@Type MapController

		*/
		core.defineProperty(MapView.prototype,"controller");

		
		function setupRest(){
			readyHexLayers.call(this);
			readyEdgeLayers.call(this);
			readyVertexLayers.call(this);
			this.setDragLayer(makeLayer.call(this));
		}
		
		function loadImages(){
			var _this = this;
            function imagesDoneLoading(images){
				_this.setImages(images);
				setupRest.call(_this);
            };
            
            imagesDoneLoading(loadAllImages(this.getImages()));
		}
		
		function makeStage(containerID,pixelWidth,pixelHeight){
			var stage = new Kinetic.Stage({
				container: containerID,
				width: pixelWidth,
				height: pixelHeight
			});
			this.setStage(stage);
		};
		
		function calculateSizes(pixelWidth,pixelHeight,hexHeight,hexWidth){
			core.assert(hexHeight % 2 == 1);
			core.assert(hexWidth % 2 == 1);
			
			var height = (pixelHeight/hexHeight);
			var rad = height / (2 * 0.8660254037844386);
			var width = rad * 1.5;
			var offsets = {x:pixelWidth/2,y:pixelHeight/2};
			this.setLocFactory(new LocFactory(width,height,rad,offsets));
			this.setOffsets(offsets);
		}
		
		MapView.prototype.clearPlaceables = function(){
			this.getVertexLayer().clear();
			this.getVertexLayer().removeChildren();
			this.getEdgeLayer().clear();
			this.getEdgeLayer().removeChildren();
			this.getRobberLayer().clear();
			this.getRobberLayer().removeChildren();
		}
		
		function readyHexLayers(){
			var hexLayer = makeLayer.call(this);
			this.setHexLayer(hexLayer);
			var numberLayer = makeLayer.call(this);
			this.setNumberLayer(numberLayer);
			var portLayer = makeLayer.call(this);
			this.setPortLayer(portLayer);
			var robberLayer = makeLayer.call(this);
			this.setRobberLayer(robberLayer);
			
			var images = this.getImages();
			
			var hexDef = new HexDefinition(this.getLocFactory(),images.hexes,images.numbers,images.ports);
			this.setRobber(hexDef.makeRobber(new Point(0,0),this.getImages().misc.robber));	
			
			this.setHexDefinition(hexDef);
		}
		
		function readyEdgeLayers(){
			var edgeLayer = makeLayer.call(this);
			this.setEdgeLayer(edgeLayer);
			var edgeDef = new EdgeDefinition(this.getLocFactory());
			this.setEdgeDefinition(edgeDef);
		}		
		
		function readyVertexLayers(){
			var vertexLayer = makeLayer.call(this);
			this.setVertexLayer(vertexLayer);
			var vertDef = new VertexDefinition(this.getLocFactory());
			this.setVertexDefinition(vertDef);
		}

		function makeLayer(){
			var layer = new Kinetic.Layer({
				offsetX:-this.getOffsets().x,
				offsetY:-this.getOffsets().y
			});
			this.getStage().add(layer);
			return layer;
		}
		
		function defineImages(){
			this.setImages({
				hexes:hexImages,
				numbers:numberImages,
				misc:miscImages,
				ports:portImages,
			});
		}
		
		/**
		 This starts the piece placement process - it has no knowledge of the model, so you must tell it the piece type and color.
		 Color can be omitted and has no effect if it's the robber
		 After calling this, the view will use the controller's "onDrag" and "onDrop" methods to check whether a piece can be placed.
		 
		 @param {String} objectType The type of piece to be placed ("city","settlement","road","robber")
		 @param {String} color The color of the piece you want to place. (Omit for "robber".)
		 @method startDrop
		*/
		MapView.prototype.startDrop = function startDrop(objectType,playerColor){
			objectType = objectType.toLowerCase();
			var typeDef, goodShape, badShape, targetLayer;
			
			var colors = new Colors(playerColor);
			var color = colors.color;
			var outline = colors.outline;
			
			
			switch(objectType){
				case "city":
					targetLayer = this.getVertexLayer();
					typeDef = this.getVertexDefinition();
					goodShape = typeDef.makeCity(new VertexLoc(0.5,0.5,"W"),color,outline);
					break;
				case "settlement":
					targetLayer = this.getVertexLayer();
					typeDef = this.getVertexDefinition();
					goodShape = typeDef.makeSettlement(new VertexLoc(0.5,0.5,"W"),color,outline);
					break;
				case "road":
					targetLayer = this.getEdgeLayer();
					typeDef = this.getEdgeDefinition();
					goodShape = typeDef.makeRoad(new EdgeLoc(0.5,0.5,"E"),color,outline);
					break;
				case "robber":
					targetLayer = this.getRobberLayer();
					typeDef = this.getHexDefinition();
					goodShape = this.getRobber();
					break;
				default:
					throw Error("You didn't specify a legal piece type to drag");
			}
	
			var dragController = new DragController(typeDef,targetLayer,this.getDragLayer(),{type:objectType,color:color});
			this.setDragController(dragController);
			
			var shapeNo = typeDef.makeNoGo(new Point(0,0),this.getImages().misc.nogo);
			dragController.startPlacement(goodShape,shapeNo,this.getOnDrag(),this.getOnDrop());
		}
        
		MapView.prototype.getOnDrag = function(){
			var cont = this.getController();
			return function(loc,type){
				return cont.onDrag(loc,type);
			};
		}		
		MapView.prototype.getOnDrop = function(){
			var cont = this.getController();
			return function(loc,type){
				return cont.onDrop(loc,type);
			};
		}
		
		/**
		 This cancels the piece placement process.
		 @method cancelDrop
		*/
		MapView.prototype.cancelDrop = function cancelDrop(){
			this.getDragController().finishPlacement(false);
			this.getStage().draw();
		}

        /**
        This causes the pieces on the board to be drawn.
        @method drawPieces
        */
		MapView.prototype.drawPieces = function () {
			this.getEdgeLayer().draw();
			this.getVertexLayer().draw();
        };
        
		/**
		 This adds a hex to the board.

		 @param {HexLocation} loc The location to put the hex. This should only be called at most once per hex location
		 @param {String} type The type of the hex: a resource("wood","brick","sheep","wheat","ore"), "desert", or "water"
		 @param {Boolean} [noDraw] Optional - if omitted or false, the view is not redrawn.	 
		 @method addHex
		*/
		MapView.prototype.addHex = function addHex(loc,type,noDraw){
			placeObject.call(this,this.getHexLayer(),this.getHexDefinition(),"makeHex",loc,type,noDraw);
		}
		
		/**
		 This adds a number to the board.

		 @param {HexLocation} loc The location to put the number. This should only be called at most once per hex location
		 @param {Integer} number The number to put on the map	 
		 @param {Boolean} [noDraw] Optional - if omitted or false, the view is not redrawn.
		 @method addNumber
		*/
		MapView.prototype.addNumber = function addNumber(loc,number,noDraw){
			placeObject.call(this,this.getNumberLayer(),this.getHexDefinition(),"makeNumber",loc,number,noDraw);
		}

		/**
		 This adds a port to the board.

		 @param {PortLoc} loc The location to put the port. This should only be called only once per port
		 @param {String} type The port type: a resource("wood","brick","sheep","wheat","ore"), or "three"	 
		 @param {Boolean} [noDraw] Optional - if omitted or false, the view is not redrawn.
		 @method addPort
		*/
		MapView.prototype.addPort = function addPort(loc,type,noDraw){
			placeObject.call(this,this.getPortLayer(),this.getHexDefinition(),"makePort",loc,type,noDraw);
		}

		/**
		 This places the robber on the board. Subsequent calls move the robber.

		 @param {HexLocation} loc The location to put the robber. 
		 @param {Boolean} [noDraw] Optional - if omitted or false, the view is not redrawn.	 
		 @method placeRobber
		*/
		MapView.prototype.placeRobber = function setRobber(loc,noDraw){
			this.getRobberLayer().removeChildren();
			placeObject.call(this,this.getRobberLayer(),this.getHexDefinition(),"makeRobber",loc,this.getImages().misc.robber,noDraw);
			this.setRobber(this.getRobberLayer().getChildren()[0]);
		}
		
		/**
		 This adds a settlement to the board. 

		 @param {VertexLoc} loc The location to put the settlement. 
		 @param {String} playerColor The player color
		 @param {Boolean} [noDraw] Optional - if omitted or false, the view is not redrawn.	 
		 @method placeSettlement
		*/
		MapView.prototype.placeSettlement = function placeSettlement(loc,playerColor,noDraw){
			var colors = new Colors(playerColor);
			var color = colors.color;
			var outline = colors.outline;
			if (!getPieceAt(this.getVertexLayer(),loc)){
				placeObject.call(this,this.getVertexLayer(),this.getVertexDefinition(),"makeSettlement",loc,color,outline,noDraw);
			}
		}

		/**
		 This adds a city to the board. 

		 @param {VertexLoc} loc The location to put the city. 
		 @param {String} playerColor The player color
		 @param {Boolean} [noDraw] Optional - if omitted or false, the view is not redrawn.	 
		 @method placeCity
		*/
		MapView.prototype.placeCity = function placeCity(loc,playerColor,noDraw){
			var colors = new Colors(playerColor);
			var color = colors.color;
			var outline = colors.outline;
			placeObject.call(this,this.getVertexLayer(),this.getVertexDefinition(),"makeCity",loc,color,outline,noDraw);
		}

		/**
		 This adds a road to the board. 

		 @param {EdgeLoc} loc The location to put the road. 
		 @param {String} playerColor The player color
		 @param {Boolean} [noDraw] Optional - if omitted or false, the view is not redrawn.	 
		 @method placeRoad
		*/
		MapView.prototype.placeRoad = function placeRoad(loc,playerColor,noDraw){
			var colors = new Colors(playerColor);
			var color = colors.color;
			var outline = colors.outline;
			if (!getPieceAt(this.getEdgeLayer(),loc))
				placeObject.call(this,this.getEdgeLayer(),this.getEdgeDefinition(),"makeRoad",loc,color,outline,noDraw);
		}
		
		function placeObject(layer,definition,functionName,loc,color,outline,noDraw){
			if (!layer || !definition) throw Error ("The system wasn't inited");
			layer.add(definition[functionName](loc,color,outline));
			if (!(noDraw))layer.draw();
		}
		
		function getPieceAt(layer,loc){
			for (var childCount = 0; childCount < layer.getChildren().length; childCount++){
				if (loc.equals(layer.getChildren()[childCount].getMapLoc())){
					return layer.getChildren()[childCount];
				}
			}
		}
		
		
		return MapView;
	}());
    
    // Adding modal functionality:
    /*function addModalFunctionality(){
        
        MapView.prototype.
        
    }())*/
	
	return {
		MapView:MapView,
		VertexLoc:VertexLoc,
		EdgeLoc:EdgeLoc,
		PortLoc:PortLoc,
	};
}());

