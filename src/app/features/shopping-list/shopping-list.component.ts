import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { ShoppingListService } from '@myapp-services/shopping-list.service';
import { ShoppingListFormService } from '@myapp-services/shopping-list-form.service';

import { ShoppingList } from '@myapp-models/shopping-list.model';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ShoppingListDialogComponent } from 'src/app/shared/components/shopping-list-dialog/shopping-list-dialog.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  shoppingLists: ShoppingList[] = [];
  addShoppingListForm: FormGroup;
  fullName: string;
  
  constructor(public shoppingListService: ShoppingListService,
              public shoppingListFormService: ShoppingListFormService,
              public dialog: MatDialog, 
              public snackBar: MatSnackBar) { }

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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.shoppingLists, event.previousIndex, event.currentIndex);
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(ShoppingListDialogComponent, {
      width: '750px',
      data: {addShoppingList: this.addShoppingListForm}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.addShoppingListForm = result;
        
        // this.saveShoppingList();
      }
      // this.resetShoppingListForm();
    });
  }

  public openSnackBar(status: string, action: string) {
    this.snackBar.open(status, action, {
      duration: 2000
    });
  }

  // private saveShoppingList() {
  //   this.addShoppingListForm.value.id = this.afs.createId();
  //   this.shoppingListService.saveRecipe(this.addShoppingListForm.value).subscribe(response => {
  //     if (response[0].payload.doc.exists) {
  //       this.openSnackBar("Recipe was saved successfully!", "Close");
  //     }
  //   }, error => {
  //     this.openSnackBar("Recipe was not saved.", "Close");
  //   })
  // }

  // private resetShoppingListForm() {
  //   let ingredientsArray = (<FormArray>this.addShoppingListForm.get('ingredients'));

  //   while(ingredientsArray.length) 
  //     ingredientsArray.removeAt(0);

  //   this.addShoppingListForm.reset();
    
  // }

}
