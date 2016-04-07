var garden = document.getElementById("garden");
var c = garden.getContext("2d");
var nodeSize = 3;
var numNodes = 100;
var screenWidth = 500;
var screenHeight = 500;

function initNodes() {
	var nodes = [];
	for (var i = 0; i < numNodes; i++) {
		var node = {
			x: Math.random() * screenWidth,
			y: Math.random() * screenHeight
		};
		c.beginPath();
		c.arc(node.x, node.y, nodeSize, 0, Math.PI*2, true);
		c.fillStyle = "#000000";
		c.fill();
		nodes.push(node);
	}	
}

initNodes();