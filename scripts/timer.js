let timerInterval = null;
let isPaused = false;

// Convert seconds to MM:SS
function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Called on every page load
function initTimer() {
    let remaining = GameSave.getTimer();

    if (remaining === null || remaining <= 0) {
        // New game = 5 minutes
        remaining = 300;
        GameSave.setTimer(remaining);
    }

    updateTimerDisplay(remaining);
    startTimer(remaining);
}

function startTimer(remaining) {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (isPaused) return;

        remaining--;

        GameSave.setTimer(remaining);
        updateTimerDisplay(remaining);

        if (remaining <= 0) {
            clearInterval(timerInterval);
            GameSave.setTimer(0);
            onTimerEnd();
        }
    }, 1000);
}

// Update UI
function updateTimerDisplay(seconds) {
    const timerEl = document.getElementById("timer");
    timerEl.textContent = formatTime(seconds);
}

// Triggered when time reaches 0
function onTimerEnd() {
    const uiEl = document.getElementById("UI");
    const sound = document.getElementById("timerEndSound");

    // Red flash effect
    uiEl.classList.add("timer-flash");

    // Play sound
    sound.play();

    // Reset save file completely
    GameSave.reset();

    // Redirect after 4 sec so sound & animation can be seen/heard
    setTimeout(() => {
        window.location.href = "../../index.html";
    }, 4000);
}

// Pause timer
function pauseTimer() {
    isPaused = true;
}

// Resume timer
function resumeTimer() {
    isPaused = false;
}

// Optional: auto-pause when leaving the page
window.addEventListener("beforeunload", () => {
    pauseTimer();
});
