import { recipes } from "../data/recipes.js";

// ----------------------------------------------------------------------------------- //

/**
 * Attache un écouteur d'événement `click` à un élément de liste (li)
 * qui déclenche la mise à jour de l'affichage des éléments sélectionnés.
 * @param {HTMLElement} li - Élément de liste à surveiller.
 * @param {string} category - Catégorie du menu déroulant concerné.
 */
function attachSelectionHandler(li, category) {
    li.addEventListener("click", function () {
        updateSelectionDisplay(li, category);

        if (li.parentNode) {
            li.parentNode.removeChild(li);
        }
    });
}

// ----------------------------------------------------------------------------------- //

/**
 * Met à jour l'affichage pour montrer l’élément sélectionné.
 * Gère aussi la suppression via une croix cliquable.
 * @param {HTMLElement} li - Élément de liste sélectionné.
 * @param {string} category - Catégorie concernée (ingrédients, appareils, ustensiles).
 */
function updateSelectionDisplay(li, category) {
    let div = document.querySelector(`.${category} .selected`);
    div.style.display = "flex";

    let span = document.createElement("span");

    // Masque la liste après sélection
    document.querySelector(`.${category} ul`).style.visibility = "hidden";

    // Crée le texte de l’élément sélectionné
    let p = document.createElement("p");
    p.textContent = li.textContent;
    span.appendChild(p);

    // Crée l'icône de suppression (croix)
    let i = document.createElement("i");
    i.setAttribute("class", "fas fa-times");
    i.onclick = function () {
        getBack(
            createListItem(category, this.parentNode.firstChild.textContent),
            category
        );
        div.removeChild(span);

        const eventRemove = new CustomEvent("elementRemoved", {
            bubbles: true,
        });
        div.dispatchEvent(eventRemove);
    };
    span.appendChild(i);

    // Affiche le bloc sélectionné
    span.style.display = "flex";
    div.appendChild(span);

    const eventAdd = new CustomEvent("elementAdded", { bubbles: true });
    div.dispatchEvent(eventAdd);
}

// ----------------------------------------------------------------------------------- //

/**
 * Filtre dynamiquement les éléments de la liste selon la saisie utilisateur.
 * @param {HTMLElement} searchInput - Champ de recherche associé à une liste.
 * @param {string} category - Catégorie filtrée.
 */
function handleSearchInput(searchInput, category) {
    searchInput.addEventListener("input", () => {
        let searchQuery = searchInput.value.toLowerCase();
        document.querySelectorAll(`.${category}-item`).forEach((li) => {
            if (li.textContent.toLowerCase().includes(searchQuery)) {
                li.style.display = "";
            } else {
                li.style.display = "none";
            }
        });
    });
}

// ----------------------------------------------------------------------------------- //

/**
 * Crée un élément de type <li> avec le texte et la classe appropriée.
 * @param {string} category - Catégorie de l’élément (pour sa classe CSS).
 * @param {string} textContent - Texte à afficher.
 * @returns {HTMLElement} Élément <li> créé.
 */
function createListItem(category, textContent) {
    const li = document.createElement("li");
    li.textContent = textContent;
    li.classList = `${category}-item`;
    return li;
}

// ----------------------------------------------------------------------------------- //

// * Génère tous les ingrédients dans le menu déroulant des ingrédients * //
export function extractIngredientsItems(recipes) {
    let ingredients = document.querySelector(".ingredients ul");

    keepFirstChildOnly(ingredients);

    const ingredientsList = [];

    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            let ingredientName = ingredient.ingredient.toLowerCase();
            if (!ingredientsList.includes(ingredientName)) {
                ingredientsList.push(ingredientName);

                let li = createListItem("ingredients", ingredient.ingredient);
                attachSelectionHandler(li, "ingredients");
                ingredients.appendChild(li);
            }
        });
    });
}

const ingredientsSearchInput = document.getElementById("ingredients-search");
handleSearchInput(ingredientsSearchInput, "ingredients");

// ----------------------------------------------------------------------------------- //

// * Génère tous les appareils dans le menu déroulant des appareils * //
export function extractAppareilsItems(recipes) {
    let appareilsDOM = document.querySelector(".appareils ul");

    keepFirstChildOnly(appareilsDOM);

    const appareilsList = [];
    recipes.forEach((recipe) => {
        if (!appareilsList.includes(recipe.appliance.toLowerCase())) {
            appareilsList.push(recipe.appliance.toLowerCase());

            let li = createListItem("appareils", recipe.appliance);
            attachSelectionHandler(li, "appareils");
            appareilsDOM.appendChild(li);
        }
    });
}

const appareilsSearchInput = document.getElementById("appareils-search");
handleSearchInput(appareilsSearchInput, "appareils");

// ----------------------------------------------------------------------------------- //

// * Génère tous les ustensiles dans le menu déroulant des ustensiles * //
export function extractUstensilesItems(recipes) {
    let ustensilesDOM = document.querySelector(".ustensiles ul");

    keepFirstChildOnly(ustensilesDOM);

    const ustensilesList = [];
    recipes.forEach((recipe) => {
        recipe.ustensils.forEach((ustensil) => {
            if (!ustensilesList.includes(ustensil.toLowerCase())) {
                ustensilesList.push(ustensil.toLowerCase());

                let li = createListItem("ustensiles", ustensil);
                attachSelectionHandler(li, "ustensiles");
                ustensilesDOM.appendChild(li);
            }
        });
    });
}

const ustensilesSearchInput = document.getElementById("ustensiles-search");
handleSearchInput(ustensilesSearchInput, "ustensiles");

// Initialise les 3 listes de filtres au démarrage
extractRecipeElements(recipes);

// ----------------------------------------------------------------------------------- //

/**
 * Appelle l’extraction des éléments de chaque catégorie.
 * @param {Array} recipes - Liste des recettes.
 */
export function extractRecipeElements(recipes) {
    extractAppareilsItems(recipes);
    extractIngredientsItems(recipes);
    extractUstensilesItems(recipes);
}

/**
 * Réinsère un élément supprimé dans sa liste d’origine.
 * @param {HTMLElement} element - Élément à réinsérer.
 * @param {string} category - Catégorie concernée.
 */
function getBack(element, category) {
    attachSelectionHandler(element, category);
    document.querySelector(`.${category} ul`).appendChild(element);
}

/**
 * Ne conserve que le premier enfant dans un conteneur (souvent un input),
 * pour réinitialiser une liste de dropdown.
 * @param {HTMLElement} parentElement - Élément parent à nettoyer.
 */
function keepFirstChildOnly(parentElement) {
    while (parentElement.children.length > 1) {
        parentElement.removeChild(parentElement.lastChild);
    }
}