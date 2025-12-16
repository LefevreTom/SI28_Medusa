// initialize variables
let typeWriterTimeout;
var canShroom = true;


// Change the view based on input
function changeView(direction) {
    $("#scene").empty(); // Clear current scene

    const background = document.getElementById('game-container').style;
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
    $("#scene").load(page+".html");
}

// load objects inside the scene
function load_object(page) {
    const url = "objects/" + page + "/" + page + ".html";
    $.get(url, function (data) {
        $("#scene").append(data);
    });
}

function updateObjects() {
    $("#scene").empty(); // clear scene
    const currentView = GameSave.getView() || {};
    if(view === 0) {
        // load objects for left view
        (currentView.leftView).forEach(load_object);
    } else if(view === 1) {
        // load objects for center view
        (currentView.centerView).forEach(load_object);
    } else if(view === 2) {
        // load objects for right view
        (currentView.rightView).forEach(load_object);
    }
}

// Update the scene based on current view
function updatePosition(background) {
    const leftBtn = document.getElementById('left');
    const rightBtn = document.getElementById('right');
    const currentView = GameSave.getView();
    // Update background position based on current view
    if(view === 0) {
        background.backgroundPosition = 'left';
        leftBtn.style.visibility = 'hidden';

        // wait for animation to finish
        setTimeout(() => {    
            // load objects for left view
            currentView.leftView.forEach(load_object);
        }, 310);
    } else if(view === 1) {
        background.backgroundPosition = 'center';
        leftBtn.style.visibility = 'visible';
        rightBtn.style.visibility = 'visible';
        
        // wait for animation to finish
        setTimeout(() => {    
            // load objects for center view
            currentView.centerView.forEach(load_object);
        }, 310);
    } else if(view === 2) {
        background.backgroundPosition = 'right';
        rightBtn.style.visibility = 'hidden';
        
        // wait for animation to finish
        setTimeout(() => {    
            // load objects for right view
            currentView.rightView.forEach(load_object);
        }, 310);
    }
}

function changeScene(scene) {
    const screen = document.getElementById('transitionScreen');
    let navigated = false;

    const go = () => {
        if (navigated) return;
        navigated = true;
        window.location.href = scene;
    };

    screen.style.zIndex = 200;
    screen.style.opacity = 1;

    screen.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'opacity') {
            screen.removeEventListener('transitionend', handler);
            go();
        }
    });

    setTimeout(go, 2200); // fallback
}


function newGame() {
    GameSave.reset();
    localStorage.removeItem("currentMusic");
    changeScene('pages/scene0/intro.html');
}

function continueGame() {
    var floor = GameSave.getProgress().floor;
    changeScene('pages/scene'+floor+'/mainScene'+floor+'.html');
}

function closeInteraction(id){
    const interactionBox = document.getElementById(id);
    interactionBox.style.display = 'none';
}

function revealInteraction(id){
    const interactionBox = document.getElementById(id + '_interaction');
    interactionBox.style.display = 'flex';
    callTypeWriter(id);
}

function callTypeWriter(objectName) {
    clearTimeout(typeWriterTimeout);

    const $el = $('#'+objectName+'_interaction .text .typewriter');
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
        }, 25);
    }());
}

function removeItemAll(arr, value, removeAll = true) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
      if (!removeAll) break; // stop after first removal
    } else {
      ++i;
    }
  }
  return arr;
}

function closeAllInteractions() {
    const interactionBoxes = document.querySelectorAll('.interaction');
    interactionBoxes.forEach(box => {
        box.style.display = 'none';
    });
}

function scaleGameContainer() {
    const container = document.getElementById('game-container');
    const wrapper = document.getElementById('game-wrapper');
    
    // Design resolution
    const designWidth = container.offsetWidth;
    const designHeight = container.offsetHeight;
    const designRatio = designWidth / designHeight;
    
    // Available space
    const availableWidth = wrapper.clientWidth;
    const availableHeight = wrapper.clientHeight;
    const availableRatio = availableWidth / availableHeight;
    
    let scale;

    if (availableRatio > designRatio) {
        // Window is wider than design ratio - fit to height
        scale = availableHeight / designHeight;
    } else {
        // Window is taller than design ratio - fit to width
        scale = availableWidth / designWidth;
    }
    
    // Apply the scale
    container.style.transform = `scale(${scale})`;
}

// Multiple listeners to ensure it runs
document.addEventListener('DOMContentLoaded', scaleGameContainer);
window.addEventListener('load', scaleGameContainer);
window.addEventListener('resize', scaleGameContainer);