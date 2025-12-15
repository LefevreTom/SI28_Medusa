// initialize variables
let view = 1; /* 0 = left, 1 = center, 2 = right */

// Scene name should be the same as the folder name 
let sceneName = "scene3";

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

    // Recreate game views
    if (GameSave.getProgress().floor === 2) {
        let prog = GameSave.getProgress()
        let inv = GameSave.getInventory()
        let shr = GameSave.getShrooms()
        GameSave.reset();
        GameSave.init({
            progress: prog,
            shroomCount: shr,
            inventory: inv,
        });
        GameSave.setProgress({floor: 3});
    }
}
// Launch game
window.onload = init;