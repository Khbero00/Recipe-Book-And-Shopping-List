import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { RecipeFormService } from 'src/app/services/recipe-form.service';


@Component({
  selector: 'app-recipe-dialog',
  templateUrl: './recipe-dialog.component.html',
  styleUrls: ['./recipe-dialog.component.css']
})
export class RecipeDialogComponent implements OnInit {

  recipeForm: FormGroup;
  dialogType: string;
  placeholder: string = "Step";

  constructor(public dialogRef: MatDialogRef<RecipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private recipeFormService: RecipeFormService) {}

  ngOnInit() {
    this.dialogTypeCheck();
  }

  dialogTypeCheck() {
    if (this.data.hasOwnProperty("addRecipe")) {
        this.dialogType = "addRecipe";
        this.recipeForm = this.data.recipeForm;
    } else {
        this.dialogType = "editRecipe";
        this.recipeForm = this.recipeFormService.editRecipeForm(this.data.editRecipe);
    }
  }

  addDirections() {
    const directions = new FormControl(null, Validators.required);
    (<FormArray>this.recipeForm.get('directions')).push(directions);
  }

  removeDirection(index) {
    (<FormArray>this.recipeForm.get('directions')).removeAt(index);
  }

  addIngredients() {
    const ingredientsFormGroup = new FormGroup({
      'id': new FormControl(0),
      'name': new FormControl(null, Validators.required),
      'quantity': new FormControl(null, Validators.required)
    });
    (<FormArray>this.recipeForm.get('ingredients')).push(ingredientsFormGroup);
  }

  removeIngredient(index) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  createValue(index) {
    let stepValue = "";
    if (this.recipeForm.get('directions')['controls'][index].value) {
      stepValue = this.recipeForm.get('directions')['controls'][index].value;
    } else { stepValue = `Step ${Number(index + 1)}: `; console.log(stepValue);}
    return stepValue;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
