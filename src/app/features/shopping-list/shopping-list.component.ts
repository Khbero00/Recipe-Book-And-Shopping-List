import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { Items } from '@myapp-models/items.model';
import { ShoppingList } from '@myapp-models/shopping-list.model';
import { RecipeDataService } from '@myapp-services/recipe-data.service';
import { RecipeFormService } from '@myapp-services/recipe-form.service';
import { ShoppingListService } from '@myapp-services/shopping-list.service';
import { ShoppingListFormService } from '@myapp-services/shopping-list-form.service';
import { RecipeDialogComponent } from '@myapp-shared-components/recipe-dialog/recipe-dialog.component';
import { ShoppingListDialogComponent } from '@myapp-shared-components/shopping-list-dialog/shopping-list-dialog.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  shoppingLists: ShoppingList[] = [];
  addShoppingListForm: FormGroup;
  fullName: string;

  constructor(private recipeDataService: RecipeDataService,
              private router: Router,
              private recipeFormService: RecipeFormService,
              public shoppingListService: ShoppingListService,
              public shoppingListFormService: ShoppingListFormService,
              public dialog: MatDialog, 
              public snackBar: MatSnackBar,
              private afs: AngularFirestore) { }

  ngOnInit() {
    this.fullName = `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`;
    this.shoppingListService.getShoppingLists().subscribe(list => {
        this.shoppingLists = list;
        this.shoppingLists.forEach(shoppingList => {
          this.shoppingListService.getShoppingListItemsByShoppingListId(shoppingList.id)
          .subscribe(items => shoppingList.items = items);
        });
      });
    this.addShoppingListForm = this.shoppingListFormService.addShoppingListForm();
  }

  onResize(event) {
    event.target.innerHeight;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ShoppingListDialogComponent, {
      width: '750px',
      data: {addShoppingList: this.addShoppingListForm}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addShoppingListForm = result;
        this.saveShoppingList();
      }
      this.resetShoppingListForm();
    });
  }

  openSnackBar(status: string, action: string) {
    this.snackBar.open(status, action, {
      duration: 2000
    });
  }

  saveShoppingList() {

    const isAddingToRecipeList = this.addShoppingListForm.value.recipeAdd;
    const items = this.addShoppingListForm.value.items;

    this.addShoppingListForm.value.id = this.afs.createId();
    this.shoppingListService.saveShoppingList(this.addShoppingListForm.value).subscribe(response => {
      if (response[0].payload.doc.exists) {
        this.openSnackBar("Shopping list was saved successfully!", "Close");
        if (isAddingToRecipeList) {
          this.addToRecipesList(items);
        } else {
          this.addShoppingListForm.reset();
        }
      }
    }, () => {
      this.openSnackBar("Shopping list was not saved.", "Close");
    })
  }

  resetShoppingListForm() {
    let itemsArray = (<FormArray>this.addShoppingListForm.get('items'));

    while(itemsArray.length) 
    itemsArray.removeAt(0);

    this.addShoppingListForm.reset();
    
  }

  addToRecipesList(items: Items[]) {

    let recipeFormGroup: FormGroup = this.recipeFormService.addRecipeForm();

    items.forEach(item => {
      (<FormArray>recipeFormGroup.get('ingredients')).push(new FormGroup({
        'id': new FormControl(0),
        'name': new FormControl(item.name),
        'quantity': new FormControl(item.quantity)
      }));
    });

    const dialogRef = this.dialog.open(RecipeDialogComponent, {
      width: '750px',
      data: {addRecipe: recipeFormGroup}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        recipeFormGroup = result;
        
        recipeFormGroup.value.id = this.afs.createId();
        recipeFormGroup.value.directions = Array.prototype.map.call(result.value.directions, s => s).toString();
        this.recipeDataService.saveRecipe(recipeFormGroup.value).subscribe(response => {
        if (response[0].payload.doc.exists) {
          this.openSnackBar("Recipe was saved successfully!", "Close");
          this.addShoppingListForm.reset();
          recipeFormGroup.reset();
        }
      }, () => {
        this.openSnackBar("Recipe was not saved.", "Close");
      })
      }
      let itemsArray = (<FormArray>recipeFormGroup.get('ingredients'));

    while(itemsArray.length) 
    itemsArray.removeAt(0);

    recipeFormGroup.value.recipeAdd = false;

    recipeFormGroup.reset();
    this.router.navigate(['/recipes']);
    });
  }

}
