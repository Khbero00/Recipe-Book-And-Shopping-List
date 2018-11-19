import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { ShoppingList } from '@myapp-models/shopping-list.model';
import { ShoppingListService } from '@myapp-services/shopping-list.service';
import { ShoppingListDialogComponent } from '@myapp-shared-components/shopping-list-dialog/shopping-list-dialog.component';
import { DeletionDialogComponent } from '@myapp-shared-components/deletion-dialog/deletion-dialog.component';
import { Items } from '@myapp-models/items.model';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { RecipeFormService } from '@myapp-services/recipe-form.service';
import { RecipeDataService } from '@myapp-services/recipe-data.service';
import { RecipeDialogComponent } from '@myapp-shared-components/recipe-dialog/recipe-dialog.component';
import { ShoppingListFormService } from '@myapp-services/shopping-list-form.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit {
  
  @Input() shoppingList: ShoppingList;
  editShoppingListForm: FormGroup;
  
  constructor(public dialog: MatDialog, 
              public snackBar: MatSnackBar, 
              private afs: AngularFirestore,
              private router: Router,
              private recipeFormService: RecipeFormService,
              private recipeDataService: RecipeDataService,
              private shoppingListFormServivce: ShoppingListFormService,
              private shoppingListService: ShoppingListService) { }

  ngOnInit() {}

  editShoppingList(shoppingList: ShoppingList) {

    this.editShoppingListForm = this.shoppingListFormServivce.editShoppingListForm(shoppingList);

    const dialogRef = this.dialog.open(ShoppingListDialogComponent, {
      width: '750px',
      data: {editShoppingList : this.editShoppingListForm}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.value) {
        this.editShoppingListForm = result;
        this.shoppingListService.updateShoppingList(result.value).subscribe(shoppingList => {
          if (shoppingList.payload.exists) {
            this.openSnackBar('Shopping list was updated Successfully', 'Close');
            if (this.editShoppingListForm.value.recipeAdd) {
              this.addToRecipeList(this.editShoppingListForm.value.items);
            } else {
              this.editShoppingListForm.reset();
            }
          }
        })
      }
    });
  }

  viewShoppingList(shoppingList: ShoppingList) {
    this.dialog.open(ShoppingListDialogComponent, {
      width: '750px',
      data: {viewShoppingList : shoppingList}
    });
  }

  openSnackBar(status: string, action: string) {
    this.snackBar.open(status, action, {
      duration: 2000
    });
  }

  addToRecipeList(items: Items[]) {

    let recipeListFormGroup: FormGroup = this.recipeFormService.addRecipeForm();

    items.forEach(item => {
      (<FormArray>recipeListFormGroup.get('ingredients')).push(new FormGroup({
        'id': new FormControl(0),
        'name': new FormControl(item.name),
        'quantity': new FormControl(item.quantity),
      }));
    });

    const dialogRef = this.dialog.open(RecipeDialogComponent, {
      width: '750px',
      data: {addRecipe: recipeListFormGroup}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        recipeListFormGroup = result;
        
        recipeListFormGroup.value.id = this.afs.createId();
        this.recipeDataService.saveRecipe(recipeListFormGroup.value).subscribe(response => {
        if (response[0].payload.doc.exists) {
          this.openSnackBar("Shopping list was saved successfully!", "Close");
        }
      }, error => {
        this.openSnackBar("Shopping list was not saved.", "Close");
      })
      }
      let ingredientsArray = (<FormArray>recipeListFormGroup.get('ingredients'));

    while(ingredientsArray.length) 
      ingredientsArray.removeAt(0);
    
    this.editShoppingListForm.reset();
    recipeListFormGroup.reset();
    this.router.navigate(['/recipes']);
    });
  }

  deleteShoppingList(shoppingList: ShoppingList) {
    const dialogRef = this.dialog.open(DeletionDialogComponent, {
      width: '750px',
      data: {deletionConfirmation : "Are you sure you want to delete this shopping list?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shoppingListService.deleteShoppingList(shoppingList).subscribe(() => {
          this.openSnackBar('Shopping list was deleted Successfully', 'Close');
        }, () => {
          this.openSnackBar('Shopping list could not be deleted at this time', 'Close');
        });
      }
    });
  }

}
