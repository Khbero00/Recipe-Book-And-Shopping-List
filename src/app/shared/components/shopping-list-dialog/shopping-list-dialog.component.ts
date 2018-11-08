import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ShoppingListFormService } from '@myapp-services/shopping-list-form.service';

@Component({
  selector: 'app-shopping-list-dialog',
  templateUrl: './shopping-list-dialog.component.html',
  styleUrls: ['./shopping-list-dialog.component.css']
})
export class ShoppingListDialogComponent implements OnInit {

  shoppingListForm: FormGroup;
  dialogType: string;

  constructor(public dialogRef: MatDialogRef<ShoppingListDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data, private shoppingListService: ShoppingListFormService) { }

  ngOnInit() {
    this.dialogTypeCheck();
  }

  dialogTypeCheck() {
    if (this.data.hasOwnProperty("addShoppingList")) {
        this.shoppingListForm = this.data.addShoppingList;
    } else {
        this.shoppingListForm = this.shoppingListService.editShoppingListForm(this.data.editShoppingList);
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

  removeItem(index) {
    (<FormArray>this.shoppingListForm.get('items')).removeAt(index);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
