let scales = [];
let currentScale = null;
let currentAnswerNotes = [];
let currentQuizMode = "scale-quiz";

export async function initScaleQuiz(container, options = {}) {
  currentQuizMode = options.mode ?? "scale-quiz";
  scales = await loadScales();

container.innerHTML = `
  <section class="scale-quiz">
    <h2>Trouver les notes d’une gamme</h2>
    <div class="title-accent"></div>

    <div class="scale-question" id="scale-question">
      <span class="treble-clef">𝄞</span>
      <span id="scale-question-text">Aucune gamme générée</span>
    </div>

    <div class="notes-inputs" id="notes-inputs"></div>

    <div class="scale-actions">
      <button class="primary-button" id="generate-scale-button">
        <span class="button-icon">🎲</span>
        Générer
      </button>

      <button class="secondary-button" id="check-scale-button" disabled>
        <span class="button-icon">✓</span>
        Vérifier
      </button>
    </div>
  </section>
`;

  document
    .querySelector("#generate-scale-button")
    .addEventListener("click", generateRandomScale);

  document
    .querySelector("#check-scale-button")
    .addEventListener("click", checkAnswers);
}

async function loadScales() {
  const response = await fetch("data/music-theory/scales.json");
  const groupedScales = await response.json();

  const flatScales = [];

  for (const scaleType in groupedScales) {
    groupedScales[scaleType].forEach(scale => {
      flatScales.push({
        tonic: scale.tonic,
        scaleType: scaleType,
        notes: scale.notes
      });
    });
  }

  return flatScales;
}

function generateRandomScale() {
  const randomIndex = Math.floor(Math.random() * scales.length);
  currentScale = scales[randomIndex];
  currentAnswerNotes = getAnswerNotes(currentScale);

  const question = document.querySelector("#scale-question-text");
  const inputsContainer = document.querySelector("#notes-inputs");
  const checkButton = document.querySelector("#check-scale-button");

  inputsContainer.closest(".scale-quiz").classList.add("has-scale");
  question.textContent = getQuestionText(currentScale, currentAnswerNotes);

  inputsContainer.innerHTML = currentAnswerNotes.map((note, index) => `
    <div class="note-field">
      <input
        class="note-input"
        type="text"
        maxlength="2"
        data-index="${index}"
        aria-label="Note ${index + 1}"
      />
      <div class="note-correction"></div>
    </div>
  `).join("");

  const inputs = document.querySelectorAll(".note-input");

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      input.value = sanitizeNoteInput(input.value);
      input.classList.remove("is-correct", "is-wrong");

      const correction = input.parentElement.querySelector(".note-correction");
      correction.textContent = "";

      if (input.value.length === input.maxLength) {
        focusNextInput(input, inputs);
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key !== " ") {
        return;
      }

      event.preventDefault();
      focusNextInput(input, inputs);
    });
  });

  checkButton.disabled = false;

  if (inputs.length > 0) {
    inputs[0].focus({ preventScroll: true });
  }
}

function focusNextInput(currentInput, inputs) {
  const currentIndex = Number(currentInput.dataset.index);
  const nextInput = inputs[currentIndex + 1];

  if (nextInput) {
    nextInput.focus({ preventScroll: true });
    nextInput.select();
  }
}

function sanitizeNoteInput(value) {
  return normalizeNote(value).replace(/[^A-G#b]/g, "");
}

function getAnswerNotes(scale) {
  if (currentQuizMode !== "scale-from-any-note") {
    return scale.notes;
  }

  const startIndex = Math.floor(Math.random() * scale.notes.length);
  return rotateNotes(scale.notes, startIndex);
}

function getQuestionText(scale, answerNotes) {
  if (currentQuizMode !== "scale-from-any-note") {
    return `${scale.tonic} ${scale.scaleType}`;
  }

  return `${scale.tonic} ${scale.scaleType}, à partir de ${answerNotes[0]}`;
}

function rotateNotes(notes, startIndex) {
  return [
    ...notes.slice(startIndex),
    ...notes.slice(0, startIndex)
  ];
}

function checkAnswers() {
  if (!currentScale) {
    return;
  }

  const inputs = document.querySelectorAll(".note-input");

  inputs.forEach(input => {
    const index = Number(input.dataset.index);

    const userAnswer = sanitizeNoteInput(input.value);
    const correctAnswer = currentAnswerNotes[index];

    const correction = input.parentElement.querySelector(".note-correction");

    input.value = userAnswer;

    input.classList.remove("is-correct", "is-wrong");

    if (userAnswer === correctAnswer) {
      input.classList.add("is-correct");
      correction.textContent = "";
    } else {
      input.classList.add("is-wrong");
      correction.textContent = correctAnswer;
    }
  });
}

function normalizeNote(value) {
  const cleanedValue = value.trim();

  if (cleanedValue.length === 0) {
    return "";
  }

  const firstLetter = cleanedValue.charAt(0).toUpperCase();

  let accidental = cleanedValue.slice(1);

  accidental = accidental
    .replace("d", "#")
    .replace("D", "#")
    .replace("b", "b")
    .replace("B", "b");

  return firstLetter + accidental;
}
