// initialize variables
let view = 1; /* 0 = left, 1 = center, 2 = right */

// Scene name should be the same as the folder name 
const sceneName = "scene1";

const leftView = Array.from(['book']);
const centerView = Array.from([]);
const rightView = Array.from([]);


// Change the view based on input
function changeView(direction) {
    $("#scene").empty(); // Clear current scene

    const background = document.body.style;
    // Change view based on direction
    if(direction === 'left' && view > 0) {
        background.backgroundPosition = 'left';
        view -= 1;
    } else if(direction === 'right' && view < 2) {
        background.backgroundPosition = 'right';
        view += 1;
    } else {
        console.log('Invalid direction');
    }
    updatePosition(background);
}

// load pages inside the scene
function load_page(page, e) {
    console.log("Trying to load : " + page);
    $("#scene").load(page+".html");
}

// load objects inside the scene
function load_object(page) {
    console.log("Trying to load : " + page);
    load_page("objects/"+ page + "/" + page);
}

// Update the scene based on current view
function updatePosition(background) {
    const leftBtn = document.getElementById('left');
    const rightBtn = document.getElementById('right');
    // Update background position based on current view
    if(view === 0) {
        background.backgroundPosition = 'left';
        leftBtn.style.visibility = 'hidden';

        // load objects for left view
        leftView.forEach(load_object);
    } else if(view === 1) {
        background.backgroundPosition = 'center';
        leftBtn.style.visibility = 'visible';
        rightBtn.style.visibility = 'visible';
        
        // load objects for center view
        centerView.forEach(load_object);
    } else if(view === 2) {
        background.backgroundPosition = 'right';
        rightBtn.style.visibility = 'hidden';
        
        // load objects for right view
        rightView.forEach(load_object);
    }
}

function changeScene(scene) {
    // fade to black
    document.getElementById('transitionScreen').style.zIndex = 200;
    document.getElementById('transitionScreen').style.opacity = 1;
    // wait for the transition to finish
    setTimeout(() => {
        // change scene
        window.location.href = scene;
    }, 2000);
}

// Initialize the game
let init = () => {
    // fade from black
    document.getElementById('transitionScreen').style.opacity = 0;
    // wait for animation to finish
    setTimeout(() => {
        document.getElementById('transitionScreen').style.zIndex = -10;
    }, 2000);

    // Event listener for key inputs
    document.addEventListener('keydown', function(event) {
        if(event.key === 'ArrowLeft') {
            changeView('left');
        } else if(event.key === 'ArrowRight') {
            changeView('right');
        }
    });
}

// Launch game
window.onload = init;

