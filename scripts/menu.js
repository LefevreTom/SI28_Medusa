let init = () => {
    document.getElementById('transitionScreen').style.opacity = 1;
    // fade from black
    document.getElementById('transitionScreen').style.opacity = 0;
    // wait for animation to finish
    setTimeout(() => {
        document.getElementById('transitionScreen').style.zIndex = -10;
    }, 2000);

    // Hide "Continue " button
    document.getElementById('continueGame').style.display = 'none';

    // if saved progress -> show "Continue"
    if (Object.keys(GameSave.getProgress()).length > 0) {
        document.getElementById('continueGame').style.display = 'block';
    }
}

function credit() {
    window.location.href = "../../credits.html";
}
function home() {
    window.location.href = "../../index.html";
}

// Launch game
// window.onload = init;
window.addEventListener('pageshow', init);

