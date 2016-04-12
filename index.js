var garden = document.getElementById("garden");
garden.width = window.innerWidth;
garden.height = window.innerHeight;
var c = garden.getContext("2d");

c.imageSmoothingEnabled = false;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var numNodes = screenWidth/10;
var minLinkDist = screenWidth/23;
var minGravDist = screenWidth;


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
		var node = {
			x: Math.floor(Math.random() * (screenWidth + 2 * minLinkDist)),
			y: Math.floor(Math.random() * (screenHeight + 2 * minLinkDist)),
			vx: Math.random() * .2 - .1,
			vy: Math.random() * .2 - .1,
			ax: 0,
			ay: 0,
			size: Math.random() * .6 + .4,
			opacity: "rgba(256, 256, 256, 1)"
		};
		nodes.push(node);
	}	
}

function update(nArray) {
	for (var i = 0; i < nArray.length; i++) {
		for (var j = 0; j < nArray.length; j++) {
			if (nArray[j] !== nArray[i]) {
				dist = calcDist(nArray[i], nArray[j]);
				if (dist < .5) {
					nArray[j].vx = (nArray[j].vx + nArray[i].vx)/2;
					nArray[j].vy = (nArray[j].vy + nArray[i].vy)/2;
					nArray[j].ax = 0;
					nArray[j].ay = 0;
					if (nArray[j].size + nArray[i].size < 1.5) {
						nArray[j].size += .2 * nArray[i].size;
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
		nArray[i].vx += nArray[i].ax;
		nArray[i].vy += nArray[i].ay;
		nArray[i].x += nArray[i].vx;
		nArray[i].y += nArray[i].vy;
		if (nArray[i].x < -minLinkDist || nArray[i].y < -minLinkDist || nArray[i].x > (screenWidth + minLinkDist) || nArray[i].y > (screenHeight + minLinkDist)) {
			resetNode(nArray[i]);
		}
	}
}

function draw(nArray) {
	for (var i = 0; i < nArray.length; i++) {
		c.beginPath();
		c.arc(nArray[i].x, nArray[i].y, nArray[i].size, 0, Math.PI*2, true);
		c.fillStyle = nArray[i].opacity;
		c.fill();
		for (var j = 0; j < nArray.length; j++) {
			var dist = calcDist(nArray[i], nArray[j]);
			if (dist < minLinkDist) {
				c.beginPath();
				c.moveTo(nArray[i].x, nArray[i].y);
				c.lineTo(nArray[j].x, nArray[j].y);
				c.lineWidth = ((minLinkDist - dist)/minLinkDist) * .3;
				c.strokeStyle = "rgba(256, 256, 256, 1)";
				c.stroke();
			}
		}
	}
}
function calcDist(node1, node2) {
	return Math.sqrt((node1.x - node2.x)*(node1.x - node2.x) + (node1.y - node2.y)*(node1.y - node2.y));
}

function drawupdate() {
		c.clearRect(-minLinkDist, -minLinkDist, screenWidth + minLinkDist, screenHeight + minLinkDist);
		draw(nodes);
		update(nodes);
		requestAnimationFrame(drawupdate);

}
window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('click', addNode);

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

function addNode() {
	var node = {
		x: event.clientX,
		y: event.clientY,
		vx: Math.random() * .2 - .1,
		vy: Math.random() * .2 - .1,
		size: Math.random() * .8 + .2,
		opacity: "rgba(256, 256, 256, 1)"
	}
	nodes.push(node);
}

function calcForceX(node, nArray) {
	var forceX = 0;
	for (var i = 0; i < nArray.length; i++) {
		if (node !== nArray[i]) {
			var dist = calcDist(node, nArray[i]);
			if (dist < minGravDist){
				var force = (.2 * node.size * nArray[i].size) / (dist * dist);
				forceX += (force * (nArray[i].x - node.x) / dist);		
			}
		}
	}
	return forceX;
}
function calcForceY(node, nArray) {
	var forceY = 0;
	for (var i = 0; i < nArray.length; i++) {
		if (node !== nArray[i]) {
			var dist = calcDist(node, nArray[i]);
			if (dist < minGravDist){
				var force = (.2 * node.size * nArray[i].size) / (dist * dist);
				forceY += (force * (nArray[i].y - node.y) / dist);			
			}
		}
	}
	return forceY;
}
function resetNode(node) {
	if (Math.random() < .5) {
		if (Math.random() < screenWidth/(screenHeight + screenWidth)) {
			node.x = Math.random() * screenWidth;
			node.y = -minLinkDist;
			node.vx = Math.random() * .2 - .1;
			node.vy = Math.random() * .1;
			node.ax = 0;
			node.ay = 0;
			node.size = Math.random() * .6 + .4;
		}
		else {
			node.y = Math.random() * screenHeight;
			node.x = -minLinkDist;
			node.vx = Math.random() * .1;
			node.vy = Math.random() * .2 - .1;
			node.ax = 0;
			node.ay = 0;
			node.size = Math.random() * .6 + .4;
		}
	}
	else {
		if (Math.random() < screenWidth/(screenHeight + screenWidth)) {
			node.x = Math.random() * screenWidth;
			node.y = screenHeight + minLinkDist;
			node.vx = Math.random() * .2 - .1;
			node.vy = Math.random() * -.1;
			node.ax = 0;
			node.ay = 0;
			node.size = Math.random() * .6+ .4;
		}
		else {
			node.y = Math.random() * screenHeight;
			node.x = screenWidth + minLinkDist;
			node.vx = Math.random() * -.1;
			node.vy = Math.random() * .2 - .1;
			node.ax = 0;
			node.ay = 0;
			node.size = Math.random() * .6 + .4;
		}
	}
}

initNodes();
requestAnimationFrame(drawupdate);
