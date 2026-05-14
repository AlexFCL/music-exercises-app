import { loadCategories, loadExercises } from "./exercises-loader.js";
import { renderCategories, renderExerciseMenu, renderExercises } from "./exercises-renderer.js";

async function showHomePage() {
  const categories = await loadCategories();

  renderCategories(categories, async (categoryId) => {
    const exercises = await loadExercises(categoryId);

    if (categoryId === "theorie") {
      showExerciseMenu(exercises);
      return;
    }

    renderExercises(exercises, showHomePage);
  });
}

function showExerciseMenu(exercises) {
  renderExerciseMenu(exercises, showHomePage, (exercise) => {
    if (!isScaleQuizExercise(exercise)) {
      return;
    }

    renderExercises([exercise], () => showExerciseMenu(exercises));
  });
}

function isScaleQuizExercise(exercise) {
  return exercise.type === "scale-quiz" || exercise.type === "scale-from-any-note";
}

showHomePage();
