// gamesave.js
const GameSave = (() => {
    const SAVE_KEY = "Medusa_save";

    // --- Load existing data or initialize ---
    function getSave() {
        const data = localStorage.getItem(SAVE_KEY);
        return data ? JSON.parse(data) : { progress: {}, inventory: [] };
    }

    // --- Save data to localStorage ---
    function save(data) {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    }

    // --- Set or update progress object ---
    function setProgress(progressObj) {
        const data = getSave();
        data.progress = { ...data.progress, ...progressObj };
        save(data);
    }

    // --- Get current progress ---
    function getProgress() {
        return getSave().progress;
    }

    // --- Add item to inventory ---
    function addItem(item) {
        const data = getSave();
        if (!data.inventory.includes(item)) {
            data.inventory.push(item);
            save(data);
        }
    }

    // --- Remove item from inventory ---
    function removeItem(item) {
        const data = getSave();
        data.inventory = data.inventory.filter(i => i !== item);
        save(data);
    }

    // --- Get inventory ---
    function getInventory() {
        return getSave().inventory;
    }

    // --- Reset / clear all data ---
    function reset() {
        localStorage.removeItem(SAVE_KEY);
    }

    // --- Load all (useful for debugging or restoring state) ---
    function load() {
        return getSave();
    }

    // --- Initialize the storage for the game ---
    function init(defaultData = { progress: {}, inventory: [] }) {
        if (!localStorage.getItem(SAVE_KEY)) {
            save(defaultData);
        }
    }

    // Public API
    return {
        setProgress,
        getProgress,
        addItem,
        removeItem,
        getInventory,
        reset,
        load
    };
})();
