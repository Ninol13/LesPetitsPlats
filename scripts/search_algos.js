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

