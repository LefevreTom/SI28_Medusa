// initialize variables
let view = 1; /* 0 = left, 1 = center, 2 = right */

// Scene name should be the same as the folder name 
let sceneName = "scene0";

let scene0centerView = Array.from(['door', 'bed', 'trapdoor', 'stool', 'shrooms']);

GameSave.init({
  progress: { floor: 0 },
  shroomCount: 5,
  inventory: [],
  view: {centerView: scene0centerView}
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
    
    if (GameSave.hasItem('shrooms')) {
        document.getElementById("ui-shroom").style.display = "block";
    }

    // Remove objects that are in the inventory from the view
    let inv = GameSave.getInventory();
    inv.forEach(item => {
        scene0centerView = removeItemAll(scene0centerView, item, true); // true at the end so only the first occurrence is removed
    });
    // load objects for center view
    scene0centerView.forEach(load_object);
}

function shroomEffect() {
    console.log("SHROOM CLICKED");
    let currentShrooms = GameSave.getShrooms();
    let container = document.getElementById("game-container");
    if (currentShrooms > 0 && canShroom) {
        GameSave.setShrooms(currentShrooms - 1);
        // AUDIO
        AudioManager.playSfx('../../assets/audio/sfx/Fiole.mp3');
        AudioManager.crossFade('../../assets/audio/music/Instrudrogue.mp3', 500, true);

        if (currentShrooms - 1 === 0) { document.getElementById("ui-shroom").style.filter = "grayscale(1)"; }
        document.getElementById("shroom-count").textContent = GameSave.getShrooms();
        // Apply effect 
        container.classList.remove("shroom-effect-reverse");
        container.classList.add("shroom-effect");
        canShroom = false;
        // Remove effect after 10 seconds
        setTimeout(() => {
            container.classList.remove("shroom-effect");
            container.classList.add("shroom-effect-reverse");
            canShroom = true;
                
            AudioManager.crossFade('../../assets/audio/music/Musique5mins.mp3', 1000, true);
        }, 15000);
    }
}

// add shroom click listener
document.getElementById("ui-shroom").addEventListener("click", shroomEffect);

// Launch game
window.onload = init;