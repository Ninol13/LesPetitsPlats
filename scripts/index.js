import { recipes } from "../data/recipes.js";

const container = document.getElementById("recipesContainer");

function renderRecipes(list) {
  container.innerHTML = "";

  list.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="card h-100 shadow">
        <img src="assets/JSON recipes/${recipe.image}" class="card-img-top" alt="${recipe.name}">
        <div class="card-body">
          <h5 class="card-title">${recipe.name}</h5>
          <p class="card-text text-truncate">${recipe.description}</p>
        </div>
        <div class="card-footer text-muted d-flex justify-content-between">
          <span>${recipe.time} min</span>
          <span>${recipe.servings} pers</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

renderRecipes(recipes);
