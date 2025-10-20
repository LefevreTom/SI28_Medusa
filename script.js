
// Change the view based on input
function changeView(direction) {
    // Get the body background style
    const background = document.body.style;
    const leftBtn = document.getElementById('left');
    const rightBtn = document.getElementById('right');

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

    // Update background position based on current view
    if(view === 0) {
        background.backgroundPosition = 'left';
        leftBtn.style.visibility = 'hidden';
    } else if(view === 1) {
        background.backgroundPosition = 'center';
        leftBtn.style.visibility = 'visible';
        rightBtn.style.visibility = 'visible';
    } else if(view === 2) {
        background.backgroundPosition = 'right';
        rightBtn.style.visibility = 'hidden';
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

// Render objects in the scene
function renderObjects() {
    // render clickable objects in the scene
    const scene = document.getElementById('scene');
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

// initialize variables
let view = 1; /* 0 = left, 1 = center, 2 = right */

// Launch game
window.onload = init;

