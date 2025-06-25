import {setupSocket} from './socket.js';
import {displayQuestion, pickQuestion} from './quiz.js';
import {questions} from './questions.js';
import {setupGame} from "./ui.js";

document.addEventListener('DOMContentLoaded', () => {
    setupSocket();
    setupGame();
    // Initial question
    displayQuestion(pickQuestion(questions));
});
