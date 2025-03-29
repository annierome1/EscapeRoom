// home.js

export function setupHomepage(startCallback) {
    
    const howToPlay = document.getElementById("how-to-play");
    const startBtn = document.getElementById("btn-start-game");
    if (startBtn) {
      startBtn.addEventListener("click", () => {
        document.getElementById("start-screen").style.display = "none";
        document.getElementById("game-container").style.display = "block";
        startCallback();
      });
    }
  
    //how to play content 


if (howToPlay) {
    const list = howToPlay.querySelector("ul");
    if (list) {
      list.innerHTML = `
        <li>Your goal is to visit every room <strong>once</strong>.</li>
        <li>To move between rooms, click <strong>“Go to Room ...”</strong>.</li>
        <li>To restart the current level, click <strong>“Restart Level”</strong>.</li>
        <li>To start from scratch, click <strong>“Restart Game”</strong>.</li>
        <li>Each room may contain a collectible — collect them all!</li>
        <li>Complete the level to add your found collectibles to your inventory.</li>
        <li>Check your inventory to see what collectibles you’ve gathered!</li>
      `;

  }
}
}