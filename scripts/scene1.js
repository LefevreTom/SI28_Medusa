// initialize variables
let view = 1; /* 0 = left, 1 = center, 2 = right */

// Scene name should be the same as the folder name 
let sceneName = "scene1";

let scene1leftView = Array.from(['battery', 'radio']);
let scene1centerView = Array.from(['painting', 'torch']);
let scene1rightView = Array.from(['matches', 'jerrycan']);

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
    scene1centerView.forEach(load_object);

    // Event listener for key inputs
    document.addEventListener('keydown', function(event) {
        if(event.key === 'ArrowLeft') {
            changeView('left');
        } else if(event.key === 'ArrowRight') {
            changeView('right');
        }
    });
    
    // Recreate game views
    if (GameSave.getProgress().floor === 0) {
        let prog = GameSave.getProgress()
        let inv = GameSave.getInventory()
        GameSave.reset();
        GameSave.init({
            progress: prog,
            inventory: inv,
            view: {
                leftView: scene1leftView,
                centerView: scene1centerView,
                rightView: scene1rightView
            }
        });
        GameSave.setProgress({floor: 1});
    }

    // updateViews();
}

// Launch game
window.onload = init;