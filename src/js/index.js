// Global app controller

import Search from "./models/Search";
import {element} from "./view/DOMelements";
import * as searchView from "./view/searchView";

/**Global state of the app
 *-Search object
 *- Current recipe object
 *-Liked recipes
 *-Shopping list object
 */
const state = {};
const controlSearch = async () => {
  //get Query
  const query = searchView.getInput();

  if (query) {
    //state.search
    state.search = new Search(query);
    //Prepare UI for Results
    //Search for recipe
    await state.search.getResults();
    //render results on UI
    console.log(state.search);
    
  searchView.renderResult(state.search.result);
  }
};
element.searchButton.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});
