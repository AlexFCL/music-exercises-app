import { initScaleQuiz } from "./scale-quiz.js";

export function renderCategories(categories, onCategoryClick) {
  document.body.classList.remove("exercise-view");

  const html = `
    <div class="tiles-grid">
      ${categories.map(category => `
        <button class="tile" data-category-id="${category.id}">
          <h2>${category.title}</h2>
          <p>${category.description}</p>
        </button>
      `).join("")}
    </div>
  `;

  const content = document.querySelector("#content");
  content.innerHTML = html;

  const tiles = document.querySelectorAll(".tile");

  tiles.forEach(tile => {
    tile.addEventListener("click", () => {
      const categoryId = tile.dataset.categoryId;
      onCategoryClick(categoryId);
    });
  });
}

export function renderExerciseMenu(exercises, onBackClick, onExerciseClick) {
  document.body.classList.remove("exercise-view");

  const html = `
    <button class="back-button">← Retour</button>

    <div class="tiles-grid">
      ${exercises.map(exercise => `
        <button class="tile" data-exercise-id="${exercise.id}">
          <h2>${exercise.title}</h2>
          <p>${exercise.description}</p>
        </button>
      `).join("")}
    </div>
  `;

  const content = document.querySelector("#content");
  content.innerHTML = html;

  document.querySelector(".back-button").addEventListener("click", onBackClick);

  const tiles = document.querySelectorAll(".tile");

  tiles.forEach(tile => {
    tile.addEventListener("click", () => {
      const exercise = exercises.find(item => item.id === tile.dataset.exerciseId);
      onExerciseClick(exercise);
    });
  });
}

export function renderExercises(exercises, onBackClick) {
  document.body.classList.add("exercise-view");

  const html = `
    <button class="back-button">← Retour</button>

    <div class="tiles-grid">
      ${exercises.map(exercise => `
        <article class="exercise-card">
          ${
            isScaleQuizExercise(exercise)
              ? `<div id="scale-quiz-container"></div>`
              : `
                <h2>${exercise.title}</h2>
                <p>${exercise.description}</p>
                ${exercise.duration ? `<strong>Durée : ${exercise.duration}</strong>` : ""}
              `
          }
        </article>
      `).join("")}
    </div>
  `;

  const content = document.querySelector("#content");
  content.innerHTML = html;

  document.querySelector(".back-button").addEventListener("click", onBackClick);

  const scaleQuizContainer = document.querySelector("#scale-quiz-container");

  if (scaleQuizContainer) {
    const scaleQuizExercise = exercises.find(isScaleQuizExercise);
    initScaleQuiz(scaleQuizContainer, { mode: scaleQuizExercise.type });
  }
}

function isScaleQuizExercise(exercise) {
  return exercise.type === "scale-quiz" || exercise.type === "scale-from-any-note";
}
