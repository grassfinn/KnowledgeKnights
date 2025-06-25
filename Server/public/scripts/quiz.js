import { socket } from './socket.js';
import { questions } from './questions.js';

export function pickQuestion(questions) {
    if (!questions.length) return null;
    return questions[Math.floor(Math.random() * questions.length)];
}

export function displayQuestion(questionObj) {
    const questionEle = document.getElementById('question');
    const buttons = document.querySelectorAll('button');

    if (!questionObj) {
        questionEle.textContent = 'Out of Questions';
        document.getElementById('answer-choices').style.visibility = 'hidden';
        return;
    }

    questionEle.textContent = questionObj.question;
    questionObj.answerChoices.forEach((text, i) => {
        buttons[i].textContent = text;
    });

    window.currentQuestion = questionObj;
}

document.getElementById('answer-choices').addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;

    const answer = e.target.textContent;
    const isCorrect = answer === window.currentQuestion.correct;

    if (isCorrect) {
        displayQuestion(pickQuestion(questions));
        socket.emit('correct');
    } else {
        socket.emit('incorrect');
    }
});
