import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RecipeDataService } from '@myapp-services/recipe-data.service';


@Component({
  selector: 'app-recipe-dialog',
  templateUrl: './recipe-dialog.component.html',
  styleUrls: ['./recipe-dialog.component.css']
})
export class RecipeDialogComponent implements OnInit {

  recipeForm: FormGroup;
  placeholder: string = "Step";

  constructor(public dialogRef: MatDialogRef<RecipeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data, 
              private recipeDataService: RecipeDataService) {}

  ngOnInit() { this.dialogTypeCheck(); }

  dialogTypeCheck() {
    if (this.data.hasOwnProperty("addRecipe")) {
        this.recipeForm = this.data.addRecipe;
    } else { this.recipeForm = this.data.editRecipe; }
  }

  get formIngredients() { return <FormArray>this.recipeForm.get('ingredients') }
  get formDirections() { return <FormArray>this.recipeForm.get('directions') }

  addDirections() {
    const directions = new FormControl(null, Validators.required);
    this.formDirections.push(directions);
  }

  removeDirection(index) {
    this.formDirections.removeAt(index);
  }

  addIngredients() {
    const ingredientsFormGroup = new FormGroup({
      'id': new FormControl(0),
      'name': new FormControl(null, Validators.required),
      'quantity': new FormControl(null, Validators.required)
    });
    this.formIngredients.push(ingredientsFormGroup);
  }

  removeIngredient(index) {
    const ingredientId = this.formIngredients.controls[index].value.id;
    this.formIngredients.removeAt(index);

    if (ingredientId) this.recipeDataService.deleteIngredient(ingredientId);
  }

  createValue(index) {
    let stepValue = "";
    if (this.formDirections.controls[index].value) {
      stepValue = this.formDirections.controls[index].value;
    } else { stepValue = `Step ${Number(index + 1)}: `;}
    return stepValue;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
