import { Component, OnInit } from '@angular/core';
import { Recipe } from '@myapp-models/recipe.model';
import { RecipeDataService } from '../../services/recipe-data.service';

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css']
})
export class RecipeBookComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private recipeDataService: RecipeDataService) { }

  ngOnInit() {
    this.recipes = this.recipeDataService.getRecipes();
  }

}
