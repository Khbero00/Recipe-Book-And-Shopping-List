import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ShoppingListFormService } from '@myapp-services/shopping-list-form.service';
import { ShoppingListService } from '@myapp-services/shopping-list.service';
import { Items } from '@myapp-models/items.model';

@Component({
  selector: 'app-shopping-list-dialog',
  templateUrl: './shopping-list-dialog.component.html',
  styleUrls: ['./shopping-list-dialog.component.css']
})
export class ShoppingListDialogComponent implements OnInit {

  shoppingListForm: FormGroup;
  dialogType: string;
  items: Items[] = [];

  constructor(public dialogRef: MatDialogRef<ShoppingListDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) 
              public data, 
              private shoppingListFormService: ShoppingListFormService,
              private shoppingListService: ShoppingListService) { }

  ngOnInit() { this.dialogTypeCheck(); }

  dialogTypeCheck() {
    if (this.data.hasOwnProperty("addShoppingList")) {
        this.dialogType = 'addShoppingList';
        this.shoppingListForm = this.data.addShoppingList;
    } else if (this.data.hasOwnProperty("viewShoppingList"))  {
        this.dialogType = 'viewShoppingList';
    } else {
        this.shoppingListForm = this.data.editShoppingList;
    }
  }

  addItems() {
    const shoppingListFormGroup = new FormGroup({
      'id': new FormControl(0),
      'name': new FormControl(null, Validators.required),
      'quantity': new FormControl(null, Validators.required)
    });
    (<FormArray>this.shoppingListForm.get('items')).push(shoppingListFormGroup);
  }

  get formItems() { return this.shoppingListForm.get('items') }

  removeItem(index) {
    const shoppingListItemId = this.shoppingListForm.get('items')['controls'][index].value.id;
    (<FormArray>this.shoppingListForm.get('items')).removeAt(index);

    if (shoppingListItemId) this.shoppingListService.deleteShoppingListItem(shoppingListItemId);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
