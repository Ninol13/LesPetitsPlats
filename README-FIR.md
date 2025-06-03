# Fiche d’investigation de fonctionnalité — Algorithme de recherche

**Fonctionnalité étudiée** : Recherche principale dans "Les Petits Plats"
**Objectif** : Identifier la version de l’algorithme la plus performante entre deux implémentations de la recherche : une version avec programmation fonctionnelle et une version avec boucles classiques.
**Date** : 30/05/2025

---

## 🔍 Description de la fonctionnalité

Lorsqu’un utilisateur saisit un mot (≥ 3 caractères), les recettes doivent être filtrées dynamiquement si ce mot apparaît dans :
- le nom de la recette
- sa description
- la liste de ses ingrédients

---

## 🧠 Deux implémentations comparées

### 1. Version fonctionnelle (avec `filter`, `some`, `includes`)

```javascript
function searchFunctional(recipes, query) {
  const keyword = query.toLowerCase();
  return recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(keyword) ||
    recipe.description.toLowerCase().includes(keyword) ||
    recipe.ingredients.some(ing =>
      ing.ingredient.toLowerCase().includes(keyword)
    )
  );
}
```

### 2. Version avec boucles classiques (`for` + `break`)

```javascript
function searchWithLoops(recipes, query) {
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
```

---

## 🧪 Tests de performance

Les deux algorithmes ont été testés sur jsben.ch avec un échantillon de 30 recettes.

🔗 [Voir le test sur jsben.ch](https://jsben.ch/NAu1m)

---

## ⚖️ Résultats

| Algorithme           | Ops/sec (± marge) | Observations                            |
|----------------------|-------------------|-----------------------------------------|
| Fonctionnel (filter) | 1154228           | Plus rapide                             |
| Boucles classiques   |  721790           | Plus lent                               |

---

## ✅ Conclusion

L’algorithme retenu est la version fonctionnelle utilisant `filter`, `some` et `includes`.
Il est plus performant et plus lisible que la version avec boucles classiques.

---