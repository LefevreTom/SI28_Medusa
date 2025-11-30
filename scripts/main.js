// initialize variables
let typeWriterTimeout;


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
        (currentView.leftView || leftView).forEach(load_object);
    } else if(view === 1) {
        // load objects for center view
        (currentView.centerView || centerView).forEach(load_object);
    } else if(view === 2) {
        // load objects for right view
        (currentView.rightView || rightView).forEach(load_object);
    }
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

function newGame() {
    GameSave.reset();
    changeScene('pages/scene0/mainScene0.html');
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
        }, 50);
    }());
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

// Remove collected items from views
function updateViews() {
    const inventory = GameSave.getInventory();
    const allViews = [leftView, centerView, rightView];

    allViews.forEach(view => {
        // remove all items that are already collected
        inventory.forEach(item => {
            removeItemAll(view, item);
        });
    });
}
