let init = () => {
    // fade from black
    document.getElementById('transitionScreen').style.opacity = 0;
    // wait for animation to finish
    setTimeout(() => {
        document.getElementById('transitionScreen').style.zIndex = -10;
    }, 2000);
    
    // Load game state
    GameSave.load();
}

// Launch game
window.onload = init;