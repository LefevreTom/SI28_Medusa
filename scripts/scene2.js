// initialize variables
let view = 1; /* 0 = left, 1 = center, 2 = right */

// Scene name should be the same as the folder name 
let sceneName = "scene2";

let scene2leftView = Array.from(['battery', 'radio']);
let scene2centerView = Array.from(['painting', 'torch']);
let scene2rightView = Array.from(['matches', 'jerrycan']);

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
    scene2centerView.forEach(load_object);

    // Set initial shroom count in UI
    document.getElementById("shroom-count").textContent = GameSave.getShrooms();

    // Event listener for key inputs
    document.addEventListener('keydown', function(event) {
        if(event.key === 'ArrowLeft') {
            changeView('left');
        } else if(event.key === 'ArrowRight') {
            changeView('right');
        }
    });
    
    var scene2Views = {
        leftView: scene2leftView, 
        centerView: scene2centerView, 
        rightView: scene2rightView
    };
    // Recreate game views
    if (GameSave.getProgress().floor === 0) {
        let prog = GameSave.getProgress()
        let inv = GameSave.getInventory()
        let shr = GameSave.getShrooms()
        GameSave.reset();
        GameSave.init({
            progress: prog,
            shroomCount: shr,
            inventory: inv,
            view: scene2Views
        });
        GameSave.setProgress({floor: 2});
    }

    // Preload images
    // For each objects in scene2Views
    Object.values(scene2Views).flat().forEach(item => {
        preload(`../../pages/scene2/objects/${item}/${item}.png`);
    });

    // updateViews();
}

var images = [];
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
        console.log('preloading :' + preload.arguments[i]);
    }
}

function shroomEffect() {
    console.log("SHROOM CLICKED");
    let currentShrooms = GameSave.getShrooms();
    let container = document.getElementById("game-container");
    if (currentShrooms > 0 && canShroom) {
        GameSave.setShrooms(currentShrooms - 1);
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
        }, 15000);
    }
}

// add shroom click listener
document.getElementById("ui-shroom").addEventListener("click", shroomEffect);

// Launch game
window.onload = init;