import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { HeaderModule } from '../header/header.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListEditComponent } from './shopping-list-edit/shopping-list-edit.component';


@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent,
  ],
  imports: [
      CommonModule,
      RouterModule,
      HeaderModule,
      NgbModule.forRoot(),
      ShoppingListRoutingModule
  ],
})
export class ShoppingListModule { }