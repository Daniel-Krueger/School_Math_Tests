let num1, num2, correctAnswer;
let currentScore = 0;
const highscoreKey = 'highscores';
const playerNameKey = 'playername';

function showSection(section) {
    const highscoreBoard = document.querySelector('.highscore-board');
    const taskBoard = document.getElementById('task-board');
    highscoreBoard.style.display = section === 'highscores' ? 'block' : 'none';
    taskBoard.style.display = section === 'highscores' ? 'none' : 'block';
    if (section === 'highscores') displayHighscores();
}

function saveName() {
    const nameInput = document.getElementById('name-input').value.trim();
    if (nameInput) {
        localStorage.setItem(playerNameKey, nameInput);
        currentScore = 0;
        updateUI('score', currentScore);
        updateUI('stored-name', nameInput);
        toggleDisplay(['#unknown-user-section', '#welcome-message', '#task-board', '#main'], ['none', 'block', 'block', 'block']);
        startGame();
    } else {
        alert("Bitte gib einen Namen ein.");
    }
}

function startGame() {
    toggleDisplay(['.task', '.answer-section', '.score', '#start-game-button', '#new-task-button'], ['block', 'block', 'block', 'none', 'block']);
    generateTask();
}

function generateTask() {
    const taskTypes = ['multiplication', 'division', 'addition', 'subtraction'];
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    
    if (taskType === 'multiplication') {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        correctAnswer = num1 * num2;
        updateUI('multiplication-task', `${num1} × ${num2} = ?`);
    } else if (taskType === 'division') {
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        num1 = num1 - (num1 % num2); // Ensure the result is an integer
        correctAnswer = num1 / num2;
        updateUI('multiplication-task', `${num1} ÷ ${num2} = ?`);
    } else if (taskType === 'addition') {
        num1 = Math.floor(Math.random() * 101);
        num2 = Math.floor(Math.random() * 101);
        correctAnswer = num1 + num2;
        updateUI('multiplication-task', `${num1} + ${num2} = ?`);
    } else if (taskType === 'subtraction') {
        num1 = Math.floor(Math.random() * 101);
        num2 = Math.floor(Math.random() * 101);
        if (num1 < num2) {
            [num1, num2] = [num2, num1]; // Ensure the result is not below 0
        }
        correctAnswer = num1 - num2;
        updateUI('multiplication-task', `${num1} - ${num2} = ?`);
    }
    
    toggleDisplay(['.answer-section', '.task'], ['inherit', 'inherit']);
    updateUI('feedback', '');
    updateUI('user-answer', '', 'value');
}

function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

window.onload = function () {
    const storedName = localStorage.getItem(playerNameKey);
    if (storedName) {
        updateUI('stored-name', storedName);
        toggleDisplay(['#welcome-message', '#name-input-section', '#main'], ['block', 'none', 'block']);
        loadScore();
    } else {
        toggleDisplay(['#unknown-user-section'], ['block']);
    }
}

function loadScore() {
    const currentDate = getCurrentDate();
    const highscores = JSON.parse(localStorage.getItem(highscoreKey)) || [];
    const existingEntry = highscores.find(entry => entry.date === currentDate) || { date: currentDate, score: 0 };
    currentScore = existingEntry.score;
    updateUI('score', currentScore);
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('user-answer').value);
    if (isNaN(userAnswer)) {
        updateUI('feedback', 'Bitte gib eine gültige Zahl ein.');
    } else if (userAnswer === correctAnswer) {
        updateUI('feedback', `Richtig! Gut gemacht! Die Lösung ist ${correctAnswer}`);
        toggleDisplay(['.answer-section'], ['none']);
        currentScore += 10;
        updateHighscore(currentScore);
        updateUI('score', currentScore);
        setTimeout(generateTask, 1500);
    } else {
        currentScore -= 3;
        updateHighscore(currentScore);
        updateUI('feedback', `Falsch. Die richtige Antwort ist ${correctAnswer}.`);
        setTimeout(generateTask, 5000);
    }
}

function updateHighscore(score) {
    let highscores = JSON.parse(localStorage.getItem(highscoreKey)) || [];
    const currentDate = getCurrentDate();
    const existingEntry = highscores.find(entry => entry.date === currentDate);
    if (existingEntry) {
        existingEntry.score = score;
    } else {
        highscores.push({ date: currentDate, score });
    }
    highscores.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    localStorage.setItem(highscoreKey, JSON.stringify(highscores));
    updateUI('score', currentScore);
}

function displayHighscores() {
    const highscoreList = document.getElementById('highscore-list');
    const highscores = JSON.parse(localStorage.getItem(highscoreKey)) || [];
    highscoreList.innerHTML = highscores.map(entry => `<li>${new Date(entry.date).toLocaleDateString()}: ${entry.score} Punkte</li>`).join('');
    toggleDisplay(['.highscore-board'], ['block']);
}

function updateUI(elementId, content, type = 'innerText') {
    document.getElementById(elementId)[type] = content;
}

function toggleDisplay(elements, displays) {
    elements.forEach((el, idx) => {
        const element = document.querySelector(el);
        if (element) {
            element.style.display = displays[idx];
        } else {
            console.error(`Element not found: ${el}`);
        }
    });
}
