import { proxy } from "../config";
import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `${proxy}https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      console.log(`I am recipe ${res}`);
    } catch (error) {
      console.log(error);
      alert("Something went WRONG :(");
    }
  }
  caclcTime() {
    //Assuming that we need 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    //1) Uniform Unit
    const longUnit = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const shortUnit = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const units = [...shortUnit, "kg", "g"];

    this.ingredients = this.ingredients.map((el) => {
      let ingredient = el.toLowerCase();
      longUnit.forEach((e, i) => {
        ingredient = ingredient.replace(e, units[i]);
      });
      //console.log(ingredient)
      //2) Remove Paranthesis
      ingredient = ingredient.replace(/ *\([^]*\) */g, " ");

      //3) Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el2) => shortUnit.includes(el2));
      let objIng;
      if (unitIndex > -1) {
        //There is a unit
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(""),
        };
      } else if (parseInt(arrIng[0], 10)) {
        //There is a number but no unit
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(""),
        };
      } else if (unitIndex === -1) {
        //There is no unit & no number
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }
      return objIng;
    });
  }
  updateServings(type){
    //Servings 
    const newServings = type === 'dec' ? this.servings - 1: this.servings + 1;

    //Ingredients
    this.ingredients.forEach(ing => {
      ing.count *= (newServings/ this.servings);
    });
    this.servings = newServings;
  }
}
