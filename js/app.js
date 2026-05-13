import { loadCategories, loadExercises } from "./exercises-loader.js";
import { renderCategories, renderExercises } from "./exercises-renderer.js";

async function showHomePage() {
  const categories = await loadCategories();

  renderCategories(categories, async (categoryId) => {
    const exercises = await loadExercises(categoryId);
    renderExercises(exercises, showHomePage);
  });
}

showHomePage();