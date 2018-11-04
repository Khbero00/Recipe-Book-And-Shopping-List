import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RecipeFormService } from 'src/app/services/recipe-form.service';


@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {

  recipeForm: FormGroup;
  dialogType: string;
  placeholder: string = "Step";

  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private recipeFormService: RecipeFormService) {}

  ngOnInit() {
    this.dialogTypeCheck();
  }

  dialogTypeCheck() {
    if (this.data.hasOwnProperty("message")) {
        this.dialogType = "message";
    } 
    else if (this.data.hasOwnProperty("recipeForm")) {
        this.dialogType = "recipeForm";
        this.recipeForm = this.data.recipeForm;
    }
    else if (this.data.hasOwnProperty("deletionConfirmation")) {
        this.dialogType = "deletionConfirmation";
    }
    else if (this.data.hasOwnProperty("editRecipe")) {
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
      console.log(stepValue);
    } else { stepValue = `Step ${Number(index + 1)}: `; console.log(stepValue);}
    return stepValue;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
