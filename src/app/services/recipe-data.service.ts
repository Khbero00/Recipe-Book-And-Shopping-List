import { Injectable } from '@angular/core';
import { Recipe } from '@myapp-models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeDataService {

  recipes: Recipe[] = [
    new Recipe(1, "A Test Recipe", "This is simply a test", "https://www.farmwifecooks.com/wp-content/uploads/2017/02/BBQChicken-1.jpg"),
    new Recipe(2, "A Second Test Recipe", "This is another test", "https://cdn.cpnscdn.com/static.coupons.com/ext/kitchme/images/recipes/600x400/low-carb-southern-fried-chicken-recipe_16091.jpg")
  ]

  constructor() { }

  getRecipes() {
    return this.recipes;
  }
}
