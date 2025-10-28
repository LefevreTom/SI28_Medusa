let init = () => {
    // fade from black
    document.getElementById('transitionScreen').style.opacity = 0;
    // wait for animation to finish
    setTimeout(() => {
        document.getElementById('transitionScreen').style.zIndex = -10;
    }, 2000);

    // Hide "Continue " button
    document.getElementById('continueGame').hidden = true;

    // if saved progress -> show "Continue"
    if (Object.keys(GameSave.getProgress()).length > 0) {
        document.getElementById('continueGame').hidden = false;
    }
}

// Launch game
window.onload = init;