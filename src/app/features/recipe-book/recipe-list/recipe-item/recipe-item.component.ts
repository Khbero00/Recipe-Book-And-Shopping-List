import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '@myapp-models/recipe.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  @Input() recipe: Recipe;

  constructor(private router: Router) { }

  ngOnInit() {}

  navigateToRecipe() {
    this.router.navigate([`recipes/${this.recipe.id}`]);
  }

}
