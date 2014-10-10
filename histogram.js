function Graph(config){
    this.canvas = config.canvas;
    this.maxValue = config.maxValue;
    this.maxValue = config.maxValue;
	this.numBars = config.bars;
	this.gridOn = config.gridOn; 
	this.groups = config.grupos;
		
	this.interBarOffset = 10;
	this.gridSize = 20;
	
    this.axisXOffset = 100;  
	this.axisYOffset = 50;
	this.gridSize = 30;
    this.axisColor = "#5555AA";

	this.axisXLength = this.canvas.width - this.axisXOffset;
	this.axisYLength = this.canvas.height - this.axisYOffset;
	
	// Escala todo
	var num = Number(1 + this.numBars/this.groups);
	this.barWidth = ( this.axisXLength - num * this.interBarOffset) / this.numBars;
	this.blockTicks = this.axisYLength / this.maxValue;
	this.prevBar = this.axisYOffset;
	// draw x y axis and tick marks
	this.labelOffset = 0;
	this.resetLabels();
    this.drawXAxis();
    this.drawYAxis();
	if (this.gridOn == 1) this.drawGrid();
	this.drawScale();
}
 
Graph.prototype.drawGrid = function(){
	var ctx = this.canvas.getContext("2d");
	ctx.beginPath();
	ctx.strokeStyle = "#DDDDDD";
	ctx.lineWidth = 1;
	for (var x=this.axisYOffset+10; x <= this.canvas.width; x+=this.gridSize) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, this.axisYLength-2);
	}
	for (var y=this.axisYLength-12; y > 0; y-=this.gridSize) {
		ctx.moveTo(this.canvas.width, y);
		ctx.lineTo(this.axisYOffset+2, y);
	}
	ctx.stroke();
}
 
Graph.prototype.drawScale = function(){
	var ctx = this.canvas.getContext("2d");
	var str = new String();
	var posicion = this.axisYOffset;
	str += this.maxValue;
	ctx.font = "bold 12px sans-serif";
	posicion -= str.length*8;
	ctx.fillText(str,posicion,10);
	str = "" + Math.floor(this.maxValue / 2);
	posicion = this.axisYOffset-str.length*8;
	ctx.fillText(str,posicion,10+this.axisYLength/2);
	str = "0";
	posicion = this.axisYOffset-16;
	ctx.fillText(str,posicion,this.axisYLength-2);
	str = "" + Math.floor(this.maxValue / 4);
	posicion = this.axisYOffset-str.length*8;
	ctx.fillText(str,posicion,10+this.axisYLength*3/4);
	str = "" + Math.floor(this.maxValue * 3 / 4);
	posicion = this.axisYOffset-str.length*8;
	ctx.fillText(str,posicion,10+this.axisYLength/4);
}
 
Graph.prototype.drawXAxis = function(){
    var ctx = this.canvas.getContext("2d");
    ctx.beginPath();
	ctx.strokeStyle = this.axisColor;
    ctx.lineWidth = 2;
	ctx.fillStyle = this.axisColor;
    ctx.moveTo(this.axisYOffset, this.axisYLength);
    ctx.lineTo(this.canvas.width,this.axisYLength);
    ctx.stroke();
};
 
Graph.prototype.drawYAxis = function(){
    var ctx = this.canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(this.axisYOffset, this.canvas.height - this.axisYOffset);
    ctx.lineTo(this.axisYOffset, 0);
    ctx.strokeStyle = this.axisColor;
    ctx.lineWidth = 2;
    ctx.stroke();
}

Graph.prototype.resetLabels = function() {
	this.labelOffset = this.interBarOffset + this.axisYOffset;
}

Graph.prototype.writeLabel = function(lbl,bars_,Xoff,Yoff,rotation) {
    var ctx = this.canvas.getContext("2d");
	var str = new String(lbl);
	var posicion = this.labelOffset + Xoff;
	ctx.font = "bold 12px sans-serif";
	ctx.fillStyle = this.axisColor;
	if (rotation == 1) {
		ctx.save();  
		ctx.translate(posicion, this.axisYLength+18+Yoff);  
		ctx.font = "bold 10px sans-serif";
  	    ctx.fillStyle = this.axisColor;
		ctx.rotate(Math.PI/14);  
		ctx.fillText(str, 0, 0);  
		ctx.restore(); 
	} else ctx.fillText(str,posicion,this.axisYLength+18+Yoff);
	this.labelOffset = this.labelOffset + this.barWidth * bars_ + this.interBarOffset;
}

Graph.prototype.drawBar = function(valor,color,leyenda,ioffset,gradOn) {
    var ctx = this.canvas.getContext("2d");
	if (ioffset == 1) this.prevBar += this.interBarOffset;
	var x1 = new Number(this.prevBar);
	var y1 = new Number(this.axisYLength - valor * this.blockTicks);
	var alto = new Number(valor * this.blockTicks - 1);
	if (gradOn == 1) {
		var mygradient = ctx.createLinearGradient(x1,0,x1 + this.barWidth*2,0);
		mygradient.addColorStop(0,color);
		mygradient.addColorStop(1,"#333333");
		ctx.fillStyle = mygradient;
	} 
	else
		ctx.fillStyle = color;
	ctx.fillRect(x1,y1,this.barWidth,alto);
	this.prevBar += this.barWidth;
	if (leyenda != "") {
		var str = new String(leyenda);
		var fsize = 12;
		var posicion = x1 + (this.barWidth-str.length*6)/2;
		ctx.font = "bold 12px sans-serif";
		ctx.fillStyle = this.axisColor;
		ctx.fillText(str,posicion,this.axisYLength+18);
	}

	// Border

	ctx.beginPath();
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1.2;
	x1--;
	ctx.moveTo(x1, this.axisYLength);
	ctx.lineTo(x1, y1);
	x1 += this.barWidth + 1;
	ctx.lineTo(x1, y1-1);
	ctx.lineTo(x1, this.axisYLength);
	ctx.stroke();
}
