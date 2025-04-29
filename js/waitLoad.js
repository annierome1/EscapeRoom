// waitForBackgroundImage.js
export function waitForBackgroundImageToLoad(container, callback) {
    const bgImage = window.getComputedStyle(container).backgroundImage;
    const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
  
    if (!urlMatch) {
      console.error("No background image found on container.");
      callback();
      return;
    }
  
    const img = new Image();
    img.src = urlMatch[1];
  
    img.onload = () => {
      console.log("✅ Background image fully loaded.");
      callback();
    };
  
    img.onerror = () => {
      console.error("⚠️ Error loading background image. Proceeding anyway...");
      callback();
    };
  }
  