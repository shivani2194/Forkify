import { element } from "./DOMelements";
export const getInput = () => element.searchInput.value;
const renderRecipe = (recipe) => {
  const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.title}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
  document
    .querySelector(".results__list")
    .insertAdjacentHTML("beforeend", markup);
};

export const renderResult = (recipes) => {
  console.log(`Here are the RECIPES:${JSON.stringify(recipes)}`);
  recipes.forEach((el) => renderRecipe(el));
};

/*
 `<li>
     <a class="results__link" href="#${recipe.recipe_id}">
         <figure class="results__fig">
             <img src="${recipe.image_url}" alt="Test">
         </figure>
             <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
     </li>`;
*/
