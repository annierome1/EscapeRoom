//ui.js
export function drawMap(game, customContainerId = "game-map") {
  // Attempt to grab the container
  let mapContainer = document.getElementById(customContainerId);
  
  // If it doesn't exist, create it and append it to #game-output
  if (!mapContainer) {
    console.warn(`Map container #${customContainerId} not found in drawMap. Creating a new one.`);
    const gameOutput = document.getElementById("game-output");
    mapContainer = document.createElement("div");
    mapContainer.id = customContainerId;
    // Set basic size if needed

    gameOutput.appendChild(mapContainer);
  }
  
  // Clear the container's contents
  mapContainer.innerHTML = "";

  // Inject pulse CSS if not already added
  if (!document.getElementById("pulse-style")) {
    const style = document.createElement("style");
    style.id = "pulse-style";
    style.innerHTML = `
      .pulse-node {
        animation: greenPulse 1.5s infinite ease-in-out;
        filter: drop-shadow(0 0 6px limegreen);
      }
      @keyframes greenPulse {
        0% { r: 15; opacity: 0.9; }
        50% { r: 18; opacity: 0.5; }
        100% { r: 15; opacity: 0.9; }
      }
    `;
    document.head.appendChild(style);
  }

  const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("viewBox", "0 0 400 400"); 
svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
svg.style.width = "400px";  // <-- fixed for desktop
svg.style.height = "400px"; 
svg.style.maxWidth = "90%"; // <-- allow shrinking
svg.style.maxHeight = "90%"; 
svg.style.display = "block"; // remove any inline weirdness
svg.style.margin = "0 auto"; // center it
mapContainer.appendChild(svg);


  const centerX = 200, centerY = 200, radius = 150;


  const roomPositions = {};
  const numRooms = game.graph.numRooms;
  for (let i = 0; i < numRooms; i++) {
    const angle = (2 * Math.PI * i) / numRooms;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    roomPositions[i] = { x, y };
  }

  // Draw all edges (default style)
  for (const room in game.graph.edges) {
    const fromPos = roomPositions[room];
    game.graph.edges[room].forEach(neighbor => {
      if (parseInt(neighbor) > parseInt(room)) {
        const toPos = roomPositions[neighbor];
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", fromPos.x);
        line.setAttribute("y1", fromPos.y);
        line.setAttribute("x2", toPos.x);
        line.setAttribute("y2", toPos.y);
        line.setAttribute("stroke", "#555");
        line.setAttribute("stroke-width", "1.5");
        svg.appendChild(line);
      }
    });
  }

  // Draw visited path (solid orange line)
  const visitedArray = Array.from(game.visited);
  for (let i = 1; i < visitedArray.length; i++) {
    const from = roomPositions[visitedArray[i - 1]];
    const to = roomPositions[visitedArray[i]];
    const pathLine = document.createElementNS(svgNS, "line");
    pathLine.setAttribute("x1", from.x);
    pathLine.setAttribute("y1", from.y);
    pathLine.setAttribute("x2", to.x);
    pathLine.setAttribute("y2", to.y);
    pathLine.setAttribute("stroke", "orange");
    pathLine.setAttribute("stroke-width", "3");
    svg.appendChild(pathLine);
  }

  // Draw available paths from current room (highlighted with dashed limegreen)
  if (game.currentRoom !== null && game.graph.edges[game.currentRoom]) {
    const currentPos = roomPositions[game.currentRoom];
    game.graph.edges[game.currentRoom].forEach(neighbor => {
      if (!game.visited.has(neighbor)) {
        const neighborPos = roomPositions[neighbor];
        const availLine = document.createElementNS(svgNS, "line");
        availLine.setAttribute("x1", currentPos.x);
        availLine.setAttribute("y1", currentPos.y);
        availLine.setAttribute("x2", neighborPos.x);
        availLine.setAttribute("y2", neighborPos.y);
        availLine.setAttribute("stroke", "limegreen");
        availLine.setAttribute("stroke-width", "3");
        availLine.setAttribute("stroke-dasharray", "4,2");
        svg.appendChild(availLine);
      }
    });
  }

  // Draw room nodes
  for (let i = 0; i < numRooms; i++) {
    const { x, y } = roomPositions[i];
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 15);

    const isNeighbor = game.graph.edges[game.currentRoom]?.includes(i) && !game.visited.has(i);

    if (i === game.currentRoom) {
      circle.setAttribute("fill", "red");
    } else if (game.visited.has(i)) {
      circle.setAttribute("fill", "gray");
    } else if (isNeighbor) {
      circle.setAttribute("fill", "limegreen");
      circle.classList.add("pulse-node");
    } else {
      circle.setAttribute("fill", "blue");
    }

    circle.setAttribute("stroke", "white");
    circle.setAttribute("stroke-width", "2");
    svg.appendChild(circle);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", x - 4);
    text.setAttribute("y", y + 5);
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "12");
    text.textContent = i;
    svg.appendChild(text);
  }
}
