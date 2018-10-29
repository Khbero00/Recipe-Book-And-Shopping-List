import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent implements OnInit {

  addRecipeForm: FormGroup;
  dialogType: string;
  placeholder: string = "Step";

  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    if (this.data.hasOwnProperty("message")) this.dialogType = "message"
    else if(this.data.hasOwnProperty("recipeForm")) {
      this.dialogType = "recipeForm"
      this.addRecipeForm = this.data.recipeForm;
    };
  }

  addDirections() {
    const directions = new FormControl(null, Validators.required);
    (<FormArray>this.addRecipeForm.get('directions')).push(directions)
  }

  addIngredients() {
    const ingredientsFormGroup = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'quantity': new FormControl(null, Validators.required)
    });
    (<FormArray>this.addRecipeForm.get('ingredients')).push(ingredientsFormGroup)
  }

  removeDirections(index) {
    (<FormArray>this.addRecipeForm.get('directions')).removeAt(index);
  }

  removeIngredient(index) {
    (<FormArray>this.addRecipeForm.get('ingredients')).removeAt(index);
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.addRecipeForm.reset();
  }
}
