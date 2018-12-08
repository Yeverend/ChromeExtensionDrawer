console.log("Chrom extension work.");

chrome.storage.local.set({'penState': null});

var windowLocation = window.location.href;
var fileName = "imagedata.png";

var size = {width: document.body.scrollWidth,
						height: document.body.scrollHeight,
						canvasHeight: 300};

//create big canvas
function createBigCanvas(){
	var c = document.createElement("canvas");
			c.id = "extension_big_canvas";
			c.style["width"] = size.width + "px";
			c.style["height"] = size.height + "px";
			c.width = size.width;
			c.height = size.height;
			c.style["position"] = "absolute";
			c.style["left"] = "0px";
			c.style["top"] = "0px";
			c.style["display"] = "none";
			c.style["zIndex"] = 0;
			c.style["pointer-events"] = "none";
	document.body.appendChild(c);

}

//saving, loading
var splitter = "$";
function writeToFile(name, data){
	var a = document.createElement("a");
  a.href = data;
  a.download = name;
	a.click();
	console.log("File saved");
}
function loadCanvasData(){
	var a = document.createElement("input");
			a.type = "file";
			a.accept = ".png";
			a.addEventListener("change", function(){
				var file = this.files[0];
				var image = new Image();
						image.src = URL.createObjectURL(file);
						image.onload = function(){
							for(var i=0; i<canvas.length; i++){
								canvas[i].canvasContext.drawImage(image, 0, -canvas[i].top);
							}
						};

				console.log("Data is loaded.");

			}, false);
			a.click();
}
function saveCanvasData(){
	var aCanvas = document.getElementById("extension_big_canvas");
			aCanvas.display = "block";
	var aContext = aCanvas.getContext('2d');

	var image = [];
	for(var i = 0; i < canvas.length; i++){
		var c = canvas[i];
	 	image[i] = new Image();
		image[i].src = c.canvas.toDataURL("image/png");
		image[i].onload = function(){
				aContext.drawImage(this, 0, canvas[parseInt(this.id)].top);

				if(parseInt(this.id)==canvas.length-1)
					writeToFile(fileName, aCanvas.toDataURL("image/png")
																.replace("image/png", "image/octet-stream"));

					aCanvas.display = "none";
		}
		image[i].id = i;
	}


}

//useCanvas
function useCanvas(state){
	if(state){
		document.addEventListener('pointermove', canvasDraw);
		document.addEventListener('pointerdown', canvasSetPosition);
	}else{
		document.removeEventListener('pointermove', canvasDraw);
		document.removeEventListener('pointerdown', canvasSetPosition);
	}
	canvasSetClickable(!state);
}
function canvasDraw(e){
	for(var i=0; i<canvas.length; i++){
		canvas[i].draw(e);
	}
}
function canvasSetPosition(e){
	for(var i=0; i<canvas.length; i++){
		canvas[i].setPosition(e);
	}
}
function canvasSetClickable(state){
	for(var i=0; i<canvas.length; i++){
		if(state){
			canvas[i].canvas.style["pointer-events"] = "none";
		}else{
			canvas[i].canvas.style["pointer-events"] = "auto";
		}
	}

}

//createCanvas
function createCanvas(){
	var count = (size.height-size.height%size.canvasHeight)/size.canvasHeight+1;

	let canvasArr = [];
	for(var i=0; i<count; i++){
		var c = document.createElement('canvas');
				c.id = "extension_canvas_" + i;
				c.style["position"] = "absolute";
				c.style["left"] = "0px";
				c.style["top"] = (i*size.canvasHeight) + "px";
				c.style["width"] = size.width + "px";
				c.style["height"] = size.canvasHeight + "px";
				c.style["display"] = "block";
				c.style["zIndex"] = 3000;
				c.style["pointer-events"] = "none";
				c.style["touchAction"] = "none";

		if(i==count-1){
			c.style["height"] = size.height%size.canvasHeight + "px";
		}

		document.body.insertBefore(c, document.body.children[0]);

		canvasArr[i] = new CanvasItem(c);
	}
	console.log("Canvas created.");
	return canvasArr;
}
class CanvasItem{
	constructor(canvas){
		this.canvas = canvas;
		this.canvasContext = canvas.getContext('2d');

		this.lastPosition = {x:0, y:0};
		this.top = parseInt(this.canvas.style["top"].replace("px", ""));

		this.resize();
		this.style = {lineWidth: 10, lineCap: "round", strokeStyle: "#ef9a76"};

	}
	resize(){
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
	}
	setPosition(e) {
		this.lastPosition.x = e.clientX+window.scrollX;
		this.lastPosition.y = e.clientY+window.scrollY-this.top;
	}
	draw(e) {
		// mouse left button must be pressed
		if (e.buttons !== 1) return;

		this.canvasContext.beginPath();

		this.canvasContext.lineWidth = this.style.lineWidth*(e.pressure);
		this.canvasContext.lineCap = this.style.lineCap;
		this.canvasContext.strokeStyle = this.style.strokeStyle;

		this.canvasContext.moveTo(this.lastPosition.x, this.lastPosition.y);
		this.setPosition(e);
		this.canvasContext.lineTo(this.lastPosition.x, this.lastPosition.y);

		this.canvasContext.stroke();
	}
	setColor(color){
		this.style["color"] = color;
	}
	setWidth(width){
		this.style["lineWidth"] = width;
	}
}
let canvas = createCanvas();
createBigCanvas();


//receiver
chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message, sender, sendResponse){
	console.log("I received: " + message.key);

	switch(message.key){
		case "USE_PEN": 		useCanvas(true);
												console.log("USE_PEN");
												break;

		case "LEAVE_PEN": 	useCanvas(false);
												console.log("LEAVE_PEN");
												break;

		case "SAVE_DATA": 	saveCanvasData();
												console.log("SAVE_DATA");
												break;

		case "LOAD_DATA": 	loadCanvasData();
												console.log("LOAD_DATA");
												break;
	}

};
