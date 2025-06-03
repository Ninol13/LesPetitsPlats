// Version avec méthodes fonctionnelles (déjà utilisée dans ton projet)
export function searchFunctional(recipes, query) {
    const keyword = query.toLowerCase();

    return recipes.filter(
        (recipe) =>
            recipe.name.toLowerCase().includes(keyword) ||
            recipe.description.toLowerCase().includes(keyword) ||
            recipe.ingredients.some((ingredient) =>
                ingredient.ingredient.toLowerCase().includes(keyword)
            )
    );
}

// Version avec boucles classiques
export function searchWithLoops(recipes, query) {
    const keyword = query.toLowerCase();
    const results = [];

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];

        const nameMatch = recipe.name.toLowerCase().includes(keyword);
        const descMatch = recipe.description.toLowerCase().includes(keyword);
        let ingredientMatch = false;

        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ing = recipe.ingredients[j].ingredient.toLowerCase();
            if (ing.includes(keyword)) {
                ingredientMatch = true;
                break;
            }
        }

        if (nameMatch || descMatch || ingredientMatch) {
            results.push(recipe);
        }
    }

    return results;
}
