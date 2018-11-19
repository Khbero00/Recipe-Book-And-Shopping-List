import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

import { ShoppingList } from '@myapp-models/shopping-list.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListFormService {

  constructor() { }

  public addShoppingListForm(): FormGroup {
    return this.getShoppingListFormGroup();
  }

  public editShoppingListForm(shoppingList: ShoppingList): FormGroup {
    let editShoppingListForm = this.getShoppingListFormGroup();

    editShoppingListForm.patchValue({
      id: shoppingList.id, 
      name: shoppingList.name,
    });

    shoppingList.items.forEach(items => {
      (<FormArray>editShoppingListForm.get('items')).push(new FormGroup({
        'id': new FormControl(items.id),
        'name': new FormControl(items.name),
        'quantity': new FormControl(items.quantity)
      }));
    });
    return editShoppingListForm;
  }

  private getShoppingListFormGroup(): FormGroup {
    return new FormGroup({
      'id': new FormControl(0),
      'name': new FormControl(null, Validators.required),
      'items': new FormArray([], Validators.required),
      'userId': new FormControl(null),
      'recipeAdd': new FormControl(false)
    });
  }
}
