let num1, num2, correctAnswer;
let currentPlayer = "";
let score = 0;

// Funktion zum Speichern und Initialisieren des Namens
function saveName() {
    const nameInput = document.getElementById('name-input').value.trim().toLowerCase();  // Ignoriert Groß-/Kleinschreibung
    if (nameInput) {
        currentPlayer = nameInput.replace(/[^a-z0-9]/gi, '');  // Remove non-alphanumeric characters
        localStorage.setItem('mathGamePlayerName', currentPlayer);
        document.getElementById('user-name').innerText = nameInput.charAt(0).toUpperCase() + nameInput.slice(1);
        
        // Punktestand für den Namen und das aktuelle Datum aus dem localStorage holen
        const scoreKey = getScoreKey(currentPlayer, getCurrentDate());
        score = localStorage.getItem(scoreKey) ? parseInt(localStorage.getItem(scoreKey)) : 0;
        document.getElementById('score').innerText = score;
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
    if (!currentPlayer) {
        return;  // Wenn kein Name eingegeben wurde, keine Aufgabe generieren
    }
    num1 = Math.floor(Math.random() * 20) + 1;  // Für kleines (1-10) und großes Einmaleins (11-20)
    num2 = Math.floor(Math.random() * 10) + 1;  // Faktor von 1 bis 10
      
    correctAnswer = num1 * num2;
    document.getElementById('multiplication-task').innerText = `${num1} × ${num2} = ?`;
    document.querySelector('.answer-section').style.display = 'inherit';
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
function getScoreKey(player, date) {
    return `mathGameScore_${player}_${date}`;
}

// Überprüfen, ob ein Name im localStorage gespeichert ist
window.onload = function() {
    const storedName = localStorage.getItem('mathGamePlayerName');
    if (storedName) {
        currentPlayer = storedName.replace(/[^a-z0-9]/gi, '');  // Remove non-alphanumeric characters
        document.getElementById('stored-name').innerText = storedName.charAt(0).toUpperCase() + storedName.slice(1);
        document.getElementById('welcome-message').style.display = 'block';
        document.getElementById('name-input-section').style.display = 'none';

        // Load the score for the current date
        const scoreKey = getScoreKey(currentPlayer, getCurrentDate());
        score = localStorage.getItem(scoreKey) ? parseInt(localStorage.getItem(scoreKey)) : 0;
        document.getElementById('score').innerText = score;
    }
}

// Überprüft die Antwort des Benutzers
function checkAnswer() {
    if (!currentPlayer) {
        alert("Bitte gib deinen Namen ein, bevor du die Aufgaben löst.");
        return;
    }

    const userAnswer = parseInt(document.getElementById('user-answer').value);

    if (isNaN(userAnswer)) {
        document.getElementById('feedback').innerText = 'Bitte gib eine gültige Zahl ein.';
    } else if (userAnswer === correctAnswer) {
        document.getElementById('feedback').innerText = `Richtig! Gut gemacht! Die Lösung ist ${correctAnswer}`;
        document.querySelector('.answer-section').style.display = 'none';
        // Punkte hinzufügen
        score += 10;
        // Punkte im localStorage speichern für den aktuellen Spieler
        const scoreKey = getScoreKey(currentPlayer, getCurrentDate());
        localStorage.setItem(scoreKey, score);
        // Punkte im UI aktualisieren
        document.getElementById('score').innerText = score;
        setTimeout(generateTask, 1500);  // Generiert nach 2 Sekunden eine neue Aufgabe
    } else {
        document.getElementById('feedback').innerText = `Falsch. Die richtige Antwort ist ${correctAnswer}.`;
        setTimeout(generateTask, 5000);  // Generiert nach 2 Sekunden eine neue Aufgabe
    }
}
