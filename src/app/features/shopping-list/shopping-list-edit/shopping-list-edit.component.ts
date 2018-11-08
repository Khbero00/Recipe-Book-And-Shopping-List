import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { ShoppingList } from '@myapp-models/shopping-list.model';
import { ShoppingListService } from '@myapp-services/shopping-list.service';

import { ShoppingListDialogComponent } from 'src/app/shared/components/shopping-list-dialog/shopping-list-dialog.component';
import { DeletionDialogComponent } from 'src/app/shared/components/deletion-dialog/deletion-dialog.component';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit {
  
  @Input() shoppingList: ShoppingList;

  constructor(public dialog: MatDialog, public snackBar: MatSnackBar, private shoppingListService: ShoppingListService) { }

  ngOnInit() {}

  editShoppingList(shoppingList: ShoppingList) {
    const dialogRef = this.dialog.open(ShoppingListDialogComponent, {
      width: '750px',
      data: {editShoppingList : shoppingList}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.value) {
        this.shoppingListService.updateShoppingList(result.value).subscribe(shoppingList => {
          if (shoppingList.payload.exists) this.openSnackBar('Shopping list was updated Successfully', 'Close');
        })
      }
    });
  }

  openSnackBar(status: string, action: string) {
    this.snackBar.open(status, action, {
      duration: 2000
    });
  }

  deleteShoppingList(shoppingList: ShoppingList) {
    const dialogRef = this.dialog.open(DeletionDialogComponent, {
      width: '750px',
      data: {deletionConfirmation : "Are you sure you want to delete this shopping list?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shoppingListService.deleteShoppingList(shoppingList).subscribe(response => {
          this.openSnackBar('Shopping list was deleted Successfully', 'Close');
        }, error => {
          this.openSnackBar('Shopping list could not be deleted at this time', 'Close');
        });
      }
    });
  }

}
