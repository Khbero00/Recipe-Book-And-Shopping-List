import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';
import { Recipe } from '@myapp-models/recipe.model';
import { Ingredient } from '@myapp-models/ingredient.model';
import { RecipeDataService } from '@myapp-services/recipe-data.service';
import { RecipeDialogComponent } from 'src/app/shared/components/recipe-dialog/recipe-dialog.component';
import { DeletionDialogComponent } from 'src/app/shared/components/deletion-dialog/deletion-dialog.component';
import { ShoppingListService } from '@myapp-services/shopping-list.service';
import { ShoppingListFormService } from '@myapp-services/shopping-list-form.service';
import { ShoppingListDialogComponent } from '@myapp-shared-components/shopping-list-dialog/shopping-list-dialog.component';
import { RecipeFormService } from '@myapp-services/recipe-form.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent {

  @Input() recipe: Recipe;
  editRecipeForm: FormGroup;

  constructor(public dialog: MatDialog, 
              public snackBar: MatSnackBar, 
              private recipeDataService: RecipeDataService,
              private recipeFormService: RecipeFormService,
              private router: Router,
              private shoppingListFormService: ShoppingListFormService,
              private afs: AngularFirestore,
              public shoppingListService: ShoppingListService) { }

  editRecipe(recipe: Recipe) {
    this.editRecipeForm = this.recipeFormService.editRecipeForm(recipe);

    const dialogRef = this.dialog.open(RecipeDialogComponent, {
      width: '750px',
      data: {editRecipe : this.editRecipeForm}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.value) {
        this.editRecipeForm = result;
        result.value.directions = Array.prototype.map.call(this.editRecipeForm.value.directions, s => s).toString();
        
        this.recipeDataService.updateRecipe(this.editRecipeForm.value).subscribe(recipe => {
          if (recipe.payload.exists) {
            this.openSnackBar('Recipe was updated Successfully', 'Close');
            
            if (this.editRecipeForm.value.shoppingListAdd) {
              this.addToShoppingList(this.editRecipeForm.value.ingredients);
            } else {
              this.editRecipeForm.reset();
            }
          }
        })
      }
    });
  }

  openSnackBar(status: string, action: string) {
    this.snackBar.open(status, action, {
      duration: 2000
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
          this.editRecipeForm.value.shoppingListAdd = false;
        }
      }, error => {
        this.openSnackBar("Shopping list was not saved.", "Close");
      })
      }
      let itemsArray = (<FormArray>shoppingListFormGroup.get('items'));

    while(itemsArray.length) 
      itemsArray.removeAt(0);
    
    this.editRecipeForm.reset();
    shoppingListFormGroup.reset();

    shoppingListFormGroup.reset();
    this.router.navigate(['/shopping-list']);
    });
  }

  deleteRecipe(recipe: Recipe) {
    const dialogRef = this.dialog.open(DeletionDialogComponent, {
      width: '750px',
      data: {deletionConfirmation : "Are you sure you want to delete this recipe?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recipeDataService.deleteRecipe(recipe)
        .subscribe(() => {
          this.openSnackBar('Recipe was deleted Successfully', 'Close');
        }, () => {
          this.openSnackBar('Recipe could not be deleted at this time', 'Close');
        });
      }
    });
  }
}
