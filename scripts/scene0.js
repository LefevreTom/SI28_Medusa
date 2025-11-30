// initialize variables
let view = 1; /* 0 = left, 1 = center, 2 = right */

// Scene name should be the same as the folder name 
let sceneName = "scene0";

let centerView = Array.from(['door', 'bed', 'trapdoor', 'stool']);

GameSave.init({
  progress: { floor: 0, time: 0 },
  inventory: [],
  view: {centerView: centerView}
});

// Save the game before the page is unloaded
window.addEventListener("beforeunload", GameSave.save);

////////////////////////
// Initialize the game//
////////////////////////
let init = () => {
    // fade from black
    document.getElementById('transitionScreen').style.opacity = 0;
    // wait for animation to finish
    setTimeout(() => {
        document.getElementById('transitionScreen').style.zIndex = -10;
    }, 2000);
    
    // load objects for center view
    centerView.forEach(load_object);
}

// Launch game
window.onload = init;