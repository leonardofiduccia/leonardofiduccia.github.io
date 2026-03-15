
// ---------------------------
// Game state
// ---------------------------
let remainingQuestions = [];
let currentQuestion = null;
let lastSkippedQuestion = null;

// ---------------------------
// Load questions from Google Sheets
// ---------------------------

async function loadQuestionsFromSheet() {
  try {
    const response = await fetch(
      'api/questions'
    );

    const data = await response.json();

    console.log('Backend response:', data);

    // IMPORTANT: extract the array
    questions = data.questions;
    remainingQuestions = [...questions];

    showRandomQuestion();
  } catch (error) {
    console.error(error);
    document.querySelector('.question').textContent =
      "Failed to load questions.";
  }
}

// ---------------------------
// Utilities
// ---------------------------
function setQuestionText(text) {
  const questionEl = document.querySelector('.question');

  // Fade out
  questionEl.classList.add('fade-out');

  // After fade-out, update text and fade back in
  setTimeout(() => {
    questionEl.textContent = `${text.text ?? text}`; //Read text attribute from an object or a string
    questionEl.classList.remove('fade-out');
  }, 200);
}

function getRandomQuestion() {
  if (remainingQuestions.length === 0) return null;

  let candidates = remainingQuestions;

  // Temporarily exclude last skipped question
  if (lastSkippedQuestion && remainingQuestions.length > 1) {
    candidates = remainingQuestions.filter(q => q !== lastSkippedQuestion);
  }

  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}

// ---------------------------
// Game actions
// ---------------------------
function showRandomQuestion() {
  const next = getRandomQuestion();

  if (!next) {
  const message = isChristmasTheme()
    ? "All questions answered!\n❄️ Merry Christmas!"
    : "All questions answered!";

  setQuestionText(message);
  return;
 }

  currentQuestion = next;
  lastSkippedQuestion = null; // reset skip block
  setQuestionText(currentQuestion.text);
}

function skipQuestion() {
  if (!currentQuestion) return;

  lastSkippedQuestion = currentQuestion;
  showRandomQuestion();
}

function nextQuestion() {
  if (!currentQuestion) return;

  // Permanently remove answered question
  remainingQuestions = remainingQuestions.filter(q => q !== currentQuestion);
  currentQuestion = null;

  showRandomQuestion();
}

function isChristmasTheme() {
  return document.body.classList.contains('christmas');
}

// ---------------------------
// Event listeners
// ---------------------------
document.querySelector('#skip-btn').addEventListener('click', skipQuestion);
document.querySelector('#next-btn').addEventListener('click', nextQuestion);

// ---------------------------
// Start game
// ---------------------------
loadQuestionsFromSheet();
