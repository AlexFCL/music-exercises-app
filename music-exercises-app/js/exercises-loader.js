export async function loadCategories() {
  const response = await fetch("data/categories.json");
  return response.json();
}

export async function loadExercises(categoryId) {
  const response = await fetch(`data/exercises/${categoryId}.json`);
  return response.json();
}