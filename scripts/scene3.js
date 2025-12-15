// initialize variables
let view = 1; /* 0 = left, 1 = center, 2 = right */

// Scene name should be the same as the folder name 
let sceneName = "scene3";

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

    // Recreate game views
    if (GameSave.getProgress().floor === 2) {
        let prog = GameSave.getProgress()
        let inv = GameSave.getInventory()
        let shr = GameSave.getShrooms()
        GameSave.reset();
        GameSave.init({
            progress: prog,
            shroomCount: shr,
            inventory: inv,
        });
        GameSave.setProgress({floor: 3});
    }
}

function useJetpack() {
    if (GameSave.hasItem('jerrycan')) {
        const interactionBox = document.getElementById('gameEnd_interaction');
        interactionBox.querySelector('.text p').innerText = "Vous ajoutez de l'essence au jetpack, le mettez en marche, et vous vous envolez loin du dirigeable. Vous êtes sauvé ! il ne reste plus qu'à faire tomber Medusa... Victoire !";
        callTypeWriter("gameEnd");
        interactionBox.querySelector('.options').innerHTML = `<button onclick="rollCredits()">Victoire</button>`
        return;
    } else {
        const interactionBox = document.getElementById('gameEnd_interaction');
        interactionBox.querySelector('.text p').innerText = "Vous sautez hors du dirigeable en essayant d'activer le jetpack, il n'avait malheureusement plus d'essence...";
        callTypeWriter("gameEnd");
        interactionBox.querySelector('.options').innerHTML = `<button onclick="confirmTimerEnd()">Recommencer</button>`
        return;
    }
}

function jump() {
    const interactionBox = document.getElementById('gameEnd_interaction');
    interactionBox.querySelector('.text p').innerText = "Vous sautez hors du dirigeable et vous écrasez lamentablement au sol. Tu es mort. Spoiler : tu n'étais pas un oiseau.";
    callTypeWriter("gameEnd");
    interactionBox.querySelector('.options').innerHTML = `<button onclick="confirmTimerEnd()">Recommencer</button>`
    return;
}

function rollCredits() {

}

// Launch game
window.onload = init;