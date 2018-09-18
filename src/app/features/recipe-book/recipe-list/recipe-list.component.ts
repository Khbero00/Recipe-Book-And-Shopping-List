import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '@myapp-models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Input() recipes: Recipe[] = [];

  constructor() { }

  ngOnInit() {
  }
}
