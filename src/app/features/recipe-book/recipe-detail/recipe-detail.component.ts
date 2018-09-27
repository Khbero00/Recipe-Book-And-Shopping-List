import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { RecipeDataService } from '../../../services/recipe-data.service';
import { Recipe } from '@myapp-models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipes: Recipe[] = [];
  recipe: any;

  constructor(private recipeDataService: RecipeDataService, private route: ActivatedRoute) { }


  ngOnInit() {
    //this.recipeDataService.getRecipes().subscribe(recipes => this.recipes = recipes);


    this.route.params.subscribe((params: Params) => {
      this.recipes.forEach(recipe => {
       if (recipe.Id === +params['id']) {
         this.recipe = recipe;
       }
      });
    });
  }
}
