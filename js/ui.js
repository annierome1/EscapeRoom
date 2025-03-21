export function drawMap(game) {
    const mapContainer = document.getElementById("game-map");
    if (!mapContainer) {
      console.error("Map container not found!");
      return;
    }
    mapContainer.innerHTML = "";
  
    //Create an SVG element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "400");
    svg.setAttribute("height", "400");
    mapContainer.appendChild(svg);
  
    //Calculate room positions in a circle
    const centerX = 200, centerY = 200, radius = 150;
    const roomPositions = {};
    const numRooms = game.graph.numRooms;
    for (let i = 0; i < numRooms; i++) {
      const angle = (2 * Math.PI * i) / numRooms;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      roomPositions[i] = { x, y };
    }
  
    //Draw edges (connections between rooms)
    for (const room in game.graph.edges) {
      const fromPos = roomPositions[room];
      game.graph.edges[room].forEach(neighbor => {
        // Only draw one edge for each pair to avoid duplicates
        if (parseInt(neighbor) > parseInt(room)) {
          const toPos = roomPositions[neighbor];
          const line = document.createElementNS(svgNS, "line");
          line.setAttribute("x1", fromPos.x);
          line.setAttribute("y1", fromPos.y);
          line.setAttribute("x2", toPos.x);
          line.setAttribute("y2", toPos.y);
          line.setAttribute("stroke", "black");
          svg.appendChild(line);
        }
      });
    }
  
    // 3. Draw room nodes
    for (let i = 0; i < numRooms; i++) {
      const { x, y } = roomPositions[i];
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", 15);
  
      // Determine fill color:
      // - Current room: red
      // - Visited (and not current): gray
      // - Unvisited: blue
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
  
      // Add room label (number)
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", x - 5);
      text.setAttribute("y", y + 5);
      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "12");
      text.textContent = i;
      svg.appendChild(text);
    }
  }