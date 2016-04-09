var garden = document.getElementById("garden");
garden.width = window.innerWidth;
garden.height = window.innerHeight;
var c = garden.getContext("2d");
garden.style.background = '#000022';

c.imageSmoothingEnabled = false;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var numNodes = screenWidth/4;
var minLinkDist = screenWidth/26;
var minGravDist = screenWidth/15;


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
			vx: Math.random() * .8 - .4,
			vy: Math.random() * .8 - .4,
			size: 1,
			opacity: "rgba(256, 256, 256, 1)"
		};
		nodes.push(node);
	}	
}

function update(nArray) {
	for (var i = 0; i < nArray.length; i++) {
		nArray[i].x += nArray[i].vx + calcForceX(nArray[i], nArray);
		nArray[i].y += nArray[i].vy + calcForceY(nArray[i], nArray);
		if (nArray[i].x < -minLinkDist || nArray[i].y < -minLinkDist || nArray[i].x > (screenWidth + minLinkDist) || nArray[i].y > (screenHeight + minLinkDist)) {
			if (Math.random() < .5) {
				if (Math.random() < screenWidth/(screenHeight + screenWidth)) {
					nArray[i].x = Math.random() * screenWidth;
					nArray[i].y = -minLinkDist;
				}
				else {
					nArray[i].y = Math.random() * screenHeight;
					nArray[i].x = -minLinkDist;
				}
			}
			else {
				if (Math.random() < screenWidth/(screenHeight + screenWidth)) {
					nArray[i].x = Math.random() * screenWidth;
					nArray[i].y = screenHeight + minLinkDist;
				}
				else {
					nArray[i].y = Math.random() * screenHeight;
					nArray[i].x = screenWidth + minLinkDist;
				}
			}
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
				c.lineWidth = ((minLinkDist - dist)/minLinkDist) * .5;
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
		vx: Math.random() * .5+ .2,
		vy: Math.random() * .5 + .2,
		size: 1,
		opacity: "rgba(256, 256, 256, 1)"
	}
	c.beginPath();
	c.arc(node.x, node.y, node.size, 0, Math.PI*2, true);
	c.fillStyle = node.opacity;
	c.fill();
	for (var i = 0; i < nodes.length; i++) {
			var dist = calcDist(nodes[i], node);
			if (dist < minLinkDist) {
				c.beginPath();
				c.moveTo(nodes[i].x, nodes[i].y);
				c.lineTo(node.x, node.y);
				c.lineWidth = .5;
				c.strokeStyle = "rgba(256, 256, 256, " + ((minLinkDist - dist)/minLinkDist)  + ")";
				c.stroke();
			}
		}
	nodes.push(node);
}

function calcForceX(node, nArray) {
	var forceX = 0;
	for (var i = 0; i < nArray.length; i++) {
		if (node !== nArray[i]) {
			var dist = calcDist(node, nArray[i]);
			if (dist < minGravDist){
				var force = (10 * node.size * nArray[i].size) / (dist * dist);
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
				var force = (10 * node.size * nArray[i].size) / (dist * dist);
				forceY += (force * (nArray[i].y - node.y) / dist);			
			}
		}
	}
	return forceY;
}

initNodes();
requestAnimationFrame(drawupdate);
