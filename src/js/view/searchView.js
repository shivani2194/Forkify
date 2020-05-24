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
                    <h4 class="results__name">${limitRecipeTitle(
                      recipe.title
                    )}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
  element.resultList.insertAdjacentHTML("beforeend", markup);
};

export const renderResult = (recipes) => {
  console.log(`Here are the RECIPES:${JSON.stringify(recipes)}`);
  recipes.forEach((el) => renderRecipe(el));
};

export const clearInput = () => {
  element.searchInput.value = " ";
};
export const clearResult = () => {
  element.resultList.innerHTML = " ";
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > 17) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= 17) {
        newTitle.push(cur);
        //console.log(newTitle.join(" "));
        //console.log(acc + cur.length);
      } return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};
