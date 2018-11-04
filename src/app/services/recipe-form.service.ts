import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { Recipe } from '@myapp-models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeFormService {

  constructor() { }

  public addRecipeForm() {
    return this.getRecipeFormGroup();
  }

  public editRecipeForm(recipe: Recipe): FormGroup {
    let editRecipeForm = this.getRecipeFormGroup();
    let directionsArray = recipe.directions.split(',');

    editRecipeForm.patchValue({id: recipe.id, 
      name: recipe.name,
      nickName: recipe.nickName,
    });

    directionsArray.forEach(step => {
      (<FormArray>editRecipeForm.get('directions')).push(new FormControl(step));
    })

    recipe.ingredients.forEach(ingredient => {
      (<FormArray>editRecipeForm.get('ingredients')).push(new FormGroup({
        'id': new FormControl(ingredient.id),
        'name': new FormControl(ingredient.name),
        'quantity': new FormControl(ingredient.quantity)
      }));
    });
    return editRecipeForm;
  }

  private getRecipeFormGroup(): FormGroup {
    return new FormGroup({
      'id': new FormControl(0),
      'name': new FormControl(null, Validators.required),
      'nickName': new FormControl(null, Validators.required),
      'directions': new FormArray([], Validators.required),
      'ingredients': new FormArray([], Validators.required),
      'userId': new FormControl(localStorage.getItem('userId'))
    });
  }
}
