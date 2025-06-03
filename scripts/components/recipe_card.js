export function createRecipeCard({
    imageUrl,
    prepTime,
    title,
    description,
    ingredients,
}) {
    const card = document.createElement("div");
    card.className = "recipe-card";

    // Convertit correctement les ingrédients en chaîne HTML
    const ingredientsList = ingredients
        .map((ingredient) => {
            let ingredientText = ingredient.ingredient; // Commence par le nom de l'ingrédient
            if (ingredient.quantity) {
                ingredientText += `: ${ingredient.quantity}`; // Ajoute la quantité si elle est présente
            }
            if (ingredient.unit) {
                ingredientText += ` ${ingredient.unit}`; // Ajoute l'unité si elle est présente
            }
            return `<li><span>${ingredient.ingredient}</span><span>${
                ingredient.quantity || ""
            } ${ingredient.unit || ""}</span></li>`;
        })
        .join("");

    card.innerHTML = `
        <div class="recipe-image">
            <img src="${imageUrl}" alt="${title}" />
            <span class="prep-time">${prepTime} min</span>
        </div>
        <div class="recipe-content">
            <h1>${title}</h1>
            <h2>Recette</h2>
            <p>${description}</p>
            <h2>Ingrédients</h2>
            <ul class="ingredients-list">
                ${ingredientsList}
            </ul>
        </div>
    `;

    return card;
}
