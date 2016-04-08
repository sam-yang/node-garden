var garden = document.getElementById("garden");
garden.width = window.innerWidth;
garden.height = window.innerHeight;
var c = garden.getContext("2d");
garden.style.background = '#000000';

c.imageSmoothingEnabled = false;

var numNodes = 300;
var minDist = 50;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

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
			x: Math.random() * (screenWidth + 2 * minDist),
			y: Math.random() * (screenHeight + 2 * minDist),
			vx: Math.random() * .2+ .2,
			vy: Math.random() * .2 + .2,
			size: 1,
			opacity: "rgba(256, 256, 256, 1)"
		};
		nodes.push(node);
	}	
}

function update(nArray) {
	for (var i = 0; i < nArray.length; i++) {
		nArray[i].x += nArray[i].vx;
		nArray[i].y += nArray[i].vy;
		if (nArray[i].x > (screenWidth + minDist) || nArray[i].y > (screenHeight + minDist)) {
			if (Math.random() < screenWidth/(screenHeight + screenWidth)) {
				nArray[i].x = Math.random() * screenWidth;
				nArray[i].y = -minDist;
			}
			else {
				nArray[i].y = Math.random() * screenHeight;
				nArray[i].x = -minDist;
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
			if (dist < minDist) {
				c.beginPath();
				c.moveTo(nArray[i].x, nArray[i].y);
				c.lineTo(nArray[j].x, nArray[j].y);
				c.lineWidth = .5;
				c.strokeStyle = "rgba(256, 256, 256, " + ((minDist - dist)/minDist)  + ")";
				c.stroke();
			}
		}
	}
}
function calcDist(node1, node2) {
	return Math.sqrt((node1.x - node2.x)*(node1.x - node2.x) + (node1.y - node2.y)*(node1.y - node2.y));
}

function drawupdate() {
		c.clearRect(0, 0, screenWidth, screenHeight);
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
	nodes.push(node);
}

initNodes();
requestAnimationFrame(drawupdate);
