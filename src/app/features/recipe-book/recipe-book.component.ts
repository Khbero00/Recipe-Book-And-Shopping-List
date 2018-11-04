import { Component, OnInit } from '@angular/core';
import {FormGroup, FormArray } from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material'
import { AngularFirestore } from '@angular/fire/firestore';

import { Recipe } from '@myapp-models/recipe.model';
import { RecipeFormService } from '@myapp-services/recipe-form.service';
import { RecipeDataService } from '@myapp-services/recipe-data.service';

import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css'],
})
export class RecipeBookComponent implements OnInit {
  recipes: Recipe[] = [];
  
  addRecipeForm: FormGroup;
  
  screenWidth: number;
  
  fullName: string;
  
  constructor(private recipeDataService: RecipeDataService, 
              private recipeFormService: RecipeFormService,
              private afs: AngularFirestore,
              public dialog: MatDialog, 
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.fullName = `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`;
      this.screenWidth = window.innerWidth;

      this.recipeDataService.getRecipes().subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
        this.recipes.forEach(recipe => {
          this.recipeDataService.getIngredients(recipe.id)
          .subscribe(ingredients => recipe.ingredients = ingredients);
        });
      });

      this.addRecipeForm = this.recipeFormService.addRecipeForm();
  }
  
  public openDialog(): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '750px',
      data: {recipeForm: this.addRecipeForm}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addRecipeForm = result;
        this.addRecipeForm.value.directions = Array.prototype.map.
        call(result.value.directions, s => s).toString();
        this.saveRecipe();
      }
      this.resetRecipeForm();
    });
  }

  public openSnackBar(status: string, action: string) {
    this.snackBar.open(status, action, {
      duration: 2000
    });
  }

  private saveRecipe() {
    this.addRecipeForm.value.id = this.afs.createId();
    this.recipeDataService.saveRecipe(this.addRecipeForm.value).subscribe(response => {
      if (response[0].payload.doc.exists) {
        this.openSnackBar("Recipe was saved successfully!", "Close");
      }
    }, error => {
      this.openSnackBar("Recipe was not saved.", "Close");
    })
  }

  private resetRecipeForm() {
    this.addRecipeForm.reset();

    let directionsArray = (<FormArray>this.addRecipeForm.get('directions'));
    let ingredientsArray = (<FormArray>this.addRecipeForm.get('ingredients'));

    while(directionsArray.length)
      directionsArray.removeAt(0);

    while(ingredientsArray.length) 
      ingredientsArray.removeAt(0);
  }
}
