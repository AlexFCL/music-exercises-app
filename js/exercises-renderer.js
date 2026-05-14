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

export function renderExercises(exercises, onBackClick) {
  document.body.classList.add("exercise-view");

  const html = `
    <button class="back-button">← Retour</button>

    <div class="tiles-grid">
      ${exercises.map(exercise => `
        <article class="exercise-card">
          ${
            exercise.type === "scale-quiz"
              ? `<div id="scale-quiz-container"></div>`
              : `
                <h2>${exercise.title}</h2>
                <p>${exercise.description}</p>
                <strong>Durée : ${exercise.duration}</strong>
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
    initScaleQuiz(scaleQuizContainer);
  }
}
