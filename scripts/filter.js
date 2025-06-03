import { recipes } from "../data/recipes.js";
import { createRecipeCard } from "../scripts/components/recipe_card.js";
import { extractRecipeElements } from "./init_drop-down_lists.js";
import { myData } from "./index.js";
import { searchFunctional, searchWithLoops } from "./search_algos.js";

/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
/*              Gestion du champ de recherche principal        */
/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");

    // Ajoute un écouteur d’événement sur la saisie utilisateur
    searchInput.addEventListener("input", () => {
        const searchQuery = searchInput.value.toLowerCase();
        let filteredData = [];

        if (searchQuery.length >= 3 || searchQuery.length === 0) {
            // Choix de l'algorithme de recherche (ici fonctionnel)
            filteredData = searchFunctional(recipes, searchQuery);
            filteredData = applyAllActiveTags(filteredData);
            // Met à jour le tableau global avec les résultats filtrés
            myData.length = 0;
            filteredData.forEach((filteredItem) => myData.push(filteredItem));

            displayResults(filteredData, searchQuery);
            extractRecipeElements(myData);
            updateNbrOfRecettes(myData.length);
        }
    });
});

/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
/*                 Gestion de l’ajout et suppression de tags   */
/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */

let ingredients = [];
let appareils = [];
let ustensiles = [];

// Gestion de l’ajout d’un tag
document.addEventListener("elementAdded", function (event) {
    if (event.target.classList.contains("selected")) {
        const category = event.target.parentNode.className.split(" ")[0];

        Array.from(event.target.children).forEach((child) => {
            if (!getCategoryArray(category).includes(child.textContent)) {
                getCategoryArray(category).push(child.textContent);
            }
        });

        const searchQuery = document.getElementById("searchInput").value.toLowerCase();
        let filteredData = searchFunctional(recipes, searchQuery);
        filteredData = applyAllActiveTags(filteredData);

        myData.length = 0;
        filteredData.forEach((r) => myData.push(r));

        displayResults(myData, searchQuery);
        extractRecipeElements(myData);
        updateNbrOfRecettes(myData.length);
    }
});

// Gestion de la suppression d’un tag
document.addEventListener("elementRemoved", function (event) {
    if (event.target.classList.contains("selected")) {
        const category = event.target.parentNode.className.split(" ")[0];

        getCategoryArray(category).splice(0, getCategoryArray(category).length);

        Array.from(event.target.children).forEach((child) => {
            if (!getCategoryArray(category).includes(child.textContent)) {
                getCategoryArray(category).push(child.textContent);
            }
        });

        const searchQuery = document.getElementById("searchInput").value.toLowerCase();
        let filteredData = searchFunctional(recipes, searchQuery);
        filteredData = applyAllActiveTags(filteredData);

        myData.length = 0;
        filteredData.forEach((r) => myData.push(r));

        displayResults(myData, searchQuery);
        extractRecipeElements(myData);
        updateNbrOfRecettes(myData.length);
    }
});

/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */
/*                        Fonctions utilitaires                */
/* ---*---*---*---*---*---*---*---*---*---*---*---*---*---*--- */

/**
 * Retourne le tableau associé à une catégorie donnée.
 *
 * @param {string} category - Nom de la catégorie ('ingredients', 'appareils', 'ustensiles').
 * @returns {Array} Le tableau correspondant.
 */
function getCategoryArray(category) {
    switch (category) {
        case "ingredients":
            return ingredients;
        case "appareils":
            return appareils;
        case "ustensiles":
            return ustensiles;
    }
}
// ----------------------------------------------------------------------------------- //

/**
 * Filtre les recettes selon les tags actifs d’une catégorie donnée.
 *
 * @param {string} category - Nom de la catégorie utilisée pour le filtrage.
 */
function filterRecipesByCategory(category) {
    let filteredRecipes = [];
    for (let i = 0; i < myData.length; i++) {
        for (let j = 0; j < getCategoryArray(category).length; j++) {
            if (
                !extractItemsOfRecipe(myData[i], category).includes(
                    getCategoryArray(category)[j].toLowerCase()
                )
            ) {
                break;
            } else {
                if (j + 1 === getCategoryArray(category).length) {
                    filteredRecipes.push(myData[i]);
                }
            }
        }
    }

    updateFilteredRecipes(filteredRecipes);
}
// ----------------------------------------------------------------------------------- //

/**
 * Met à jour `myData` avec une nouvelle liste de recettes filtrées.
 *
 * @param {Array} filteredRecipes - Liste de recettes filtrées.
 */
function updateFilteredRecipes(filteredRecipes) {
    myData.length = 0;
    filteredRecipes.forEach((filteredItem) => myData.push(filteredItem));
}
// ----------------------------------------------------------------------------------- //

/**
 * Extrait les éléments d’une recette selon la catégorie (ingrédients, ustensiles, appareil).
 *
 * @param {Object} recipe - Objet recette à analyser.
 * @param {string} category - La catégorie à extraire.
 * @returns {Array|string} - Un tableau ou une chaîne de caractères.
 */
function extractItemsOfRecipe(recipe, category) {
    if (category === "ustensiles") {
        return recipe.ustensils.map((element) => element.toLowerCase());
    } else if (category === "ingredients") {
        return recipe.ingredients.map((element) =>
            element.ingredient.toLowerCase()
        );
    } else {
        return recipe.appliance.toLowerCase();
    }
}
// ----------------------------------------------------------------------------------- //

/**
 * Affiche les résultats de recherche ou un message si aucun résultat.
 *
 * @param {Array} recipes - Recettes à afficher.
 * @param {string} [searchQuery=""] - Terme recherché (facultatif).
 */
function displayResults(recipes, searchQuery = "") {
    const resultsContainer = document.getElementById("recipe-container");
    resultsContainer.innerHTML = "";

    if (recipes.length === 0) {
        resultsContainer.innerHTML = `
			<h3>
				Aucune recette ne contient ‘${searchQuery}’ vous pouvez chercher
				«tarte aux pommes», «poisson», etc.
			</h3>
		`;
        resultsContainer.style = `
			display: flex;
			justify-content: center;
			margin: 60px auto;
			width: 500px;
			text-align: center;
			letter-spacing: 1.5px;
		`;

        return;
    }

    resultsContainer.removeAttribute("style");

    recipes.forEach((recipe) => {
        const recipeCard = createRecipeCard({
            imageUrl: `./assets/imgs/${recipe.image}`,
            prepTime: recipe.time,
            title: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
        });
        resultsContainer.appendChild(recipeCard);
        resultsContainer.className = "found";
    });
}
// ----------------------------------------------------------------------------------- //

/**
 * Met à jour le nombre de recettes affichées.
 *
 * @param {number} nbrRecettes - Nombre total de recettes visibles.
 */
function updateNbrOfRecettes(nbrRecettes) {
    document.querySelector(".recettes-nbr p").innerHTML = `${nbrRecettes} Recettes`;
}

function applyAllActiveTags(data) {
    let filtered = [...data];

    if (ingredients.length > 0) {
        filtered = filtered.filter((recipe) =>
            ingredients.every(tag =>
                recipe.ingredients.some(ing =>
                    ing.ingredient.toLowerCase().includes(tag.toLowerCase())
                )
            )
        );
    }

    if (appareils.length > 0) {
        filtered = filtered.filter((recipe) =>
            appareils.every(tag =>
                recipe.appliance.toLowerCase().includes(tag.toLowerCase())
            )
        );
    }

    if (ustensiles.length > 0) {
        filtered = filtered.filter((recipe) =>
            ustensiles.every(tag =>
                recipe.ustensils.some(ust =>
                    ust.toLowerCase().includes(tag.toLowerCase())
                )
            )
        );
    }

    return filtered;
}