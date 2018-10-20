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

  recipe: Recipe;

  constructor(private recipeDataService: RecipeDataService, private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params && params['id']) {
        this.recipeDataService.getRecipe(params['id']).subscribe(recipe => {
          this.recipe = recipe;
        });
      }
    });
  }
}
