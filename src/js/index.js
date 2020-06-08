// Global app controller

import Search from "./models/Search";
import Likes from "./models/Likes";
import {
  element,
  renderLoader,
  clearLoader,
  elementString,
} from "./view/DOMelements";
import * as searchView from "./view/searchView";
import * as recipeView from "./view/recipeView";
import * as shoppingView from "./view/shoppingView";
import Recipe from "../js/models/Recipe";
import List from "./models/shoppingList";
import * as likesView from "./view/likesView";

/**Global state of the app
 *-Search object
 *- Current recipe object
 *-Liked recipes
 *-Shopping list object
 */
const state = {};
window.state = state;


//******************SEARCH*****************
const controlSearch = async () => {
  //get Query
  const query = searchView.getInput();

  if (query) {
    //state.search
    state.search = new Search(query);
    try {
      //Prepare UI for Results
      searchView.clearInput();
      searchView.clearResult();
      renderLoader(element.resultLoader);

      //Search for recipe
      await state.search.getResults();
      clearLoader();
      //render results on UI
      // console.log(state.search);

      searchView.renderResult(state.search.result);
    } catch (error) {
      console.log(error);
      alert("Something went WRONG :(");
      clearLoader();
    }
  }
};
element.searchButton.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

element.resPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResult();
    searchView.renderResult(state.search.result, goToPage);
    console.log(goToPage);
  }
});

//************ Recipe **********************
const r = new Recipe(54416);
r.getRecipe();

const controlRecipe = async () => {
  //get id from URLSearchParams
  const id = window.location.hash.replace("#", "");
  console.log(id);
  if (id) {
    //Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(element.recipe);

    //Highlight Selected Search item
    if (state.search) searchView.highlightSelected(id);

    //Create new Recipe object
    state.recipe = new Recipe(id);
    //TTEESSTTIINNGG
    window.r = state.recipe;
    try {
      //Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //calculate serving and timeout
      state.recipe.caclcTime();
      state.recipe.calcServings();
      //Render on UI
      console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert("ERROR while loading recipe :(");
    }
  }
};
//window.addEventListener('hashchange', controlRecipe);

//******************** List COntroller*******************

const controlList = () => {
  //create new list IF there is createNonEnumerableProperty
  if (!state.list) state.list = new List();

  //Add each ingredient to the listener
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    shoppingView.renderItem(item);
    console.log(item);
  });
};

//handle delete and update  list item events
element.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  //handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    //Delete from state 
    shoppingView.deleteItem(id);
  }
  //Handle count update
  else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

//************LIKES Controller*****************************

//TTEESSTTIINNGG


const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  //User has NOT yet liked current recipeView
  if (!state.likes.isLiked(currentID)) {
    console.log('i am here')
    //Add like to the state
    const newLike = state.likes.addLike(
     state.recipe.id,
     //47025,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    console.log(newLike
      );
    //Toggle the buttons
    likesView.toggleLikeButton(true);
    //Add like to UI list
    likesView.renderLike(newLike);
    //console.log(state.likes);
  } else {
    //Remove like to the state
    state.likes.deleteLike(currentID);
    //Toggle the buttons
    likesView.toggleLikeButton(false);
    //Remove like to UI list
    likesView.deleteLikes(currentID);
    console.log(state.likes);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  
  };

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

//Restore likes recipe on page load
window.addEventListener('load',() => {
  state.likes = new Likes();
  state.likes.readStorage();
likesView.toggleLikeMenu(state.likes.getNumLikes());
state.likes.likes.forEach(like => likesView.renderLike(like));
})
//Handling recipe button clicks
element.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease * ")) {
    //Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase * ")) {
    //Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    //Add to list button
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

window.l = new List();
