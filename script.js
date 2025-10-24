// initialize variables
let view = 1; /* 0 = left, 1 = center, 2 = right */
let typeWriterTimeout;

// Game state variables
let gameProgress = {
  floor: 0,
  time: 0,
};
let inventory = [];

// Scene name should be the same as the folder name 
let sceneName = "scene1";

let leftView = Array.from(['book']);
let centerView = Array.from([]);
let rightView = Array.from([]);


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

        // wait for animation to finish
        setTimeout(() => {    
            // load objects for left view
            leftView.forEach(load_object);
        }, 310);
    } else if(view === 1) {
        background.backgroundPosition = 'center';
        leftBtn.style.visibility = 'visible';
        rightBtn.style.visibility = 'visible';
        
        // wait for animation to finish
        setTimeout(() => {    
            // load objects for center view
            centerView.forEach(load_object);
        }, 310);
    } else if(view === 2) {
        background.backgroundPosition = 'right';
        rightBtn.style.visibility = 'hidden';
        
        // wait for animation to finish
        setTimeout(() => {    
            // load objects for right view
            rightView.forEach(load_object);
        }, 310);
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


function closeInteraction(id){
    const interactionBox = document.getElementById(id);
    interactionBox.style.display = 'none';
}

function revealInteraction(id){
    const interactionBox = document.getElementById(id + '_interaction');
    interactionBox.style.display = 'flex';
    callTypeWriter();
}

function callTypeWriter() {
    clearTimeout(typeWriterTimeout);

    const $el = $('.typewriter');
    const fullText = $el.text();
    const length = fullText.length;
    let character = 0;

    // store full text safely and hide content
    $el.data('fulltext', fullText);
    $el.text('');
    $el.css('visibility', 'visible'); // show element right when typing starts

    (function typeWriter() {
        typeWriterTimeout = setTimeout(function() {
            character++;
            $el.text(fullText.substring(0, character));

            if (character < length) {
                typeWriter();
            }
        }, 50);
    }());
}

// Save the game state in local storage
function saveGame() {
  localStorage.setItem("gameProgress", JSON.stringify(gameProgress));
  localStorage.setItem("inventory", JSON.stringify(inventory));
  console.log("Game saved!");
}

// Load the game state from local storage
function loadGame() {
  const savedProgress = localStorage.getItem("gameProgress");
  const savedInventory = localStorage.getItem("inventory");

  if (savedProgress) gameProgress = JSON.parse(savedProgress);
  if (savedInventory) inventory = JSON.parse(savedInventory);

  console.log("Game loaded:", gameProgress, inventory);
}

// Reset the game state is needed
function resetGame() {
  localStorage.removeItem("gameProgress");
  localStorage.removeItem("inventory");
  console.log("Game data cleared!");
}

// Add an item to the inventory
function addItem(item) {
  inventory.push(item);
  saveGame();
}

// Advance to the next floor
function nextFloor() {
  gameProgress.floor++;
  saveGame();
}

// Save the game before the page is unloaded
window.addEventListener("beforeunload", saveGame);

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

    // Event listener for key inputs
    document.addEventListener('keydown', function(event) {
        if(event.key === 'ArrowLeft') {
            changeView('left');
        } else if(event.key === 'ArrowRight') {
            changeView('right');
        }
    });

    // Load game state
    loadGame();

    // Remove collected items from views
    inventory.forEach(item => {
        if(leftView.includes(item)) {
            leftView.pop(item);
        }
        if(centerView.includes(item)) {
            centerView.pop(item);
        }
        if(rightView.includes(item)) {
            rightView.pop(item);
        }
    })
}

// Launch game
window.onload = init;

