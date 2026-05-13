let scales = [];
let currentScale = null;

export async function initScaleQuiz(container) {
  scales = await loadScales();

container.innerHTML = `
  <section class="scale-quiz">
    <h2>Trouver les notes d’une gamme</h2>

    <div class="scale-question" id="scale-question">
      Aucune gamme générée pour le moment.
    </div>

    <div class="notes-inputs" id="notes-inputs"></div>

    <div class="scale-actions">
      <button class="primary-button" id="generate-scale-button">
        Générer
      </button>

      <button class="secondary-button" id="check-scale-button" disabled>
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

  const question = document.querySelector("#scale-question");
  const inputsContainer = document.querySelector("#notes-inputs");
  const checkButton = document.querySelector("#check-scale-button");

  question.textContent = `${currentScale.tonic} ${currentScale.scaleType}`;

  inputsContainer.innerHTML = currentScale.notes.map((note, index) => `
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
      input.value = normalizeNote(input.value);
      input.classList.remove("is-correct", "is-wrong");

      const correction = input.parentElement.querySelector(".note-correction");
      correction.textContent = "";
    });
  });

  checkButton.disabled = false;

  if (inputs.length > 0) {
    inputs[0].focus();
  }
}

function checkAnswers() {
  if (!currentScale) {
    return;
  }

  const inputs = document.querySelectorAll(".note-input");

  inputs.forEach(input => {
    const index = Number(input.dataset.index);

    const userAnswer = normalizeNote(input.value);
    const correctAnswer = currentScale.notes[index];

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