const socket = io();

const bossAvatar = document.querySelector('.bossAvatar');

const bossProgress = document.querySelector('#boss-hp');
const playerProgress = document.querySelector('#player-hp');
const buttons = [...document.querySelectorAll('button')];
const quizZone = document.getElementById('quiz-zone');
quizZone.style.visibility = 'hidden';
document.querySelector('.boss').style.visibility = 'initial';
document.querySelector('.player').style.visibility = 'initial';
let currentQuestion;
let gameOver = false;
let gameStart = false;
let numberOfPlayers = 0;
let interval;
const questions = [
    {
        question: 'What is an HTML element?',
        answerChoices: [
            'A tag',
            'A block of text',
            'A clickable link',
            'A structure used for creating content',
        ],
        correct: 'A structure used for creating content',
    },
    {
        question: 'What is a tag in HTML?',
        answerChoices: [
            'A styling property',
            'A unique identifier for elements',
            'A part of an element used to define it',
            'A function in JavaScript',
        ],
        correct: 'A part of an element used to define it',
    },
    {
        question: 'What is an attribute in HTML?',
        answerChoices: [
            'A style applied to an element',
            'A value that modifies an element’s behavior or appearance',
            'A type of content',
            'A section of a web page',
        ],
        correct: 'A value that modifies an element’s behavior or appearance',
    },
    {
        question: 'What is a self-closing tag in HTML?',
        answerChoices: [
            'A tag that does not require a closing tag',
            'A tag that contains a link',
            'A tag for styling',
            'A tag that wraps other elements',
        ],
        correct: 'A tag that does not require a closing tag',
    },
    {
        question: 'What is the process of nesting in HTML?',
        answerChoices: [
            'Placing tags within other tags',
            'Creating multiple CSS files',
            'Using JavaScript functions in HTML',
            'Applying multiple attributes to a tag',
        ],
        correct: 'Placing tags within other tags',
    },
    {
        question: 'What does "inline-element" refer to in HTML?',
        answerChoices: [
            'Elements that span the full width of their container',
            'Elements that do not start on a new line and only take up as much width as needed',
            'Elements that contain images',
            'Elements with semantic meaning',
        ],
        correct:
            'Elements that do not start on a new line and only take up as much width as needed',
    },
    {
        question: 'What does "block-element" refer to in HTML?',
        answerChoices: [
            'Elements that are displayed in a single line',
            'Elements that start on a new line and take up the full width of their container',
            'Elements that contain JavaScript code',
            'Elements that do not display text',
        ],
        correct:
            'Elements that start on a new line and take up the full width of their container',
    },
    {
        question: 'What does "semantic HTML" mean?',
        answerChoices: [
            'Using tags that clearly describe the content they contain',
            'Using inline styles',
            'Using JavaScript in HTML',
            'Using a variety of CSS classes',
        ],
        correct: 'Using tags that clearly describe the content they contain',
    },
    {
        question: 'What is a form in HTML?',
        answerChoices: [
            'A way to structure text on a page',
            'A structure for gathering user input',
            'A type of button',
            'A layout for displaying images',
        ],
        correct: 'A structure for gathering user input',
    },
    {
        question: 'What does UI stand for in web design?',
        answerChoices: [
            'User Integration',
            'User Interface',
            'User Interaction',
            'Universal Input',
        ],
        correct: 'User Interface',
    },
    {
        question: 'What does the "id" selector do in CSS?',
        answerChoices: [
            'Applies styles to all elements on a page',
            'Targets elements with a specific ID attribute',
            'Targets elements with a specific class',
            'Selects elements based on their position',
        ],
        correct: 'Targets elements with a specific ID attribute',
    },
    {
        question: 'What is a pseudoclass in CSS?',
        answerChoices: [
            'A property that modifies elements based on user interaction',
            'A way to define specific styles for elements in a class',
            'A special class for styling elements',
            'A class that contains JavaScript',
        ],
        correct: 'A property that modifies elements based on user interaction',
    },
    {
        question: 'What is a pseudoelement in CSS?',
        answerChoices: [
            'A special class that changes an element’s display',
            'A selector that targets parts of an element like the first letter or line',
            'A new type of CSS selector',
            'A function that runs after an element loads',
        ],
        correct:
            'A selector that targets parts of an element like the first letter or line',
    },
    {
        question: 'What is a color value in CSS?',
        answerChoices: [
            'A predefined color in CSS',
            'A way to represent colors using RGB, HEX, or HSL values',
            'A tag used to change colors',
            'A property used to create gradients',
        ],
        correct: 'A way to represent colors using RGB, HEX, or HSL values',
    },
    {
        question: 'What is a selector in CSS?',
        answerChoices: [
            'A property that defines an element’s appearance',
            'A method of selecting elements to apply styles',
            'A function used to change HTML structure',
            'A type of HTML tag',
        ],
        correct: 'A method of selecting elements to apply styles',
    },
    {
        question: 'What is the purpose of the box model in CSS?',
        answerChoices: [
            'To define the layout of an element’s content, padding, border, and margin',
            'To add animation to elements',
            'To modify the structure of HTML tags',
            'To change element font sizes',
        ],
        correct:
            'To define the layout of an element’s content, padding, border, and margin',
    },
    {
        question: 'What does the flexbox layout do in CSS?',
        answerChoices: [
            'It aligns elements in a flexible container',
            'It adds borders to elements',
            'It changes the font of text elements',
            'It creates static grid layouts',
        ],
        correct: 'It aligns elements in a flexible container',
    },
    {
        question: 'What is the grid layout in CSS?',
        answerChoices: [
            'A system for aligning items in rows and columns',
            'A method to organize images',
            'A method for creating semantic HTML',
            'A tag used to insert tables',
        ],
        correct: 'A system for aligning items in rows and columns',
    },
    {
        question:
            'What is the difference between relative and absolute positioning in CSS?',
        answerChoices: [
            'Relative positioning moves an element from its normal position, while absolute positions it relative to the nearest positioned ancestor',
            'Relative positioning changes text size, while absolute positioning changes the element’s color',
            'There is no difference',
            'Relative positioning is for images only',
        ],
        correct:
            'Relative positioning moves an element from its normal position, while absolute positions it relative to the nearest positioned ancestor',
    },
    {
        question: 'What is the "display" property in CSS?',
        answerChoices: [
            'It specifies how an element is displayed on the page',
            'It controls the element’s background color',
            'It modifies the element’s content',
            'It applies styles to text',
        ],
        correct: 'It specifies how an element is displayed on the page',
    },
    {
        question: 'What is the purpose of the margin property in CSS?',
        answerChoices: [
            'To set the space between an element’s border and the surrounding elements',
            'To change the color of text',
            'To modify the size of the element’s content',
            'To set the font of an element',
        ],
        correct:
            'To set the space between an element’s border and the surrounding elements',
    },
    {
        question: 'What does the padding property do in CSS?',
        answerChoices: [
            'It defines the space between an element’s content and its border',
            'It sets the color of the element’s text',
            'It changes the size of an element’s border',
            'It defines the layout of text',
        ],
        correct: 'It defines the space between an element’s content and its border',
    },
    {
        question: 'What is the border property in CSS?',
        answerChoices: [
            'It defines the width and style of an element’s border',
            'It sets the space between an element and other content',
            'It controls the background color of an element',
            'It defines the content of an element',
        ],
        correct: 'It defines the width and style of an element’s border',
    },
    {
        question: 'What does the "grid" layout do in CSS?',
        answerChoices: [
            'It organizes content into rows and columns',
            'It changes the color of an element',
            'It adds borders to elements',
            'It arranges elements in a circular layout',
        ],
        correct: 'It organizes content into rows and columns',
    },
    {
        question: 'What does the "position" property do in CSS?',
        answerChoices: [
            'It defines how an element is positioned in relation to its parent or other elements',
            'It defines the width and height of an element',
            'It sets the color of an element',
            'It controls the font size of text',
        ],
        correct:
            'It defines how an element is positioned in relation to its parent or other elements',
    },
    {
        question: 'What is the purpose of "relative" positioning in CSS?',
        answerChoices: [
            'It moves an element from its normal position based on its original position',
            'It positions an element relative to the nearest parent container',
            'It positions an element relative to the screen',
            'It aligns elements horizontally',
        ],
        correct:
            'It moves an element from its normal position based on its original position',
    },
    {
        question:
            'What is the difference between "relative" and "absolute" positioning in CSS?',
        answerChoices: [
            'Relative positioning moves an element from its normal position, while absolute positions it relative to the nearest positioned ancestor',
            'Relative positioning is used for text, while absolute positioning is used for images',
            'Relative positioning allows you to align elements horizontally, while absolute positioning does not',
            'There is no difference between them',
        ],
        correct:
            'Relative positioning moves an element from its normal position, while absolute positions it relative to the nearest positioned ancestor',
    },
    {
        question: 'What does the "display" property do in CSS?',
        answerChoices: [
            'It specifies how an element is displayed on the page (block, inline, none, etc.)',
            'It defines the size of an element',
            'It changes the color of an element',
            'It adjusts the margin of an element',
        ],
        correct:
            'It specifies how an element is displayed on the page (block, inline, none, etc.)',
    },
];
const gameSate = {
    isBossAttacking: false,
    playerHp: playerProgress.value,
}

buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
    });
});

// Socket
const music = new Audio('/assets/the-final-boss-battle-158700.mp3');
music.volume = 0.75;

const readyBtn = document.getElementById('ready');
readyBtn.addEventListener(
    'click',
    () => {
        readyBtn.style.backgroundColor = 'green';
        //emit the ready signal, data
        socket.emit('ready', 1);
    },
    {once: true}
);

// .on recieving
let currentTick = 0;
let tickStartTime = null;
let tickInterval = 0;
let serverOffset = 0;
let nextTick = 0
socket.on(
    'game-tick',
    ({
         tickStartTime: tickStart,
         tickNumber,
         tickInterval: tInterval,
         serverTime,
     }) => {
        console.log(`[Client] syncing to tick`, tickNumber, serverTime);
        currentTick = tickNumber;
        tickStartTime = tickStart;
        tickInterval = tInterval;
        nextTick = tickStartTime + tickInterval * (tickNumber + 1)
        if (tickNumber % 2 === 0) {
            bossAttack()
        }
    }
);

socket.on(
    'sync-tick',
    ({
         tickStartTime: tickStart,
         tickNumber,
         tickInterval: tInterval,
         timeJoined,
     }) => {
        console.log(
            `[Client], You joined on ${tickNumber}, ${timeJoined}, ${tickStart},${tInterval} `
        );

    }
);

socket.on(
    'boss-attack-tick',
    ({tickStartTime: start, tickNumber, tickInterval: interval}) => {
        currentTick = tickNumber;
        tickStartTime = start;
        tickInterval = interval;

        bossAttack();
    }
);

socket.on('shutdown', () => {
    // Reset Everything
    document.body.innerHTML = '<h1>Please refresh game</h1>';
    music.pause();
});

socket.on('ready', () => {
    socket.emit('game-start');
});

socket.on('continue', () => {
    quizZone.style.visibility = 'visible';
    document.getElementById('ready').remove();
    bossAttack();
});

// socket.on('boss-attack', percentage => {
//   console.log('hit');

//   console.log(percentage);

//   playerProgress.value = percentage

// })

socket.on('game-over', () => {
    gameOver = true;
    document.querySelector('main').innerHTML = `<h1>Game Over!</h1>`;
    socket.emit('game-over');
});

socket.on('boss-hit', (hp, bossHit) => {
    if (hp <= 0) {
        gameOver = true;
        return;
    }

    // JS Animations
    bossAvatar.animate(
        [
            {
                backgroundColor: 'red',
            },
        ],
        {duration: 100, iterations: 1}
    );
    const bossHitCounterElement = document.getElementById('b-hit');
    bossHitCounterElement.textContent = bossHit;
    bossProgress.value = hp;
});

socket.on('player-hit', (hp, playerHit) => {
    const playerHitCounterElement = document.getElementById('p-hit');
    console.log({hp, playerHit})
    playerHitCounterElement.textContent = playerHit;
    playerProgress.value = hp;
});

socket.on('game-start', (playerHp, bossHp) => {
    document.getElementById('ready').remove();
    quizZone.style.visibility = 'visible';
    music.play();

    console.log({bossHp, playerHp});

    bossProgress.value = bossHp;
    playerProgress.value = playerHp;
    bossAttack();
});

function bossAttack(isAttacking) {
    if (isAttacking) {
        console.log('Did not send this attack, I was already attacking!');
        return;
    }
    if (gameOver) return;
    gameSate.isBossAttacking = true;
    let attackAnimation;

    attackAnimation = bossAvatar.animate([{scale: 2, backgroundColor: 'red'}], {
        duration: 5000,
        easing: 'ease-in-out',
    });
    // play a function when animation finishes so we can determine what to do next.
    attackAnimation.onfinish = () => {
        console.log(
            `Client, Attack Finished, timestamp:${Date.now()}`
        );
        gameSate.isBossAttacking = false;
        socket.emit('incorrect');
    };

    // Recursively calling the animation when its finished
    // attackAnimation.onfinish = () => bossAttack();
    // When the animation promise is fulfilled, I want to send the attack over
    // attackAnimation.finished.then(() => (socket.emit('boss-attack')));
}

function pickQuestion(questionArr) {
    if (questionArr.length === 0) return 'out of questions';
    currentQuestion = questionArr[Math.floor(Math.random() * questionArr.length)];
    return currentQuestion;
}

function displayQuestion({question, answerChoices}, questionArr = questions) {
    const questionEle = document.querySelector('#question');

    if (questionArr.length !== 0) {
        questionEle.textContent = question;
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button, index) => {
            button.textContent = answerChoices[index];
        });
    } else {
        document.querySelector('#answer-choices').style.visibility = 'hidden';
        questionEle.textContent = 'Out of Questions';
    }
}

function checkQuestion(userAnswer, correct) {
    if (String(userAnswer) === String(correct)) {
        displayQuestion(pickQuestion(questions));
        socket.emit('correct');
        return 'correct';
    }
    socket.emit('incorrect');
    return 'incorrect';
}

displayQuestion(pickQuestion(questions));

window.addEventListener('click', (e) => {
    const currentItem = e.target;
    if (currentItem.localName === 'button') {
        checkQuestion(currentItem.textContent, currentQuestion.correct);
    }
});
