import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup, FormArray, FormControl } from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material'
import { AngularFirestore } from '@angular/fire/firestore';

import { Recipe } from '@myapp-models/recipe.model';
import { Ingredient } from '@myapp-models/ingredient.model';

import { RecipeFormService } from '@myapp-services/recipe-form.service';
import { RecipeDataService } from '@myapp-services/recipe-data.service';
import { RecipeDialogComponent } from '@myapp-shared-components/recipe-dialog/recipe-dialog.component';

import { ShoppingListFormService } from '@myapp-services/shopping-list-form.service';
import { ShoppingListDialogComponent } from '@myapp-shared-components/shopping-list-dialog/shopping-list-dialog.component';

import { ShoppingListService } from '@myapp-services/shopping-list.service';


@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.css'],
})
export class RecipeBookComponent implements OnInit {
  recipes: Recipe[] = [];

  addRecipeForm: FormGroup;
  fullName: string;
  
  constructor(private router: Router,
              private recipeDataService: RecipeDataService, 
              private recipeFormService: RecipeFormService,
              private shoppingListFormService: ShoppingListFormService,
              private afs: AngularFirestore,
              public shoppingListService: ShoppingListService,
              public dialog: MatDialog, 
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.fullName = `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`;

      this.recipeDataService.getRecipes().subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
        this.recipes.forEach(recipe => {
          this.recipeDataService.getIngredientsByRecipeId(recipe.id).subscribe(ingredients => recipe.ingredients = ingredients);
        });
      });

      this.addRecipeForm = this.recipeFormService.addRecipeForm();
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(RecipeDialogComponent, {
      width: '750px',
      data: {addRecipe: this.addRecipeForm}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addRecipeForm = result;
        this.addRecipeForm.value.directions = Array.prototype.map.call(result.value.directions, s => s).toString();
        this.saveRecipe();
      }
      this.resetRecipeForm();
    });
  }

  openSnackBar(status: string, action: string) {
    this.snackBar.open(status, action, {
      duration: 2000
    });
  }

  saveRecipe() {
    const isAddingToShoppingList = this.addRecipeForm.value.shoppingListAdd;
    const ingredients = this.addRecipeForm.value.ingredients;

    this.addRecipeForm.value.id = this.afs.createId();
    this.recipeDataService.saveRecipe(this.addRecipeForm.value).subscribe(response => {
      if (response[0].payload.doc.exists) this.openSnackBar("Recipe was saved successfully!", "Close");
      if (isAddingToShoppingList) this.addToShoppingList(ingredients);
    }, error => {
      this.openSnackBar("Recipe was not saved.", "Close");
    });
  }


  addToShoppingList(ingredients: Ingredient[]) {

    let shoppingListFormGroup: FormGroup = this.shoppingListFormService.addShoppingListForm();

    ingredients.forEach(ingredient => {
      (<FormArray>shoppingListFormGroup.get('items')).push(new FormGroup({
        'id': new FormControl(0),
        'name': new FormControl(ingredient.name),
        'quantity': new FormControl(ingredient.quantity),
        'userId': new FormControl(null)
      }));
    });

    const dialogRef = this.dialog.open(ShoppingListDialogComponent, {
      width: '750px',
      data: {addShoppingList: shoppingListFormGroup}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        shoppingListFormGroup = result;
        
        shoppingListFormGroup.value.id = this.afs.createId();
        this.shoppingListService.saveShoppingList(shoppingListFormGroup.value).subscribe(response => {
        if (response[0].payload.doc.exists) {
          this.openSnackBar("Shopping list was saved successfully!", "Close");
          this.addRecipeForm.reset();
        }
      }, error => {
        this.openSnackBar("Shopping list was not saved.", "Close");
      })
      }
      let itemsArray = (<FormArray>shoppingListFormGroup.get('items'));

    while(itemsArray.length) 
      itemsArray.removeAt(0);
    
    shoppingListFormGroup.value.shoppingListAdd = false;

    shoppingListFormGroup.reset();
    this.router.navigate(['/shopping-list']);
    });
  }


  resetRecipeForm() {
    this.addRecipeForm.reset();

    let directionsArray = (<FormArray>this.addRecipeForm.get('directions'));
    let ingredientsArray = (<FormArray>this.addRecipeForm.get('ingredients'));

    while(directionsArray.length)
      directionsArray.removeAt(0);

    while(ingredientsArray.length) 
      ingredientsArray.removeAt(0);
  }
}
