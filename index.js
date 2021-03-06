var garden = document.getElementById("garden");
garden.width = window.innerWidth;
garden.height = window.innerHeight;
var c = garden.getContext("2d");

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var numNodes = screenWidth/10;
var minLinkDist = screenWidth/23;
var minGravDist = 100;
var gravLevel = .1;
var minMerge = 1;
var massProp = 4;
var minMargin = minLinkDist;

// var nodeSlider = document.getElementById("nodes-slider");
// nodeSlider.max = numNodes * 2;
// nodeSlider.value = numNodes;
// nodeSlider.oninput = function() {
// 	if (this.value > nodes.length) {
// 		while (this.value > nodes.length) {
// 			var node = {};
// 			resetNode(node);
// 			node.x = Math.random() * screenWidth;
// 			node.y = Math.random() * screenHeight;
// 			nodes.push(node);
// 		}
// 	}
// 	else {
// 		while (this.value < nodes.length) {
// 			nodes.pop();
// 		}
// 	}
// }
// var linkSlider = document.getElementById("link-slider");
// linkSlider.max = minLinkDist * 2;
// linkSlider.value = minLinkDist;
// linkSlider.oninput = function() {
// 	minLinkDist = this.value;
// }
// var gravSlider = document.getElementById("grav-slider");
// gravSlider.value = gravLevel;
// gravSlider.oninput = function() {
// 	gravLevel = this.value;
// }

devicePixelRatio = window.devicePixelRatio || 1,
backingStoreRatio = c.webkitBackingStorePixelRatio ||
                    c.mozBackingStorePixelRatio ||
                    c.msBackingStorePixelRatio ||
                    c.oBackingStorePixelRatio ||
                    c.backingStorePixelRatio || 1,

ratio = devicePixelRatio / backingStoreRatio;
if (devicePixelRatio !== backingStoreRatio) {
    var oldWidth = garden.width;
    var oldHeight = garden.height;

    garden.width = oldWidth * ratio;
    garden.height = oldHeight * ratio;

    garden.style.width = oldWidth + 'px';
    garden.style.height = oldHeight + 'px';

    c.scale(ratio, ratio);
}

var nodes = [];

function initNodes() {
	for (var i = 0; i < numNodes; i++) {
		tempSize = Math.random() * .6 + .4;
		var node = {
			x: Math.floor(Math.random() * (screenWidth + 2 * minLinkDist)),
			y: Math.floor(Math.random() * (screenHeight + 2 * minLinkDist)),
			vx: Math.random() * .2 - .1,
			vy: Math.random() * .2 - .1,
			ax: 0,
			ay: 0,
			size: tempSize,
			mass: tempSize * massProp,
			opacity: "rgba(256, 256, 256, 1)"
		};
		nodes.push(node);
	}	
}

function draw(nArray) {
	for (var i = 0; i < nArray.length; i++) {
		c.beginPath();
		c.arc(nArray[i].x, nArray[i].y, nArray[i].size, 0, Math.PI*2, true);
		c.fillStyle = nArray[i].opacity;
		c.fill();
		for (var j = 0; j < nArray.length; j++) {
			var distsq = calcDistSq(nArray[i], nArray[j]);
			if (distsq < minLinkDist * minLinkDist) {
				c.beginPath();
				c.moveTo(nArray[i].x, nArray[i].y);
				c.lineTo(nArray[j].x, nArray[j].y);
				c.lineWidth = .2 * ((minLinkDist * minLinkDist - distsq)/(minLinkDist * minLinkDist));
				c.strokeStyle = "rgba(256, 256, 256, 1)";
				c.stroke();
			}
		}
	}
}

function update(nArray) {
	for (var i = 0; i < nArray.length; i++) {
		if (nArray[i].x < -minMargin || nArray[i].y < -minMargin || nArray[i].x > (screenWidth + minMargin) || nArray[i].y > (screenHeight + minMargin)) {
			resetNode(nArray[i]);
			continue;
		}
		for (var j = 0; j < nArray.length; j++) {
			if (nArray[j] !== nArray[i]) {
				distsq = calcDistSq(nArray[i], nArray[j]);
				if (distsq < minMerge * minMerge) {
					nArray[j].vx = (nArray[j].vx * nArray[j].mass + nArray[i].vx * nArray[i].mass)/ (nArray[j].mass + nArray[i].mass);
					nArray[j].vy = (nArray[j].vy * nArray[j].mass + nArray[i].vy * nArray[i].mass)/ (nArray[j].mass + nArray[i].mass);
					nArray[j].ax = 0;
					nArray[j].ay = 0;
					if (nArray[j].size + nArray[i].size < 1.5) {
						nArray[j].size += .2 * nArray[i].size;
						nArray[j].mass += .2 * nArray[i].mass;
					}
					else {
						nArray[j].size = 1.5;
					}
					resetNode(nArray[i]);
				}
			}
		}
		nArray[i].ax = calcForceX(nArray[i], nArray);
		nArray[i].ay = calcForceY(nArray[i], nArray);
		nArray[i].vx = (nArray[i].vx + nArray[i].ax);
		nArray[i].vy = (nArray[i].vy + nArray[i].ay);
		nArray[i].x += nArray[i].vx;
		nArray[i].y += nArray[i].vy;
	}
}

function render() {
		c.clearRect(-minLinkDist, -minLinkDist, screenWidth + minLinkDist, screenHeight + minLinkDist);
		draw(nodes);
		update(nodes);
		requestAnimationFrame(render);
}

// function calcDist(node1, node2) {
// 	return Math.sqrt((node1.x - node2.x)*(node1.x - node2.x) + (node1.y - node2.y)*(node1.y - node2.y));
// }
function calcDistSq(node1, node2) {
	return ((node1.x - node2.x)*(node1.x - node2.x) + (node1.y - node2.y)*(node1.y - node2.y));
}

window.addEventListener('resize', resizeCanvas, false);
garden.addEventListener('mousedown', clickNode);

function resizeCanvas() {
	garden.width = window.innerWidth;
	garden.height = window.innerHeight;
	if (devicePixelRatio !== backingStoreRatio) {
	    var oldWidth = garden.width;
	    var oldHeight = garden.height;

	    garden.width = oldWidth * ratio;
	    garden.height = oldHeight * ratio;

	    garden.style.width = oldWidth + 'px';
	    garden.style.height = oldHeight + 'px';

	    c.scale(ratio, ratio);
	}
}

function clickNode() {
	tempSize = Math.random() * .6 + .4;
	var node = {
		x: event.clientX,
		y: event.clientY,
		vx: Math.random() * .2 - .1,
		vy: Math.random() * .2 - .1,
		size: tempSize,
		mass: tempSize * massProp,
		opacity: "rgba(256, 256, 256, 1)"
	}
	nodes.push(node);
}

function calcForceX(node, nArray) {
	var forceX = 0;
	for (var i = 0; i < nArray.length; i++) {
		if (node !== nArray[i]) {
			var distsq = calcDistSq(node, nArray[i]);
			if (distsq < minGravDist * minGravDist){
				var force = (gravLevel * node.mass * nArray[i].mass) / (distsq);
				forceX += (force * (nArray[i].x - node.x) / Math.sqrt(distsq));		
			}
		}
	}
	return forceX;
}
function calcForceY(node, nArray) {
	var forceY = 0;
	for (var i = 0; i < nArray.length; i++) {
		if (node !== nArray[i]) {
			var distsq = calcDistSq(node, nArray[i]);
			if (distsq < minGravDist * minGravDist){
				var force = (gravLevel * node.mass * nArray[i].mass) / (distsq);
				forceY += (force * (nArray[i].y - node.y) / Math.sqrt(distsq));			
			}
		}
	}
	return forceY;
}
function resetNode(node) {
	tempSize = Math.random() * .6 + .4;
	if (Math.random() < .5) {
		if (Math.random() < screenWidth/(screenHeight + screenWidth)) {
			node.x = Math.random() * screenWidth;
			node.y = -minMargin;
			node.vx = Math.random() * .4 - .2;
			node.vy = Math.random() * .2;
			node.ax = 0;
			node.ay = 0;
			node.size = tempSize;
			node.mass = tempSize * massProp;
		}
		else {
			node.y = Math.random() * screenHeight;
			node.x = -minMargin;
			node.vx = Math.random() * .2;
			node.vy = Math.random() * .4 - .2;
			node.ax = 0;
			node.ay = 0;
			node.size = tempSize;
			node.mass = tempSize * massProp;
		}
	}
	else {
		if (Math.random() < screenWidth/(screenHeight + screenWidth)) {
			node.x = Math.random() * screenWidth;
			node.y = screenHeight + minMargin;
			node.vx = Math.random() * .4 - .2;
			node.vy = Math.random() * -.2;
			node.ax = 0;
			node.ay = 0;
			node.size = tempSize;
			node.mass = tempSize * massProp;
		}
		else {
			node.y = Math.random() * screenHeight;
			node.x = screenWidth + minMargin;
			node.vx = Math.random() * -.2;
			node.vy = Math.random() * .4 - .2;
			node.ax = 0;
			node.ay = 0;
			node.size = tempSize;
			node.mass = tempSize * massProp;
		}
	}
}

initNodes();
requestAnimationFrame(render);
