let num1, num2, correctAnswer;
let currentPlayer = "";
let currentScore = 0;
let highscoreKey = 'highscroes';
let playerNameKey = 'playername';

function showSection(section) {
    const highscoreBoard = document.querySelector('.highscore-board');
    const taskBoard = document.getElementById('task-board');

    if (section === 'highscores') {
        highscoreBoard.style.display = 'block';
        displayHighscores()
        taskBoard.style.display = 'none';
    } else {
        highscoreBoard.style.display = 'none';
        taskBoard.style.display = 'block';
    }
}

// Funktion zum Speichern und Initialisieren des Namens
function saveName() {
    const nameInput = document.getElementById('name-input').value.trim();
    if (nameInput) {
        localStorage.setItem(playerNameKey, nameInput);
        currentScore = 0;
        document.getElementById('score').innerText = currentScore;
        document.getElementById('unknown-user-section').style.display = 'none';
        document.getElementById('welcome-message').style.display = 'block';
        document.getElementById('taskBoard').style.display = 'block';
        document.getElementById('main').style.display = 'block';
        startGame();
    } else {
        alert("Bitte gib einen Namen ein.");
    }
}

// Funktion zum Starten des Spiels
function startGame() {
    document.querySelector('.task').style.display = 'block';
    document.querySelector('.answer-section').style.display = 'block';
    document.querySelector('.score').style.display = 'block';

    // Verstecke den "Los geht's!"-Button
    document.getElementById('start-game-button').style.display = 'none';
    document.getElementById('new-task-button').style.display = 'block';
    generateTask();
}

// Generiert eine neue zufällige Einmaleins-Aufgabe
function generateTask() {

    num1 = Math.floor(Math.random() * 20) + 1;  // Für kleines (1-10) und großes Einmaleins (11-20)
    num2 = Math.floor(Math.random() * 10) + 1;  // Faktor von 1 bis 10

    correctAnswer = num1 * num2;
    document.getElementById('multiplication-task').innerText = `${num1} × ${num2} = ?`;
    document.querySelector('.answer-section').style.display = 'inherit';
    document.querySelector('.task').style.display = 'inherit';
    document.getElementById('feedback').innerText = '';
    document.getElementById('user-answer').value = '';  // Löscht die vorherige Antwort

}

// Funktion zum Abrufen des aktuellen Datums im Format YYYY-MM-DD
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Funktion zum Generieren des Schlüssels für den Punktestand
function getScoreKey(type = 'daily') {
    return `mathGameScore_${type}`;
}

// Überprüfen, ob ein Name im localStorage gespeichert ist
window.onload = function () {
    const storedName = localStorage.getItem(playerNameKey);
    if (storedName) {
        document.getElementById('stored-name').innerText = storedName;
        document.getElementById('welcome-message').style.display = 'block';
        document.getElementById('name-input-section').style.display = 'none';

        // Load the score for the current date
        const scoreKey = getScoreKey(currentPlayer, getCurrentDate());
        let highscores = JSON.parse(localStorage.getItem(highscoreKey)) || [];
        const currentDate = getCurrentDate();

        // Check if there's already an entry for the current date
        const existingEntry = highscores.find(entry => entry.date === currentDate);

        entry = existingEntry ?? { date: currentDate, score : 0 }
        currentScore = entry.score;
        document.getElementById('score').innerText = entry.score;
        document.getElementById('main').style.display = 'block';
    }
    else {
        document.getElementById('unknown-user-section').style.display = 'block';
    }
}

// Überprüft die Antwort des Benutzers
function checkAnswer() {

    const userAnswer = parseInt(document.getElementById('user-answer').value);

    if (isNaN(userAnswer)) {
        document.getElementById('feedback').innerText = 'Bitte gib eine gültige Zahl ein.';
    } else if (userAnswer === correctAnswer) {
        document.getElementById('feedback').innerText = `Richtig! Gut gemacht! Die Lösung ist ${correctAnswer}`;
        document.querySelector('.answer-section').style.display = 'none';
        // Punkte hinzufügen
        currentScore += 10;
        // Highscore aktualisieren
        updateHighscore(currentScore);
        // Punkte im UI aktualisieren
        document.getElementById('score').innerText = currentScore;
        setTimeout(generateTask, 1500);  // Generiert nach 2 Sekunden eine neue Aufgabe
    } else {
        document.getElementById('feedback').innerText = `Falsch. Die richtige Antwort ist ${correctAnswer}.`;
        setTimeout(generateTask, 5000);  // Generiert nach 2 Sekunden eine neue Aufgabe
    }
}
function updateHighscore(score) {
    let highscores = JSON.parse(localStorage.getItem(highscoreKey)) || [];
    const currentDate = getCurrentDate();

    // Check if there's already an entry for the current date
    const existingEntry = highscores.find(entry => entry.date === currentDate);

    if (existingEntry) {

        existingEntry.score = score;
    } else {
        // Add a new entry if there's no entry for the current date
        highscores.push({ date: currentDate, score });
    }

    // Keep only the top 10 scores
    if (highscores.length > 10) {
        highscores = highscores.slice(0, 10);
    }

    localStorage.setItem(highscoreKey, JSON.stringify(highscores));
}

function displayHighscores() {
    const highscoreList = document.getElementById('highscore-list');
    let highscores = JSON.parse(localStorage.getItem(highscoreKey)) || [];

    highscoreList.innerHTML = '';

    highscores.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.date}: ${entry.score} Punkte`;
        highscoreList.appendChild(listItem);
    });

    document.querySelector('.highscore-board').style.display = 'block';
}