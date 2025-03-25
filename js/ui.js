export function drawMap(game) {
  const mapContainer = document.getElementById("game-map");
  if (!mapContainer) {
    console.error("Map container not found!");
    return;
  }
  mapContainer.innerHTML = "";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "400");
  svg.setAttribute("height", "400");
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

  // Draw edges (connections between rooms)
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

        const isAvailable = game.currentRoom !== null &&
          game.graph.edges[game.currentRoom].includes(parseInt(neighbor)) &&
          parseInt(room) === game.currentRoom;

        line.setAttribute("stroke", isAvailable ? "green" : "gray");
        line.setAttribute("stroke-width", isAvailable ? "3" : "1.5");

        svg.appendChild(line);
      }
    });
  }

  // Draw transition line from lastRoom to currentRoom
  if (game.lastRoom !== null && game.lastRoom !== game.currentRoom) {
    const lastCoords = roomPositions[game.lastRoom];
    const currentCoords = roomPositions[game.currentRoom];
    const moveLine = document.createElementNS(svgNS, "line");
    moveLine.setAttribute("x1", lastCoords.x);
    moveLine.setAttribute("y1", lastCoords.y);
    moveLine.setAttribute("x2", currentCoords.x);
    moveLine.setAttribute("y2", currentCoords.y);
    moveLine.setAttribute("stroke", "orange");
    moveLine.setAttribute("stroke-width", "4");
    svg.appendChild(moveLine);
  }

  // Draw room nodes
  for (let i = 0; i < numRooms; i++) {
    const { x, y } = roomPositions[i];
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 15);

    let fillColor;
    if (i === game.currentRoom) {
      fillColor = "red";
    } else if (game.visited.has(i)) {
      fillColor = "gray";
    } else {
      fillColor = "blue";
    }
    circle.setAttribute("fill", fillColor);
    svg.appendChild(circle);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", x - 5);
    text.setAttribute("y", y + 5);
    text.setAttribute("fill", "white");
    text.setAttribute("font-size", "12");
    text.textContent = i;
    svg.appendChild(text);
  }
} 