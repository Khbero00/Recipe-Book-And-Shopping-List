import { Component, OnInit, Input } from '@angular/core';
import {trigger, state, style, transition, animate, keyframes, group} from '@angular/animations';
import { Recipe } from '@myapp-models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
  animations: [
    trigger('flyInOut', [
      state('recipes', style({transform: 'translateY(0)'})),
      transition('void => recipes', [
        style({transform: 'translateY(100%)'}),
        animate(100)
      ]),
      transition('recipes => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ]),
    ])
  ]
})
export class RecipeListComponent implements OnInit {
  @Input() recipes: Recipe[] = [];

  constructor() { }

  ngOnInit() {
  }
}
