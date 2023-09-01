document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.querySelector('.settings-form');
    const questionContainer = document.querySelector('.question-container');
    const nextButton = document.querySelector('.next-button');
    const question = document.querySelector('.question');
    const answers = document.querySelector('.answers');
    const endgameContainer = document.querySelector('.endgame-container');

    let currentQuestionIndex = 0;
    let questions = [];
    let correctAnswers = 0;

    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    async function fetchQuestions(difficulty, numQuestions) {
        const apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}&category=18&difficulty=${difficulty}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            questions = data.results;
            settingsForm.classList.add('d-none');
            questionContainer.classList.remove('d-none');
            displayQuestion();
        } catch (error) {
            console.error(error);
            alert('Error fetching questions. Please try again.');
        }
    }

    settingsForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const difficulty = document.querySelector('#difficulty').value;
        const numQuestions = parseInt(document.querySelector('#numQuestions').value);
        await fetchQuestions(difficulty, numQuestions);
    });

    function displayQuestion() {
        const questionData = questions[currentQuestionIndex];
        question.innerHTML = decodeHTML(questionData.question);

        answers.innerHTML = '';
        const allAnswers = [...questionData.incorrect_answers, questionData.correct_answer].map(decodeHTML);
        allAnswers.sort(() => Math.random() - 0.5);

        allAnswers.forEach(answer => {
            const answerButton = document.createElement('button');
            answerButton.innerHTML = answer;
            answerButton.classList.add('answer-button', 'btn', 'btn-secondary');
            answerButton.addEventListener('click', () => {
                answerButton.disabled = true;
                checkAnswer(answer === decodeHTML(questionData.correct_answer), answerButton);
                setTimeout(() => {
                    if (currentQuestionIndex < questions.length - 1) {
                        currentQuestionIndex++;
                        displayQuestion();
                    } else {
                        showEndGameScreen();
                    }
                }, 1000);
            });
            answers.appendChild(answerButton);
        });
    }

    function checkAnswer(isCorrect, answerButton) {
        if (isCorrect) {
            correctAnswers++;
            answerButton.classList.add('correct-answer');
        } else {
            answerButton.classList.add('incorrect-answer');
        }
    
        disableAnswerButtons();
    }

    function disableAnswerButtons() {
        const answerButtons = document.querySelectorAll('.answer-button');
        answerButtons.forEach(button => {
            button.disabled = true;
        });
    }

    function showEndGameScreen() {
        questionContainer.classList.add('d-none');

        endgameContainer.innerHTML = `
            <p>Your Score: ${correctAnswers}/${questions.length}</p>
            <button class="replay-button btn btn-primary mt-2">Replay</button>
        `;

        const replayButton = endgameContainer.querySelector('.replay-button');
        replayButton.addEventListener('click', () => {
            resetGame();
        });

        endgameContainer.classList.remove('d-none');
    }

    function resetGame() {
        location.reload();
    }
});